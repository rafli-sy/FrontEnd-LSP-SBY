import React from 'react';
import { Link } from 'react-router-dom';

const DashboardSuperAdmin = () => {
  return (
    <div className="dashboard-content">
      {/* Server Health Status */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon success">
            <i className="fas fa-server"></i>
          </div>
          <div className="stat-info">
            <p>Status Server</p>
            <h2 style={{ color: '#155724' }}>Online</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <p>Total Pengguna</p>
            <h2>185 <span style={{ fontSize: '1rem', color: '#6c757d', fontWeight: 'normal' }}>Akun</span></h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <i className="fas fa-database"></i>
          </div>
          <div className="stat-info">
            <p>Penggunaan DB</p>
            <h2 style={{ color: '#0ea5e9' }}>12%</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 style={{ margin: '0 0 5px 0' }}>Riwayat Aktivitas Sistem</h3>
        <p className="text-muted">Pemantauan aktivitas pengguna secara real-time di seluruh sistem.</p>
        
        <div className="table-responsive mt-20">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Waktu & Tanggal</th>
                <th>Pengguna (Role)</th>
                <th>Aktivitas Sistem</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '500' }}>Hari ini, 09:12 WIB</td>
                <td><strong>Admin LSP</strong><br/><small className="text-muted">LSP Jatim</small></td>
                <td>Melakukan Plotting Asesor untuk Skema Barista</td>
                <td><span className="badge success">Berhasil</span></td>
                <td>
                  {/* Contoh link ke halaman Penugasan LSP */}
                  <Link to="/admin-lsp/penugasan" className="btn-outline btn-sm">
                    Lihat Detail
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: '500' }}>Hari ini, 08:05 WIB</td>
                <td><strong>Staff LSP</strong><br/><small className="text-muted">Kartika Nova</small></td>
                <td>Meng-generate Dokumen SPT.045/2026</td>
                <td><span className="badge success">Berhasil</span></td>
                <td>
                  <Link to="/staff-lsp/dokumen" className="btn-outline btn-sm">
                    Lihat Detail
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: '500' }}>Kemarin, 14:30 WIB</td>
                <td><strong>Admin BLK</strong><br/><small className="text-muted">Wonojati</small></td>
                <td>Mengirimkan Surat Usulan No: 400.3.5.3/238</td>
                <td><span className="badge success">Berhasil</span></td>
                <td>
                  <Link to="/admin-blk/pengajuan" className="btn-outline btn-sm">
                    Lihat Detail
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: '500' }}>Kemarin, 11:10 WIB</td>
                <td><strong>Asesor</strong><br/><small className="text-muted">Egor Yulianto</small></td>
                <td style={{ color: '#dc3545' }}>Gagal Login - Password Salah</td>
                <td><span className="badge danger">Gagal</span></td>
                <td>
                  <Link to="/super-admin/akun" className="btn-outline btn-sm">
                    Cek Akun
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;