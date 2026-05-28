'use client'

import { useState } from 'react'
import { 
  Users, CheckCircle2, AlertCircle, XCircle, Search, 
  ExternalLink, Check, RefreshCw, Star, Trophy, Award, 
  ChevronRight, Calendar, Info, Mail, Phone, BookOpen, AlertTriangle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface AdminPpdbClientProps {
  initialRegistrations: any[]
}

export function AdminPpdbClient({ initialRegistrations }: AdminPpdbClientProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReg, setSelectedReg] = useState<any>(null)
  
  // Scoring temporary form
  const [interviewScore, setInterviewScore] = useState('')
  const [reportCardScore, setReportCardScore] = useState('')
  const [cbtScore, setCbtScore] = useState('')
  
  // Status form
  const [statusVal, setStatusVal] = useState('PENDING')
  const [revisionNotes, setRevisionNotes] = useState('')

  const [activeTab, setActiveTab] = useState<'BIODATA' | 'VERIFY' | 'SCORE' | 'SELECTION'>('BIODATA')

  const filtered = registrations.filter(r => 
    r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.nisn?.includes(searchTerm) ||
    r.originSchool?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectReg = (reg: any) => {
    setSelectedReg(reg)
    setInterviewScore(reg.interviewScore?.toString() || '')
    setReportCardScore(reg.reportCardScore?.toString() || '')
    setCbtScore(reg.cbtScore?.toString() || '')
    setStatusVal(reg.status)
    setRevisionNotes(reg.revisionNotes || '')
  }

  const handleVerifySubmit = async () => {
    if (!selectedReg) return
    try {
      const res = await fetch('/api/admin/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          registrationId: selectedReg.id,
          status: statusVal,
          revisionNotes
        })
      })
      if (res.ok) {
        const updated = await res.json()
        setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r))
        setSelectedReg(updated)
        toast.success("Verifikasi dokumen berhasil diperbarui!")
      } else {
        toast.error("Gagal memperbarui verifikasi.")
      }
    } catch (err) {
      toast.error("Kesalahan jaringan.")
    }
  }

  const handleScoreSubmit = async () => {
    if (!selectedReg) return
    try {
      const res = await fetch('/api/admin/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'score',
          registrationId: selectedReg.id,
          interviewScore,
          reportCardScore,
          cbtScore
        })
      })
      if (res.ok) {
        const updated = await res.json()
        setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r))
        setSelectedReg(updated)
        toast.success("Nilai & kalkulasi skor berhasil diperbarui!")
      } else {
        toast.error("Gagal memperbarui nilai.")
      }
    } catch (err) {
      toast.error("Kesalahan jaringan.")
    }
  }

  const handleSelectionSubmit = async (isPassed: boolean) => {
    if (!selectedReg) return
    try {
      const res = await fetch('/api/admin/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'selection',
          registrationId: selectedReg.id,
          isPassed
        })
      })
      if (res.ok) {
        const updated = await res.json()
        setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r))
        setSelectedReg(updated)
        toast.success(`Calon siswa dinyatakan ${isPassed ? 'LULUS' : 'TIDAK LULUS'} seleksi!`);
        if (isPassed) {
          toast.info("Tagihan Biaya Daftar Ulang (Rp 1.500.000) otomatis dibuat untuk calon siswa.");
        }
      } else {
        toast.error("Gagal memperbarui status seleksi.")
      }
    } catch (err) {
      toast.error("Kesalahan jaringan.")
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header section */}
      <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5483B3] bg-[#5483B3]/10 px-3 py-1 rounded-full">
            Modul Panitia & Admin
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] font-serif">
            Manajemen & Kelola PPDB
          </h1>
          <p className="text-xs text-[#64748B] font-semibold">
            Tinjau berkas pendaftaran, input nilai ujian seleksi, wawancara, dan rilis kelulusan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Candidates List */}
        <div className="space-y-4 bg-white border border-[#E2E8F0] p-6 rounded-3xl shadow-sm h-[700px] flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input 
              placeholder="Cari nama, NISN, atau sekolah..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-xs"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                Tidak ada data calon siswa ditemukan.
              </div>
            ) : (
              filtered.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => handleSelectReg(reg)}
                  className={`w-full p-4 text-left border rounded-2xl flex items-center justify-between transition-all ${
                    selectedReg?.id === reg.id 
                      ? 'border-[#5483B3] bg-[#5483B3]/5 shadow-xs' 
                      : 'border-[#F1F5F9] hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#0F172A]">{reg.user?.name}</p>
                    <p className="text-[10px] text-[#64748B] font-semibold">SMP: {reg.originSchool || '-'}</p>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                      reg.status === 'VERIFIED' ? 'bg-green-50 text-green-600' :
                      reg.status === 'REVISION' ? 'bg-amber-50 text-amber-600' :
                      reg.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {reg.status === 'VERIFIED' ? 'VERIFIED' :
                       reg.status === 'REVISION' ? 'REVISION' :
                       reg.status === 'REJECTED' ? 'REJECTED' : 'PENDING'}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReg ? (
            <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              
              {/* Candidate Info Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">{selectedReg.user?.name}</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Pendaftar No: {selectedReg.id}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedReg.isPassed === true ? 'bg-green-50 text-green-600' :
                    selectedReg.isPassed === false ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {selectedReg.isPassed === true ? 'Lulus Seleksi' :
                     selectedReg.isPassed === false ? 'Tidak Lulus' : 'Belum Diputuskan'}
                  </span>
                </div>
              </div>

              {/* Sub tabs for Verify, Score, Selection */}
              <div className="flex gap-2 border-b border-[#F1F5F9] pb-px">
                <button
                  onClick={() => setActiveTab('BIODATA')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 ${
                    activeTab === 'BIODATA' ? 'border-[#5483B3] text-[#5483B3]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Biodata Calon Siswa
                </button>
                <button
                  onClick={() => setActiveTab('VERIFY')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 ${
                    activeTab === 'VERIFY' ? 'border-[#5483B3] text-[#5483B3]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Verifikasi Berkas
                </button>
                <button
                  onClick={() => setActiveTab('SCORE')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 ${
                    activeTab === 'SCORE' ? 'border-[#5483B3] text-[#5483B3]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Penilaian Seleksi
                </button>
                <button
                  onClick={() => setActiveTab('SELECTION')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 ${
                    activeTab === 'SELECTION' ? 'border-[#5483B3] text-[#5483B3]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Status Kelulusan
                </button>
              </div>

              {activeTab === 'BIODATA' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Detail Pribadi Calon Siswa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">NIK (Nomor Induk Kependudukan)</span>
                        <span className="font-bold text-slate-800">{selectedReg.nik || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">NISN (Nomor Induk Siswa Nasional)</span>
                        <span className="font-bold text-slate-800">{selectedReg.nisn || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Tempat & Tanggal Lahir</span>
                        <span className="font-bold text-slate-800">
                          {selectedReg.birthPlace || '-'}, {selectedReg.birthDate ? new Date(selectedReg.birthDate).toLocaleDateString('id-ID') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Sekolah Asal (SMP / MTs)</span>
                        <span className="font-bold text-slate-800">{selectedReg.originSchool || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Jenis Kelamin</span>
                        <span className="font-bold text-slate-800">{selectedReg.user?.gender || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Email Pendaftar</span>
                        <span className="font-bold text-slate-800">{selectedReg.user?.email || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Detail Orang Tua / Wali</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
                        <p className="font-bold text-slate-700 border-b border-slate-100 pb-1">Data Ayah Kandung</p>
                        <div>
                          <span className="text-slate-400 font-semibold block">Nama Lengkap</span>
                          <span className="font-bold text-slate-800">{selectedReg.fatherName || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Pekerjaan</span>
                          <span className="font-bold text-slate-800">{selectedReg.fatherOccupation || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">No Telepon / WA</span>
                          <span className="font-bold text-[#5483B3] flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {selectedReg.fatherPhone || '-'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-slate-700 border-b border-slate-100 pb-1">Data Ibu Kandung</p>
                        <div>
                          <span className="text-slate-400 font-semibold block">Nama Lengkap</span>
                          <span className="font-bold text-slate-800">{selectedReg.motherName || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Pekerjaan</span>
                          <span className="font-bold text-slate-800">{selectedReg.motherOccupation || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">No Telepon / WA</span>
                          <span className="font-bold text-[#5483B3] flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {selectedReg.motherPhone || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'VERIFY' && (
                <div className="space-y-6">
                  {/* Grid of uploaded documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'documentKk', label: 'Kartu Keluarga' },
                      { key: 'documentAkta', label: 'Akta Kelahiran' },
                      { key: 'documentKtpOrtu', label: 'KTP Orang Tua' },
                      { key: 'documentFoto', label: 'Pas Foto' },
                      { key: 'documentIjazah', label: 'Ijazah / SKL' },
                      { key: 'documentRapor', label: 'Nilai Rapor S1-5' },
                      { key: 'documentPernyataan', label: 'Surat Pernyataan' },
                      { key: 'documentSehat', label: 'Keterangan Sehat' },
                      { key: 'documentBebasNarkoba', label: 'Bebas Narkoba' },
                      { key: 'documentButaWarna', label: 'Bebas Buta Warna' },
                      { key: 'documentPrestasi', label: 'Sertifikat Prestasi' },
                    ].map((doc) => {
                      const url = selectedReg[doc.key]
                      return (
                        <div key={doc.key} className="p-4 border border-[#F1F5F9] rounded-2xl flex justify-between items-center bg-slate-50">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{doc.label}</p>
                            <p className="text-[10px] text-slate-500">{url ? 'Tersedia' : 'Belum diunggah'}</p>
                          </div>
                          {url && (
                            <Button asChild size="sm" variant="outline" className="border-slate-200 bg-white h-8 rounded-lg text-xs gap-1">
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Lihat
                              </a>
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Status verify form */}
                  <div className="p-6 bg-slate-50 border border-[#F1F5F9] rounded-3xl space-y-4">
                    <h3 className="text-xs font-bold text-slate-800">Perbarui Status Verifikasi</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="statusVal" className="text-xs font-bold">Status Dokumen</Label>
                        <select
                          id="statusVal"
                          value={statusVal}
                          onChange={e => setStatusVal(e.target.value)}
                          className="w-full h-10 border border-[#E2E8F0] rounded-xl text-xs px-3 bg-white"
                        >
                          <option value="PENDING">Menunggu Peninjauan</option>
                          <option value="VERIFIED">Berkas Valid</option>
                          <option value="REVISION">Revisi Dokumen</option>
                          <option value="REJECTED">Ditolak</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revisionNotes" className="text-xs font-bold">Catatan Revisi / Alasan Tolak</Label>
                        <Input
                          id="revisionNotes"
                          placeholder="Contoh: Lampirkan scan Kartu Keluarga yang terbaru"
                          value={revisionNotes}
                          onChange={e => setRevisionNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button onClick={handleVerifySubmit} className="bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl h-10 text-xs gap-1.5 px-6">
                        <Check className="h-4 w-4" />
                        Simpan Verifikasi
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'SCORE' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="reportCardScore" className="text-xs font-bold">Nilai Rapor Semester 1-5 (40%)</Label>
                      <Input
                        id="reportCardScore"
                        type="number"
                        placeholder="Rata-rata 0-100"
                        value={reportCardScore}
                        onChange={e => setReportCardScore(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cbtScore" className="text-xs font-bold">Nilai CBT / Tes Akademik (30%)</Label>
                      <Input
                        id="cbtScore"
                        type="number"
                        placeholder="Skor 0-100"
                        value={cbtScore}
                        onChange={e => setCbtScore(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interviewScore" className="text-xs font-bold">Nilai Wawancara & Minat (30%)</Label>
                      <Input
                        id="interviewScore"
                        type="number"
                        placeholder="Skor 0-100"
                        value={interviewScore}
                        onChange={e => setInterviewScore(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Skor Akhir Kelulusan Terkalkulasi</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Rumus: (Rapor * 0.4) + (CBT * 0.3) + (Wawancara * 0.3)</p>
                    </div>
                    <span className="text-xl font-black text-[#5483B3] bg-white border border-[#CBD5E1] px-4 py-2 rounded-xl">
                      {selectedReg.finalScore ? selectedReg.finalScore.toFixed(2) : '-'}
                    </span>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={handleScoreSubmit} className="bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl h-10 text-xs gap-1.5 px-6">
                      <RefreshCw className="h-4 w-4" />
                      Kalkulasi & Simpan Skor
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'SELECTION' && (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border border-[#F1F5F9] rounded-3xl space-y-4">
                    <h3 className="text-xs font-bold text-slate-800">Tentukan Keputusan Kelulusan Calon Siswa</h3>
                    <p className="text-[11px] text-[#64748B] font-semibold leading-relaxed">
                      Menyatakan calon siswa Lulus seleksi utama akan secara otomatis membuatkan akun tagihan Pembayaran Daftar Ulang (Rp 1.500.000) yang terhubung dengan akses portal Bendahara Sekolah.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button 
                        onClick={() => handleSelectionSubmit(true)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-11 text-xs gap-1.5 flex-1"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        Luluskan Calon Siswa
                      </Button>
                      <Button 
                        onClick={() => handleSelectionSubmit(false)}
                        variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl h-11 text-xs gap-1.5 flex-1"
                      >
                        <XCircle className="h-4.5 w-4.5" />
                        Nyatakan Tidak Lulus
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] p-12 rounded-3xl shadow-sm text-center space-y-3">
              <Users className="h-10 w-10 text-[#5483B3] mx-auto opacity-80" />
              <h3 className="text-sm font-bold text-[#0F172A]">Detail Calon Siswa</h3>
              <p className="text-[11px] text-[#64748B] font-semibold max-w-sm mx-auto">
                Silakan pilih salah satu nama calon siswa dari daftar sebelah kiri untuk melihat berkas scan, menginput nilai, atau merilis kelulusan.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
