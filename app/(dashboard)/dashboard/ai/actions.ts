'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Call Google Gemini API directly using fetch to avoid package mismatch issues
async function fetchGemini(
  prompt: string,
  systemInstruction: string,
  apiKey?: string,
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) {
  const finalApiKey = apiKey || process.env.GEMINI_API_KEY
  if (!finalApiKey) {
    throw new Error("Gemini API Key tidak ditemukan. Harap tambahkan key di pengaturan AI atau file .env.")
  }

  // Model gemini-2.5-flash is extremely fast, cost-effective, and highly capable
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${finalApiKey}`

  // Combine history and current message
  const contents = [
    ...chatHistory,
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || `Gemini API Error: Status ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error("Tidak mendapat balasan dari model AI.")
  }

  return text
}

// 1. Fetch AI Context for User
export async function getAiContext() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const userId = (session.user as any).id
  const role = (session.user as any).role
  const isServerKeySet = !!process.env.GEMINI_API_KEY

  if (role === 'STUDENT') {
    // Enrolled subjects
    const userSubjects = await prisma.userSubject.findMany({
      where: { userId },
      include: { subject: { include: { topics: true } } }
    })

    // Progress logs
    const progressLogs = await prisma.progressLog.findMany({
      where: { userId },
      include: { topic: { include: { subject: true } } },
      orderBy: { loggedAt: 'desc' },
      take: 15
    })

    // Submissions
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { studentId: userId },
      include: { assignment: { include: { subject: true } } },
      orderBy: { submittedAt: 'desc' }
    })

    return {
      role,
      userSubjects,
      progressLogs,
      submissions,
      isServerKeySet
    }
  }

  if (role === 'TEACHER') {
    // Classes taught by teacher schedules
    const schedules = await prisma.classSchedule.findMany({
      where: { teacherId: userId },
      select: { classId: true }
    })

    const assignmentsList = await prisma.assignment.findMany({
      where: { teacherId: userId },
      select: { classId: true }
    })

    const classIds = Array.from(new Set([
      ...schedules.map(s => s.classId),
      ...assignmentsList.filter(a => a.classId).map(a => a.classId as string)
    ]))

    // Students under teacher classes
    const students = await prisma.user.findMany({
      where: { classId: { in: classIds }, role: 'STUDENT' },
      include: {
        class: true,
        progressLogs: { 
          include: { topic: { include: { subject: true } } },
          orderBy: { loggedAt: 'desc' },
          take: 5
        },
        studentSubmissions: { 
          include: { assignment: true },
          orderBy: { submittedAt: 'desc' }
        }
      }
    })

    // Subject list taught
    const subjects = await prisma.subject.findMany({
      where: { teacherId: userId },
      include: { topics: true }
    })

    // Submissions that need grading
    const pendingSubmissions = await prisma.assignmentSubmission.findMany({
      where: { 
        assignment: { teacherId: userId },
        score: null
      },
      include: {
        student: { include: { class: true } },
        assignment: { include: { subject: true } }
      },
      orderBy: { submittedAt: 'desc' }
    })

    return {
      role,
      students,
      subjects,
      pendingSubmissions,
      isServerKeySet
    }
  }

  // Fallback for Admin or unknown
  return {
    role,
    message: "Admin AI features are general analytics.",
    isServerKeySet
  }
}

