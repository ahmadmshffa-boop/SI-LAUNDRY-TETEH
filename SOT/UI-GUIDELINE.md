# UI-GUIDELINE — Laundry Management SaaS

- **Status:** Disetujui
- **Arah visual:** Modern, futuristik, rapi, profesional, berorientasi operasional.

## 1. Identitas visual
- Primary: biru elektrik `#2563EB`.
- Deep blue: `#1D4ED8`.
- Ink: `#0B1220`.
- Surface: putih `#FFFFFF` dan abu sangat muda `#F5F7FB`.
- Border: `#E5EAF2`; secondary text `#64748B`.
- Status: amber untuk Menunggu, biru untuk proses, ungu untuk Dikeringkan, cyan untuk Disetrika, hijau untuk Siap Diambil/Selesai, merah untuk error.
- Font: Inter bila tersedia, fallback system sans-serif.

## 2. Layout
- Sidebar desktop dengan identitas brand, menu utama, identitas pengguna, dan tombol logout.
- Area konten memiliki header halaman, breadcrumb/konteks seperlunya, dan aksi utama yang jelas.
- Di layar kecil sidebar menjadi navigasi drawer/compact; tabel bergeser menjadi scroll horizontal atau kartu.
- Gunakan grid fleksibel untuk KPI, filter, formulir, dan detail transaksi.

## 3. Komponen
- Kartu: radius 12–16px, border tipis, bayangan halus, padding konsisten.
- Tombol utama biru; tombol sekunder netral; aksi destruktif merah dan selalu dikonfirmasi.
- Input memiliki label, placeholder yang membantu, fokus terlihat, dan pesan validasi dekat field.
- Tabel memakai header jelas, status badge, aksi ringkas, dan empty state.
- Modal/drawer untuk tambah/edit; dialog konfirmasi untuk hapus.
- Toast/inline feedback untuk sukses dan kegagalan.
- Timeline status menampilkan status saat ini dan riwayat perubahan.

## 4. Spasi dan tipografi
- Skala spasi berbasis 4px.
- Body 14–16px; label 12–13px; judul halaman 24–30px; judul kartu 14–16px.
- Utamakan keterbacaan dan hierarki, bukan dekorasi berlebihan.

## 5. Status cucian
Urutan standar: Menunggu → Dicuci → Dikeringkan → Disetrika → Siap Diambil → Selesai/Diserahkan. Gunakan label teks selain warna agar makna tidak hanya bergantung pada warna.

## 6. Perilaku dan responsif
- Semua kontrol yang tampak interaktif harus memiliki aksi nyata dalam prototipe.
- Berikan loading/empty/error state bila relevan; jangan menampilkan aksi sukses palsu.
- Form mempertahankan nilai saat validasi gagal.
- Pada viewport sempit, hindari overflow horizontal seluruh halaman; tabel boleh memiliki area scroll sendiri.
- Dukungan keyboard dasar, focus ring terlihat, label semantik, dan kontras yang memadai.

## 7. Gaya konten
Bahasa antarmuka: Indonesia yang ringkas, ramah, dan operasional. Gunakan format Rupiah `Rp`, tanggal Indonesia, nomor transaksi konsisten (contoh `LDR-20261011-001`), dan teks tindakan berupa kata kerja.
