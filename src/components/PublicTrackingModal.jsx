import React, { useState } from 'react';
import { Search, ScanSearch, CheckCircle2, Clock3, Waves, ArrowRight, Printer, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import Badge from './Badge';
import { money, dateFmt, dateTime, statusClass } from '../data/formatters';

export default function PublicTrackingModal({ transactions = [], services = [], onClose, onOpenReceipt }) {
  const [trackCode, setTrackCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const trimmedCode = trackCode.trim();
  const matchedTx = transactions.find(
    (t) => t.code.toLowerCase() === trimmedCode.toLowerCase()
  );

  const service = matchedTx ? services.find((s) => s.id === matchedTx.serviceId) : null;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!trimmedCode) {
      setErrorMessage('Silakan masukkan nomor transaksi yang tertera pada nota.');
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    if (!matchedTx) {
      setErrorMessage(`Nomor transaksi "${trimmedCode}" tidak ditemukan. Pastikan format nomor nota sesuai (Contoh: LDR-20261011-001).`);
    } else {
      setErrorMessage('');
    }
  };

  const handleQuickSample = (sampleCode) => {
    setTrackCode(sampleCode);
    setHasSearched(true);
    setErrorMessage('');
  };

  return (
    <div className="public-track-fullscreen" role="dialog" aria-modal="true">
      <div className="public-track-container">
        {/* Header */}
        <div className="public-track-header">
          <div className="pt-brand">
            <div className="brand-mark">
              <Waves size={20} />
            </div>
            <div>
              <h3>TETEH Laundry</h3>
              <span className="pt-subtitle">Portal Lacak Status Cucian Publik Pelanggan</span>
            </div>
          </div>
          <button type="button" className="btn btn-secondary back-to-login-btn" onClick={onClose}>
            <ArrowLeft size={16} /> Kembali ke Halaman Masuk
          </button>
        </div>

        {/* Search bar */}
        <div className="public-search-card panel">
          <div className="public-search-head">
            <div className="public-search-icon">
              <ScanSearch size={24} />
            </div>
            <div>
              <h4>Pantau Progres Cucian Anda</h4>
              <p>Masukkan kode nota transaksi Anda untuk mengetahui status pengerjaan secara real-time.</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="public-search-form">
            <div className="searchbox public-input-wrap">
              <Search size={18} />
              <input
                value={trackCode}
                onChange={(e) => {
                  setTrackCode(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan nomor transaksi (contoh: LDR-20261011-001)"
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary public-submit-btn">
              Lacak Cucian <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="quick-samples">
            <span className="qs-label">Coba nomor contoh:</span>
            {transactions.slice(0, 3).map((t) => (
              <button
                key={t.id}
                type="button"
                className="sample-chip"
                onClick={() => handleQuickSample(t.code)}
              >
                {t.code} ({t.status})
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="public-error-banner">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Result area */}
        {matchedTx && (
          <div className="tracking-result-grid public-result-grid">
            {/* Timeline section */}
            <section className="panel tracking-result">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">HASIL PELACAKAN CUCIAN</span>
                  <h3>{matchedTx.code}</h3>
                  <p>Tanggal Masuk: {dateTime(matchedTx.createdAt)}</p>
                </div>
                <Badge>{matchedTx.status}</Badge>
              </div>

              {/* ETA Highlight */}
              <div className="eta-card">
                <div className="eta-icon">
                  <Clock3 size={20} />
                </div>
                <div>
                  <span>ESTIMASI WAKTU SELESAI</span>
                  <b>{dateFmt(matchedTx.estimatedAt)}</b>
                  <small>
                    {matchedTx.status === 'Selesai/Diserahkan'
                      ? 'Pesanan telah selesai dan diserahkan kepada Anda.'
                      : 'Waktu selesai dapat sedikit bervariasi bergantung pada beban pengeringan & cuaca.'}
                  </small>
                </div>
              </div>

              {/* Status journey timeline */}
              <h4 className="section-mini-title">Riwayat & Perjalanan Pengerjaan</h4>
              <div className="status-timeline">
                {matchedTx.statusHistory?.map((h, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-rail">
                      <span className={`timeline-marker ${statusClass(h.status)}`}>
                        {i === matchedTx.statusHistory.length - 1 ? <Check size={12} /> : null}
                      </span>
                      {i < matchedTx.statusHistory.length - 1 && <i />}
                    </div>
                    <div className="timeline-copy">
                      <b>{h.status}</b>
                      <p>{h.note || 'Pembaruan operasional'}</p>
                      <small>{dateTime(h.at)}</small>
                    </div>
                    {i === matchedTx.statusHistory.length - 1 && (
                      <span className="current-label">TERKINI</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Sidebar info */}
            <section className="panel track-side">
              <div className="panel-heading">
                <div>
                  <h3>Rincian Cucian</h3>
                  <p>Ringkasan paket layanan</p>
                </div>
              </div>

              <div className="info-list">
                <div className="info-row">
                  <span>Nomor Nota</span>
                  <b>{matchedTx.code}</b>
                </div>
                <div className="info-row">
                  <span>Paket Layanan</span>
                  <b>{service?.name || 'Laundry'}</b>
                </div>
                <div className="info-row">
                  <span>Jumlah Cucian</span>
                  <b>
                    {matchedTx.quantity} {service?.unit || 'kg'}
                  </b>
                </div>
                <div className="info-row">
                  <span>Total Biaya</span>
                  <b className="text-primary font-bold">{money(matchedTx.total)}</b>
                </div>
                <div className="info-row">
                  <span>Status Pembayaran</span>
                  <Badge type="payment">{matchedTx.paymentStatus}</Badge>
                </div>
                <div className="info-row">
                  <span>Metode Pembayaran</span>
                  <b>{matchedTx.paymentMethod || 'Tunai'}</b>
                </div>
              </div>

              <button
                type="button"
                className="outline-full"
                onClick={() => onOpenReceipt(matchedTx)}
              >
                <Printer size={16} /> Lihat / Cetak Nota Transaksi
              </button>

              <div className="support-note">
                <CheckCircle2 size={18} className="text-success" />
                <span>
                  <strong>Akses Aman Publik:</strong> Hanya menampilkan data pengerjaan cucian sesuai nomor transaksi nota Anda tanpa membuka data identitas pribadi lainnya.
                </span>
              </div>
            </section>
          </div>
        )}

        {!matchedTx && !hasSearched && (
          <div className="public-track-placeholder panel">
            <ScanSearch size={44} className="placeholder-icon" />
            <h4>Cari status cucian Anda sekarang</h4>
            <p>Ketik nomor transaksi yang tertera pada nota fisik atau struk digital Anda untuk melihat status pengerjaan.</p>
          </div>
        )}

        {/* Footer */}
        <div className="public-track-footer">
          <span>TETEH Laundry  &bull; TRACKING STATUS</span>
          <button type="button" className="inline-link" onClick={onClose}>
            Masuk sebagai Admin / Pegawai
          </button>
        </div>
      </div>
    </div>
  );
}
