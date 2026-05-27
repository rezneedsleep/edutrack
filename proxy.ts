import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  // console.log("Proxy executing for:", nextUrl.pathname)
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

  // 2. Block any database modifications (POST, PUT, DELETE, PATCH) for all demo accounts
  const isDemoAccount = typeof email === 'string' && (email.endsWith("@demo.com") || ["admin@demo.com", "guru@demo.com", "pelatih@demo.com", "siswa@demo.com"].includes(email))
  const isWriteRequest = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)

  if (isLoggedIn && isDemoAccount && isWriteRequest) {
    return NextResponse.json(
      { error: "Aksi dibatasi: Akun demo ini hanya memiliki akses baca (Read-Only)." },
      { status: 403 }
    )
  }

  // Protect /dashboard routes
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }

    const adminRoles = ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'WAKASEK_KESISWAAN', 'WAKASEK_HUBIN', 'KAPROG', 'KEPALA_LAB', 'TATA_USAHA', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'PANITIA_PPDB', 'STAF_SARPRAS', 'WALI_KELAS', 'GURU_BK', 'ADMIN']
    const normalizedRole = role ? String(role).toUpperCase().replace(/[\s\-]/g, '_') : ''
    const isAuthorizedAdmin = adminRoles.includes(normalizedRole)

    // Admin dashboard routes protection (Allow TEACHER for classes)
    if (nextUrl.pathname.startsWith("/dashboard/admin")) {
      const isAllowedForTeacher = nextUrl.pathname === "/dashboard/admin/classes" || nextUrl.pathname.startsWith("/dashboard/admin/classes/")
      
      if (!isAuthorizedAdmin && !(role === "TEACHER" && isAllowedForTeacher)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
      }
    }

    // Admin API routes protection
    if (nextUrl.pathname.startsWith("/api/admin")) {
      if (!isAuthorizedAdmin) {
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
