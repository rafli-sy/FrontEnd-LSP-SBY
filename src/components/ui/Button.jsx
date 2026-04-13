import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  isFullWidth = false, 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '' 
}) => {
  const baseClass = 'custom-btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = isFullWidth ? 'btn-full' : '';
  const disabledClass = disabled ? 'btn-disabled' : '';

  return (
    <button 
      type={type} 
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`fas fa-${icon} btn-icon`}></i>}
      <span>{children}</span>
    </button>
  );
};

export default Button;