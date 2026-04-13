import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', // Pilihan: primary, secondary, danger, success, outline, dashed, ghost
  size = 'md',         // Pilihan: sm (kecil), md (sedang), lg (besar)
  icon, 
  onClick, 
  type = 'button', 
  className = '',
  disabled = false,
  isFullWidth = false, // Jika true, tombol akan melebar 100%
  isLoading = false,   // Jika true, akan memunculkan ikon muter (spinner)
  style, 
  title
}) => {
  
  // Menggabungkan semua class dinamis
  const btnClass = `ui-btn ui-btn-${variant} ui-btn-${size} ${isFullWidth ? 'ui-btn-full' : ''} ${className}`;

  return (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled || isLoading} // Disable otomatis jika sedang loading
      style={style}
      title={title}
    >
      {/* Jika loading, paksa render ikon spinner */}
      {isLoading ? (
        <i className="fas fa-spinner fa-spin ui-btn-icon"></i>
      ) : icon ? (
        <i className={`fas fa-${icon} ui-btn-icon`}></i>
      ) : null}
      
      {children}
    </button>
  );
};

export default Button;