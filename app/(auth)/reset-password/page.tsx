'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, Lock, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') || '')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || token.length < 6) {
      return toast.error('Kode verifikasi tidak valid')
    }

    if (password !== confirmPassword) {
      return toast.error('Password tidak cocok')
    }

    if (password.length < 8) {
      return toast.error('Password minimal 8 karakter')
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Password berhasil diperbarui!')
        setTimeout(() => router.push('/login'), 3000)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Gagal mereset password')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-10 text-center animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-green-100">
            <CheckCircle2 className="h-12 w-12 text-[#22C55E]" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">Berhasil!</h2>
          <p className="text-[var(--muted-foreground)] font-medium">Password Anda telah diperbarui. Mengalihkan ke halaman login...</p>
        </div>
        <Button asChild className="w-full h-14 bg-[#5483B3] text-white font-bold rounded-2xl shadow-lg shadow-[#5483B3]/20 transition-all hover:bg-[#3B6FA0]">
          <Link href="/login">Masuk Sekarang</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <div className="inline-block mb-10 group">
          <Image src="/logo.png" alt="EduTrack Logo" width={200} height={50} className="h-12 w-auto brightness-0 dark:invert transition-transform group-hover:scale-105" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">Reset Password</h2>
        <p className="text-[var(--muted-foreground)] font-medium mt-2 text-sm">Buat password baru yang kuat untuk mengamankan akun Anda.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="token" className="text-xs font-bold text-[#0F172A] ml-1 uppercase tracking-widest">Kode Verifikasi (6 Digit)</Label>
          <div className="relative">
            <Input
              id="token"
              type="text"
              maxLength={6}
              placeholder="000000"
              className="h-16 bg-[var(--card)] border-[var(--border)] focus-visible:ring-[#5483B3] rounded-2xl transition-all text-center text-3xl font-bold tracking-[0.4em] placeholder:tracking-normal text-[#5483B3] shadow-sm"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-xs font-bold text-[#0F172A] ml-1">Password Baru</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-12 h-14 bg-[var(--card)] border-[var(--border)] focus-visible:ring-[#5483B3] rounded-2xl transition-all font-medium text-sm shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#0F172A] ml-1">Konfirmasi Password Baru</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-12 pr-12 h-14 bg-[var(--card)] border-[var(--border)] focus-visible:ring-[#5483B3] rounded-2xl transition-all font-medium text-sm shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#0F172A] transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-2xl transition-all group relative overflow-hidden shadow-lg shadow-[#5483B3]/20"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <span className="flex items-center justify-center">
            Simpan Password Baru
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans">
       {/* Immersive Decorative Background */}
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5483B3]/10 rounded-full blur-3xl" />
       <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5483B3]/10 rounded-full blur-2xl" />

      <div className="w-full flex items-center justify-center p-10 relative z-10 bg-[var(--background)]/40 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-[#5483B3]" />
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Memuat Sesi Pemulihan...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
