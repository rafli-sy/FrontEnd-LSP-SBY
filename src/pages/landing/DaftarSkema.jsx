import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 
import './DaftarSkema.css';
import logoLSP from '../../assets/logo.png';

const DaftarSkema = () => {
  // Scroll ke atas pas halaman pertama kali dirender
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  const [selectedSkema, setSelectedSkema] = useState(null);

  // EFEK SUPER LOCK: Ngunci HTML, Body, dan cegah Touch (Mobile) pas Pop-up Terbuka
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

  // DATA SKEMA LENGKAP (11 Kategori, 98 Skema)
  const semuaSkema = [
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
                <i className="fas fa-award" style={{ marginRight: '8px' }}></i> Tersedia Total 98 Skema Tersertifikasi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container skema-content">
        <div className="grid-3 fade-in-content">
          {semuaSkema.map((item, index) => (
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
      </div>

      {/* --- MODAL POP-UP --- */}
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

export default DaftarSkema;