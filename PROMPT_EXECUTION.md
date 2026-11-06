# # PROMPT EXECUTION
## Implementasi Fitur Kelola Akun — Teteth Laundry

### 1. PERAN AI

Bertindak sebagai Senior Full-Stack Developer, Backend Engineer, Database Engineer, dan UI/UX Engineer.

Tugas utama adalah mengembangkan fitur **Kelola Akun (Account Management)** pada aplikasi:

**Sistem Informasi Manajemen Transaksi dan Tracking Status Cucian pada Teteth Laundry Menggunakan Metode Prototyping.**

Lakukan implementasi secara profesional, aman, terstruktur, dan konsisten dengan desain aplikasi yang sudah tersedia.

### 2. KONFIGURASI TEKNOLOGI

Gunakan konfigurasi berikut:

| Komponen | Teknologi |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | MySQL |
| ORM | Prisma |
| Autentikasi | Gunakan sistem autentikasi proyek yang tersedia |
| Password Hashing | bcrypt atau Argon2 |
| API | REST API |
| Deployment | Vercel |
| Repository | GitHub |

Jangan mengganti teknologi tersebut tanpa alasan teknis yang kuat.

### 3. TAHAP 1 — AUDIT PROYEK

Sebelum melakukan perubahan kode:

1. Periksa seluruh struktur folder proyek.
2. Identifikasi halaman dashboard dan sidebar.
3. Periksa desain UI/UX yang sudah digunakan.
4. Periksa apakah backend Node.js sudah tersedia.
5. Periksa koneksi database dan konfigurasi Prisma.
6. Periksa tabel atau model akun pengguna.
7. Periksa sistem login dan autentikasi.
8. Periksa role dan hak akses yang sudah diterapkan.
9. Periksa komponen tabel, modal, form, dan notifikasi yang tersedia.

Buat laporan singkat mengenai kondisi proyek dan daftar file yang akan dibuat atau diubah.

**PENTING:**
- Jangan membuat ulang fitur yang sudah tersedia.
- Jangan menghapus fitur sebelumnya.
- Jangan mengganti desain dashboard.
- Jangan membuat database baru tanpa memeriksa database yang sudah ada.
- Jangan mengubah konfigurasi deployment yang masih digunakan tanpa alasan yang jelas.

### 4. TAHAP 2 — FITUR KELOLA AKUN

Buat menu **Kelola Akun** pada sidebar dashboard admin.

Halaman ini digunakan untuk mengelola akun pengguna yang memiliki akses ke sistem Teteth Laundry.

#### A. Halaman Daftar Akun

Tampilkan tabel dengan kolom:

| Kolom | Keterangan |
|---|---|
| No. | Nomor urut |
| Nama | Nama lengkap pengguna |
| Email | Email untuk login |
| Role | Hak akses pengguna |
| Status | Aktif atau Nonaktif |
| Tanggal Dibuat | Waktu pembuatan akun |
| Aksi | Detail, Edit, dan Nonaktifkan |

Tambahkan fitur:
- Pencarian berdasarkan nama dan email.
- Filter berdasarkan role.
- Filter berdasarkan status akun.
- Pagination.
- Sorting berdasarkan tanggal pembuatan.
- Tampilan jumlah seluruh akun.
- Tampilan jumlah akun aktif dan nonaktif.

Pastikan tabel responsif dan nyaman digunakan pada perangkat desktop maupun mobile.

#### B. Tambah Akun

Admin dapat membuat akun baru melalui tombol **Tambah Akun**.

Form yang harus tersedia:

1. Nama lengkap.
2. Email.
3. Password.
4. Konfirmasi password.
5. Role pengguna.
6. Status akun.

Ketentuan:
- Semua kolom wajib diisi kecuali jika ada ketentuan lain.
- Email harus valid dan unik.
- Password harus memenuhi standar keamanan.
- Konfirmasi password harus cocok.
- Password tidak boleh disimpan dalam bentuk plaintext.
- Admin tidak boleh memberikan role di luar daftar role yang diizinkan.
- Tampilkan pesan kesalahan jika validasi gagal.

Setelah berhasil, tampilkan notifikasi akun berhasil dibuat dan perbarui daftar akun.

#### C. Detail Akun

Sediakan halaman atau modal detail akun yang menampilkan:

- Nama pengguna.
- Email.
- Role.
- Status akun.
- Tanggal dibuat.
- Tanggal terakhir diperbarui.

Jangan pernah menampilkan password maupun password hash.

#### D. Edit Akun

Admin dapat mengubah:

- Nama lengkap.
- Email.
- Role.
- Status akun.

Ketentuan:
- Email tetap harus unik.
- Validasi seluruh data sebelum disimpan.
- Perubahan role harus langsung memengaruhi hak akses pengguna.
- Perubahan status harus langsung diterapkan pada proses autentikasi.
- Password tidak dapat diedit melalui form edit akun biasa.

Sediakan tombol Simpan dan Batal.

#### E. Nonaktifkan Akun

