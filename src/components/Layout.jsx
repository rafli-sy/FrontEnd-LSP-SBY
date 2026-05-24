import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Layout.css'; 
import logoLSP from '../assets/logo.png'; 

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const getActiveClass = (path) => currentPath === path ? 'active-link' : '';

  // 1. Tentukan "Primary Role" (Role Utama Pengguna)
  // Di aplikasi nyata, ini diambil dari data User di LocalStorage / Context API / Backend.
  // Untuk saat ini, kita deteksi berdasarkan URL path saat komponen pertama kali di-mount.
  const [primaryRole, setPrimaryRole] = useState('');

  useEffect(() => {
    // Hanya atur Primary Role jika belum pernah di-set (simulasi login pertama kali)
    if (!primaryRole) {
      if (currentPath.startsWith('/super-admin')) setPrimaryRole('super-admin');
      else if (currentPath.startsWith('/admin-lsp')) setPrimaryRole('admin-lsp');
      else if (currentPath.startsWith('/staff-lsp')) setPrimaryRole('staff-lsp');
      else if (currentPath.startsWith('/admin-blk')) setPrimaryRole('admin-blk');
      else if (currentPath.startsWith('/asesor')) setPrimaryRole('asesor');
    }
  }, [currentPath, primaryRole]);

  // Simulasi Role Switcher berdasarkan hasil diskusi
  const handleRoleSwitch = (e) => {
    navigate(e.target.value);
  };

  // 2. Fungsi untuk me-render Option Dinamis berdasarkan Kewenangan (Aturan Anda)
  const renderRoleOptions = () => {
    switch (primaryRole) {
      case 'super-admin':
        // Super Admin: Bisa pindah ke semua page
        return (
          <>
            <option value="/super-admin">Super Admin</option>
            <option value="/admin-lsp">Admin LSP</option>
            <option value="/staff-lsp">Staff LSP</option>
            <option value="/admin-blk">Admin BLK</option>
            <option value="/asesor">Asesor</option>
          </>
        );
      
      case 'admin-lsp':
        // Admin LSP: Hanya bisa pindah ke Staff LSP (dan dirinya sendiri)
        return (
          <>
            <option value="/admin-lsp">Admin LSP</option>
            <option value="/staff-lsp">Staff LSP</option>
          </>
        );

      case 'admin-blk':
        // Admin BLK: Hanya bisa pindah ke Asesor (dan dirinya sendiri)
        return (
          <>
            <option value="/admin-blk">Admin BLK</option>
            <option value="/asesor">Asesor</option>
          </>
        );

      case 'staff-lsp':
        // Staff LSP: Tidak punya kewenangan pindah
        return <option value="/staff-lsp">Staff LSP</option>;

      case 'asesor':
        // Asesor: Tidak punya kewenangan pindah
        return <option value="/asesor">Asesor</option>;

      default:
        return <option value="/">Pilih Role...</option>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR KIRI --- */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link to="/">
            <img src={logoLSP} alt="Logo LSP BLK Surabaya" />
          </Link>
          <div className="logo-text">
            <span className="brand">LSP BLK SURABAYA</span>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
          
          {/* 1. ROLE: SUPER ADMIN */}
          {currentPath.startsWith('/super-admin') && (
            <>
              <p className="menu-label">SYSTEM MANAGER</p>
              <Link to="/super-admin" className={getActiveClass('/super-admin')}><i className="fas fa-home"></i> Dashboard</Link>
              <Link to="/super-admin/users" className={getActiveClass('/super-admin/users')}><i className="fas fa-users-cog"></i> Manajemen Akun</Link>
              <Link to="/super-admin/audit" className={getActiveClass('/super-admin/audit')}><i className="fas fa-history"></i> Audit Trail</Link>
            </>
          )}

          {/* 2. ROLE: ADMIN LSP */}
          {currentPath.startsWith('/admin-lsp') && (
            <>
              <p className="menu-label">THE CONTROLLER</p>
              <Link to="/admin-lsp" className={getActiveClass('/admin-lsp')}><i className="fas fa-home"></i> Dashboard</Link>
              <p className="menu-label">MASTER DATA</p>
              <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')}><i className="fas fa-file-code"></i> Data Skema</Link>
              <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')}><i className="fas fa-user-tie"></i> Data Asesor</Link>
              <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')}><i className="fas fa-map-marker-alt"></i> Penyelia & TUK</Link>
              <p className="menu-label">KONTROL & REPORT</p>
              {/* Istilah diubah menjadi Penugasan Asesor sesuai catatan mentor */}
              <Link to="/admin-lsp/penugasan" className={getActiveClass('/admin-lsp/penugasan')}><i className="fas fa-tasks"></i> Penugasan Asesor</Link>
              <Link to="/admin-lsp/buku-induk" className={getActiveClass('/admin-lsp/buku-induk')}><i className="fas fa-book"></i> Buku Induk</Link>
              {/* FITUR BARU: Manajemen Akun Admin LSP */}
              <Link to="/admin-lsp/profil" className={getActiveClass('/admin-lsp/profil')}><i className="fas fa-user-edit"></i> Profil</Link>
            </>
          )}

          {/* 3. ROLE: STAFF LSP */}
          {currentPath.startsWith('/staff-lsp') && (
            <>
              <p className="menu-label">THE ADMINISTRATOR</p>
              <Link to="/staff-lsp" className={getActiveClass('/staff-lsp')}><i className="fas fa-home"></i> Dashboard</Link>
              <Link to="/staff-lsp/verifikasi" className={getActiveClass('/staff-lsp/verifikasi')}><i className="fas fa-check-double"></i> Verifikasi Peserta</Link>
              <Link to="/staff-lsp/cetak" className={getActiveClass('/staff-lsp/cetak')}><i className="fas fa-print"></i> Manajemen Cetak</Link>
            </>
          )}

          {/* 4. ROLE: ADMIN BLK */}
          {currentPath.startsWith('/admin-blk') && (
            <>
              <p className="menu-label">THE REQUESTER</p>
              <Link to="/admin-blk" className={getActiveClass('/admin-blk')}><i className="fas fa-chart-line"></i> Dashboard BLK</Link>
              <Link to="/admin-blk/pengajuan" className={getActiveClass('/admin-blk/pengajuan')}><i className="fas fa-paper-plane"></i> Pengajuan UJK</Link>
              <Link to="/admin-blk/peserta" className={getActiveClass('/admin-blk/peserta')}><i className="fas fa-file-import"></i> Import Peserta</Link>
            </>
          )}

          {/* 5. ROLE: ASESOR */}
          {currentPath.startsWith('/asesor') && (
            <>
              <p className="menu-label">THE FIELD EXPERT</p>
              <Link to="/asesor" className={getActiveClass('/asesor')}><i className="fas fa-home"></i> Dashboard Utama</Link>
              <Link to="/asesor/tugas" className={getActiveClass('/asesor/tugas')}><i className="fas fa-calendar-check"></i> Ujian Aktif</Link>
              <Link to="/asesor/manajemen-akun" className={getActiveClass('/asesor/manajemen-akun')}><i className="fas fa-user-edit"></i> Manajemen Akun</Link>
              <Link to="/asesor/profil" className={getActiveClass('/asesor/profil')}><i className="fas fa-user"></i> Profil</Link>
            </>
          )}

          <Link to="/login" className="logout-btn" style={{ marginTop: '30px' }}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
          </Link>
        </nav>
      </aside>

      {/* --- KONTEN KANAN --- */}
      <div className="main-content">
        <header className="top-navbar">
          <div className="nav-title">Sistem Manajemen LSP</div>
          <div className="user-profile">
            {/* Fitur Role Switcher dengan Opsi Dinamis berdasarkan primaryRole */}
            <select 
              className="role-switcher-dropdown" 
              onChange={handleRoleSwitch}
              value={
                currentPath.startsWith('/super-admin') ? '/super-admin' :
                currentPath.startsWith('/admin-lsp') ? '/admin-lsp' :
                currentPath.startsWith('/staff-lsp') ? '/staff-lsp' :
                currentPath.startsWith('/admin-blk') ? '/admin-blk' : 
                currentPath.startsWith('/asesor') ? '/asesor' : ''
              }
              // Jika hanya punya 1 opsi (tidak bisa pindah), kita buat select-nya disabled
              disabled={primaryRole === 'staff-lsp' || primaryRole === 'asesor'}
            >
              {renderRoleOptions()}
            </select>
            <i className="fas fa-user-circle"></i>
          </div>
        </header>

        <main className="content-area">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Layout;