import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './PengaturanPage.css'; // <-- TAMBAHKAN IMPORT INI

const PengaturanPage = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  
  // State untuk form & loading
  const [passwordData, setPasswordData] = useState({ lama: '', baru: '', konfirmasi: '' });
  const [isLoading, setIsLoading] = useState(false);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Frontend
    if (passwordData.baru !== passwordData.konfirmasi) {
      setAlert({ type: 'warning', title: 'Gagal', text: 'Password baru dan konfirmasi tidak cocok.', onCancel: closeAlert });
      return;
    }

    // 2. Konfirmasi sebelum mengubah
    setAlert({
      type: 'save', 
      title: 'Ubah Kata Sandi?', 
      text: 'Anda harus login ulang menggunakan sandi baru setelah ini.',
      onConfirm: async () => {
        closeAlert(); // Tutup popup konfirmasi
        setIsLoading(true);

        try {
          const apiUrl = import.meta.env.VITE_API_BASE_URL;
          const token = sessionStorage.getItem('auth_token'); // Ambil token dari session

          // 3. Fetching ke Backend Laravel
          const response = await fetch(`${apiUrl}/api/change-password`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`, // Wajib untuk auth:sanctum
              'ngrok-skip-browser-warning': '69420'
            },
            body: JSON.stringify({
              current_password: passwordData.lama,
              new_password: passwordData.baru, 
              new_password_confirmation: passwordData.konfirmasi 
            })
          });

          const data = await response.json();

          if (!response.ok) {
            // Menangkap error validasi dari Laravel
            let errorMessage = data.message || 'Terjadi kesalahan saat memperbarui kata sandi.';
            if (data.errors) {
               const firstErrorKey = Object.keys(data.errors)[0];
               errorMessage = data.errors[firstErrorKey][0];
            }
            throw new Error(errorMessage);
          }

          setPasswordData({ lama: '', baru: '', konfirmasi: '' });

          // 4. Jika Sukses
          setAlert({ 
            type: 'success', 
            title: 'Berhasil', 
            text: 'Kata sandi akun Anda telah diperbarui. Mengalihkan ke halaman login...', 
            onCancel: closeAlert 
          });
          
          // 5. Proses Logout Otomatis
          if (alertTimer.current) clearTimeout(alertTimer.current);
          alertTimer.current = setTimeout(() => {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user');
            window.location.href = '/login'; 
          }, 2500);

        } catch (error) {
          // Jika Gagal
          setAlert({ 
            type: 'error', 
            title: 'Gagal Memperbarui', 
            text: error.message, 
            onCancel: closeAlert 
          });
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="pengaturan-container fade-in-content">
      <div className="pengaturan-header">
        <h2>Pengaturan Akun</h2>
        <p className="text-muted">Sesuaikan preferensi keamanan akun Anda.</p>
      </div>

      <div className="pengaturan-content-wrapper">
        <div className="pengaturan-card shadow-sm">
          <div className="card-header">
            <h3>
              <i className="fas fa-lock text-blue icon-spacing"></i> Keamanan Akun
            </h3>
          </div>
          
          <div className="card-body">
            <form onSubmit={handlePasswordChange} className="pengaturan-form">
              
              <div className="form-group-custom">
                <label>Kata Sandi Lama</label>
                <div className="input-wrapper">
                  <i className="fas fa-key input-icon"></i>
                  <input 
                    type="password" 
                    className="form-input-custom" 
                    placeholder="Masukkan sandi saat ini"
                    value={passwordData.lama} 
                    onChange={(e) => setPasswordData({...passwordData, lama: e.target.value})} 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="form-group-custom">
                <label>Kata Sandi Baru</label>
                <div className="input-wrapper">
                   <i className="fas fa-lock input-icon"></i>
                  <input 
                    type="password" 
                    className="form-input-custom" 
                    placeholder="Minimal 8 karakter"
                    value={passwordData.baru} 
                    onChange={(e) => setPasswordData({...passwordData, baru: e.target.value})} 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="form-group-custom">
                <label>Konfirmasi Sandi Baru</label>
                <div className="input-wrapper">
                   <i className="fas fa-check-circle input-icon"></i>
                  <input 
                    type="password" 
                    className="form-input-custom" 
                    placeholder="Ketik ulang sandi baru"
                    value={passwordData.konfirmasi} 
                    onChange={(e) => setPasswordData({...passwordData, konfirmasi: e.target.value})} 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="submit-action-area">
                <Button 
                  type="submit" 
                  variant="warning" 
                  icon={isLoading ? "spinner" : "shield-alt"}
                  isFullWidth 
                  disabled={isLoading}
                  className={`btn-update-password ${isLoading ? 'btn-loading' : ''}`}
                >
                  {isLoading ? 'Memproses...' : 'Perbarui Kata Sandi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default PengaturanPage;