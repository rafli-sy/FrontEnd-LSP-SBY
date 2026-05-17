import React from 'react';
import { useNavigate } from 'react-router-dom';
import BukuIndukPage from '../buku-induk/BukuIndukPage'; 
import './DashboardStaffLSP.css';

const DashboardStaffLSP = () => {
  const navigate = useNavigate();

  // --- DATA STATISTIK PINTASAN KHUSUS STAFF LSP (NYAMBUNG 100% SAMPAI APP.JSX) ---
  const staffStats = [
    { title: 'Menunggu Dokumen', count: '3', icon: 'fa-file-invoice', color: '#ea580c', bg: '#fff7ed', path: '/staff-lsp/surat' },
    { title: 'Surat Tugas Terbit', count: '18', icon: 'fa-mail-bulk', color: '#2563eb', bg: '#eff6ff', path: '/staff-lsp/surat' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="dashboard-content fade-in-content">

      {/* --- GRID KARTU STATISTIK STAFF --- */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '10px' }}>
        {staffStats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card" 
            onClick={() => handleNavigate(stat.path)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', 
              backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', 
              cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' 
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translateY(-4px)'; 
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'; 
              e.currentTarget.style.borderColor = stat.color; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'translateY(0)'; 
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; 
              e.currentTarget.style.borderColor = '#e2e8f0'; 
            }}
          >
            <div style={{ backgroundColor: stat.bg, color: stat.color, width: '55px', height: '55px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: '800' }}>{stat.count}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- RENDER EMBEDDED BUKU INDUK (VERSI STAFF - READ ONLY / GENERATE SURAT AKTIF) --- */}
      <div style={{ marginTop: '30px' }}>
         <BukuIndukPage isEmbedded={true} role="staff-lsp" />
      </div>

    </div>
  );
};

export default DashboardStaffLSP;