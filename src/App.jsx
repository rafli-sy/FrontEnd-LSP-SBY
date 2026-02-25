import { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/logo.png'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="App">
      {/* HEADER - Tetap di luar container agar shadow full width */}
      <header id="header">
        <div className="container header-flex">
          <div className="logo">
            <img src={logo} alt="Logo LSP BLK Surabaya" />
            <div className="logo-text">
              <span className="brand">LSP BLK SURABAYA</span>
              <span className="tag">UPT Pelatihan Kerja Surabaya</span>
            </div>
          </div>

          <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>

          <nav>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#hero" onClick={() => setIsMenuOpen(false)}>Beranda</a></li>
              <li><a href="#skema" onClick={() => setIsMenuOpen(false)}>Skema</a></li>
              <li><a href="#" className="btn-nav">Cek Kelulusan</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero">
        <div className="container grid-2">
          <div className="hero-text" data-aos="fade-right">
            <h1>Tingkatkan Karir dengan <span className="blue">Sertifikat BNSP</span></h1>
            <p>LSP BLK Surabaya menyelenggarakan sertifikasi kompetensi untuk memastikan keahlian Anda diakui secara nasional.</p>
            <div className="hero-actions">
              <a href="#skema" className="btn-main">Lihat Skema</a>
            </div>
          </div>
          <div className="hero-image" data-aos="zoom-in">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop" alt="Hero" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="container grid-4">
          <div className="stat-item" data-aos="fade-up">
            <h3>98+</h3>
            <p>Skema</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
            <h3>20+</h3>
            <p>TUK</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
            <h3>350+</h3>
            <p>Asesor</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="300">
            <h3>A</h3>
            <p>Akreditasi</p>
          </div>
        </div>
      </section>

      {/* SKEMA SECTION (Ditambahkan Kembali) */}
      <section id="skema" className="section-padding">
        <div className="container text-center">
          <h2 className="section-title">Bidang Kompetensi Unggulan</h2>
          <p className="section-subtitle">Pilih skema sertifikasi yang sesuai dengan keahlian Anda</p>
          <div className="grid-3 mt-50">
            <div className="feature-card" data-aos="fade-up">
              <div className="icon"><i className="fas fa-laptop-code"></i></div>
              <h3>Teknologi Informasi</h3>
              <ul className="skema-list">
                <li>Junior Web Developer</li>
                <li>Network Administrator</li>
                <li>Basic Office Operator</li>
              </ul>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="icon"><i className="fas fa-tools"></i></div>
              <h3>Teknik Manufaktur</h3>
              <ul className="skema-list">
                <li>Welder SMAW 3G</li>
                <li>Operator Mesin Bubut</li>
                <li>Teknisi PLC</li>
              </ul>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="icon"><i className="fas fa-motorcycle"></i></div>
              <h3>Otomotif & Listrik</h3>
              <ul className="skema-list">
                <li>Servis Motor Injeksi</li>
                <li>Teknisi AC Residensial</li>
                <li>Pemasangan CCTV</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Dilengkapi Kembali) */}
      <footer className="footer-section">
        <div className="container grid-footer">
          <div className="footer-about">
            <h4 className="brand">LSP BLK SURABAYA</h4>
            <p>Mencetak tenaga kerja profesional yang kompeten dan bersertifikat BNSP untuk masa depan Jawa Timur.</p>
            <div className="social-links-footer">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Tautan Cepat</h4>
            <ul>
              <li><a href="#hero">Beranda</a></li>
              <li><a href="#tentang">Tentang Kami</a></li>
              <li><a href="#skema">Skema Sertifikasi</a></li>
              <li><a href="#">Buku Panduan</a></li>
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
            <p>&copy; 2026 LSP UPT Pelatihan Kerja Surabaya</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;