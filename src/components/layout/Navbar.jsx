import { useLocation } from 'react-router-dom';
import logoLSP from '../../assets/logo.png'; // IMPOR LOGO
import './Navbar.css';

const Navbar = ({ toggleSidebar, isDesktopOpen }) => {
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

  const longDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const shortDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="top-navbar">
      <div className="nav-left">
        {/* LOGO SEBAGAI PENGGANTI HAMBURGER */}
        <button 
          className={`mobile-menu-btn ${isDesktopOpen ? 'hide-on-desktop' : ''}`} 
          onClick={toggleSidebar} 
          title="Buka Menu"
        >
          <img src={logoLSP} alt="Logo Toggle" className="navbar-logo-btn" />
        </button>
        <h2 className="page-title">{getRoleName()}</h2>
      </div>

      <div className="nav-right">
        <div className="nav-date-badge">
          <i className="far fa-calendar-alt"></i>
          <span className="date-text-long">{longDate}</span>
          <span className="date-text-short">{shortDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;