import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { PrintTrigger } from "./print-trigger"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

export const dynamic = 'force-dynamic'

export default async function PrintReportPage(props: any) {
  const params = await props.params
  const studentId = params?.studentId

  if (!studentId) return notFound()

  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role

  // Allow ADMIN, TEACHER, and the PARENT of the student to print
  const isAuthorized = role === 'ADMIN' || role === 'TEACHER' || (role === 'PARENT' && (session.user as any).id === studentId)
  if (!isAuthorized) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Unauthorized: Anda tidak memiliki akses untuk mencetak rapor siswa ini.
      </div>
    )
  }

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      class: true,
      studentSubmissions: {
        include: {
          assignment: {
            include: {
              subject: true
            }
          }
        }
      },
      userSubjects: {
        include: {
          subject: {
            include: {
              teacher: true
            }
          }
        }
      },
      userNotes: {
        include: {
          author: true
        },
        orderBy: { createdAt: 'desc' }
      },
      attendances: true
    }
  })

  if (!student) return notFound()

  // Calculate subject-wise grades
  const subjectGrades = student.userSubjects.map((us: any) => {
    const subjectSubmissions = student.studentSubmissions.filter(
      (sub: any) => sub.assignment.subjectId === us.subjectId && sub.score !== null
    )
    const average = subjectSubmissions.length > 0
      ? Math.round(subjectSubmissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / subjectSubmissions.length)
      : 0
    
    // Status Kelulusan (Kriteria Ketuntasan Minimal / KKM: 75)
    const isPassed = average >= 75

    return {
      id: us.subjectId,
      name: us.subject.name,
      teacher: us.subject.teacher?.name || "Belum ditugaskan",
      average,
      isPassed
    }
  })

  // Calculate attendance details
  const presentCount = student.attendances.filter((a: any) => a.status === 'PRESENT').length
  const sickCount = student.attendances.filter((a: any) => a.status === 'SICK').length
  const permissionCount = student.attendances.filter((a: any) => a.status === 'PERMISSION').length
  const absentCount = student.attendances.filter((a: any) => a.status === 'ABSENT').length

  const latestWaliKelasNote = student.userNotes.find((n: any) => n.type === 'GENERAL' || n.type === 'ACADEMIC')

  return (
    <div className="bg-white min-h-screen text-black p-8 md:p-16 max-w-4xl mx-auto font-serif print:p-0 print:m-0">
      <PrintTrigger />

      {/* Header Kop Rapor */}
      <div className="text-center border-b-4 border-double border-black pb-4 space-y-1">
        <h1 className="text-xl font-extrabold tracking-wide uppercase">KEMENTERIAN PENDIDIKAN DAN KEBUDAYAYAN</h1>
        <h2 className="text-lg font-bold tracking-wide uppercase">{student.school || "SMKN 13 BANDUNG"}</h2>
        <p className="text-xs font-medium italic">Alamat: {student.address || "Jl. Soekarno Hatta, Bandung"} • Telp: {student.phone || "-"}</p>
      </div>

      <div className="text-center my-6">
        <h3 className="text-md font-extrabold uppercase tracking-widest decoration-solid underline">LAPORAN HASIL BELAJAR SISWA (RAPOR)</h3>
      </div>

      {/* Info Siswa */}
      <div className="grid grid-cols-2 gap-4 text-xs font-medium mb-8">
        <div className="space-y-1">
          <div className="grid grid-cols-3">
            <span className="font-bold">Nama Peserta Didik</span>
            <span>:</span>
            <span className="col-span-1 font-extrabold uppercase">{student.name}</span>
          </div>
          <div className="grid grid-cols-3">
            <span>Nomor Induk Siswa (NIS)</span>
            <span>:</span>
            <span>{student.nis || "-"}</span>
          </div>
          <div className="grid grid-cols-3">
            <span>No. Absen</span>
            <span>:</span>
            <span>{student.noAbsen || "-"}</span>
          </div>
        </div>
        <div className="space-y-1 pl-4">
          <div className="grid grid-cols-3">
            <span>Kelas</span>
            <span>:</span>
            <span className="uppercase font-bold">{student.class?.name || "-"}</span>
          </div>
          <div className="grid grid-cols-3">
            <span>Tahun Ajaran</span>
            <span>:</span>
            <span>2025/2026</span>
          </div>
          <div className="grid grid-cols-3">
            <span>Jenis Kelamin</span>
            <span>:</span>
            <span>{student.gender || "-"}</span>
          </div>
        </div>
      </div>

      {/* Tabel Nilai */}
      <div className="mb-8">
        <h4 className="text-xs font-extrabold uppercase mb-2">A. CAPAIAN HASIL BELAJAR (ASPEK PENGETAHUAN & KETERAMPILAN)</h4>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-12 text-center">No</th>
              <th className="border border-black p-2 text-left">Mata Pelajaran</th>
              <th className="border border-black p-2 w-28 text-center">Nilai Rata-Rata</th>
              <th className="border border-black p-2 w-24 text-center">Ketercapaian</th>
              <th className="border border-black p-2 text-left">Nama Guru Pengampu</th>
            </tr>
          </thead>
          <tbody>
            {subjectGrades.map((sg, index) => (
              <tr key={sg.id} className="hover:bg-gray-50">
                <td className="border border-black p-2 text-center font-bold">{index + 1}</td>
                <td className="border border-black p-2 font-bold">{sg.name}</td>
                <td className="border border-black p-2 text-center font-extrabold text-sm">{sg.average}</td>
                <td className="border border-black p-2 text-center">
                  <span className={`font-bold ${sg.isPassed ? "text-green-700" : "text-red-700"}`}>
                    {sg.isPassed ? "TUNTAS" : "BELUM TUNTAS"}
                  </span>
                </td>
                <td className="border border-black p-2 text-gray-700">{sg.teacher}</td>
              </tr>
            ))}
            {subjectGrades.length === 0 && (
              <tr>
                <td colSpan={5} className="border border-black p-4 text-center text-gray-500 italic">
                  Belum ada data mata pelajaran atau nilai terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tabel Kehadiran */}
      <div className="mb-8 grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-extrabold uppercase mb-2">B. EKSTRAKURIKULER & ORGANISASI</h4>
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">Kegiatan Ekstrakurikuler</th>
                <th className="border border-black p-2 w-24 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">Pramuka (Wajib)</td>
                <td className="border border-black p-2 text-center font-bold">Baik</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Teknologi & Coding Club</td>
                <td className="border border-black p-2 text-center font-bold">Sangat Baik</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase mb-2">C. KEHADIRAN (ABSENSI)</h4>
          <table className="w-full border-collapse border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-semibold">1. Sakit (S)</td>
                <td className="border border-black p-2 w-24 text-center font-bold">{sickCount} Hari</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">2. Izin (I)</td>
                <td className="border border-black p-2 w-24 text-center font-bold">{permissionCount} Hari</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">3. Tanpa Keterangan (A)</td>
                <td className="border border-black p-2 w-24 text-center font-bold">{absentCount} Hari</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Catatan Perkembangan Wali Kelas */}
      <div className="mb-12">
        <h4 className="text-xs font-extrabold uppercase mb-2">D. CATATAN PERKEMBANGAN & SIKAP (WALI KELAS)</h4>
        <div className="border border-black p-4 text-xs min-h-[80px] italic leading-relaxed">
          {latestWaliKelasNote 
            ? `"${latestWaliKelasNote.content}"`
            : "Ananda menunjukkan perkembangan karakter yang baik dan santun selama proses pembelajaran di kelas. Terus pertahankan semangat belajarnya."}
        </div>
      </div>

      {/* Tanda Tangan */}
      <div className="grid grid-cols-3 text-center text-xs font-semibold mt-16 pt-8 print:break-inside-avoid">
        <div>
          <p>Orang Tua/Wali Murid</p>
          <div className="h-20" />
          <p className="border-b border-black w-32 mx-auto" />
        </div>
        <div>
          <p>Mengetahui,</p>
          <p>Kepala Sekolah</p>
          <div className="h-20" />
          <p className="border-b border-black w-40 mx-auto font-bold uppercase">{student.school ? `Kepala ${student.school}` : "Kepala Sekolah"}</p>
        </div>
        <div>
          <p>Bandung, {format(new Date(), 'dd MMMM yyyy', { locale: idLocale })}</p>
          <p>Wali Kelas</p>
          <div className="h-20" />
          <p className="border-b border-black w-32 mx-auto" />
        </div>
      </div>

      {/* Floating Action Button (untuk non-print view) */}
      <div className="mt-8 flex justify-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          Cetak Rapor Sekarang
        </button>
      </div>
    </div>
  )
}
