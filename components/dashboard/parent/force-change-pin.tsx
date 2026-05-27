"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock } from "lucide-react"
import { toast } from "sonner"

export function ForceChangePin({ studentId }: { studentId: string }) {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      
    if (pin.length < 6) {
      toast.error("PIN harus minimal 6 karakter")
      return
    }

    if (pin === "123456") {
      toast.error("PIN tidak boleh sama dengan PIN bawaan (123456)")
      return
    }

    if (pin !== confirmPin) {
      toast.error("Konfirmasi PIN tidak cocok")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/parent/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      })

      if (res.ok) {
        toast.success("PIN berhasil diperbarui!")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || "Gagal memperbarui PIN")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-[#E2E8F0] overflow-hidden">
        <div className="h-2 bg-[#5483B3]" />
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-center text-[#1E293B]">
            Pembaruan Keamanan Wajib
          </CardTitle>
          <CardDescription className="text-center text-sm font-medium">
            Demi keamanan data siswa, Anda diwajibkan untuk mengganti PIN bawaan sebelum mengakses Dashboard Orang Tua.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                PIN Baru
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="Masukkan minimal 6 karakter"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="h-12 border-[#E2E8F0] focus-visible:ring-[#5483B3]"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPin" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Konfirmasi PIN Baru
              </Label>
              <Input
                id="confirmPin"
                type="password"
                placeholder="Ketik ulang PIN baru Anda"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="h-12 border-[#E2E8F0] focus-visible:ring-[#5483B3]"
                required
                minLength={6}
              />
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2 mt-4">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Harap ingat PIN baru ini. Anda akan menggunakannya bersama dengan NIS Siswa setiap kali login.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold transition-all mt-6"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan & Lanjutkan ke Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
