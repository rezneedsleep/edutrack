import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAiContext } from "./actions"
import { AiDashboardClient } from "./ai-client"

export const metadata = {
  title: "Asisten AI - EduTrack",
  description: "Asisten AI pintar berbasis Google Gemini untuk siswa dan guru di SMKN 13 Bandung.",
}

export default async function AiPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  // Fetch student/teacher specific contexts from the server
  const context = await getAiContext()

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#052659] via-[#0A1E3D] to-[#021024] text-white border border-[#0E3264]/40 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5483B3]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C1E8FF]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#5483B3]/25 border border-[#5483B3]/40 text-[#C1E8FF] uppercase tracking-wider animate-pulse">
            ✨ Powered by Gemini 2.5 Flash
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-[#C1E8FF] to-[#7DA0CA] bg-clip-text text-transparent">
            EduTrack AI Assistant
          </h1>
          <p className="text-[#7DA0CA] text-sm max-w-2xl">
            Asisten pembelajaran & pengajaran pintar terintegrasi dengan database sekolah SMKN 13 Bandung. Memberikan rekomendasi, tanya-jawab mapel, dan penilaian otomatis secara instan.
          </p>
        </div>
      </div>

      {/* Main Client Dashboard */}
      <AiDashboardClient context={context} user={session.user} />
    </div>
  )
}
