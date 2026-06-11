import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BukuIndukPage from '../buku-induk/BukuIndukPage'; 

const DashboardStaffLSP = () => {
  const navigate = useNavigate();

  // STATE UNTUK MENAMPUNG ANGKA STATISTIK REAL-TIME
  const [statsData, setStatsData] = useState({ menunggu: 0, terbit: 0 });

  // Konfigurasi Axios
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }), [token]);

  // FETCHING DATA UNTUK MENGHITUNG STATISTIK
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ambil data pengajuan
        const res = await axios.get(`${baseUrl}/staf-lsp/semua-pengajuan`, config).catch(() => 
          axios.get(`${baseUrl}/admin-lsp/semua-pengajuan`, config)
        );
        const rawData = res.data.data || [];
        const grouped = {};
        
        // Kelompokkan berdasarkan nomor pengajuan (mirip logika di SuratMenyurat.jsx)
        rawData.forEach(item => {
          if (item.status_pengajuan === 'Dibatalkan') return;
          const validPengajuanId = item.pengajuan_ujk_id || item.pengajuan?.id || item.pengajuan_id;
          const ujkId = item.pengajuan?.nomor_surat_pengajuan || `UJK-${validPengajuanId}`;
          
          if (!grouped[ujkId]) {
            grouped[ujkId] = { skemaList: [] };
          }

          const jadwal = item.jadwal_asesmen || item.jadwalAsesmen;
          const isPlotted = !!jadwal; // Jika ada jadwal, berarti sudah di-plot oleh Admin LSP

          grouped[ujkId].skemaList.push({
            isPlotted: isPlotted,
            status: isPlotted ? 'Selesai Diplot' : 'Sedang Diproses'
          });
        });

        // Hitung total status
        let menungguCount = 0;
        let terbitCount = 0;

        Object.values(grouped).forEach(item => {
          // Jika semua skema dalam 1 surat sudah di-plot, maka "Surat Diterbitkan"
          const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
          
          if (isSemuaDiplot) {
            terbitCount++;
          } else {
            menungguCount++;
          }
        });

        // Simpan ke state
        setStatsData({ menunggu: menungguCount, terbit: terbitCount });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [baseUrl, config, token]);


  // --- DATA STATISTIK TERHUBUNG KE STATE ---
  const staffStats = [
    { 
      title: 'Menunggu Dokumen', 
      count: statsData.menunggu, 
      icon: 'fa-file-invoice', 
      color: '#ea580c', 
      bg: '#fff7ed', 
      path: '/staff-lsp/surat' 
    },
    { 
      title: 'Surat Tugas Terbit', 
      count: statsData.terbit, 
      icon: 'fa-mail-bulk', 
      color: '#2563eb', 
      bg: '#eff6ff', 
      path: '/staff-lsp/surat' 
    },
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
              {/* TAMPILKAN ANGKA DARI STATE */}
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: '800' }}>
                {stat.count}
              </h3>
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