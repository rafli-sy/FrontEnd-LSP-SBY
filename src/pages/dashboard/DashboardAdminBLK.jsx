import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Pagination from '../../components/ui/Pagination';

const DashboardAdminBLK = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [previewType, setPreviewType] = useState(''); // 'balasan' atau 'pengajuan'
  const [viewPdf, setViewPdf] = useState(null); 

  // --- DUMMY DATA BANYAK ---
  const riwayatPengajuan = [
    { 
      id: 1, nomorSurat: '088/BLK-SBY/IV/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '20 April - 21 April 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(16).fill({ id: 1, nama: 'Siti Aminah' }) },
        { judul: 'Barista', bidang: 'Pariwisata', jenis: 'Klaster', tuk: 'TUK Mandiri Kopi Senja', tanggal: '22 April - 23 April 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(12).fill({ id: 2, nama: 'Budi Santoso' }) }
      ]
    },
    { 
      id: 2, nomorSurat: '045/BLK-SBY/III/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Desain Grafis Madya', bidang: 'TIK', jenis: 'Klaster', tuk: 'TUK Mandiri PT. Sejahtera', tanggal: '15 Maret - 16 Maret 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(20).fill({ id: 3, nama: 'Andi Wijaya' }) }
      ]
    },
    { 
      id: 3, nomorSurat: '012/BLK-SBY/I/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Welder SMAW 3G', bidang: 'Manufaktur', jenis: 'KKNI', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '10 Januari - 12 Januari 2026', status: 'Ditolak oleh LSP', badge: 'danger', peserta: Array(10).fill({ id: 4, nama: 'Rina Melati' }) },
        { judul: 'Servis Sepeda Motor Injeksi', bidang: 'Otomotif', jenis: 'Okupasi', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '15 Januari - 16 Januari 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(15).fill({ id: 5, nama: 'Tono Hermawan' }) }
      ]
    },
    { 
      id: 4, nomorSurat: '091/BLK-SBY/V/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Network Administrator Muda', bidang: 'TIK', jenis: 'Okupasi', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '02 Mei - 04 Mei 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(18).fill({ id: 6, nama: 'Hadid Yulian' }) }
      ]
    },
    { 
      id: 5, nomorSurat: '092/BLK-SBY/V/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Digital Marketing', bidang: 'Bisnis', jenis: 'Klaster', tuk: 'TUK Mandiri PT. Maju', tanggal: '10 Mei - 11 Mei 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(25).fill({ id: 7, nama: 'Peserta Marketing' }) }
      ]
    },
    { 
      id: 6, nomorSurat: '095/BLK-SBY/V/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Operator Mesin Bubut CNC', bidang: 'Manufaktur', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Singosari', tanggal: '15 Mei - 17 Mei 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(10).fill({ id: 8, nama: 'Peserta Bubut' }) }
      ]
    },
    { 
      id: 7, nomorSurat: '098/BLK-SBY/VI/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Menjahit dengan Mesin Lockstich', bidang: 'Garmen', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '01 Juni - 02 Juni 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(16).fill({ id: 9, nama: 'Peserta Jahit' }) }
      ]
    },
    { 
      id: 8, nomorSurat: '101/BLK-SBY/VI/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Tata Rias Pengantin', bidang: 'Kecantikan', jenis: 'Klaster', tuk: 'TUK Mandiri Salon Indah', tanggal: '05 Juni - 06 Juni 2026', status: 'Ditolak oleh LSP', badge: 'danger', peserta: Array(12).fill({ id: 10, nama: 'Peserta Rias' }) }
      ]
    },
    { 
      id: 9, nomorSurat: '103/BLK-SBY/VI/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Teknisi AC Split', bidang: 'Refrigerasi', jenis: 'Okupasi', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '10 Juni - 12 Juni 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(15).fill({ id: 11, nama: 'Peserta AC' }) }
      ]
    },
    { 
      id: 10, nomorSurat: '105/BLK-SBY/VII/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Pemrograman Web Front-End', bidang: 'TIK', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '01 Juli - 03 Juli 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(20).fill({ id: 12, nama: 'Peserta Web' }) }
      ]
    },
    { 
      id: 11, nomorSurat: '106/BLK-SBY/VII/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Instalasi Listrik Bangunan Sederhana', bidang: 'Listrik', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '05 Juli - 07 Juli 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(14).fill({ id: 13, nama: 'Peserta Listrik' }) }
      ]
    },
    { 
      id: 12, nomorSurat: '110/BLK-SBY/VIII/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Housekeeping', bidang: 'Pariwisata', jenis: 'Okupasi', tuk: 'TUK Mandiri Hotel Aston', tanggal: '10 Agustus - 11 Agustus 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(22).fill({ id: 14, nama: 'Peserta HK' }) }
      ]
    },
    { 
      id: 13, nomorSurat: '112/BLK-SBY/VIII/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Desain UI/UX', bidang: 'TIK', jenis: 'Okupasi', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '15 Agustus - 16 Agustus 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(18).fill({ id: 15, nama: 'Peserta UIUX' }) }
      ]
    },
    { 
      id: 14, nomorSurat: '115/BLK-SBY/IX/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Pemeliharaan Kendaraan Ringan', bidang: 'Otomotif', jenis: 'Klaster', tuk: 'TUK Mandiri Auto2000', tanggal: '01 September - 03 September 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(16).fill({ id: 16, nama: 'Peserta Mobil' }) }
      ]
    },
    { 
      id: 15, nomorSurat: '118/BLK-SBY/IX/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Pembuatan Pola Pakaian', bidang: 'Garmen', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '10 September - 11 September 2026', status: 'Ditolak oleh LSP', badge: 'danger', peserta: Array(10).fill({ id: 17, nama: 'Peserta Pola' }) }
      ]
    },
    { 
      id: 16, nomorSurat: '120/BLK-SBY/X/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Customer Service', bidang: 'Bisnis', jenis: 'Okupasi', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '05 Oktober - 06 Oktober 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(24).fill({ id: 18, nama: 'Peserta CS' }) }
      ]
    },
    { 
      id: 17, nomorSurat: '122/BLK-SBY/X/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Admin Perkantoran', bidang: 'Bisnis', jenis: 'Okupasi', tuk: 'TUK Mandiri PT. ABC', tanggal: '15 Oktober - 16 Oktober 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(18).fill({ id: 19, nama: 'Peserta Admin' }) }
      ]
    },
    { 
      id: 18, nomorSurat: '125/BLK-SBY/XI/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Fotografi Dasar', bidang: 'Pariwisata', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '01 November - 02 November 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(14).fill({ id: 20, nama: 'Peserta Foto' }) },
        { judul: 'Videografi', bidang: 'Pariwisata', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '03 November - 04 November 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(12).fill({ id: 21, nama: 'Peserta Video' }) }
      ]
    },
    { 
      id: 19, nomorSurat: '128/BLK-SBY/XI/2026', suratBalasan: 'Tersedia',
      skemaList: [
        { judul: 'Animasi 3D', bidang: 'TIK', jenis: 'Okupasi', tuk: 'TUK Mandiri Studio Kreatif', tanggal: '15 November - 18 November 2026', status: 'Disetujui LSP', badge: 'success', peserta: Array(10).fill({ id: 22, nama: 'Peserta Animasi' }) }
      ]
    },
    { 
      id: 20, nomorSurat: '130/BLK-SBY/XII/2026', suratBalasan: null,
      skemaList: [
        { judul: 'Pembuatan Roti Manis', bidang: 'Pariwisata', jenis: 'Klaster', tuk: 'TUK Sewaktu BLK Surabaya', tanggal: '01 Desember - 02 Desember 2026', status: 'Sedang Diproses', badge: 'warning', peserta: Array(15).fill({ id: 23, nama: 'Peserta Roti Manis' }) }
      ]
    }
  ];

  // Filter 
  const filteredRiwayat = riwayatPengajuan.filter(item => {
    const matchSearch = item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || item.skemaList.some(s => s.status === filterStatus);
    return matchSearch && matchStatus;
  });

  // LOGIKA PAGINATION: 6 data per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage);
  const paginatedRiwayat = filteredRiwayat.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Perhitungan Statistik
  const totalUsulan = riwayatPengajuan.length;
  const countDiproses = riwayatPengajuan.flatMap(r => r.skemaList).filter(s => s.status === 'Sedang Diproses').length;
  const countDisetujui = riwayatPengajuan.flatMap(r => r.skemaList).filter(s => s.status === 'Disetujui LSP').length;

  // Fungsi Lihat Surat Balasan
  const handleViewBalasan = (item) => {
    const dummyBalasanData = {
      ujk: {
        nomorSurat: item.nomorSurat,
        tanggal: item.skemaList[0]?.tanggal || 'N/A', 
        tuk: item.skemaList[0]?.tuk || 'N/A',
        asesi: item.skemaList.reduce((acc, curr) => acc + (curr.peserta?.length || 0), 0),
        skema: item.skemaList.map(s => s.judul).join(', '),
        bidang: 'Aneka Kejuruan',
        asesor1: 'Risna Amalia',
        penyelia: 'Putri Adelia Khairunnisa' // Mentor kamu
      },
      form: {
        noSurat: '000.140A/LSP BLK-SBY/V/2026',
        tanggalSurat: '12 Mei 2026',
        kepadaTujuan: 'UPT BLK Surabaya'
      }
    };
    setPreviewDokumen(dummyBalasanData);
    setPreviewType('balasan');
  };

  // Fungsi Lihat Surat Pengajuan (Hasil Form)
  const handleViewPengajuan = (item) => {
    const dummyPengajuanData = {
      nomorSurat: item.nomorSurat,
      instansi: 'UPT Pelatihan Kerja Surabaya',
      skema: item.skemaList.map(s => s.judul).join(', '),
      tanggal: item.skemaList[0]?.tanggal || '',
      tim: 'Hadid Yulian, Ade Ninda Wahyu Saputri' // Rekan tim kamu
    };
    setPreviewDokumen(dummyPengajuanData);
    setPreviewType('pengajuan');
  };

  // VIEWER DOKUMEN (BALASAN / PENGAJUAN)
  if (previewDokumen) {
    return (
      <div className="dashboard-content fade-in-content">
        <div className="print-preview-container" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
          <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{previewType === 'balasan' ? 'Surat Balasan LSP' : 'Surat Pengajuan UJK'}</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Pratinjau dokumen resmi sistem LSP-BLK Surabaya.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
              <PDFDownloadLink 
                document={previewType === 'balasan' ? <SuratBalasanPDF data={previewDokumen} /> : <BeritaAcaraPDF data={previewDokumen} />} 
                fileName={previewType === 'balasan' ? "Surat_Balasan.pdf" : "Form_Pengajuan.pdf"}
                style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              >
                {({ loading }) => (loading ? 'Memproses...' : 'Unduh PDF')}
              </PDFDownloadLink>
            </div>
          </div>
          <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <PDFViewer width="100%" height="100%" showToolbar={true}>
              {previewType === 'balasan' ? <SuratBalasanPDF data={previewDokumen} /> : <BeritaAcaraPDF data={previewDokumen} />}
            </PDFViewer>
          </div>
        </div>
      </div>
    );
  }

  // VIEWER DATA PESERTA
  if (selectedSurat) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setSelectedSurat(null)} style={{ background: '#fff' }}> Kembali </Button>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Nominatif Peserta</h2>
            <p className="text-muted" style={{ margin: 0 }}>Nomor Surat: <strong>{selectedSurat.nomorSurat}</strong> | Skema: {selectedSurat.skema}</p>
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '25px' }}>
          <TablePeserta dataPeserta={selectedSurat.pesertaList || []} skemaName={`Peserta_${selectedSurat.skema}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative' }}>
      
      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}><i className="fas fa-envelope"></i></div>
          <div className="stat-info"><h3>{totalUsulan}</h3><p>Total Surat Terkirim</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><i className="fas fa-spinner fa-spin"></i></div>
          <div className="stat-info"><h3>{countDiproses}</h3><p>Skema Sedang Diproses</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="fas fa-check-circle"></i></div>
          <div className="stat-info"><h3>{countDisetujui}</h3><p>Skema Disetujui</p></div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '25px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#0f172a' }}>Monitoring Pengajuan UJK</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Pantau status persetujuan dari seluruh surat pengajuan yang telah terkirim.</p>
          </div>
          <Button variant="primary" icon="plus" onClick={() => navigate('/admin-blk/pengajuan')}>
            Buat Usulan UJK Baru (Draft)
          </Button>
        </div>

        {/* SEARCH & FILTER */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input 
              type="text" 
              placeholder="Cari berdasarkan Nomor Surat..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer' }}
            >
              <option value="Semua">Semua</option>
              <option value="Sedang Diproses">Diproses</option>
              <option value="Disetujui LSP">Disetujui</option>
              <option value="Ditolak oleh LSP">Ditolak</option>
            </select>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '4%', textAlign: 'center' }}>No.</th>
                <th style={{ width: '14%' }}>Nomor Surat</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Surat Pengajuan</th>
                <th style={{ width: '18%' }}>Lokasi TUK</th>
                <th style={{ width: '22%' }}>Skema & Tanggal</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Kurikulum</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Peserta</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Balasan</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRiwayat.length > 0 ? (
                paginatedRiwayat.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#64748b', verticalAlign: 'top', paddingTop: '20px' }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    
                    <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{item.nomorSurat}</strong>
                    </td>

                    {/* SURAT PENGAJUAN (SUDAH DIPERBAIKI MENGGUNAKAN BUTTON) */}
                    <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                      <Button variant="outline" size="sm" icon="file-pdf" onClick={() => handleViewPengajuan(item)}>Buka</Button>
                    </td>

                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                               <i className="fas fa-map-marker-alt text-muted" style={{ marginRight: '6px' }}></i> {skema.tuk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ minHeight: '55px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <strong style={{ color: '#1e293b', fontSize: '0.9rem' }}>{skema.judul}</strong>
                            <small className="text-muted" style={{ marginTop: '4px' }}>
                              <i className="far fa-calendar-alt" style={{marginRight: '4px'}}></i> {skema.tanggal}
                            </small>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                            <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Kurikulum ${skema.judul}`)}>Buka</Button>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSurat({ nomorSurat: item.nomorSurat, skema: skema.judul, pesertaList: skema.peserta || [] })} style={{ minWidth: '60px' }}>
                              <strong>{skema.peserta?.length || 0}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                             <span className={`badge ${skema.badge}`}>{skema.status}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                      {item.suratBalasan ? (
                        <button 
                           onClick={() => handleViewBalasan(item)}
                           style={{ background: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', cursor: 'pointer', fontWeight: '600', padding: '6px 12px', borderRadius: '6px' }}
                        >
                          <i className="fas fa-envelope-open-text"></i>
                        </button>
                      ) : <span className="text-muted">-</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}> Tidak ada data. </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* MODAL SIMULASI KURIKULUM */}
      {viewPdf && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '800px', maxWidth: '90%', height: '80vh', backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0}}><i className="fas fa-file-pdf" style={{color: '#ef4444', marginRight: 8}}></i> {viewPdf}</h3>
               <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setViewPdf(null)}>&times;</button>
             </div>
             <div className="modal-body" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <p>Area Pratinjau Dokumen PDF Kurikulum</p>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default DashboardAdminBLK;