# IMPLEMENTATION_PLAN — Laundry Management SaaS

- **Status:** Disetujui
- **Landasan:** PRD.md dan UI-GUIDELINE.md
- **Stack:** React, Vite, JavaScript, CSS; data dummy lokal.

## 1. Prinsip implementasi
1. Fokus pada front-end yang dapat didemokan, tanpa backend/API.
2. Data dummy dan helper dipisahkan dari komponen UI.
3. Komponen dibuat modular secukupnya; hindari abstraksi berlebihan.
4. Jangan menambahkan fitur di luar PRD tanpa persetujuan baru.
5. Aksi data bersifat lokal dan tidak boleh digambarkan sebagai persistensi server.

## 2. Struktur proyek
```text
laundry-management-saas/
├── SOT/
│   ├── PRD.md
│   ├── UI-GUIDELINE.md
│   └── IMPLEMENTATION_PLAN.md
├── src/
│   ├── components/       # Sidebar, modal, badge, KPI, toast
│   ├── data/              # Data dummy dan helper format
│   ├── styles/            # Token dan stylesheet
│   ├── App.jsx             # Navigasi dan halaman prototipe
│   └── main.jsx            # Entry React
├── public/
├── AGENTS.md
├── PROMPT_EXECUTION.md
├── README.md
├── package.json
└── vite.config.js
```

## 3. Modul implementasi
1. **Shell aplikasi:** sidebar responsif, header, navigasi, role demo, logout.
2. **Dashboard:** KPI, ringkasan status, transaksi terbaru.
3. **Pelanggan:** pencarian, tambah/edit/hapus, detail dan riwayat.
4. **Layanan:** daftar layanan, tarif, satuan, estimasi.
5. **Transaksi:** form masuk, kode otomatis, total otomatis, detail, status, pembayaran.
6. **Tracking:** pencarian nomor transaksi, timeline status, estimasi selesai.
7. **Laporan:** rentang tanggal, ringkasan, ekspor CSV dan cetak.
8. **UX states:** validasi, empty state, dialog konfirmasi, notifikasi.

## 4. Model data dummy
- `Customer`: `id`, `name`, `phone`, `address`.
- `Service`: `id`, `name`, `unit` (`kg`/`item`), `price`, `durationHours`, `active`.
- `Transaction`: `id`, `code`, `customerId`, `serviceId`, `quantity`, `unitPrice`, `total`, `createdAt`, `estimatedAt`, `status`, `paymentStatus`, `paymentMethod`, `statusHistory`.
- `statusHistory`: daftar `{status, at, note}`.

## 5. Aturan bisnis prototipe
- `total = quantity × unitPrice`; kuantitas harus lebih besar dari nol.
- Nomor nota dibuat dari tanggal lokal dan urutan contoh.
- Estimasi selesai dihitung dari waktu masuk ditambah durasi layanan.
- Perubahan status menambah entri riwayat dengan waktu lokal.
- Pelanggan dengan transaksi dapat dihapus hanya setelah konfirmasi; implementasi dapat mencegah penghapusan jika masih direferensikan.
- Pendapatan dashboard adalah total transaksi berstatus pembayaran Lunas, kecuali label metrik menjelaskan definisi lain.
- Ekspor CSV menggunakan data yang sedang difilter.

## 6. Urutan pengerjaan
- **Tahap A — Foundation:** Vite, token CSS, shell, navigasi, data dummy.
- **Tahap B — Core workflow:** pelanggan, layanan, transaksi, perhitungan harga.
- **Tahap C — Tracking & payment:** pembaruan status, riwayat, tracking publik, nota cetak.
- **Tahap D — Dashboard & reports:** KPI, filter periode, ekspor CSV/print.
- **Tahap E — QA:** responsive checks, validasi, keyboard/focus, build production.

## 7. Verifikasi
- `npm install` berhasil.
- `npm run dev` membuka aplikasi.
- `npm run build` selesai tanpa error.
- Alur login demo → transaksi → status → tracking → cetak nota dapat didemokan.
- CRUD pelanggan/layanan, pencarian, filter laporan, ekspor CSV, dan layout mobile diuji.

## 8. Di luar implementasi
Tidak membuat backend, database, API, autentikasi nyata, integrasi pembayaran, notifikasi eksternal, deployment, atau fitur tambahan yang tidak ada di PRD.
