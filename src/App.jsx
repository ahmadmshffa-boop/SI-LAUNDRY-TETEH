import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Shirt,
  ClipboardList,
  Search,
  Plus,
  Clock3,
  CheckCircle2,
  Wallet,
  PackageCheck,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  Printer,
  Filter,
  CalendarDays,
  Sparkles,
  Waves,
  CircleHelp,
  Settings,
  ScanSearch,
  ArrowRight,
  CreditCard,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  Shield,
  UserCheck,
  ChevronRight,
  XCircle,
  RefreshCw,
  TrendingUp,
  Tag
} from 'lucide-react';

import { initialCustomers, initialServices, initialTransactions } from './data/seed';
import {
  money,
  dateFmt,
  dateTime,
  timeOnly,
  statusClass,
  paymentBadgeClass,
  generateTxCode,
  exportTransactionsToCSV,
  STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS
} from './data/formatters';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Badge from './components/Badge';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import ReceiptModal from './components/ReceiptModal';
import PaymentModal from './components/PaymentModal';
import StatusModal from './components/StatusModal';
import CustomerDetailModal from './components/CustomerDetailModal';
import PublicTrackingModal from './components/PublicTrackingModal';

export default function App() {
  // Authentication & Demo Role State
  const [logged, setLogged] = useState(false);
  const [role, setRole] = useState('Admin'); // 'Admin' | 'Pegawai'
  const [username, setUsername] = useState('Admin FreshFold');
  const [loginName, setLoginName] = useState('admin');
  const [password, setPassword] = useState('laundry123');
  const [loginError, setLoginError] = useState('');
  const [showPublicTracking, setShowPublicTracking] = useState(false);

  // Navigation & Shell State
  const [page, setPage] = useState('Dashboard');
  const [mobileNav, setMobileNav] = useState(false);

  // Core Data State (in-memory demo data)
  const [customers, setCustomers] = useState(initialCustomers);
  const [services, setServices] = useState(initialServices);
  const [transactions, setTransactions] = useState(initialTransactions);

  // Search & Filter State
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [trackCode, setTrackCode] = useState('');
  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');

  // Notifications & Modals
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // 'customer' | 'service' | 'transaction' | 'detail' | 'help'
  const [editingItem, setEditingItem] = useState(null);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);
  const [selectedTxForPayment, setSelectedTxForPayment] = useState(null);
  const [selectedTxForStatus, setSelectedTxForStatus] = useState(null);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState(null);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Hapus',
    isBlocked: false,
    blockedReason: '',
    onConfirm: () => {}
  });

  // Forms State
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' });
  const [serviceForm, setServiceForm] = useState({
    name: '',
    unit: 'kg',
    price: '',
    durationHours: '48',
    active: true
  });
  const [txForm, setTxForm] = useState({
    customerId: '',
    serviceId: '',
    quantity: '1',
    paymentStatus: 'Belum Bayar',
    paymentMethod: 'Tunai',
    note: ''
  });

  // Helper Toast
  const notify = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Lookups
  const customerById = (id) => customers.find((c) => c.id === Number(id));
  const serviceById = (id) => services.find((s) => s.id === Number(id));

  // Filtered Lists
  const filteredCustomers = useMemo(() => {
    const q = query.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customers, query]);

  const filteredServices = useMemo(() => {
    const q = query.toLowerCase();
    return services.filter((s) => s.name.toLowerCase().includes(q) || s.unit.toLowerCase().includes(q));
  }, [services, query]);

  const filteredTransactions = useMemo(() => {
    const q = query.toLowerCase();
    return transactions.filter((t) => {
      const c = customerById(t.customerId);
      const s = serviceById(t.serviceId);
      const matchesQuery =
        t.code.toLowerCase().includes(q) ||
        (c?.name && c.name.toLowerCase().includes(q)) ||
        (s?.name && s.name.toLowerCase().includes(q)) ||
        t.status.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'Semua' ? true : t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [transactions, query, statusFilter, customers, services]);

  // Report Filtered Transactions
  const reportTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const txDate = new Date(t.createdAt);
      if (reportStart) {
        const start = new Date(reportStart + 'T00:00:00');
        if (txDate < start) return false;
      }
      if (reportEnd) {
        const end = new Date(reportEnd + 'T23:59:59');
        if (txDate > end) return false;
      }
      return true;
    });
  }, [transactions, reportStart, reportEnd]);

  // KPI Calculations (Strict adherence to IMPLEMENTATION_PLAN.md)
  const todayKey = new Date().toDateString();
  const todayTransactions = transactions.filter((t) => new Date(t.createdAt).toDateString() === todayKey);
  const revenuePaid = transactions.filter((t) => t.paymentStatus === 'Lunas').reduce((sum, t) => sum + t.total, 0);
  const activeCount = transactions.filter((t) => !['Siap Diambil', 'Selesai/Diserahkan'].includes(t.status)).length;
  const readyCount = transactions.filter((t) => t.status === 'Siap Diambil').length;

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setLoginError('Silakan masukkan nama pengguna.');
      return;
    }
    if (password.length < 4) {
      setLoginError('Kata sandi minimal 4 karakter.');
      return;
    }

    const displayName =
      loginName.toLowerCase() === 'admin'
        ? 'Admin FreshFold'
        : loginName.toLowerCase() === 'pegawai'
        ? 'Staf Operasional'
        : loginName;

    setUsername(displayName);
    setLogged(true);
    setLoginError('');
    notify(`Selamat datang, ${displayName} (${role})`);
  };

  const handleLogout = () => {
    setLogged(false);
    setPage('Dashboard');
    notify('Berhasil keluar dari sesi demo');
  };

  // Quick login presets
  const applyDemoPreset = (presetRole) => {
    if (presetRole === 'Admin') {
      setLoginName('admin');
      setPassword('laundry123');
      setRole('Admin');
    } else {
      setLoginName('pegawai');
      setPassword('laundry123');
      setRole('Pegawai');
    }
  };

  // Customer Management Handlers
  const handleOpenCustomer = (customer = null) => {
    setEditingItem(customer);
    setCustomerForm(
      customer
        ? { name: customer.name, phone: customer.phone, address: customer.address || '' }
        : { name: '', phone: '', address: '' }
    );
    setModal('customer');
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!customerForm.name.trim()) {
      notify('Nama pelanggan wajib diisi', 'error');
      return;
    }
    if (!customerForm.phone.trim() || customerForm.phone.trim().length < 8) {
      notify('Nomor telepon harus valid (minimal 8 angka)', 'error');
      return;
    }

    if (editingItem) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingItem.id ? { ...c, ...customerForm } : c))
      );
      notify(`Data pelanggan "${customerForm.name}" berhasil diperbarui`);
    } else {
      const newCustomer = {
        id: Date.now(),
        name: customerForm.name.trim(),
        phone: customerForm.phone.trim(),
        address: customerForm.address.trim()
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      notify(`Pelanggan "${newCustomer.name}" berhasil ditambahkan`);
    }
    setModal(null);
  };

  const handleDeleteCustomer = (customer) => {
    const customerTx = transactions.filter((t) => t.customerId === customer.id);
    if (customerTx.length > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Tidak Dapat Menghapus Pelanggan',
        message: `Pelanggan "${customer.name}" memiliki ${customerTx.length} riwayat transaksi dalam sistem.`,
        isBlocked: true,
        blockedReason: 'Untuk menjaga konsistensi riwayat nota cucian, pelanggan dengan transaksi aktif tidak dapat dihapus.',
        onConfirm: () => {},
        onClose: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Data Pelanggan?',
      message: `Apakah Anda yakin ingin menghapus pelanggan "${customer.name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus Pelanggan',
      isBlocked: false,
      onConfirm: () => {
        setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
        notify(`Pelanggan "${customer.name}" berhasil dihapus`);
      },
      onClose: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // Service Management Handlers
  const handleOpenService = (service = null) => {
    setEditingItem(service);
    setServiceForm(
      service
        ? {
            name: service.name,
            unit: service.unit,
            price: String(service.price),
            durationHours: String(service.durationHours),
            active: service.active
          }
        : { name: '', unit: 'kg', price: '', durationHours: '48', active: true }
    );
    setModal('service');
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) {
      notify('Nama layanan wajib diisi', 'error');
      return;
    }
    const priceNum = Number(serviceForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      notify('Tarif layanan harus berupa angka positif', 'error');
      return;
    }
    const durationNum = Number(serviceForm.durationHours);
    if (isNaN(durationNum) || durationNum <= 0) {
      notify('Durasi pengerjaan harus lebih besar dari 0 jam', 'error');
      return;
    }

    const serviceData = {
      name: serviceForm.name.trim(),
      unit: serviceForm.unit,
      price: priceNum,
      durationHours: durationNum,
      active: serviceForm.active
    };

    if (editingItem) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingItem.id ? { ...s, ...serviceData } : s))
      );
      notify(`Layanan "${serviceData.name}" berhasil diperbarui`);
    } else {
      const newService = {
        id: Date.now(),
        ...serviceData
      };
      setServices((prev) => [...prev, newService]);
      notify(`Layanan baru "${newService.name}" berhasil ditambahkan`);
    }
    setModal(null);
  };

  const handleToggleServiceActive = (service) => {
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s))
    );
    notify(`Status layanan "${service.name}" diubah menjadi ${!service.active ? 'Aktif' : 'Nonaktif'}`);
  };

  const handleDeleteService = (service) => {
    const serviceTx = transactions.filter((t) => t.serviceId === service.id);
    if (serviceTx.length > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Layanan Memiliki Transaksi Terkait',
        message: `Layanan "${service.name}" digunakan oleh ${serviceTx.length} transaksi dalam sistem.`,
        isBlocked: true,
        blockedReason: 'Anda disarankan untuk menonaktifkan layanan ini agar tidak dapat dipilih lagi, daripada menghapusnya.',
        onConfirm: () => {},
        onClose: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Layanan?',
      message: `Apakah Anda yakin ingin menghapus layanan "${service.name}" dari katalog?`,
      confirmText: 'Ya, Hapus Layanan',
      isBlocked: false,
      onConfirm: () => {
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        notify(`Layanan "${service.name}" berhasil dihapus`);
      },
      onClose: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
    });
  };

  // Transaction Creation Handlers
  const handleOpenTransaction = () => {
    const activeService = services.find((s) => s.active) || services[0];
    const firstCustomer = customers[0];

    setTxForm({
      customerId: firstCustomer ? String(firstCustomer.id) : '',
      serviceId: activeService ? String(activeService.id) : '',
      quantity: '1',
      paymentStatus: 'Belum Bayar',
      paymentMethod: 'Tunai',
      note: ''
    });
    setModal('transaction');
  };

  const currentSelectedService = serviceById(txForm.serviceId);
  const currentCalculatedTotal = Math.max(0, Number(txForm.quantity) || 0) * (currentSelectedService?.price || 0);
  const currentEstimatedHours = currentSelectedService?.durationHours || 48;
  const currentEstimatedDate = new Date(Date.now() + currentEstimatedHours * 3600000);

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!txForm.customerId) {
      notify('Pilih pelanggan terlebih dahulu', 'error');
      return;
    }
    if (!txForm.serviceId) {
      notify('Pilih layanan laundry', 'error');
      return;
    }
    const qty = Number(txForm.quantity);
    if (isNaN(qty) || qty <= 0) {
      notify('Jumlah atau berat cucian harus lebih besar dari 0', 'error');
      return;
    }

    const selectedService = serviceById(txForm.serviceId);
    const now = new Date();
    const newCode = generateTxCode(transactions);

    const newTx = {
      id: Date.now(),
      code: newCode,
      customerId: Number(txForm.customerId),
      serviceId: Number(txForm.serviceId),
      quantity: qty,
      unitPrice: selectedService.price,
      total: qty * selectedService.price,
      createdAt: now.toISOString(),
      estimatedAt: new Date(now.getTime() + selectedService.durationHours * 3600000).toISOString(),
      status: 'Menunggu',
      paymentStatus: txForm.paymentStatus,
      paymentMethod: txForm.paymentMethod,
      statusHistory: [
        {
          status: 'Menunggu',
          at: now.toISOString(),
          note: txForm.note.trim() || 'Cucian diterima di kasir'
        }
      ]
    };

    setTransactions((prev) => [newTx, ...prev]);
    setModal(null);
    notify(`Transaksi ${newTx.code} berhasil dicatat`);

    // Offer to immediately view receipt
    setSelectedTxForReceipt(newTx);
  };

  // Status & Payment Updates
  const handleUpdateStatus = (transaction, newStatus, customNote = '') => {
    if (transaction.status === newStatus && !customNote) return;
    const now = new Date().toISOString();
    const noteText = customNote || `Status pengerjaan diperbarui menjadi ${newStatus}`;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              status: newStatus,
              statusHistory: [
                ...t.statusHistory,
                { status: newStatus, at: now, note: noteText }
              ]
            }
          : t
      )
    );
    notify(`Status ${transaction.code} diperbarui: ${newStatus}`);
  };

  const handleSaveStatusModal = ({ status, note }) => {
    if (selectedTxForStatus) {
      handleUpdateStatus(selectedTxForStatus, status, note);
      setSelectedTxForStatus(null);
    }
  };

  const handleSavePaymentModal = ({ paymentStatus, paymentMethod }) => {
    if (selectedTxForPayment) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTxForPayment.id
            ? { ...t, paymentStatus, paymentMethod }
            : t
        )
      );
      notify(`Status pembayaran ${selectedTxForPayment.code} diubah menjadi ${paymentStatus}`);
      setSelectedTxForPayment(null);
    }
  };

  // Quick Tracking Jump
  const handleJumpToTracking = (code) => {
    setTrackCode(code);
    setPage('Tracking Cucian');
  };

  // Preset report date filters
  const setQuickPeriod = (days) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 86400000);
    setReportStart(start.toISOString().slice(0, 10));
    setReportEnd(end.toISOString().slice(0, 10));
  };

  // ==========================================
  // RENDER: LOGIN & PUBLIC TRACKING PORTAL
  // ==========================================
  if (showPublicTracking) {
    return (
      <PublicTrackingModal
        transactions={transactions}
        services={services}
        onClose={() => setShowPublicTracking(false)}
        onOpenReceipt={(t) => setSelectedTxForReceipt(t)}
      />
    );
  }

  if (!logged) {
    return (
      <div className="login-screen">
        {/* Left Side: Futuristic Visual Showcase */}
        <div className="login-art">
          <div className="login-brand">
            <div className="brand-mark">
              <Waves size={23} />
            </div>
            <span>
              TETEH<span className="brand-light">OS</span>
            </span>
          </div>

          <div className="art-copy">
            <span className="pill-label">
              <Sparkles size={13} /> SISTEM INFORMASI MANAJEMEN &amp; TRACKING LAUNDRY
            </span>
            <h1>
              Operasional Rapi.<br />
              <em>Visibilitas Real-time.</em>
            </h1>
            <p>
              Kelola pencatatan cucian, katalog layanan, pembaruan status pengerjaan, tracking nota pelanggan, dan simulasi pembayaran dalam satu platform terpadu.
            </p>

            <div className="art-stats">
              <div>
                <strong>01</strong>
                <span>Penerimaan &amp; Nota</span>
              </div>
              <div className="art-line" />
              <div>
                <strong>02</strong>
                <span>Pengerjaan Multi-tahap</span>
              </div>
              <div className="art-line" />
              <div>
                <strong>03</strong>
                <span>Siap Diambil &amp; Lunas</span>
              </div>
            </div>
          </div>

          <div className="art-orb orb-one" />
          <div className="art-orb orb-two" />

          <div className="login-foot">
           <span>&copy; 2026 Teteh Laundry</span>
          </div>
        </div>

        {/* Right Side: Login Form with Admin & Pegawai Demo Switcher */}
        <div className="login-panel">
          <div className="login-panel-inner">
            <div className="mobile-login-brand">
              <div className="brand-mark">
                <Waves size={22} />
              </div>
              <b>Teteh OS</b>
            </div>

            <div className="login-heading">
              <span className="eyebrow">WORKSPACE Login Teteh Laundry</span>
              <h2>Akses Sistem Laundry</h2>
              <p>Pilih akun demo Admin atau Pegawai untuk mengevaluasi fitur.</p>
            </div>

            {/* Quick Demo Switcher Pills */}
            <div className="quick-samples mb-16">
              <span className="qs-label">Pilihan Akses Cepat:</span>
              <button
                type="button"
                className={`sample-chip ${role === 'Admin' ? 'active font-bold' : ''}`}
                onClick={() => applyDemoPreset('Admin')}
              >
                <Shield size={12} /> Admin / Pemilik
              </button>
              <button
                type="button"
                className={`sample-chip ${role === 'Pegawai' ? 'active font-bold' : ''}`}
                onClick={() => applyDemoPreset('Pegawai')}
              >
                <UserCheck size={12} /> Pegawai Kasir
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <label>
                Nama Pengguna
                <input
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="admin atau pegawai"
                  autoComplete="username"
                  required
                />
              </label>

              <label>
                Kata Sandi
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="laundry123"
                  autoComplete="current-password"
                  required
                />
              </label>

              <label>
                Hak Akses Demo
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Admin">Admin / Pemilik (Akses Seluruh Modul)</option>
                  <option value="Pegawai">Pegawai (Operasional, Transaksi, Tracking)</option>
                </select>
              </label>

              {loginError && <p className="form-error">{loginError}</p>}

              <button className="btn btn-primary login-submit" type="submit">
                Masuk ke Workspace <ArrowRight size={17} />
              </button>
            </form>

            {/* Customer Public Tracking Shortcut Card */}
            <div className="public-portal-card">
              <div>
                <strong>Lacak Cucian Mandiri (Pelanggan)</strong>
                <p>Cari status cucian tanpa perlu login sebagai admin/pegawai.</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary public-portal-btn"
                onClick={() => setShowPublicTracking(true)}
              >
                <ScanSearch size={14} /> Buka Tracking Publik
              </button>
            </div>

            <div className="demo-note">
              <div className="note-icon">
                <CircleHelp size={17} />
              </div>
              <div>
                <b>WARNING</b>
                <p>
                  Peringatan sistem ini hanya untuk pegawai resmi.Akses tidak sah dilarang keras dan dapat dituntut secara hukum
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN APPLICATION WORKSPACE
  // ==========================================
  const activeTxForTracking =
    transactions.find((t) => t.code.toLowerCase() === trackCode.trim().toLowerCase()) ||
    (!trackCode ? transactions[0] : null);

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        page={page}
        setPage={setPage}
        role={role}
        setRole={setRole}
        username={username}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        activeCount={activeCount}
        onLogout={handleLogout}
        onShowHelp={() => setModal('help')}
      />

      {/* Main Content Area */}
      <main className="main-area">
        {/* Top Header / Breadcrumbs */}
        <Header
          page={page}
          username={username}
          role={role}
          setRole={setRole}
          setMobileNav={setMobileNav}
          onNotify={notify}
        />

        <div className="content-wrap">
          {/* Page Heading & Primary Action */}
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                MONITORING &amp; OPERASIONAL <span className="eyebrow-dot">&bull;</span> {role.toUpperCase()} MODE
              </div>
              <h1>
                {page === 'Dashboard'
                  ? 'Ringkasan Operasional Laundry'
                  : page}
              </h1>
              <p>
                {
                  {
                    Dashboard: 'Pantau metrik utama, cucian aktif, dan aktivitas harian laundry.',
                    Pelanggan: 'Kelola direktori pelanggan, kontak, dan riwayat pesanan.',
                    'Layanan & Harga': 'Atur katalog layanan, tarif per kg/item, dan estimasi durasi.',
                    Transaksi: 'Pencatatan cucian masuk, nomor nota otomatis, dan status pengerjaan.',
                    'Tracking Cucian': 'Lacak perjalanan cucian dari status Menunggu hingga Diserahkan.',
                    Laporan: 'Rekapitulasi transaksi, filter tanggal, dan ekspor data CSV.'
                  }[page]
                }
              </p>
            </div>

            {/* Contextual Primary Action Button */}
            {page === 'Dashboard' && (
              <button className="btn btn-primary" onClick={handleOpenTransaction}>
                <Plus size={17} /> Catat Transaksi Baru
              </button>
            )}
            {page === 'Pelanggan' && (
              <button className="btn btn-primary" onClick={() => handleOpenCustomer()}>
                <Plus size={17} /> Tambah Pelanggan
              </button>
            )}
            {page === 'Layanan & Harga' && role === 'Admin' && (
              <button className="btn btn-primary" onClick={() => handleOpenService()}>
                <Plus size={17} /> Tambah Layanan
              </button>
            )}
            {page === 'Transaksi' && (
              <button className="btn btn-primary" onClick={handleOpenTransaction}>
                <Plus size={17} /> Transaksi Masuk Baru
              </button>
            )}
          </div>

          {/* ==================================================== */}
          {/* TAB 1: DASHBOARD                                     */}
          {/* ==================================================== */}
          {page === 'Dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="welcome-strip">
                <div className="welcome-symbol">
                  <Sparkles size={21} />
                </div>
                <div>
                  <b>
                    Selamat bekerja, {username} <span>✦</span>
                  </b>
                  <p>
                    {activeCount} cucian sedang dalam proses pengerjaan, dan {readyCount} siap diambil oleh pelanggan.
                  </p>
                </div>
                <div className="welcome-right">
                  <span className="online-dot" /> DATA DUMMY AKTIF
                </div>
              </div>

              {/* 4 KPI Metrics */}
              <div className="kpi-grid">
                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Transaksi Hari Ini</span>
                    <span className="kpi-icon blue">
                      <ClipboardList size={18} />
                    </span>
                  </div>
                  <div className="kpi-value">
                    {String(todayTransactions.length).padStart(2, '0')} Nota
                  </div>
                  <div className="kpi-trend">
                    <span className="trend-symbol">
                      <TrendingUp size={13} />
                    </span>
                    Aktivitas pesanan hari ini
                  </div>
                  <div className="kpi-accent blue" />
                </article>

                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Pendapatan Lunas</span>
                    <span className="kpi-icon violet">
                      <Wallet size={18} />
                    </span>
                  </div>
                  <div className="kpi-value">{money(revenuePaid)}</div>
                  <div className="kpi-trend">
                    <span className="trend-symbol">
                      <TrendingUp size={13} />
                    </span>
                    Dari transaksi berstatus Lunas
                  </div>
                  <div className="kpi-accent violet" />
                </article>

                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Sedang Diproses</span>
                    <span className="kpi-icon amber">
                      <Clock3 size={18} />
                    </span>
                  </div>
                  <div className="kpi-value">
                    {String(activeCount).padStart(2, '0')} Pesanan
                  </div>
                  <div className="kpi-trend">
                    <span className="trend-symbol">
                      <RefreshCw size={13} />
                    </span>
                    Memerlukan perhatian staf
                  </div>
                  <div className="kpi-accent amber" />
                </article>

                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Siap Diambil</span>
                    <span className="kpi-icon green">
                      <PackageCheck size={18} />
                    </span>
                  </div>
                  <div className="kpi-value">
                    {String(readyCount).padStart(2, '0')} Pesanan
                  </div>
                  <div className="kpi-trend">
                    <span className="trend-symbol">
                      <CheckCircle2 size={13} />
                    </span>
                    Menunggu pengambilan
                  </div>
                  <div className="kpi-accent green" />
                </article>
              </div>

              {/* Dashboard Split: Recent Transactions + Workflow Distribution */}
              <div className="dashboard-grid">
                {/* Recent Transactions Panel */}
                <section className="panel recent-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Transaksi Terbaru</h3>
                      <p>Daftar nota cucian yang baru masuk</p>
                    </div>
                    <button className="text-action" onClick={() => setPage('Transaksi')}>
                      Buka Semua Transaksi <ArrowRight size={15} />
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>KODE NOTA</th>
                          <th>PELANGGAN</th>
                          <th>TOTAL BIAYA</th>
                          <th>STATUS</th>
                          <th className="align-right">AKSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.slice(0, 5).map((t) => {
                          const customer = customerById(t.customerId);
                          return (
                            <tr key={t.id}>
                              <td>
                                <button
                                  type="button"
                                  className="code-link"
                                  onClick={() => handleJumpToTracking(t.code)}
                                >
                                  {t.code}
                                </button>
                                <small className="cell-sub">{dateTime(t.createdAt)}</small>
                              </td>
                              <td>
                                <div className="customer-cell">
                                  <div className="mini-avatar">
                                    {(customer?.name || '?').slice(0, 1)}
                                  </div>
                                  <span>{customer?.name || 'Pelanggan'}</span>
                                </div>
                              </td>
                              <td className="amount">{money(t.total)}</td>
                              <td>
                                <Badge>{t.status}</Badge>
                              </td>
                              <td>
                                <div className="table-actions">
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    title="Lacak Status"
                                    onClick={() => handleJumpToTracking(t.code)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    title="Cetak Nota"
                                    onClick={() => setSelectedTxForReceipt(t)}
                                  >
                                    <Printer size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="panel-footer">
                    <span>
                      Menampilkan {Math.min(5, transactions.length)} dari {transactions.length} pesanan
                    </span>
                    <button type="button" onClick={() => setPage('Transaksi')}>
                      Ke Halaman Transaksi <ArrowRight size={14} />
                    </button>
                  </div>
                </section>

                {/* Status Breakdown Workflow Panel */}
                <section className="panel workflow-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Alur Pengerjaan Cucian</h3>
                      <p>Distribusi status {transactions.length} cucian</p>
                    </div>
                    <span className="tiny-live">
                      <i /> LIVE DEMO
                    </span>
                  </div>

                  <div className="workflow-total">
                    <strong>{transactions.length}</strong>
                    <span>Total seluruh pesanan cucian tercatat</span>
                  </div>

                  <div className="workflow-list">
                    {STATUSES.map((s) => {
                      const count = transactions.filter((t) => t.status === s).length;
                      const pct = transactions.length
                        ? Math.max((count / transactions.length) * 100, count ? 10 : 0)
                        : 0;
                      return (
                        <div className="workflow-row" key={s}>
                          <div className="workflow-label">
                            <span className={`workflow-dot ${statusClass(s)}`} />
                            <span>{s}</span>
                            <b>{count}</b>
                          </div>
                          <div className="progress-track">
                            <div
                              className={`progress-fill ${statusClass(s)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="outline-full"
                    onClick={() => setPage('Tracking Cucian')}
                  >
                    Buka Halaman Tracking <ArrowRight size={15} />
                  </button>
                </section>
              </div>

              {/* Bottom Operational Status Bar */}
              <section className="bottom-info">
                <div className="bottom-info-icon">
                  <CheckCircle2 size={19} />
                </div>
                <div>
                  <b>Workspace Berjalan Normal</b>
                  <p>
                    Data tersimpan di memori browser selama sesi aktif dan dapat di-refresh kembali ke seed awal.
                  </p>
                </div>
                <span className="bottom-info-time">Pukul {timeOnly(new Date())}</span>
              </section>
            </>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PELANGGAN                                     */}
          {/* ==================================================== */}
          {page === 'Pelanggan' && (
            <section className="panel list-panel">
              <div className="list-toolbar">
                <div className="searchbox">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama, nomor telepon, atau alamat..."
                    autoFocus
                  />
                  {query && (
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setQuery('')}
                      aria-label="Hapus pencarian"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
                <span className="result-count">{filteredCustomers.length} pelanggan ditemukan</span>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PELANGGAN</th>
                      <th>NOMOR TELEPON</th>
                      <th>ALAMAT</th>
                      <th>RIWAYAT PESANAN</th>
                      <th className="align-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => {
                      const customerTx = transactions.filter((t) => t.customerId === c.id);
                      return (
                        <tr key={c.id}>
                          <td>
                            <div className="customer-cell">
                              <div className="mini-avatar">{c.name.slice(0, 1)}</div>
                              <div>
                                <b>{c.name}</b>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="subtle-text">
                              <Phone size={13} /> {c.phone}
                            </span>
                          </td>
                          <td>
                            <span className="address-cell">
                              <MapPin size={13} /> {c.address || '-'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="count-pill clickable-pill"
                              onClick={() => setSelectedCustomerForDetail(c)}
                              title="Klik untuk melihat riwayat transaksi lengkap"
                            >
                              <ClipboardList size={12} /> {customerTx.length} Transaksi
                            </button>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="icon-btn"
                                title="Lihat Profil & Riwayat"
                                onClick={() => setSelectedCustomerForDetail(c)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                type="button"
                                className="icon-btn"
                                title="Edit Pelanggan"
                                onClick={() => handleOpenCustomer(c)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                className="icon-btn danger-icon"
                                title="Hapus Pelanggan"
                                onClick={() => handleDeleteCustomer(c)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredCustomers.length === 0 && (
                  <div className="empty-state">
                    <div>
                      <Search size={22} />
                    </div>
                    <b>Pelanggan Tidak Ditemukan</b>
                    <span>Coba gunakan kata kunci pencarian nama atau nomor telepon yang berbeda.</span>
                    <button
                      type="button"
                      className="btn btn-secondary mt-8"
                      onClick={() => handleOpenCustomer()}
                    >
                      <Plus size={15} /> Tambah Pelanggan Baru
                    </button>
                  </div>
                )}
              </div>

              <div className="panel-footer">
                <span>Manajemen database pelanggan prototipe</span>
                <span>Menampilkan {filteredCustomers.length} dari {customers.length} data</span>
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* TAB 3: LAYANAN & HARGA (Admin Access)                */}
          {/* ==================================================== */}
          {page === 'Layanan & Harga' && (
            <>
              {role === 'Pegawai' ? (
                <div className="panel empty-state">
                  <Shield size={32} className="text-amber" />
                  <b>Akses Terbatas: Khusus Admin / Pemilik</b>
                  <span>
                    Sebagai Pegawai, Anda memiliki wewenang untuk transaksi dan tracking, namun pengaturan tarif layanan hanya dapat dikelola oleh Admin.
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary mt-8"
                    onClick={() => setRole('Admin')}
                  >
                    Beralih ke Peran Admin
                  </button>
                </div>
              ) : (
                <>
                  <div className="service-intro">
                    <div>
                      <div className="eyebrow">KATALOG TARIF OPERASIONAL</div>
                      <h2>Daftar Layanan Laundry</h2>
                      <p>Tarif dasar per kilogram atau per satuan item beserta estimasi durasi pengerjaan.</p>
                    </div>
                    <div className="service-stat">
                      <span>LAYANAN AKTIF</span>
                      <b>{services.filter((s) => s.active).length.toString().padStart(2, '0')} Paket</b>
                    </div>
                  </div>

                  <div className="service-grid">
                    {filteredServices.map((s, i) => (
                      <article className="service-card" key={s.id}>
                        <div className={`service-icon service-tone-${i % 4}`}>
                          <Shirt size={22} />
                        </div>
                        <div className="service-card-top">
                          <button
                            type="button"
                            className="badge-toggle-btn"
                            onClick={() => handleToggleServiceActive(s)}
                            title="Klik untuk ubah status aktif/nonaktif"
                          >
                            <Badge kind={s.active ? 'done' : 'wait'}>
                              {s.active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </button>
                        </div>

                        <h3>{s.name}</h3>
                        <p>Estimasi standar pengerjaan ~{s.durationHours} jam</p>

                        <div className="service-price">
                          <strong>{money(s.price)}</strong>
                          <span> / {s.unit === 'kg' ? 'Kilogram (kg)' : 'Item Pcs'}</span>
                        </div>

                        <div className="service-card-bottom">
                          <span>
                            <Clock3 size={14} /> {s.durationHours} Jam
                          </span>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="text-action mr-8"
                              onClick={() => handleOpenService(s)}
                            >
                              Edit <ArrowRight size={14} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn danger-icon"
                              title="Hapus Layanan"
                              onClick={() => handleDeleteService(s)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}

                    <button
                      type="button"
                      className="add-service-card"
                      onClick={() => handleOpenService()}
                    >
                      <span>
                        <Plus size={22} />
                      </span>
                      <b>Tambah Layanan Baru</b>
                      <small>Tambahkan pilihan paket cuci atau satuan baru</small>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ==================================================== */}
          {/* TAB 4: TRANSAKSI                                     */}
          {/* ==================================================== */}
          {page === 'Transaksi' && (
            <section className="panel list-panel">
              {/* Search Toolbar */}
              <div className="list-toolbar">
                <div className="searchbox">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari nomor nota, nama pelanggan, atau layanan..."
                  />
                  {query && (
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setQuery('')}
                      aria-label="Bersihkan"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOpenTransaction}
                >
                  <Plus size={16} /> Transaksi Masuk
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="filter-pills">
                <span className="qs-label">Filter Status:</span>
                {['Semua', ...STATUSES].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Transactions Table */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>KODE NOTA / TANGGAL</th>
                      <th>PELANGGAN</th>
                      <th>LAYANAN &amp; QTY</th>
                      <th>TOTAL BIAYA</th>
                      <th>STATUS CUCIAN</th>
                      <th>PEMBAYARAN</th>
                      <th className="align-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => {
                      const customer = customerById(t.customerId);
                      const service = serviceById(t.serviceId);

                      return (
                        <tr key={t.id}>
                          <td>
                            <button
                              type="button"
                              className="code-link"
                              onClick={() => setSelectedTxForReceipt(t)}
                              title="Klik untuk membuka nota"
                            >
                              {t.code}
                            </button>
                            <small className="cell-sub">{dateTime(t.createdAt)}</small>
                          </td>
                          <td>
                            <div className="customer-cell">
                              <b>{customer?.name || 'Pelanggan'}</b>
                            </div>
                            <small className="cell-sub">{customer?.phone || '-'}</small>
                          </td>
                          <td>
                            <b>{service?.name || '-'}</b>
                            <small className="cell-sub">
                              {t.quantity} {service?.unit || 'kg'} &times; {money(t.unitPrice)}
                            </small>
                          </td>
                          <td className="amount">{money(t.total)}</td>
                          <td>
                            {/* Status Quick Dropdown or Modal Trigger */}
                            <button
                              type="button"
                              className="status-chip-btn"
                              onClick={() => setSelectedTxForStatus(t)}
                              title="Klik untuk ubah status pengerjaan"
                            >
                              <Badge>{t.status}</Badge>
                            </button>
                          </td>
                          <td>
                            {/* Payment Status Modal Trigger */}
                            <button
                              type="button"
                              className="payment-chip-btn"
                              onClick={() => setSelectedTxForPayment(t)}
                              title="Klik untuk perbarui status pembayaran"
                            >
                              <Badge type="payment">{t.paymentStatus}</Badge>
                              <small className="cell-sub">{t.paymentMethod || 'Tunai'}</small>
                            </button>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="icon-btn"
                                title="Perbarui Status Cucian"
                                onClick={() => setSelectedTxForStatus(t)}
                              >
                                <RefreshCw size={15} />
                              </button>
                              <button
                                type="button"
                                className="icon-btn"
                                title="Lacak di Halaman Tracking"
                                onClick={() => handleJumpToTracking(t.code)}
                              >
                                <ScanSearch size={15} />
                              </button>
                              <button
                                type="button"
                                className="icon-btn"
                                title="Cetak Nota Transaksi"
                                onClick={() => setSelectedTxForReceipt(t)}
                              >
                                <Printer size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredTransactions.length === 0 && (
                  <div className="empty-state">
                    <div>
                      <ClipboardList size={22} />
                    </div>
                    <b>Transaksi Tidak Ditemukan</b>
                    <span>
                      {query || statusFilter !== 'Semua'
                        ? 'Tidak ada pesanan cucian yang cocok dengan filter aktif.'
                        : 'Belum ada transaksi tercatat dalam sistem.'}
                    </span>
                    {(query || statusFilter !== 'Semua') && (
                      <button
                        type="button"
                        className="btn btn-secondary mt-8"
                        onClick={() => {
                          setQuery('');
                          setStatusFilter('Semua');
                        }}
                      >
                        Reset Filter Pencarian
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="panel-footer">
                <span>Manajemen Transaksi Kasir Teteh OS</span>
                <span>
                  Menampilkan {filteredTransactions.length} dari {transactions.length} pesanan
                </span>
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* TAB 5: TRACKING STATUS CUCIAN                        */}
          {/* ==================================================== */}
          {page === 'Tracking Cucian' && (
            <>
              {/* Search Bar for Tracking */}
              <section className="tracking-search panel">
                <div className="tracking-search-icon">
                  <ScanSearch size={24} />
                </div>
                <div className="tracking-copy">
                  <h3>Pelacakan Status &amp; Riwayat Cucian</h3>
                  <p>Masukkan nomor nota transaksi untuk memantau tahapan proses cuci hingga selesai.</p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!transactions.some((t) => t.code.toLowerCase() === trackCode.trim().toLowerCase())) {
                      notify(`Nomor nota "${trackCode}" tidak ditemukan`, 'error');
                    }
                  }}
                >
                  <div className="searchbox tracking-input">
                    <Search size={17} />
                    <input
                      value={trackCode}
                      onChange={(e) => setTrackCode(e.target.value)}
                      placeholder="Contoh: LDR-20261011-001"
                      autoFocus
                    />
                  </div>
                  <button className="btn btn-primary" type="submit">
                    Lacak Cucian <ArrowRight size={16} />
                  </button>
                </form>
              </section>

              {/* Sample Chips */}
              <div className="quick-samples mb-16">
                <span className="qs-label">Pilih Nota Contoh:</span>
                {transactions.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`sample-chip ${trackCode === t.code ? 'active font-bold' : ''}`}
                    onClick={() => setTrackCode(t.code)}
                  >
                    {t.code} ({t.status})
                  </button>
                ))}
              </div>

              {/* Tracking Result View */}
              {activeTxForTracking ? (
                (() => {
                  const t = activeTxForTracking;
                  const customer = customerById(t.customerId);
                  const service = serviceById(t.serviceId);

                  return (
                    <div className="tracking-result-grid">
                      {/* Left: Journey Timeline */}
                      <section className="panel tracking-result">
                        <div className="panel-heading">
                          <div>
                            <span className="eyebrow">RIWAYAT &amp; STATUS PROGRES</span>
                            <h3>{t.code}</h3>
                            <p>Diterima pada {dateTime(t.createdAt)}</p>
                          </div>
                          <Badge>{t.status}</Badge>
                        </div>

                        {/* Customer & Service Strip */}
                        <div className="track-customer">
                          <div className="mini-avatar">
                            {(customer?.name || '?').slice(0, 1)}
                          </div>
                          <div>
                            <b>{customer?.name || 'Pelanggan'}</b>
                            <span>
                              {service?.name} &bull; {t.quantity} {service?.unit}
                            </span>
                          </div>
                          <strong>{money(t.total)}</strong>
                        </div>

                        {/* ETA Highlight */}
                        <div className="eta-card">
                          <div className="eta-icon">
                            <Clock3 size={20} />
                          </div>
                          <div>
                            <span>ESTIMASI WAKTU SELESAI</span>
                            <b>{dateFmt(t.estimatedAt)}</b>
                            <small>
                              {t.status === 'Selesai/Diserahkan'
                                ? 'Pesanan telah selesai dan diserahkan ke pelanggan.'
                                : 'Estimasi dapat disesuaikan menurut antrean dan kondisi cuaca.'}
                            </small>
                          </div>
                        </div>

                        {/* Vertical Status Timeline */}
                        <h4 className="section-mini-title">Perjalanan Pengerjaan Cucian</h4>
                        <div className="status-timeline">
                          {t.statusHistory.map((h, i) => (
                            <div className="timeline-item" key={i}>
                              <div className="timeline-rail">
                                <span className={`timeline-marker ${statusClass(h.status)}`}>
                                  {i === t.statusHistory.length - 1 ? <Check size={12} /> : null}
                                </span>
                                {i < t.statusHistory.length - 1 && <i />}
                              </div>
                              <div className="timeline-copy">
                                <b>{h.status}</b>
                                <p>{h.note || 'Pembaruan operasional'}</p>
                                <small>{dateTime(h.at)}</small>
                              </div>
                              {i === t.statusHistory.length - 1 && (
                                <span className="current-label">TERKINI</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="modal-actions px-20 mt-16">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setSelectedTxForStatus(t)}
                          >
                            <RefreshCw size={15} /> Perbarui Status Pengerjaan
                          </button>
                        </div>
                      </section>

                      {/* Right: Order Summary Sidebar */}
                      <section className="panel track-side">
                        <div className="panel-heading">
                          <div>
                            <h3>Informasi Nota</h3>
                            <p>Rincian data transaksi</p>
                          </div>
                          <FileText size={19} className="muted-icon" />
                        </div>

                        <div className="info-list">
                          <div className="info-row">
                            <span>Nomor Transaksi</span>
                            <b>{t.code}</b>
                          </div>
                          <div className="info-row">
                            <span>Pelanggan</span>
                            <b>{customer?.name || '-'}</b>
                          </div>
                          <div className="info-row">
                            <span>Nomor Telepon</span>
                            <b>{customer?.phone || '-'}</b>
                          </div>
                          <div className="info-row">
                            <span>Status Pembayaran</span>
                            <Badge type="payment">{t.paymentStatus}</Badge>
                          </div>
                          <div className="info-row">
                            <span>Metode Pembayaran</span>
                            <b>{t.paymentMethod || 'Tunai'}</b>
                          </div>
                          <div className="info-row">
                            <span>Total Biaya</span>
                            <b className="text-primary font-bold">{money(t.total)}</b>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="outline-full"
                          onClick={() => setSelectedTxForReceipt(t)}
                        >
                          <Printer size={16} /> Cetak Nota Transaksi
                        </button>

                        <div className="support-note">
                          <CircleHelp size={17} />
                          <span>
                            Pelanggan juga dapat melacak nomor nota ini melalui portal tracking mandiri publik tanpa perlu login.
                          </span>
                        </div>
                      </section>
                    </div>
                  );
                })()
              ) : (
                <div className="panel tracking-empty">
                  <div className="empty-illustration">
                    <ScanSearch size={30} />
                  </div>
                  <h3>Nomor Transaksi Tidak Ditemukan</h3>
                  <p>Pastikan kode nota yang dimasukkan sesuai dengan format (contoh: LDR-20261011-001).</p>
                  <span>
                    Tips: Coba gunakan salah satu nomor transaksi contoh di atas.
                  </span>
                </div>
              )}
            </>
          )}

          {/* ==================================================== */}
          {/* TAB 6: LAPORAN (Admin Access)                        */}
          {/* ==================================================== */}
          {page === 'Laporan' && (
            <>
              {role === 'Pegawai' ? (
                <div className="panel empty-state">
                  <Shield size={32} className="text-amber" />
                  <b>Akses Terbatas: Laporan Khusus Admin / Pemilik</b>
                  <span>
                    Laporan keuangan dan ekspor CSV hanya dapat diakses oleh pemilik atau administrator toko laundry.
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary mt-8"
                    onClick={() => setRole('Admin')}
                  >
                    Beralih ke Peran Admin
                  </button>
                </div>
              ) : (
                <>
                  {/* Period Filter Card */}
                  <section className="panel report-filter">
                    <div>
                      <h3>Filter Periode Laporan</h3>
                      <p>Pilih rentang tanggal untuk menganalisis pendapatan dan ekspor rekapitulasi.</p>
                      <div className="quick-samples mt-8">
                        <span className="qs-label">Pintasan Periode:</span>
                        <button
                          type="button"
                          className="sample-chip"
                          onClick={() => setQuickPeriod(0)}
                        >
                          Hari Ini
                        </button>
                        <button
                          type="button"
                          className="sample-chip"
                          onClick={() => setQuickPeriod(7)}
                        >
                          7 Hari Terakhir
                        </button>
                        <button
                          type="button"
                          className="sample-chip"
                          onClick={() => setQuickPeriod(30)}
                        >
                          30 Hari Terakhir
                        </button>
                        <button
                          type="button"
                          className="sample-chip"
                          onClick={() => {
                            setReportStart('');
                            setReportEnd('');
                          }}
                        >
                          Semua Periode
                        </button>
                      </div>
                    </div>

                    <div className="date-filters">
                      <label>
                        Dari Tanggal
                        <input
                          type="date"
                          value={reportStart}
                          onChange={(e) => setReportStart(e.target.value)}
                        />
                      </label>
                      <label>
                        Sampai Tanggal
                        <input
                          type="date"
                          value={reportEnd}
                          onChange={(e) => setReportEnd(e.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setReportStart('');
                          setReportEnd('');
                        }}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          exportTransactionsToCSV(reportTransactions, customers, services)
                        }
                      >
                        <Download size={16} /> Ekspor CSV (Excel)
                      </button>
                    </div>
                  </section>

                  {/* Summary KPIs for selected report period */}
                  <div className="report-kpis">
                    <article className="kpi-card">
                      <div className="kpi-top">
                        <span>Total Transaksi Periode</span>
                        <span className="kpi-icon blue">
                          <ClipboardList size={18} />
                        </span>
                      </div>
                      <div className="kpi-value">{reportTransactions.length} Pesanan</div>
                      <div className="kpi-trend">Berdasarkan filter tanggal aktif</div>
                      <div className="kpi-accent blue" />
                    </article>

                    <article className="kpi-card">
                      <div className="kpi-top">
                        <span>Pendapatan Lunas</span>
                        <span className="kpi-icon violet">
                          <Wallet size={18} />
                        </span>
                      </div>
                      <div className="kpi-value">
                        {money(
                          reportTransactions
                            .filter((t) => t.paymentStatus === 'Lunas')
                            .reduce((sum, t) => sum + t.total, 0)
                        )}
                      </div>
                      <div className="kpi-trend">Dana terkonfirmasi masuk</div>
                      <div className="kpi-accent violet" />
                    </article>

                    <article className="kpi-card">
                      <div className="kpi-top">
                        <span>Piutang / Belum Lunas</span>
                        <span className="kpi-icon amber">
                          <CreditCard size={18} />
                        </span>
                      </div>
                      <div className="kpi-value">
                        {money(
                          reportTransactions
                            .filter((t) => t.paymentStatus !== 'Lunas')
                            .reduce((sum, t) => sum + t.total, 0)
                        )}
                      </div>
                      <div className="kpi-trend">Status Belum Bayar atau DP</div>
                      <div className="kpi-accent amber" />
                    </article>
                  </div>

                  {/* Filtered Report Table */}
                  <section className="panel list-panel">
                    <div className="panel-heading report-table-heading">
                      <div>
                        <h3>Rincian Transaksi Laporan</h3>
                        <p>
                          {reportStart || reportEnd
                            ? `Periode: ${reportStart || 'Awal'} s.d. ${reportEnd || 'Sekarang'}`
                            : 'Seluruh riwayat transaksi dalam database dummy'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary no-print"
                        onClick={() => window.print()}
                      >
                        <Printer size={16} /> Cetak / PDF Laporan
                      </button>
                    </div>

                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>KODE NOTA</th>
                            <th>TANGGAL MASUK</th>
                            <th>PELANGGAN</th>
                            <th>TOTAL</th>
                            <th>STATUS CUCIAN</th>
                            <th>STATUS BAYAR</th>
                            <th>METODE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportTransactions.map((t) => {
                            const c = customerById(t.customerId);
                            return (
                              <tr key={t.id}>
                                <td>
                                  <strong className="code-text">{t.code}</strong>
                                </td>
                                <td>{dateFmt(t.createdAt)}</td>
                                <td>{c?.name || '-'}</td>
                                <td className="amount">{money(t.total)}</td>
                                <td>
                                  <Badge>{t.status}</Badge>
                                </td>
                                <td>
                                  <Badge type="payment">{t.paymentStatus}</Badge>
                                </td>
                                <td>{t.paymentMethod || 'Tunai'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {reportTransactions.length === 0 && (
                        <div className="empty-state">
                          <div>
                            <CalendarDays size={22} />
                          </div>
                          <b>Tidak Ada Transaksi Pada Periode Ini</b>
                          <span>Silakan sesuaikan tanggal mulai dan tanggal selesai filter.</span>
                        </div>
                      )}
                    </div>

                    <div className="panel-footer">
                      <span>{reportTransactions.length} transaksi tercatat pada periode ini</span>
                      <span>
                        Total Akumulasi Transaksi:{' '}
                        <b>{money(reportTransactions.reduce((s, t) => s + t.total, 0))}</b>
                      </span>
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>

        {/* Global Footer */}
        <footer className="app-footer">
          <span>
            &copy; 2026 Teteh LaundryOS <i />
          </span>
          <span>
            BUILT FOR OPERATIONAL EXCELLENCE <Waves size={13} />
          </span>
        </footer>
      </main>

      {/* ==================================================== */}
      {/* MODALS & DIALOGS                                     */}
      {/* ==================================================== */}

      {/* 1. Modal Tambah / Edit Pelanggan */}
      {modal === 'customer' && (
        <Modal
          title={editingItem ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
          eyebrow="DATABASE PELANGGAN"
          onClose={() => setModal(null)}
        >
          <form className="modal-form" onSubmit={handleSaveCustomer}>
            <label>
              Nama Lengkap Pelanggan *
              <input
                autoFocus
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                placeholder="Contoh: Nadia Putri"
                required
              />
            </label>

            <label>
              Nomor Telepon (WhatsApp) *
              <input
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                placeholder="Contoh: 081298761234"
                required
              />
            </label>

            <label>
              Alamat Lengkap
              <textarea
                rows="3"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                placeholder="Contoh: Jl. Melati No. 18, Jakarta Selatan"
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModal(null)}
              >
                Batal
              </button>
              <button className="btn btn-primary" type="submit">
                {editingItem ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. Modal Tambah / Edit Layanan */}
      {modal === 'service' && (
        <Modal
          title={editingItem ? 'Edit Layanan Laundry' : 'Tambah Layanan Baru'}
          eyebrow="KATALOG &amp; HARGA"
          onClose={() => setModal(null)}
        >
          <form className="modal-form" onSubmit={handleSaveService}>
            <label>
              Nama Paket Layanan *
              <input
                autoFocus
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="Contoh: Cuci Kilat Express"
                required
              />
            </label>

            <div className="form-two-col">
              <label>
                Satuan Hitung Tarif
                <select
                  value={serviceForm.unit}
                  onChange={(e) => setServiceForm({ ...serviceForm, unit: e.target.value })}
                >
                  <option value="kg">Per Kilogram (kg)</option>
                  <option value="item">Per Satuan Item (pcs)</option>
                </select>
              </label>

              <label>
                Harga / Tarif (Rp) *
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  placeholder="10000"
                  required
                />
              </label>
            </div>

            <label>
              Estimasi Durasi Pengerjaan (Jam) *
              <input
                type="number"
                min="1"
                value={serviceForm.durationHours}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, durationHours: e.target.value })
                }
                placeholder="48"
                required
              />
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                checked={serviceForm.active}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, active: e.target.checked })
                }
              />
              Layanan aktif dan dapat dipilih saat mencatat transaksi cucian baru
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModal(null)}
              >
                Batal
              </button>
              <button className="btn btn-primary" type="submit">
                {editingItem ? 'Simpan Perubahan' : 'Tambahkan Layanan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Modal Transaksi Masuk Baru */}
      {modal === 'transaction' && (
        <Modal
          title="Catat Cucian Masuk Baru"
          eyebrow="FORM TRANSAKSI KASIR"
          onClose={() => setModal(null)}
          wide
        >
          <form className="modal-form" onSubmit={handleCreateTransaction}>
            <div className="form-two-col">
              <label>
                Pilih Pelanggan *
                <select
                  value={txForm.customerId}
                  onChange={(e) => setTxForm({ ...txForm, customerId: e.target.value })}
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} &bull; {c.phone}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Pilih Paket Layanan *
                <select
                  value={txForm.serviceId}
                  onChange={(e) => setTxForm({ ...txForm, serviceId: e.target.value })}
                  required
                >
                  {services
                    .filter((s) => s.active)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} &mdash; {money(s.price)} / {s.unit} (~{s.durationHours} jam)
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="form-two-col">
              <label>
                Berat / Kuantitas ({currentSelectedService?.unit === 'item' ? 'Item Pcs' : 'Kilogram kg'}) *
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={txForm.quantity}
                  onChange={(e) => setTxForm({ ...txForm, quantity: e.target.value })}
                  required
                />
              </label>

              <label>
                Catatan Khusus Cucian
                <input
                  value={txForm.note}
                  onChange={(e) => setTxForm({ ...txForm, note: e.target.value })}
                  placeholder="Contoh: Pewangi lavender, noda kerah kemeja"
                />
              </label>
            </div>

            {/* Live Calculation Banner */}
            <div className="transaction-total">
              <div>
                <span>Estimasi Selesai (Otomatis)</span>
                <b>{dateFmt(currentEstimatedDate)} &bull; {timeOnly(currentEstimatedDate)} WIB</b>
                <small className="rc-sub">Durasi paket: ~{currentEstimatedHours} jam</small>
              </div>
              <div>
                <span>Total Biaya Transaksi</span>
                <strong>{money(currentCalculatedTotal)}</strong>
                <small className="rc-sub">
                  {txForm.quantity || 0} &times; {money(currentSelectedService?.price || 0)}
                </small>
              </div>
            </div>

            <div className="form-two-col">
              <label>
                Status Pembayaran Awal
                <select
                  value={txForm.paymentStatus}
                  onChange={(e) => setTxForm({ ...txForm, paymentStatus: e.target.value })}
                >
                  <option value="Belum Bayar">Belum Bayar</option>
                  <option value="DP">DP (Uang Muka)</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </label>

              <label>
                Metode Pembayaran (Simulasi)
                <select
                  value={txForm.paymentMethod}
                  onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value })}
                >
                  <option value="Tunai">Tunai</option>
                  <option value="Transfer">Transfer Bank</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </label>
            </div>

            <p className="helper-note">
              <AlertCircle size={15} /> Nomor nota akan dibuat secara otomatis dengan format <code>LDR-YYYYMMDD-XXX</code>.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModal(null)}
              >
                Batal
              </button>
              <button className="btn btn-primary" type="submit">
                <Plus size={16} /> Buat Transaksi &amp; Terbitkan Nota
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Modal Panduan Demo & Bantuan */}
      {modal === 'help' && (
        <Modal
          title="Panduan Penggunaan Prototipe"
          eyebrow="BANTUAN &amp; DOKUMENTASI DEMO"
          onClose={() => setModal(null)}
          wide
        >
          <div className="customer-detail-content">
            <div className="info-list">
              <div className="info-row">
                <span>1. Peran Admin vs Pegawai</span>
                <b>Ganti peran kapan saja via badge di sidebar atau topbar. Admin memiliki hak penuh termasuk Layanan &amp; Laporan.</b>
              </div>
              <div className="info-row">
                <span>2. Transaksi &amp; Perhitungan</span>
                <b>Kuantitas &times; Tarif otomatis terhitung. Estimasi selesai dihitung dari waktu input + durasi layanan.</b>
              </div>
              <div className="info-row">
                <span>3. Status Cucian &amp; Timeline</span>
                <b>Klik status cucian pada tabel transaksi untuk menambah entri riwayat dan catatan operasional pengerjaan.</b>
              </div>
              <div className="info-row">
                <span>4. Cetak Nota Transaksi</span>
                <b>Klik ikon printer pada transaksi untuk melihat struk nota resmi dan mencetak lewat dialog cetak browser.</b>
              </div>
              <div className="info-row">
                <span>5. Tracking Publik Pelanggan</span>
                <b>Buka &quot;Tracking Publik&quot; di layar masuk demo untuk mensimulasikan pencarian nota oleh pelanggan.</b>
              </div>
              <div className="info-row">
                <span>6. Ekspor Laporan CSV</span>
                <b>Pada halaman Laporan, filter periode tanggal dan klik &quot;Ekspor CSV&quot; untuk mengunduh rekap spreadsheet.</b>
              </div>
            </div>

            <div className="modal-actions mt-16">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setModal(null)}
              >
                Mengerti &amp; Tutup Panduan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. Modal Cetak Nota / Struk Transaksi */}
      {selectedTxForReceipt && (
        <ReceiptModal
          transaction={selectedTxForReceipt}
          customer={customerById(selectedTxForReceipt.customerId)}
          service={serviceById(selectedTxForReceipt.serviceId)}
          onClose={() => setSelectedTxForReceipt(null)}
          onTrackTransaction={(code) => {
            setSelectedTxForReceipt(null);
            handleJumpToTracking(code);
          }}
          onNotify={notify}
        />
      )}

      {/* 6. Modal Perbarui Pembayaran */}
      {selectedTxForPayment && (
        <PaymentModal
          transaction={selectedTxForPayment}
          customer={customerById(selectedTxForPayment.customerId)}
          onClose={() => setSelectedTxForPayment(null)}
          onSave={handleSavePaymentModal}
        />
      )}

      {/* 7. Modal Perbarui Status Cucian */}
      {selectedTxForStatus && (
        <StatusModal
          transaction={selectedTxForStatus}
          onClose={() => setSelectedTxForStatus(null)}
          onSave={handleSaveStatusModal}
        />
      )}

      {/* 8. Modal Detail & Riwayat Transaksi Pelanggan */}
      {selectedCustomerForDetail && (
        <CustomerDetailModal
          customer={selectedCustomerForDetail}
          transactions={transactions}
          services={services}
          onClose={() => setSelectedCustomerForDetail(null)}
          onOpenReceipt={(t) => setSelectedTxForReceipt(t)}
          onTrackTransaction={handleJumpToTracking}
        />
      )}

      {/* 9. In-app Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isBlocked={confirmDialog.isBlocked}
        blockedReason={confirmDialog.blockedReason}
        onConfirm={confirmDialog.onConfirm}
        onClose={confirmDialog.onClose}
      />

      {/* 10. Global Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
