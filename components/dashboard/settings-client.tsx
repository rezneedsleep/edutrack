'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Bell, 
  Lock, 
  Save,
  Camera,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

type Category = 'PROFILE' | 'SECURITY' | 'NOTIFICATIONS'

export function SettingsClient({ user }: any) {
  const [activeCategory, setActiveCategory] = useState<Category>('PROFILE')
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
    nis: user?.nis || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Laki-laki',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    streakReminders: true,
    systemAlerts: true,
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Pengaturan berhasil diperbarui!')
      } else {
        toast.error('Gagal memperbarui pengaturan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSaving(false)
    }
  }

  const categories = [
    { id: 'PROFILE', label: 'Profil & Bio', icon: User },
    { id: 'SECURITY', label: 'Keamanan', icon: Lock },
    { id: 'NOTIFICATIONS', label: 'Notifikasi', icon: Bell },
  ]

  return (
    <div className="space-y-10 max-w-5xl pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Pengaturan Akun</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Personalisasi dan kelola informasi akun EduTrack Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
           <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden p-2">
             {categories.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveCategory(item.id as Category)}
                 className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left rounded-xl transition-all relative group ${
                   activeCategory === item.id 
                   ? 'bg-[#5483B3]/10 text-[#5483B3] font-bold' 
                   : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 font-semibold'
                 }`}
               >
                  <item.icon className={`h-4.5 w-4.5 ${activeCategory === item.id ? 'text-[#5483B3]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors'}`} />
                  <span className="text-sm">{item.label}</span>
               </button>
             ))}
             
             <div className="pt-2 mt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-all group font-semibold"
                >
                   <LogOut className="h-4.5 w-4.5 group-hover:-translate-x-1 transition-transform" />
                   <span className="text-sm">Keluar Akun</span>
                </button>
             </div>
           </Card>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeCategory}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -15 }}
               transition={{ duration: 0.2 }}
               className="space-y-6"
             >
                <form onSubmit={handleSave} className="space-y-6">
                   {activeCategory === 'PROFILE' && (
                     <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                        <CardHeader className="border-b border-[var(--border)] pb-4">
                           <CardTitle className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                             <User className="h-5 w-5 text-[#5483B3]" /> Informasi Publik
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6 pt-6">
                           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                              <div className="relative group cursor-pointer shrink-0">
                                 <Avatar className="h-24 w-24 border-4 border-[var(--card)] shadow-md rounded-2xl group-hover:border-[#5483B3]/30 transition-colors bg-[var(--muted)]">
                                    <AvatarImage src={user?.image} className="rounded-2xl object-cover" />
                                    <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] text-3xl font-extrabold rounded-2xl">{user?.name?.[0]}</AvatarFallback>
                                 </Avatar>
                                 <div className="absolute inset-0 bg-[#5483B3]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                    <Camera className="h-6 w-6 text-white" />
                                 </div>
                                 <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#5483B3] rounded-xl flex items-center justify-center text-white shadow-sm border-2 border-[var(--card)] sm:hidden group-hover:hidden">
                                   <Camera className="h-4 w-4" />
                                 </div>
                              </div>
                              <div className="space-y-1.5 text-center sm:text-left flex-1">
                                 <h4 className="font-extrabold text-[var(--foreground)] text-2xl">{user?.name}</h4>
                                 <p className="text-[11px] font-bold text-[var(--muted-foreground)] bg-[var(--muted)] w-fit mx-auto sm:mx-0 px-2.5 py-1 rounded-md">ID: {user?.id}</p>
                                 <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                                   Ini adalah foto yang akan ditampilkan pada profil publik dan forum diskusi Anda. Disarankan menggunakan foto dengan rasio 1:1.
                                 </p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-[var(--border)]">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Nama Lengkap</Label>
                                 <Input 
                                   value={formData.name}
                                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                                   disabled={user?.role !== 'ADMIN'}
                                   className={cn(
                                     "bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]",
                                     user?.role !== 'ADMIN' && "bg-[var(--muted)] opacity-70 cursor-not-allowed"
                                   )}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Alamat Email</Label>
                                 <Input 
                                   value={formData.email}
                                   disabled
                                   className="bg-[var(--muted)] border-[var(--border)] rounded-xl h-11 text-sm opacity-70 cursor-not-allowed"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Institusi / Sekolah</Label>
                                 <Input 
                                   value={formData.school}
                                   onChange={(e) => setFormData({...formData, school: e.target.value})}
                                   disabled={user?.role !== 'ADMIN'}
                                   className={cn(
                                     "bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]",
                                     user?.role !== 'ADMIN' && "bg-[var(--muted)] opacity-70 cursor-not-allowed"
                                   )}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Role Sistem</Label>
                                 <Input 
                                   value={user?.role}
                                   disabled
                                   className="bg-[var(--muted)] border-[var(--border)] rounded-xl h-11 text-sm opacity-70 cursor-not-allowed capitalize"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">{user?.role === 'STUDENT' ? 'NIS' : 'NIP / ID'}</Label>
                                 <Input 
                                   value={formData.nis}
                                   onChange={(e) => setFormData({...formData, nis: e.target.value})}
                                   disabled={user?.role !== 'ADMIN'}
                                   className={cn(
                                     "bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]",
                                     user?.role !== 'ADMIN' && "bg-[var(--muted)] opacity-70 cursor-not-allowed"
                                   )}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Nomor Telepon</Label>
                                 <Input 
                                   value={formData.phone}
                                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                   disabled={user?.role !== 'ADMIN'}
                                   className={cn(
                                     "bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]",
                                     user?.role !== 'ADMIN' && "bg-[var(--muted)] opacity-70 cursor-not-allowed"
                                   )}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Gender</Label>
                                 <Input 
                                   value={formData.gender}
                                   disabled
                                   className="bg-[var(--muted)] border-[var(--border)] rounded-xl h-11 text-sm opacity-70 cursor-not-allowed"
                                 />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Alamat</Label>
                                 <Textarea 
                                   value={formData.address}
                                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                                   disabled={user?.role !== 'ADMIN'}
                                   className={cn(
                                     "bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#5483B3] p-3",
                                     user?.role !== 'ADMIN' && "bg-[var(--muted)] opacity-70 cursor-not-allowed"
                                   )}
                                 />
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                   )}

                   {activeCategory === 'SECURITY' && (
                     <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                        <CardHeader className="border-b border-[var(--border)] pb-4">
                           <CardTitle className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                             <Lock className="h-5 w-5 text-[#5483B3]" /> Kredensial & Keamanan
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6 pt-6">
                           <div className="space-y-5">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-[var(--foreground)]">Password Saat Ini</Label>
                                 <div className="relative">
                                    <Input 
                                       type={showPassword ? 'text' : 'password'}
                                       value={formData.currentPassword}
                                       onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                       className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm pr-10 focus-visible:ring-[#5483B3]"
                                       placeholder="••••••••"
                                    />
                                    <button 
                                       type="button" 
                                       onClick={() => setShowPassword(!showPassword)}
                                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#5483B3] transition-colors"
                                    >
                                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                 <div className="space-y-2">
                                    <Label className="text-xs font-bold text-[var(--foreground)]">Password Baru</Label>
                                    <Input 
                                       type="password"
                                       value={formData.newPassword}
                                       onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                       className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                                       placeholder="••••••••"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs font-bold text-[var(--foreground)]">Konfirmasi Password Baru</Label>
                                    <Input 
                                       type="password"
                                       value={formData.confirmPassword}
                                       onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                       className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                                       placeholder="••••••••"
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="pt-6 border-t border-[var(--border)]">
                              <div className="flex items-center justify-between p-5 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl">
                                 <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-[#5483B3]/10 rounded-xl flex items-center justify-center shrink-0">
                                      <Shield className="h-5 w-5 text-[#5483B3]" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-[var(--foreground)]">Two-Factor Authentication</p>
                                       <p className="text-xs text-[var(--muted-foreground)] mt-1 font-medium">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
                                    </div>
                                 </div>
                                 <Switch className="data-[state=checked]:bg-[#5483B3]" />
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                   )}

                   {activeCategory === 'NOTIFICATIONS' && (
                     <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                        <CardHeader className="border-b border-[var(--border)] pb-4">
                           <CardTitle className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                             <Bell className="h-5 w-5 text-[#5483B3]" /> Konfigurasi Notifikasi
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-6 pt-6">
                           {[
                             { 
                               title: 'Email Reminders', 
                               desc: 'Terima notifikasi tugas dan pengumuman melalui email.',
                               key: 'emailNotifications'
                             },
                             { 
                               title: 'Study Streak Alerts', 
                               desc: 'Peringatan otomatis sebelum streak belajar harian Anda berakhir.',
                               key: 'streakReminders'
                             },
                             { 
                               title: 'System Security Alerts', 
                               desc: 'Notifikasi jika ada aktivitas mencurigakan pada akun.',
                               key: 'systemAlerts'
                             }
                           ].map((item) => (
                             <div key={item.key} className="flex items-center justify-between p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-[#5483B3]/30 transition-colors shadow-sm">
                                <div>
                                   <p className="text-sm font-bold text-[var(--foreground)]">{item.title}</p>
                                   <p className="text-xs text-[var(--muted-foreground)] font-medium mt-1">{item.desc}</p>
                                </div>
                                <Switch 
                                   checked={(formData as any)[item.key]} 
                                   onCheckedChange={(checked) => setFormData({...formData, [item.key]: checked})}
                                   className="data-[state=checked]:bg-[#5483B3]" 
                                />
                             </div>
                           ))}
                        </CardContent>
                     </Card>
                   )}

                   <div className="flex justify-end pt-2">
                      <Button 
                        type="submit"
                        disabled={isSaving}
                        className="h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold px-8 rounded-xl shadow-lg shadow-[#5483B3]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm gap-2"
                      >
                         {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                         <Save className="h-4 w-4" />
                      </Button>
                   </div>
                </form>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
