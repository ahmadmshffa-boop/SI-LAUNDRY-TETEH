import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, eyebrow = 'LAUNDRYOS / WORKSPACE', children, onClose, wide = false, customClass = '' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className={`modal ${wide ? 'modal-wide' : ''} ${customClass}`}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="modal-heading">{title}</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
