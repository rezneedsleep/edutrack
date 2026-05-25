import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  console.log("Proxy executing for:", nextUrl.pathname)
  const isLoggedIn = !!req.auth
  const email = req.auth?.user?.email
  const role = (req.auth?.user as any)?.role

  // Pass current path to headers so layout can read it
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-url', nextUrl.pathname)

  // 1. Exclude auth endpoints from demo restriction checks
  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // 2. Block any database modifications (POST, PUT, DELETE, PATCH) for the demo admin account
  const isDemoAdmin = email === "admin@demo.com"
  const isWriteRequest = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)

  if (isLoggedIn && isDemoAdmin && isWriteRequest) {
    if (nextUrl.pathname === "/api/upload") {
      return NextResponse.json(
        { error: "Aksi tidak diizinkan: Akun demo admin bersifat read-only." },
        { status: 403 }
      )
    }
    return new NextResponse(
      "Aksi tidak diizinkan: Akun demo admin bersifat read-only.",
      { status: 403 }
    )
  }

  // Protect /dashboard routes
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }

    // Admin dashboard routes protection (Allow TEACHER for classes)
    if (nextUrl.pathname.startsWith("/dashboard/admin")) {
      const isAllowedForTeacher = nextUrl.pathname === "/dashboard/admin/classes" || nextUrl.pathname.startsWith("/dashboard/admin/classes/")
      
      if (role !== "ADMIN" && !(role === "TEACHER" && isAllowedForTeacher)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
      }
    }

    // Admin API routes protection
    if (nextUrl.pathname.startsWith("/api/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 })
      }
    }
    
    // Teacher routes protection
    const teacherRoutes = ["/dashboard/materi", "/dashboard/tugas-guru", "/dashboard/siswa-guru"]
    if (teacherRoutes.some(route => nextUrl.pathname.startsWith(route))) {
      if (role !== "TEACHER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
      }
    }
  }

  // Redirect logged in users from /login to /dashboard
  if (nextUrl.pathname === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/api/:path*"]
}
