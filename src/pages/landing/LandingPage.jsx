import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import './LandingPage.css'; 
import logoLSP from '../../assets/logo.png';

const CountUp = ({ end, decimals = 0, duration = 1500, suffix = "", start = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); 
      setCount(easeProgress * end);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const [selectedSkema, setSelectedSkema] = useState(null);

  // EFEK SUPER LOCK: Ngunci HTML, Body, dan cegah Touch (Mobile)
  useEffect(() => {
    if (selectedSkema) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Cegah scroll tarik di HP
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    // Cleanup pas component unmount atau pop-up ditutup
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [selectedSkema]);

  const openModal = (item) => setSelectedSkema(item);
  const closeModal = () => setSelectedSkema(null);

  // DATA SKEMA LENGKAP YANG SAMA DENGAN DAFTAR SKEMA
  const dataSkema = [
    {
      icon: 'fa-laptop-code',
      kategori: 'Teknologi Informasi (TIK)',
      total: 19,
      list: [
        'Multimedia', 'Pemasangan Jaringan Komputer', 'Perakitan Komputer', 'Practical Office Advance',
        'Practical Office', 'Pembuatan Desain Grafis', 'Pemrograman Perangkat Lunak untuk Bisnis',
        'Computer Operator Asistant', 'Pemrograman Web', 'Desain Grafis Madya', 'Basic Office',
        'Pembuatan Aset Animasi 3D', 'Desainer Grafis Muda', 'Operator Komputer Muda',
        'Pembuatan Gerak Animasi 3D', 'Junior Web Developer', 'Animator Muda (Junior Animator)',
        'Video Editor', 'Teknisi Utama Jaringan Komputer'
      ]
    },
    {
      icon: 'fa-fire',
      kategori: 'Teknik Las (Welding)',
      total: 18,
      list: [
        'Plate Welder GTAW 1G/PA', 'Plate Welder SMAW 3G-Up/PF', 'Fillet Welder SMAW 3F /PF',
        'Fillet Welder GMAW 3F /PF', 'Fillet Welder FCAW 3F /PF', 'Fillet Welder GTAW 3F/PF',
        'Plate Welder SMAW 1G/PA', 'Plate Welder GMAW 1G/PA', 'Plate Welder FCAW 1G/PA',
        'Plate Welder GMAW 3G-Up/PF', 'Plate Welder FCAW 3G-Up/PF', 'Plate Welder GTAW 3G-Up/PF',
        'Pipe Welder SMAW 6GUp Hill/HL0-45', 'Pipe Welder GTAW-SMAW 6G Up Hill/HL0-45',
        'Pipe Welder SMAW 1G/PA', 'Pipe Welder SMAW 2G/PC', 'Pipe Welder GTAW 6G Up Hill/HL0-45',
        'Pipe Welder GMAW 6G Up Hill/HL0-45'
      ]
    },
    {
      icon: 'fa-bolt',
      kategori: 'Listrik & Elektronika',
      total: 15,
      list: [
        'Teknisi Embedded System (Microcontroller)', 'Teknisi Telepon Seluler Perangkat Keras',
        'Teknisi Telepon Seluler Perangkat Lunak', 'Teknisi Audio Video', 'Teknisi Otomasi Elektronika Industri',
        'Pemograman Smart Home (Rumah Cerdas)', 'Operator Pengoperasian Otomasi Elektronika Industri',
        'Pemasangan Instalasi Listrik Bangunan Sederhana', 'Pemasangan Instalasi Otomasi Listrik Industri',
        'Pengoperasian Instalasi Kontrol Industri Berbasis PLC', 'Pembuatan Program Sistem Kontrol Kelistrikan dan Pneumatic Berbasis PLC',
        'Pembuatan Program Human Machine Interface Berbasis PLC', 'Pemasangan Pembangkit Listrik Tenaga Surya Off Grid',
        'Pemasangan Pembangkit Listrik Tenaga Surya On Grid', 'Pengoperasian Instrumen Dan Kontrol'
      ]
    },
    {
      icon: 'fa-car-side',
      kategori: 'Teknik Otomotif & Alat Berat',
      total: 9,
      list: [
        'Service Sepeda Motor Injeksi', 'Service Sepeda Motor Konvensional', 'Tune Up Mesin Diesel',
        'Pemeliharaan Kendaraan Ringan Sistem Injeksi', 'Pemeliharaan Berkala Kendaraan Ringan',
        'Pemeliharaan Kendaraan Ringan Sistem Konvensional', 'Pengoperasian Forklift',
        'Operator Wheel Excavator', 'Operator Backhoe Loader'
      ]
    },
    {
      icon: 'fa-tshirt',
      kategori: 'Garmen & Tata Busana',
      total: 8,
      list: [
        'Pembuatan Batik Tulis', 'Membatik Dengan Canting', 'Menjahit dengan Mesin Lockstich',
        'Pembuatan Sampel Garmen', 'Menjahit Upper Sepatu', 'Perancangan Desain Busana',
        'Operator Sewing', 'Pembuatan Hiasan Busana Dengan Mesin Bordir Manual'
      ]
    },
    {
      icon: 'fa-concierge-bell',
      kategori: 'Pariwisata & Perhotelan',
      total: 8,
      list: [
        'Housekeeping', 'Restaurant Attendant', 'Bakery', 'Pembuatan Produk Roti dan Pattiserie',
        'Room Attendant', 'Room Division', 'Pembuatan Roti Dan Kue', 'Barista'
      ]
    },
    {
      icon: 'fa-snowflake',
      kategori: 'Refrigerasi & Tata Udara',
      total: 6,
      list: [
        'Asisten Teknisi Refrigerasi dan AC (RAC)', 'Teknisi Perawatan AC Residential',
        'Teknisi AC Residential', 'Teknisi Refrigerasi Domestik', 'Teknisi Pemasangan Refrigerasi dan AC',
        'Pemeliharaan dan Perbaikan AC untuk Rumah Tangga'
      ]
    },
    {
      icon: 'fa-cogs',
      kategori: 'Teknik Manufaktur & Pemesinan',
      total: 5,
      list: [
        'Pengoperasian Mesin CNC', 'Penggambaran Model 3D dengan CAD', 'Pengoperasian Mesin Bubut',
        'Pengoperasian Mesin CNC dengan Program CAM', 'Pengoperasian Mesin Produksi'
      ]
    },
    {
      icon: 'fa-briefcase',
      kategori: 'Bisnis & Administrasi',
      total: 5,
      list: [
        'Junior Administrative Assistant', 'Pelayanan Pelanggan', 'Pengelola Administrasi Perkantoran',
        'Teknisi Akuntansi Junior', 'Junior Sekretaris'
      ]
    },
    {
      icon: 'fa-chalkboard-teacher',
      kategori: 'Metodologi Pelatihan',
      total: 3,
      list: [
        'Instruktur Terampil', 'Instruktur Pertama', 'Pelaksanaan Pelatihan Tatap Muka'
      ]
    },
    {
      icon: 'fa-spa',
      kategori: 'Tata Rias',
      total: 2,
      list: [
        'Tata Rias Pengantin Muslim Modifikasi', 'Tata Rias Pengantin Gaun Panjang'
      ]
    }
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="landing-page-container">
      
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
              <li><Link to="/cek-sertifikat" onClick={closeMenu}>Verifikasi Sertifikat</Link></li>
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

      <section className="stats-visual" ref={statsRef}>
        <div className="container">
          <div className="stats-visual-header" data-aos="fade-up">
            <h2>Insight & Kapasitas Lembaga</h2>
            <p>
              Gambaran analitik operasional pelaksanaan sertifikasi kompetensi di LSP UPT Pelatihan Kerja Surabaya.
            </p>
          </div>

          <div className="stats-visual-grid">
            <div className="visual-card" data-aos="fade-up">
              <h4>Jumlah Asesor</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <div style={{ width: '65px', height: '65px', background: '#e7f1ff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056b3', fontSize: '2rem' }}>
                  <i className="fas fa-user-check"></i>
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#0056b3', lineHeight: '1' }}>
                  <CountUp end={350} start={isStatsVisible} suffix="+" />
                </div>
              </div>
              <p>Asesor independen berlisensi BNSP yang siap menguji kompetensi asesi secara profesional.</p>
            </div>

            <div className="visual-card" data-aos="fade-up" data-aos-delay="100">
              <h4>Tempat Uji Kompetensi (TUK)</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <div style={{ width: '65px', height: '65px', background: '#d1fae5', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '2rem' }}>
                  <i className="fas fa-building"></i>
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#10b981', lineHeight: '1' }}>
                  <CountUp end={20} start={isStatsVisible} suffix="+" />
                </div>
              </div>
              <p>Fasilitas uji kompetensi terverifikasi yang tersebar untuk mewadahi berbagai sektor industri.</p>
            </div>

            <div className="visual-card" data-aos="fade-up" data-aos-delay="200">
              <h4>Skema Tersertifikasi</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <div style={{ width: '65px', height: '65px', background: '#fef3c7', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: '2rem' }}>
                  <i className="fas fa-award"></i>
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#f59e0b', lineHeight: '1' }}>
                  <CountUp end={98} start={isStatsVisible} />
                </div>
              </div>
              <p>Pilihan skema kompetensi aktif yang mencakup sektor TIK, Manufaktur, hingga Pariwisata.</p>
            </div>

            <div className="visual-card" data-aos="fade-up" data-aos-delay="300">
              <h4>Skema Paling Banyak Diuji</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px', marginTop: '-5px' }}>Distribusi asesi terbanyak berdasarkan peminatan.</p>
              <div className="bars-list" style={{ gap: '22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-laptop-code" style={{color: '#0056b3'}}></i> Web Dev</span>
                    <span style={{ color: '#0056b3' }}><CountUp end={450} start={isStatsVisible} /> Asesi</span>
                  </div>
                  <div className="bars-track" style={{ height: '10px' }}>
                    <div className="bars-fill" style={{ width: isStatsVisible ? '90%' : '0%', backgroundColor: '#0056b3', transition: 'width 1.5s ease-out 0.4s' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-car-side" style={{color: '#10b981'}}></i> Otomotif</span>
                    <span style={{ color: '#10b981' }}><CountUp end={320} start={isStatsVisible} /> Asesi</span>
                  </div>
                  <div className="bars-track" style={{ height: '10px' }}>
                    <div className="bars-fill" style={{ width: isStatsVisible ? '70%' : '0%', backgroundColor: '#10b981', transition: 'width 1.5s ease-out 0.6s' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-bolt" style={{color: '#f59e0b'}}></i> Listrik</span>
                    <span style={{ color: '#f59e0b' }}><CountUp end={210} start={isStatsVisible} /> Asesi</span>
                  </div>
                  <div className="bars-track" style={{ height: '10px' }}>
                    <div className="bars-fill" style={{ width: isStatsVisible ? '55%' : '0%', backgroundColor: '#f59e0b', transition: 'width 1.5s ease-out 0.8s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="visual-card card-wide" data-aos="fade-up" data-aos-delay="400">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h4>Grafik Jumlah Uji Setiap Bulan</h4>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>Rekapitulasi volume pelaksanaan uji kompetensi sepanjang tahun.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '50px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#0056b3', borderRadius: '50%' }}></div> Total Asesi
                  </span>
                </div>
              </div>
              
              <div className="line-chart-box" style={{ height: '220px', position: 'relative', paddingBottom: '30px', paddingLeft: '35px', background: 'transparent' }}>
                <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>
                  <span>500</span>
                  <span>300</span>
                  <span>100</span>
                </div>

                <div style={{ position: 'absolute', left: '35px', right: '10px', top: '15px', bottom: '30px' }}>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <line x1="0" y1="90" x2="100" y2="90" stroke="#f1f5f9" strokeWidth="1" vectorEffect="non-scaling-stroke" />

                    <polyline
                      fill="none"
                      stroke="#0056b3"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,90 14,80 28,85 42,60 56,65 71,40 85,30 100,10"
                      strokeDasharray="3000"
                      strokeDashoffset={isStatsVisible ? 0 : 3000}
                      style={{ transition: 'stroke-dashoffset 2s ease-in-out 0.5s' }}
                    />
                  </svg>

                  <div style={{ 
                    position: 'absolute', right: '-6px', top: 'calc(10% - 6px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', 
                    transform: isStatsVisible ? 'translateY(-100%) scale(1)' : 'translateY(-100%) scale(0)',
                    opacity: isStatsVisible ? 1 : 0,
                    transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) 2.2s', 
                    zIndex: 10 
                  }}>
                    <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px', boxShadow: '0 4px 6px rgba(16,185,129,0.2)', whiteSpace: 'nowrap' }}>
                      Peak: Agt
                    </span>
                  </div>
                  <div style={{ 
                    position: 'absolute', right: '-6px', top: 'calc(10% - 6px)', width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', zIndex: 11,
                    transform: isStatsVisible ? 'scale(1)' : 'scale(0)',
                    opacity: isStatsVisible ? 1 : 0,
                    transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) 2s'
                  }}></div>
                </div>

                <div style={{ position: 'absolute', bottom: '0', left: '35px', right: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Mei</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Agt</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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

      <section id="skema" className="section-padding">
        <div className="container">
          <div data-aos="fade-up" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '15px' }}>
              <span className="skema-badge" style={{ fontSize: '0.9rem', padding: '8px 18px' }}>
                <i className="fas fa-award" style={{ marginRight: '8px' }}></i> Tersedia Total 98 Skema Tersertifikasi
              </span>
            </div>
            <h2 className="section-title" style={{ margin: '0 0 10px 0' }}>Informasi Skema Sertifikasi</h2>
            <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '700px' }}>
              Kami menyediakan tenaga kerja bersertifikat dari berbagai sektor. Berikut adalah bidang kompetensi utama yang kami validasi.
            </p>
          </div>

          {/* MENAMPILKAN 3 SKEMA DI LANDING PAGE */}
          <div className="grid-3">
            {dataSkema.slice(0, 3).map((item, index) => (
              <div key={index} className="feature-card" data-aos="fade-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="icon" style={{ fontSize: '2.5rem', color: '#0056b3', marginBottom: '15px' }}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#212529', marginBottom: '12px' }}>{item.kategori}</h3>
                  <span style={{ backgroundColor: '#e7f1ff', color: '#0056b3', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
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

          {/* TOMBOL LIHAT SEMUA SKEMA */}
          <div style={{ marginTop: '50px', textAlign: 'center' }} data-aos="fade-up">
            <Link to="/daftar-skema" className="btn-main" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
             Lihat Semua Skema
            </Link>
          </div>

        </div>
      </section>

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

      {selectedSkema && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
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

export default LandingPage;