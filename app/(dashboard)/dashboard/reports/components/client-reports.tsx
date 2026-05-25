'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  FileText, Download, Mail, Calendar as CalendarIcon,
  BarChart3, BookOpen, TrendingUp, Printer, FileDown, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import type { DateRange } from 'react-day-picker'

const datePresets = [
  { label: 'Minggu ini', value: 'this-week', getDates: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Bulan ini', value: 'this-month', getDates: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: '3 Bulan terakhir', value: 'last-3-months', getDates: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: 'Tahun ini', value: 'this-year', getDates: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) },
]

export function ReportsClient({ initialData }: { initialData: any }) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [preset, setPreset] = React.useState('this-month')
  const [isExporting, setIsExporting] = React.useState(false)
  const reportRef = React.useRef<HTMLDivElement>(null)

  const { stats, subjectDetails, subjectDistribution, monthlyProgress, userName, className, schoolName } = initialData

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const presetConfig = datePresets.find(p => p.value === value)
    if (presetConfig) setDateRange(presetConfig.getDates())
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('PDF akan diunduh. (Simulasi berhasil)')
    setIsExporting(false)
  }

  const handlePrint = () => window.print()

  const handleEmailReport = async () => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('Laporan akan dikirim ke email terdaftar.')
    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-foreground">Laporan</h1>
          <p className="text-body text-muted-foreground mt-1">Lihat dan ekspor laporan progress belajar</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-44 h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {datePresets.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 rounded-xl justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>{format(dateRange.from, 'd MMM', { locale: id })} - {format(dateRange.to, 'd MMM yyyy', { locale: id })}</>
                  ) : format(dateRange.from, 'd MMM yyyy', { locale: id })
                ) : 'Pilih tanggal'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={r => { setDateRange(r); setPreset('custom') }} numberOfMonths={2} />
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Print</Button>
            <Button variant="outline" className="rounded-xl" onClick={handleExportPDF} disabled={isExporting}>
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}PDF
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={handleEmailReport} disabled={isExporting}>
              <Mail className="h-4 w-4 mr-2" />Email
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="bg-secondary rounded-xl p-1">
          <TabsTrigger value="individual" className="rounded-lg"><FileText className="h-4 w-4 mr-2" />Laporan Individual</TabsTrigger>
          <TabsTrigger value="subjects" className="rounded-lg"><BookOpen className="h-4 w-4 mr-2" />Per Mata Pelajaran</TabsTrigger>
          <TabsTrigger value="summary" className="rounded-lg"><BarChart3 className="h-4 w-4 mr-2" />Ringkasan</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Jam Belajar', value: `${stats.totalHours} jam`, icon: TrendingUp },
              { label: 'Topik Selesai', value: stats.completedTopics, icon: BookOpen },
              { label: 'Rata-rata Harian', value: `${stats.avgDailyHours} jam`, icon: BarChart3 },
              { label: 'Streak Terpanjang', value: `${stats.longestStreak} hari`, icon: CalendarIcon },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-3xl bg-card border border-border p-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-caption text-muted-foreground">{stat.label}</p>
                <p className="text-heading-2 text-foreground font-mono">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl bg-card border border-border p-6">
              <h3 className="text-heading-3 text-foreground mb-4">Progress Bulanan (Jam)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    {subjectDetails.map((s: any) => (
                      <Bar key={s.name} dataKey={s.name} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl bg-card border border-border p-6">
              <h3 className="text-heading-3 text-foreground mb-4">Distribusi Jam Belajar</h3>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={subjectDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {subjectDistribution.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(v: number) => [`${v} jam`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {subjectDistribution.map((item: any) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-caption text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {subjectDetails.map((subject: any, index: number) => (
              <motion.div key={subject.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="rounded-3xl bg-card border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
                    <BookOpen className="h-6 w-6" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <h3 className="text-heading-3 text-foreground">{subject.name}</h3>
                    <p className="text-caption text-muted-foreground">{subject.completedTopics}/{subject.totalTopics} topik selesai</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-sm text-muted-foreground">Progress Keseluruhan</span>
                      <span className="text-body-sm font-semibold text-foreground font-mono">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-3" style={{ '--progress-background': subject.color } as React.CSSProperties} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-caption text-muted-foreground">Total Jam Belajar</p>
                      <p className="text-heading-3 text-foreground font-mono">{subject.studyHours}j</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">Rata-rata per Minggu</p>
                      <p className="text-heading-3 text-foreground font-mono">{(subject.studyHours / 4).toFixed(1)}j</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <motion.div ref={reportRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-8 print:p-0 print:border-0 print:rounded-none">
            <div className="text-center mb-8 pb-8 border-b border-border print:border-black">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-heading-1 text-foreground mb-2">Laporan Progress Belajar</h2>
              <p className="text-body text-muted-foreground">{userName} - {className} {schoolName}</p>
              <p className="text-caption text-muted-foreground mt-1">
                Periode: {dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'd MMMM', { locale: id })} - ${format(dateRange.to, 'd MMMM yyyy', { locale: id })}` : 'Semua Waktu'}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Jam Belajar', value: stats.totalHours },
                { label: 'Topik Selesai', value: stats.completedTopics },
                { label: 'Streak Terbaik', value: stats.longestStreak },
                { label: 'Ranking Kelas', value: stats.myRank ? `#${stats.myRank}` : '-' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-secondary">
                  <p className="text-heading-2 font-mono text-foreground">{stat.value}</p>
                  <p className="text-caption text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-heading-3 text-foreground mb-4">Ringkasan Umum</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {userName} memiliki total {stats.totalHours} jam belajar. Rata-rata waktu belajar harian adalah {stats.avgDailyHours} jam. Ranking kelas saat ini adalah #{stats.myRank}. Terus pertahankan semangat belajar!
                </p>
              </div>

              <div>
                <h3 className="text-heading-3 text-foreground mb-4">Progress per Mata Pelajaran</h3>
                <div className="space-y-4">
                  {subjectDetails.map((subject: any) => (
                    <div key={subject.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="text-body-sm text-foreground">{subject.name}</span>
                        </div>
                        <span className="text-body-sm font-mono text-foreground">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" style={{ '--progress-background': subject.color } as React.CSSProperties} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-border print:hidden">
              <Button className="rounded-xl" onClick={handleExportPDF} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />Download PDF
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />Print Laporan
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={handleEmailReport} disabled={isExporting}>
                <Mail className="h-4 w-4 mr-2" />Kirim ke Email
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
