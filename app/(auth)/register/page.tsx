'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, User, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistrationDisabled, setIsRegistrationDisabled] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    fetch('/api/auth/register')
      .then(res => res.json())
      .then(data => {
        if (data?.disableRegistration) {
          setIsRegistrationDisabled(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Pendaftaran berhasil! Silakan login.')
        router.push('/login')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal mendaftar. Email mungkin sudah digunakan.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistrationDisabled) {
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
            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Mulai Perjalanan<br />
              Belajar Anda.
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-md leading-relaxed">
              Bergabunglah dengan ekosistem pendidikan digital terlengkap. Pantau progres, kelola tugas, dan tingkatkan performa akademik.
            </p>
          </div>
  
          <div className="relative z-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/60">
            <span>Keamanan Data Terjamin</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>
        </div>
  
        {/* Right side - Disabled Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="inline-flex h-16 w-16 bg-rose-100 text-rose-600 rounded-full items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Pendaftaran Ditutup</h2>
            <p className="text-[var(--muted-foreground)] font-medium text-sm leading-relaxed">
              Pendaftaran akun baru saat ini sedang dinonaktifkan oleh administrator sistem.
              Silakan hubungi administrator sekolah Anda untuk mendapatkan akun akses.
            </p>
            <Button asChild className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl shadow-md">
              <Link href="/login">Kembali ke Halaman Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
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
              Mulai Perjalanan<br />
              Belajar Anda.
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-md leading-relaxed">
              Bergabunglah dengan ekosistem pendidikan digital terlengkap. Pantau progres, kelola tugas, dan tingkatkan performa akademik.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-8 mt-12 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 inline-flex">
            <div className="space-y-1">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Siswa Aktif</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Guru Terdaftar</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/60">
          <span>Keamanan Data Terjamin</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Buat Akun Baru</h2>
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Lengkapi data di bawah ini untuk bergabung dengan EduTrack.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-[#0F172A]">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-11 h-12 bg-[var(--muted)] border-transparent focus:bg-white focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 rounded-xl transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-[#0F172A]">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@sekolah.sch.id"
                  className="pl-11 h-12 bg-[var(--muted)] border-transparent focus:bg-white focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 rounded-xl transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-[#0F172A]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  className="pl-11 pr-11 h-12 bg-[var(--muted)] border-transparent focus:bg-white focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 rounded-xl transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={8}
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl transition-all group shadow-lg shadow-[#5483B3]/20"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Daftar Sekarang
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

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full h-12 border-[var(--border)] hover:bg-[var(--muted)] text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-slate-700 hover:text-slate-900 shadow-sm"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.92-2.76 3.51-4.51 6.76-4.51z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.91 3.43-8.61z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.24 14.55c-.24-.72-.38-1.49-.38-2.29c0-.8.14-1.57.38-2.29L1.39 6.98C.5 8.79 0 10.83 0 13s.5 4.21 1.39 6.02l3.85-3.47z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1c-3.25 0-5.84-1.75-6.76-4.51L1.39 17.3C3.37 21.19 7.35 23 12 23z"
                />
              </svg>
              Daftar dengan Google
            </Button>

            <p className="text-center text-xs font-medium text-[var(--muted-foreground)] mt-8">
              Sudah punya akun? <Link href="/login" className="font-bold text-[#5483B3] hover:underline">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
