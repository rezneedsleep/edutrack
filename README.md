# EduTrack

EduTrack adalah platform edukasi modern yang dirancang untuk mempermudah pemantauan kemajuan belajar siswa (progress tracking), manajemen kelas, dan administrasi sekolah secara terpadu. Dibangun dengan Next.js 15, React 19, Tailwind CSS, dan Prisma ORM, EduTrack menawarkan antarmuka yang cepat, responsif, dan mudah digunakan oleh Siswa, Guru, maupun Administrator.

## Fitur Utama

### 🎓 Untuk Siswa
- **Dashboard Personal:** Lihat ringkasan nilai, tugas yang belum dikerjakan, dan jadwal kelas hari ini.
- **Progres Belajar:** Pantau grafik perkembangan nilai dan absensi secara real-time.
- **Ujian Online (CBT):** Kerjakan ujian online (Pilihan Ganda) dengan sistem waktu dan *anti-cheat* langsung dari *dashboard*.
- **Forum Diskusi:** Berinteraksi dengan guru dan teman sekelas untuk membahas materi pelajaran.
- **Ekstrakurikuler:** Lihat daftar ekskul yang diikuti beserta jadwal kegiatannya.

### 👩‍🏫 Untuk Guru
- **Manajemen Kelas & Mata Pelajaran:** Kelola materi, tugas, dan ujian dengan mudah.
- **Pembuatan Ujian (CBT):** Buat soal, atur durasi ujian, jadwal, dan nilai siswa akan otomatis dihitung.
- **Penilaian Otomatis & Manual:** Input nilai siswa dan berikan umpan balik (feedback) secara langsung.
- **Pantauan Absensi:** Catat kehadiran siswa di setiap sesi kelas.
- **Pengumuman:** Kirim informasi penting ke seluruh kelas atau siswa tertentu.

### ⚙️ Untuk Administrator
- **Kelola Pengguna:** Tambah, edit, atau hapus data Siswa dan Guru (mendukung *bulk import* via CSV).
- **Manajemen Kurikulum:** Atur daftar kelas, mata pelajaran, dan penugasan guru.
- **Statistik & Laporan:** Dapatkan wawasan (insights) tentang performa sekolah secara keseluruhan melalui grafik interaktif (Chart).
- **Kelola Ekstrakurikuler:** Atur daftar ekskul, pembina, dan anggotanya.

### 🔔 Fitur Tambahan Terintegrasi
- **Notifikasi Email Otomatis:** Setiap kali guru memberikan tugas baru, materi baru, atau ketika admin membuat pengumuman *broadcast*, sistem otomatis mengirimkan email notifikasi ke akun siswa/pengguna terkait (menggunakan Nodemailer/SMTP).
- **Video Conference:** Terintegrasi langsung dengan platform video *conference* (seperti Google Meet atau Zoom) pada jadwal kelas.

## Teknologi yang Digunakan

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons, Recharts
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL (dengan Prisma ORM)
- **Autentikasi:** NextAuth.js (Session-based authentication)

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/) (aktif dan berjalan)
- [Git](https://git-scm.com/)

## Cara Menjalankan Proyek di Lokal

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/davinmaritza/edutrack.git
   cd edutrack
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```
   *atau*
   ```bash
   yarn install
   ```

3. **Atur variabel lingkungan (Environment Variables):**
   Buat file `.env` di folder root, lalu salin isi dari `.env.example` (jika ada) dan sesuaikan dengan konfigurasi database Anda. Contoh:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/edutrack?schema=public"
   NEXTAUTH_SECRET="rahasia_super_aman_anda"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Jalankan migrasi database:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Isi data awal (Seeding) & Akun Demo:**
   Sistem telah dilengkapi dengan akun demo untuk setiap peran agar Anda dapat langsung mencoba fitur. Jalankan perintah:
   ```bash
   npx prisma db seed
   ```
   **Kredensial Demo:**
   - **Admin:** `admin@demo.com`
   - **Guru:** `guru@demo.com`
   - **Pelatih Ekskul:** `pelatih@demo.com`
   - **Siswa:** `siswa@demo.com`
   - **Orang Tua:** `ortu@demo.com`
   - *Kata Sandi (Semua Akun):* `password123`

6. **Jalankan server pengembangan (Development Server):**
   ```bash
   npm run dev
   ```

7. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Deploy ke Vercel (Web Demo)

Untuk mendeploy EduTrack ke Vercel dan menjadikannya web demo, pastikan Anda memiliki *database* PostgreSQL (misalnya dari Supabase atau Neon) dan ikuti langkah berikut:
1. Hubungkan repositori GitHub Anda ke Vercel.
2. Pada pengaturan Environment Variables di Vercel, tambahkan `DATABASE_URL`, `NEXTAUTH_SECRET`, dan `NEXTAUTH_URL`.
3. Setelah deploy selesai, jalankan seeding akun demo agar pengunjung dapat mencoba.

## Struktur Direktori Utama

- `/app` - Rute aplikasi (App Router), halaman, dan API endpoints.
- `/components` - Komponen React yang dapat digunakan kembali (UI, layout, forms).
- `/lib` - Fungsi utilitas, konfigurasi database (Prisma), dan helper lainnya.
- `/prisma` - Skema database dan skrip *seeding*.
- `/public` - Aset statis seperti gambar, ikon, dan font.

## Kontribusi

Kami sangat menghargai kontribusi dalam bentuk apa pun! Jika Anda menemukan *bug* atau memiliki ide fitur baru, silakan buat *Issue* atau kirimkan *Pull Request*. 

1. *Fork* repositori ini
2. Buat *branch* fitur Anda (`git checkout -b fitur-baru`)
3. *Commit* perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. *Push* ke *branch* (`git push origin fitur-baru`)
5. Buka *Pull Request*

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---
*Developer By Davin*
