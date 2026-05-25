'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Palette, Shield, Camera, Mail, School, GraduationCap, Moon, Sun, Monitor, Clock, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { updateProfile, updatePassword } from '../actions'
import { useRouter } from 'next/navigation'

export function SettingsClient({ initialUser }: { initialUser: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [user, setUser] = React.useState(initialUser)

  const [passwordState, setPasswordState] = React.useState({ current: '', new: '', confirm: '' })
  const [passwordLoading, setPasswordLoading] = React.useState(false)

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await updateProfile(user)
      alert("Profil berhasil diperbarui")
      router.refresh()
    } catch (e: any) {
      alert(e.message || "Gagal memperbarui profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePassword = async () => {
    if (passwordState.new !== passwordState.confirm) {
      alert("Konfirmasi password tidak cocok")
      return
    }
    setPasswordLoading(true)
    try {
      await updatePassword(passwordState.current, passwordState.new)
      alert("Password berhasil diperbarui")
      setPasswordState({ current: '', new: '', confirm: '' })
    } catch (e: any) {
      alert(e.message || "Gagal memperbarui password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-heading-1 text-foreground">Pengaturan</h1>
        <p className="text-body text-muted-foreground mt-1">Kelola akun dan preferensimu</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-secondary rounded-xl p-1 w-full max-w-lg">
          <TabsTrigger value="profile" className="flex-1 rounded-lg"><User className="h-4 w-4 mr-2" />Profil</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 rounded-lg"><Bell className="h-4 w-4 mr-2" />Notifikasi</TabsTrigger>
          <TabsTrigger value="appearance" className="flex-1 rounded-lg"><Palette className="h-4 w-4 mr-2" />Tampilan</TabsTrigger>
          <TabsTrigger value="security" className="flex-1 rounded-lg"><Shield className="h-4 w-4 mr-2" />Keamanan</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-6">
            <h2 className="text-heading-3 text-foreground mb-6">Informasi Profil</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-heading-1 font-semibold text-primary">{user.name.charAt(0)}</span>
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center"><Camera className="h-4 w-4 text-primary-foreground" /></button>
              </div>
              <div>
                <p className="text-body-sm text-muted-foreground">Unggah foto profil baru</p>
                <p className="text-caption text-muted-foreground">JPG, PNG, atau GIF. Maksimal 2MB.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input value={user.email} onChange={e => setUser({...user, email: e.target.value})} type="email" className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Sekolah</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input value={user.school || ''} onChange={e => setUser({...user, school: e.target.value})} className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                {user.role !== 'ADMIN' && (
                  <div className="space-y-2">
                    <Label>{user.role === 'TEACHER' ? 'Spesialisasi Mapel' : 'Kelas'}</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input value={user.classRoom || ''} onChange={e => setUser({...user, classRoom: e.target.value})} className="pl-10 h-12 rounded-xl" />
                    </div>
                  </div>
                )}
              </div>

              <Button className="rounded-xl" onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-6">
            <h2 className="text-heading-3 text-foreground mb-6">Pengaturan Notifikasi</h2>
            <div className="space-y-6">
              {[
                { title: 'Pengingat Belajar', description: 'Terima pengingat sesuai jadwal belajarmu', defaultChecked: true },
                { title: 'Alert dari Guru', description: 'Notifikasi pesan dan tugas dari guru', defaultChecked: true },
                { title: 'Pencapaian', description: 'Notifikasi saat mencapai milestone baru', defaultChecked: true },
                { title: 'Update Leaderboard', description: 'Perubahan peringkat di leaderboard', defaultChecked: false },
                { title: 'Email Ringkasan Mingguan', description: 'Laporan progress mingguan via email', defaultChecked: true },
              ].map(item => (
                <div key={item.title} className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-caption text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <Label>Waktu Pengingat Belajar</Label>
                <Select defaultValue="19:00">
                  <SelectTrigger className="h-12 rounded-xl w-48"><Clock className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['07:00', '08:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-6">
            <h2 className="text-heading-3 text-foreground mb-6">Tampilan</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Bahasa</Label>
                <Select defaultValue="id">
                  <SelectTrigger className="h-12 rounded-xl w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-6">
            <h2 className="text-heading-3 text-foreground mb-6">Ubah Password</h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Password Saat Ini</Label>
                <Input type="password" value={passwordState.current} onChange={e => setPasswordState({...passwordState, current: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <Input type="password" value={passwordState.new} onChange={e => setPasswordState({...passwordState, new: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Konfirmasi Password Baru</Label>
                <Input type="password" value={passwordState.confirm} onChange={e => setPasswordState({...passwordState, confirm: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <Button className="rounded-xl" onClick={handleSavePassword} disabled={passwordLoading || !passwordState.current || !passwordState.new}>
                {passwordLoading ? 'Menyimpan...' : 'Ubah Password'}
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-card border border-border p-6">
            <h2 className="text-heading-3 text-foreground mb-6">Data & Privasi</h2>
            <div className="space-y-4">
              <Button variant="outline" className="rounded-xl"><Download className="h-4 w-4 mr-2" />Ekspor Data Saya</Button>
              <div>
                <Button variant="outline" className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />Hapus Akun
                </Button>
                <p className="text-caption text-muted-foreground mt-2">Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
