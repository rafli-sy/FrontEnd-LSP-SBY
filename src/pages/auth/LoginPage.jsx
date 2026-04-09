import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); 
    
    // SIMULASI LOGIN BERDASARKAN ROLE (Ketikkan super, staff, lsp, blk, atau asesor)
    const inputUser = username.toLowerCase();

    if (inputUser.includes('super')) {
      navigate('/super-admin');
    } else if (inputUser.includes('staff')) {
      navigate('/staff-lsp'); 
    } else if (inputUser.includes('lsp')) {
      navigate('/admin-lsp'); 
    } else if (inputUser.includes('blk')) {
      navigate('/admin-blk'); 
    } else if (inputUser.includes('asesor')) {
      navigate('/asesor'); 
    } else {
      alert('Username tidak dikenali sistem.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Header Login */}
        <div className="login-header">
          <Link to="/">
            <img src={logoLSP} alt="Logo LSP BLK Surabaya" className="login-logo" />
          </Link>
          <h2>Login ke Sistem</h2>
        </div>

        {/* Form Login */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                id="username" 
                placeholder="Masukkan username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                id="password" 
                placeholder="Masukkan password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Masuk <i className="fas fa-sign-in-alt"></i>
          </button>
        </form>

        <div className="login-footer">
          <Link to="/"><i className="fas fa-arrow-left"></i> Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;