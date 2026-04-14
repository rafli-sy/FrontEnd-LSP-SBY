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
        <h2 style={{ margin: 0, color: '#0f172a' }}>Pengaturan Sistem</h2>
        <p className="text-muted">Sesuaikan preferensi keamanan dan aplikasi Anda.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        
        {/* KARTU PENGATURAN KEAMANAN */}
        <div className="dashboard-card" style={{ padding: '25px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}><i className="fas fa-lock text-blue"></i> Keamanan Akun</h3>
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
            <Button type="submit" variant="warning" icon="key" isFullWidth>Perbarui Kata Sandi</Button>
          </form>
        </div>

        {/* KARTU PREFERENSI */}
        <div className="dashboard-card" style={{ padding: '25px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}><i className="fas fa-bell text-orange"></i> Preferensi Notifikasi</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              <div>
                <strong style={{ display: 'block', color: '#1e293b' }}>Notifikasi Email</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Terima update via email.</span>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>
            <Button variant="outline" icon="save" onClick={() => setAlert({ type: 'success', title: 'Tersimpan', text: 'Preferensi notifikasi diperbarui.', onCancel: closeAlert })}>Simpan Preferensi</Button>
          </div>
        </div>

      </div>

      <AlertPopup {...alert} />
    </div>
  );
};

export default PengaturanPage;