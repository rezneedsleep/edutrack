'use client'

import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Users,
  Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function LeaderboardClient({ data }: any) {
  // Use allTime as default, fallback to empty array
  const leaderboard = data?.allTime || data?.weekly || []
  const topThree = leaderboard.slice(0, 3)
  const remaining = leaderboard.slice(3)

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Papan Peringkat</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Kompetisi sehat untuk memotivasi keunggulan akademik.</p>
        </div>
        
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
           <Input 
             placeholder="Cari nama siswa..." 
             className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs rounded-xl shadow-sm focus-visible:ring-[#5483B3]" 
           />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end max-w-4xl mx-auto pt-10">
         {/* Rank 2 */}
         <div className="order-2 md:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center space-y-4 relative shadow-sm hover:shadow-md transition-shadow"
            >
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center border-4 border-[var(--background)] shadow-sm">
                  <Medal className="h-6 w-6 text-slate-500" />
               </div>
               <Avatar className="h-20 w-20 mx-auto border-4 border-slate-200 shadow-sm mt-4">
                  <AvatarImage src={topThree[1]?.image} />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xl">{topThree[1]?.name?.[0]}</AvatarFallback>
               </Avatar>
               <div className="pt-2">
                  <h3 className="font-extrabold text-[var(--foreground)] text-lg truncate px-2">{topThree[1]?.name || '---'}</h3>
                  <Badge className="bg-slate-100 text-slate-600 border-none mt-2 text-[10px] font-bold px-3 py-1">
                    {topThree[1]?.hours || 0} Jam Belajar
                  </Badge>
               </div>
            </motion.div>
         </div>

         {/* Rank 1 */}
         <div className="order-1 md:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-[#5483B3]/10 to-[var(--card)] border-2 border-[#5483B3]/30 rounded-3xl p-8 text-center space-y-5 relative -top-4 md:scale-110 shadow-xl shadow-[#5483B3]/10 z-10"
            >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 bg-amber-400 rounded-full flex items-center justify-center border-4 border-[var(--background)] shadow-md">
                  <Crown className="h-8 w-8 text-amber-700" />
               </div>
               <Avatar className="h-28 w-28 mx-auto border-4 border-amber-400 shadow-md mt-2">
                  <AvatarImage src={topThree[0]?.image} />
                  <AvatarFallback className="bg-amber-50 text-amber-600 font-bold text-3xl">{topThree[0]?.name?.[0]}</AvatarFallback>
               </Avatar>
               <div className="pt-2">
                  <h3 className="font-extrabold text-[var(--foreground)] text-2xl truncate px-2">{topThree[0]?.name || '---'}</h3>
                  <div className="mt-3 inline-block">
                    <Badge className="bg-[#5483B3] hover:bg-[#5483B3] text-white border-none text-[11px] font-bold px-4 py-1.5 shadow-sm">
                      {topThree[0]?.hours || 0} Jam Belajar
                    </Badge>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Rank 3 */}
         <div className="order-3 md:order-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center space-y-4 relative shadow-sm hover:shadow-md transition-shadow"
            >
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 bg-amber-700/20 rounded-full flex items-center justify-center border-4 border-[var(--background)] shadow-sm">
                  <Medal className="h-6 w-6 text-amber-700" />
               </div>
               <Avatar className="h-20 w-20 mx-auto border-4 border-amber-700/20 shadow-sm mt-4">
                  <AvatarImage src={topThree[2]?.image} />
                  <AvatarFallback className="bg-amber-50 text-amber-700 font-bold text-xl">{topThree[2]?.name?.[0]}</AvatarFallback>
               </Avatar>
               <div className="pt-2">
                  <h3 className="font-extrabold text-[var(--foreground)] text-lg truncate px-2">{topThree[2]?.name || '---'}</h3>
                  <Badge className="bg-amber-50 text-amber-700 border-none mt-2 text-[10px] font-bold px-3 py-1">
                    {topThree[2]?.hours || 0} Jam Belajar
                  </Badge>
               </div>
            </motion.div>
         </div>
      </div>

      {/* List */}
      <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-4xl mx-auto shadow-sm overflow-hidden">
         <CardContent className="p-0">
            {remaining.map((student: any, i: number) => {
              const rank = i + 4
              const isMe = student.isCurrentUser
              return (
                <div 
                  key={student.name + rank} 
                  className={`flex items-center justify-between p-4 md:p-6 border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/50 transition-colors ${isMe ? 'bg-[#5483B3]/5' : ''}`}
                >
                   <div className="flex items-center gap-4 md:gap-6">
                      <span className={`text-xl font-extrabold w-8 text-center ${isMe ? 'text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}>#{rank}</span>
                      <Avatar className="h-10 w-10 border border-[var(--border)] shadow-sm">
                         <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-bold">{student.avatar || student.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                         <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                            {student.name}
                            {isMe && <Badge className="bg-[#5483B3] hover:bg-[#5483B3] text-white border-none rounded-md text-[9px] font-bold px-1.5 py-0">SAYA</Badge>}
                         </h4>
                         <p className="text-[11px] font-medium text-[var(--muted-foreground)] mt-0.5">{student.class || 'Siswa'}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-base font-extrabold text-[#5483B3]">{student.hours ?? 0}h</p>
                      <p className="text-[10px] font-semibold text-[var(--muted-foreground)]">Total Belajar</p>
                   </div>
                </div>
              )
            })}
         </CardContent>
      </Card>
    </div>
  )
}
