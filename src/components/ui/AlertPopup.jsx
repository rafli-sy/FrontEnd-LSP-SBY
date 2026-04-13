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
          {type === 'cancel' || type === 'delete' ? (
            <div className="icon-cancel-group">
              <i className="fas fa-times"></i>
            </div>
          ) : null}
        </div>
        
        <h3 className="alert-title">{title}</h3>
        <p className="alert-text">{text}</p>
        
        {type !== 'success' && (
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