import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css'; 
import logoLSP from '../assets/logo.png'; 

const Layout = () => {
  // Mengambil informasi URL saat ini (misal: "/admin-blk/pendaftaran")
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="dashboard-container">
      
      {/* --- Sidebar (Menu Samping) --- */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logoLSP} alt="Logo LSP BLK Surabaya" />
          <div className="logo-text">
            <span className="brand">LSP BLK SURABAYA</span>
            <span className="tag">UPT Pelatihan Kerja Surabaya</span>
          </div>
        </div>

        {/* Menu Navigasi Dinamis Berdasarkan Role (URL) */}
        <nav className="sidebar-nav">
          
          {/* 1. MENU KHUSUS SUPER ADMIN */}
          {currentPath.startsWith('/super-admin') && (
            <>
              <p className="menu-label">SUPER ADMIN PANEL</p>
              <Link to="/super-admin"><i className="fas fa-home"></i> Dashboard Utama</Link>
              <Link to="/super-admin/users"><i className="fas fa-users-cog"></i> Manajemen User</Link>
              <Link to="/super-admin/master-data"><i className="fas fa-database"></i> Master Data</Link>
              <Link to="/super-admin/settings"><i className="fas fa-cogs"></i> Pengaturan Sistem</Link>
            </>
          )}

          {/* 2. MENU KHUSUS ADMIN LSP */}
          {currentPath.startsWith('/admin-lsp') && (
            <>
              <p className="menu-label">ADMIN LSP PANEL</p>
              <Link to="/admin-lsp"><i className="fas fa-home"></i> Dashboard LSP</Link>
              <Link to="/admin-lsp/skema"><i className="fas fa-list-alt"></i> Skema Sertifikasi</Link>
              <Link to="/admin-lsp/asesor"><i className="fas fa-user-tie"></i> Data Asesor</Link>
              <Link to="/admin-lsp/jadwal"><i className="fas fa-calendar-alt"></i> Jadwal Uji (TUK)</Link>
              <Link to="/admin-lsp/peserta"><i className="fas fa-users"></i> Peserta Sertifikasi</Link>
            </>
          )}

          {/* 3. MENU KHUSUS ADMIN BLK */}
          {currentPath.startsWith('/admin-blk') && (
            <>
              <p className="menu-label">ADMIN BLK PANEL</p>
              <Link to="/admin-blk"><i className="fas fa-home"></i> Dashboard BLK</Link>
              <Link to="/admin-blk/pendaftaran"><i className="fas fa-clipboard-list"></i> Skema</Link>
              <Link to="/admin-blk/kejuruan"><i className="fas fa-tools"></i> Pengajuan UJK</Link>
              <Link to="/admin-blk/feedback"><i className="fas fa-star"></i> Tanggal UJK</Link>
              <Link to="/admin-blk/laporan"><i className="fas fa-chart-bar"></i> Unggah File Surat</Link>
            </>
          )}

          {/* 4. MENU KHUSUS ASESOR */}
          {currentPath.startsWith('/asesor') && (
            <>
              <p className="menu-label">ASESOR PANEL</p>
              <Link to="/asesor"><i className="fas fa-home"></i> Dashboard Asesor</Link>
              <Link to="/asesor/jadwal"><i className="fas fa-calendar-check"></i> Jenis Kejuruan</Link>
              <Link to="/asesor/penilaian"><i className="fas fa-edit"></i> Nomor Registrasi</Link>
              <Link to="/asesor/riwayat"><i className="fas fa-history"></i> Masa Sertifikat</Link>
            </>
          )}
          
          {/* Tombol Logout (Muncul di semua role) */}
          <Link to="/login" className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Keluar
          </Link>
        </nav>
      </aside>

      {/* --- Area Konten Utama --- */}
      <div className="main-content">
        
        {/* Navbar Atas */}
        <header className="top-navbar">
          <div className="nav-title">Panel Manajemen Sistem</div>
          <div className="user-profile">
            <span>Halo, Pengguna!</span>
            <i className="fas fa-user-circle"></i>
          </div>
        </header>

        {/* Outlet: Area tengah yang akan berubah-ubah isinya */}
        <main className="content-area">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default Layout;