import React from 'react';
import './Dashboard.css';

const DashboardSuperAdmin = () => {
  return (
    <div className="dashboard-content fade-in-content">
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><i className="fas fa-server"></i></div><div className="stat-info"><h3>32%</h3><p>Server Load</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><i className="fas fa-users"></i></div><div className="stat-info"><h3>145</h3><p>User Aktif Sistem</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}><i className="fas fa-database"></i></div><div className="stat-info"><h3>850 MB</h3><p>Storage Terpakai</p></div></div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h3 className="section-title">Sistem Kontrol & Konfigurasi</h3>
        <div className="action-grid">
          <div className="action-card">
            <i className="fas fa-user-shield"></i>
            <h4>Manajemen User Multi-Role</h4>
            <p>Kontrol penuh pembuatan, pemblokiran, dan hak akses akun Admin LSP, BLK, Staff, hingga Asesor.</p>
          </div>
          <div className="action-card">
            <i className="fas fa-cogs"></i>
            <h4>Konfigurasi Database & Backup</h4>
            <p>Pengaturan parameter sistem, backup database otomatis, dan log aktivitas user (Audit Trail).</p>
          </div>
          <div className="action-card">
            <i className="fas fa-network-wired"></i>
            <h4>Master Data Wilayah & TUK</h4>
            <p>Manajemen data dasar BLK mitra, cabang LSP, dan sinkronisasi wilayah kerja.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardSuperAdmin;