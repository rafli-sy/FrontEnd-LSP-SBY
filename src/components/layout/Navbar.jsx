import { useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logoLSP from '../../assets/logo.png';
import './Navbar.css';

const Navbar = ({ toggleSidebar, isDesktopOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userData } = useUser(); 

  const getRoleName = () => {
    if (currentPath.startsWith('/super-admin')) return 'Super Admin';
    if (currentPath.startsWith('/admin-lsp')) return 'Admin LSP';
    
    // --- LOGIKA PAKSA ADMIN BLK ---
    if (currentPath.startsWith('/admin-blk')) {
      // 1. Ambil dari context (jika berhasil)
      let namaInstansi = userData?.instansi;

      // 2. Jika context gagal/kosong, BONGKAR PAKSA dari Session Storage
      if (!namaInstansi || namaInstansi === '') {
        try {
          const rawData = sessionStorage.getItem('user');
          if (rawData) {
            const parsed = JSON.parse(rawData);
            // Cari paksa semua kemungkinan nama kolom instansi
            namaInstansi = parsed.instansi || parsed.asal_instansi || parsed.nama_instansi || parsed.institusi || parsed.nama || '';
          }
        } catch (e) {
          console.error("Gagal bongkar storage", e);
        }
      }

      // 3. Tampilkan hasilnya, jika BENAR-BENAR KOSONG dari database, baru tampilkan 'Admin BLK'
      return namaInstansi ? namaInstansi : 'Admin BLK';
    }
    
    if (currentPath.startsWith('/staff-lsp')) return 'Staff LSP';
    if (currentPath.startsWith('/asesor')) return 'Asesor';
    return 'LSP BLK Surabaya'; 
  };

  const longDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button 
          className={`mobile-menu-btn ${isDesktopOpen ? 'hide-on-desktop' : ''}`} 
          onClick={toggleSidebar} 
        >
          <img src={logoLSP} alt="Logo" className="navbar-logo-btn" />
        </button>
        <h2 className="page-title">{getRoleName()}</h2>
      </div>

      <div className="nav-right">
        <div className="nav-date-badge">
          <i className="far fa-calendar-alt"></i>
          <span>{longDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;