'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  X,
  Users,
  TrendingUp,
  Clock,
  Flame,
  AlertTriangle,
  ChevronRight,
  Mail,
  BookOpen,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Demo data
const studentsData = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@student.edu',
    image: null,
    class: { name: 'XII IPA 1', grade: 12 },
    weeklyHours: 8.5,
    streak: 7,
    overallProgress: 78,
    status: 'on-track' as const,
    lastActivity: '2 jam lalu',
    subjects: [
      { name: 'Matematika', progress: 85, color: '#0071E3' },
      { name: 'Fisika', progress: 72, color: '#30D158' },
      { name: 'Kimia', progress: 68, color: '#FF9F0A' },
    ],
    recentLogs: [
      { subject: 'Matematika', topic: 'Integral Tentu', duration: 45, date: '2 jam lalu' },
      { subject: 'Fisika', topic: 'Gerak Parabola', duration: 30, date: '5 jam lalu' },
    ],
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti.n@student.edu',
    image: null,
    class: { name: 'XII IPA 1', grade: 12 },
    weeklyHours: 12.3,
    streak: 14,
    overallProgress: 92,
    status: 'ahead' as const,
    lastActivity: '30 menit lalu',
    subjects: [
      { name: 'Matematika', progress: 95, color: '#0071E3' },
      { name: 'Fisika', progress: 88, color: '#30D158' },
      { name: 'Kimia', progress: 92, color: '#FF9F0A' },
    ],
    recentLogs: [
      { subject: 'Kimia', topic: 'Elektrokimia', duration: 60, date: '30 menit lalu' },
      { subject: 'Matematika', topic: 'Aplikasi Integral', duration: 45, date: '2 jam lalu' },
    ],
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi.s@student.edu',
    image: null,
    class: { name: 'XII IPA 1', grade: 12 },
    weeklyHours: 3.2,
    streak: 2,
    overallProgress: 45,
    status: 'lagging' as const,
    lastActivity: '3 hari lalu',
    subjects: [
      { name: 'Matematika', progress: 55, color: '#0071E3' },
      { name: 'Fisika', progress: 38, color: '#30D158' },
      { name: 'Kimia', progress: 42, color: '#FF9F0A' },
    ],
    recentLogs: [
      { subject: 'Matematika', topic: 'Turunan', duration: 30, date: '3 hari lalu' },
    ],
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    email: 'dewi.l@student.edu',
    image: null,
    class: { name: 'XII IPA 1', grade: 12 },
    weeklyHours: 6.8,
    streak: 5,
    overallProgress: 65,
    status: 'on-track' as const,
    lastActivity: '1 hari lalu',
    subjects: [
      { name: 'Matematika', progress: 70, color: '#0071E3' },
      { name: 'Fisika', progress: 62, color: '#30D158' },
      { name: 'Kimia', progress: 63, color: '#FF9F0A' },
    ],
    recentLogs: [
      { subject: 'Fisika', topic: 'Hukum Newton', duration: 45, date: '1 hari lalu' },
      { subject: 'Kimia', topic: 'Termokimia', duration: 30, date: '1 hari lalu' },
    ],
  },
  {
    id: '5',
    name: 'Eko Prasetyo',
    email: 'eko.p@student.edu',
    image: null,
    class: { name: 'XII IPA 2', grade: 12 },
    weeklyHours: 2.1,
    streak: 0,
    overallProgress: 32,
    status: 'lagging' as const,
    lastActivity: '1 minggu lalu',
    subjects: [
      { name: 'Matematika', progress: 40, color: '#0071E3' },
      { name: 'Fisika', progress: 28, color: '#30D158' },
      { name: 'Kimia', progress: 30, color: '#FF9F0A' },
    ],
    recentLogs: [
      { subject: 'Matematika', topic: 'Limit Fungsi', duration: 20, date: '1 minggu lalu' },
    ],
  },
]

const statusConfig = {
  'on-track': { label: 'On Track', className: 'bg-success/10 text-success' },
  lagging: { label: 'Lagging', className: 'bg-warning/10 text-warning' },
  ahead: { label: 'Ahead', className: 'bg-primary/10 text-primary' },
}

