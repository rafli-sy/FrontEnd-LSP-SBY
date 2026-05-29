import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 
import './DaftarSkema.css';
import logoLSP from '../../assets/logo.png';

const DaftarSkema = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  const [selectedSkema, setSelectedSkema] = useState(null);
  const [dataSkema, setDataSkema] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // =========================================================
  // 1. TEMPAT LU EDIT NAMA BIDANG (ALIAS)
  // Format: "Nama Asli di DB" : "Nama Mau Lu"
  // =========================================================
  const aliasNamaBidang = {
    "Teknologi Informasi": "IT & Software Development",
    "Teknik Las": "Welding Specialist",
    "Bisman": "Bisnis & Manajemen",
    "TIK": "Teknologi Informasi (TIK)",
    // Tambahin sendiri di sini sesuai kebutuhan...
  };

  // FUNGSI AUTO-ICON (Ngecek Keyword dari Nama Baru Lu)
  const getIconForBidang = (namaBidang) => {
    const nama = (namaBidang || '').toLowerCase();
    if (nama.includes('tik') || nama.includes('it ') || nama.includes('informasi') || nama.includes('komputer') || nama.includes('software')) return 'fa-laptop-code';
    if (nama.includes('las') || nama.includes('welding')) return 'fa-fire';
    if (nama.includes('listrik') || nama.includes('elektronika')) return 'fa-bolt';
    if (nama.includes('otomotif') || nama.includes('kendaraan') || nama.includes('motor') || nama.includes('mobil')) return 'fa-car-side';
    if (nama.includes('garmen') || nama.includes('busana') || nama.includes('jahit') || nama.includes('tekstil')) return 'fa-tshirt';
    if (nama.includes('pariwisata') || nama.includes('hotel') || nama.includes('hospitality') || nama.includes('boga')) return 'fa-concierge-bell';
    if (nama.includes('refrigerasi') || nama.includes('udara') || nama.includes('ac')) return 'fa-snowflake';
    if (nama.includes('manufaktur') || nama.includes('mesin') || nama.includes('cnc')) return 'fa-cogs';
    if (nama.includes('bisnis') || nama.includes('administrasi') || nama.includes('office') || nama.includes('akuntansi')) return 'fa-briefcase';
    if (nama.includes('pelatihan') || nama.includes('metodologi') || nama.includes('instruktur') || nama.includes('teacher')) return 'fa-chalkboard-teacher';
    if (nama.includes('rias') || nama.includes('kecantikan') || nama.includes('spa') || nama.includes('makeup')) return 'fa-spa';
    return 'fa-award'; 
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const headers = {
          'ngrok-skip-browser-warning': '69420',
          'Content-Type': 'application/json'
        };

        const [resSkema, resBidang] = await Promise.all([
          fetch('https://untracked-exponent-oboe.ngrok-free.dev/api/master/skema', { method: 'GET', headers }),
          fetch('https://untracked-exponent-oboe.ngrok-free.dev/api/master/bidang', { method: 'GET', headers })
        ]);
        
        if (!resSkema.ok || !resBidang.ok) {
          throw new Error(`Gagal narik data! Skema: ${resSkema.status}, Bidang: ${resBidang.status}`);
        }

        const jsonSkema = await resSkema.json();
        const jsonBidang = await resBidang.json();
        
        let arrSkema = Array.isArray(jsonSkema.data?.data) ? jsonSkema.data.data : (jsonSkema.data || jsonSkema);
        let arrBidang = Array.isArray(jsonBidang.data?.data) ? jsonBidang.data.data : (jsonBidang.data || jsonBidang);

        const kamusBidang = {};
        if (Array.isArray(arrBidang)) {
          arrBidang.forEach(b => {
            kamusBidang[b.id] = b.nama_bidang || b.namaBidang || b.bidang || `Bidang ${b.id}`;
          });
        }

        const groupedData = (Array.isArray(arrSkema) ? arrSkema : []).reduce((acc, curr) => {
          const namaSkema = curr.namaSkema || curr.nama_skema || curr.judul_skema || `Skema ID ${curr.id}`;
          
          // 1. Ambil nama asli dari DB/Kamus
          const idBidang = curr.bidang_id;
          const namaAsliDB = curr.bidang?.nama_bidang || kamusBidang[idBidang] || `Bidang Lainnya`;

          // 2. CEK ALIAS: Pakai nama buatan lu kalau ada, kalau nggak ada pakai nama asli DB
          const namaTampilan = aliasNamaBidang[namaAsliDB] || namaAsliDB;

          let existingBidang = acc.find(item => item.kategori === namaTampilan);

          if (existingBidang) {
            existingBidang.list.push(namaSkema);
            existingBidang.total += 1;
          } else {
            acc.push({
              kategori: namaTampilan,
              icon: getIconForBidang(namaTampilan), // Icon ngikutin nama baru
              total: 1,
              list: [namaSkema]
            });
          }

          return acc;
        }, []);

        groupedData.sort((a, b) => a.kategori.localeCompare(b.kategori));
        setDataSkema(groupedData); 
        setIsLoading(false);

      } catch (error) {
        console.error("Error Fetching:", error);
        setApiError(error.message);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedSkema) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; 
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [selectedSkema]);
  
  const openModal = (item) => setSelectedSkema(item);
  const closeModal = () => setSelectedSkema(null);

  const totalSemuaSkema = dataSkema.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="skema-page">
      <Link to="/" className="btn-floating-back">
        <i className="fas fa-arrow-left"></i> <span>Kembali</span>
      </Link>

      <header className="skema-header">
        <div className="logo">
          <img src={logoLSP} alt="Logo LSP" className="skema-header-logo" style={{ height: '40px' }} />
          <div className="logo-text">
            <span className="brand" style={{ fontSize: '1.1rem' }}>LSP BLK SURABAYA</span>
          </div>
        </div>
      </header>

      <div className="skema-hero">
        <div className="container fade-in-content text-center">
          <div className="skema-hero-center">
            <i className="fas fa-list-alt skema-hero-icon"></i>
            <h1 className="skema-hero-title">Daftar Skema Sertifikasi</h1>
            <p className="skema-hero-desc">Daftar lengkap skema uji kompetensi yang dilisensikan oleh BNSP di LSP UPT Pelatihan Kerja Surabaya.</p>
            <div style={{ marginTop: '20px' }}>
              <span className="skema-badge" style={{ fontSize: '0.95rem', padding: '8px 20px', backgroundColor: 'rgba(255,255,255,0.9)', color: '#0056b3', borderRadius: '50px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <i className="fas fa-award" style={{ marginRight: '8px' }}></i> Tersedia Total {totalSemuaSkema} Skema
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container skema-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
            <h3 style={{ color: '#64748b' }}>
              <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '10px' }}></i> 
              Mengambil data dari server...
            </h3>
          </div>
        ) : apiError ? (
          <div style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
            <h3 style={{ color: '#ef4444' }}><i className="fas fa-exclamation-triangle"></i> Gagal Memuat Data</h3>
            <p style={{ color: '#64748b' }}>Error: {apiError}</p>
          </div>
        ) : (
          <div className="grid-3 fade-in-content">
            {dataSkema.map((item, index) => (
              <div key={index} className="skema-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="skema-card-head" style={{ marginBottom: '0', paddingBottom: '0', borderBottom: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="skema-card-icon" style={{ marginBottom: '15px' }}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="skema-card-title" style={{ marginBottom: '12px' }}>{item.kategori}</h3>
                  <span className="skema-kategori-badge">
                    {item.total} Skema
                  </span>
                </div>
                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                  <button onClick={() => openModal(item)} className="btn-see-more">
                    Lihat Detail Skema
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL POP-UP --- */}
      {selectedSkema && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* BUTTON X (FIXED COLOR ON HOVER) */}
            <button className="modal-close" onClick={closeModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-times" style={{ position: 'relative', zIndex: 5 }}></i>
            </button>
            
            <div className="modal-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
              <div className="skema-card-icon" style={{ margin: '0 auto 15px', width: '60px', height: '60px', fontSize: '1.8rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${selectedSkema.icon}`}></i>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 10px 0' }}>{selectedSkema.kategori}</h3>
              <span style={{ backgroundColor: '#e7f1ff', color: '#0056b3', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {selectedSkema.total} Skema Tersedia
              </span>
            </div>
            <div className="modal-body">
              <ul className="skema-list-popup">
                {selectedSkema.list.map((skema, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check-circle"></i>
                    <span>{skema}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarSkema;