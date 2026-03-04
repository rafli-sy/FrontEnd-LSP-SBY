import { useState } from 'react';

const DashboardAdminLSP = () => {
  // Ditambahkan data pendanaan dan jumlah asesi (kuota)
  const [pengajuanList, setPengajuanList] = useState([
    {
      id: 1,
      blk: 'UPT BLK Surabaya',
      skema: 'Pemasangan CCTV',
      pendanaan: 'APBD',
      kuota: 16,
      tanggalMulai: '2026-03-10',
      tanggalSelesai: '2026-03-12',
      status: 'Menunggu Verifikasi',
      dokumenUsulan: 'usulan_cctv_blk_sby.pdf'
    },
    {
      id: 2,
      blk: 'UPT BLK Singosari',
      skema: 'Operator Mesin Bubut',
      pendanaan: 'APBN',
      kuota: 16,
      tanggalMulai: '2026-03-15',
      tanggalSelesai: '2026-03-18',
      status: 'Disetujui',
      dokumenUsulan: 'usulan_bubut_sgs.pdf'
    }
  ]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Dashboard Admin LSP</h2>
        <p>Pusat kontrol persetujuan pengajuan UJK, manajemen jadwal, dan penerbitan dokumen ujian.</p>
      </div>

      {/* --- SECTION: PENGAJUAN MASUK (MENUNGGU VERIFIKASI) --- */}
      <div className="dashboard-card mt-20">
        <h3 style={{ marginBottom: '20px' }}>Pengajuan Menunggu Verifikasi</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Pengusul & Info</th>
                <th style={{ width: '20%' }}>Skema & Kuota</th>
                <th style={{ width: '25%' }}>Revisi Jadwal (Jika Perlu)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Dokumen</th>
                <th style={{ width: '25%', textAlign: 'center' }}>Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {pengajuanList.filter(p => p.status === 'Menunggu Verifikasi').map((item) => (
                <tr key={item.id}>
                  <td style={{ verticalAlign: 'middle' }}>
                    <strong style={{ color: '#0056b3' }}>{item.blk}</strong><br/>
                    <span className="badge info" style={{ marginTop: '5px', fontSize: '0.7rem' }}>Dana: {item.pendanaan}</span>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontWeight: '500' }}>
                    {item.skema}<br/>
                    <small style={{ color: '#6c757d' }}>Peserta: {item.kuota} Orang</small>
                  </td>
                  
                  {/* Perbaikan Tampilan Jadwal dengan Flexbox */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#6c757d', width: '40px' }}>Mulai</span>
                        <input type="date" defaultValue={item.tanggalMulai} className="form-input-small" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#6c757d', width: '40px' }}>Selesai</span>
                        <input type="date" defaultValue={item.tanggalSelesai} className="form-input-small" />
                      </div>
                    </div>
                  </td>
                  
                  {/* Perbaikan Tampilan Tombol Dokumen */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <button 
                      className="btn-action" 
                      style={{ backgroundColor: '#6c757d', padding: '6px 12px', fontSize: '0.8rem' }}
                      title="Unduh Dokumen Usulan"
                    >
                      <i className="fas fa-file-pdf"></i> Cek
                    </button>
                  </td>
                  
                  {/* Perbaikan Tampilan Aksi dengan Grid/Flexbox agar sejajar */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <input 
                        type="text" 
                        placeholder="Ketik No. Dokumen Ujian..." 
                        className="form-input-small" 
                        style={{ width: '100%' }}
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn-approve" 
                          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                          onClick={() => alert('Pengajuan Disetujui & Nomor Diterbitkan')}
                        >
                          <i className="fas fa-check"></i> Setuju
                        </button>
                        <button 
                          className="btn-reject" 
                          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                          onClick={() => alert('Pengajuan Ditolak')}
                        >
                          <i className="fas fa-times"></i> Tolak
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {pengajuanList.filter(p => p.status === 'Menunggu Verifikasi').length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '30px', color: '#6c757d' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '10px', color: '#dee2e6' }}></i>
                    <br />
                    Tidak ada pengajuan baru yang menunggu verifikasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECTION: RIWAYAT PENGAJUAN (BUKU INDUK / STATUS LOG) --- */}
      <div className="dashboard-card mt-20">
        <h3 style={{ marginBottom: '20px' }}>Riwayat Seluruh Pengajuan</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pengusul (Instansi)</th>
                <th>Skema UJK</th>
                <th>Status Terakhir</th>
                <th style={{ textAlign: 'center' }}>Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {pengajuanList.filter(p => p.status !== 'Menunggu Verifikasi').map((item) => (
                <tr key={item.id}>
                  <td style={{ verticalAlign: 'middle', fontWeight: '600' }}>{item.blk}</td>
                  <td style={{ verticalAlign: 'middle' }}>{item.skema}</td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    {item.status === 'Disetujui' ? (
                      <button 
                        className="btn-action" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => alert('Arahkan ke halaman Penugasan Asesor')}
                      >
                        <i className="fas fa-users-cog"></i> Alokasi Asesor & Penyelia
                      </button>
                    ) : (
                      <span style={{ color: '#adb5bd', fontSize: '0.9rem' }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardAdminLSP;