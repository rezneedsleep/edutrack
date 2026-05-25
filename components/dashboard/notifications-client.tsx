'use client'

import { motion } from 'framer-motion'
import { 
  Bell, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  Info,
  MoreVertical,
  Check
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function NotificationsClient({ notifications }: any) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT_NEW':
      case 'ASSIGNMENT_DUE': return { icon: AlertCircle, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' }
      case 'ASSIGNMENT_GRADED': return { icon: CheckCircle2, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' }
      case 'ACHIEVEMENT': return { icon: Trophy, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' }
      default: return { icon: Info, color: 'text-[#5483B3]', bg: 'bg-[#5483B3]/10' }
    }
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Notifikasi</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Pembaruan terbaru tentang aktivitas akademik dan tugas Anda.</p>
        </div>
        
        <Button variant="outline" className="border-[var(--border)] text-xs font-semibold rounded-xl gap-2 hover:bg-[#5483B3]/5 hover:text-[#5483B3] hover:border-[#5483B3]/30 transition-all">
           <Check className="h-4 w-4" /> Tandai Semua Dibaca
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((notif: any, i: number) => {
          const config = getIcon(notif.type)
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`bg-[var(--card)] border-[var(--border)] rounded-2xl group hover:shadow-md transition-shadow overflow-hidden relative ${notif.read ? 'opacity-70' : 'shadow-sm'}`}>
                {/* Unread indicator */}
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5483B3]" />
                )}
                
                <CardContent className="p-5 md:p-6 pl-6 md:pl-7">
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className={`h-12 w-12 rounded-2xl shrink-0 ${config.bg} flex items-center justify-center border border-[var(--border)]`}>
                       <config.icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 min-w-0">
                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <h4 className={`text-sm font-bold truncate ${notif.read ? 'text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>{notif.title}</h4>
                          <span className="text-[10px] font-semibold text-[var(--muted-foreground)] shrink-0">{new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                       <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{notif.message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        }) : (
          <div className="text-center py-24 border border-dashed border-[var(--border)] bg-[var(--card)] rounded-2xl shadow-sm">
             <div className="h-16 w-16 bg-[var(--muted)]/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
             </div>
             <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">Belum ada notifikasi</h3>
             <p className="text-xs text-[var(--muted-foreground)] font-medium">Anda sudah melihat semua pembaruan terbaru.</p>
          </div>
        )}
      </div>
    </div>
  )
}
