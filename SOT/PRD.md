# PRD — Sistem Informasi Manajemen Transaksi & Tracking Status Cucian Laundry

- **Status:** Disetujui
- **Metode pengembangan:** Prototype
- **Produk:** Aplikasi web manajemen operasional laundry
- **Implementasi awal:** Front-end React + Vite dengan data dummy; tanpa backend dan tanpa pembayaran nyata.

## 1. Ringkasan
Aplikasi membantu admin dan pegawai laundry mengelola pelanggan, layanan, transaksi cucian, status pengerjaan, pembayaran secara simulasi, serta ringkasan operasional. Pelanggan dapat melihat status cucian melalui nomor transaksi pada layar tracking.

## 2. Tujuan
1. Mempercepat pencatatan cucian masuk dan perhitungan biaya.
2. Memudahkan pencarian data pelanggan dan riwayat transaksi.
3. Memberikan visibilitas status cucian dan estimasi selesai.
4. Menyajikan ringkasan transaksi, pendapatan, dan cucian aktif.
5. Menyediakan prototipe yang mudah dievaluasi sebelum integrasi backend.

## 3. Pengguna dan hak akses
| Peran | Hak akses prototipe |
|---|---|
| Admin/Pemilik | Dashboard, pelanggan, layanan, transaksi, pembayaran, laporan, status cucian |
| Pegawai | Pelanggan, transaksi, pembaruan status, tracking, pembayaran simulasi |
| Pelanggan (tracking publik) | Mencari status berdasarkan nomor transaksi; tanpa akses ke data pelanggan lain |

Login pada tahap ini adalah simulasi front-end. Tidak ada autentikasi server atau perlindungan data produksi.

## 4. Ruang lingkup fitur
### 4.1 Login dan hak akses
- Form login dan logout.
- Pemilihan peran demo Admin/Pegawai.
- Validasi input dasar dan feedback kesalahan.

### 4.2 Manajemen pelanggan
- Tambah, ubah, hapus dengan dialog konfirmasi.
- Field: nama, telepon, alamat.
- Pencarian berdasarkan nama atau nomor telepon.
- Riwayat transaksi per pelanggan.

### 4.3 Layanan dan harga
- Daftar layanan: Cuci Kering, Cuci Setrika, Setrika Saja.
- Harga per kilogram atau per item.
- Estimasi durasi pengerjaan.
- Tambah/edit/nonaktifkan layanan dalam data lokal.

### 4.4 Transaksi
- Mencatat cucian masuk dan pelanggan.
- Nomor nota otomatis.
- Memilih layanan, berat/jumlah, tanggal masuk, estimasi selesai.
- Menghitung subtotal/total otomatis berdasarkan tarif layanan.
- Menampilkan detail transaksi dan nota yang siap dicetak.

### 4.5 Tracking status
- Cari dengan nomor transaksi.
- Status: Menunggu, Dicuci, Dikeringkan, Disetrika, Siap Diambil, Selesai/Diserahkan.
- Perbarui status dan catat riwayat perubahan.
- Tampilkan estimasi selesai.

### 4.6 Pembayaran dan nota
- Status pembayaran: Belum Bayar, DP, Lunas.
- Metode pembayaran simulasi: Tunai, Transfer, QRIS.
- Cetak nota menggunakan fungsi print browser; tidak memproses pembayaran sungguhan.

### 4.7 Dashboard dan laporan
- Jumlah transaksi harian, pendapatan tercatat, cucian diproses, siap diambil.
- Filter laporan berdasarkan periode.
- Ekspor CSV yang kompatibel dengan Excel dan print/PDF melalui browser.

## 5. Batasan dan non-goals
- Tidak ada API, database server, backend, atau sinkronisasi multi-perangkat.
- Data dummy tersimpan di memori browser dan dapat kembali ke nilai awal saat refresh.
- Login/peran hanya untuk demonstrasi; jangan gunakan untuk data pribadi nyata.
- Tidak ada gateway pembayaran, WhatsApp API, notifikasi SMS/email, atau deployment.
- Tidak menjanjikan keamanan produksi, audit server, atau backup.

## 6. Kebutuhan nonfungsional
- Responsif untuk desktop, tablet, dan ponsel.
- Navigasi konsisten, state kosong, validasi, konfirmasi tindakan destruktif, dan feedback aksi.
- Aksesibilitas dasar: label input, fokus keyboard, kontras memadai, tombol berlabel jelas.
- Struktur komponen sederhana dan mudah diperluas.

## 7. Kriteria penerimaan
- Aplikasi dapat dijalankan dengan `npm install` dan `npm run dev`.
- Pengguna dapat masuk demo, berpindah halaman, mencari data, dan mengelola data dummy.
- Total transaksi dihitung otomatis dan nomor nota dibuat otomatis.
- Status transaksi dapat diubah dan riwayatnya tampil.
- Tracking publik menemukan transaksi dengan nomor yang valid.
- Nota dapat dicetak dan laporan dapat diekspor ke CSV.
- Tampilan menggunakan identitas SaaS futuristik biru, putih, dan hitam serta responsif.

## 8. Asumsi prototipe
Harga dan data yang ditampilkan adalah contoh. Tarif, proses bisnis, hak akses final, dan format laporan harus divalidasi bersama pemilik laundry saat sesi evaluasi prototype.
