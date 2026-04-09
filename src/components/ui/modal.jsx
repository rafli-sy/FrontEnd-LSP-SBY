import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Mencegah scroll pada halaman background ketika pop-up terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      {/* e.stopPropagation() mencegah pop-up tertutup kalau user klik area dalam kotak putih */}
      <div className="ui-modal-box fade-in-scale" onClick={(e) => e.stopPropagation()}>
        
        <div className="ui-modal-header">
          <h3 className="ui-modal-title">{title}</h3>
          <button className="ui-modal-close" onClick={onClose} aria-label="Tutup">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="ui-modal-body">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;