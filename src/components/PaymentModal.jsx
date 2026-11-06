import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { money, PAYMENT_STATUSES, PAYMENT_METHODS } from '../data/formatters';

export default function PaymentModal({ transaction, customer, onClose, onSave }) {
  if (!transaction) return null;

  const [paymentStatus, setPaymentStatus] = useState(transaction.paymentStatus || 'Belum Bayar');
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod || 'Tunai');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      paymentStatus,
      paymentMethod
    });
  };

  return (
    <Modal
      title="Perbarui Status Pembayaran"
      eyebrow="SIMULASI KASIR & PEMBAYARAN"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="payment-summary-box">
          <div className="psb-row">
            <span>Nota Transaksi:</span>
            <strong>{transaction.code}</strong>
          </div>
          <div className="psb-row">
            <span>Pelanggan:</span>
            <b>{customer?.name || 'Pelanggan'}</b>
          </div>
          <div className="psb-row highlight">
            <span>Total Tagihan:</span>
            <strong className="text-primary">{money(transaction.total)}</strong>
          </div>
        </div>

        <label>
          Status Pembayaran
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            {PAYMENT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </label>

        <label>
          Metode Pembayaran (Simulasi)
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <div className="helper-note">
          <AlertCircle size={15} />
          <span>
            Simulasi front-end: tidak ada pemrosesan transaksi keuangan atau payment gateway sungguhan.
          </span>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle2 size={16} /> Simpan Pembayaran
          </button>
        </div>
      </form>
    </Modal>
  );
}
