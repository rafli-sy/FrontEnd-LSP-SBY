import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Button from '../../components/ui/Button'; 

const DashboardAdminBLK = () => {
  const navigate = useNavigate();
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [previewBalasan, setPreviewBalasan] = useState(null);
  
  // STATE PENCARIAN
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // DATA MOCKUP
  const riwayatPengajuan = [
    { 
      id: 3, 
      nomorSurat: '003/BLK-SBY/UJK/V/2026', 
      pendanaan: 'APBN',
      status: 'Sedang Diproses', 
      badge: 'warning', 
      suratBalasan: null,
      listSkema: [
        { skema: 'Instalasi Jaringan Komputer', kejuruan: 'TIK', tglMulai: '2026-05-10', jumlahAsesi: 16 },
        { skema: 'Desain Grafis Madya', kejuruan: 'TIK', tglMulai: '2026-05-01', jumlahAsesi: 20 }
      ]
    },
    { 
      id: 2, 
      nomorSurat: '002/BLK-SBY/UJK/IV/2026', 
      pendanaan: 'APBD',
      status: 'Ditolak oleh LSP', 
      badge: 'danger', 
      suratBalasan: null,
      listSkema: [
        { skema: 'Servis Sepeda Motor Injeksi', kejuruan: 'Otomotif', tglMulai: '2026-04-15', jumlahAsesi: 15 }
      ]
    },
    { 
      id: 1, 
      nomorSurat: '001/BLK-SBY/UJK/II/2026', 
      pendanaan: 'APBN',
      status: 'Disetujui LSP', 
      badge: 'success', 
      suratBalasan: 'Tersedia',
      listSkema: [
        { skema: 'Barista', kejuruan: 'Pariwisata', tglMulai: '2026-02-21', jumlahAsesi: 16 },
        { skema: 'Pembuatan Roti Dan Kue', kejuruan: 'Pariwisata', tglMulai: '2026-02-18', jumlahAsesi: 20 },
        { skema: 'Welder SMAW 3G', kejuruan: 'Manufaktur', tglMulai: '2026-01-10', jumlahAsesi: 15 }
      ],
      peserta: [
         { id: 1, nama: 'Mohammad Tohir', nik: '3578902006900001', jk: 'L', skema: 'Barista' }
      ] 
    }
  ];

  // FILTER PENCARIAN BERDASARKAN NOMOR SURAT
  const filteredRiwayat = riwayatPengajuan.filter(item => 
    item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsulan = riwayatPengajuan.length; 
  const countDiproses = riwayatPengajuan.filter(item => item.status === 'Sedang Diproses').length;
  const countDisetujui = riwayatPengajuan.filter(item => item.status === 'Disetujui LSP').length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRiwayat.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-content fade-in-content">
      
      {/* INJEKSI CSS LANGSUNG KE DALAM KOMPONEN */}
      <style>
        {`
          .search-bar-container {
            display: flex;
            align-items: center;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 4px 16px;
            width: 100%;
            max-width: 320px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .search-bar-container:focus-within {
            background-color: #ffffff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
          }
          .search-bar-container i {
            color: #94a3b8;
            font-size: 1rem;
            transition: color 0.3s;
          }
          .search-bar-container:focus-within i {
            color: #3b82f6;
          }
          .search-bar-container input {
            border: none;
            background: transparent;
            padding: 8px 12px;
            width: 100%;
            outline: none;
            color: #1e293b;
            font-size: 0.95rem;
          }
          .search-bar-container input::placeholder {
            color: #94a3b8;
            font-size: 0.9rem;
          }
          @media (max-width: 768px) {
            .search-bar-container {
              max-width: 100%;
              margin-top: 10px;
            }
          }
        `}
      </style>

      {/* === LAYAR 1: PENINJAU PDF === */}
      {previewBalasan ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => setPreviewBalasan(null)}>Kembali</Button>
                <div>
                  <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Surat Balasan LSP</h2>
                  <p className="text-muted" style={{ margin: 0 }}>No. Surat Pengajuan: <strong>{previewBalasan.nomorSurat}</strong></p>
                </div>
            </div>
            <Button variant="primary" icon="download" onClick={() => alert('Mengunduh PDF Surat Balasan...')}>Unduh PDF</Button>
          </div>
          <div className="dashboard-card" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
             <div style={{ textAlign: 'center', color: '#94a3b8' }}>
               <i className="fas fa-file-pdf" style={{ fontSize: '4rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
               <h3>Pratinjau Dokumen PDF...</h3>
               <p>Area ini menampilkan file balasan resmi dari LSP.</p>
             </div>
          </div>
        </div>

      ) : selectedPeserta ? (
        /* === LAYAR 2: DETAIL PESERTA === */
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali</Button>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Master Peserta Ujian</h2>
              <p className="text-muted" style={{ margin: 0 }}>Berdasarkan Surat No: <strong>{selectedPeserta.nomorSurat}</strong></p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}>
            <TablePeserta dataPeserta={selectedPeserta.peserta} skemaName="Gabungan Berdasarkan Surat" />
          </div>
        </div>

      ) : (
        /* === LAYAR 3: DASHBOARD UTAMA === */
        <div className="fade-in-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}><i className="fas fa-envelope-open-text"></i></div>
              <div className="stat-info"><h3>{totalUsulan}</h3><p>Surat Usulan Terkirim</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><i className="fas fa-spinner fa-spin"></i></div>
              <div className="stat-info"><h3>{countDiproses}</h3><p>Surat Sedang Diproses</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="fas fa-check-circle"></i></div>
              <div className="stat-info"><h3>{countDisetujui}</h3><p>Surat Disetujui LSP</p></div>
            </div>
          </div>

          <div className="dashboard-card" style={{ marginTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#0f172a' }}>Data Terkirim & Riwayat Pengajuan</h3>
                <p className="text-muted" style={{ margin: 0 }}>Semua pengajuan yang telah dikirim ke LSP akan diproses di sini.</p>
              </div>
              
              {/* FITUR PENCARIAN */}
              <div className="search-bar-container">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Cari Nomor Surat..." 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); 
                  }} 
                />
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '25%' }}>Nomor Surat & Dana</th>
                    <th style={{ width: '35%' }}>Daftar Skema Terlampir</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Total Peserta</th>
                    <th style={{ width: '20%' }}>Status & Dokumen</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>Data tidak ditemukan.</td></tr>
                  ) : (
                    currentItems.map((item, index) => {
                      const totalAsesi = item.listSkema.reduce((acc, curr) => acc + curr.jumlahAsesi, 0);

                      return (
                      <tr key={item.id}>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <strong style={{ color: '#0f172a' }}>{item.nomorSurat}</strong><br/>
                          <span className="badge info" style={{marginTop: '5px'}}>{item.pendanaan}</span>
                        </td>
                        <td>
                          <ul style={{ margin: 0, paddingLeft: '15px', color: '#334155', fontSize: '0.9rem' }}>
                            {item.listSkema.map((sk, idx) => (
                              <li key={idx}><strong>{sk.skema}</strong> (Mulai: {sk.tglMulai})</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Button variant="outline" size="sm" onClick={() => setSelectedPeserta(item)}>
                            <strong>{totalAsesi}</strong> Orang <i className="fas fa-users" style={{ marginLeft: '5px' }}></i>
                          </Button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                            <span className={`badge ${item.badge}`}>{item.status}</span>
                            {item.status === 'Disetujui LSP' && item.suratBalasan === 'Tersedia' && (
                              <button 
                                onClick={() => setPreviewBalasan(item)} 
                                style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', padding: 0, marginTop: '4px' }}
                              >
                                <i className="fas fa-envelope-open-text"></i> Lihat Balasan
                              </button>
                            )}
                            {item.status === 'Ditolak oleh LSP' && (
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}><i className="fas fa-info-circle"></i> Hubungi pihak LSP</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '20px', gap: '8px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem', marginRight: '5px' }}>Halaman:</span>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button key={page} variant={currentPage === page ? 'primary' : 'outline'} size="sm" onClick={() => handlePageChange(page)} style={{ minWidth: '35px', padding: '6px 10px', fontSize: '0.9rem' }}>
                    {page}
                  </Button>
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