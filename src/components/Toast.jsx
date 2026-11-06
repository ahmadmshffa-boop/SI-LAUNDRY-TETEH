import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const message = typeof toast === 'string' ? toast : toast?.message || '';
  const msgLower = message.toLowerCase();
  const isError =
    toast?.type === 'error' ||
    msgLower.includes('gagal') ||
    msgLower.includes('tidak dapat') ||
    msgLower.includes('wajib') ||
    msgLower.includes('salah');

  return (
    <div className={`toast ${isError ? 'toast-error' : 'toast-success'}`} role="status">
      {isError ? (
        <AlertCircle size={18} className="toast-icon-error" />
      ) : (
        <CheckCircle2 size={18} className="toast-icon-success" />
      )}
      <span className="toast-message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Tutup notifikasi"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
