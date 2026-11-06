import React from 'react';
import {
  LayoutDashboard,
  Users,
  Shirt,
  ClipboardList,
  ScanSearch,
  FileText,
  Waves,
  X,
  ChevronDown,
  CircleHelp,
  Settings,
  LogOut,
  Shield,
  UserCheck
} from 'lucide-react';

export default function Sidebar({
  page,
  setPage,
  role,
  setRole,
  username,
  mobileNav,
  setMobileNav,
  activeCount,
  onLogout,
  onShowHelp
}) {
  const allNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { name: 'Pelanggan', icon: Users, adminOnly: false },
    { name: 'Layanan & Harga', icon: Shirt, adminOnly: true },
    { name: 'Transaksi', icon: ClipboardList, adminOnly: false },
    { name: 'Tracking Cucian', icon: ScanSearch, adminOnly: false },
    { name: 'Laporan', icon: FileText, adminOnly: true }
  ];

  const visibleNav = allNavItems.filter((item) => (role === 'Pegawai' ? !item.adminOnly : true));

  const handleNavClick = (name) => {
    setPage(name);
    setMobileNav(false);
  };

  const toggleRole = () => {
    const nextRole = role === 'Admin' ? 'Pegawai' : 'Admin';
    setRole(nextRole);
    // If on an admin-only page and switching to Pegawai, redirect to Transaksi or Dashboard
    if (nextRole === 'Pegawai' && (page === 'Laporan' || page === 'Layanan & Harga')) {
      setPage('Dashboard');
    }
  };

  return (
    <>
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Waves size={22} />
          </div>
          <div>
            <b>
              TETEH<span>OS</span>
            </b>
            <small>LAUNDRY MANAGEMENT</small>
          </div>
          <button
            type="button"
            className="icon-btn close-nav"
            onClick={() => setMobileNav(false)}
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace Card with Demo Role Switcher */}
        <div className="workspace">
          <div className="workspace-icon">
            <Shirt size={17} />
          </div>
          <div>
            <b>TETEH Laundry</b>
            <small>BUKIT DURI</small>
          </div>
          <button
            type="button"
            className="role-switch-badge"
            onClick={toggleRole}
            title="Klik untuk ganti peran demo (Admin / Pegawai)"
          >
            {role === 'Admin' ? <Shield size={11} /> : <UserCheck size={11} />}
            <span>{role}</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="nav-label">NAVIGASI UTAMA</div>
        <nav>
          {visibleNav.map((n) => {
            const Icon = n.icon;
            const isActive = page === n.name;
            return (
              <button
                key={n.name}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(n.name)}
              >
                <Icon size={18} />
                <span>{n.name}</span>
                {n.name === 'Tracking Cucian' && activeCount > 0 && (
                  <span className="nav-count">{activeCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pegawai Notice if any */}
        {role === 'Pegawai' && (
          <div className="pegawai-role-note">
            <small>
              <strong>Mode Pegawai:</strong> Akses katalog layanan &amp; laporan keuangan dibatasi untuk Admin/Pemilik.
            </small>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={18} />
            </div>
            <b>Panduan Operasional</b>
            <p>Kelola pencatatan cucian, update status pengerjaan, dan cetak nota.</p>
            <button type="button" onClick={onShowHelp}>
              Buka Bantuan &rarr;
            </button>
          </div>

          <div className="profile">
            <div className="avatar">{username.slice(0, 1).toUpperCase()}</div>
            <div className="profile-info">
              <b>{username}</b>
              <span>{role} &bull; Mode Demo</span>
            </div>
            <button
              type="button"
              className="icon-btn profile-out"
              title="Keluar / Logout"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {mobileNav && (
        <div
          className="mobile-scrim"
          onClick={() => setMobileNav(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