Admin dapat menonaktifkan akun pengguna.

Alur:
1. Admin menekan tombol Nonaktifkan.
2. Sistem menampilkan dialog konfirmasi.
3. Admin menyetujui tindakan.
4. Sistem mengubah status akun menjadi Nonaktif.
5. Pengguna tersebut tidak dapat melakukan login atau menggunakan sesi aktif setelah status dinonaktifkan.

Untuk keamanan:
- Admin tidak boleh menonaktifkan akun dirinya sendiri.
- Sistem tidak boleh menonaktifkan admin terakhir yang masih aktif.
- Jangan menghapus data transaksi yang memiliki hubungan dengan akun tersebut.

Gunakan mekanisme soft disable atau status akun, bukan penghapusan permanen sebagai tindakan utama.

#### F. Aktifkan Kembali Akun

Admin dapat mengaktifkan kembali akun yang sebelumnya dinonaktifkan.

Setelah diaktifkan:
- Status berubah menjadi Aktif.
- Pengguna dapat login kembali.
- Hak akses mengikuti role yang tersimpan.

### 5. TAHAP 3 — SISTEM ROLE DAN HAK AKSES

Terapkan minimal dua role:

**ADMIN**
- Mengakses dashboard admin.
- Melihat seluruh akun.
- Menambahkan akun.
- Melihat detail akun.
- Mengedit akun.
- Mengubah role.
- Mengaktifkan atau menonaktifkan akun.

**STAFF**
- Mengakses dashboard sesuai izin yang tersedia.
- Tidak dapat mengakses menu Kelola Akun.
- Tidak dapat menambahkan akun.
- Tidak dapat mengubah role pengguna.
- Tidak dapat mengaktifkan atau menonaktifkan akun.

Jika sistem sebelumnya sudah memiliki role pelanggan atau role lainnya, pertahankan dan sesuaikan implementasinya tanpa menghilangkan role yang ada.

Hak akses wajib diperiksa di backend, bukan hanya menyembunyikan menu pada frontend.

### 6. TAHAP 4 — DATABASE DAN PRISMA

Periksa model pengguna yang sudah tersedia.

Jika belum ada, buat model User menggunakan Prisma dengan struktur minimal:

- id
- name
- email
- passwordHash
- role
- status
- createdAt
- updatedAt

Ketentuan:
- Gunakan ID yang konsisten dengan arsitektur database.
- Email memiliki unique constraint.
- Role menggunakan enum atau mekanisme validasi terkontrol.
- Status memiliki nilai ACTIVE dan INACTIVE.
- Password disimpan sebagai hash.
- Gunakan migration Prisma untuk perubahan database.
- Jangan merusak data yang sudah tersedia.
- Pertahankan foreign key dan relasi dengan tabel lain.

Jangan membuat tabel users kedua jika tabel pengguna sudah tersedia.

### 7. TAHAP 5 — BACKEND REST API

Gunakan prefix:

`/api/v1`

