import React from 'react';
import BukuIndukPage from '../buku-induk/BukuIndukPage';
import './dashboard.css'; // Sesuaikan huruf kecil/besar dengan nama file CSS kamu

const DashboardAdminLSP = () => {
  return (
    <div className="dashboard-content fade-in-content">
      {/* Kartu Statistik */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <i className="fas fa-file-contract"></i>
          </div>
          <div className="stat-info">
            <h3>24</h3>
            <p>Skema Aktif</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <i className="fas fa-certificate"></i>
          </div>
          <div className="stat-info">
            <h3>1,024</h3>
            <p>Sertifikat Terbit</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <i className="fas fa-building"></i>
          </div>
          <div className="stat-info">
            <h3>15</h3>
            <p>TUK Terverifikasi</p>
          </div>
        </div>
      </div>

      {/* Menampilkan Buku Induk dengan role Admin LSP */}
      <div style={{ marginTop: '20px' }}>
         <BukuIndukPage isEmbedded={true} role="admin-lsp" />
      </div>
    </div>
  );
};

export default DashboardAdminLSP;