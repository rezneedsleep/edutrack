"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Wallet, CheckCircle, XCircle, PlusCircle, Trash2, Edit, FileText, Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function AdminBillingClient({ students, billings }: { students: any[], billings: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Status Filter
  const [filterStatus, setFilterStatus] = useState("ALL")

  // Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Create Form
  const [formData, setFormData] = useState({
    studentId: "",
    title: "SPP Bulan ",
    description: "",
    amount: "500000",
    dueDate: ""
  })

  // Edit Form
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    description: "",
    amount: "",
    dueDate: "",
    status: ""
  })

  // Filtering
  const filteredBillings = billings.filter(bill => {
    if (filterStatus === "ALL") return true
    return bill.status === filterStatus
  })

  const isAllSelected = filteredBillings.length > 0 && selectedIds.length === filteredBillings.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredBillings.map(b => b.id))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // --- ACTIONS ---

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success("Tagihan berhasil dibuat")
        setOpen(false)
        router.refresh()
      } else toast.error("Gagal membuat tagihan")
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      })
      if (res.ok) {
        toast.success("Tagihan berhasil diperbarui")
        setEditOpen(false)
        router.refresh()
      } else toast.error("Gagal memperbarui tagihan")
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${ids.length} tagihan?`)) return
    try {
      const res = await fetch("/api/admin/billing", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      })
      if (res.ok) {
        toast.success("Tagihan berhasil dihapus")
        setSelectedIds([])
        router.refresh()
      } else toast.error("Gagal menghapus tagihan")
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    }
  }

  const handleVerify = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) {
        toast.success("Status pembayaran diperbarui")
        router.refresh()
      } else toast.error("Gagal memverifikasi")
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)
  }

  // --- EXPORT PDF ---
  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Laporan Data SPP & Tagihan", 14, 20)
    doc.setFontSize(10)
    doc.text(`Dicetak pada: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: idLocale })}`, 14, 28)

    const tableData = filteredBillings.map((bill, index) => [
      index + 1,
      bill.student.name,
      bill.title,
      formatRupiah(bill.amount),
      format(new Date(bill.dueDate), 'dd MMM yyyy', { locale: idLocale }),
      bill.status === 'PAID' ? 'Lunas' : bill.status === 'PENDING' ? 'Proses' : 'Belum Bayar'
    ])

    autoTable(doc, {
      startY: 35,
      head: [['No', 'Siswa', 'Tagihan', 'Nominal', 'Jatuh Tempo', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [84, 131, 179] }
    })

    doc.save(`Laporan_SPP_${Date.now()}.pdf`)
  }

  const openEditModal = (bill: any) => {
    setEditData({
      id: bill.id,
      title: bill.title,
      description: bill.description || "",
      amount: bill.amount.toString(),
      dueDate: new Date(bill.dueDate).toISOString().split('T')[0],
      status: bill.status
    })
    setEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Manajemen Keuangan & SPP</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Kelola tagihan dan verifikasi pembayaran siswa.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportPDF} variant="outline" className="border-[var(--border)] gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white">
                <PlusCircle className="w-4 h-4 mr-2" /> Buat Tagihan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[var(--background)] dark:bg-slate-900 border-[var(--border)] shadow-xl z-50">
              <DialogHeader>
                <DialogTitle>Buat Tagihan Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBill} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Pilih Siswa</Label>
                  <Select value={formData.studentId} onValueChange={v => setFormData({ ...formData, studentId: v })}>
                    <SelectTrigger className="bg-[var(--background)] dark:bg-slate-800">
                      <SelectValue placeholder="Pilih siswa" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--background)] dark:bg-slate-800 border-[var(--border)] z-50">
                      {students.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} - {s.class?.name || "Tanpa Kelas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Judul Tagihan</Label>
                  <Input className="bg-[var(--background)] dark:bg-slate-800" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nominal (Rp)</Label>
                  <Input className="bg-[var(--background)] dark:bg-slate-800" type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Jatuh Tempo</Label>
                  <Input className="bg-[var(--background)] dark:bg-slate-800" type="date" required value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
                <Button type="submit" className="w-full bg-[#5483B3] hover:bg-[#3B6FA0]" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Tagihan"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Modal is defined here but triggered from rows */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-[500px] bg-[var(--background)] dark:bg-slate-900 border-[var(--border)] shadow-xl z-50">
              <DialogHeader>
                <DialogTitle>Edit Tagihan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditBill} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Judul Tagihan</Label>
                  <Input className="bg-[var(--background)] dark:bg-slate-800" required value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nominal (Rp)</Label>
                  <Input className="bg-[var(--background)] dark:bg-slate-800" type="number" required value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Jatuh Tempo</Label>
                  <Input className="bg-[var(--background)] dark:bg-slate-800" type="date" required value={editData.dueDate} onChange={e => setEditData({ ...editData, dueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status Pembayaran</Label>
                  <Select value={editData.status} onValueChange={v => setEditData({ ...editData, status: v })}>
                    <SelectTrigger className="bg-[var(--background)] dark:bg-slate-800">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--background)] dark:bg-slate-800 border-[var(--border)] z-50">
                      <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                      <SelectItem value="PENDING">Proses Verifikasi</SelectItem>
                      <SelectItem value="PAID">Lunas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
        <CardHeader className="border-b border-[var(--border)] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#5483B3]" /> Daftar Tagihan Siswa
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button onClick={() => handleDelete(selectedIds)} variant="destructive" size="sm" className="h-8 gap-2">
                <Trash2 className="h-4 w-4" /> Hapus {selectedIds.length} Terpilih
              </Button>
            )}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] h-8 text-xs bg-[var(--background)]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                <SelectItem value="PENDING">Proses (Menunggu)</SelectItem>
                <SelectItem value="PAID">Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 w-[50px]">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-bold">Siswa</th>
                <th className="px-6 py-4 font-bold">Tagihan</th>
                <th className="px-6 py-4 font-bold">Jatuh Tempo</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredBillings.map((bill) => (
                <tr key={bill.id} className="hover:bg-[var(--muted)]/20 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox 
                      checked={selectedIds.includes(bill.id)}
                      onCheckedChange={() => handleToggleSelect(bill.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[var(--foreground)]">{bill.student.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{bill.student.class?.name || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[var(--foreground)]">{bill.title}</p>
                    <p className="text-xs font-bold text-[#5483B3]">{formatRupiah(bill.amount)}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-[var(--muted-foreground)]">
                    {format(new Date(bill.dueDate), 'dd MMM yyyy', { locale: idLocale })}
                  </td>
                  <td className="px-6 py-4">
                    {bill.status === 'PAID' ? (
                      <Badge className="bg-green-100 text-green-700">Lunas</Badge>
                    ) : bill.status === 'PENDING' ? (
                      <Badge className="bg-yellow-100 text-yellow-700">Proses</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">Belum Bayar</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {bill.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleVerify(bill.id, 'PAID')} title="Setujui Bukti">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleVerify(bill.id, 'UNPAID')} title="Tolak Bukti">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(bill)} title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" onClick={() => handleDelete([bill.id])} title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {bill.status === 'PENDING' && bill.proofUrl && (
                      <a href={bill.proofUrl} target="_blank" rel="noreferrer" className="block mt-2 text-[10px] font-bold text-blue-600 hover:underline">
                        Lihat Bukti
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBillings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    Belum ada tagihan terdaftar sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
