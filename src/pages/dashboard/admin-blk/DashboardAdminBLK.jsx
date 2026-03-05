import React from 'react';

const DashboardAdminBLK = () => {
  return (
    <div className="dashboard-content">
      {/* Widget Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <i className="fas fa-paper-plane fa-3x" style={{ color: '#007bff' }}></i>
          <div><h2 style={{ margin: 0, fontSize: '2rem' }}>5</h2><p style={{ margin: 0, color: '#666' }}>Total Usulan</p></div>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ffc107' }}></i>
          <div><h2 style={{ margin: 0, fontSize: '2rem' }}>1</h2><p style={{ margin: 0, color: '#666' }}>Sedang Diproses</p></div>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <i className="fas fa-check-circle fa-3x" style={{ color: '#28a745' }}></i>
          <div><h2 style={{ margin: 0, fontSize: '2rem' }}>4</h2><p style={{ margin: 0, color: '#666' }}>Disetujui LSP</p></div>
        </div>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3>Riwayat Usulan UJK (UPT BLK Wonojati)</h3>
            <p className="text-muted">Pantau status seluruh surat pengajuan yang telah Anda kirimkan.</p>
          </div>
          <button className="btn-add"><i className="fas fa-plus"></i> Buat Usulan Baru</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nomor Surat & Pendanaan</th>
                <th>Skema Ujian</th>
                <th>Jumlah Asesi</th>
                <th>Tanggal Pelaksanaan</th>
                <th>Status Terkini</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>400.3.5.3/238/2026</strong><br/><small className="text-muted">APBD 2026</small></td>
                <td>Barista</td>
                <td>16 Peserta</td>
                <td>21 - 22 Feb 2026</td>
                <td><span className="badge warning">Menunggu Plotting Asesor</span></td>
              </tr>
              <tr>
                <td><strong>400.3.5.3/102/2026</strong><br/><small className="text-muted">APBD 2026</small></td>
                <td>Pembuatan Roti Dan Kue</td>
                <td>16 Peserta</td>
                <td>18 - 19 Feb 2026</td>
                <td><span className="badge success">Selesai - Tahap Cetak Sertifikat</span></td>
              </tr>
              <tr>
                <td><strong>400.3.5.3/088/2026</strong><br/><small className="text-muted">APBD 2026</small></td>
                <td>Practical Office Advance</td>
                <td>16 Peserta</td>
                <td>31 Mar - 01 Apr 2026</td>
                <td><span className="badge primary">Disetujui LSP</span></td>
              </tr>
              <tr>
                <td><strong>400.3.5.3/045/2026</strong><br/><small className="text-muted">APBD 2026</small></td>
                <td>Welder SMAW 3G</td>
                <td>16 Peserta</td>
                <td>10 - 12 Jan 2026</td>
                <td><span className="badge success">Selesai Sepenuhnya</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardAdminBLK;