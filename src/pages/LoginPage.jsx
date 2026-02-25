import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan pilihan wewenang (role)
  const [role, setRole] = useState('super-admin');

  // Fungsi yang dipanggil saat tombol login ditekan
  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah halaman reload
    
    // Simulasi Login: Langsung arahkan (redirect) ke URL sesuai role yang dipilih
    navigate(`/${role}`);
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
          <p>Silakan login sesuai dengan wewenang Anda.</p>
        </div>

        {/* Form Login */}
        <form className="login-form" onSubmit={handleLogin}>
          
          <div className="form-group">
            <label htmlFor="username">Username / Email</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input type="text" id="username" placeholder="Masukkan username" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input type="password" id="password" placeholder="Masukkan password" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Pilih Wewenang (Role)</label>
            <div className="input-with-icon">
              <i className="fas fa-id-card-alt"></i>
              <select 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="super-admin">Super Admin</option>
                <option value="admin-lsp">Admin LSP</option>
                <option value="admin-blk">Admin BLK</option>
                <option value="asesor">Asesor</option>
              </select>
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