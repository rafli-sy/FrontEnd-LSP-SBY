import { useState } from 'react';

const DashboardAdminLSP = () => {
  const [pengajuanList, setPengajuanList] = useState([
    {
      id: 1,
      blk: 'UPT BLK Singosari',
      skema: 'Operator Mesin Bubut',
      pendanaan: 'APBN',
      kuota: 16,
      tanggalMulai: '2026-03-15',
      tanggalSelesai: '2026-03-18',
      status: 'Disetujui',
      dokumenUsulan: 'usulan_bubut_sgs.pdf'
    },
    {
      id: 2,
      blk: 'UPT BLK Wonojati',
      skema: 'Barista',
      pendanaan: 'APBD',
      kuota: 20,
      tanggalMulai: '2026-03-22',
      tanggalSelesai: '2026-03-24',
      status: 'Menunggu Verifikasi',
      dokumenUsulan: 'usulan_barista_wnj.pdf'
    },
    {
      id: 3,
      blk: 'UPT BLK Jombang',
      skema: 'Junior Administrative Assistant',
      pendanaan: 'Mandiri',
      kuota: 15,
      tanggalMulai: '2026-03-28',
      tanggalSelesai: '2026-03-30',
      status: 'Menunggu Verifikasi',
      dokumenUsulan: 'usulan_admin_jbg.pdf'
    },
    {
      id: 4,
      blk: 'UPT BLK Surabaya',
      skema: 'Junior Web Developer',
      pendanaan: 'APBD',
      kuota: 16,
      tanggalMulai: '2026-04-05',
      tanggalSelesai: '2026-04-07',
      status: 'Menunggu Verifikasi',
      dokumenUsulan: 'usulan_webdev_sby.pdf'
    },
    {
      id: 5,
      blk: 'UPT BLK Nganjuk',
      skema: 'Practical Office Advance',
      pendanaan: 'APBN',
      kuota: 16,
      tanggalMulai: '2026-03-31',
      tanggalSelesai: '2026-04-01',
      status: 'Disetujui',
      dokumenUsulan: 'usulan_poa_ngj.pdf'
    },
    {
      id: 6,
      blk: 'UPT BLK Bangkalan',
      skema: 'Pembuatan Roti dan Kue',
      pendanaan: 'APBD',
      kuota: 16,
      tanggalMulai: '2026-03-01',
      tanggalSelesai: '2026-03-03',
      status: 'Ditolak',
      dokumenUsulan: 'usulan_roti_bkl.pdf'
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
                {/* --- HEADER DITUKAR POSISINYA --- */}
                <th style={{ width: '25%', textAlign: 'center' }}>Aksi Verifikasi</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {pengajuanList.filter(p => p.status === 'Menunggu Verifikasi').map((item) => (
                <tr key={item.id}>
                  <td style={{ verticalAlign: 'middle' }}>
                    <strong style={{ color: '#0056b3' }}>{item.blk}</strong><br/>
                    <span className="badge-dana" style={{ marginTop: '5px' }}>Dana: {item.pendanaan}</span>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontWeight: '500' }}>
                    {item.skema}<br/>
                    <small style={{ color: '#6c757d' }}>Peserta: {item.kuota} Orang</small>
                  </td>
                  
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
                  
                  {/* --- ISI KOLOM AKSI VERIFIKASI (SEKARANG DI KIRI) --- */}
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

                  {/* --- ISI KOLOM DOKUMEN (SEKARANG DI KANAN) --- */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <button 
                      className="btn-action" 
                      style={{ backgroundColor: '#E11C2A', padding: '6px 12px', fontSize: '0.8rem' }}
                      title="Unduh Dokumen Usulan"
                    >
                      <i className="fas fa-file-pdf"></i> Cek
                    </button>
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