import React, { useState } from 'react';
import {
  Printer,
  Waves,
  Clock3,
  CheckCircle2,
  QrCode,
  AlertCircle,
  Copy,
  Check,
  ScanSearch,
  Phone,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import { money, dateFmt, dateTime } from '../data/formatters';

export default function ReceiptModal({
  transaction,
  customer,
  service,
  onClose,
  onTrackTransaction,
  onNotify
}) {
  const [copied, setCopied] = useState(false);
  const [paperFormat, setPaperFormat] = useState('thermal58'); // 'thermal58' | 'standard'

  if (!transaction) return null;

  const handlePrint = () => {
    const slipElement =
      paperFormat === 'thermal58'
        ? document.getElementById('printable-thermal-slip')
        : document.getElementById('printable-receipt-card');

    if (!slipElement) {
      window.print();
      return;
    }

    try {
      const existingIframe = document.getElementById('thermal-print-frame');
      if (existingIframe) existingIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'thermal-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Struk Kasir - ${transaction.code}</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 0;
            }
            * { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 2mm 3mm 8mm;
              width: 58mm;
              background: #fff;
              color: #000;
              font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 10px;
              line-height: 1.35;
            }
            .thermal-header { text-align: center; display: flex; flex-direction: column; align-items: center; }
            .thermal-logo-box {
              width: 36px; height: 36px; border-radius: 8px;
              background: #2563eb !important; color: #fff !important;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 5px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .thermal-logo-box svg { stroke: #fff; }
            .thermal-shop-name { font-size: 13px; font-weight: 900; margin: 0; color: #000; letter-spacing: 0.5px; }
            .thermal-shop-sub { font-size: 8px; font-weight: 800; color: #000; letter-spacing: 0.5px; }
            .thermal-address { font-size: 8px; color: #222; margin: 3px 0 0; line-height: 1.3; }
            .thermal-dashed-line { border-top: 1px dashed #000; margin: 5px 0; }
            .thermal-meta-list { display: grid; gap: 2.5px; font-size: 9px; }
            .thermal-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; }
            .thermal-row span:first-child { font-weight: 600; color: #000; }
            .thermal-row strong, .thermal-row span:last-child { font-weight: 800; color: #000; text-align: right; }
            .thermal-address-text { max-width: 140px; word-break: break-word; }
            .thermal-status-pill { border: 1px solid #000; padding: 1px 4px; font-size: 8px; border-radius: 2px; }
            .thermal-order-block { padding: 1px 0; }
            .thermal-item-title { font-weight: 800; font-size: 10px; color: #000; }
            .thermal-item-calc { font-size: 9px; }
            .thermal-totals-block { display: grid; gap: 2.5px; font-size: 9px; }
            .thermal-grand-total {
              font-size: 11px; font-weight: 900; border-top: 1px solid #000; border-bottom: 1px solid #000;
              padding: 3px 0; margin: 3px 0; color: #000;
            }
            .thermal-badge-stamp { border: 1px solid #000; padding: 1px 4px; font-size: 8px; border-radius: 2px; }
            .thermal-tracking-section { text-align: center; display: flex; flex-direction: column; align-items: center; }
            .thermal-track-label { font-size: 7.5px; font-weight: 800; color: #000; }
            .thermal-code-box { margin: 3px 0 4px; }
            .thermal-code-box code { font-size: 13px; font-weight: 900; font-family: monospace; border: 1px solid #000; padding: 2px 6px; border-radius: 3px; color: #000; }
            .thermal-qr-wrap { margin: 3px auto; }
            .thermal-qr-svg { width: 75px; height: 75px; display: block; }
            .thermal-track-info { font-size: 8px; color: #222; margin: 3px 0 0; line-height: 1.3; }
            .thermal-terms { font-size: 7.5px; color: #222; line-height: 1.35; }
            .thermal-terms strong { font-size: 7.5px; color: #000; }
            .thermal-terms ol { margin: 0; padding-left: 12px; }
            .thermal-signatures { display: flex; justify-content: space-between; text-align: center; font-size: 8px; margin-top: 4px; }
            .thermal-sig-space { height: 20px; }
            .thermal-footer { text-align: center; font-size: 7.5px; color: #333; margin-top: 5px; }
            .no-print, .thermal-copy-action { display: none !important; }
          </style>
        </head>
        <body>
          ${slipElement.innerHTML}
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 250);
    } catch (err) {
      console.warn('Iframe print error, fallback to window.print', err);
      window.print();
    }
  };

  const handleCopyCode = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(transaction.code);
      setCopied(true);
      if (onNotify) onNotify(`Kode tracking ${transaction.code} disalin ke clipboard!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isPaid = transaction.paymentStatus === 'Lunas';
  const isDP = transaction.paymentStatus === 'DP';
  const paidAmount = isPaid
    ? transaction.total
    : isDP
    ? Math.round(transaction.total / 2)
    : 0;
  const remainingAmount = transaction.total - paidAmount;

  return (
    <Modal
      title="Cetak Struk / Nota Kasir"
      eyebrow="FORMAT KERTAS THERMAL KASIR 58 MM"
      onClose={onClose}
      wide={paperFormat === 'standard'}
      customClass="receipt-modal-container"
    >
      <div className="receipt-sheet-wrapper">
        {/* Format Selector Bar (Thermal 58mm vs Format Lebar) */}
        <div className="receipt-format-bar no-print">
          <div className="format-toggle-group">
            <button
              type="button"
              className={`format-btn ${paperFormat === 'thermal58' ? 'active' : ''}`}
              onClick={() => setPaperFormat('thermal58')}
            >
              <Receipt size={14} /> Struk Kasir Thermal (57 / 58 mm)
            </button>
            <button
              type="button"
              className={`format-btn ${paperFormat === 'standard' ? 'active' : ''}`}
              onClick={() => setPaperFormat('standard')}
            >
              Format Nota Lebar
            </button>
          </div>
          <span className="thermal-hint">
            {paperFormat === 'thermal58' ? '✦ Lebar 58mm monokrom (hanya logo berwarna)' : '✦ Tampilan dokumen A4'}
          </span>
        </div>

        {/* ======================================================== */}
        {/* TAMPILAN 1: FORMAT THERMAL KASIR 57 / 58 MM (DEFAULT)     */}
        {/* ======================================================== */}
        {paperFormat === 'thermal58' ? (
          <div className="thermal-roll-container">
            <div className="thermal-receipt-paper printable-thermal-receipt" id="printable-thermal-slip">
              {/* Kop Struk Thermal: Hanya Logo Saja yang Berwarna */}
              <div className="thermal-header">
                <div className="thermal-logo-box">
                  <Waves size={20} />
                </div>
                <h3 className="thermal-shop-name">TETEH LAUNDRY</h3>
                <span className="thermal-shop-sub">WET CLEAN &amp; EXPRESS SERVICE</span>
                <p className="thermal-address">
                  Jl.ROOS BARAT 4 Jakarta Selatan<br />
                  Telp/WA: 0857-7265-4880 &bull; NIB: 021 8304279
                </p>
              </div>

              <div className="thermal-dashed-line" />

              {/* Data Nota & Waktu Administrasi */}
              <div className="thermal-meta-list">
                <div className="thermal-row">
                  <span>NO. NOTA</span>
                  <strong>{transaction.code}</strong>
                </div>
                <div className="thermal-row">
                  <span>WAKTU MASUK</span>
                  <span>{dateTime(transaction.createdAt)}</span>
                </div>
                <div className="thermal-row">
                  <span>EST. SELESAI</span>
                  <strong>{dateTime(transaction.estimatedAt)}</strong>
                </div>
                <div className="thermal-row">
                  <span>KASIR</span>
                  <span>Staf Kasir Shift 1</span>
                </div>
                <div className="thermal-row">
                  <span>STATUS</span>
                  <strong className="thermal-status-pill">{transaction.status.toUpperCase()}</strong>
                </div>
              </div>

              <div className="thermal-dashed-line" />

              {/* Data Pelanggan */}
              <div className="thermal-meta-list">
                <div className="thermal-row">
                  <span>PELANGGAN</span>
                  <strong>{customer?.name || 'Pelanggan'}</strong>
                </div>
                <div className="thermal-row">
                  <span>ID MEMBER</span>
                  <span>CUST-{String(customer?.id || 1).padStart(4, '0')}</span>
                </div>
                <div className="thermal-row">
                  <span>NO. HP / WA</span>
                  <span>{customer?.phone || '-'}</span>
                </div>
                <div className="thermal-row">
                  <span>ALAMAT</span>
                  <span className="thermal-address-text">{customer?.address || 'Ambil di Toko'}</span>
                </div>
              </div>

              <div className="thermal-dashed-line" />

              {/* Rincian Layanan & Tarif (Gaya Kasir Thermal Ringkas) */}
              <div className="thermal-order-block">
                <div className="thermal-item-title">
                  <strong>{service?.name || 'Layanan Laundry'}</strong>
                </div>
                <div className="thermal-row thermal-item-calc">
                  <span>
                    {transaction.quantity} {service?.unit === 'item' ? 'item' : 'kg'} &times;{' '}
                    {money(transaction.unitPrice || service?.price || 0)}
                  </span>
                  <strong>{money(transaction.total)}</strong>
                </div>
              </div>

              <div className="thermal-dashed-line" />

              {/* Perhitungan Biaya & Pembayaran */}
              <div className="thermal-totals-block">
                <div className="thermal-row">
                  <span>Subtotal:</span>
                  <span>{money(transaction.total)}</span>
                </div>
                <div className="thermal-row">
                  <span>Diskon Promo:</span>
                  <span>- Rp 0</span>
                </div>
                <div className="thermal-row thermal-grand-total">
                  <strong>TOTAL AKHIR:</strong>
                  <strong>{money(transaction.total)}</strong>
                </div>
                <div className="thermal-row thermal-payment-status">
                  <span>STATUS BAYAR:</span>
                  <strong className="thermal-badge-stamp">
                    {isPaid ? 'LUNAS' : isDP ? 'DP DITERIMA' : 'BELUM BAYAR'}
                  </strong>
                </div>
                <div className="thermal-row">
                  <span>METODE BAYAR:</span>
                  <span>{transaction.paymentMethod || 'Tunai'} (Simulasi)</span>
                </div>
                <div className="thermal-row">
                  <span>TERBAYAR:</span>
                  <span>{money(paidAmount)}</span>
                </div>
                <div className="thermal-row">
                  <span>SISA TAGIHAN:</span>
                  <strong>{money(remainingAmount)}</strong>
                </div>
              </div>

              <div className="thermal-dashed-line" />

              {/* Kotak Kode Tracking Mandiri + QR Code Monokrom */}
              <div className="thermal-tracking-section">
                <span className="thermal-track-label">* KODE TRACKING CUCIAN ANDA *</span>
                <div className="thermal-code-box">
                  <code>{transaction.code}</code>
                </div>

                {/* QR Code Thermal Monokrom Hitam-Putih */}
                <div className="thermal-qr-wrap">
                  <svg
                    className="thermal-qr-svg"
                    viewBox="0 0 100 100"
                    width="80"
                    height="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Position detection corners */}
                    <rect x="6" y="6" width="30" height="30" fill="#000000" />
                    <rect x="12" y="12" width="18" height="18" fill="#ffffff" />
                    <rect x="16" y="16" width="10" height="10" fill="#000000" />

                    <rect x="64" y="6" width="30" height="30" fill="#000000" />
                    <rect x="70" y="12" width="18" height="18" fill="#ffffff" />
                    <rect x="74" y="16" width="10" height="10" fill="#000000" />

                    <rect x="6" y="64" width="30" height="30" fill="#000000" />
                    <rect x="12" y="70" width="18" height="18" fill="#ffffff" />
                    <rect x="16" y="74" width="10" height="10" fill="#000000" />

                    {/* Data dots */}
                    <rect x="42" y="10" width="7" height="7" fill="#000000" />
                    <rect x="52" y="10" width="7" height="7" fill="#000000" />
                    <rect x="42" y="22" width="7" height="7" fill="#000000" />
                    <rect x="52" y="28" width="7" height="7" fill="#000000" />
                    <rect x="10" y="44" width="7" height="7" fill="#000000" />
                    <rect x="22" y="50" width="7" height="7" fill="#000000" />
                    <rect x="42" y="44" width="16" height="16" fill="#000000" />
                    <rect x="64" y="44" width="7" height="7" fill="#000000" />
                    <rect x="76" y="50" width="7" height="7" fill="#000000" />
                    <rect x="84" y="44" width="7" height="7" fill="#000000" />
                    <rect x="44" y="68" width="7" height="7" fill="#000000" />
                    <rect x="54" y="78" width="7" height="7" fill="#000000" />
                    <rect x="68" y="68" width="9" height="9" fill="#000000" />
                    <rect x="82" y="78" width="7" height="7" fill="#000000" />
                  </svg>
                </div>

                <p className="thermal-track-info">
                  Scan QR / Lacak status cucian secara mandiri 24 jam melalui portal online:
                  <br />
                  <b>freshfold.laundryos.app/tracking</b>
                </p>

                <div className="thermal-copy-action no-print">
                  <button
                    type="button"
                    className="thermal-copy-btn"
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'Tersalin!' : 'Salin Nomor Kode'}</span>
                  </button>
                </div>
              </div>

              <div className="thermal-dashed-line" />

              {/* Syarat & Ketentuan Ringkas Ala Kasir */}
              <div className="thermal-terms">
                <strong>SYARAT &amp; KETENTUAN PENGAMBILAN:</strong>
                <ol>
                  <li>Struk ini adalah bukti sah serah terima pakaian.</li>
                  <li>Periksa pakaian saat ambil. Komplain maks 1x24 jam.</li>
                  <li>Cucian &gt;30 hari di luar tanggung jawab laundry.</li>
                  <li>Cucian diatas 30 hari dibagikan ke panti asuhan</li>
                </ol>
              </div>

              <div className="thermal-dashed-line" />

              {/* Tanda Tangan Singkat & Footer Kasir */}
              <div className="thermal-signatures">
                <div>
                  <span>Pelanggan,</span>
                  <div className="thermal-sig-space" />
                  <strong>( {customer?.name || 'Pelanggan'} )</strong>
                </div>
                <div>
                  <span>Kasir,</span>
                  <div className="thermal-sig-space" />
                  <strong>( Staf Kasir )</strong>
                </div>
              </div>

              <div className="thermal-footer">
                <p>*** TERIMA KASIH ATAS KUNJUNGAN ANDA ***</p>
                <small>TETEH OS &bull; Simpan struk ini untuk melacak status</small>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* TAMPILAN 2: FORMAT NOTA LEBAR RESMI                      */
          /* ======================================================== */
          <div className="receipt-paper printable-receipt" id="printable-receipt-card">
            {/* Header Resmi */}
            <div className="receipt-header-official">
              <div className="receipt-brand-official">
                <div className="official-logo-box">
                  <Waves size={24} />
                </div>
                <div className="official-brand-text">
                  <div className="official-company-title">
                    <h2>TETEH LAUNDRY &amp; DRY CLEANING</h2>
                    <span className="official-legal-tag">TERDAFTAR &bull; NIB 021 8304279</span>
                  </div>
                  <p className="official-tagline">
                    Layanan Cuci Kiloan, Satuan Premium, Bed Cover &amp; Wet Clean Terstandarisasi
                  </p>
                  <div className="official-contact-strip">
                    <span>
                      <MapPin size={12} /> Jl. ROOS BARAT. 05, Bukit Duri, Jakarta Selatan 12840
                    </span>
                    <span>
                      <Phone size={12} /> Hotline / WA: 0857-7265-4880 &bull; Buka 07.00 - 21.00 WIB
                    </span>
                  </div>
                </div>
              </div>

              <div className="receipt-official-stamp-box">
                <span className="doc-category-badge">SURAT TANDA TERIMA RESMI</span>
                <div className="doc-invoice-number">
                  <small>NO. NOTA / BUKTI</small>
                  <strong>{transaction.code}</strong>
                </div>
                <div className="doc-watermark-pill">
                  <ShieldCheck size={12} /> DOKUMEN TERCATAT
                </div>
              </div>
            </div>

            <div className="receipt-double-divider" />

            {/* Dua Kolom Pihak Terlibat */}
            <div className="receipt-parties-grid">
              <div className="party-card party-customer">
                <div className="party-header">
                  <User size={14} className="party-icon" />
                  <span>INFORMASI PELANGGAN (PEMILIK CUCIAN)</span>
                </div>
                <div className="party-body">
                  <div className="party-name-row">
                    <h4 className="party-name">{customer?.name || 'Pelanggan Umum'}</h4>
                    <span className="customer-id-chip">
                      ID: CUST-{String(customer?.id || 1).padStart(4, '0')}
                    </span>
                  </div>
                  <div className="party-meta-item">
                    <span className="meta-label">No. Handphone / WhatsApp:</span>
                    <strong className="meta-value text-dark">{customer?.phone || '-'}</strong>
                  </div>
                  <div className="party-meta-item">
                    <span className="meta-label">Alamat / Lokasi Pengantaran:</span>
                    <span className="meta-value">{customer?.address || 'Antar / Ambil Mandiri di Toko'}</span>
                  </div>
                </div>
              </div>

              <div className="party-card party-operation">
                <div className="party-header">
                  <Calendar size={14} className="party-icon" />
                  <span>DATA ADMINISTRASI &amp; WAKTU PENGERJAAN</span>
                </div>
                <div className="party-body">
                  <div className="operation-meta-grid">
                    <div>
                      <span className="meta-label">Waktu Diterima:</span>
                      <strong className="meta-value">{dateTime(transaction.createdAt)}</strong>
                    </div>
                    <div>
                      <span className="meta-label">Estimasi Selesai (Target Siap):</span>
                      <strong className="meta-value text-primary highlight-eta">
                        {dateTime(transaction.estimatedAt)}
                      </strong>
                    </div>
                    <div>
                      <span className="meta-label">Layanan &amp; Kuantitas:</span>
                      <strong className="meta-value text-dark">
                        {service?.name || 'Layanan Laundry'} &bull; {transaction.quantity}{' '}
                        {service?.unit === 'item' ? 'Item' : 'Kg'}
                      </strong>
                    </div>
                    <div>
                      <span className="meta-label">Status Pengerjaan:</span>
                      <Badge>{transaction.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rekapitulasi Biaya & Pembayaran */}
            <div className="receipt-financial-row">
              <div className="payment-status-card">
                <span className="meta-label">STATUS ADMINISTRASI PEMBAYARAN</span>
                <div className="payment-detail-list">
                  <div className="p-row">
                    <span>Metode Pembayaran:</span>
                    <strong>{transaction.paymentMethod || 'Tunai'} (Simulasi)</strong>
                  </div>
                  <div className="p-row">
                    <span>Status Finansial:</span>
                    <Badge type="payment">{transaction.paymentStatus}</Badge>
                  </div>
                  <div className="p-row">
                    <span>Jumlah Terbayar:</span>
                    <strong>{money(paidAmount)}</strong>
                  </div>
                  <div className="p-row p-sisa">
                    <span>Sisa Tagihan:</span>
                    <strong className={remainingAmount > 0 ? 'text-danger' : 'text-success'}>
                      {money(remainingAmount)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="totals-calculation-box">
                <div className="calc-row">
                  <span>Tarif &amp; Kuantitas:</span>
                  <span>
                    {transaction.quantity} {service?.unit === 'item' ? 'item' : 'kg'} &times;{' '}
                    {money(transaction.unitPrice || service?.price || 0)}
                  </span>
                </div>
                <div className="calc-row">
                  <span>Subtotal Pengerjaan:</span>
                  <span>{money(transaction.total)}</span>
                </div>
                <div className="calc-row">
                  <span>Diskon / Potongan Promo:</span>
                  <span className="text-muted">- Rp 0</span>
                </div>
                <div className="calc-divider" />
                <div className="calc-row grand-total-row">
                  <div>
                    <strong>TOTAL AKHIR</strong>
                    <small className="vat-note">(Netto)</small>
                  </div>
                  <strong className="grand-total-amount">{money(transaction.total)}</strong>
                </div>
              </div>
            </div>

            {/* Kotak Tracking */}
            <div className="official-tracking-box">
              <div className="tracking-box-left">
                <div className="qr-visual-box">
                  <QrCode size={48} className="official-qr-code" />
                  <span className="qr-scan-label">SCAN UNTUK LACAK</span>
                </div>

                <div className="tracking-text-info">
                  <div className="track-box-header">
                    <span className="track-badge-title">KODE PELACAKAN MANDIRI (TRACKING CODE)</span>
                    <span className="track-status-pill">STATUS: {transaction.status.toUpperCase()}</span>
                  </div>
                  <div className="track-code-display">
                    <code className="highlight-code">{transaction.code}</code>
                    <button
                      type="button"
                      className="copy-code-btn no-print"
                      onClick={handleCopyCode}
                    >
                      {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                      <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                    </button>
                  </div>
                  <p className="track-instructions">
                    Lacak tahapan cucian secara real-time via:
                    <b className="portal-url"> freshfold.laundryos.app/tracking</b>
                  </p>
                </div>
              </div>
            </div>

            {/* SOP & Tanda Tangan */}
            <div className="receipt-terms-section">
              <span className="terms-title">SYARAT &amp; KETENTUAN PELAYANAN (SOP LAUNDRY):</span>
              <ol className="terms-list">
                <li>Pengambilan cucian wajib menyerahkan nota ini atau nomor kode tracking.</li>
                <li>Periksa pakaian saat pengambilan. Komplain dilayani maksimal 1x24 jam.</li>
                <li>Cucian yang tidak diambil lebih dari 30 hari di luar tanggung jawab laundry.</li>
                <li>Cucian diatas 30 hari dibagikan ke panti asuhan</li>
              </ol>
            </div>

            <div className="receipt-signatures-grid">
              <div className="signature-box">
                <span className="sig-label">Tanda Tangan Pelanggan,</span>
                <div className="sig-space" />
                <strong className="sig-name">( {customer?.name || 'Pelanggan'} )</strong>
              </div>
              <div className="signature-center-watermark">
                <span className="security-doc-text">TETEH Laundry Certified</span>
              </div>
              <div className="signature-box">
                <span className="sig-label">Petugas Kasir / Penerima,</span>
                <div className="sig-space" />
                <strong className="sig-name">( Staf Kasir )</strong>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* AKSI TOMBOL MODAL (TIDAK IKUT TERCETAK DI KERTAS)        */}
        {/* ======================================================== */}
        <div className="modal-actions receipt-modal-actions no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
          {onTrackTransaction && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onTrackTransaction(transaction.code)}
            >
              <ScanSearch size={16} /> Lacak Cucian Ini
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Cetak Struk Kasir (57 / 58 mm)
          </button>
        </div>
      </div>
    </Modal>
  );
}
