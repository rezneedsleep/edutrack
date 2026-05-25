'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSent(true)
        toast.success('Link pemulihan berhasil dikirim. Cek terminal Anda.')
      } else {
        toast.error('Gagal mengirim link pemulihan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans">
      {/* Immersive Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5483B3]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5483B3]/10 rounded-full blur-2xl" />

      <div className="w-full flex items-center justify-center p-10 relative z-10">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center">
            <Link href="/" className="inline-block mb-10 group">
              <Image src="/logo.png" alt="EduTrack Logo" width={200} height={50} className="h-12 w-auto brightness-0 dark:invert transition-transform group-hover:scale-105" />
            </Link>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">Pemulihan Akun</h2>
            <p className="text-[var(--muted-foreground)] font-medium mt-2 text-sm">Masukkan email Anda untuk memulihkan akses akun.</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold text-[#0F172A] ml-1">Email Terdaftar</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@sekolah.sch.id"
                    className="pl-12 h-14 bg-[var(--card)] border-[var(--border)] focus-visible:ring-[#5483B3] rounded-2xl transition-all font-medium text-sm shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-2xl transition-all group relative overflow-hidden shadow-lg shadow-[#5483B3]/20"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center">
                      Kirim Link Pemulihan
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[#5483B3] transition-colors group">
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="p-8 bg-[#5483B3]/5 rounded-3xl border border-[#5483B3]/20 space-y-4">
                <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">
                  Jika akun terdaftar dengan <strong className="text-[#5483B3] font-bold">{email}</strong>, Anda akan segera menerima link pemulihan.
                </p>
                <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest leading-loose">
                  Silakan periksa folder spam/promosi jika tidak ada di kotak masuk Anda.
                </p>
              </div>
              <Button
                asChild
                className="w-full h-14 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#5483B3]/20"
              >
                <Link href="/login">Kembali ke Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
