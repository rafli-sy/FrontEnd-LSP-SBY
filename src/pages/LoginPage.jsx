import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan input user dari form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fungsi yang dipanggil saat tombol login ditekan
  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah halaman reload
    setErrorMsg(''); // Reset pesan error setiap kali tombol ditekan
    
    // --- SIMULASI AUTENTIKASI BACKEND ---
    // Nanti bagian ini akan diganti dengan request API (fetch/axios) ke server.
    // Untuk saat ini, kita gunakan logika IF dasar untuk mengecek email.

    // 1. Cek validitas password (simulasi: semua password diset "rahasia123")
    if (password !== 'rahasia123') {
      setErrorMsg('Password salah. (Petunjuk: rahasia123)');
      return; // Hentikan eksekusi kode di bawahnya
    }

    // 2. Cek email dan arahkan (redirect) ke dashboard yang sesuai
    if (email === 'superadmin@gmail.com') {
      navigate('/super-admin');
    } else if (email === 'adminlsp@gmail.com') {
      navigate('/admin-lsp');
    } else if (email === 'adminblk@gmail.com') {
      navigate('/admin-blk');
    } else if (email === 'asesor@gmail.com') {
      navigate('/asesor');
    } else {
      // Jika email tidak terdaftar di atas
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
          <p>Masukkan email dan kata sandi Anda.</p>
        </div>

        {/* Notifikasi Error (Hanya muncul jika errorMsg ada isinya) */}
        {errorMsg && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form className="login-form" onSubmit={handleLogin}>
          
          <div className="form-group">
            <label htmlFor="email">Alamat Email</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                placeholder="contoh: admin@gmail.com" 
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