import React from 'react';
import { useNavigate } from 'react-router-dom';
import BukuIndukPage from '../buku-induk/BukuIndukPage'; 
import './DashboardAdminLSP.css';

const DashboardAdminLSP = () => {
  const navigate = useNavigate();

  // --- DATA STATISTIK PINTASAN MASTER DATA ---
  // Path sudah disesuaikan 100% dengan App.jsx kamu!
  const masterStats = [
    { title: 'Skema Aktif', count: '24', icon: 'fa-book', color: '#3b82f6', bg: '#eff6ff', path: '/admin-lsp/skema' },
    { title: 'TUK Terverifikasi', count: '15', icon: 'fa-building', color: '#8b5cf6', bg: '#f3e8ff', path: '/admin-lsp/tuk' },
    { title: 'Asesor Aktif', count: '45', icon: 'fa-user-tie', color: '#10b981', bg: '#ecfdf5', path: '/admin-lsp/asesor' },
    { title: 'Penyelia Aktif', count: '12', icon: 'fa-user-shield', color: '#ef4444', bg: '#fef2f2', path: '/admin-lsp/penyelia' },
  ];

  // Fungsi khusus biar pas pindah halaman otomatis ke-scroll ke atas
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '10px' }}>
        {masterStats.map((stat, index) => (
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

      {/* --- RENDER TABEL BUKU INDUK DI BAWAHNYA --- */}
      <div style={{ marginTop: '30px' }}>
         <BukuIndukPage isEmbedded={true} role="admin-lsp" />
      </div>

    </div>
  );
};

export default DashboardAdminLSP;