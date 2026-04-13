import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 
import './CekSertifikat.css'; 
import logoLSP from '../../assets/logo.png';

const CekSertifikat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsLoading(true); 
    setSearchResult(null);

    setTimeout(() => {
      setIsLoading(false);
      if (searchQuery.includes('123')) {
        setSearchResult({ 
          status: 'valid', 
          nama: 'Fernando Torres', 
          skema: 'Junior Web Developer', 
          noReg: 'REG.BNSP/TIK/12345/2026', 
          tanggalTerbit: '15 Maret 2026' 
        });
      } else {
        setSearchResult({ status: 'invalid' });
      }
    }, 1500);
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
        <div className="cert-card-wrap fade-in-content">
          <div className="cert-card">
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
                placeholder="Masukkan No. Registrasi BNSP atau NIK Kandidat..." 
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
              <div className={`cert-result ${searchResult.status === 'valid' ? 'result-valid' : 'result-invalid'}`}>
                {searchResult.status === 'valid' ? (
                  <div>
                    <h3 className="res-head"><i className="fas fa-check-circle"></i> SERTIFIKAT VALID</h3>
                    <table className="res-table">
                      <tbody>
                        <tr><td className="label">Nama Kandidat</td><td className="value">: {searchResult.nama}</td></tr>
                        <tr><td className="label">Skema Kompetensi</td><td className="value">: {searchResult.skema}</td></tr>
                        <tr><td className="label">No. Registrasi</td><td className="value">: {searchResult.noReg}</td></tr>
                        <tr><td className="label">Tanggal Terbit</td><td className="value">: {searchResult.tanggalTerbit}</td></tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-times-circle" style={{ fontSize: '3rem', marginBottom: '15px', color: '#ef4444' }}></i>
                    <h3 className="res-head">Data Tidak Ditemukan</h3>
                    <p style={{ fontSize: '0.95rem' }}>Pastikan nomor registrasi atau NIK kandidat yang Anda masukkan sudah benar.</p>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CekSertifikat;