import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getRoleName = () => {
    if (currentPath.startsWith('/super-admin')) return 'Super Admin';
    if (currentPath.startsWith('/admin-lsp')) return 'Admin LSP';
    if (currentPath.startsWith('/admin-blk')) return 'Admin BLK';
    if (currentPath.startsWith('/staff-lsp')) return 'Staff LSP';
    if (currentPath.startsWith('/asesor')) return 'Asesor';
    return 'LSP BLK Surabaya'; 
  };

  // Membuat dua versi format tanggal
  const longDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const shortDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h2 className="page-title">{getRoleName()}</h2>
      </div>

      <div className="nav-right">
        <div className="nav-date-badge">
          <i className="far fa-calendar-alt"></i>
          {/* Teks panjang untuk Laptop, teks pendek untuk HP */}
          <span className="date-text-long">{longDate}</span>
          <span className="date-text-short">{shortDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;