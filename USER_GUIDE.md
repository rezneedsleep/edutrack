# 🎓 Panduan Pengguna EduTrack (Ultimate Guide)

Selamat datang di **EduTrack**, platform manajemen sekolah modern yang dirancang untuk efisiensi, transparansi, dan kemudahan akses. Panduan ini akan membantu Anda memahami seluruh fitur sistem dari berbagai peran (Admin, Guru, dan Siswa).

---

## 📌 1. Peran & Akses (Roles)

Sistem ini memiliki tiga peran utama dengan hak akses yang berbeda:
*   **ADMIN**: Mengontrol seluruh ekosistem (Pengguna, Kelas, Mapel, Jadwal).
*   **GURU**: Mengelola materi, memberikan tugas, dan memantau progres siswa.
*   **SISWA**: Mengakses materi, mengerjakan tugas, dan melihat progres pribadi.

---

## 🛡️ 2. Panduan Admin (Administrator)

Admin adalah pemegang kendali utama sistem. Menu Anda berada di sisi kiri dashboard.

### A. Kelola Pengguna
*   **Tambah User**: Klik tombol `+ TAMBAH USER`. Anda bisa memilih role (Admin/Teacher/Student).
*   **Hapus Massal**: Centang beberapa user, lalu klik ikon 🗑️ di header tabel. Gunakan fitur ini dengan hati-hati!
*   **Import JSON**: Gunakan fitur Bulk Import jika ingin memasukkan ratusan user sekaligus dalam format JSON.

### B. Kelola Kelas & Mapel
*   Setiap siswa **harus** dimasukkan ke dalam kelas agar bisa melihat jadwal.
*   Setiap Mapel (Mata Pelajaran) perlu dihubungkan dengan satu **Guru Utama**.

### C. Sistem Penjadwalan
*   Anda mengatur hari dan jam belajar di menu `Kelola Jadwal`.
*   Pastikan jam mulai dan selesai tidak bentrok untuk kelas yang sama.

---

## 👨‍🏫 3. Panduan Guru (Teacher)

Dashboard Guru difokuskan pada pengelolaan konten akademik.

### A. Manajemen Topik & Materi
*   Di menu `Kelola Materi`, Anda dapat membagi kurikulum menjadi beberapa **Topik**.
*   Gunakan **Premium Editor** (tampilan Fullscreen) untuk menulis materi bab yang panjang agar lebih nyaman.

### B. Pemberian Tugas (Assignments)
*   Klik `Tambah Tugas`, pilih topik yang relevan, dan tentukan tenggat waktu (deadline).
*   Anda bisa melampirkan file atau memberikan instruksi teks.

### C. Laporan & Nilai
*   Lihat menu `Laporan Siswa` untuk memantau siapa saja yang sudah mengerjakan tugas.
*   Anda bisa memberikan feedback langsung pada setiap pengumpulan siswa.

---

## ✍️ 4. Panduan Siswa (Student)

Siswa memiliki tampilan yang lebih sederhana dan fokus pada produktivitas.

### A. Dashboard Utama
*   Melihat jadwal pelajaran hari ini secara real-time.
*   Melihat tugas-tugas yang mendekati tenggat waktu (Deadline).

### B. Mengerjakan Tugas
*   Klik pada tugas yang tersedia, baca instruksi, lalu klik `Kumpulkan Tugas`.
*   Anda bisa mengunggah file atau mengetik jawaban langsung.

---

## ⚙️ 5. Tips Teknis (Untuk Developer/Advance User)

### Sinkronisasi Database (Prisma ORM)
Jika ada perubahan struktur database dari Supabase, jalankan:
```bash
# Menarik skema terbaru
npx prisma db pull

# Memperbarui query generator
npx prisma generate
```

### Monitoring Data
Gunakan antarmuka visual untuk melihat data mentah:
```bash
npx prisma studio
```

### Mode Maintenance
Jika ingin melakukan update besar, Admin bisa mengaktifkan mode maintenance di menu Pengaturan Global agar user lain tidak bisa mengakses sistem sementara.

---

## 🆘 Bantuan & Support
Jika Anda menemukan error atau kendala teknis, pastikan:
1.  Koneksi internet stabil.
2.  Database Supabase dalam keadaan aktif.
3.  Cek log server untuk melihat pesan error spesifik.

---
*EduTrack v2.4 - Premium School Management Solution*
