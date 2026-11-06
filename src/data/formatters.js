export const STATUSES = [
  'Menunggu',
  'Dicuci',
  'Dikeringkan',
  'Disetrika',
  'Siap Diambil',
  'Selesai/Diserahkan'
];

export const PAYMENT_STATUSES = ['Belum Bayar', 'DP', 'Lunas'];

export const PAYMENT_METHODS = ['Tunai', 'Transfer', 'QRIS'];

export const money = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n || 0);

export const dateFmt = (d) => {
  if (!d) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(d));
  } catch {
    return '-';
  }
};

export const dateTime = (d) => {
  if (!d) return '-';
  try {
    const formatted = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(d));
    return `${formatted} WIB`;
  } catch {
    return '-';
  }
};

export const timeOnly = (d) => {
  if (!d) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(d));
  } catch {
    return '-';
  }
};

export const statusClass = (s) => {
  const map = {
    'Menunggu': 'wait',
    'Dicuci': 'wash',
    'Dikeringkan': 'dry',
    'Disetrika': 'iron',
    'Siap Diambil': 'ready',
    'Selesai/Diserahkan': 'done'
  };
  return map[s] || 'wait';
};

export const paymentBadgeClass = (p) => {
  if (p === 'Lunas') return 'done';
  if (p === 'DP') return 'wash';
  return 'wait';
};

export const generateTxCode = (existingTx = []) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;

  // Count existing transactions from today
  const todayPrefix = `LDR-${datePrefix}-`;
  const todayTransactions = existingTx.filter((t) => t.code && t.code.startsWith(todayPrefix));
  const seq = String(todayTransactions.length + 1).padStart(3, '0');

  return `LDR-${datePrefix}-${seq}`;
};

export const exportTransactionsToCSV = (transactions, customers, services, filename = 'laporan-laundry.csv') => {
  const customerById = (id) => customers.find((c) => c.id === Number(id));
  const serviceById = (id) => services.find((s) => s.id === Number(id));

  const rows = [
    [
      'Kode Transaksi',
      'Pelanggan',
      'No. Telepon',
      'Layanan',
      'Jumlah',
      'Satuan',
      'Tarif / Satuan',
      'Total Biaya',
      'Tanggal Masuk',
      'Estimasi Selesai',
      'Status Cucian',
      'Status Pembayaran',
      'Metode Pembayaran'
    ],
    ...transactions.map((t) => {
      const c = customerById(t.customerId);
      const s = serviceById(t.serviceId);
      return [
        t.code,
        c?.name || '-',
        c?.phone || '-',
        s?.name || '-',
        t.quantity,
        s?.unit || '-',
        s?.price || 0,
        t.total,
        dateFmt(t.createdAt),
        dateFmt(t.estimatedAt),
        t.status,
        t.paymentStatus,
        t.paymentMethod || '-'
      ];
    })
  ];

  const csvContent = rows
    .map((r) =>
      r
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
