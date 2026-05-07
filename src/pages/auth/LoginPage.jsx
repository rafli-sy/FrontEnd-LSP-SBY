import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logoLSP from '../../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State untuk efek loading
  const [errorMsg, setErrorMsg] = useState(''); // State untuk pesan error dari backend

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // Reset error setiap kali mencoba login
    
    try {
      // Mengambil URL dari .env
      const apiUrl = import.meta.env.VITE_API_BASE_URL; 
      
      // Melakukan request POST ke backend Laravel (ngrok)
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420' // <--- WAJIB DITAMBAHKAN SAAT PAKAI NGROK
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      // Menangkap error 401 (salah kredensial) atau 403 (akun non-aktif)
      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat login.');
      }

      // LOGIN SUKSES (Status 200)
      // 1. Simpan Token dan Data User ke Local Storage agar sesi tersimpan
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. Arahkan pengguna berdasarkan Role dari database backend
      const userRole = data.role.toLowerCase();

      if (userRole === 'super admin' || userRole === 'super_admin') {
        navigate('/super-admin');
      } else if (userRole === 'staff' || userRole === 'staff lsp') {
        navigate('/staff-lsp'); 
      } else if (userRole === 'admin lsp' || userRole === 'lsp') {
        navigate('/admin-lsp'); 
      } else if (userRole === 'admin blk' || userRole === 'blk') {
        navigate('/admin-blk'); 
      } else if (userRole === 'asesor') {
        navigate('/asesor'); 
      } else {
        setErrorMsg('Role pengguna tidak dikenali sistem.');
      }

    } catch (error) {
      // Tampilkan pesan error ke layar
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
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

        {/* Tampilkan pesan error jika ada */}
        {errorMsg && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{errorMsg}</div>}

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