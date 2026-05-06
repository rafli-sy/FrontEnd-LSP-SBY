import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSuperAdmin.css';

const DashboardSuperAdmin = () => {
  const navigate = useNavigate();

  // Dummy data log aktivitas
  const recentLogs = [
    { id: 1, time: '10:45 WIB', date: '02 Mei 2026', user: 'hadiid_lsp', role: 'Admin LSP', action: 'Membuat jadwal UJK-002 & Plotting Asesor', status: 'Sukses', badge: 'success' },
    { id: 2, time: '09:30 WIB', date: '02 Mei 2026', user: 'ade_staff', role: 'Staff LSP', action: 'Mencetak Surat Tugas UJK-001', status: 'Sukses', badge: 'success' },
    { id: 3, time: '08:15 WIB', date: '02 Mei 2026', user: 'SYSTEM_CRON', role: 'System', action: 'Auto-backup database mingguan ke Cloud', status: 'Sukses', badge: 'success' },
    { id: 4, time: '07:50 WIB', date: '02 Mei 2026', user: 'ridho_blk', role: 'Admin BLK', action: 'Gagal login (Password salah 3x)', status: 'Peringatan', badge: 'warning' },
    { id: 5, time: '16:20 WIB', date: '01 Mei 2026', user: 'admin_rafli', role: 'Super Admin', action: 'Menambahkan user baru: johan_asesor', status: 'Sukses', badge: 'success' },
  ];

  return (
    <div className="dashboard-content fade-in-content">
      
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: '700', margin: '0' }}>
          Console Super Admin
        </h2>
        <p className="text-muted" style={{ fontSize: '1rem', marginTop: '6px' }}>
          Pantau kesehatan server, aktivitas pengguna, dan konfigurasi sistem secara menyeluruh.
        </p>
      </div>

      {/* STATISTIK SISTEM */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><i className="fas fa-server"></i></div>
          <div className="stat-info"><h3>24%</h3><p>Beban Server (CPU)</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><i className="fas fa-users-cog"></i></div>
          <div className="stat-info"><h3>45 Akun</h3><p>Total Pengguna Sistem</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}><i className="fas fa-database"></i></div>
          <div className="stat-info"><h3>1.2 GB</h3><p>Database Terpakai</p></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        
        {/* SHORTCUT / QUICK ACTIONS */}
        <div className="dashboard-card" style={{ padding: '24px', margin: 0 }}>
          <h3 className="section-title"><i className="fas fa-tools text-blue" style={{marginRight: '8px'}}></i> Konfigurasi Cepat</h3>
          <div className="action-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="action-card" onClick={() => navigate('/super-admin/manajemen-akun')} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                <i className="fas fa-user-shield"></i>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b' }}>Manajemen Hak Akses</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Tambah, edit role, atau suspend akun.</p>
              </div>
            </div>
            
            <div className="action-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                <i className="fas fa-cloud-download-alt"></i>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b' }}>Backup Database</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Unduh salinan data sistem terbaru.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TABEL LOG AKTIVITAS (AUDIT TRAIL) */}
        <div className="dashboard-card" style={{ padding: '24px', margin: 0, gridColumn: 'span 2' }}>
          <h3 className="section-title"><i className="fas fa-history text-blue" style={{marginRight: '8px'}}></i> Log Aktivitas Sistem (Audit Trail)</h3>
          <div className="table-responsive" style={{ marginTop: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table className="admin-table" style={{ fontSize: '0.85rem' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>Waktu</th>
                  <th>Pengguna & Role</th>
                  <th>Aktivitas</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#334155', display: 'block' }}>{log.time}</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{log.date}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{log.user}</strong><br/>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.role}</span>
                    </td>
                    <td style={{ color: '#475569' }}>{log.action}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${log.badge}`} style={{ fontSize: '0.7rem' }}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardSuperAdmin;