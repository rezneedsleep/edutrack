'use client'

import { motion } from 'framer-motion'
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export function ReportsClient({ subjects, logs }: any) {
  const totalMinutes = logs?.reduce((acc: number, log: any) => acc + log.duration, 0) || 0
  const totalHours = (totalMinutes / 60).toFixed(1)
  const avgDifficulty = logs?.length > 0 ? (logs.reduce((acc: number, log: any) => acc + log.difficulty, 0) / logs.length).toFixed(1) : 0

  const handleExport = () => {
    window.print()
  }

  return (
    <div className="space-y-8 print:p-0 pb-20">
      <style jsx global>{`
        @media print {
          aside, nav, .top-bar, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-area {
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          .card {
            border: 1px solid #eee !important;
            break-inside: avoid;
            box-shadow: none !important;
          }
        }
      `}</style>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:mb-8 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Laporan Belajar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Data historis performa akademik dan ringkasan aktivitas Anda.</p>
        </div>
        
        <Button 
          onClick={handleExport}
          className="bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] rounded-xl font-bold h-11 px-6 group no-print shadow-sm transition-all"
        >
          <Download className="mr-2 h-4 w-4 text-[#5483B3] group-hover:-translate-y-0.5 transition-transform" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Total Durasi', value: `${totalHours} Jam`, icon: Clock, desc: 'Akumulasi seluruh sesi' },
          { label: 'Sesi Selesai', value: logs?.length || 0, icon: CheckCircle2, desc: 'Total log tersimpan' },
          { label: 'Tingkat Fokus', value: `${(100 - (Number(avgDifficulty) * 10)).toFixed(0)}%`, icon: TrendingUp, desc: 'Berdasarkan kesulitan' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <stat.icon className="h-20 w-20 text-[#5483B3]" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="h-12 w-12 bg-[#5483B3]/10 rounded-xl flex items-center justify-center mb-4">
                  <stat.icon className="h-6 w-6 text-[#5483B3]" />
                </div>
                <h3 className="text-3xl font-extrabold text-[var(--foreground)] mb-1">{stat.value}</h3>
                <p className="text-xs font-bold text-[var(--foreground)] mb-1">{stat.label}</p>
                <p className="text-[11px] font-medium text-[var(--muted-foreground)]">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="bg-[var(--muted)]/30 border-b border-[var(--border)] pb-4">
             <CardTitle className="text-sm font-bold text-[var(--foreground)]">Ringkasan Per Mata Pelajaran</CardTitle>
             <p className="text-xs text-[var(--muted-foreground)] font-medium">Distribusi waktu dan pencapaian tiap subjek.</p>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow className="border-[var(--border)] hover:bg-transparent bg-[var(--muted)]/10">
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)] py-3">Mata Pelajaran</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)] py-3">Total Durasi</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)] py-3">Jumlah Sesi</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)] py-3">Avg. Kesulitan</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)] py-3 text-right">Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {subjects?.map((sub: any) => {
                       const subLogs = logs?.filter((l: any) => l.topic.subjectId === sub.subjectId) || []
                       const subMinutes = subLogs.reduce((acc: number, l: any) => acc + l.duration, 0)
                       const subHours = (subMinutes / 60).toFixed(1)
                       const subDiff = subLogs.length > 0 ? (subLogs.reduce((acc: number, l: any) => acc + l.difficulty, 0) / subLogs.length).toFixed(1) : '-'
  
                       return (
                         <TableRow key={sub.id} className="border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors">
                            <TableCell className="font-bold text-[var(--foreground)] text-sm">{sub.subject.name}</TableCell>
                            <TableCell className="font-medium text-[var(--muted-foreground)] text-sm">{subHours} Jam</TableCell>
                            <TableCell className="font-medium text-[var(--muted-foreground)] text-sm">{subLogs.length} Sesi</TableCell>
                            <TableCell className="font-medium text-[var(--muted-foreground)] text-sm">
                              {subDiff !== '-' ? (
                                <div className="flex items-center gap-1">
                                  <span>{subDiff}</span>
                                  <span className="text-[10px]">/ 5</span>
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                               <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E]">
                                 Aktif
                               </span>
                            </TableCell>
                         </TableRow>
                       )
                     })}
                     {(!subjects || subjects.length === 0) && (
                       <TableRow>
                         <TableCell colSpan={5} className="text-center py-8 text-[var(--muted-foreground)] font-medium text-sm">
                           Belum ada data mata pelajaran yang tercatat.
                         </TableCell>
                       </TableRow>
                     )}
                  </TableBody>
               </Table>
             </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
           <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-full">
              <CardHeader className="border-b border-[var(--border)] pb-4">
                 <CardTitle className="text-sm font-bold text-[var(--foreground)]">Catatan Akademik Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 {logs?.filter((l: any) => l.notes).slice(0, 3).map((log: any, i: number) => (
                   <div key={i} className="p-4 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                         <p className="text-xs font-bold text-[#5483B3]">{log.topic.subject.name}</p>
                         <p className="text-[10px] font-medium text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] px-2 py-0.5 rounded-md">
                           {new Date(log.loggedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </p>
                      </div>
                      <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">"{log.notes}"</p>
                   </div>
                 ))}
                 
                 {(!logs || logs.filter((l: any) => l.notes).length === 0) && (
                   <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--muted)]/10">
                      <FileBarChart className="h-6 w-6 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium text-[var(--muted-foreground)]">Belum ada catatan log belajar.</p>
                   </div>
                 )}
              </CardContent>
           </Card>
         </motion.div>
         
         <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
           <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-full">
              <CardHeader className="border-b border-[var(--border)] pb-4">
                 <CardTitle className="text-sm font-bold text-[var(--foreground)]">Rangkuman Mingguan</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center p-6">
                 <div className="text-center p-8 bg-[var(--muted)]/20 border border-dashed border-[var(--border)] rounded-xl w-full">
                    <BarChart3 className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3 opacity-40" />
                    <p className="text-xs font-bold text-[var(--foreground)] mb-1">Visualisasi Data</p>
                    <p className="text-[11px] font-medium text-[var(--muted-foreground)]">Grafik progres mingguan sedang diproses.</p>
                 </div>
              </CardContent>
           </Card>
         </motion.div>
      </div>
    </div>
  )
}
