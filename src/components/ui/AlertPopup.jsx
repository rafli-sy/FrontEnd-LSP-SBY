import React from 'react';
import './AlertPopup.css';

const AlertPopup = ({ type, title, text, onConfirm, onCancel }) => {
  if (!type) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-card fade-in-scale">
        <div className="alert-icon-wrapper">
          {type === 'save' && (
            <div className="icon-save-group">
              <i className="far fa-save icon-base"></i>
              <i className="fas fa-question-circle icon-badge blue"></i>
            </div>
          )}
          {type === 'success' && (
            <div className="icon-success-group">
              <i className="fas fa-check"></i>
            </div>
          )}
          {/* Tambahan ikon peringatan (Warning) */}
          {type === 'warning' && (
            <div className="icon-cancel-group" style={{ background: '#fffbeb', boxShadow: '0 0 0 6px rgba(251, 191, 36, 0.2)', color: '#f59e0b' }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          )}
          {(type === 'cancel' || type === 'delete') && (
            <div className="icon-cancel-group">
              <i className="fas fa-times"></i>
            </div>
          )}
        </div>
        
        <h3 className="alert-title">{title}</h3>
        <p className="alert-text">{text}</p>
        
        {/* LOGIKA TOMBOL BARU YANG SUDAH DIPERBAIKI */}
        {type === 'success' || type === 'warning' ? (
          <div className="alert-actions">
            <button 
              className={`alert-btn ${type === 'warning' ? 'btn-yellow' : 'btn-green'}`} 
              style={{ width: '100%' }} 
              onClick={onCancel} // <-- Prop onCancel sekarang berfungsi di sini
            >
              {type === 'warning' ? 'Mengerti' : 'Tutup'}
            </button>
          </div>
        ) : (
          <div className="alert-actions">
            <button className="alert-btn btn-red" onClick={onCancel}>Batal</button>
            <button className="alert-btn btn-green" onClick={onConfirm}>
              {type === 'save' ? 'Ya, simpan' : 'Ya'}
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default AlertPopup;