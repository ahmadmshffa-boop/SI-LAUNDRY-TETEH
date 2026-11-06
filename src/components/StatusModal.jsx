import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { STATUSES } from '../data/formatters';

const DEFAULT_NOTES = {
  'Menunggu': 'Cucian diterima di kasir',
  'Dicuci': 'Mulai proses pencucian dengan deterjen pilihan',
  'Dikeringkan': 'Proses pengeringan dengan suhu optimal',
  'Disetrika': 'Penyetrikaan uap rapi dan pewangi pakaian',
  'Siap Diambil': 'Quality check selesai, pakaian siap diambil pelanggan',
  'Selesai/Diserahkan': 'Pesanan telah diserahkan ke pelanggan'
};

export default function StatusModal({ transaction, onClose, onSave }) {
  if (!transaction) return null;

  const [status, setStatus] = useState(transaction.status || 'Menunggu');
  const [note, setNote] = useState(DEFAULT_NOTES[transaction.status] || 'Pembaruan status operasional');

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setNote(DEFAULT_NOTES[newStatus] || `Status diperbarui menjadi ${newStatus}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      status,
      note: note.trim() || `Status diperbarui menjadi ${status}`
    });
  };

  return (
    <Modal
      title="Perbarui Status Pengerjaan"
      eyebrow="WORKFLOW & STATUS TRACKING"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="payment-summary-box">
          <div className="psb-row">
            <span>Nota Transaksi:</span>
            <strong>{transaction.code}</strong>
          </div>
          <div className="psb-row">
            <span>Status Saat Ini:</span>
            <span className="current-badge-indicator">{transaction.status}</span>
          </div>
        </div>

        <label>
          Pilih Status Baru
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </label>

        <label>
          Catatan Pengerjaan (Opsional)
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan untuk riwayat tracking..."
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle2 size={16} /> Simpan Pembaruan
          </button>
        </div>
      </form>
    </Modal>
  );
}
