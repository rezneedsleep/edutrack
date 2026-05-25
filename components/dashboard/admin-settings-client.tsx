'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Shield, Globe, School, Bell, Database, Lock, Mail, HardDrive, AlertTriangle, RefreshCw, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function AdminSettingsClient({ initialSettings }: any) {
  const [activeTab, setActiveTab] = useState('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    appName: initialSettings?.appName || 'EduTrack',
    school: initialSettings?.school || '',
    timezone: initialSettings?.timezone || 'Asia/Jakarta',
    maintenanceMode: initialSettings?.maintenanceMode || false,
    disableRegistration: initialSettings?.disableRegistration || false,
    loginMaintenance: initialSettings?.loginMaintenance || false,
    supportEmail: initialSettings?.supportEmail || 'support@edutrack.id',
    backupEnabled: initialSettings?.backupEnabled ?? true,
    securityLog: initialSettings?.securityLog ?? true,
    confirmPassword: '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Pengaturan berhasil diperbarui')
        setFormData(prev => ({ ...prev, confirmPassword: '' }))
      } else {
        const errorText = await res.text()
        toast.error(errorText || 'Gagal memperbarui pengaturan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const menuItems = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'email', label: 'Email Notifications', icon: Bell },
    { id: 'backup', label: 'Backup & Recovery', icon: Database },
  ]

  return (
    <div className="space-y-10 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
          System Control Center
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Pengaturan</h1>
        <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Pusat komando infrastruktur digital dan kebijakan sistem.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="space-y-2">
            {menuItems.map((item) => (
               <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 group font-bold text-sm",
                    activeTab === item.id 
                      ? "bg-[#5483B3] text-white shadow-md" 
                      : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
               >
                  <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-white" : "text-[#5483B3] group-hover:text-[var(--foreground)]")} />
                  <span>{item.label}</span>
               </button>
            ))}
         </div>

         <div className="md:col-span-3 space-y-8">
            <form onSubmit={handleSave}>
               {activeTab === 'general' && (
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                     <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30">
                        <CardTitle className="text-xl font-extrabold tracking-tight">Konfigurasi Dasar</CardTitle>
                        <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Sesuaikan identitas inti platform.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                           <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                              <School className="h-4 w-4 text-[#5483B3]" /> Nama Aplikasi
                           </Label>
                           <Input 
                              value={formData.appName} 
                              onChange={(e) => setFormData({...formData, appName: e.target.value})} 
                              className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] font-bold shadow-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs font-bold text-[var(--foreground)]">Nama Sekolah / Institusi</Label>
                           <Input 
                              value={formData.school} 
                              onChange={(e) => setFormData({...formData, school: e.target.value})} 
                              className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] shadow-sm"
                              placeholder="Isi Nama Sekolah"
                           />
                        </div>

                        <div className="pt-8 mt-8 border-t border-[var(--border)] space-y-5">
                           <div className="flex items-center justify-between p-6 bg-red-50 border border-red-200 rounded-xl">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p className="text-sm font-bold">System Maintenance Mode</p>
                                 </div>
                                 <p className="text-xs text-red-600/80 font-medium">Hanya administrator yang dapat mengakses aplikasi saat aktif.</p>
                              </div>
                              <Switch 
                                 checked={formData.maintenanceMode}
                                 onCheckedChange={(v) => setFormData({...formData, maintenanceMode: v})}
                                 className="data-[state=checked]:bg-red-500" 
                              />
                           </div>

                           <div className="flex items-center justify-between p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 text-amber-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p className="text-sm font-bold">Login Page Maintenance Mode</p>
                                 </div>
                                 <p className="text-xs text-amber-600/80 font-medium">Blokir akses masuk (login) ke platform untuk seluruh peran non-admin.</p>
                              </div>
                              <Switch 
                                 checked={formData.loginMaintenance}
                                 onCheckedChange={(v) => setFormData({...formData, loginMaintenance: v})}
                                 className="data-[state=checked]:bg-amber-500" 
                              />
                           </div>

                           <div className="flex items-center justify-between p-6 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 text-rose-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p className="text-sm font-bold">Nonaktifkan Registrasi Baru</p>
                                 </div>
                                 <p className="text-xs text-rose-600/80 font-medium">Tutup akses pendaftaran akun baru pada halaman register.</p>
                              </div>
                              <Switch 
                                 checked={formData.disableRegistration}
                                 onCheckedChange={(v) => setFormData({...formData, disableRegistration: v})}
                                 className="data-[state=checked]:bg-rose-500" 
                              />
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {activeTab === 'security' && (
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                     <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30">
                        <CardTitle className="text-xl font-extrabold tracking-tight">Keamanan & Privasi</CardTitle>
                        <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Kebijakan akses dan proteksi data.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-[var(--foreground)]">Audit Log Keamanan</p>
                              <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">Rekam setiap aktivitas login dan perubahan data sensitif.</p>
                           </div>
                           <Switch 
                              checked={formData.securityLog}
                              onCheckedChange={(v) => setFormData({...formData, securityLog: v})}
                              className="data-[state=checked]:bg-[#5483B3]"
                           />
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-[var(--foreground)]">Enkripsi Data Sesi</p>
                              <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">Paksa penggunaan token unik untuk setiap sesi browser.</p>
                           </div>
                           <Switch defaultChecked className="data-[state=checked]:bg-[#5483B3]" />
                        </div>
                        <div className="p-6 bg-[#5483B3]/5 border border-[#5483B3]/20 rounded-xl flex items-center gap-4">
                           <div className="h-10 w-10 bg-[#5483B3]/10 rounded-lg flex items-center justify-center shrink-0">
                              <Lock className="h-5 w-5 text-[#5483B3]" />
                           </div>
                           <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-medium">
                              Sistem menggunakan standar industri <strong className="text-[var(--foreground)]">AES-256</strong> untuk penyimpanan password. 
                              Keamanan fisik database dikelola secara otomatis oleh provider cloud.
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {activeTab === 'email' && (
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                     <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30">
                        <CardTitle className="text-xl font-extrabold tracking-tight">Notifikasi Email</CardTitle>
                        <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Konfigurasi layanan surat elektronik otomatis.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                           <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                              <Mail className="h-4 w-4 text-[#5483B3]" /> Email Support
                           </Label>
                           <Input 
                              value={formData.supportEmail} 
                              onChange={(e) => setFormData({...formData, supportEmail: e.target.value})} 
                              className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] font-bold shadow-sm"
                              placeholder="support@edutrack.id"
                           />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-[var(--border)] bg-[var(--background)] rounded-xl shadow-sm">
                           <p className="text-sm font-bold text-[var(--foreground)]">Notifikasi Tugas Baru</p>
                           <Switch defaultChecked className="data-[state=checked]:bg-[#5483B3]" />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-[var(--border)] bg-[var(--background)] rounded-xl shadow-sm">
                           <p className="text-sm font-bold text-[var(--foreground)]">Laporan Mingguan Ortu</p>
                           <Switch defaultChecked className="data-[state=checked]:bg-[#5483B3]" />
                        </div>
                     </CardContent>
                  </Card>
               )}

               {activeTab === 'backup' && (
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                     <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30">
                        <CardTitle className="text-xl font-extrabold tracking-tight">Pencadangan Data</CardTitle>
                        <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Manajemen integritas dan pemulihan sistem.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-[var(--foreground)]">Auto Backup (Harian)</p>
                              <p className="text-xs text-[var(--muted-foreground)] font-medium">Cadangkan database setiap jam 00:00 ke cloud storage.</p>
                           </div>
                           <Switch 
                              checked={formData.backupEnabled}
                              onCheckedChange={(v) => setFormData({...formData, backupEnabled: v})}
                              className="data-[state=checked]:bg-[#5483B3]"
                           />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <Button type="button" variant="outline" className="h-12 rounded-xl border-[var(--border)] hover:bg-[var(--muted)] flex items-center justify-center gap-2 font-bold text-xs shadow-sm">
                              <Download className="h-4 w-4 text-[#5483B3]" />
                              <span>Ekspor SQL</span>
                           </Button>
                           <Button type="button" variant="outline" className="h-12 rounded-xl border-[var(--border)] hover:bg-[var(--muted)] flex items-center justify-center gap-2 font-bold text-xs shadow-sm">
                              <RefreshCw className="h-4 w-4 text-[#5483B3]" />
                              <span>Restore Point</span>
                           </Button>
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-[#5483B3]/5 border border-[#5483B3]/20 rounded-xl">
                           <div className="h-12 w-12 bg-[#5483B3]/10 rounded-xl flex items-center justify-center shrink-0">
                              <HardDrive className="h-6 w-6 text-[#5483B3]" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xs font-bold text-[#5483B3]">Status Penyimpanan</p>
                              <p className="text-xs text-[var(--muted-foreground)] font-medium">Tersedia: <strong className="text-[var(--foreground)]">14.2 GB</strong> / Terpakai: <strong className="text-[var(--foreground)]">1.8 GB</strong></p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="w-full md:max-w-md space-y-2">
                     <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#5483B3]" /> Konfirmasi Password Admin
                     </Label>
                     <Input 
                        type="password"
                        required
                        value={formData.confirmPassword} 
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                        className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] font-bold shadow-sm"
                        placeholder="Masukkan password admin Anda"
                     />
                     <p className="text-xs text-[var(--muted-foreground)]">Masukkan password akun admin Anda untuk memverifikasi perubahan sistem ini.</p>
                  </div>
                  <div className="flex justify-end shrink-0">
                     <Button 
                        disabled={isSubmitting} 
                        className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-sm h-12 px-8 transition-all shadow-md gap-2 w-full md:w-auto"
                     >
                        {isSubmitting ? 'Processing...' : 'Simpan Konfigurasi Sistem'}
                        <Save className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </form>
         </div>
      </div>
    </div>
  )
}