// 2. Main Chat with AI
export async function chatWithAi(params: {
  prompt: string
  subjectId?: string
  studentId?: string
  customApiKey?: string
  history?: { role: 'user' | 'model'; text: string }[]
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const user = session.user
  const role = (user as any).role
  const userId = (user as any).id

  let systemInstruction = `Kamu adalah EduTrack AI, asisten kecerdasan buatan terintegrasi untuk platform manajemen pembelajaran EduTrack di SMKN 13 Bandung. 
Tanggapi pengguna dengan bahasa Indonesia yang santun, ramah, dan profesional.
Selalu bantu pengguna (Siswa atau Guru) dalam memahami pelajaran, tugas, progres belajar, atau pembuatan materi.`

  // 1. Compile context for Student
  if (role === 'STUDENT') {
    const subjects = await prisma.userSubject.findMany({
      where: { userId },
      include: { subject: true }
    })
    const recentLogs = await prisma.progressLog.findMany({
      where: { userId },
      include: { topic: { include: { subject: true } } },
      orderBy: { loggedAt: 'desc' },
      take: 5
    })

    const subjectsText = subjects.map(s => `- ${s.subject.name} (Target: ${s.targetHours} jam)`).join('\n')
    const logsText = recentLogs.map(l => `- Mapel ${l.topic.subject.name}, Topik: ${l.topic.name}. Kesulitan: ${l.difficulty}/5, Durasi: ${l.duration} menit. Catatan: ${l.notes || '-'}`).join('\n')

    systemInstruction += `\n\n[INFORMASI SISWA]
Nama Siswa: ${user.name}
Mata Pelajaran Diikuti:
${subjectsText || 'Tidak ada mata pelajaran terdaftar.'}

Aktivitas Belajar Terakhir (Progress Log):
${logsText || 'Belum ada catatan aktivitas belajar.'}

Gunakan data ini untuk memberikan bimbingan yang sangat personal. Jika siswa menanyakan performa mereka, berikan ringkasan yang membangun, apresiasi jika kesulitan rendah, dan motivasi/saran konkret jika tingkat kesulitan belajar mereka tinggi (skor kesulitan 4 atau 5).`
  }

  // 2. Compile context for Teacher
  if (role === 'TEACHER') {
    let studentContext = ""
    if (params.studentId) {
      const targetStudent = await prisma.user.findUnique({
        where: { id: params.studentId },
        include: { 
          class: true,
          progressLogs: { include: { topic: { include: { subject: true } } }, take: 5, orderBy: { loggedAt: 'desc' } }
        }
      })
      if (targetStudent) {
        studentContext = `Guru sedang memfokuskan diskusi pada Siswa: ${targetStudent.name} (Kelas: ${targetStudent.class?.name || '-'}).
Aktivitas belajar terakhir siswa ini:
${targetStudent.progressLogs.map(l => `- Mapel ${l.topic.subject.name}, Topik: ${l.topic.name}. Kesulitan: ${l.difficulty}/5, Durasi: ${l.duration} menit. Catatan: ${l.notes || '-'}`).join('\n')}`
      }
    }

    systemInstruction += `\n\n[INFORMASI GURU]
Nama Guru: ${user.name}
Role: Guru Pengajar
${studentContext ? `\n[KONTEKS SISWA TERPILIH]\n${studentContext}` : 'Guru sedang melihat overview dashboard AI.'}

Bantu guru merumuskan tugas, menganalisis performa kelas, merancang silabus, atau memberikan draf feedback nilai untuk tugas siswa.`
  }

  // Convert history array to format expected by Gemini API
  const formattedHistory = (params.history || []).map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }))

  try {
    const reply = await fetchGemini(params.prompt, systemInstruction, params.customApiKey, formattedHistory)
    return { success: true, reply }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 3. Auto-feedback / Grader action
export async function generateFeedbackAndScore(params: {
  submissionId: string
  customApiKey?: string
}) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'TEACHER') {
    throw new Error("Hanya Guru yang dapat mengakses fitur penilaian otomatis.")
  }

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: params.submissionId },
    include: {
      student: true,
      assignment: {
        include: { subject: true }
      }
    }
  })

  if (!submission) throw new Error("Submission tidak ditemukan.")

  const systemInstruction = `Kamu adalah EduTrack AI Grading Assistant. Tugasmu membantu guru SMKN 13 Bandung menilai tugas siswa secara objektif dan konstruktif.
Berikan keluaran dalam format JSON yang valid dengan key sebagai berikut:
- "score": (number) Rekomendasi nilai numerik berkisar antara 0 sampai ${submission.assignment.maxScore}.
- "strengths": (string) Kelebihan/kekuatan utama dari tugas siswa ini (dalam Bahasa Indonesia).
- "improvements": (string) Bagian yang perlu ditingkatkan atau direvisi oleh siswa (dalam Bahasa Indonesia).
- "feedback": (string) Pesan feedback akhir yang ramah dan suportif untuk siswa (dalam Bahasa Indonesia).

Pastikan format kembalian hanya JSON mentah yang valid, tanpa backticks markdown (\`\`\`json) agar server dapat langsung mem-parse-nya.`

  const prompt = `[DETAIL TUGAS]
Judul Tugas: ${submission.assignment.title}
Deskripsi Tugas: ${submission.assignment.description}
Maksimum Nilai: ${submission.assignment.maxScore}

[PENGUMPULAN SISWA]
Nama Siswa: ${submission.student.name}
Isi Tugas (Teks/Konten):
${submission.content}

[ATTACHMENTS/LAMPIRAN INFO]:
${JSON.stringify(submission.attachments || [])}

Silakan analisis jawaban siswa di atas dan bandingkan dengan deskripsi tugas. Tentukan nilai rekomendasi dan buat feedback konstruktif.`

  try {
    let replyText = await fetchGemini(prompt, systemInstruction, params.customApiKey)
    
    // Clean potential markdown wrap
    replyText = replyText.replace(/```json/g, "").replace(/```/g, "").trim()
    
    const parsed = JSON.parse(replyText)
    return {
      success: true,
      data: {
        score: parsed.score || 0,
        strengths: parsed.strengths || "-",
        improvements: parsed.improvements || "-",
        feedback: parsed.feedback || ""
      }
    }
  } catch (error: any) {
    console.error("Grader AI Error:", error)
    return { success: false, error: error.message }
  }
}

// 4. Save Grade to DB
export async function saveAssignmentGrade(params: {
  submissionId: string
  score: number
  feedback: string
}) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'TEACHER') {
    throw new Error("Unauthorized")
  }

  await prisma.assignmentSubmission.update({
    where: { id: params.submissionId },
    data: {
      score: params.score,
      feedback: params.feedback,
      gradedAt: new Date()
    }
  })

  // Create achievement notification for the student
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: params.submissionId },
    include: { assignment: true }
  })

  if (submission) {
    await prisma.notification.create({
      data: {
        userId: submission.studentId,
        type: 'ASSIGNMENT_GRADED',
        title: 'Tugas Selesai Dinilai 🎉',
        message: `Tugas "${submission.assignment.title}" Anda telah dinilai oleh Guru dengan skor ${params.score}.`
      }
    })
  }

  revalidatePath('/dashboard/tugas-guru')
  revalidatePath('/dashboard/ai')
  return { success: true }
}
