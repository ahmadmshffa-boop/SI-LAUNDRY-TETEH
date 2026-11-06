import React from 'react';
import { Phone, MapPin, ClipboardList, Wallet, Eye, Printer, X, Sparkles } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import { money, dateFmt } from '../data/formatters';

export default function CustomerDetailModal({
  customer,
  transactions = [],
  services = [],
  onClose,
  onOpenReceipt,
  onTrackTransaction
}) {
  if (!customer) return null;

  const customerTx = transactions.filter((t) => t.customerId === customer.id);
  const totalSpent = customerTx.reduce((sum, t) => sum + (t.paymentStatus === 'Lunas' ? t.total : 0), 0);
  const activeTxCount = customerTx.filter((t) => !['Siap Diambil', 'Selesai/Diserahkan'].includes(t.status)).length;

  const serviceById = (id) => services.find((s) => s.id === Number(id));

  return (
    <Modal
      title={`Profil & Riwayat: ${customer.name}`}
      eyebrow="DETAIL DATA PELANGGAN"
      onClose={onClose}
      wide
    >
      <div className="customer-detail-content">
        {/* Customer Header Info */}
        <div className="customer-info-strip">
          <div className="cust-avatar-large">
            {customer.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="cust-info-main">
            <h3>{customer.name}</h3>
            <div className="cust-meta-row">
              <span>
                <Phone size={13} /> {customer.phone}
              </span>
              <span>
                <MapPin size={13} /> {customer.address || 'Alamat belum diatur'}
              </span>
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="cust-stats-grid">
          <div className="cust-stat-box">
            <span className="csb-label">TOTAL TRANSAKSI</span>
            <strong>{customerTx.length} Pesanan</strong>
          </div>
          <div className="cust-stat-box">
            <span className="csb-label">PESANAN AKTIF</span>
            <strong className="text-amber">{activeTxCount} Sedang Berjalan</strong>
          </div>
          <div className="cust-stat-box">
            <span className="csb-label">TOTAL DIBELANJAKAN</span>
            <strong className="text-primary">{money(totalSpent)}</strong>
          </div>
        </div>

        {/* Transactions list */}
        <div className="cust-history-heading">
          <h4>Riwayat Pesanan Laundry ({customerTx.length})</h4>
          <small>Daftar seluruh transaksi yang pernah dilakukan pelanggan ini</small>
        </div>

        {customerTx.length === 0 ? (
          <div className="empty-sub-state">
            <ClipboardList size={24} />
            <p>Belum ada transaksi untuk pelanggan ini.</p>
          </div>
        ) : (
          <div className="table-wrap cust-tx-table">
            <table>
              <thead>
                <tr>
                  <th>KODE NOTA</th>
                  <th>TANGGAL</th>
                  <th>LAYANAN</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>PEMBAYARAN</th>
                  <th className="align-right">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {customerTx.map((t) => {
                  const s = serviceById(t.serviceId);
                  return (
                    <tr key={t.id}>
                      <td>
                        <strong className="code-text">{t.code}</strong>
                      </td>
                      <td>{dateFmt(t.createdAt)}</td>
                      <td>
                        {s?.name || '-'}
                        <small className="cell-sub">
                          {t.quantity} {s?.unit || 'kg'}
                        </small>
                      </td>
                      <td className="amount">{money(t.total)}</td>
                      <td>
                        <Badge>{t.status}</Badge>
                      </td>
                      <td>
                        <Badge type="payment">{t.paymentStatus}</Badge>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            title="Lacak Cucian"
                            onClick={() => {
                              onClose();
                              onTrackTransaction(t.code);
                            }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title="Cetak Nota"
                            onClick={() => {
                              onClose();
                              onOpenReceipt(t);
                            }}
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
          </div>
        )}

        <div className="modal-actions mt-16">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
