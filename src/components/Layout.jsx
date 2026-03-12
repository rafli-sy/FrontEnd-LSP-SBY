import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './Layout.css'; 
import logoLSP from '../assets/logo.png'; 

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // --- LOGIKA PRIMARY ROLE ---
  const [primaryRole, setPrimaryRole] = useState('');

  useEffect(() => {
    if (!primaryRole) {
      if (currentPath.startsWith('/super-admin')) setPrimaryRole('super-admin');
      else if (currentPath.startsWith('/admin-lsp')) setPrimaryRole('admin-lsp');
      else if (currentPath.startsWith('/staff-lsp')) setPrimaryRole('staff-lsp');
      else if (currentPath.startsWith('/admin-blk')) setPrimaryRole('admin-blk');
      else if (currentPath.startsWith('/asesor')) setPrimaryRole('asesor');
    }
  }, [currentPath, primaryRole]);

  // --- STATE UNTUK CUSTOM DROPDOWN ---
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- LIST ROLE DINAMIS BERDASARKAN PRIMARY ROLE ---
  const getAvailableRoles = () => {
    switch (primaryRole) {
      case 'admin-lsp':
        return [
          { path: '/admin-lsp', label: 'Admin LSP' },
          { path: '/staff-lsp', label: 'Staff LSP' },
        ];
      case 'admin-blk':
        return [
          { path: '/admin-blk', label: 'Admin BLK' },
          { path: '/asesor', label: 'Asesor' },
        ];
      case 'staff-lsp':
        return [{ path: '/staff-lsp', label: 'Staff LSP' }];
      case 'asesor':
        return [{ path: '/asesor', label: 'Asesor' }];
      default:
        return [];
    }
  };

  const roles = getAvailableRoles();

  const handleRoleSelect = (path) => {
    setIsRoleMenuOpen(false);
    navigate(path);
  };

  const getPageTitle = () => {
    if (currentPath.startsWith('/super-admin')) return 'Dashboard Super Admin';
    if (currentPath.startsWith('/admin-lsp')) return 'Dashboard Admin LSP';
    if (currentPath.startsWith('/staff-lsp')) return 'Dashboard Staff LSP';
    if (currentPath.startsWith('/admin-blk')) return 'Dashboard Admin BLK';
    if (currentPath.startsWith('/asesor')) return 'Dashboard Asesor';
    return 'Sistem Manajemen UJK';
  };

  const getHomeRoute = () => {
    if (currentPath.startsWith('/super-admin')) return '/super-admin';
    if (currentPath.startsWith('/admin-lsp')) return '/admin-lsp';
    if (currentPath.startsWith('/staff-lsp')) return '/staff-lsp';
    if (currentPath.startsWith('/admin-blk')) return '/admin-blk';
    if (currentPath.startsWith('/asesor')) return '/asesor';
    return '/';
  };

  const getActiveClass = (path) => currentPath === path ? 'active-link' : '';

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <Link to={getHomeRoute()}><img src={logoLSP} alt="Logo LSP" /></Link>
            <div className="logo-text"><span className="brand">LSP BLK SURABAYA</span></div>
          </div>

          <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
            
            {/* 1. ROLE: SUPER ADMIN (DIPERBAIKI) */}
            {primaryRole === 'super-admin' && (
              <>
                <div className="menu-label">SISTEM KONTROL</div>
                <Link to="/super-admin" className={getActiveClass('/super-admin')}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/super-admin/manajemen-akun" className={getActiveClass('/super-admin/manajemen-akun')}><i className="fas fa-users-cog"></i> Manajemen Akun</Link>
                
                <div className="menu-label">PEMANTAUAN LSP (View All)</div>
                <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')}><i className="fas fa-database"></i> Master Skema</Link>
                <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')}><i className="fas fa-user-tie"></i> Master Asesor</Link>
                <Link to="/admin-lsp/buku-induk" className={getActiveClass('/admin-lsp/buku-induk')}><i className="fas fa-book"></i> Buku Induk UJK</Link>
                <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')}><i className="fas fa-building"></i> Data TUK</Link>

                <div className="menu-label">PEMANTAUAN BLK (View All)</div>
                <Link to="/admin-blk/pengajuan" className={getActiveClass('/admin-blk/pengajuan')}><i className="fas fa-envelope-open-text"></i> Data Pengajuan BLK</Link>
              </>
            )}
            {/* 2. ROLE: ADMIN LSP */}
            {currentPath.startsWith('/admin-lsp') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">The Controller</p>
                <Link to="/admin-lsp" className={getActiveClass('/admin-lsp')}><i className="fas fa-home"></i> Dashboard</Link>
                <p className="menu-label">Master Data</p>
                <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')}><i className="fas fa-file-code"></i> Data Skema</Link>
                <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')}><i className="fas fa-user-tie"></i> Data Asesor</Link>
                <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')}><i className="fas fa-map-marker-alt"></i> Penyelia & TUK</Link>
                <p className="menu-label">Manajemen UJK</p>
                {/* Teks disesuaikan menjadi Penugasan Asesor */}
                <Link to="/admin-lsp/penugasan" className={getActiveClass('/admin-lsp/penugasan')}><i className="fas fa-tasks"></i> Penugasan Asesor</Link>
                <Link to="/admin-lsp/buku-induk" className={getActiveClass('/admin-lsp/buku-induk')}><i className="fas fa-book"></i> Buku Induk</Link>
                {/* FITUR BARU: Verifikasi Sertifikat */}
                <Link to="/admin-lsp/verifikasi-sertifikat" className={getActiveClass('/admin-lsp/verifikasi-sertifikat')}><i className="fas fa-certificate"></i> Verifikasi Sertifikat</Link>
                <Link to="/admin-lsp/profil" className={getActiveClass('/admin-lsp/profil')}><i className="fas fa-user-edit"></i> Profil</Link>
              </>
            )}

            {/* 3. ROLE: STAFF LSP */}
            {currentPath.startsWith('/staff-lsp') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">Menu Administrasi</p>
                <Link to="/staff-lsp" className={getActiveClass('/staff-lsp')}><i className="fas fa-envelope-open-text"></i> Tugas Surat Menyurat</Link>
              </>
            )}

            {/* 4. ROLE: ADMIN BLK */}
            {currentPath.startsWith('/admin-blk') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">Pelayanan BLK</p>
                <Link to="/admin-blk" className={getActiveClass('/admin-blk')}><i className="fas fa-chart-line"></i> Dashboard </Link>
                <Link to="/admin-blk/pengajuan" className={getActiveClass('/admin-blk/pengajuan')}><i className="fas fa-paper-plane"></i> Pengajuan UJK</Link>
              </>
            )}

            {/* 5. ROLE: ASESOR */}
            {currentPath.startsWith('/asesor') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">Pelayanan Asesor</p>
                <Link to="/asesor" className={getActiveClass('/asesor')}><i className="fas fa-home"></i> Dashboard</Link>
                <Link to="/asesor/tugas" className={getActiveClass('/asesor/tugas')}><i className="fas fa-calendar-check"></i> Ujian Aktif</Link> 
                <Link to="/asesor/manajemen-akun" className={getActiveClass('/asesor/manajemen-akun')}><i className="fas fa-user-edit"></i> Manajemen Akun</Link>
                <Link to="/asesor/profil" className={getActiveClass('/asesor/profil')}><i className="fas fa-user"></i> Profil</Link>
              </>
            )}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-switch-card">
            <div className="user-profile-info">
              <div className="user-avatar-wrapper">
                <i className="fas fa-user-circle user-avatar"></i>
                <span className="status-indicator"></span>
              </div>
              <div className="user-details">
                <span className="user-name">Angga Yunanda</span>
                <span className="user-role-text">Online</span>
              </div>
            </div>

            {primaryRole !== 'super-admin' && roles.length > 1 && (
              <div className="switch-role-container" ref={dropdownRef}>
                <div 
                  className={`switch-role-ui ${isRoleMenuOpen ? 'active' : ''}`} 
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                >
                  <div className="switch-left">
                    <i className="fas fa-sync-alt"></i>
                    <span>Ganti Akses</span>
                  </div>
                  <i className={`fas fa-chevron-${isRoleMenuOpen ? 'up' : 'down'} arrow-icon`}></i>
                </div>

                <div className={`custom-role-dropdown ${isRoleMenuOpen ? 'show' : ''}`}>
                  <div className="dropdown-header">Pilih Akses Role</div>
                  <div className="dropdown-list">
                    {roles.map((role) => {
                      const isActive = currentPath.startsWith(role.path);
                      return (
                        <button
                          key={role.path}
                          onClick={() => handleRoleSelect(role.path)}
                          className={`role-option ${isActive ? 'active-role' : ''}`}
                        >
                          <span>{role.label}</span>
                          {isActive && <i className="fas fa-check check-icon"></i>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/login" className="logout-btn-premium">
            <i className="fas fa-sign-out-alt"></i> <span>Keluar Sistem</span>
          </Link>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-navbar">
          <div className="nav-left"><h2 className="page-title">{getPageTitle()}</h2></div>
        </header>
        <main className="content-area">
          <div className="fade-in-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;