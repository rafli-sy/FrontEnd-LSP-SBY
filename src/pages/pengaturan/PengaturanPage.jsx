import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';

const PengaturanPage = () => {
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  const [passwordData, setPasswordData] = useState({ lama: '', baru: '', konfirmasi: '' });

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.baru !== passwordData.konfirmasi) {
      setAlert({ type: 'warning', title: 'Gagal', text: 'Password baru dan konfirmasi tidak cocok.', onCancel: closeAlert });
      return;
    }
    
    setAlert({
      type: 'save', title: 'Ubah Kata Sandi?', text: 'Anda harus login ulang menggunakan sandi baru setelah ini.',
      onConfirm: () => {
        setAlert({ type: 'success', title: 'Berhasil', text: 'Kata sandi akun Anda telah diperbarui.', onCancel: closeAlert });
        setPasswordData({ lama: '', baru: '', konfirmasi: '' });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2500);
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div className="dashboard-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>Pengaturan Akun</h2>
        <p className="text-muted">Sesuaikan preferensi keamanan akun Anda.</p>
      </div>

      {/* Dibuat maxWidth agar kotak form tidak melebar secara berlebihan */}
      <div style={{ maxWidth: '600px' }}>
        
        {/* KARTU PENGATURAN KEAMANAN */}
        <div className="dashboard-card" style={{ padding: '25px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            <i className="fas fa-lock text-blue" style={{ marginRight: '8px' }}></i> Keamanan Akun
          </h3>
          <form onSubmit={handlePasswordChange} style={{ marginTop: '20px' }}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Kata Sandi Lama</label>
              <input type="password" className="form-input" value={passwordData.lama} onChange={(e) => setPasswordData({...passwordData, lama: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Kata Sandi Baru</label>
              <input type="password" className="form-input" value={passwordData.baru} onChange={(e) => setPasswordData({...passwordData, baru: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Konfirmasi Sandi Baru</label>
              <input type="password" className="form-input" value={passwordData.konfirmasi} onChange={(e) => setPasswordData({...passwordData, konfirmasi: e.target.value})} required />
            </div>
            <div style={{ marginTop: '30px' }}>
              <Button type="submit" variant="warning" icon="key" isFullWidth style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '12px' }}>
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        </div>

      </div>

      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default PengaturanPage;