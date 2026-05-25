'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
    if (error === 'AccessDenied' || error === 'Callback') {
      toast.error('Akses ditutup: Halaman login sedang dalam pemeliharaan')
    }

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-[#FDFCF7] overflow-hidden"
    >
      {/* Left side - App Branding Panel (Slate-Dark themed matching Dribbble look) */}
      <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-1/2 bg-[#1E293B] relative overflow-hidden flex-col justify-between p-12 text-white"
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <Link href="/" className="relative z-10 block">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-[#1E293B]">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">EduTrack</span>
          </div>
        </Link>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] font-serif">
              Platform Edukasi<br />
              Digital Terpadu.
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed">
              Monitoring progres belajar secara real-time, analisis performa otomatis, dan ekosistem pendidikan yang transparan.
            </p>
          </div>
          
          <div className="flex bg-white/5 border border-white/10 p-6 rounded-3xl gap-8 inline-flex">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold font-serif">10K+</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Siswa Aktif</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold font-serif">99%</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Kepuasan</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Dikembangkan oleh Davin Maritza</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFCF7]">
        <motion.div 
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8 bg-white border border-[#E2E8F0] p-8 md:p-10 rounded-3xl shadow-sm"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Selamat Datang</h2>
            <p className="text-xs text-[#64748B] font-semibold">Masuk ke akun EduTrack Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {isLoginMaintenance && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl text-xs font-bold flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 animate-pulse" />
                <p className="leading-relaxed">
                  Halaman login sedang dalam pemeliharaan. Hanya Administrator yang diperkenankan masuk ke sistem.
                </p>
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-[#0F172A]">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@sekolah.sch.id"
                    className="pl-11 h-11 bg-[#F8FAFC] border-[#E2E8F0] focus:bg-white focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/5 rounded-xl transition-all text-xs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-[#0F172A]">Password</Label>
                  <Link href="#" className="text-[10px] font-black uppercase text-[#5483B3] hover:underline">Lupa Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-11 bg-[#F8FAFC] border-[#E2E8F0] focus:bg-white focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/5 rounded-xl transition-all text-xs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1E293B] data-[state=checked]:border-[#1E293B]" />
              <label htmlFor="remember" className="text-xs font-bold text-[#64748B] cursor-pointer select-none">Ingat saya untuk 30 hari</label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#1E293B] hover:bg-[#334155] text-white font-bold rounded-xl transition-all group text-xs gap-2 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase">
                <span className="bg-white px-3 text-[#94A3B8]">Atau</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn('google')}
              className="w-full h-11 border-[#CBD5E1] hover:bg-[#F8FAFC] text-slate-700 hover:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all text-xs"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase">
                <span className="bg-white px-3 text-[#94A3B8]">Coba Akun Demo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Button type="button" variant="outline" className="h-9 text-[10px] font-bold border-[#E2E8F0] hover:bg-[#F8FAFC] text-slate-700 rounded-lg" onClick={() => { setEmail('admin@demo.com'); setPassword('password123'); }}>Admin</Button>
              <Button type="button" variant="outline" className="h-9 text-[10px] font-bold border-[#E2E8F0] hover:bg-[#F8FAFC] text-slate-700 rounded-lg" onClick={() => { setEmail('guru@demo.com'); setPassword('password123'); }}>Guru</Button>
              <Button type="button" variant="outline" className="h-9 text-[10px] font-bold border-[#E2E8F0] hover:bg-[#F8FAFC] text-slate-700 rounded-lg" onClick={() => { setEmail('pelatih@demo.com'); setPassword('password123'); }}>Pelatih</Button>
              <Button type="button" variant="outline" className="h-9 text-[10px] font-bold border-[#E2E8F0] hover:bg-[#F8FAFC] text-slate-700 rounded-lg" onClick={() => { setEmail('siswa@demo.com'); setPassword('password123'); }}>Siswa</Button>
            </div>

            <p className="text-center text-[11px] font-semibold text-[#64748B] mt-6">
              Belum punya akun? <Link href="/register" className="font-bold text-[#1E293B] hover:underline">Daftar di sini</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
