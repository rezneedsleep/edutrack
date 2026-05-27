"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CalendarDays, FileCheck, FileX, Paperclip, Clock } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

export function ParentAbsenceClient({ requests }: { requests: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "SICK",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let finalUrl = ""
      if (attachmentFile) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
        )

        const fileExt = attachmentFile.name.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filename, attachmentFile, { upsert: false })

        if (uploadError) {
          console.error(uploadError)
          throw new Error("Gagal mengunggah file lampiran")
        }
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filename)
        finalUrl = publicUrl
      }

      const res = await fetch("/api/parent/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, attachmentUrl: finalUrl })
      })

      if (res.ok) {
        toast.success("Pengajuan izin berhasil dikirim")
        setOpen(false)
        setFormData({ startDate: "", endDate: "", reason: "SICK", description: "" })
        setAttachmentFile(null)
        router.refresh()
      } else {
        toast.error("Gagal mengirim pengajuan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge className="bg-green-100 text-green-700 border-green-200">Disetujui</Badge>
      case 'REJECTED': return <Badge className="bg-red-100 text-red-700 border-red-200">Ditolak</Badge>
      default: return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Menunggu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--foreground)]">Pengajuan Izin Tidak Masuk</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Ajukan surat izin atau keterangan dokter secara digital.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white shadow-md">
              + Buat Pengajuan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border-[var(--border)] shadow-xl z-50">
            <DialogHeader>
              <DialogTitle>Form Pengajuan Izin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#64748B]">Tanggal Mulai</Label>
                  <Input type="date" className="bg-white dark:bg-slate-800" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#64748B]">Tanggal Selesai</Label>
                  <Input type="date" className="bg-white dark:bg-slate-800" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#64748B]">Alasan</Label>
                <Select value={formData.reason} onValueChange={v => setFormData({...formData, reason: v})}>
                  <SelectTrigger className="bg-white dark:bg-slate-800">
                    <SelectValue placeholder="Pilih alasan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SICK">Sakit</SelectItem>
                    <SelectItem value="PERMISSION">Izin Keperluan Lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#64748B]">Keterangan Tambahan</Label>
                <Textarea 
                  required
                  className="bg-white dark:bg-slate-800"
                  placeholder="Jelaskan alasan secara singkat..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Unggah Surat Dokter / Bukti (Opsional)</Label>
                <Input 
                  type="file"
                  accept="image/*,.pdf"
                  className="bg-white dark:bg-slate-800"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
              </div>

              <Button type="submit" className="w-full bg-[#5483B3] hover:bg-[#3B6FA0]" disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Kirim Pengajuan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <Card key={req.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="bg-[var(--muted)] text-[var(--foreground)] border-none">
                  {req.reason === 'SICK' ? '🤒 Sakit' : '📄 Izin'}
                </Badge>
                {getStatusBadge(req.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center text-sm text-[var(--foreground)] font-medium gap-2">
                <CalendarDays className="w-4 h-4 text-[#5483B3]" />
                {format(new Date(req.startDate), 'dd MMM yyyy', { locale: idLocale })} 
                {req.startDate !== req.endDate && ` - ${format(new Date(req.endDate), 'dd MMM yyyy', { locale: idLocale })}`}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] bg-[var(--muted)]/50 p-3 rounded-lg line-clamp-3">
                "{req.description}"
              </p>
              {req.attachmentUrl && (
                <a href={req.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline">
                  <Paperclip className="w-3 h-3 mr-1" /> Lihat Lampiran
                </a>
              )}
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)]/20 rounded-2xl border border-dashed border-[var(--border)]">
            Belum ada riwayat pengajuan izin.
          </div>
        )}
      </div>
    </div>
  )
}
