import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 
import logoLSP from '../../assets/logo.png'; 
import './Sidebar.css'; 

const Sidebar = (props) => {
  const { isMobileOpen, setIsMobileOpen, isOpen, closeSidebar, isDesktopOpen } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://lspblksurabaya.id';

  const { userData } = useUser();
  const [primaryRole, setPrimaryRole] = useState('');
  
  // State baru untuk menampung URL foto hasil fetch biner di Sidebar
  const [sidebarPhotoUrl, setSidebarPhotoUrl] = useState('');



  const actualIsOpen = isMobileOpen !== undefined ? isMobileOpen : isOpen;
  const isDesktopClosed = isDesktopOpen !== undefined ? !isDesktopOpen : !isOpen;

  const handleClose = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
    if (closeSidebar) closeSidebar();
  };

  // SINKRONISASI: Fungsi Fetching Foto Profil Biner untuk Komponen Sidebar
  const fetchSidebarPhoto = async () => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      setSidebarPhotoUrl('');
      return;
    }

    try {
      // PERBAIKAN 1: Tambahkan Cache-Busting (timestamp) agar selalu ambil foto terbaru dari backend
      const timestamp = new Date().getTime();
      const imgResponse = await fetch(`${apiUrl}/api/getFotoProfile?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': '69420' // Bypass warning page Ngrok
        }
      });
      
      if (imgResponse.ok) {
        const imageBlob = await imgResponse.blob();
        
        // PERBAIKAN 2: Bersihkan URL Blob lama dari memori sebelum memasang yang baru
        setSidebarPhotoUrl((prevUrl) => {
          if (prevUrl && prevUrl.startsWith('blob:')) {
            URL.revokeObjectURL(prevUrl);
          }
          return URL.createObjectURL(imageBlob);
        });
      } else {
        setSidebarPhotoUrl(''); // Kosongkan jika backend merespon selain 200 OK
      }
    } catch (error) {
      console.error("Gagal load foto profil di sidebar:", error);
      setSidebarPhotoUrl('');
    }
  };

  // Jalankan ulang fungsi pemanggilan foto ketika data user berubah
  useEffect(() => {
    fetchSidebarPhoto();

    // PERBAIKAN 3: Cleanup function untuk mencegah memory leak saat komponen unmount
    return () => {
      if (sidebarPhotoUrl && sidebarPhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(sidebarPhotoUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, apiUrl]);

  useEffect(() => {
    if (currentPath.startsWith('/super-admin')) setPrimaryRole('super-admin');
    else if (currentPath.startsWith('/admin-lsp')) setPrimaryRole('admin-lsp');
    else if (currentPath.startsWith('/staff-lsp')) setPrimaryRole('staff-lsp');
    else if (currentPath.startsWith('/admin-blk')) setPrimaryRole('admin-blk');
    else if (currentPath.startsWith('/asesor')) setPrimaryRole('asesor');
    else {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser && storedUser.role) {
          const roleStr = storedUser.role.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (roleStr === 'superadmin') setPrimaryRole('super-admin');
          else if (roleStr === 'adminlsp') setPrimaryRole('admin-lsp');
          else if (roleStr === 'stafflsp' || roleStr === 'staflsp') setPrimaryRole('staff-lsp');
          else if (roleStr === 'adminblk') setPrimaryRole('admin-blk');
          else if (roleStr === 'asesor') setPrimaryRole('asesor');
        } else if (!primaryRole) {
          setPrimaryRole('admin-lsp'); 
        }
      } catch (error) {
        console.error("Gagal membaca role dari session", error);
      }
    }
  }, [currentPath]);

  const getHomeRoute = () => {
    const routes = {
      'super-admin': '/super-admin',
      'admin-lsp': '/admin-lsp',
      'staff-lsp': '/staff-lsp',
      'admin-blk': '/admin-blk',
      'asesor': '/asesor'
    };
    return routes[primaryRole] || '/';
  };

  const getActiveClass = (path) => currentPath === path ? 'active-link' : '';
  
  const handleMenuClick = () => { 
    if (window.innerWidth <= 992) handleClose(); 
  };
  
  const handleGoToProfile = () => { 
    navigate('/profil'); 
    if (window.innerWidth <= 992) handleClose(); 
  };
  
  const getShortName = (fullName) => { 
    if (!fullName) return 'Pengguna';
    const names = fullName.split(' '); 
    return names.length > 2 ? `${names[0]} ${names[1]}` : fullName; 
  };

  const handleLogout = async (e) => {
    e.preventDefault(); 
    try {
      const token = sessionStorage.getItem('auth_token');
      if (token) {
        await fetch(`${apiUrl}/api/logout`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`, 
            'ngrok-skip-browser-warning': '69420'
          }
        });
      }
    } catch (error) {
      console.error('Gagal saat menghubungi server untuk logout:', error);
    } finally {
      sessionStorage.clear();
      localStorage.clear(); 
      window.location.href = '/login';
    }
  };

  // URL Cadangan otomatis berbasis inisial nama jika foto belum diatur di database
  const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.namaLengkap || 'User')}&background=random&color=fff&size=150`;

  return (
    <>
      {actualIsOpen && window.innerWidth <= 992 && (
        <div className="sidebar-overlay" onClick={handleClose} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998}}></div>
      )}
      
      <aside className={`sidebar ${actualIsOpen ? 'open' : ''} ${isDesktopClosed ? 'desktop-closed' : ''}`} style={{zIndex: 999}}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <img src={logoLSP} alt="Logo LSP" className="sidebar-logo-img" onClick={handleClose} title="Tutup Menu" />
            <Link to={getHomeRoute()} onClick={handleMenuClick} style={{ textDecoration: 'none' }}>
              <div className="logo-text"><span className="brand">LSP BLK SURABAYA</span></div>
            </Link>
          </div>

          <nav className="sidebar-nav" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
              {primaryRole === 'super-admin' && (
                <>
                  <div className="menu-label">SISTEM KONTROL</div>
                  <Link to="/super-admin" className={getActiveClass('/super-admin')} onClick={handleMenuClick}>
                    <i className="fas fa-th-large"></i> Dashboard 
                  </Link>
                </>
              )}
              {primaryRole === 'admin-lsp' && (
                <>
                  <p className="menu-label">The Controller</p>
                  <Link to="/admin-lsp" className={getActiveClass('/admin-lsp')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                  <p className="menu-label">Sertifikasi</p>
                  <Link to="/admin-lsp/sertifikat" className={getActiveClass('/admin-lsp/sertifikat')} onClick={handleMenuClick}><i className="fas fa-certificate"></i> Sertifikat</Link>
                  <p className="menu-label">Manajemen UJK</p>
                  <Link to="/admin-lsp/penugasan" className={getActiveClass('/admin-lsp/penugasan')} onClick={handleMenuClick}><i className="fas fa-tasks"></i> Penugasan & Dokumen</Link>
                  <p className="menu-label">Master Data</p>
                  <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')} onClick={handleMenuClick}><i className="fas fa-file-code"></i> Data Skema</Link>
                  <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')} onClick={handleMenuClick}><i className="fas fa-user-tie"></i> Data Asesor</Link>
                  <Link to="/admin-lsp/penyelia" className={getActiveClass('/admin-lsp/penyelia')} onClick={handleMenuClick}><i className="fas fa-user-shield"></i> Data Penyelia</Link>
                  <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')} onClick={handleMenuClick}><i className="fas fa-map-marker-alt"></i> Data TUK</Link>
                </>
              )}
              {primaryRole === 'staff-lsp' && (
                <>
                  <p className="menu-label">Workspace Staff</p>
                  <Link to="/staff-lsp" className={getActiveClass('/staff-lsp')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                  <p className="menu-label">Manajemen UJK</p>
                  <Link to="/staff-lsp/surat" className={getActiveClass('/staff-lsp/surat')} onClick={handleMenuClick}><i className="fas fa-envelope-open-text"></i> Dokumen & Administrasi</Link>
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
                  <Link to="/asesor/data-asesor" className={getActiveClass('/asesor/data-asesor')} onClick={handleMenuClick}><i className="fas fa-id-card-clip"></i> Data Asesor</Link>
                </>
              )}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-switch-card">
            <div className="user-profile-info" onClick={handleGoToProfile} style={{ cursor: 'pointer' }} title="Buka Profil">
              <div className="user-avatar-wrapper">
                
                {/* SINKRONISASI UTAMA: Mengganti pemanggilan URL mentah ke Blob URL yang bersih */}
                <img 
                  src={sidebarPhotoUrl || fallbackAvatarUrl} 
                  alt="Avatar" 
                  className="user-avatar-img" 
                  onError={(e) => { 
                    e.target.onerror = null; // Menahan agar tidak terjadi infinite loop request
                    e.target.src = fallbackAvatarUrl; 
                  }} 
                /> 
                
                <span className="status-indicator"></span>
              </div>
              
              <div className="user-details">
                <span className="user-name">{getShortName(userData?.namaLengkap)}</span>
                <span className="user-role-text">
                  {primaryRole ? primaryRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Loading...'}
                </span>
              </div>
            </div>

            <Link to="/pengaturan" className={`settings-link ${getActiveClass('/pengaturan')}`} onClick={handleMenuClick}>
              <i className="fas fa-cog"></i> <span>Pengaturan</span>
            </Link>
          </div>

          <Link to="/login" className="logout-btn-premium" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> <span>Keluar</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;