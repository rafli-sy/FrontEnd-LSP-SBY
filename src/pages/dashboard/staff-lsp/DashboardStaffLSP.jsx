import React from 'react';

const DashboardStaffLSP = () => {
  return (
    <div className="dashboard-content">
      {/* Widget Administrasi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="dashboard-card text-center" style={{ padding: '20px' }}>
          <i className="fas fa-envelope-open-text fa-2x" style={{ color: '#007bff', marginBottom: '10px' }}></i>
          <h3>12</h3><p className="text-muted">Surat Balasan Terbit</p>
        </div>
        <div className="dashboard-card text-center" style={{ padding: '20px' }}>
          <i className="fas fa-clipboard-list fa-2x" style={{ color: '#28a745', marginBottom: '10px' }}></i>
          <h3>12</h3><p className="text-muted">SPT Petugas Terbit</p>
        </div>
        <div className="dashboard-card text-center" style={{ padding: '20px' }}>
          <i className="fas fa-certificate fa-2x" style={{ color: '#ffc107', marginBottom: '10px' }}></i>
          <h3>160</h3><p className="text-muted">Antrean Cetak Sertifikat</p>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Tugas Administrasi Berjalan</h3>
        <p className="text-muted">Daftar UJK yang sudah disetujui Admin LSP dan siap untuk di-generate dokumennya.</p>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table mt-20">
            <thead>
              <tr>
                <th>TUK / Instansi</th>
                <th>Skema Ujian</th>
                <th>Status Surat Balasan</th>
                <th>Status SPT Petugas</th>
                <th>Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>UPT BLK Surabaya</strong><br/><small>APBD 2026</small></td>
                <td>Pembuatan Roti Dan Kue</td>
                <td><span className="badge success">Selesai (No. 012/LSP/2026)</span></td>
                <td><span className="badge success">Selesai (No. SPT.045/2026)</span></td>
                <td><button className="btn-outline"><i className="fas fa-print"></i> Cetak Ulang</button></td>
              </tr>
              <tr>
                <td><strong>UPT BLK Sumenep</strong><br/><small>APBD 2026</small></td>
                <td>Barista</td>
                <td><span className="badge warning">Draft Otomatis Siap</span></td>
                <td><span className="badge warning">Menunggu Review</span></td>
                <td><button className="btn-add"><i className="fas fa-cogs"></i> Generate Berkas</button></td>
              </tr>
              <tr>
                <td><strong>UPT BLK Nganjuk</strong><br/><small>APBD 2026</small></td>
                <td>Practical Office Advance</td>
                <td><span className="badge warning">Draft Otomatis Siap</span></td>
                <td><span className="badge warning">Menunggu Review</span></td>
                <td><button className="btn-add"><i className="fas fa-cogs"></i> Generate Berkas</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardStaffLSP;