import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import TablePeserta from '../TablePeserta/TablePeserta'; 

// --- IMPORT SISTEM PDF BARU ---
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import SuratBalasanPDF from '../surat/pdf/SuratBalasanPDF';

const DashboardAdminBLK = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewPdf, setViewPdf] = useState(null); // State untuk view PDF Kurikulum

  // DUMMY DATA: Diperbarui agar Status melekat pada tiap-tiap skema
  const riwayatPengajuan = [
    { 
      id: 1, 
      nomorSurat: '088/BLK-SBY/IV/2026', 
      tanggal: '20 April 2026', 
      tuk: 'TUK Sewaktu BLK Surabaya',
      suratBalasan: null,
      skemaList: [
        { 
          judul: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', jenis: 'Klaster',
          status: 'Sedang Diproses', badge: 'warning',
          peserta: [{ id: 1, nama: 'Siti Aminah', nik: '3578001122334455', jk: 'P', tempatLahir: 'Surabaya', tanggalLahir: '12 Mei 1995', alamat: 'Jl. Kenangan No 1', rt: '01', rw: '02', kelurahan: 'Ketintang', kecamatan: 'Gayungan', hp: '08123456789', email: 'siti@mail.com', pendidikan: 'SMA' }]
        },
        { 
          judul: 'Barista', bidang: 'Pariwisata', jenis: 'Klaster',
          status: 'Sedang Diproses', badge: 'warning',
          peserta: [{ id: 2, nama: 'Budi Santoso', nik: '3578009988776655', jk: 'L', tempatLahir: 'Gresik', tanggalLahir: '08 Agustus 1996', alamat: 'Jl. Veteran 45', rt: '03', rw: '04', kelurahan: 'Sidomoro', kecamatan: 'Kebomas', hp: '08987654321', email: 'budi@mail.com', pendidikan: 'SMK' }]
        }
      ]
    },
    { 
      id: 2, 
      nomorSurat: '045/BLK-SBY/III/2026', 
      tanggal: '15 Maret 2026', 
      tuk: 'TUK Mandiri PT. Sejahtera',
      suratBalasan: 'Tersedia',
      skemaList: [
        { 
          judul: 'Desain Grafis Madya', bidang: 'TIK', jenis: 'Klaster',
          status: 'Disetujui LSP', badge: 'success',
          peserta: [{ id: 3, nama: 'Andi Wijaya', nik: '3578002233445566', jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '21 Juli 1998', alamat: 'Perumahan Tropodo', rt: '05', rw: '01', kelurahan: 'Tropodo', kecamatan: 'Waru', hp: '082233445566', email: 'andi@mail.com', pendidikan: 'D3' }]
        }
      ]
    },
    { 
      id: 3, 
      nomorSurat: '012/BLK-SBY/I/2026', 
      tanggal: '10 Januari 2026', 
      tuk: 'TUK Sewaktu BLK Surabaya',
      suratBalasan: null,
      skemaList: [
        { 
          judul: 'Welder SMAW 3G', bidang: 'Manufaktur', jenis: 'KKNI',
          status: 'Ditolak oleh LSP', badge: 'danger',
          peserta: [{ id: 4, nama: 'Rina Melati', nik: '3578005544332211', jk: 'P', tempatLahir: 'Malang', tanggalLahir: '15 Januari 1997', alamat: 'Jl. Kawi 22', rt: '02', rw: '05', kelurahan: 'Kauman', kecamatan: 'Klojen', hp: '085544332211', email: 'rina@mail.com', pendidikan: 'S1' }]
        },
        { 
          judul: 'Servis Sepeda Motor Injeksi', bidang: 'Otomotif', jenis: 'Okupasi',
          status: 'Disetujui LSP', badge: 'success',
          peserta: [{ id: 5, nama: 'Tono Hermawan', nik: '3578006655443322', jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '10 Februari 1999', alamat: 'Jl. Pahlawan', rt: '01', rw: '03', kelurahan: 'Waru', kecamatan: 'Waru', hp: '089988776655', email: 'tono@mail.com', pendidikan: 'SMA' }]
        }
      ]
    }
  ];

  // Filter jika ada skema yang sesuai dengan filter
  const filteredRiwayat = riwayatPengajuan.filter(item => {
    const matchSearch = item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || item.skemaList.some(s => s.status === filterStatus);
    return matchSearch && matchStatus;
  });

  const totalUsulan = riwayatPengajuan.length;
  // Hitung jumlah skema yang diproses & disetujui
  const countDiproses = riwayatPengajuan.flatMap(r => r.skemaList).filter(s => s.status === 'Sedang Diproses').length;
  const countDisetujui = riwayatPengajuan.flatMap(r => r.skemaList).filter(s => s.status === 'Disetujui LSP').length;

  const handleViewBalasan = (item) => {
    const dummyBalasanData = {
      ujk: {
        nomorSurat: item.nomorSurat,
        tanggal: item.tanggal,
        tuk: item.tuk,
        asesi: item.skemaList.reduce((acc, curr) => acc + (curr.peserta?.length || 0), 0),
        skema: item.skemaList.map(s => s.judul).join(', '),
        bidang: 'Aneka Kejuruan',
        hari1: 'Senin, 16 Maret 2026',
        hari2: 'Selasa, 17 Maret 2026',
        asesor1: 'Risna Amalia',
        asesor2: '',
        penyelia: 'Miftahul Huda'
      },
      form: {
        noSurat: '000.140A/LSP BLK-SBY/III/2026',
        tanggalSurat: '12 Maret 2026',
        kepadaTujuan: 'UPT BLK Surabaya'
      }
    };
    setPreviewDokumen(dummyBalasanData);
  };

  // VIEWER SURAT BALASAN
  if (previewDokumen) {
    return (
      <div className="dashboard-content fade-in-content">
        <div className="print-preview-container" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
          <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>Surat Balasan LSP</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Dokumen persetujuan dari Lembaga Sertifikasi Profesi.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
              <PDFDownloadLink document={<SuratBalasanPDF data={previewDokumen} />} fileName="Surat_Balasan.pdf" style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                {({ loading }) => (loading ? 'Menyiapkan PDF...' : 'Unduh PDF')}
              </PDFDownloadLink>
            </div>
          </div>
          <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <PDFViewer width="100%" height="100%" showToolbar={true}>
              <SuratBalasanPDF data={previewDokumen} />
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
          <Button variant="outline" icon="arrow-left" onClick={() => setSelectedSurat(null)} style={{ background: '#fff' }}>
            Kembali
          </Button>
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

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input 
              type="text" 
              placeholder="Cari berdasarkan Nomor Surat..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Filter Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer' }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Sedang Diproses">Sedang Diproses</option>
              <option value="Disetujui LSP">Disetujui LSP</option>
              <option value="Ditolak oleh LSP">Ditolak oleh LSP</option>
            </select>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th style={{ width: '15%' }}>Nomor Surat & Tgl</th>
                <th style={{ width: '15%' }}>TUK</th>
                <th style={{ width: '20%' }}>Daftar Skema</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Kurikulum (PDF)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Peserta</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Surat Balasan</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiwayat.length > 0 ? (
                filteredRiwayat.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#64748b', verticalAlign: 'top', paddingTop: '20px' }}>{index + 1}</td>
                    
                    <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem', display: 'block' }}>{item.nomorSurat}</strong>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}><i className="far fa-calendar-alt"></i> {item.tanggal}</span>
                    </td>

                    <td style={{ color: '#475569', fontSize: '0.9rem', verticalAlign: 'top', paddingTop: '20px' }}>
                       <i className="fas fa-map-marker-alt text-muted" style={{ marginRight: '4px' }}></i> {item.tuk}
                    </td>
                    
                    {/* DAFTAR SKEMA */}
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <strong style={{ color: '#1e293b', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{skema.judul}</strong>
                            <small className="text-muted" style={{ margin: 0 }}>{skema.bidang} <span style={{margin: '0 4px'}}>|</span> {skema.jenis}</small>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* KURIKULUM (PDF) */}
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                            <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Kurikulum ${skema.judul}`)}>
                              Buka Dokumen
                            </Button>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* PESERTA */}
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSurat({ nomorSurat: item.nomorSurat, skema: skema.judul, pesertaList: skema.peserta || [] })} style={{ minWidth: '70px', justifyContent: 'center' }}>
                              <strong>{skema.peserta?.length || 0}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* STATUS SKEMA (Per Skema) */}
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {item.skemaList.map((skema, i) => (
                          <div key={i} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                             <span className={`badge ${skema.badge}`}>{skema.status}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* SURAT BALASAN (Satu Tombol per Surat) */}
                    <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {item.suratBalasan ? (
                          <button 
                             onClick={() => handleViewBalasan(item)}
                             style={{ background: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', transition: '0.2s' }}
                          >
                            <i className="fas fa-envelope-open-text"></i> Lihat Surat Balasan
                          </button>
                        ) : item.skemaList.every(s => s.status === 'Ditolak oleh LSP') ? (
                          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold' }}>
                            <i className="fas fa-times-circle"></i> Berkas Ditolak
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>
                            <i className="fas fa-hourglass-half"></i> Menunggu LSP
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-search" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', color: '#cbd5e1' }}></i>
                    Tidak ada pengajuan yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VIEWER PDF KURIKULUM (SIMULASI) */}
      {viewPdf && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '800px', maxWidth: '90%', height: '80vh', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', display: 'flex', flexDirection: 'column' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0, color: '#0f172a'}}><i className="fas fa-file-pdf" style={{color: '#ef4444', marginRight: 8}}></i> Pratinjau: {viewPdf}</h3>
               <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }} onClick={() => setViewPdf(null)}>&times;</button>
             </div>
             <div className="modal-body" style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fas fa-file-pdf" style={{ fontSize: '5rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#334155' }}>Simulasi Penampil Dokumen</p>
                  <p style={{ fontSize: '0.95rem' }}>Dokumen <strong>{viewPdf}</strong> yang diunggah akan tampil di area ini.</p>
               </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default DashboardAdminBLK;