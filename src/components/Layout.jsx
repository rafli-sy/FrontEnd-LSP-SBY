import { Link, Outlet } from 'react-router-dom';
import './Layout.css'; 
import logoLSP from '../assets/logo.png'; // Memanggil logo dari folder assets

const Layout = () => {
  return (
    <div className="dashboard-container">
      
      {/* --- Sidebar (Menu Samping) --- */}
      <aside className="sidebar">
        {/* Bagian Logo mirip seperti header di Landing Page */}
        <div className="sidebar-logo">
          <img src={logoLSP} alt="Logo LSP BLK Surabaya" />
          <div className="logo-text">
            <span className="brand">LSP BLK SURABAYA</span>
            <span className="tag">UPT Pelatihan Kerja Surabaya</span>
          </div>
        </div>

        {/* Menu Navigasi untuk 4 User */}
        <nav className="sidebar-nav">
          <p className="menu-label">MENU AKSES DASHBOARD</p>
          
          <Link to="/super-admin">
            <i className="fas fa-user-shield"></i> Super Admin
          </Link>
          <Link to="/admin-lsp">
            <i className="fas fa-id-badge"></i> Admin LSP
          </Link>
          <Link to="/admin-blk">
            <i className="fas fa-users-cog"></i> Admin BLK
          </Link>
          <Link to="/asesor">
            <i className="fas fa-clipboard-check"></i> Asesor
          </Link>
          
          {/* Tombol Logout */}
          <Link to="/" className="logout-btn">
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