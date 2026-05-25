# 🚀 Ultimate UI/UX Frontend Prompt: EduTrack System

Gunakan prompt ini untuk menghasilkan atau mengembangkan UI/UX EduTrack yang premium, aman, dan berperforma tinggi.

---

## 🎨 1. Design System & Aesthetics (The "WOW" Factor)
**Style Profile:** Minimalist, Dark Mode (Zinc-950), High-Contrast, Industrial-Elegant.

*   **Typography:** Gunakan font Sans-serif modern (seperti Inter atau Outfit). Header utama wajib menggunakan gaya **Black Italic** dengan `tracking-tighter` (Contoh: *KELOLA PENGGUNA.*).
*   **Color Palette:**
    *   Background: `zinc-950` (Blackish).
    *   Cards/Sections: `zinc-900/50` dengan border `white/5`.
    *   Primary: Vibrant Blue atau Emerald (tergantung tema sekolah).
    *   Danger: `red-600` dengan glow efek `red-600/20`.
*   **Components:**
    *   **Glassmorphism:** Gunakan `backdrop-blur-md` pada sidebar dan navbar.
    *   **Animations:** Implementasikan `framer-motion` untuk *staggered entrance* pada setiap elemen list/card.
    *   **Buttons:** `rounded-none` (Siku tajam) untuk kesan industrial, atau `rounded-sm`. Font tombol wajib **Black Uppercase Tracking-Widest**.

---

## 🛠️ 2. Tech Stack Requirements (Frontend & API)
Pastikan setiap komponen mengikuti arsitektur ini:

*   **Framework:** Next.js 15+ (App Router).
*   **State Management:** React Server Components (RSC) untuk data-fetching, Client Components untuk interaktivitas.
*   **Data Fetching:** Wajib menggunakan **Parallel Fetching** (`Promise.all`) untuk semua query database di Server Components guna menghindari bottleneck performa.
*   **Icons:** Lucide React (Gunakan ikon yang konsisten seperti `Shield`, `Users`, `BookOpen`).

---

## 🔒 3. Backend & API Security (Safety Protocol)
Aman berarti konsisten dan terlindungi:

*   **Authentication:** NextAuth.js (v5) dengan proteksi middleware pada setiap route `/dashboard`.
*   **RBAC (Role-Based Access Control):** 
    *   Setiap API wajib memeriksa `session.user.role`.
    *   Admin memiliki akses penuh, Guru terbatas pada kelas/materi mereka, Siswa hanya akses read/submit.
*   **Prisma ORM Best Practices:**
    *   Gunakan singleton pattern untuk `PrismaClient` guna mencegah kebocoran koneksi.
    *   Setiap query ke database wajib dibungkus dalam blok `try-catch`.
    *   Gunakan `select` atau `include` secara spesifik (jangan fetch semua field jika tidak perlu).
*   **API Validation:** Gunakan Zod untuk validasi input pada route POST/PATCH (seperti Tambah User atau Tugas).

---

## 📋 4. Feature-Specific Logic
*   **Bulk Management:** Setiap fitur hapus massal wajib memiliki **Double Confirmation Dialog** (AlertDialog) dengan desain "Safety Protocol".
*   **Report System:** Dashboard laporan harus menggunakan visualisasi data yang ringan namun informatif (shadcn-charts).
*   **Maintenance Mode:** Tersedia global flag untuk mengunci akses sistem jika sedang dalam pemeliharaan database.

---

## 📝 Contoh Prompt Singkat untuk AI Generator:
> "Build a premium Next.js 15 dashboard for a school system called EduTrack. Use zinc-950 dark theme, sharp-edged components (rounded-none), and high-contrast typography (Black Italic Uppercase headers). Ensure backend safety by implementing RBAC, Prisma singleton, and parallel data fetching. Use Framer Motion for smooth UI transitions and Shadcn UI for core components. Focus on speed and security."

---
*EduTrack Safety Protocol v2.4 - Optimization & Security First.*
