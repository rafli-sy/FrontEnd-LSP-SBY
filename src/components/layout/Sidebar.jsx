import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 
import logoLSP from '../../assets/logo.png'; 
import './Sidebar.css'; 

const Sidebar = ({ isOpen, isDesktopOpen = true, closeSidebar, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { userData } = useUser();
  const [primaryRole, setPrimaryRole] = useState('');

  useEffect(() => {
    if (currentPath.startsWith('/super-admin')) setPrimaryRole('super-admin');
    else if (currentPath.startsWith('/admin-lsp')) setPrimaryRole('admin-lsp');
    else if (currentPath.startsWith('/staff-lsp')) setPrimaryRole('staff-lsp');
    else if (currentPath.startsWith('/admin-blk')) setPrimaryRole('admin-blk');
    else if (currentPath.startsWith('/asesor')) setPrimaryRole('asesor');
    else if (!primaryRole) setPrimaryRole('admin-lsp'); 
  }, [currentPath]);

  const getHomeRoute = () => { if (primaryRole === 'super-admin') return '/super-admin'; if (primaryRole === 'admin-lsp') return '/admin-lsp'; if (primaryRole === 'staff-lsp') return '/staff-lsp'; if (primaryRole === 'admin-blk') return '/admin-blk'; if (primaryRole === 'asesor') return '/asesor'; return '/'; };
  const getActiveClass = (path) => currentPath === path ? 'active-link' : '';
  const handleMenuClick = () => { if (window.innerWidth <= 992) closeSidebar(); };
  const handleGoToProfile = () => { navigate('/profil'); if (window.innerWidth <= 992) closeSidebar(); };
  const getShortName = (fullName) => { const names = fullName.split(' '); return names.length > 2 ? `${names[0]} ${names[1]}` : fullName; };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${!isDesktopOpen ? 'desktop-closed' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logoLSP} alt="Logo LSP" className="sidebar-logo-img" onClick={toggleSidebar} title="Tutup Menu" />
          <Link to={getHomeRoute()} onClick={handleMenuClick} style={{ textDecoration: 'none' }}>
            <div className="logo-text"><span className="brand">LSP BLK SURABAYA</span></div>
          </Link>
        </div>

        <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
            {primaryRole === 'super-admin' && (
              <>
                <div className="menu-label">SISTEM KONTROL</div>
                <Link to="/super-admin" className={getActiveClass('/super-admin')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/super-admin/manajemen-akun" className={getActiveClass('/super-admin/manajemen-akun')} onClick={handleMenuClick}><i className="fas fa-users-cog"></i> Manajemen Akun</Link>
                <div className="menu-label">PEMANTAUAN LSP</div>
                <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')} onClick={handleMenuClick}><i className="fas fa-database"></i> Master Skema</Link>
                <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')} onClick={handleMenuClick}><i className="fas fa-user-tie"></i> Master Asesor</Link>
                <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')} onClick={handleMenuClick}><i className="fas fa-building"></i> Data TUK</Link>
              </>
            )}
            {primaryRole === 'admin-lsp' && (
              <>
                <p className="menu-label">The Controller</p>
                <Link to="/admin-lsp" className={getActiveClass('/admin-lsp')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <p className="menu-label">Master Data</p>
                <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')} onClick={handleMenuClick}><i className="fas fa-file-code"></i> Data Skema</Link>
                <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')} onClick={handleMenuClick}><i className="fas fa-user-tie"></i> Data Asesor</Link>
                <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')} onClick={handleMenuClick}><i className="fas fa-map-marker-alt"></i> Data TUK</Link>
                <p className="menu-label">Manajemen UJK</p>
                <Link to="/admin-lsp/penugasan" className={getActiveClass('/admin-lsp/penugasan')} onClick={handleMenuClick}><i className="fas fa-tasks"></i> Penugasan</Link>
              </>
            )}
            {primaryRole === 'staff-lsp' && (
              <>
                <p className="menu-label">Workspace Staff</p>
                <Link to="/staff-lsp" className={getActiveClass('/staff-lsp')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/staff-lsp/surat" className={getActiveClass('/staff-lsp/surat')} onClick={handleMenuClick}><i className="fas fa-envelope-open-text"></i> Surat Menyurat</Link>
              </>
            )}
            {primaryRole === 'admin-blk' && (
              <>
                <p className="menu-label">Workspace Admin BLK</p>
                <Link to="/admin-blk" className={getActiveClass('/admin-blk')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/admin-blk/pengajuan" className={getActiveClass('/admin-blk/pengajuan')} onClick={handleMenuClick}><i className="fas fa-paper-plane"></i> Pengajuan UJK</Link>
              </>
            )}
            {primaryRole === 'asesor' && (
              <>
                <p className="menu-label">The Field Expert</p>
                <Link to="/asesor" className={getActiveClass('/asesor')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/asesor/tugas" className={getActiveClass('/asesor/tugas')} onClick={handleMenuClick}><i className="fas fa-calendar-check"></i> Ujian Aktif</Link>
                <Link to="/asesor/akun" className={getActiveClass('/asesor/akun')} onClick={handleMenuClick}><i className="fas fa-id-card-clip"></i> Akun Asesor</Link>
              </>
            )}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="profile-switch-card" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div className="user-profile-info" onClick={handleGoToProfile} style={{ cursor: 'pointer', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '4px' }} title="Buka Profil Saya">
            <div className="user-avatar-wrapper">{userData.foto ? <img src={userData.foto} alt="Avatar" className="user-avatar-img" /> : <i className="fas fa-user-circle user-avatar-icon"></i>}<span className="status-indicator"></span></div>
            <div className="user-details"><span className="user-name">{getShortName(userData.namaLengkap)}</span><span className="user-role-text">{primaryRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span></div>
          </div>

          <Link to="/pengaturan" onClick={handleMenuClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: currentPath === '/pengaturan' ? '#3b82f6' : '#64748b', backgroundColor: currentPath === '/pengaturan' ? '#eff6ff' : 'transparent', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }} onMouseEnter={(e) => {if(currentPath !== '/pengaturan'){e.currentTarget.style.backgroundColor='#f8fafc'; e.currentTarget.style.color='#0f172a'}}} onMouseLeave={(e) => {if(currentPath !== '/pengaturan'){e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#64748b'}}}>
            <i className="fas fa-cog" style={{ width: '20px', textAlign: 'center' }}></i> <span>Pengaturan Sistem</span>
          </Link>
        </div>

        <Link to="/login" className="logout-btn-premium"><i className="fas fa-sign-out-alt"></i> <span>Keluar Sistem</span></Link>
      </div>
    </aside>
  );
};

export default Sidebar;