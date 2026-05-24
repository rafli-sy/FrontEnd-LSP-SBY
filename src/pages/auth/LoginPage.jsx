import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate(); 
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); 
    
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL; 
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat login.');
      }

      // LOGIN SUKSES (Status 200)
      const authToken = data.token || data.access_token; 
      
      sessionStorage.setItem('auth_token', authToken);
      sessionStorage.setItem('user', JSON.stringify(data.user)); 

      console.log('Login sukses, token masuk ke session!');

      const userRole = data.role.toLowerCase().trim();

      // MENGGUNAKAN window.location.href AGAR STATE LAMA TER-RESET TOTAL
      if (userRole === 'super admin' || userRole === 'super_admin' || userRole === 'superadmin') {
        window.location.href = '/super-admin';
      } 
      // REVISI: Pengecekan variasi role Staf LSP (1 F atau 2 F, pakai spasi atau tidak)
      else if (['staff', 'staff lsp', 'stafflsp', 'staf', 'staf lsp', 'staflsp'].includes(userRole)) {
        window.location.href = '/staff-lsp'; 
      } 
      else if (userRole === 'admin lsp' || userRole === 'admin_lsp' || userRole === 'adminlsp') {
        window.location.href = '/admin-lsp'; 
      } 
      else if (userRole === 'admin blk' || userRole === 'admin_blk' || userRole === 'adminblk') {
        window.location.href = '/admin-blk'; 
      } 
      else if (userRole === 'asesor') {
        window.location.href = '/asesor'; 
      } 
      else {
        setErrorMsg(`Role "${data.role}" tidak dikenali sistem.`);
      }

    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <Link to="/">
            <img src={logoLSP} alt="Logo LSP BLK Surabaya" className="login-logo" />
          </Link>
          <h2>Login ke Sistem</h2>
        </div>

        {errorMsg && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{errorMsg}</div>}

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Memproses...' : (
              <>Masuk <i className="fas fa-sign-in-alt"></i></>
            )}
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