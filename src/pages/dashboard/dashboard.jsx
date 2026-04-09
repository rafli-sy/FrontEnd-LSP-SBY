import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [roleInfo, setRoleInfo] = useState({ title: '', desc: '' });

  useEffect(() => {
    if (currentPath.includes('super-admin')) setRoleInfo({ title: 'Super Admin', desc: 'Pemantauan seluruh sistem operasional.' });
    else if (currentPath.includes('admin-lsp')) setRoleInfo({ title: 'Admin LSP', desc: 'Pusat kendali operasional uji kompetensi.' });
    else if (currentPath.includes('admin-blk')) setRoleInfo({ title: 'Admin BLK', desc: 'Pantau pengajuan dan kuota siswa.' });
    else if (currentPath.includes('staff-lsp')) setRoleInfo({ title: 'Staff LSP', desc: 'Pantau antrean dokumen dan persuratan.' });
    else if (currentPath.includes('asesor')) setRoleInfo({ title: 'Asesor', desc: 'Pantau jadwal ujian dan riwayat penilaian.' });
    else setRoleInfo({ title: 'Pengguna', desc: 'Selamat datang di LSP BLK Surabaya.' });
  }, [currentPath]);

  return (
    <div className="dashboard-content fade-in-content">
      {/* Banner Selamat Datang */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Selamat Datang, {roleInfo.title}! 👋</h2>
          <p>{roleInfo.desc}</p>
        </div>
        <div className="welcome-date">
          <i className="far fa-calendar-check"></i>
          <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Kartu Statistik Cepat */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>1,204</h3>
            <p>Total Asesi (Tahun Ini)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>95%</h3>
            <p>Tingkat Kelulusan</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <i className="fas fa-file-signature"></i>
          </div>
          <div className="stat-info">
            <h3>12</h3>
            <p>Antrean UJK Aktif</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="stat-info">
            <h3>45</h3>
            <p>Asesor Aktif</p>
          </div>
        </div>
      </div>

      {/* Area Bawah: Aktivitas Terkini */}
      <div className="dashboard-card mt-20" style={{ borderTop: '4px solid #3b82f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Aktivitas Sistem Terkini</h3>
          <button className="btn-text">Lihat Semua</button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-bullet success"></div>
            <div className="activity-content">
              <p className="activity-title">Penilaian Selesai: <strong>Barista (BLK Surabaya)</strong></p>
              <p className="activity-time">2 jam yang lalu oleh Asesor Kartika</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-bullet primary"></div>
            <div className="activity-content">
              <p className="activity-title">Pengajuan Baru: <strong>Pembuatan Roti (TUK Mandiri)</strong></p>
              <p className="activity-time">5 jam yang lalu oleh Admin BLK</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-bullet warning"></div>
            <div className="activity-content">
              <p className="activity-title">Dokumen SPT Dicetak: <strong>UJK-001</strong></p>
              <p className="activity-time">1 hari yang lalu oleh Staff LSP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;