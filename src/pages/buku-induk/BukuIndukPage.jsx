import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination'; 

import './BukuIndukPage.css';

const formatTgl = (tgl) => {
  if (!tgl) return '-';
  const parts = tgl.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return tgl;
};

const BukuIndukPage = ({ isEmbedded = false, role = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffView = role === 'staff-lsp' || location.pathname.includes('/staff-lsp');
  const isAdminView = role === 'admin-lsp' || location.pathname.includes('/admin-lsp');

  const [alertConfig, setAlertConfig] = useState(null);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputModalData, setInputModalData] = useState({ id: null, keyName: '', title: '', value: '', type: 'text' });

  const [filterTahun, setFilterTahun] = useState('Semua');
  const [filterBulan, setFilterBulan] = useState('Semua');
  const [filterTuk, setFilterTuk] = useState('Semua');
  const [filterPendanaan, setFilterPendanaan] = useState('Semua');

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isInputModalOpen) { setIsInputModalOpen(false); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isInputModalOpen]);

  // DATA DUMMY SINKRON (8 DATA)
  const [dataPemantauan, setDataPemantauan] = useState([
    { id: 1, idUjk: 'UJK-001', pendanaan: 'APBD', hari1: '2026-04-28', hari2: '2026-04-29', tuk: 'UPT BLK Surabaya', bidang: 'Pariwisata', skema: 'Pembuatan Roti Dan Kue', jumlahAsesi: 16, keputusanK: 16, keputusanBK: 0, asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', suratBalasan: true, suratPermohonan: true, spt: true, administrasi: true, administrasiPleno: false, pelaksanaanStatus: true, pembayaran: true, tglPleno: '2026-05-02', noPleno: '012/PLENO/2026', draft: true, cetak: false, dikirim: false, noResi: '', diterima: false, ttSertifikat: false },
    { id: 2, idUjk: 'UJK-002', pendanaan: 'APBN', hari1: '2026-04-25', hari2: '2026-04-26', tuk: 'UPT BLK Surabaya', bidang: 'Pariwisata', skema: 'Barista', jumlahAsesi: 20, keputusanK: '', keputusanBK: 20, asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, suratPermohonan: false, spt: false, administrasi: false, administrasiPleno: false, pelaksanaanStatus: false, pembayaran: false, tglPleno: '', noPleno: '', draft: false, cetak: false, dikirim: false, noResi: '', diterima: false, ttSertifikat: false },
    { id: 3, idUjk: 'UJK-003', pendanaan: 'Mandiri', hari1: '2026-04-22', hari2: '2026-04-23', tuk: 'UPT BLK Singosari', bidang: 'TIK', skema: 'Desain Grafis', jumlahAsesi: 15, keputusanK: '', keputusanBK: 15, asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, suratPermohonan: false, spt: false, administrasi: false, administrasiPleno: false, pelaksanaanStatus: false, pembayaran: false, tglPleno: '', noPleno: '', draft: false, cetak: false, dikirim: false, noResi: '', diterima: false, ttSertifikat: false },
    { id: 4, idUjk: 'UJK-004', pendanaan: 'APBD', hari1: '2026-04-18', hari2: '2026-04-19', tuk: 'PT ABC Motor', bidang: 'Otomotif', skema: 'Teknisi Kendaraan Ringan', jumlahAsesi: 10, keputusanK: '', keputusanBK: 10, asesor1: 'Endang Lestari', asesor2: 'Ahmad Fauzi', penyelia: 'Mohamad Andrian A', suratBalasan: true, suratPermohonan: true, spt: true, administrasi: false, administrasiPleno: false, pelaksanaanStatus: false, pembayaran: false, tglPleno: '', noPleno: '', draft: false, cetak: false, dikirim: false, noResi: '', diterima: false, ttSertifikat: false },
    { id: 5, idUjk: 'UJK-005', pendanaan: 'APBN', hari1: '2026-04-15', hari2: '2026-04-16', tuk: 'UPT BLK Madiun', bidang: 'Garmen', skema: 'Menjahit', jumlahAsesi: 16, keputusanK: '', keputusanBK: 16, asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, suratPermohonan: false, spt: false, administrasi: false, administrasiPleno: false, pelaksanaanStatus: false, pembayaran: false, tglPleno: '', noPleno: '', draft: false, cetak: false, dikirim: false, noResi: '', diterima: false, ttSertifikat: false },
    { id: 6, idUjk: 'UJK-006', pendanaan: 'Mandiri', hari1: '2026-04-12', hari2: '2026-04-13', tuk: 'UPT BLK Kediri', bidang: 'TIK', skema: 'Practical Office Advance', jumlahAsesi: 20, keputusanK: 18, keputusanBK: 2, asesor1: 'Risna Amalia', asesor2: 'Endang Lestari', penyelia: 'Budi Santoso', suratBalasan: true, suratPermohonan: true, spt: true, administrasi: true, administrasiPleno: true, pelaksanaanStatus: true, pembayaran: true, tglPleno: '2026-04-18', noPleno: '010/PLENO/2026', draft: true, cetak: true, dikirim: true, noResi: 'JNT12345678', diterima: true, ttSertifikat: true },
    { id: 7, idUjk: 'UJK-007', pendanaan: 'APBD', hari1: '2026-04-10', hari2: '2026-04-11', tuk: 'UPT BLK Jember', bidang: 'Pertanian', skema: 'Budidaya Jamur', jumlahAsesi: 15, keputusanK: '', keputusanBK: 15, asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, suratPermohonan: false, spt: false, administrasi: false, administrasiPleno: false, pelaksanaanStatus: false, pembayaran: false, tglPleno: '', noPleno: '', draft: false, cetak: false, dikirim: false, noResi: '', diterima: false, ttSertifikat: false },
    { id: 8, idUjk: 'UJK-008', pendanaan: 'APBN', hari1: '2026-04-05', hari2: '2026-04-06', tuk: 'LKP Mutiara', bidang: 'Kecantikan', skema: 'Tata Rias', jumlahAsesi: 12, keputusanK: 12, keputusanBK: 0, asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', suratBalasan: true, suratPermohonan: true, spt: true, administrasi: true, administrasiPleno: true, pelaksanaanStatus: true, pembayaran: true, tglPleno: '2026-04-10', noPleno: '008/PLENO/2026', draft: true, cetak: true, dikirim: true, noResi: 'JNE999888', diterima: true, ttSertifikat: false },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTahun, filterBulan, filterTuk, filterPendanaan]);

  const sortedDataPemantauan = useMemo(() => {
    let filtered = [...dataPemantauan];
    if (filterTahun !== 'Semua') filtered = filtered.filter(item => item.hari1.startsWith(filterTahun));
    if (filterBulan !== 'Semua') filtered = filtered.filter(item => item.hari1.split('-')[1] === filterBulan);
    if (filterTuk !== 'Semua') filtered = filtered.filter(item => item.tuk === filterTuk);
    if (filterPendanaan !== 'Semua') filtered = filtered.filter(item => item.pendanaan === filterPendanaan);
    
    // Sort Dari Terbaru ke Terlama (Descending)
    return filtered.sort((a, b) => new Date(b.hari1) - new Date(a.hari1));
  }, [dataPemantauan, filterTahun, filterBulan, filterTuk, filterPendanaan]);

  const totalPages = Math.ceil(sortedDataPemantauan.length / itemsPerPage);
  const paginatedData = sortedDataPemantauan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) setTimeout(() => setAlertConfig(null), 2500);
  };

  const handleProgressClick = (id, keyName, title) => {
    if (['tglPleno', 'noPleno', 'noResi'].includes(keyName)) {
      setInputModalData({ id, keyName, title, value: '', type: keyName === 'tglPleno' ? 'date' : 'text' });
      setIsInputModalOpen(true);
      return;
    }

    setAlertConfig({
      type: 'save', 
      title: `Selesaikan ${title}?`,
      text: `Apakah Anda yakin ingin menyelesaikan tahapan "${title}"? Jika sudah dikonfirmasi selesai, status tidak dapat diubah lagi.`,
      onConfirm: () => {
        setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [keyName]: true } : item));
        showAlert('success', 'Status Diperbarui', `Tahapan ${title} berhasil diselesaikan.`);
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const renderProgressButton = (status, id, keyName, title) => {
    if (typeof status === 'string') {
      if (status !== '') return <span style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{keyName === 'tglPleno' ? formatTgl(status) : status}</span>;
      return (
        <button onClick={() => handleProgressClick(id, keyName, title)} style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap', transition: '0.2s' }}>
          <i className="fas fa-plus"></i> Atur
        </button>
      );
    }
    
    if (status) {
      return (
        <div style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
          <i className="fas fa-check-circle"></i> Selesai
        </div>
      );
    }
    
    return (
      <button onClick={() => handleProgressClick(id, keyName, title)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px dashed #fca5a5', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap', transition: '0.2s' }}>
        <i className="fas fa-times-circle"></i> Belum Selesai
      </button>
    );
  };

  // --- RENDERING BUTTON PINDAH HALAMAN (SMART NAVIGATION) ---
  const renderAsesor = (name, item) => {
    if (isAdminView && !name) {
      return (
        <button 
          onClick={() => {
             navigate('/admin-lsp/penugasan', { state: { openDetailId: item.idUjk, fromDashboard: true } });
             window.scrollTo(0,0);
          }}
          style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', transition: '0.2s' }}
        >
          <i className="fas fa-user-plus"></i> Plot Asesor
        </button>
      );
    }
    if (name) return <span style={{fontWeight: 600, color: '#0f172a', fontSize: '0.85rem'}}>{name}</span>;
    return (
      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '0.75rem', fontWeight: '600' }}>
        <i className="fas fa-lock" style={{marginRight: '4px'}}></i> Kosong
      </span>
    );
  };

  const renderSurat = (status, item, jenisSurat) => {
    const isFullyPlotted = item.asesor1 && item.penyelia; 
    if (isStaffView || isAdminView) {
      if (!isFullyPlotted) {
        return (
          <button disabled style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.75rem', fontWeight: 'bold', width: '100%' }}>
            <i className="fas fa-lock"></i> Terkunci
          </button>
        );
      }
      
      return (
        <button 
          onClick={() => {
              if (isAdminView) navigate('/admin-lsp/penugasan', { state: { openDetailId: item.idUjk, fromDashboard: true } });
              if (isStaffView) navigate('/staff-lsp/surat', { state: { openDetailId: item.idUjk, fromDashboard: true } });
              window.scrollTo(0,0);
          }} 
          style={{ background: status ? '#ecfdf5' : '#eff6ff', color: status ? '#10b981' : '#3b82f6', border: status ? '1px solid #10b981' : '1px solid #3b82f6', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap' }}
        >
          <i className={status ? "fas fa-check-circle" : "fas fa-external-link-alt"}></i> {status ? 'Selesai' : 'Kelola'}
        </button>
      );
    }
    if (!isFullyPlotted) return <i className="fas fa-lock" style={{color: '#94a3b8'}}></i>;
    if (status) return <i className="fas fa-check-circle" style={{color: '#10b981'}}></i>;
    return <i className="fas fa-times-circle" style={{color: '#ef4444'}}></i>;
  };

  const filterUI = (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="far fa-calendar-alt" style={{marginRight: '5px'}}></i>Tahun</label>
        <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="far fa-calendar" style={{marginRight: '5px'}}></i>Bulan</label>
        <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Bulan</option>
          <option value="01">Januari</option>
          <option value="02">Februari</option>
          <option value="03">Maret</option>
          <option value="04">April</option>
          <option value="05">Mei</option>
          <option value="06">Juni</option>
          <option value="07">Juli</option>
          <option value="08">Agustus</option>
          <option value="09">September</option>
          <option value="10">Oktober</option>
          <option value="11">November</option>
          <option value="12">Desember</option>
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="fas fa-map-marker-alt" style={{marginRight: '5px'}}></i>Nama TUK</label>
        <select value={filterTuk} onChange={(e) => setFilterTuk(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua TUK</option>
          <option value="UPT BLK Surabaya">UPT BLK Surabaya</option>
          <option value="UPT BLK Singosari">UPT BLK Singosari</option>
          <option value="UPT BLK Kediri">UPT BLK Kediri</option>
          <option value="UPT BLK Madiun">UPT BLK Madiun</option>
          <option value="UPT BLK Jember">UPT BLK Jember</option>
          <option value="UPT BLK Malang">UPT BLK Malang</option>
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="fas fa-wallet" style={{marginRight: '5px'}}></i>Pendanaan</label>
        <select value={filterPendanaan} onChange={(e) => setFilterPendanaan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Pendanaan</option>
          <option value="APBD">APBD</option>
          <option value="APBN">APBN</option>
          <option value="Mandiri">Mandiri</option>
        </select>
      </div>
    </div>
  );

  const tableComponent = (
    <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
      
      {/* --- POPUP INPUT MANUAL (Pleno / Resi) --- */}
      {isInputModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '400px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', animation: 'zoomIn 0.2s ease-out' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0, fontSize: '1.25rem', color: '#0f172a'}}>Input {inputModalData.title}</h3>
               <button type="button" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsInputModalOpen(false)}>&times;</button>
             </div>
             <div className="modal-body" style={{ padding: '20px' }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setDataPemantauan(prev => prev.map(item => item.id === inputModalData.id ? { ...item, [inputModalData.keyName]: inputModalData.value } : item));
                  setIsInputModalOpen(false);
                  showAlert('success', 'Berhasil Disimpan', `Data ${inputModalData.title} telah diperbarui.`);
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{display: 'block', fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '8px'}}>
                      Masukkan {inputModalData.title} <span style={{color:'red'}}>*</span>
                    </label>
                    <input 
                      type={inputModalData.type} 
                      style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'8px', padding: '10px', outline: 'none', fontSize: '0.95rem'}} 
                      value={inputModalData.value} 
                      onChange={(e) => setInputModalData({...inputModalData, value: e.target.value})} 
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" onClick={() => setIsInputModalOpen(false)}>Batal</Button>
                    <Button type="submit" variant="primary" icon="save" style={{backgroundColor: '#2563eb', color: 'white', border: 'none'}}>Simpan Data</Button>
                  </div>
                </form>
             </div>
           </div>
         </div>
      )}

      <div className="table-responsive-wrapper">
        <div className="table-responsive-excel">
          <table className="excel-table">
            <thead>
              <tr>
                <th rowSpan="2" style={{ width: '50px', position: 'sticky', left: 0, zIndex: 2, backgroundColor: '#f1f5f9' }}>No</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Pendanaan</th>
                <th colSpan="2">Pelaksanaan</th>
                <th rowSpan="2" style={{ minWidth: '200px' }}>TUK</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>Bidang</th>
                <th rowSpan="2" style={{ minWidth: '250px' }}>Skema</th>
                <th rowSpan="2" style={{ minWidth: '100px' }}>Jumlah<br/>Asesi</th>
                <th colSpan="2">Keputusan</th>
                <th rowSpan="2" className="col-asesor" style={{ minWidth: '180px' }}>Asesor 1</th>
                <th rowSpan="2" className="col-asesor" style={{ minWidth: '180px' }}>Asesor 2</th>
                <th rowSpan="2" className="col-asesor" style={{ minWidth: '180px' }}>Penyelia</th>
                
                <th rowSpan="2">Surat<br/>Balasan</th>
                <th rowSpan="2">Surat<br/>Permohonan</th>
                <th rowSpan="2">SPT</th>
                <th rowSpan="2">Adminis<br/>trasi</th>
                <th rowSpan="2">Adminis<br/>trasi Pleno</th>

                <th rowSpan="2" style={{ minWidth: '150px' }}>Pelaksanaan</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>Pembayaran</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>Tgl PLENO</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>NO. PLENO</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>DRAFT</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>CETAK</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Di Kirim</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>No Resi</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Di Terima</th>
                <th rowSpan="2" style={{ minWidth: '180px' }}>TT Sertifikat</th>
              </tr>
              <tr>
                <th className="col-date" style={{ minWidth: '120px' }}>Hari 1</th>
                <th className="col-date" style={{ minWidth: '120px' }}>Hari 2</th>
                <th style={{minWidth: '50px'}}>K</th>
                <th style={{minWidth: '50px'}}>BK</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center" style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1, fontWeight: 'bold' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="text-center"><span className="badge info">{item.pendanaan}</span></td>
                  <td className="text-center">{formatTgl(item.hari1)}</td>
                  <td className="text-center">{formatTgl(item.hari2)}</td>
                  <td>{item.tuk}</td>
                  <td>{item.bidang}</td>
                  <td><strong>{item.skema}</strong></td>
                  <td className="text-center font-bold" style={{ backgroundColor: '#f1f5f9' }}>{item.jumlahAsesi}</td>
                  <td className="text-center font-bold text-green-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanK}</td>
                  <td className="text-center font-bold text-red-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanBK}</td>
                  
                  <td className="text-center">{renderAsesor(item.asesor1, item)}</td>
                  <td className="text-center">{renderAsesor(item.asesor2, item)}</td>
                  <td className="text-center">{renderAsesor(item.penyelia, item)}</td>
                  
                  <td className="text-center">{renderSurat(item.suratBalasan, item, 'Surat Balasan', 'suratBalasan')}</td>
                  <td className="text-center">{renderSurat(item.suratPermohonan, item, 'Surat Permohonan', 'suratPermohonan')}</td>
                  <td className="text-center">{renderSurat(item.spt, item, 'Surat Tugas', 'spt')}</td>
                  <td className="text-center">{renderSurat(item.administrasi, item, 'Administrasi', 'administrasi')}</td>
                  <td className="text-center">{renderSurat(item.administrasiPleno, item, 'Administrasi Pleno', 'administrasiPleno')}</td>

                  <td className="text-center">{renderProgressButton(item.pelaksanaanStatus, item.id, 'pelaksanaanStatus', 'Pelaksanaan')}</td>
                  <td className="text-center">{renderProgressButton(item.pembayaran, item.id, 'pembayaran', 'Pembayaran')}</td>
                  <td className="text-center">{renderProgressButton(item.tglPleno, item.id, 'tglPleno', 'Tanggal Pleno')}</td>
                  <td className="text-center">{renderProgressButton(item.noPleno, item.id, 'noPleno', 'Nomor Pleno')}</td>
                  <td className="text-center">{renderProgressButton(item.draft, item.id, 'draft', 'Draft Blanko')}</td>
                  <td className="text-center">{renderProgressButton(item.cetak, item.id, 'cetak', 'Cetak Blanko')}</td>
                  <td className="text-center">{renderProgressButton(item.dikirim, item.id, 'dikirim', 'Status Kirim BNSP')}</td>
                  <td className="text-center">{renderProgressButton(item.noResi, item.id, 'noResi', 'Input Resi')}</td>
                  <td className="text-center">{renderProgressButton(item.diterima, item.id, 'diterima', 'Blanko Diterima')}</td>
                  <td className="text-center">{renderProgressButton(item.ttSertifikat, item.id, 'ttSertifikat', 'Tanda Terima Sertifikat')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="29" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-filter" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', color: '#cbd5e1' }}></i>
                    Tidak ada data yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff' }}>
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="embedded-buku-induk fade-in-content">
        {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />}
        <div className="embedded-header">
          <div>
             <h3 className="embedded-header-title">Pemantauan</h3>
             <p className="text-muted" style={{ margin: 0 }}>
               {isAdminView ? 'Kelola penugasan Asesor dan Penyelia, serta pantau progres UJK.' : 'Klik tombol di dalam tabel untuk membuka menu manajemen dan mencetak dokumen UJK.'}
             </p>
          </div>
        </div>
        {filterUI}
        {tableComponent}
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content">
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Pemantauan Uji Kompetensi</h2>
          <p className="text-muted" style={{ margin: 0 }}>Tabel monitoring progres pelaksanaan, penugasan asesor, dan kelengkapan administrasi.</p>
        </div>
      </div>
      {filterUI}
      {tableComponent}
    </div>
  );
};

export default BukuIndukPage;