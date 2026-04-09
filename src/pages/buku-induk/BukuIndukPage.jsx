import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import './BukuIndukPage.css';

const BukuIndukPage = ({ isEmbedded = false, role = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Deteksi Role
  const isStaffView = role === 'staff-lsp' || location.pathname.includes('/staff-lsp');
  const isAdminView = role === 'admin-lsp' || location.pathname.includes('/admin-lsp');

  // --- DATA PEMANTAUAN ---
  const dataPemantauan = [
    {
      id: 1, pendanaan: 'APBD', hari1: 'Rabu, 18 Feb 2026', hari2: 'Kamis, 19 Feb 2026', tuk: 'UPT BLK Surabaya', bidang: 'Pariwisata', skema: 'Pembuatan Roti Dan Kue', 
      jumlahAsesi: 16, keputusanK: '', keputusanBK: 16, pleno: '',
      asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda',
      suratBalasan: true, administrasi: true, spt: true,
      pelaksanaanStatus: '', pembayaran: '', tglPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: ''
    },
    {
      id: 2, pendanaan: 'APBD', hari1: 'Sabtu, 21 Feb 2026', hari2: 'Minggu, 22 Feb 2026', tuk: 'UPT BLK Sumenep', bidang: 'Pariwisata', skema: 'Barista', 
      jumlahAsesi: 16, keputusanK: '', keputusanBK: 16, pleno: '',
      asesor1: 'Johan Wahyudi', asesor2: null, penyelia: 'Ramadhan Budi Prasetyo',
      suratBalasan: true, administrasi: true, spt: true,
      pelaksanaanStatus: '', pembayaran: '', tglPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: ''
    },
    {
      id: 3, pendanaan: 'APBD', hari1: 'Sabtu, 21 Feb 2026', hari2: 'Minggu, 22 Feb 2026', tuk: 'UPT BLK Sumenep', bidang: 'Refrigerasi', skema: 'Teknisi Perawatan AC Residential', 
      jumlahAsesi: 16, keputusanK: '', keputusanBK: 16, pleno: '',
      asesor1: 'Onie Meiyanto', asesor2: null, penyelia: null,
      suratBalasan: true, administrasi: false, spt: false,
      pelaksanaanStatus: '', pembayaran: '', tglPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: ''
    }
  ];

  // --- NAVIGASI ---
  const handlePilihPersonil = (jenisRole, skema) => {
    navigate('/admin-lsp/penugasan', { state: { roleTarget: jenisRole, skemaTarget: skema } });
  };

  const handleBuatSurat = (jenisSurat, skema) => {
    navigate('/staff-lsp/surat', { state: { tab: jenisSurat, skemaTarget: skema } });
  };

  // --- LOGIKA RENDER KOLOM ASESOR ---
  const renderAsesor = (name, jenisRole, item) => {
    if (isAdminView) {
      if (name) {
        return (
          <button className="btn-asesor-terpilih" onClick={() => handlePilihPersonil(jenisRole, item.skema)} title={`Ubah ${jenisRole}`}>
            <i className="fas fa-user-check"></i> {name}
          </button>
        );
      }
      return (
        <button className="btn-asesor-pilih" onClick={() => handlePilihPersonil(jenisRole, item.skema)} title={`Pilih ${jenisRole}`}>
          <i className="fas fa-times"></i> Belum Dipilih
        </button>
      );
    }
    
    if (name) return <span style={{fontWeight: 600, color: '#0f172a'}}>{name}</span>;
    return <i className="fas fa-times icon-status-cross" title="Belum Dipilih"></i>;
  };

  // --- LOGIKA RENDER KOLOM SURAT ---
  const renderSurat = (status, jenisSurat, skema) => {
    if (isStaffView) {
      if (status) return <span className="badge success"><i className="fas fa-check"></i> Selesai</span>;
      return <Button variant="primary" size="sm" icon="pen" onClick={() => handleBuatSurat(jenisSurat, skema)}>Buat</Button>;
    }
    
    if (status) return <i className="fas fa-check icon-status-check" title="Surat Selesai"></i>;
    return <i className="fas fa-times icon-status-cross" title="Surat Belum Dibuat"></i>;
  };

  // --- KOMPONEN TABEL ---
  const tableComponent = (
    <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="buku-induk-table-wrapper">
        <table className="buku-induk-table">
          <thead>
            <tr>
              <th rowSpan="2">No</th>
              <th rowSpan="2">Pendanaan</th>
              <th colSpan="2">Pelaksanaan</th>
              <th rowSpan="2">TUK</th>
              <th rowSpan="2" className="col-skema">Bidang / Skema</th>
              <th rowSpan="2">Jumlah<br/>Asesi</th>
              <th colSpan="2">Keputusan</th>
              <th rowSpan="2">PLENO</th>
              
              {/* Warna latar belakang khusus sudah dihapus agar seragam */}
              <th rowSpan="2" className="col-asesor">Asesor 1</th>
              <th rowSpan="2" className="col-asesor">Asesor 2</th>
              <th rowSpan="2" className="col-asesor">Penyelia</th>
              
              <th rowSpan="2">Surat<br/>Balasan</th>
              <th rowSpan="2">Adminis<br/>trasi</th>
              <th rowSpan="2">SPT</th>
              
              <th rowSpan="2">Pelaksa<br/>naan</th>
              <th rowSpan="2">Pemba<br/>yaran</th>
              <th rowSpan="2">Tgl NO.<br/>PLENO</th>
              <th rowSpan="2">DRAFT</th>
              <th rowSpan="2">CETAK</th>
              <th rowSpan="2">Di Kirim</th>
              <th rowSpan="2">No Resi</th>
              <th rowSpan="2">Di Terima</th>
              <th rowSpan="2">TT Sertifikat</th>
            </tr>
            <tr>
              <th className="col-date">Hari 1</th>
              <th className="col-date">Hari 2</th>
              <th style={{minWidth: '50px'}}>K</th>
              <th style={{minWidth: '50px'}}>BK</th>
            </tr>
          </thead>
          <tbody>
            {dataPemantauan.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center"><span className="badge info">{item.pendanaan}</span></td>
                <td>{item.hari1}</td>
                <td>{item.hari2}</td>
                <td>{item.tuk}</td>
                <td><strong style={{color: '#0f172a', fontSize: '0.95rem'}}>{item.skema}</strong><br/><span className="text-muted" style={{fontSize: '0.8rem'}}>{item.bidang}</span></td>
                
                <td className="text-center font-bold" style={{ backgroundColor: '#f1f5f9' }}>{item.jumlahAsesi}</td>
                <td className="text-center font-bold text-green-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanK}</td>
                <td className="text-center font-bold text-red-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanBK}</td>
                
                <td className="text-center">{item.pleno}</td>
                
                <td className="text-center">{renderAsesor(item.asesor1, 'Asesor 1', item)}</td>
                <td className="text-center">{renderAsesor(item.asesor2, 'Asesor 2', item)}</td>
                <td className="text-center">{renderAsesor(item.penyelia, 'Penyelia', item)}</td>
                
                <td className="text-center">{renderSurat(item.suratBalasan, 'Surat Balasan', item.skema)}</td>
                <td className="text-center">{renderSurat(item.administrasi, 'Surat Administrasi', item.skema)}</td>
                <td className="text-center">{renderSurat(item.spt, 'Surat Tugas (SPT)', item.skema)}</td>
                
                <td>{item.pelaksanaanStatus}</td>
                <td>{item.pembayaran}</td>
                <td>{item.tglPleno}</td>
                <td>{item.draft}</td>
                <td>{item.cetak}</td>
                <td>{item.dikirim}</td>
                <td>{item.noResi}</td>
                <td>{item.diterima}</td>
                <td>{item.ttSertifikat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="embedded-buku-induk">
        <div className="embedded-header">
          <div>
             <h3 className="embedded-header-title">
               {isAdminView ? 'Plotting Asesor & Pemantauan' : 'Tugas Pembuatan Surat & Pemantauan'}
             </h3>
             <p className="text-muted" style={{ margin: 0 }}>
               {isAdminView 
                  ? 'Kelola penugasan Asesor dan Penyelia, serta pantau progres UJK.' 
                  : 'Pantau dan selesaikan pembuatan dokumen UJK yang tertunda.'}
             </p>
          </div>
        </div>
        {tableComponent}
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Pemantauan Buku Induk UJK</h2>
          <p className="text-muted" style={{ margin: 0 }}>Tabel monitoring progres pelaksanaan, penugasan asesor, dan kelengkapan administrasi.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon="print">Cetak Laporan</Button>
          <Button variant="success" icon="file-excel">Export ke Excel</Button>
        </div>
      </div>
      {tableComponent}
    </div>
  );
};

export default BukuIndukPage;