Implementasikan endpoint berikut:

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/admin/accounts` | Mengambil daftar akun |
| POST | `/admin/accounts` | Menambahkan akun |
| GET | `/admin/accounts/:id` | Melihat detail akun |
| PUT | `/admin/accounts/:id` | Mengubah data akun |
| PATCH | `/admin/accounts/:id/status` | Mengubah status akun |

Ketentuan endpoint:
- Gunakan autentikasi.
- Terapkan middleware pemeriksaan role ADMIN.
- Gunakan validasi request.
- Terapkan pagination dan filter.
- Gunakan response JSON konsisten.
- Jangan mengirim password atau password hash kepada frontend.
- Tangani error menggunakan status HTTP yang sesuai.
- Gunakan operasi database yang aman.

Contoh respons berhasil:

{
  "success": true,
  "message": "Akun berhasil ditambahkan",
  "data": {
    "id": "user-id",
    "name": "Nama Pengguna",
    "email": "user@example.com",
    "role": "STAFF",
    "status": "ACTIVE"
  }
}

### 8. TAHAP 6 — FRONTEND REACT + VITE

Buat halaman Kelola Akun dengan desain modern dan konsisten dengan dashboard Teteth Laundry.

Komponen yang diperlukan:

1. AccountPage
2. AccountTable
3. AccountForm
4. AccountDetailModal
5. AccountStatusBadge
6. AccountFilter
7. AccountSearch
8. AccountConfirmationDialog

Ketentuan desain:
- Pertahankan tema dan warna dashboard.
- Gunakan komponen UI yang sudah tersedia.
- Tampilkan loading state.
- Tampilkan empty state ketika belum ada akun.
- Tampilkan error state jika API gagal.
- Gunakan notifikasi sukses dan gagal.
- Tambahkan validasi form.
- Pastikan desain responsif.
- Gunakan dialog konfirmasi untuk tindakan penting.
- Hindari reload halaman secara penuh setelah perubahan data.

Integrasikan seluruh operasi CRUD melalui API client yang sudah digunakan proyek.

Jangan menggunakan data dummy sebagai pengganti backend pada hasil final.

### 9. TAHAP 7 — KEAMANAN

Terapkan ketentuan berikut:

- Hash password sebelum menyimpan akun.
- Jangan pernah menyimpan password plaintext.
- Jangan pernah mengembalikan password hash melalui API.
- Gunakan validasi server-side.
- Gunakan parameterized query atau Prisma ORM.
- Lindungi seluruh endpoint pengelolaan akun.
- Terapkan pembatasan akses berdasarkan role.
- Cegah privilege escalation melalui manipulasi request.
- Cegah admin menonaktifkan dirinya sendiri.
- Cegah admin terakhir dinonaktifkan.
- Gunakan konfigurasi rahasia melalui environment variables.
- Terapkan CORS sesuai domain frontend.
- Pastikan akun nonaktif tidak dapat menggunakan sesi atau token yang masih berlaku.

### 10. TAHAP 8 — PENGUJIAN

Lakukan pengujian:

1. Admin berhasil melihat daftar akun.
2. Admin berhasil menambahkan akun baru.
3. Admin berhasil melihat detail akun.
4. Admin berhasil mengedit akun.
5. Admin berhasil menonaktifkan akun.
6. Admin berhasil mengaktifkan kembali akun.
7. Email duplikat ditolak.
8. Password tidak ditampilkan dalam respons API.
9. Staff tidak dapat membuka halaman Kelola Akun.
10. Staff tidak dapat memanggil endpoint pengelolaan akun.
11. Pengguna nonaktif tidak dapat login.
12. Admin tidak dapat menonaktifkan dirinya sendiri.
13. Admin terakhir tidak dapat dinonaktifkan.
14. Data tetap tersimpan setelah aplikasi dimuat ulang.
15. Seluruh fitur sebelumnya tetap berfungsi.

### 11. TAHAP 9 — DEPLOYMENT VERCEL

Pastikan backend mengikuti arsitektur deployment serverless Vercel.

Ketentuan:
- Sediakan entry point API yang sesuai untuk Vercel Functions.
- Pisahkan konfigurasi development dan production.
- Jangan mengandalkan penyimpanan file lokal untuk data permanen.
- Gunakan database MySQL eksternal.
- Gunakan connection pooling bila didukung penyedia database.
- Konfigurasikan environment variables pada Vercel.
- Pastikan URL frontend dan backend menggunakan HTTPS pada production.
- Uji API setelah deployment.
- Jangan menyimpan kredensial database dalam source code.

### 12. KRITERIA KEBERHASILAN

Fitur dinyatakan selesai apabila:

- Menu Kelola Akun muncul di sidebar admin.
- Daftar akun berhasil ditampilkan dari database.
- Admin dapat menambah akun.
- Admin dapat melihat detail akun.
- Admin dapat mengedit akun.
- Admin dapat menonaktifkan dan mengaktifkan akun.
- Role dan hak akses berfungsi.
- Validasi berjalan di frontend dan backend.
- Data tersimpan secara permanen di MySQL.
- API dapat diakses dari React + Vite.
- Tidak ada fitur lama yang mengalami kerusakan.
- Pengujian utama berhasil.

### 13. ATURAN PENGERJAAN WAJIB

Kerjakan secara bertahap dengan urutan:

**PHASE 1 — AUDIT PROJECT**
Analisis struktur dan laporkan file yang akan diubah.

**PHASE 2 — DATABASE DAN BACKEND**
Implementasikan model Prisma, validasi, middleware, dan endpoint REST API.

**PHASE 3 — FRONTEND**
Implementasikan halaman Kelola Akun dan seluruh komponen UI.

**PHASE 4 — INTEGRASI**
Hubungkan React + Vite dengan API backend.

**PHASE 5 — TESTING**
Jalankan pengujian fitur dan keamanan.

**PHASE 6 — FINALISASI**
Dokumentasikan seluruh perubahan dan cara menjalankan fitur.

Setiap phase harus diselesaikan dan dilaporkan sebelum melanjutkan ke phase berikutnya. Tunggu persetujuan pengguna pada setiap phase.

### 14. OUTPUT AKHIR

Berikan laporan:

1. Struktur file yang dibuat dan diubah.
2. Penjelasan fitur yang berhasil dibuat.
3. Perubahan database dan migration.
4. Daftar endpoint API.
5. Hasil pengujian.
6. Cara instalasi dan menjalankan aplikasi.
7. Konfigurasi environment variables.
8. Catatan deployment Vercel.
9. Daftar kendala atau fitur yang belum selesai.

**INSTRUKSI TERAKHIR:**

Prioritaskan integrasi dengan proyek Teteth Laundry yang sudah ada. Jangan membuat ulang aplikasi dari nol. Jangan merusak fondasi React + Vite. Jangan mengklaim pekerjaan selesai jika belum diuji. Mulai dari PHASE 1 dan tunggu persetujuan sebelum melakukan implementasi berikutnya.
