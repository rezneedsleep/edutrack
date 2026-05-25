'use client'

import * as React from 'react'
import { motion, Reorder } from 'framer-motion'
import { 
  Plus, BookOpen, GripVertical, Edit2, 
  Trash2, Lock, Unlock, ChevronRight, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function MateriClient({ initialSubjects }: any) {
  const [selectedSubject, setSelectedSubject] = React.useState<any>(null)
  const [topics, setTopics] = React.useState<any[]>([])
  const [isAdding, setIsAdding] = React.useState(false)
  const [newTopic, setNewTopic] = React.useState({ name: '', hours: 2 })

  React.useEffect(() => {
    if (selectedSubject) {
      setTopics(selectedSubject.topics)
    }
  }, [selectedSubject])

  const handleAddTopic = async () => {
    if (!newTopic.name) return
    // Simulated API call
    const topic = {
      id: Math.random().toString(),
      name: newTopic.name,
      estimatedHours: parseInt(newTopic.hours as any) || 2,
      order: topics.length,
      isLocked: false
    }
    setTopics([...topics, topic])
    setNewTopic({ name: '', hours: 2 })
    setIsAdding(false)
    toast.success('Topik ditambahkan')
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-white">Materi Saya</h1>
          <p className="text-white/50 text-lg mt-1">Kelola kurikulum dan topik mata pelajaranmu.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 ml-2">Mata Pelajaran</h3>
          {initialSubjects.map((s: any) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s)}
              className={cn(
                "w-full p-6 rounded-3xl border transition-all text-left group",
                selectedSubject?.id === s.id 
                  ? "bg-primary border-primary shadow-xl shadow-primary/20" 
                  : "bg-[#1C1C1E] border-[#3A3A3C] hover:border-white/20"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", selectedSubject?.id === s.id ? "bg-white/20" : "bg-primary/10")}>
                  <BookOpen className={cn("h-6 w-6", selectedSubject?.id === s.id ? "text-white" : "text-primary")} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className={cn("text-lg font-bold truncate", selectedSubject?.id === s.id ? "text-white" : "text-white")}>{s.name}</h4>
                  <p className={cn("text-xs", selectedSubject?.id === s.id ? "text-white/60" : "text-white/40")}>
                    {s.topics.length} Topik • {s.userSubjects.length} Siswa
                  </p>
                </div>
                <ChevronRight className={cn("h-5 w-5 transition-transform", selectedSubject?.id === s.id ? "text-white" : "text-white/20 group-hover:translate-x-1")} />
              </div>
            </button>
          ))}
        </div>

        {/* Topic Management */}
        <div className="lg:col-span-2">
          {selectedSubject ? (
            <Card className="p-8 rounded-[40px] bg-[#1C1C1E] border-[#3A3A3C] min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">Kelola Topik: {selectedSubject.name}</h3>
                  <p className="text-white/40 text-sm mt-1">Seret topik untuk mengatur urutan materi.</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="rounded-xl bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Topik
                </Button>
              </div>

              {isAdding && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-black/20 border border-primary/30 mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Topik</Label>
                      <Input 
                        value={newTopic.name} 
                        onChange={e => setNewTopic({ ...newTopic, name: e.target.value })}
                        placeholder="Contoh: Ekosistem Laut" 
                        className="bg-black/40 border-white/10" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimasi Jam Belajar</Label>
                      <Input 
                        type="number" 
                        value={Number.isNaN(newTopic.hours) || newTopic.hours === null || newTopic.hours === undefined ? '' : newTopic.hours} 
                        onChange={e => { const val = parseInt(e.target.value); setNewTopic({ ...newTopic, hours: Number.isNaN(val) ? '' as any : val }); }}
                        className="bg-black/40 border-white/10" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setIsAdding(false)}>Batal</Button>
                    <Button onClick={handleAddTopic}>Simpan Topik</Button>
                  </div>
                </motion.div>
              )}

              <Reorder.Group axis="y" values={topics} onReorder={setTopics} className="space-y-3">
                {topics.map((topic) => (
                  <Reorder.Item 
                    key={topic.id} 
                    value={topic}
                    className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-4 cursor-grab active:cursor-grabbing hover:border-white/10 transition-colors"
                  >
                    <div className="h-10 w-10 flex items-center justify-center text-white/20">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-white">{topic.name}</h5>
                      <p className="text-xs text-white/30">{topic.estimatedHours} Jam Pelajaran</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white">
                        {topic.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {topics.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <BookOpen className="h-16 w-16 mb-4" />
                  <p>Belum ada topik untuk mata pelajaran ini.</p>
                </div>
              )}
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-[#3A3A3C] rounded-[40px] opacity-30">
              <BookOpen className="h-20 w-20 mb-6" />
              <h4 className="text-xl font-bold">Pilih Mata Pelajaran</h4>
              <p className="max-w-xs mx-auto mt-2">Pilih mata pelajaran di sebelah kiri untuk mulai mengelola topik materi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
