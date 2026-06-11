import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BukuIndukPage from '../buku-induk/BukuIndukPage'; 


const DashboardAdminLSP = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ skema: 0, tuk: 0, asesor: 0, penyelia: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
      const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
      
      const config = {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        }
      };

      // Helper function untuk fetch individual agar error per API tidak menggagalkan semuanya
      const safeGet = async (url, key) => {
        try {
          const res = await axios.get(`${baseUrl}${url}`, config);
          return res.data.data?.length || 0;
        } catch (error) {
          console.error(`Gagal mengambil data ${key}:`, error.response?.data || error.message);
          return 0;
        }
      };

      setIsLoading(true);
      // Panggil semua sekaligus, tapi masing-masing sudah dilindungi try-catch
      const [skema, tuk, asesor, penyelia] = await Promise.all([
        safeGet('/master/skema', 'skema'),
        safeGet('/master/jejaring', 'tuk'),
        safeGet('/master/asesor', 'asesor'),
        safeGet('/master/penyilia', 'penyelia')
      ]);

      setStats({ skema, tuk, asesor, penyelia });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const masterStats = [
    { title: 'Skema Aktif', count: stats.skema, icon: 'fa-book', color: '#3b82f6', bg: '#eff6ff', path: '/admin-lsp/skema' },
    { title: 'TUK Terverifikasi', count: stats.tuk, icon: 'fa-building', color: '#8b5cf6', bg: '#f3e8ff', path: '/admin-lsp/tuk' },
    { title: 'Asesor Aktif', count: stats.asesor, icon: 'fa-user-tie', color: '#10b981', bg: '#ecfdf5', path: '/admin-lsp/asesor' },
    { title: 'Penyelia Aktif', count: stats.penyelia, icon: 'fa-user-shield', color: '#ef4444', bg: '#fef2f2', path: '/admin-lsp/penyelia' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="dashboard-content fade-in-content">
      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Memuat Data Dashboard...
        </div>
      ) : (
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
      )}

      <div style={{ marginTop: '30px' }}>
         <BukuIndukPage isEmbedded={true} role="admin-lsp" />
      </div>

    </div>
  );
};

export default DashboardAdminLSP;