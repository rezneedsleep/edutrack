import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AlertTriangle, HardDrive, Clock, ShieldAlert } from "lucide-react"

export default async function MaintenancePage() {
  const session = await auth()
  const role = (session?.user as any)?.role

  // If user is ADMIN, they can bypass maintenance mode
  // But this page itself is just the view.
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 selection:bg-primary selection:text-white">
      <div className="max-w-3xl w-full">
        <div className="relative">
          <div className="absolute -top-24 -left-20 h-64 w-64 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-24 -right-20 h-64 w-64 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
          
          <div className="space-y-12 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-14 w-14 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-none rotate-3">
                    <ShieldAlert className="h-8 w-8 text-primary" />
                 </div>
                 <div className="h-[2px] w-20 bg-primary/30" />
              </div>
              
              <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-none mb-6">
                Website Under <br />
                <span className="text-primary">Maintenance.</span>
              </h1>
              
              <div className="flex flex-wrap gap-8 items-center text-zinc-500">
                <div className="flex items-center gap-3">
                   <Clock className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest italic">Est. Finish: 4/19/2026</span>
                </div>
                <div className="flex items-center gap-3">
                   <HardDrive className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest italic">Status: Development</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-10 space-y-6 rounded-none backdrop-blur-xl">
               <p className="text-xl font-medium leading-relaxed text-zinc-300">
                 "lagi di development tmen2 — Mohon maaf atas ketidaknyamanannya, kami sedang melakukan optimasi infrastruktur untuk pengalaman belajar yang lebih baik."
               </p>
               <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Updating</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">EduTrack Core v2.4.0</p>
               </div>
            </div>

            <div className="flex justify-start pt-4">
               <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-none blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <button className="relative px-10 h-16 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-none border border-white/10 flex items-center gap-4">
                     Check API Status
                     <AlertTriangle className="h-4 w-4 text-primary" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
