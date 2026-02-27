import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css'; 
import logoLSP from '../assets/logo.png'; 

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Fungsi untuk memberi class 'active' pada link yang sedang dikunjungi
  const getActiveClass = (path) => currentPath === path ? 'active-link' : '';

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
              <Link to="/admin-lsp/penugasan" className={getActiveClass('/admin-lsp/penugasan')}><i className="fas fa-tasks"></i> Plotting Penugasan</Link>
              <Link to="/admin-lsp/buku-induk" className={getActiveClass('/admin-lsp/buku-induk')}><i className="fas fa-book"></i> Buku Induk</Link>
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
              <Link to="/asesor" className={getActiveClass('/asesor')}><i className="fas fa-home"></i> Dashboard</Link>
              <Link to="/asesor/tugas" className={getActiveClass('/asesor/tugas')}><i className="fas fa-calendar-check"></i> Tugas Saya</Link>
              <Link to="/asesor/sertifikasi" className={getActiveClass('/asesor/sertifikasi')}><i className="fas fa-certificate"></i> Sertifikasi Saya</Link>
            </>
          )}
          
          {/* Tombol Logout - Sekarang sudah tertutup dengan benar */}
          <Link to="/login" className="logout-btn" style={{ marginTop: '30px' }}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
          </Link>
        </nav>
      </aside>

      {/* --- KONTEN KANAN --- */}
      <div className="main-content">
        <header className="top-navbar">
          <div className="nav-title">Sistem Manajemen</div>
          <div className="user-profile">
            <span>
              {currentPath.startsWith('/super-admin') && 'Super Admin'}
              {currentPath.startsWith('/admin-lsp') && 'Admin LSP'}
              {currentPath.startsWith('/staff-lsp') && 'Staff LSP'}
              {currentPath.startsWith('/admin-blk') && 'Admin BLK'}
              {currentPath.startsWith('/asesor') && 'Asesor'}
            </span>
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