'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, FileText, Clipboard, UploadCloud, CheckCircle2, 
  AlertCircle, XCircle, Printer, Loader2, ArrowRight, 
  ArrowLeft, Eye, CreditCard, ExternalLink, Calendar, HelpCircle,
  Home, UserCheck, Camera, GraduationCap, TrendingUp, Heart, ShieldAlert, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface PpdbDashboardClientProps {
  initialRegistration: any
  initialBillings: any[]
  initialExams: any[]
  user: any
}

export function PpdbDashboardClient({ 
  initialRegistration, 
  initialBillings, 
  initialExams, 
  user 
}: PpdbDashboardClientProps) {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState<string | null>(null)
  
  const [registration, setRegistration] = useState(initialRegistration || {
    nisn: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    originSchool: '',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    documentKk: '',
    documentAkta: '',
    documentKtpOrtu: '',
    documentFoto: '',
    documentIjazah: '',
    documentRapor: '',
    documentPrestasi: '',
    documentPernyataan: '',
    documentSehat: '',
    documentBebasNarkoba: '',
    documentButaWarna: '',
    status: 'PENDING',
    revisionNotes: '',
    interviewScore: null,
    reportCardScore: null,
    cbtScore: null,
    finalScore: null,
    isPassed: null
  })

  const [billings, setBillings] = useState(initialBillings || [])
  const [isUploadingProof, setIsUploadingProof] = useState(false)

  // Document definitions
  const documentList = [
    { key: 'documentKk', label: 'Kartu Keluarga (KK)', required: true, icon: Home },
    { key: 'documentAkta', label: 'Akta Kelahiran', required: true, icon: FileText },
    { key: 'documentKtpOrtu', label: 'KTP Orang Tua / Wali', required: true, icon: UserCheck },
    { key: 'documentFoto', label: 'Pas Foto Terbaru (Latar Merah/Biru)', required: true, icon: Camera },
    { key: 'documentIjazah', label: 'Ijazah atau Surat Keterangan Lulus (SKL)', required: true, icon: GraduationCap },
    { key: 'documentRapor', label: 'Pindai Nilai Rapor Semester 1-5 (Legalisir)', required: true, icon: TrendingUp },
    { key: 'documentPernyataan', label: 'Surat Pernyataan Orang Tua & Calon Siswa (Meterai)', required: true, icon: FileText },
    { key: 'documentSehat', label: 'Surat Keterangan Sehat Dokter', required: true, icon: Heart },
    { key: 'documentBebasNarkoba', label: 'Surat Bebas Narkoba', required: true, icon: ShieldAlert },
    { key: 'documentButaWarna', label: 'Surat Ket. Bebas Buta Warna (Khusus Rekayasa Perangkat Lunak / RPL)', required: false, icon: Eye },
    { key: 'documentPrestasi', label: 'Sertifikat Prestasi/Hafalan Quran (Optional)', required: false, icon: Trophy },
  ]

  const handleInputChange = (field: string, value: string) => {
    if (['nik', 'nisn', 'fatherPhone', 'motherPhone'].includes(field)) {
      const numericValue = value.replace(/\D/g, '')
      setRegistration({ ...registration, [field]: numericValue })
    } else {
      setRegistration({ ...registration, [field]: value })
    }
  }

  const handleFileUpload = async (field: string, file: File) => {
    setIsUploading(field)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setRegistration(prev => ({ ...prev, [field]: data.url }))
      toast.success(`${documentList.find(d => d.key === field)?.label} berhasil diunggah!`)
    } catch (err) {
      toast.error("Gagal mengunggah berkas. Silakan coba lagi.")
    } finally {
      setIsUploading(null)
    }
  }

  const saveRegistration = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration)
      })
      if (res.ok) {
        const data = await res.json()
        setRegistration(data)
        toast.success("Biodata pendaftaran berhasil disimpan!")
      } else {
        toast.error("Gagal menyimpan pendaftaran.")
      }
    } catch (err) {
      toast.error("Kesalahan jaringan.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleProofUpload = async (billingId: string, file: File) => {
    setIsUploadingProof(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error("Upload failed")
      const uploadData = await res.json()

      // Save proof url to billing
      const billRes = await fetch(`/api/student/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingId, proofUrl: uploadData.url })
      })

      if (billRes.ok) {
        toast.success("Bukti pembayaran berhasil dikirim!")
        router.refresh()
      } else {
        throw new Error("Billing update failed")
      }
    } catch (err) {
      toast.error("Gagal mengunggah bukti pembayaran.")
    } finally {
      setIsUploadingProof(false)
    }
  }

  const printRegistrationCard = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("KARTU BUKTI PENDAFTARAN PPDB", 105, 20, { align: "center" })
    doc.setFontSize(14)
    doc.text("EDUTRACK ACADEMY / SMKN 13 BANDUNG", 105, 28, { align: "center" })
    
    doc.setLineWidth(0.5)
    doc.line(15, 33, 195, 33)
    
    // Body info
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    
    const details = [
      { label: "Nomor Pendaftaran", val: registration.id || "Draft" },
      { label: "Nama Calon Siswa", val: user.name },
      { label: "Email Pendaftar", val: user.email },
      { label: "NIK", val: registration.nik || "-" },
      { label: "NISN", val: registration.nisn || "-" },
      { label: "Tempat, Tanggal Lahir", val: `${registration.birthPlace || "-"}, ${registration.birthDate ? new Date(registration.birthDate).toLocaleDateString("id-ID") : "-"}` },
      { label: "Asal Sekolah", val: registration.originSchool || "-" },
      { label: "Nama Ayah Kandung", val: registration.fatherName || "-" },
      { label: "Nama Ibu Kandung", val: registration.motherName || "-" },
      { label: "Status Dokumen", val: registration.status === 'VERIFIED' ? 'BERKAS VALID' : 'MENUNGGU VERIFIKASI' }
    ]
    
    let y = 45
    details.forEach(item => {
      doc.setFont("helvetica", "bold")
      doc.text(item.label, 20, y)
      doc.setFont("helvetica", "normal")
      doc.text(`:  ${item.val}`, 75, y)
      y += 10
    })

    // Footer / Sign box
    y += 10
    doc.rect(15, y, 180, 45)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.text("Catatan: Harap bawa kartu pendaftaran ini beserta dokumen asli saat melakukan", 20, y + 8)
    doc.text("verifikasi fisik dan tes wawancara di sekretariat PPDB.", 20, y + 13)
    
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("Panitia PPDB EduTrack", 140, y + 25)
    doc.setFont("helvetica", "normal")
    doc.text("TTD & Cap Basah", 140, y + 38)
    
    doc.save(`KARTU-PPDB-${user.name.toUpperCase().replace(/\s+/g, '-')}.pdf`)
    toast.success("Kartu Pendaftaran berhasil diunduh!")
  }

  // Check if all required fields are filled for stepping
  const isStep1Valid = () => {
    return registration.nisn && registration.nik && registration.birthPlace && 
      registration.birthDate && registration.originSchool && registration.fatherName && 
      registration.motherName
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 p-4 md:p-8">
      {/* Header Panel */}
      <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5483B3] bg-[#5483B3]/10 px-3 py-1 rounded-full">
            Portal Calon Siswa
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] font-serif">
            Dashboard PPDB Anda
          </h1>
          <p className="text-xs text-[#64748B] font-semibold">
            Lengkapi data pendaftaran dan unggah berkas fisik pendaftaran di bawah.
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={printRegistrationCard}
            className="border-[#CBD5E1] text-[#0F172A] font-bold rounded-xl text-xs flex gap-2 h-11"
          >
            <Printer className="h-4 w-4" />
            Cetak Kartu Pendaftaran
          </Button>
        </div>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-3 text-left w-full md:w-auto p-3 rounded-xl transition-all ${activeStep === 1 ? 'bg-[#5483B3]/10 border-l-4 border-[#5483B3]' : 'hover:bg-slate-50'}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 1 ? 'bg-[#5483B3] text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Langkah 1</p>
              <p className="text-[10px] text-[#64748B] font-semibold">Biodata & Orang Tua</p>
            </div>
          </button>
          
          <div className="hidden md:block h-px w-16 bg-slate-200" />

          <button 
            onClick={() => {
              if (isStep1Valid()) {
                setActiveStep(2)
              } else {
                toast.warning("Lengkapi biodata Langkah 1 terlebih dahulu!")
              }
            }}
            className={`flex items-center gap-3 text-left w-full md:w-auto p-3 rounded-xl transition-all ${activeStep === 2 ? 'bg-[#5483B3]/10 border-l-4 border-[#5483B3]' : 'hover:bg-slate-50'}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 2 ? 'bg-[#5483B3] text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Langkah 2</p>
              <p className="text-[10px] text-[#64748B] font-semibold">Unggah Dokumen Scans</p>
            </div>
          </button>

          <div className="hidden md:block h-px w-16 bg-slate-200" />

          <button 
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-3 text-left w-full md:w-auto p-3 rounded-xl transition-all ${activeStep === 3 ? 'bg-[#5483B3]/10 border-l-4 border-[#5483B3]' : 'hover:bg-slate-50'}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 3 ? 'bg-[#5483B3] text-white' : 'bg-slate-100 text-slate-500'}`}>3</div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Langkah 3</p>
              <p className="text-[10px] text-[#64748B] font-semibold">Status Seleksi & Biaya</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Steps Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Active Step Form */}
        <div className="lg:col-span-2 space-y-6">
          {activeStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-6"
            >
              <div className="border-b border-[#F1F5F9] pb-4">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <User className="h-5 w-5 text-[#5483B3]" />
                  Isi Biodata Calon Siswa
                </h3>
                <p className="text-xs text-[#64748B] font-semibold">Lengkapi data pribadi dan informasi asal sekolah Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nik" className="text-xs font-bold">NIK (Nomor Induk Kependudukan)</Label>
                  <Input 
                    id="nik" 
                    placeholder="16-digit NIK sesuai Kartu Keluarga"
                    value={registration.nik || ''} 
                    onChange={e => handleInputChange('nik', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nisn" className="text-xs font-bold">NISN (Nomor Induk Siswa Nasional)</Label>
                  <Input 
                    id="nisn" 
                    placeholder="10-digit NISN aktif"
                    value={registration.nisn || ''} 
                    onChange={e => handleInputChange('nisn', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-xs font-bold">Tempat Lahir</Label>
                  <Input 
                    id="birthPlace" 
                    placeholder="Contoh: Bandung"
                    value={registration.birthPlace || ''} 
                    onChange={e => handleInputChange('birthPlace', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-xs font-bold">Tanggal Lahir</Label>
                  <Input 
                    id="birthDate" 
                    type="date"
                    value={registration.birthDate ? new Date(registration.birthDate).toISOString().split('T')[0] : ''} 
                    onChange={e => handleInputChange('birthDate', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="originSchool" className="text-xs font-bold">Sekolah Asal (SMP / MTs)</Label>
                  <Input 
                    id="originSchool" 
                    placeholder="Masukkan nama lengkap sekolah asal Anda"
                    value={registration.originSchool || ''} 
                    onChange={e => handleInputChange('originSchool', e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-[#F1F5F9] pt-6 pb-4">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#5483B3]" />
                  Informasi Orang Tua / Wali
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-xs font-bold">Nama Lengkap Ayah Kandung</Label>
                  <Input 
                    id="fatherName" 
                    placeholder="Nama ayah kandung"
                    value={registration.fatherName || ''} 
                    onChange={e => handleInputChange('fatherName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherOccupation" className="text-xs font-bold">Pekerjaan Ayah</Label>
                  <Input 
                    id="fatherOccupation" 
                    placeholder="Pekerjaan ayah"
                    value={registration.fatherOccupation || ''} 
                    onChange={e => handleInputChange('fatherOccupation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherPhone" className="text-xs font-bold">Nomor WhatsApp/Telepon Ayah</Label>
                  <Input 
                    id="fatherPhone" 
                    placeholder="081xxxxxxxxxx"
                    value={registration.fatherPhone || ''} 
                    onChange={e => handleInputChange('fatherPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName" className="text-xs font-bold">Nama Lengkap Ibu Kandung</Label>
                  <Input 
                    id="motherName" 
                    placeholder="Nama ibu kandung"
                    value={registration.motherName || ''} 
                    onChange={e => handleInputChange('motherName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherOccupation" className="text-xs font-bold">Pekerjaan Ibu</Label>
                  <Input 
                    id="motherOccupation" 
                    placeholder="Pekerjaan ibu"
                    value={registration.motherOccupation || ''} 
                    onChange={e => handleInputChange('motherOccupation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherPhone" className="text-xs font-bold">Nomor WhatsApp/Telepon Ibu</Label>
                  <Input 
                    id="motherPhone" 
                    placeholder="081xxxxxxxxxx"
                    value={registration.motherPhone || ''} 
                    onChange={e => handleInputChange('motherPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  onClick={saveRegistration} 
                  disabled={isSaving}
                  className="bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl h-11 text-xs gap-2 px-6"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Biodata"}
                </Button>
                <Button 
                  onClick={() => {
                    if (isStep1Valid()) {
                      saveRegistration()
                      setActiveStep(2)
                    } else {
                      toast.warning("Harap lengkapi semua isian biodata wajib!")
                    }
                  }}
                  className="bg-[#5483B3] hover:bg-[#4070A0] text-white rounded-xl h-11 text-xs gap-2 px-6"
                >
                  Unggah Berkas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-6"
            >
              <div className="border-b border-[#F1F5F9] pb-4">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-[#5483B3]" />
                  Unggah Berkas Persyaratan Administrasi
                </h3>
                <p className="text-xs text-[#64748B] font-semibold">Unggah dokumen digital berformat PDF atau Gambar (Maksimal 5MB per file).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentList.map((doc) => {
                  const IconComponent = doc.icon
                  const fileUrl = registration[doc.key]
                  const isUploaded = !!fileUrl

                  return (
                    <div 
                      key={doc.key} 
                      className={`flex flex-col justify-between p-5 border rounded-2xl transition-all duration-300 relative group hover:shadow-lg hover:-translate-y-1 ${
                        isUploaded 
                          ? 'border-green-100 bg-green-50/10 hover:bg-green-50/20' 
                          : 'border-slate-200 bg-white hover:border-[#5483B3]'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isUploaded 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-500 group-hover:bg-[#5483B3]/10 group-hover:text-[#5483B3]'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Label className="text-xs font-black text-slate-800 truncate block max-w-full">{doc.label}</Label>
                              {doc.required ? (
                                <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full shrink-0">Wajib</span>
                              ) : (
                                <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">Opsional</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Unggah berkas dalam format PDF/JPG/PNG (Maks 5MB)</p>
                          </div>
                        </div>

                        {/* File status & display info */}
                        {isUploaded && (
                          <div className="flex items-center gap-2 bg-green-50/50 border border-green-100 p-2.5 rounded-xl text-green-700">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                            <span className="text-[10px] font-bold truncate">Terunggah: {fileUrl.split('/').pop()?.substring(0, 20)}...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2.5 mt-4 pt-4 border-t border-slate-50">
                        {isUploaded && (
                          <Button asChild size="sm" variant="outline" className="border-slate-200 h-9 rounded-xl text-xs gap-1.5 px-3 bg-white hover:bg-slate-50">
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-3.5 w-3.5" />
                              Pratinjau
                            </a>
                          </Button>
                        )}

                        <div className="relative">
                          <input 
                            type="file" 
                            id={`file-${doc.key}`}
                            className="hidden" 
                            accept="image/*,application/pdf"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(doc.key, file)
                            }}
                          />
                          <Button 
                            type="button"
                            variant={isUploaded ? "outline" : "default"}
                            disabled={isUploading !== null}
                            className={`h-9 rounded-xl text-xs gap-1.5 px-4 font-bold transition-all ${
                              isUploaded 
                                ? 'border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/5 bg-white' 
                                : 'bg-[#1E293B] hover:bg-[#0F172A] text-white hover:shadow-md hover:shadow-slate-300'
                            }`}
                            onClick={() => document.getElementById(`file-${doc.key}`)?.click()}
                          >
                            {isUploading === doc.key ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <UploadCloud className="h-3.5 w-3.5" />
                                {isUploaded ? "Ganti Berkas" : "Unggah Berkas"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between pt-6 border-t border-[#F1F5F9]">
                <Button 
                  onClick={() => setActiveStep(1)}
                  variant="outline"
                  className="border-[#CBD5E1] rounded-xl h-11 text-xs gap-2 px-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                <Button 
                  onClick={async () => {
                    await saveRegistration()
                    setActiveStep(3)
                  }}
                  className="bg-[#5483B3] hover:bg-[#4070A0] text-white rounded-xl h-11 text-xs gap-2 px-6"
                >
                  Status Seleksi
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* CBT Exams Panel */}
              <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                <div className="border-b border-[#F1F5F9] pb-4">
                  <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <Clipboard className="h-5 w-5 text-[#5483B3]" />
                    Pelaksanaan Ujian CBT PPDB
                  </h3>
                  <p className="text-xs text-[#64748B] font-semibold">Ikuti jadwal tes/ujian CBT masuk yang telah dijadwalkan oleh panitia PPDB.</p>
                </div>

                {initialExams.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
                    <p className="text-xs text-slate-500 font-semibold">Tidak ada ujian seleksi CBT aktif yang terjadwal saat ini.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {initialExams.map((exam) => {
                      const attempt = exam.attempts?.[0]
                      return (
                        <div key={exam.id} className="flex justify-between items-center p-4 border border-[#F1F5F9] rounded-2xl">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{exam.title}</p>
                            <p className="text-xs text-slate-500">{exam.subject?.name}</p>
                          </div>
                          <div>
                            {attempt ? (
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Selesai</span>
                            ) : (
                              <Button asChild size="sm" className="bg-[#5483B3] hover:bg-[#4070A0]">
                                <Link href={`/dashboard/student/exams`}>
                                  Mulai Ujian
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Reregistration Fee / Billing */}
              {registration.isPassed && (
                <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="border-b border-[#F1F5F9] pb-4">
                    <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#5483B3]" />
                      Tagihan Biaya Daftar Ulang
                    </h3>
                    <p className="text-xs text-[#64748B] font-semibold">Selesaikan pembayaran awal daftar ulang untuk mengamankan kursi Anda.</p>
                  </div>

                  {billings.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-500 font-semibold">Tagihan daftar ulang sedang di-generate oleh bendahara sekolah.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {billings.map((bill) => (
                        <div key={bill.id} className="p-6 border border-[#E2E8F0] rounded-2xl space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-[#0F172A]">{bill.title}</p>
                              <p className="text-xs text-[#64748B] mt-0.5">{bill.description}</p>
                              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                Jatuh Tempo: {new Date(bill.dueDate).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-black text-[#5483B3]">Rp {bill.amount.toLocaleString("id-ID")}</p>
                              <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full mt-2 ${
                                bill.status === 'PAID' ? 'bg-green-50 text-green-600' :
                                bill.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                {bill.status === 'PAID' ? 'LUNAS' : bill.status === 'PENDING' ? 'MENUNGGU KONFIRMASI' : 'BELUM DIBAYAR'}
                              </span>
                            </div>
                          </div>

                          {bill.status === 'UNPAID' && (
                            <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <p className="text-xs text-[#64748B]">Unggah bukti pembayaran berupa gambar/struk bank transfer.</p>
                              <div className="relative">
                                <input 
                                  type="file" 
                                  id={`proof-${bill.id}`} 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={e => {
                                    const file = e.target.files?.[0]
                                    if (file) handleProofUpload(bill.id, file)
                                  }}
                                />
                                <Button 
                                  size="sm"
                                  disabled={isUploadingProof}
                                  onClick={() => document.getElementById(`proof-${bill.id}`)?.click()}
                                  className="bg-[#1E293B] hover:bg-[#0F172A] h-9 text-xs rounded-xl"
                                >
                                  {isUploadingProof ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Unggah Struk Transfer"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Side: Document Status & Scoring summary */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">Status Administrasi</h3>
            
            {/* Status indicators */}
            <div className="flex items-center gap-4">
              {registration.status === 'VERIFIED' ? (
                <div className="flex h-12 w-12 bg-green-50 text-green-600 rounded-full items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : registration.status === 'REVISION' ? (
                <div className="flex h-12 w-12 bg-amber-50 text-amber-600 rounded-full items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
              ) : registration.status === 'REJECTED' ? (
                <div className="flex h-12 w-12 bg-rose-50 text-rose-600 rounded-full items-center justify-center shrink-0">
                  <XCircle className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex h-12 w-12 bg-blue-50 text-blue-600 rounded-full items-center justify-center shrink-0">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              )}
              
              <div>
                <p className="text-xs font-bold text-[#0F172A]">
                  {registration.status === 'VERIFIED' ? "Berkas Administrasi Valid" : 
                   registration.status === 'REVISION' ? "Butuh Revisi Dokumen" :
                   registration.status === 'REJECTED' ? "Pendaftaran Ditolak" : "Berkas Menunggu Peninjauan"}
                </p>
                <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
                  Update terakhir: {new Date(registration.updatedAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            {registration.status === 'REVISION' && registration.revisionNotes && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-[11px] leading-relaxed font-semibold">
                <p className="font-bold mb-1">Catatan Revisi Panitia:</p>
                {registration.revisionNotes}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E2E8F0] p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">Hasil Penilaian & Kelulusan</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B] font-semibold">Nilai Rapor (40%):</span>
                <span className="font-bold text-[#0F172A]">{registration.reportCardScore || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B] font-semibold">Nilai Tes/CBT (30%):</span>
                <span className="font-bold text-[#0F172A]">{registration.cbtScore || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B] font-semibold">Nilai Wawancara (30%):</span>
                <span className="font-bold text-[#0F172A]">{registration.interviewScore || '-'}</span>
              </div>
              <div className="border-t border-[#F1F5F9] pt-3 flex justify-between items-center text-xs font-bold">
                <span className="text-[#0F172A]">Nilai Akhir Kelulusan:</span>
                <span className="text-base font-black text-[#5483B3]">{registration.finalScore?.toFixed(2) || '-'}</span>
              </div>
            </div>

            {/* Selection Status Banner */}
            {registration.isPassed !== null && (
              <div className={`p-4 rounded-2xl text-center font-bold text-xs ${
                registration.isPassed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {registration.isPassed ? "Dinyatakan LULUS Seleksi Utama" : "Belum Lulus Seleksi Utama"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
