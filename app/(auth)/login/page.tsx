'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginMaintenance, setIsLoginMaintenance] = useState(false)

  useEffect(() => {
    // 1. Show toast if redirected due to next-auth error
    if (error === 'AccessDenied' || error === 'Callback') {
      toast.error('Akses ditutup: Halaman login sedang dalam pemeliharaan')
    }

    // 2. Fetch login maintenance status
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.loginMaintenance) {
          setIsLoginMaintenance(true)
        }
      })
      .catch(() => {})
  }, [error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes("pemeliharaan") || result.error.includes("Maintenance")) {
          toast.error('Akses ditutup: Halaman login sedang dalam pemeliharaan')
        } else {
          toast.error('Email atau password salah')
        }
      } else {
        toast.success('Login berhasil! Mengalihkan...')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Left side - App Mockup/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5483B3] to-[#3B6FA0] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <Link href="/" className="relative z-10 block">
          <Image src="/logo.png" alt="EduTrack Logo" width={180} height={46} className="h-10 w-auto brightness-0 invert" />
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Platform Edukasi<br />
              Digital Terpadu.
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-md leading-relaxed">
              Monitoring progres belajar secara real-time, analisis performa otomatis, dan ekosistem pendidikan yang transparan.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-8 mt-12 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 inline-flex">
            <div className="space-y-1">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Siswa Aktif</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Kepuasan</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/60">
          <span>Dipercaya oleh 500+ Institusi</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Selamat Datang</h2>
            <p className="text-[var(--muted-foreground)] font-medium">Masuk ke akun EduTrack Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {isLoginMaintenance && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-xl text-xs font-bold flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 animate-pulse" />
                <p className="leading-relaxed">
                  Halaman login sedang dalam pemeliharaan. Hanya Administrator yang diperkenankan masuk ke sistem.
                </p>
              </div>
            )}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#0F172A]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@sekolah.sch.id"
                    className="pl-11 h-12 bg-[var(--muted)] border-transparent focus:bg-white focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 rounded-xl transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-[#0F172A]">Password</Label>
                  <Link href="#" className="text-xs font-bold text-[#5483B3] hover:underline">Lupa Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 bg-[var(--muted)] border-transparent focus:bg-white focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 rounded-xl transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#0F172A] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="rounded-md border-[var(--border)] data-[state=checked]:bg-[#5483B3] data-[state=checked]:border-[#5483B3]" />
              <label htmlFor="remember" className="text-sm font-medium text-[var(--muted-foreground)] cursor-pointer select-none">Ingat saya untuk 30 hari</label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl transition-all group shadow-lg shadow-[#5483B3]/20"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase">
                <span className="bg-white px-3 text-[var(--muted-foreground)]">Atau</span>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase">
                <span className="bg-white px-3 text-[var(--muted-foreground)]">Coba Akun Demo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-10 text-xs font-bold border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10" onClick={() => { setEmail('admin@demo.com'); setPassword('password123'); }}>Admin</Button>
              <Button type="button" variant="outline" className="h-10 text-xs font-bold border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10" onClick={() => { setEmail('guru@demo.com'); setPassword('password123'); }}>Guru</Button>
              <Button type="button" variant="outline" className="h-10 text-xs font-bold border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10" onClick={() => { setEmail('pelatih@demo.com'); setPassword('password123'); }}>Pelatih</Button>
              <Button type="button" variant="outline" className="h-10 text-xs font-bold border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10" onClick={() => { setEmail('siswa@demo.com'); setPassword('password123'); }}>Siswa</Button>
            </div>

            <p className="text-center text-xs font-medium text-[var(--muted-foreground)] mt-8">
              Belum punya akun? <Link href="/register" className="font-bold text-[#5483B3] hover:underline">Daftar di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
