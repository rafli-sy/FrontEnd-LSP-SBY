import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 
import './CekSertifikat.css'; 
import logoLSP from '../../assets/logo.png';
import sertifPlaceholder from '../../assets/placeholder-sertif.png'; 

const CekSertifikat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsLoading(true); 
    setSearchResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://lspblksurabaya.id';
      const response = await fetch(
        `${apiUrl}/api/sertifikat/cek-sertifikat?keyword=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420"
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        
        if (result.status === 'success') {
          const data = result.data;
          setSearchResult({ 
            status: data.status, // Menyimpan status asli dari DB: 'Aktif', 'Kadaluwarsa', 'Tidak-Aktif'
            nama: data.nama_peserta, 
            skema: data.skema_sertifikasi, 
            noReg: data.nomor_registrasi, 
            tanggalTerbit: data.tanggal_terbit,
            masaBerlaku: data.masa_berlaku
          });
        } else {
          setSearchResult({ status: 'invalid' });
        }
      } else {
        setSearchResult({ status: 'invalid' });
      }
    } catch (error) {
      console.error("Gagal mengambil data dari server:", error);
      setSearchResult({ status: 'invalid' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cert-page">
      <Link to="/" className="btn-floating-back">
        <i className="fas fa-arrow-left"></i> <span>Kembali</span>
      </Link>

      <header className="cert-header">
        <div className="logo">
          <img src={logoLSP} alt="Logo LSP" style={{ height: '40px' }} />
          <div className="logo-text">
            <span className="brand" style={{ fontSize: '1.1rem' }}>LSP BLK SURABAYA</span>
          </div>
        </div>
      </header>

      <div className="container cert-container">
        <div className="cert-grid fade-in-content">
          
          {/* Kolom Kiri - Form Verifikasi */}
          <div className="cert-card left-card">
            <div className="cert-icon">
              <i className="fas fa-certificate"></i>
            </div>
            
            <h2 className="cert-title">Verifikasi Sertifikat BNSP</h2>
            <p className="cert-subtitle">
              Layanan resmi bagi perusahaan dan instansi untuk memvalidasi keaslian sertifikat kompetensi calon tenaga kerja.
            </p>

            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Masukkan No. Sertifikat Peserta Asesi....." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="cert-input" 
                required 
              />
              <button type="submit" className="cert-btn" disabled={isLoading}>
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Memvalidasi Data...</>
                ) : (
                  <><i className="fas fa-search"></i> Validasi Sertifikat</>
                )}
              </button>
            </form>

            {searchResult && (
              <div className={`cert-result ${searchResult.status === 'Aktif' ? 'result-valid' : (searchResult.status === 'Tidak-Aktif' ? 'result-warning' : 'result-invalid')}`}>
                {searchResult.status !== 'invalid' ? (
                  <div>
                    <h3 className="res-head" style={{ color: searchResult.status === 'Aktif' ? '#059669' : (searchResult.status === 'Tidak-Aktif' ? '#b45309' : '#ef4444') }}>
                      <i className={searchResult.status === 'Aktif' ? "fas fa-check-circle" : "fas fa-exclamation-circle"}></i> 
                      {searchResult.status === 'Aktif' ? ' SERTIFIKAT AKTIF' : (searchResult.status === 'Kadaluwarsa' ? ' SERTIFIKAT KADALUWARSA ' : ' SERTIFIKAT TIDAK AKTIF')}
                    </h3>
                    <table className="res-table">
                      <tbody>
                        <tr><td className="label">Nama Kandidat</td><td className="value">: {searchResult.nama}</td></tr>
                        <tr><td className="label">Skema Kompetensi</td><td className="value">: {searchResult.skema}</td></tr>
                        <tr><td className="label">No. Registrasi</td><td className="value">: {searchResult.noReg}</td></tr>
                        <tr><td className="label">Tanggal Terbit</td><td className="value">: {searchResult.tanggalTerbit}</td></tr>
                        <tr><td className="label">Masa Berlaku</td><td className="value">: {searchResult.masaBerlaku}</td></tr>
                        <tr><td className="label">Status</td><td className="value" style={{ fontWeight: 'bold', color: searchResult.status === 'Aktif' ? '#059669' : (searchResult.status === 'Tidak-Aktif' ? '#b45309' : '#ef4444') }}>: {searchResult.status}</td></tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-times-circle" style={{ fontSize: '3rem', marginBottom: '15px', color: '#ef4444' }}></i>
                    <h3 className="res-head">Data Tidak Ditemukan</h3>
                    <p style={{ fontSize: '0.95rem' }}>Pastikan nomor sertifikat peserta asesi yang Anda masukkan sudah benar.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Kolom Kanan - Petunjuk */}
          <div className="cert-card right-card">
            <h3 className="right-card-title">Petunjuk Letak Nomor Registrasi</h3>
            <div className="cert-image-wrapper">
              <img 
                src={sertifPlaceholder} 
                alt="Contoh Sertifikat" 
                className="cert-sample-img" 
                onMouseEnter={(e) => {
                  const { left, top, width, height } = e.target.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  e.target.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.target.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  e.target.style.transformOrigin = `${x}% ${y}%`;
                }}
              />
            </div>
            <p className="cert-instruction">
              Perhatikan contoh sertifikat di atas untuk menemukan letak <strong>Nomor Sertifikat Peserta Asesi</strong> Anda.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CekSertifikat;