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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsLoading(true); 
    setSearchResult(null);

    try {
      // FIX 1: Ganti ?query= menjadi ?keyword= dan tambah header untuk bypass warning ngrok
      const response = await fetch(
        `https://untracked-exponent-oboe.ngrok-free.dev/api/sertifikat/cek-sertifikat?keyword=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420"
          }
        }
      );

      // Mengecek apakah response dari server sukses (status HTTP 200-299)
      if (response.ok) {
        const result = await response.json();
        
        // Memastikan status JSON dari backend adalah success
        if (result.status === 'success') {
          const data = result.data;

          // FIX 2: Sesuaikan properti dengan struktur JSON dari backend Laravel
          setSearchResult({ 
            status: 'valid', 
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
        // Jika data tidak ditemukan di database (misal error 404)
        setSearchResult({ status: 'invalid' });
      }
    } catch (error) {
      // Menangkap error jika server down atau ada masalah koneksi internet
      console.error("Gagal mengambil data dari server:", error);
      setSearchResult({ status: 'invalid' });
    } finally {
      // Menghentikan loading spinner setelah proses selesai (baik berhasil maupun gagal)
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
                        <tr><td className="label">Masa Berlaku</td><td className="value">: {searchResult.masaBerlaku}</td></tr>
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