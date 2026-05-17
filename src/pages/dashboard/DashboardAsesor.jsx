import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Pagination from '../../components/ui/Pagination';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import SuratBalasanPDF from '../surat/pdf/SuratBalasanPDF';
import SuratTugasPDF from '../surat/pdf/SuratTugasPDF';
import BeritaAcaraPDF from '../surat/pdf/BeritaAcaraPDF';

const DashboardAsesor = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null); 
  
  // --- STATE FILTER & PAGINATION ---
  const [filterStatus, setFilterStatus] = useState('Semua'); // 'Semua', 'Mendatang', 'Selesai'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- DATA AGENDA (Disesuaikan agar ada data Mei & Juni) ---
  const [agendaPenugasan] = useState([
    { id: 1, skema: 'Pembuatan Roti dan Kue', kejuruan: 'Pariwisata', tanggal: '24 April 2026', rawDate: '2026-04-24', tuk: 'TUK Sewaktu BLK Surabaya', pesertaList: [{ id: 1, nama: 'Siti Aminah', nik: '3578001122334455', jk: 'P', tempatLahir: 'Surabaya', tanggalLahir: '12 Mei 1995', alamat: 'Jl. Kenangan No 1', rt: '01', rw: '02', kelurahan: 'Ketintang', kecamatan: 'Gayungan', hp: '08123456789', email: 'siti@mail.com', pendidikan: 'SMA' }] },
    { id: 2, skema: 'Barista', kejuruan: 'Pariwisata', tanggal: '26 April 2026', rawDate: '2026-04-26', tuk: 'TUK Sewaktu BLK Surabaya', pesertaList: [{ id: 3, nama: 'Andi Wijaya', nik: '3578002233445566', jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '21 Juli 1998', alamat: 'Perumahan Tropodo', rt: '05', rw: '01', kelurahan: 'Tropodo', kecamatan: 'Waru', hp: '082233445566', email: 'andi@mail.com', pendidikan: 'D3' }] },
    { id: 3, skema: 'Desain Grafis Madya', kejuruan: 'TIK', tanggal: '10 April 2026', rawDate: '2026-04-10', tuk: 'TUK Mandiri Unesa', pesertaList: [] },
    { id: 4, skema: 'Welder SMAW 3G', kejuruan: 'Manufaktur', tanggal: '05 Mei 2026', rawDate: '2026-05-05', tuk: 'TUK Sewaktu BLK Kediri', pesertaList: [] },
    { id: 5, skema: 'Junior Web Developer', kejuruan: 'TIK', tanggal: '15 Mei 2026', rawDate: '2026-05-15', tuk: 'TUK BLK Surabaya', pesertaList: [] },
    { id: 6, skema: 'Network Administrator', kejuruan: 'TIK', tanggal: '01 Juni 2026', rawDate: '2026-06-01', tuk: 'TUK BLK Surabaya', pesertaList: [] }
  ]);

  // --- LOGIKA PROSES DATA (SORTING & AUTO-STATUS) ---
  const processedAgenda = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // 1. Tentukan status Selesai/Mendatang
    const mappedData = agendaPenugasan.map(item => {
      const itemDate = new Date(item.rawDate);
      return { ...item, isSelesai: itemDate < today };
    });

    // 2. Filter berdasarkan tombol yang ditekan
    const filtered = mappedData.filter(item => {
      if (filterStatus === 'Mendatang') return !item.isSelesai;
      if (filterStatus === 'Selesai') return item.isSelesai;
      return true;
    });

    // 3. Sorting Cerdas: Mendatang di atas (terdekat), Selesai di bawah (terbaru)
    return filtered.sort((a, b) => {
      if (a.isSelesai !== b.isSelesai) return a.isSelesai ? 1 : -1;
      if (!a.isSelesai) return new Date(a.rawDate) - new Date(b.rawDate); // ASC untuk Mendatang
      return new Date(b.rawDate) - new Date(a.rawDate); // DESC untuk Selesai agar Mei di atas April
    });
  }, [agendaPenugasan, filterStatus]);

  const countMendatang = agendaPenugasan.filter(a => new Date(a.rawDate) >= new Date().setHours(0,0,0,0)).length;
  const countSelesai = agendaPenugasan.length - countMendatang;

  const paginatedData = processedAgenda.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(processedAgenda.length / itemsPerPage);

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (selectedPeserta) { setSelectedPeserta(null); e.preventDefault(); }
      else if (previewDokumen) { setPreviewDokumen(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [selectedPeserta, previewDokumen]);

  const handlePreviewDokumen = (jenis, item) => {
    const ujkData = {
      skema: item.skema, bidang: item.kejuruan, tuk: item.tuk, hari1: item.tanggal, hari2: item.tanggal, 
      waktu: '08.00 WIB s/d Selesai', asesor1: userData?.namaLengkap || 'Wasini, SE, MM',
      noReg1: userData?.noReg || 'MET.000.001668.2012', asesi: item.pesertaList?.length || 0 
    };
    const formData = {
      noSurat: `ST-${item.id}/LSP-BLK/IV/2026`, tanggalSurat: item.tanggal,
      noDokumen: jenis === 'BA' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR.KPA.02',
      edisiRevisi: '01/00', tanggalBerlaku: '10-Nov-2015', halaman: '1 dari 1', includeTTD: true
    };
    setPreviewDokumen({ jenis, data: { ujk: ujkData, form: formData } });
  };

  if (previewDokumen) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div><h3 style={{ margin: '0 0 5px 0' }}>Pratinjau Dokumen</h3><p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Format PDF resmi UPT Pelatihan Kerja Surabaya.</p></div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
            <PDFDownloadLink 
              document={previewDokumen.jenis === 'SPT' ? <SuratTugasPDF data={previewDokumen.data} /> : <BeritaAcaraPDF data={{ ujk: previewDokumen.data.ujk }} />} 
              fileName={`${previewDokumen.jenis}_Asesor.pdf`}
              style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              {({ loading }) => (loading ? 'Menyiapkan...' : 'Unduh PDF')}
            </PDFDownloadLink>
          </div>
        </div>
        <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <PDFViewer width="100%" height="100%" showToolbar={true}>
            {previewDokumen.jenis === 'SPT' && <SuratTugasPDF data={previewDokumen.data} />}
            {previewDokumen.jenis === 'BA' && <BeritaAcaraPDF data={{ ujk: previewDokumen.data.ujk }} />}
          </PDFViewer>
        </div>
      </div>
    );
  }

  if (selectedPeserta) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali ke Jadwal</Button>
          <div><h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Peserta Ujian</h2><p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p></div>
        </div>
        <div className="dashboard-card" style={{ padding: '25px' }}>
          <TablePeserta dataPeserta={selectedPeserta.pesertaList || []} skemaName={selectedPeserta.skema} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative' }}>
      {alertConfig && <AlertPopup {...alertConfig} onConfirm={() => setAlertConfig(null)} onCancel={() => setAlertConfig(null)} />}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: '700', margin: '0' }}>Halo, {userData?.namaLengkap || 'Asesor'}!</h2>
        <p className="text-muted" style={{ fontSize: '1rem', marginTop: '6px' }}>Pantau jadwal penugasan dan unduh dokumen administrasi.</p>
      </div>

      {/* --- KOTAK INFORMASI / TOMBOL STATISTIK --- */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div 
          onClick={() => { setFilterStatus('Semua'); setCurrentPage(1); }}
          className={`stat-card ${filterStatus === 'Semua' ? 'active-stat' : ''}`}
          style={{ cursor: 'pointer', border: filterStatus === 'Semua' ? '2px solid #2563eb' : '1px solid #e2e8f0', transition: '0.3s' }}
        >
          <div className="stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}><i className="fas fa-list-ul"></i></div>
          <div className="stat-info"><h3>{agendaPenugasan.length}</h3><p>Semua Jadwal</p></div>
        </div>

        <div 
          onClick={() => { setFilterStatus('Mendatang'); setCurrentPage(1); }}
          className={`stat-card ${filterStatus === 'Mendatang' ? 'active-stat' : ''}`}
          style={{ cursor: 'pointer', border: filterStatus === 'Mendatang' ? '2px solid #2563eb' : '1px solid #e2e8f0', transition: '0.3s' }}
        >
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><i className="fas fa-calendar-alt"></i></div>
          <div className="stat-info"><h3>{countMendatang}</h3><p>UJK Mendatang</p></div>
        </div>

        <div 
          onClick={() => { setFilterStatus('Selesai'); setCurrentPage(1); }}
          className={`stat-card ${filterStatus === 'Selesai' ? 'active-stat' : ''}`}
          style={{ cursor: 'pointer', border: filterStatus === 'Selesai' ? '2px solid #10b981' : '1px solid #e2e8f0', transition: '0.3s' }}
        >
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><i className="fas fa-check-circle"></i></div>
          <div className="stat-info"><h3>{countSelesai}</h3><p>Ujian Selesai</p></div>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: '0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: '600', margin: '0' }}>
                Daftar Penugasan: <span style={{color: filterStatus === 'Selesai' ? '#10b981' : '#2563eb'}}>{filterStatus}</span>
            </h3>
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Tanggal</th>
                <th style={{ width: '25%', textAlign: 'center' }}>Skema Kejuruan</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Lokasi TUK</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Peserta</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', color: '#94a3b8' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}><i className="far fa-calendar-alt text-muted" style={{marginRight:'6px'}}></i>{item.tanggal}</td>
                  <td style={{ textAlign: 'center' }}><strong style={{ color: '#0f172a' }}>{item.skema}</strong><br/><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.kejuruan}</span></td>
                  <td style={{ textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>{item.tuk}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPeserta(item)} style={{ margin: '0 auto' }}>
                      <strong>{item.pesertaList?.length || 0}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                    </Button>
                  </td>
                  <td style={{ textAlign: 'center' }}><span className={`badge ${item.isSelesai ? 'success' : 'primary'}`}>{item.isSelesai ? 'Selesai' : 'Mendatang'}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', minWidth: '80px', gap: '4px' }} 
                        onClick={() => handlePreviewDokumen('SPT', item)}
                      ><i className="fas fa-file-signature" style={{ fontSize: '1.2rem' }}></i><span>Surat Tugas</span></button>
                      <button 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', minWidth: '80px', gap: '4px' }} 
                        onClick={() => handlePreviewDokumen('BA', item)}
                      ><i className="fas fa-file-contract" style={{ fontSize: '1.2rem' }}></i><span>Berita Acara</span></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Tidak ada jadwal penugasan.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={processedAgenda.length} itemsPerPage={itemsPerPage} />
      </div>
    </div>
  );
};

export default DashboardAsesor;