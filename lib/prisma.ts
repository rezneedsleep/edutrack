import { PrismaClient } from "@prisma/client"

// Initialize both clients
const prismaVps = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

const prismaSupabase = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL
    }
  }
})

// Database availability states
let isVpsOffline = false
let lastHealthCheck = 0
const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds

// Check if an error is a database connection/network failure
function isConnectionError(error: any): boolean {
  if (!error) return false
  const msg = error.message || ''
  const code = error.code || ''
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("PrismaClientInitializationError") ||
    msg.includes("initialization") ||
    code === 'P1001' ||
    code === 'P1002' ||
    code === 'P1008' ||
    code === 'P1017'
  )
}

// Periodically check if VPS is back online
async function checkVpsHealth() {
  const now = Date.now()
  if (isVpsOffline && now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
    lastHealthCheck = now
    try {
      // Quick test query
      await prismaVps.$queryRaw`SELECT 1`
      if (isVpsOffline) {
        console.log("\x1b[32m✅ [Database Failover] VPS database is back online. Switching back to VPS.\x1b[0m")
        isVpsOffline = false
      }
    } catch (e) {
      // Still offline
    }
  }
}

// Proxy handler to intercept Prisma model calls and route them dynamically
const prismaProxyHandler: ProxyHandler<any> = {
  get(target, prop: string) {
    // Intercept client-level methods (e.g. $queryRaw, $transaction, $connect, $disconnect)
    if (prop.startsWith('$')) {
      return async function (...args: any[]) {
        await checkVpsHealth()
        const client = isVpsOffline ? prismaSupabase : prismaVps
        try {
          return await client[prop](...args)
        } catch (error) {
          if (isConnectionError(error) && !isVpsOffline) {
            console.warn(`\x1b[31m⚠️ [Database Failover] client.${prop} failed on VPS. Falling back to Supabase.\x1b[0m`)
            isVpsOffline = true
            return await prismaSupabase[prop](...args)
          }
          throw error
        }
      }
    }

    const model = prismaVps[prop]
    if (model && typeof model === 'object') {
      return new Proxy(model, {
        get(modelTarget, method: string) {
          const vpsMethod = prismaVps[prop][method]
          const supabaseMethod = prismaSupabase[prop][method]

          if (typeof vpsMethod === 'function') {
            return async function (...args: any[]) {
              await checkVpsHealth()

              // Determine if it's a write operation
              const isWrite = [
                'create', 'update', 'delete', 'upsert', 
                'createMany', 'updateMany', 'deleteMany', 
                'connectOrCreate'
              ].includes(method)

              if (isVpsOffline) {
                // VPS is offline: only write/read to Supabase
                return await supabaseMethod.apply(prismaSupabase[prop], args)
              }

              if (isWrite) {
                // VPS is online: do dual-write
                let result
                try {
                  result = await vpsMethod.apply(prismaVps[prop], args)
                } catch (vpsError) {
                  if (isConnectionError(vpsError)) {
                    console.warn(`\x1b[31m⚠️ [Database Failover] Write ${prop}.${method} failed on VPS. Falling back to Supabase.\x1b[0m`)
                    isVpsOffline = true
                    return await supabaseMethod.apply(prismaSupabase[prop], args)
                  }
                  throw vpsError
                }

                // Write to Supabase in parallel/background to keep in sync
                try {
                  await supabaseMethod.apply(prismaSupabase[prop], args)
                } catch (sbError) {
                  console.error(`\x1b[33m⚠️ [Dual-write Sync Error] Failed to write to Supabase for ${prop}.${method}:\x1b[0m`, sbError)
                }
                return result
              } else {
                // VPS is online: read from VPS, fallback to Supabase if it fails
                try {
                  return await vpsMethod.apply(prismaVps[prop], args)
                } catch (error) {
                  if (isConnectionError(error)) {
                    console.warn(`\x1b[31m⚠️ [Database Failover] Read ${prop}.${method} failed on VPS. Falling back to Supabase.\x1b[0m`)
                    isVpsOffline = true
                    return await supabaseMethod.apply(prismaSupabase[prop], args)
                  }
                  throw error
                }
              }
            }
          }
          return vpsMethod
        }
      })
    }

    return prismaVps[prop]
  }
}

const prisma = new Proxy({}, prismaProxyHandler) as unknown as PrismaClient

export default prisma
