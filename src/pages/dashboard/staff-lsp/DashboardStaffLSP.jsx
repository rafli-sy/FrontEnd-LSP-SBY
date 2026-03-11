import React, { useState } from 'react';

const DashboardStaffLSP = () => {
  // State untuk mengontrol Modal Upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Data simulasi tugas Staff LSP
  const [tugas, setTugas] = useState([
    { 
      id: 1, 
      blk: 'UPT BLK Sumenep', 
      suratAsal: '400.3.5.3/102/108.7.20/2026',
      skema: 'Pembuatan Roti Dan Kue', 
      kejuruan: 'Pariwisata',
      tglUjian: '18 - 19 Februari 2026',
      asesor: 'Chef Juna R.',
      statusSurat: 'Menunggu', // 'Menunggu', 'Terkirim'
    },
    { 
      id: 2, 
      blk: 'UPT BLK Wonojati', 
      suratAsal: '400.3.5.3/045/108.7.16/2026',
      skema: 'Welder SMAW 3G', 
      kejuruan: 'Las',
      tglUjian: '10 - 12 Januari 2026', 
      asesor: 'Budi Santoso, S.T.',
      statusSurat: 'Terkirim', 
    },
     { 
      id: 3, 
      blk: 'UPT BLK Nganjuk', 
      suratAsal: '400.3.5.3/088/108.7.18/2026',
      skema: 'Practical Office Advance', 
      kejuruan: 'TIK',
      tglUjian: '31 Mar - 01 Apr 2026', 
      asesor: 'Egor Yulianto, M.Kom.',
      statusSurat: 'Menunggu', 
    }
  ]);

  // Fungsi membuka pop-up upload
  const handleOpenUpload = (item) => {
    setSelectedTask(item);
    setIsUploadModalOpen(true);
  };

  // Fungsi submit form upload surat
  const handleKirimSurat = (e) => {
    e.preventDefault();
    // Ubah status tugas menjadi Terkirim
    setTugas(tugas.map(item => 
      item.id === selectedTask.id ? { ...item, statusSurat: 'Terkirim' } : item
    ));
    setIsUploadModalOpen(false);
    setSelectedTask(null);
    alert('Surat Balasan berhasil diunggah dan dikirim ke Admin BLK terkait!');
  };

  return (
    <div className="dashboard-content fade-in-content">
      
      {/* Kartu Ringkasan Statistik */}
      <div className="stat-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
          <div className="stat-icon warning" style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '18px', borderRadius: '12px', fontSize: '1.8rem' }}>
            <i className="fas fa-file-upload"></i>
          </div>
          <div className="stat-info">
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Menunggu Upload Surat</p>
            <h2 style={{ margin: '5px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1f2937' }}>2 <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 'normal' }}>Antrean</span></h2>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
          <div className="stat-icon success" style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '18px', borderRadius: '12px', fontSize: '1.8rem' }}>
            <i className="fas fa-paper-plane"></i>
          </div>
          <div className="stat-info">
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Surat Terkirim (Bulan Ini)</p>
            <h2 style={{ margin: '5px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1f2937' }}>1 <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 'normal' }}>Surat</span></h2>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
          <div className="stat-icon primary" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '18px', borderRadius: '12px', fontSize: '1.8rem' }}>
            <i className="fas fa-print"></i>
          </div>
          <div className="stat-info">
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Antrean Cetak Sertifikat</p>
            <h2 style={{ margin: '5px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1f2937' }}>0 <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 'normal' }}>Dokumen</span></h2>
          </div>
        </div>
      </div>

      {/* Tabel Tugas Upload Surat */}
      <div className="dashboard-card" style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
        <div style={{ marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1f2937' }}>Tugas Pengiriman Surat Balasan</h3>
            <p className="text-muted" style={{ margin: '5px 0 0', fontSize: '0.95rem' }}>Daftar UJK yang sudah disetujui. Silakan buat surat secara manual dan unggah PDF-nya di sini.</p>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table" style={{ borderCollapse: 'separate', borderSpacing: '0', width: '100%' }}>
            <thead style={{ borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ width: '50px', textAlign: 'center', padding: '15px', color: '#4b5563', fontWeight: 600 }}>No.</th>
                <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Asal Instansi & Nomor Pengajuan</th>
                <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Skema Ujian & Jadwal</th>
                <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Status Dokumen</th>
                <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {tugas.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={{ textAlign: 'center', color: '#6b7280', padding: '18px 15px' }}>{index + 1}</td>
                  
                  <td style={{ padding: '18px 15px' }}>
                    <strong style={{ color: '#1f2937' }}>{item.blk}</strong><br/>
                    <small className="text-muted" style={{ fontSize: '0.85rem' }}>Ref: {item.suratAsal}</small>
                  </td>
                  
                  <td style={{ padding: '18px 15px' }}>
                    <strong>{item.skema}</strong><br/>
                    <small className="text-muted" style={{ fontSize: '0.85rem' }}>{item.tglUjian}</small>
                  </td>
                  
                  <td style={{ padding: '18px 15px' }}>
                    <span className={`badge ${item.statusSurat === 'Terkirim' ? 'success' : 'warning'}`} style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, padding: '5px 10px', borderRadius: '15px' }}>
                      {item.statusSurat === 'Terkirim' ? 'Telah Dikirim' : 'Belum Ada Surat'}
                    </span>
                  </td>
                  
                  <td style={{ padding: '18px 15px' }}>
                    {item.statusSurat === 'Menunggu' ? (
                      <button 
                        onClick={() => handleOpenUpload(item)} 
                        className="btn-add btn-sm"
                        style={{ padding: '10px 18px', backgroundColor: '#0ea5e9', border: 'none', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                      >
                        <i className="fas fa-upload"></i> Upload & Kirim Surat
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-outline btn-sm" style={{ padding: '10px 18px', borderColor: '#d1d5db', color: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, backgroundColor: 'transparent' }} title="Unduh Arsip Surat yang sudah dikirim">
                          <i className="fas fa-file-pdf"></i> Lihat PDF Terkirim
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL UPLOAD SURAT (POP-UP)
          ========================================================= */}
      {isUploadModalOpen && selectedTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="dashboard-card fade-in-content" style={{ width: '100%', maxWidth: '600px', margin: 0, padding: '30px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Upload Surat Balasan & Tugas</h3>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#9ca3af' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: '25px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#64748b' }}>Tujuan Instansi:</p>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedTask.blk}</p>
              
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#64748b' }}>Skema Ujian:</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedTask.skema}</p>
            </div>

            <form onSubmit={handleKirimSurat}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>File Surat Balasan (Format PDF)</label>
                <input 
                  type="file" 
                  className="form-input" 
                  accept=".pdf" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f1f5f9' }}
                />
                <small className="text-muted" style={{ display: 'block', marginTop: '8px' }}>
                  Pastikan surat sudah ditandatangani oleh Ketua LSP sebelum diunggah.
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="btn-outline" style={{ padding: '10px 20px' }}>Batal</button>
                <button type="submit" className="btn-add" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-paper-plane"></i> Upload & Kirim ke BLK
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardStaffLSP;
