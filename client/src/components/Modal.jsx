import { useEffect, useRef } from 'react';

// Модальне вікно: закривається по Esc, кліку поза вікном і кнопкою ✕
export default function Modal({ open, title, onClose, children }) {
  const closeBtn = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    closeBtn.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button ref={closeBtn} type="button" className="btn btn-ghost" aria-label="Закрити" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