type Student = typeof studentsData[0]

export default function StudentsPage() {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const laggingCount = studentsData.filter((s) => s.status === 'lagging').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-foreground">Siswa Saya</h1>
          <p className="text-body text-muted-foreground mt-1">
            {studentsData.length} siswa terdaftar
          </p>
        </div>
        {laggingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-warning/10 text-warning">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-body-sm font-medium">
              {laggingCount} siswa perlu perhatian
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="ahead">Ahead</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="lagging">Lagging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-card border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground">
                  Siswa
                </th>
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground hidden md:table-cell">
                  Kelas
                </th>
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground">
                  Progress
                </th>
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground hidden lg:table-cell">
                  Jam/Minggu
                </th>
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground hidden lg:table-cell">
                  Streak
                </th>
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-caption font-semibold text-muted-foreground hidden sm:table-cell">
                  Aktivitas Terakhir
                </th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const statusInfo = statusConfig[student.status]
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.image || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-body-sm font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-body-sm font-medium text-foreground">
                            {student.name}
                          </p>
                          <p className="text-caption text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <span className="text-body-sm text-foreground">
                        {student.class.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Progress value={student.overallProgress} className="w-16 h-2" />
                        <span className="text-body-sm font-medium text-foreground font-mono w-10">
                          {student.overallProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-body-sm text-foreground font-mono">
                          {student.weeklyHours}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-warning" />
                        <span className="text-body-sm text-foreground font-mono">
                          {student.streak}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={cn('text-caption', statusInfo.className)}>
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className="text-caption text-muted-foreground">
                        {student.lastActivity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-body text-muted-foreground">
              Tidak ada siswa yang ditemukan
            </p>
          </div>
        )}
      </motion.div>

      {/* Student Detail Sheet */}
      <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedStudent && (
            <>
              <SheetHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-heading-3 font-medium">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-heading-2">
                      {selectedStudent.name}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedStudent.class.name}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="subjects" className="flex-1">Subjects</TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-caption text-muted-foreground">Progress</span>
                      </div>
                      <p className="text-heading-2 font-mono text-foreground">
                        {selectedStudent.overallProgress}%
                      </p>
                    </div>
                    <div className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-caption text-muted-foreground">Jam/Minggu</span>
                      </div>
                      <p className="text-heading-2 font-mono text-foreground">
                        {selectedStudent.weeklyHours}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-4 w-4 text-warning" />
                        <span className="text-caption text-muted-foreground">Streak</span>
                      </div>
                      <p className="text-heading-2 font-mono text-foreground">
                        {selectedStudent.streak} hari
                      </p>
                    </div>
                    <div className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-caption text-muted-foreground">Status</span>
                      </div>
                      <Badge className={cn('mt-1', statusConfig[selectedStudent.status].className)}>
                        {statusConfig[selectedStudent.status].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="rounded-2xl bg-secondary p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-body-sm text-foreground">{selectedStudent.email}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 rounded-xl">
                      Kirim Pesan
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl">
                      Lihat Laporan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="subjects" className="space-y-4">
                  {selectedStudent.subjects.map((subject) => (
                    <div key={subject.name} className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="text-body-sm font-medium text-foreground">
                            {subject.name}
                          </span>
                        </div>
                        <span className="text-body-sm font-semibold text-foreground font-mono">
                          {subject.progress}%
                        </span>
                      </div>
                      <Progress
                        value={subject.progress}
                        className="h-2"
                        style={{
                          '--progress-background': subject.color,
                        } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="activity" className="space-y-3">
                  {selectedStudent.recentLogs.map((log, index) => (
                    <div key={index} className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-body-sm font-medium text-foreground">
                          {log.subject}
                        </span>
                        <span className="text-caption text-muted-foreground">
                          {log.date}      
                        </span>
                      </div>
                      <p className="text-body-sm text-muted-foreground">
                        {log.topic}
                      </p>
                      <p className="text-caption text-muted-foreground mt-1">
                        {log.duration} menit
                      </p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
