import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import BukuIndukPage from '../buku-induk/BukuIndukPage'; // <-- Panggil komponen Buku Induk

const DashboardStaffLSP = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-content fade-in-content">
      
      {/* KOTAK STATISTIK STAFF */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><i className="fas fa-envelope-open-text"></i></div>
          <div className="stat-info">
            <h3>4 Dokumen</h3>
            <p>Belum Dibuat / Tertunda</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="fas fa-check-circle"></i></div>
          <div className="stat-info">
            <h3>12 Dokumen</h3>
            <p>Surat Telah Selesai</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}><i className="fas fa-folder-open"></i></div>
          <div className="stat-info">
            <h3>3 Berkas</h3>
            <p>Ujian Aktif Dipantau</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '35px' }}>
         {/* INI KEAJAIBANNYA: Kita memanggil Buku Induk, tapi dengan mode Embedded (Tertanam) */}
         <BukuIndukPage isEmbedded={true} />
      </div>

    </div>
  );
};

export default DashboardStaffLSP;