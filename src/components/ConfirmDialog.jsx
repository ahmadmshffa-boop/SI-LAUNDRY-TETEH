import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Hapus Data',
  cancelText = 'Batal',
  isBlocked = false,
  blockedReason = '',
  onConfirm,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="overlay"
      role="alertdialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal confirm-modal">
        <div className="confirm-head">
          <div className={`confirm-icon ${isBlocked ? 'icon-warning' : 'icon-danger'}`}>
            {isBlocked ? <AlertCircle size={22} /> : <Trash2 size={22} />}
          </div>
          <div>
            <h3>{title}</h3>
            <p className="confirm-desc">{message}</p>
          </div>
          <button
            type="button"
            className="icon-btn close-confirm"
            onClick={onClose}
            aria-label="Tutup konfirmasi"
          >
            <X size={17} />
          </button>
        </div>

        {isBlocked && (
          <div className="blocked-notice">
            <AlertTriangle size={16} />
            <span>{blockedReason}</span>
          </div>
        )}

        <div className="modal-actions confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {isBlocked ? 'Tutup' : cancelText}
          </button>
          {!isBlocked && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              <Trash2 size={15} /> {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
