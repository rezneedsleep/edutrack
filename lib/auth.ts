import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { class: true }
        })
        
        let isParentLogin = false
        if (!user) {
          // Attempt to find by NIS for parent login
          user = await prisma.user.findFirst({
            where: { nis: credentials.email as string },
            include: { class: true }
          })
          if (user) {
            isParentLogin = true
          }
        }
        
        if (!user) return null
        if (!user.isActive) throw new Error("Akun kamu disuspend")

        // Check system maintenance and login maintenance modes
        const settings = await prisma.settings.findUnique({
          where: { id: 'global' }
        })

        if (!isParentLogin && user.role !== 'ADMIN' && (settings?.maintenanceMode || settings?.loginMaintenance)) {
          throw new Error("Halaman login sedang dalam pemeliharaan.")
        }
        
        if (isParentLogin) {
          // Parent PIN verification (plain text match)
          const pinValid = credentials.password === user.parentPin
          if (!pinValid) return null
          
          await prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() }
          })

          return {
            id: user.id,
            name: `Orang Tua - ${user.name}`,
            email: user.email,
            role: 'PARENT',
            school: user.school,
            classId: user.classId,
            image: user.image
          }
        }

        if (!user.password) return null
        const passwordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        
        if (!passwordValid) return null
        
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() }
        })
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          school: user.school,
          classId: user.classId,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const settings = await prisma.settings.findUnique({
          where: { id: 'global' }
        })

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string }
        })

        // 1. Google sign-in/registration restrictions
        if (account?.provider === 'google') {
          if (!existingUser && settings?.disableRegistration) {
            return false // Block new user registration via Google
          }
        }

        // 2. Maintenance and Login Maintenance restrictions for all non-admins
        const userRole = existingUser?.role || (user as any).role
        const isAdmin = userRole === 'ADMIN'

        if (!isAdmin && (settings?.maintenanceMode || settings?.loginMaintenance)) {
          return false // Block login
        }

        return true
      } catch (error: any) {
        if (error.message?.includes("Can't reach database server") || error.message?.includes("PrismaClientInitializationError")) {
          console.warn("\x1b[33m⚠️ [Auth SignIn] Database is offline during sign in callback.\x1b[0m")
        } else {
          console.error("Error in NextAuth signIn callback:", error)
        }
        return false
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'STUDENT'
        token.school = (user as any).school
        token.classId = (user as any).classId
        token.image = (user as any).image
      } else if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, school: true, classId: true, image: true }
          })
          if (dbUser) {
            // Keep role as 'PARENT' if the token currently belongs to a parent session
            if (token.role !== 'PARENT') {
              token.role = dbUser.role
            }
            token.school = dbUser.school
            token.classId = dbUser.classId
            token.image = dbUser.image
          }
        } catch (error: any) {
          if (error.message?.includes("Can't reach database server") || error.message?.includes("PrismaClientInitializationError")) {
            console.warn("\x1b[33m⚠️ [Auth JWT] Database is offline. Skipping dbUser enrichment.\x1b[0m")
          } else {
            console.error("Error fetching dbUser in jwt callback:", error)
          }
        }
      }
      
      // Handle session update trigger
      if (trigger === "update" && session) {
        return { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        (session.user as any).school = token.school as string
        (session.user as any).classId = token.classId as string
        (session.user as any).image = token.image as string
      }
      return session
    }
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
})
