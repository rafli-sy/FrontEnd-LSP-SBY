import React from 'react';

const DashboardSuperAdmin = () => {
  return (
    <div className="dashboard-content">
      {/* Server Health Status */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <div className="dashboard-card" style={{ flex: 1, textAlign: 'center' }}>
          <h4 className="text-muted">Status Server</h4>
          <h2 style={{ color: '#28a745' }}><i className="fas fa-server"></i> Online</h2>
        </div>
        <div className="dashboard-card" style={{ flex: 1, textAlign: 'center' }}>
          <h4 className="text-muted">Total Pengguna Terdaftar</h4>
          <h2>185 <small>Akun</small></h2>
        </div>
        <div className="dashboard-card" style={{ flex: 1, textAlign: 'center' }}>
          <h4 className="text-muted">Penggunaan Database</h4>
          <h2 style={{ color: '#17a2b8' }}>12% <small>Kapasitas</small></h2>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Riwayat Aktivitas Sistem (Audit Trail)</h3>
        <p className="text-muted">Pemantauan log masuk pengguna, modifikasi data, dan perubahan hak akses secara real-time.</p>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table mt-20">
            <thead>
              <tr>
                <th>Waktu & Tanggal</th>
                <th>Pengguna (Role)</th>
                <th>Alamat IP</th>
                <th>Aktivitas Sistem</th>
                <th>Status Eksekusi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hari ini, 09:12 WIB</td>
                <td>Admin LSP (LSP Jatim)</td>
                <td>192.168.1.14</td>
                <td>Melakukan Plotting Asesor untuk Skema Barista</td>
                <td><span className="badge success">Berhasil</span></td>
              </tr>
              <tr>
                <td>Hari ini, 08:05 WIB</td>
                <td>Staff LSP (Kartika)</td>
                <td>192.168.1.22</td>
                <td>Meng-generate Nomor SPT.045/2026</td>
                <td><span className="badge success">Berhasil</span></td>
              </tr>
              <tr>
                <td>Kemarin, 14:30 WIB</td>
                <td>Admin BLK (Wonojati)</td>
                <td>10.0.0.55</td>
                <td>Mengirimkan Surat Usulan No: 400.3.5.3/238/2026</td>
                <td><span className="badge success">Berhasil</span></td>
              </tr>
              <tr>
                <td>Kemarin, 11:10 WIB</td>
                <td>Asesor (Egor Yulianto)</td>
                <td>114.125.10.1</td>
                <td>Gagal Login - Password Salah</td>
                <td><span className="badge danger">Gagal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardSuperAdmin;