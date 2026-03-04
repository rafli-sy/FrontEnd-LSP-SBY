import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); 

  const handleLogin = (e) => {
    e.preventDefault(); 
    setErrorMsg(''); 
    
    // --- TAMBAHKAN REVISI DI SINI ---
    // Cek apakah password sesuai
    if (password !== 'rahasia123') {
      setErrorMsg('Password salah. (Petunjuk: rahasia123)');
      return; 
    }
    // --------------------------------

    const userEmail = email.toLowerCase();

    if (userEmail === 'superadmin@gmail.com') {
      navigate('/super-admin');
    } else if (userEmail === 'adminlsp@gmail.com') {
      navigate('/admin-lsp');
    } else if (userEmail === 'adminblk@gmail.com') {
      navigate('/admin-blk');
    } else if (userEmail === 'asesor@gmail.com') {
      navigate('/asesor');
    } else if (userEmail === 'stafflsp@gmail.com') { // Saya kembalikan rute Staff LSP ke sini
      navigate('/staff-lsp');
    } else {
      setErrorMsg('Email tidak ditemukan di dalam sistem.');
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
          <p>Gunakan email sesuai wewenang (contoh: admin@gmail.com)</p>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email / Username</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                placeholder="Contoh: admin@gmail.com" 
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
                placeholder="Masukkan password Anda" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Masuk Sistem <i className="fas fa-sign-in-alt"></i>
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