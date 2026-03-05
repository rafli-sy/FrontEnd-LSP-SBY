import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); 
    
    // SIMULASI LOGIN BERDASARKAN ROLE (Berdasarkan Email)
    const userEmail = email.toLowerCase();

    if (userEmail.includes('super')) {
      navigate('/super-admin');
    } else if (userEmail.includes('staff')) {
      navigate('/staff-lsp'); // Staff LSP
    } else if (userEmail.includes('lsp')) {
      navigate('/admin-lsp'); // Admin LSP (K, L, M)
    } else if (userEmail.includes('blk')) {
      navigate('/admin-blk'); // Admin BLK (A - G)
    } else if (userEmail.includes('asesor')) {
      navigate('/asesor'); // Asesor
    } else {
      // Default jika tidak ada yang cocok
      alert('Email tidak dikenali sistem. ');
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
          <h2>Masuk ke Sistem</h2>
          <p>Gunakan email sesuai wewenang (contoh: admin.blk@mail.com)</p>
        </div>

        {/* Form Login */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email / Username</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                placeholder="Contoh: lsp@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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