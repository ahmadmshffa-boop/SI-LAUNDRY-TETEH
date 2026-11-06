import React from 'react';
import { Menu, Bell, ChevronDown, Shield, UserCheck } from 'lucide-react';

export default function Header({
  page,
  username,
  role,
  setRole,
  setMobileNav,
  onNotify
}) {
  const toggleRole = () => {
    const nextRole = role === 'Admin' ? 'Pegawai' : 'Admin';
    setRole(nextRole);
    onNotify(`Beralih ke peran ${nextRole}`);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-btn menu-toggle"
          onClick={() => setMobileNav(true)}
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumbs">
          <span>Teteh OS</span>
          <span className="crumb-slash">/</span>
          <b>{page}</b>
        </div>
      </div>

      <div className="topbar-right">
        <div className="live-chip">
          <span /> Sistem Operasional Berjalan
        </div>

        {/* Quick Role switcher chip */}
        <button
          type="button"
          className="top-role-pill"
          onClick={toggleRole}
          title="Klik untuk beralih mode demo Admin / Pegawai"
        >
          {role === 'Admin' ? <Shield size={12} /> : <UserCheck size={12} />}
          <span>Peran: <strong>{role}</strong></span>
        </button>

        <button
          type="button"
          className="icon-btn notification-btn"
          onClick={() => onNotify('Semua cucian aktif terpantau dengan baik')}
          aria-label="Notifikasi sistem"
        >
          <Bell size={18} />
          <i />
        </button>

        <div className="top-profile">
          <div className="avatar small-avatar">
            {username.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <b>{username}</b>
            <span>{role} &bull; Demo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
