import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import './LandingPage.css'; 
import logoLSP from '../../assets/logo.png';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="landing-page-container">
      
      {/* --- HEADER & NAVBAR --- */}
      <header id="header">
        <div className="container header-flex">
          
          <div className="logo">
            <img src={logoLSP} alt="Logo LSP BLK Surabaya" />
            <div className="logo-text">
              <span className="brand">LSP BLK SURABAYA</span>
              <span className="tag">UPT Pelatihan Kerja Surabaya</span>
            </div>
          </div>

          <div className={`nav-wrapper ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li><a href="#hero" onClick={closeMenu}>Beranda</a></li>
              <li><a href="#tentang" onClick={closeMenu}>Tentang Lembaga</a></li>
              <li><a href="#skema" onClick={closeMenu}>Informasi Skema</a></li>
              <li>
                <Link to="/cek-sertifikat" onClick={closeMenu}>
                  Verifikasi Sertifikat
                </Link>
              </li>
            </ul>

            <div className="nav-login">
              <Link to="/login" className="btn-nav" onClick={closeMenu}>
                <i className="fas fa-user-circle" style={{ fontSize: '1.1rem' }}></i> Login Sistem
              </Link>
            </div>
          </div>

          <div className="menu-toggle" onClick={toggleMenu}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>

        </div>
      </header>

      {/* --- HERO / BERANDA (FOKUS UNTUK HRD) --- */}
      <section id="hero" className="hero">
        <div className="container grid-2">
          <div className="hero-text" data-aos="fade-right">
            <h1>Portal Resmi <span className="blue">Verifikasi Sertifikat</span> Kompetensi</h1>
            <p>Layanan terpadu bagi perusahaan dan instansi untuk memvalidasi keaslian sertifikat BNSP calon tenaga kerja lulusan UPT Pelatihan Kerja Surabaya secara instan dan akurat.</p>
            <div className="hero-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/cek-sertifikat" className="btn-main">
                <i className="fas fa-search-diploma" style={{ marginRight: '8px' }}></i> Cek Keaslian Sertifikat
              </Link>
              <a href="#tentang" className="btn-outline">Profil Lembaga</a>
            </div>
          </div>
          <div className="hero-image" data-aos="zoom-in">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop" alt="Hero Image LSP BLK Surabaya" style={{ borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* --- STATISTIK --- */}
      <section className="stats">
        <div className="container grid-3-center">
          <div className="stat-item" data-aos="fade-up">
            <h3>98+</h3><p>Skema Tersertifikasi</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
            <h3>20+</h3><p>Tempat Uji Kompetensi</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
            <h3>350+</h3><p>Asesor Lisensi BNSP</p>
          </div>
        </div>
      </section>

      {/* --- TENTANG KAMI --- */}
      <section id="tentang" className="section-padding" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="tentang-img" data-aos="fade-right">
            <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1470&auto=format&fit=crop" alt="Kegiatan Asesmen" style={{ width: '100%', borderRadius: '12px', border: '5px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
          </div>
          <div className="tentang-text" data-aos="fade-left">
            <h4 style={{ color: '#0056b3', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>Tentang Lembaga</h4>
            <h2 className="section-title" style={{ textAlign: 'left', margin: '0 0 20px 0' }}>LSP BLK Surabaya</h2>
            <p style={{ lineHeight: '1.8', color: '#475569', marginBottom: '15px' }}>
              Lembaga Sertifikasi Profesi (LSP) BLK Surabaya adalah mitra strategis industri dalam menjamin mutu dan kompetensi calon tenaga kerja. Kami merupakan lembaga pelaksana uji kompetensi yang telah mendapatkan lisensi resmi dari Badan Nasional Sertifikasi Profesi (BNSP).
            </p>
            <p style={{ lineHeight: '1.8', color: '#475569', marginBottom: '25px' }}>
              Berada di bawah naungan Dinas Tenaga Kerja dan Transmigrasi Provinsi Jawa Timur, setiap sertifikat yang kami terbitkan adalah bukti sah bahwa pemegangnya telah memenuhi standar kompetensi industri nasional maupun internasional.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, color: '#0f172a', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '10px' }}></i> Sertifikat Resmi BNSP Garuda Emas</li>
              <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '10px' }}></i> Standar Penilaian Sesuai Kebutuhan Industri</li>
              <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '10px' }}></i> Asesor Independen dan Berpengalaman</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- SKEMA (SEBAGAI INFORMASI UNTUK PERUSAHAAN) --- */}
      <section id="skema" className="section-padding">
        <div className="container">
          <div data-aos="fade-up" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 0 10px 0' }}>Informasi Skema Sertifikasi</h2>
            <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '700px' }}>
              Kami menyediakan tenaga kerja bersertifikat dari berbagai sektor. Berikut adalah bidang kompetensi utama yang kami validasi.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-card" data-aos="fade-up">
              <div className="icon"><i className="fas fa-laptop-code"></i></div>
              <h3>Teknologi Informasi</h3>
              <ul className="skema-list">
                <li>Junior Web Developer</li>
                <li>Network Administrator</li>
                <li>Desain Grafis Muda</li>
              </ul>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="icon"><i className="fas fa-cogs"></i></div>
              <h3>Teknik Manufaktur</h3>
              <ul className="skema-list">
                <li>Welder SMAW 3G</li>
                <li>Operator Mesin Bubut</li>
                <li>Pengoperasian Mesin CNC</li>
              </ul>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="icon"><i className="fas fa-car-side"></i></div>
              <h3>Teknik Otomotif</h3>
              <ul className="skema-list">
                <li>Servis Sepeda Motor Injeksi</li>
                <li>Tune Up Mobil Bensin EFI</li>
                <li>Teknisi Spooring Balancing</li>
              </ul>
            </div>

            <div className="feature-card" data-aos="fade-up">
              <div className="icon"><i className="fas fa-snowflake"></i></div>
              <h3>Refrigerasi & Tata Udara</h3>
              <ul className="skema-list">
                <li>Teknisi AC Residensial</li>
                <li>Pemeliharaan AC Sentral</li>
                <li>Instalasi Pendingin Komersial</li>
              </ul>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="icon"><i className="fas fa-concierge-bell"></i></div>
              <h3>Pariwisata & Perhotelan</h3>
              <ul className="skema-list">
                <li>Pembuatan Roti dan Kue</li>
                <li>Barista (Peracik Kopi)</li>
                <li>Room Attendant / Housekeeping</li>
              </ul>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="icon"><i className="fas fa-bolt"></i></div>
              <h3>Listrik & Elektronika</h3>
              <ul className="skema-list">
                <li>Pemasangan Instalasi Listrik</li>
                <li>Teknisi Instalasi CCTV</li>
                <li>Pengoperasian PLC Dasar</li>
              </ul>
            </div>
          </div>

          <div data-aos="fade-up" style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/daftar-skema" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Lihat Seluruh Skema Tersertifikasi <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer-section">
        <div className="container grid-footer">
          <div className="footer-about">
            <h4 className="brand">LSP BLK SURABAYA</h4>
            <p>Mencetak tenaga kerja profesional yang kompeten dan bersertifikat BNSP untuk masa depan Jawa Timur.</p>
            <div className="social-links-footer">
              <a href="https://www.instagram.com/uptblksurabaya" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://web.facebook.com/blksurabaya/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
              <a href="https://www.youtube.com/@uptblksurabaya5838" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Tautan Cepat</h4>
            <ul>
              <li><a href="#hero">Beranda</a></li>
              <li><a href="#tentang">Tentang Lembaga</a></li>
              <li><Link to="/daftar-skema">Informasi Skema</Link></li>
              <li><Link to="/cek-sertifikat">Verifikasi Sertifikat</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Hubungi Kami</h4>
            <p><i className="fas fa-map-marker-alt"></i> Jl. Dukuh Menanggal III/29, Surabaya</p>
            <p><i className="fas fa-phone"></i> (031) 8290071</p>
            <p><i className="fas fa-envelope"></i> lsp.blksurabaya@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <div className="container">
            <p>&copy; 2026 LSP UPT Pelatihan Kerja Surabaya - Dinas Tenaga Kerja dan Transmigrasi Provinsi Jawa Timur</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;