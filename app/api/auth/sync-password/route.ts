import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { auth } from "@/lib/auth"
import { createClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Since the user just updated their password in Supabase, 
    // they should have a session in Supabase.
    // However, if we're calling this from the Reset Password page, 
    // we can use the email from the Supabase session.
    
    const supabase = await createClient()
    const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser()

    if (supabaseError || !supabaseUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: supabaseUser.email },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Password synced successfully" })
  } catch (error) {
    console.error("Sync password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
