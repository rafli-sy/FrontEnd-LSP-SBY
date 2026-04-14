import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Button from '../../components/ui/Button'; 

const DashboardAdminBLK = () => {
  const navigate = useNavigate();
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [previewBalasan, setPreviewBalasan] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const riwayatPengajuan = [
    { id: 8, skema: 'Instalasi Jaringan Komputer', kejuruan: 'TIK', tglMulai: '2026-05-10', tglSelesai: '2026-05-12', status: 'Sedang Diproses', badge: 'warning', suratBalasan: null, peserta: [] },
    { id: 7, skema: 'Desain Grafis Madya', kejuruan: 'TIK', tglMulai: '2026-05-01', tglSelesai: '2026-05-03', status: 'Disetujui LSP', badge: 'success', suratBalasan: 'Tersedia', peserta: [] },
    { id: 6, skema: 'Teknisi Akuntansi Junior', kejuruan: 'Bisnis Manajemen', tglMulai: '2026-04-20', tglSelesai: '2026-04-22', status: 'Sedang Diproses', badge: 'warning', suratBalasan: null, peserta: [] },
    { id: 5, skema: 'Servis Sepeda Motor Injeksi', kejuruan: 'Otomotif', tglMulai: '2026-04-15', tglSelesai: '2026-04-17', status: 'Ditolak oleh LSP', badge: 'danger', suratBalasan: null, peserta: [] },
    { 
      id: 4, skema: 'Barista', kejuruan: 'Pariwisata', tglMulai: '2026-02-21', tglSelesai: '2026-02-22', 
      status: 'Sedang Diproses', badge: 'warning', suratBalasan: null, 
      peserta: [
        { id: 1, nama: 'Mohammad Tohir', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '20 Juni 1990', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'tohirm@gmail.com', pendidikan: 'S1' }
      ]
    },
    { id: 3, skema: 'Pembuatan Roti Dan Kue', kejuruan: 'Pariwisata', tglMulai: '2026-02-18', tglSelesai: '2026-02-19', status: 'Disetujui LSP', badge: 'success', suratBalasan: 'Tersedia', peserta: [] },
    { id: 2, skema: 'Practical Office Advance', kejuruan: 'TIK', tglMulai: '2026-01-31', tglSelesai: '2026-02-01', status: 'Ditolak oleh LSP', badge: 'danger', suratBalasan: null, peserta: [] },
    { id: 1, skema: 'Welder SMAW 3G', kejuruan: 'Manufaktur', tglMulai: '2026-01-10', tglSelesai: '2026-01-12', status: 'Disetujui LSP', badge: 'success', suratBalasan: 'Tersedia', peserta: [] }
  ];

  const totalUsulan = riwayatPengajuan.length;
  const countDiproses = riwayatPengajuan.filter(item => item.status === 'Sedang Diproses').length;
  const countDisetujui = riwayatPengajuan.filter(item => item.status === 'Disetujui LSP').length;

  // --- PERBAIKAN: MENGURUTKAN TANGGAL BERDASARKAN YANG TERBARU ---
  const sortedRiwayat = [...riwayatPengajuan].sort((a, b) => new Date(b.tglMulai) - new Date(a.tglMulai));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRiwayat.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedRiwayat.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-content fade-in-content">
      {previewBalasan ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => setPreviewBalasan(null)}>Kembali</Button>
                <div>
                  <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Surat Balasan LSP</h2>
                  <p className="text-muted" style={{ margin: 0 }}>Dokumen Persetujuan: <strong>{previewBalasan.skema}</strong></p>
                </div>
            </div>
            <Button variant="primary" icon="download" onClick={() => alert('Mengunduh PDF Surat Balasan...')}>Unduh PDF</Button>
          </div>

          <div className="dashboard-card" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
             <div style={{ textAlign: 'center', color: '#94a3b8' }}>
               <i className="fas fa-file-pdf" style={{ fontSize: '4rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
               <h3>Pratinjau Dokumen PDF...</h3>
               <p>Area ini akan menampilkan file surat balasan resmi dari LSP untuk pengajuan <strong>{previewBalasan.skema}</strong>.</p>
             </div>
          </div>
        </div>
      ) : selectedPeserta ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali</Button>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Peserta Ujian</h2>
              <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}><TablePeserta dataPeserta={selectedPeserta.peserta} skemaName={selectedPeserta.skema} /></div>
        </div>
      ) : (
        <div className="fade-in-content">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}><i className="fas fa-paper-plane"></i></div><div className="stat-info"><h3>{totalUsulan}</h3><p>Total Usulan UJK</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><i className="fas fa-spinner fa-spin"></i></div><div className="stat-info"><h3>{countDiproses}</h3><p>Sedang Diproses LSP</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="fas fa-check-circle"></i></div><div className="stat-info"><h3>{countDisetujui}</h3><p>Usulan Disetujui</p></div></div>
          </div>

          <div className="dashboard-card" style={{ marginTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <div><h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#0f172a' }}>Riwayat Pengajuan Ujian</h3><p className="text-muted" style={{ margin: 0 }}>Daftar status permohonan dan dokumen balasan dari LSP (Terbaru di atas).</p></div>
              <Button variant="primary" icon="plus" onClick={() => navigate('/admin-blk/pengajuan')}>Buat Usulan Baru</Button>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '30%' }}>Kejuruan / Skema</th>
                    <th style={{ width: '20%' }}>Tanggal Ujian</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Peserta</th>
                    <th style={{ width: '30%' }}>Status & Dokumen</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>{indexOfFirstItem + index + 1}</td>
                      <td><strong style={{ color: '#0f172a' }}>{item.skema}</strong><br/><span className="text-muted" style={{ fontSize: '0.85rem' }}>{item.kejuruan}</span></td>
                      <td><span style={{ fontWeight: '600', color: '#334155' }}>{item.tglMulai}</span> <br/><span className="text-muted" style={{ fontSize: '0.85rem' }}>s/d {item.tglSelesai}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPeserta(item)}><strong>{item.peserta?.length || 0}</strong> Orang <i className="fas fa-users" style={{ marginLeft: '5px' }}></i></Button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                          <span className={`badge ${item.badge}`}>{item.status}</span>
                          {item.status === 'Disetujui LSP' && item.suratBalasan === 'Tersedia' && (
                            // PERBAIKAN: Menambahkan pengiriman Object utuh ke state Preview
                            <button onClick={() => setPreviewBalasan(item)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', padding: 0, marginTop: '4px' }}>
                              <i className="fas fa-envelope-open-text"></i> Lihat Surat Balasan
                            </button>
                          )}
                          {item.status === 'Ditolak oleh LSP' && <span className="text-muted" style={{ fontSize: '0.8rem' }}><i className="fas fa-info-circle"></i> Silakan ajukan ulang</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '20px', gap: '8px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem', marginRight: '5px' }}>Halaman:</span>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button key={page} variant={currentPage === page ? 'primary' : 'outline'} size="sm" onClick={() => handlePageChange(page)} style={{ minWidth: '35px', padding: '6px 10px', fontSize: '0.9rem' }}>{page}</Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdminBLK;