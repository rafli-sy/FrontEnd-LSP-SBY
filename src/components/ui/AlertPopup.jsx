import React from 'react';

const AlertPopup = ({ type, title, text, onConfirm, onCancel }) => {
  // type tersedia: 'success', 'warning', 'danger', 'confirm', 'save', 'delete'
  
  const getIcon = () => {
    switch(type) {
      case 'success': return <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '3.5rem' }}></i>;
      case 'warning': return <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b', fontSize: '3.5rem' }}></i>;
      case 'danger': 
      case 'delete': return <i className="fas fa-times-circle" style={{ color: '#ef4444', fontSize: '3.5rem' }}></i>;
      case 'confirm': return <i className="fas fa-question-circle" style={{ color: '#3b82f6', fontSize: '3.5rem' }}></i>;
      case 'save': return <i className="fas fa-save" style={{ color: '#10b981', fontSize: '3.5rem' }}></i>;
      default: return <i className="fas fa-info-circle" style={{ color: '#3b82f6', fontSize: '3.5rem' }}></i>;
    }
  };

  const isConfirmMode = ['confirm', 'save', 'delete'].includes(type);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '20px'
    }}>
      
      {/* WADAH POP-UP ANTI-KOPONG */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '30px 24px',
        width: '100%',
        maxWidth: '380px',
        height: 'fit-content',   /* KUNCI: Biarkan tinggi menyesuaikan teks isinya */
        minHeight: 'auto',       /* KUNCI: Buang paksaan tinggi minimum dari CSS global */
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        animation: 'zoomInAlert 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>

        {/* Ikon Pop Up */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          {getIcon()}
        </div>

        <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '800' }}>
          {title}
        </h3>

        <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {text}
        </p>

        {/* Tombol Aksi */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          {isConfirmMode && (
            <button 
              onClick={onCancel} 
              style={{ 
                flex: 1, padding: '12px 0', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem',
                backgroundColor: '#fff', color: '#64748b', border: '1px solid #cbd5e1', cursor: 'pointer', transition: '0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              Batal
            </button>
          )}
          <button 
            onClick={isConfirmMode ? onConfirm : onCancel} 
            style={{ 
              flex: 1, padding: '12px 0', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem',
              backgroundColor: type === 'delete' ? '#ef4444' : (type === 'save' || type === 'success' ? '#10b981' : '#2563eb'), 
              color: '#fff', border: 'none', cursor: 'pointer', transition: '0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            {type === 'confirm' ? 'Ya, Lanjutkan' : type === 'save' ? 'Ya, Simpan' : type === 'delete' ? 'Ya, Hapus' : 'Tutup'}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes zoomInAlert {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default AlertPopup;