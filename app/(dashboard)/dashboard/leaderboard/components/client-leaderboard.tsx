'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, Flame, Medal, Crown, Award } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const rankStyles = {
  1: { bg: 'bg-warning/10', border: 'border-warning/30', icon: Crown, color: 'text-warning' },
  2: { bg: 'bg-muted-foreground/10', border: 'border-muted-foreground/30', icon: Medal, color: 'text-muted-foreground' },
  3: { bg: 'bg-warning/10', border: 'border-warning/30', icon: Award, color: 'text-[#CD7F32]' },
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  hours: number
  streak: number
  class: string
  isCurrentUser?: boolean
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isTopThree = entry.rank <= 3
  const style = rankStyles[entry.rank as keyof typeof rankStyles]

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: entry.rank * 0.05 }}
      className={cn('flex items-center gap-4 p-4 rounded-2xl transition-colors', entry.isCurrentUser ? 'bg-primary/5 border border-primary/20' : 'bg-card border border-border', isTopThree && style?.bg, isTopThree && style?.border)}
    >
      <div className="w-10 flex items-center justify-center shrink-0">
        {isTopThree && style ? <style.icon className={cn('h-6 w-6', style.color)} /> : <span className="text-heading-3 font-mono text-muted-foreground">{entry.rank}</span>}
      </div>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={cn('h-10 w-10 rounded-full flex items-center justify-center shrink-0', entry.isCurrentUser ? 'bg-primary' : 'bg-primary/10')}>
          <span className={cn('text-body-sm font-semibold', entry.isCurrentUser ? 'text-primary-foreground' : 'text-primary')}>{entry.avatar}</span>
        </div>
        <div className="min-w-0">
          <p className={cn('text-body-sm font-medium truncate', entry.isCurrentUser ? 'text-primary' : 'text-foreground')}>{entry.name}{entry.isCurrentUser && ' (Kamu)'}</p>
          <p className="text-caption text-muted-foreground">{entry.class}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="flex items-center gap-1 text-body-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" /><span className="font-mono">{entry.hours}j</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-body-sm font-semibold text-foreground">
            <Flame className="h-4 w-4 text-warning" /><span className="font-mono">{entry.streak}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Podium({ data }: { data: LeaderboardEntry[] }) {
  const top3 = data.slice(0, 3)
  const [second, first, third] = [top3[1], top3[0], top3[2]]

  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {second && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-2"><span className="text-heading-3 font-semibold text-muted-foreground">{second.avatar}</span></div>
          <Medal className="h-6 w-6 text-muted-foreground mb-1" />
          <p className="text-body-sm font-medium text-foreground text-center max-w-20 truncate">{second.name}</p>
          <div className="h-24 w-20 bg-muted-foreground/10 rounded-t-xl mt-2 flex items-center justify-center"><span className="text-heading-1 font-bold text-muted-foreground">2</span></div>
        </motion.div>
      )}
      {first && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-warning/10 flex items-center justify-center mb-2 ring-4 ring-warning/30"><span className="text-heading-2 font-semibold text-warning">{first.avatar}</span></div>
          <Crown className="h-8 w-8 text-warning mb-1" />
          <p className="text-body font-semibold text-foreground text-center max-w-24 truncate">{first.name}</p>
          <div className="h-32 w-24 bg-warning/10 rounded-t-xl mt-2 flex items-center justify-center"><span className="text-display-3 font-bold text-warning">1</span></div>
        </motion.div>
      )}
      {third && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-[#CD7F32]/10 flex items-center justify-center mb-2"><span className="text-heading-3 font-semibold text-[#CD7F32]">{third.avatar}</span></div>
          <Award className="h-6 w-6 text-[#CD7F32] mb-1" />
          <p className="text-body-sm font-medium text-foreground text-center max-w-20 truncate">{third.name}</p>
          <div className="h-16 w-20 bg-[#CD7F32]/10 rounded-t-xl mt-2 flex items-center justify-center"><span className="text-heading-1 font-bold text-[#CD7F32]">3</span></div>
        </motion.div>
      )}
    </div>
  )
}

export function LeaderboardClient({ data }: { data: { weekly: LeaderboardEntry[], monthly: LeaderboardEntry[], allTime: LeaderboardEntry[] } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-warning/10 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h1 className="text-heading-1 text-foreground">Leaderboard</h1>
          <p className="text-body text-muted-foreground">Top 10 siswa dengan jam belajar terbanyak</p>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="w-full max-w-md bg-secondary rounded-xl p-1">
          <TabsTrigger value="weekly" className="flex-1 rounded-lg">Mingguan</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 rounded-lg">Bulanan</TabsTrigger>
          <TabsTrigger value="allTime" className="flex-1 rounded-lg">Semua Waktu</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6">
          <Podium data={data.weekly} />
          <div className="space-y-3">{data.weekly.slice(3).map(entry => <LeaderboardRow key={entry.rank} entry={entry} />)}</div>
        </TabsContent>
        <TabsContent value="monthly" className="mt-6">
          <Podium data={data.monthly} />
          <div className="space-y-3">{data.monthly.slice(3).map(entry => <LeaderboardRow key={entry.rank} entry={entry} />)}</div>
        </TabsContent>
        <TabsContent value="allTime" className="mt-6">
          <Podium data={data.allTime} />
          <div className="space-y-3">{data.allTime.slice(3).map(entry => <LeaderboardRow key={entry.rank} entry={entry} />)}</div>
        </TabsContent>
      </Tabs>
    </div>
  )   
}
