"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, FileText, CheckCircle2, Clock, UploadCloud } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export function ParentBillingClient({ billings, bankSettings }: { billings: any[], bankSettings?: any }) {
  const router = useRouter()
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proofFile) {
      toast.error("Harap pilih file bukti transfer")
      return
    }

    setIsUploading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      )

      const fileExt = proofFile.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filename, proofFile, { upsert: false })

      if (uploadError) {
        console.error(uploadError)
        throw new Error("Gagal mengunggah file ke server storage")
      }

      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filename)
      const finalUrl = publicUrl

      const res = await fetch("/api/parent/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedBill.id, proofUrl: finalUrl })
      })

      if (res.ok) {
        toast.success("Bukti transfer berhasil diunggah!")
        setSelectedBill(null)
        setProofFile(null)
        router.refresh()
      } else {
        toast.error("Gagal menyimpan bukti transfer")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem saat unggah")
    } finally {
      setIsUploading(false)
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)
  }

  const unpaidTotal = billings.filter(b => b.status === "UNPAID").reduce((sum, b) => sum + b.amount, 0)
  const pendingTotal = billings.filter(b => b.status === "PENDING").reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-red-500/5 skew-x-12 translate-x-10 pointer-events-none" />
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Total Tunggakan</p>
                <h3 className="text-3xl font-extrabold text-[var(--foreground)]">{formatRupiah(unpaidTotal)}</h3>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">Segera lunasi tagihan untuk kelancaran administrasi sekolah.</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-yellow-500/5 skew-x-12 translate-x-10 pointer-events-none" />
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Menunggu Verifikasi</p>
                <h3 className="text-3xl font-extrabold text-[var(--foreground)]">{formatRupiah(pendingTotal)}</h3>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">Bukti transfer sedang diperiksa oleh Tata Usaha.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
        <CardHeader className="border-b border-[var(--border)] pb-4">
          <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#5483B3]" /> Rincian Tagihan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {billings.map((bill) => (
              <div key={bill.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--muted)]/50 transition-colors">
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">{bill.title}</h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{bill.description}</p>
                  <p className="text-xs font-medium mt-2 text-red-500">
                    Jatuh Tempo: {format(new Date(bill.dueDate), 'dd MMMM yyyy', { locale: idLocale })}
                  </p>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                  <span className="text-xl font-extrabold text-[var(--foreground)]">{formatRupiah(bill.amount)}</span>
                  
                  {bill.status === 'PAID' ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">Lunas</Badge>
                  ) : bill.status === 'PENDING' ? (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Diproses</Badge>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white" onClick={() => setSelectedBill(bill)}>
                          Bayar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border-[var(--border)] shadow-xl z-50">
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="bg-[var(--muted)] p-4 rounded-lg">
                            <p className="text-sm font-semibold text-[var(--foreground)]">{bill.title}</p>
                            <p className="text-2xl font-extrabold text-[#5483B3]">{formatRupiah(bill.amount)}</p>
                            <hr className="my-3 border-[var(--border)]" />
                            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                              Silakan transfer ke rekening berikut:<br/>
                              <strong>{bankSettings?.bankName || "BCA"} {bankSettings?.bankAccount || "1234567890"} a.n {bankSettings?.bankAccountName || "EduTrack Academy"}</strong>
                            </p>
                          </div>
                          
                          <form onSubmit={handleUploadProof} className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Unggah Bukti Transfer</Label>
                              <Input 
                                type="file"
                                accept="image/*,.pdf"
                                className="bg-white dark:bg-slate-800"
                                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                required 
                              />
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isUploading}>
                              <UploadCloud className="w-4 h-4 mr-2" />
                              {isUploading ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
                            </Button>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}

            {billings.length === 0 && (
              <div className="p-12 text-center text-[var(--muted-foreground)]">
                Tidak ada riwayat tagihan saat ini.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
