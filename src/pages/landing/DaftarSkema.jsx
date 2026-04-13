import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 
import './DaftarSkema.css'; 
import logoLSP from '../../assets/logo.png';

const DaftarSkema = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const semuaSkema = [
    { icon: 'fa-laptop-code', kategori: 'Teknologi Informasi (TIK)', list: ['Junior Web Developer', 'Network Administrator', 'Basic Office Operator', 'Desain Grafis Muda', 'System Analyst'] },
    { icon: 'fa-cogs', kategori: 'Teknik Manufaktur', list: ['Welder SMAW 3G', 'Welder GTAW', 'Operator Mesin Bubut', 'Pengoperasian Mesin CNC', 'Teknisi PLC'] },
    { icon: 'fa-car-side', kategori: 'Teknik Otomotif', list: ['Servis Sepeda Motor Injeksi', 'Tune Up Mobil Bensin EFI', 'Teknisi Spooring Balancing', 'Overhaul Engine'] },
    { icon: 'fa-snowflake', kategori: 'Refrigerasi & Tata Udara', list: ['Teknisi AC Residensial', 'Pemeliharaan AC Sentral', 'Instalasi Pendingin Komersial'] },
    { icon: 'fa-concierge-bell', kategori: 'Pariwisata & Perhotelan', list: ['Pembuatan Roti dan Kue', 'Barista (Peracik Kopi)', 'Room Attendant / Housekeeping', 'Front Office Receptionist'] },
    { icon: 'fa-bolt', kategori: 'Listrik & Elektronika', list: ['Pemasangan Instalasi Listrik Bangunan', 'Teknisi Instalasi CCTV', 'Pengoperasian PLC Dasar', 'Teknisi Audio Video'] },
    { icon: 'fa-briefcase', kategori: 'Bisnis & Bahasa', list: ['Practical Office Advance', 'Bahasa Inggris Pariwisata', 'Digital Marketing'] }
  ];

  return (
    <div className="skema-page">

      {/* TOMBOL KEMBALI NGAMBANG */}
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
          </div>
        </div>
      </div>

      <div className="container skema-content">
        <div className="grid-3 fade-in-content">
          {semuaSkema.map((item, index) => (
            <div key={index} className="skema-card">
              <div className="skema-card-head">
                <div className="skema-card-icon"><i className={`fas ${item.icon}`}></i></div>
                <h3 className="skema-card-title">{item.kategori}</h3>
              </div>
              
              <ul className="skema-list">
                {item.list.map((skema, idx) => (
                  <li key={idx} className="skema-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{skema}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DaftarSkema;