import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AlertPopup from '../ui/AlertPopup';
import Button from '../ui/Button'; 
import logoLSP from '../../assets/logo.png'; 
import './Sidebar.css'; 

const Sidebar = ({ isOpen, isDesktopOpen = true, closeSidebar, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [primaryRole, setPrimaryRole] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // <-- TAMBAHAN: Timer Reference untuk alert di Sidebar
  const alertTimer = useRef(null);

  const [profileData, setProfileData] = useState({
    namaLengkap: 'Moch. Nur Rafli Hikmal Putra', noTelp: '081234567890', alamat: 'Kediri, Jawa Timur', instansi: 'Universitas Negeri Surabaya', foto: null 
  });

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  useEffect(() => {
    if (currentPath.startsWith('/super-admin')) setPrimaryRole('super-admin');
    else if (currentPath.startsWith('/admin-lsp')) setPrimaryRole('admin-lsp');
    else if (currentPath.startsWith('/staff-lsp')) setPrimaryRole('staff-lsp');
    else if (currentPath.startsWith('/admin-blk')) setPrimaryRole('admin-blk');
    else if (currentPath.startsWith('/asesor')) setPrimaryRole('asesor');
    else if (!primaryRole) setPrimaryRole('admin-lsp'); 
  }, [currentPath]);

  const getAvailableRoles = () => {
    switch (primaryRole) {
      case 'admin-lsp': return [{ path: '/admin-lsp', label: 'Admin LSP' }, { path: '/staff-lsp', label: 'Staff LSP' }];
      case 'admin-blk': return [{ path: '/admin-blk', label: 'Admin BLK' }, { path: '/asesor', label: 'Asesor' }];
      case 'staff-lsp': return [{ path: '/staff-lsp', label: 'Staff LSP' }];
      case 'asesor': return [{ path: '/asesor', label: 'Asesor' }];
      case 'super-admin': return [{ path: '/super-admin', label: 'Super Admin' }, { path: '/admin-lsp', label: 'Admin LSP' }];
      default: return [{ path: '/admin-lsp', label: 'Admin LSP' }, { path: '/staff-lsp', label: 'Staff LSP' }];
    }
  };

  const roles = getAvailableRoles();
  const handleRoleSelect = (path) => { setIsRoleMenuOpen(false); navigate(path); if (window.innerWidth <= 992) closeSidebar(); };
  const getHomeRoute = () => { if (currentPath.startsWith('/super-admin')) return '/super-admin'; if (currentPath.startsWith('/admin-lsp')) return '/admin-lsp'; if (currentPath.startsWith('/staff-lsp')) return '/staff-lsp'; if (currentPath.startsWith('/admin-blk')) return '/admin-blk'; if (currentPath.startsWith('/asesor')) return '/asesor'; return '/'; };
  const getActiveClass = (path) => currentPath === path ? 'active-link' : '';
  const handleMenuClick = () => { if (window.innerWidth <= 992) closeSidebar(); };
  
  // <-- PERBAIKAN: Reset File Upload Foto Profil
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => { setProfileData({ ...profileData, foto: reader.result }); }; 
      reader.readAsDataURL(file); 
    }
    e.target.value = null; // <-- Reset value input
  };

  // <-- PERBAIKAN: Fungsi Close aman
  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handleModalClose = () => {
    setAlert({ 
      type: 'cancel', 
      title: 'Apakah anda yakin ingin batal?', 
      text: 'Semua perubahan akan hilang.', 
      onConfirm: () => { setShowEditModal(false); closeAlert(); }, 
      onCancel: closeAlert 
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setAlert({
      type: 'save', title: 'Apakah anda yakin?', text: 'Periksa data yang terisi dengan benar.',
      onConfirm: () => {
        setShowEditModal(false);
        setAlert({ 
          type: 'success', 
          title: 'Sukses!', 
          text: 'Data berhasil disimpan.',
          onCancel: closeAlert // <-- Prop onCancel
        });
        
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2000);
      },
      onCancel: closeAlert
    });
  };

  const getShortName = (fullName) => { const names = fullName.split(' '); return names.length > 2 ? `${names[0]} ${names[1]}` : fullName; };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${!isDesktopOpen ? 'desktop-closed' : ''}`}>
        <div className="sidebar-top">
          
          <div className="sidebar-logo">
            <img src={logoLSP} alt="Logo LSP" className="sidebar-logo-img" onClick={toggleSidebar} title="Tutup Menu" />
            <Link to={getHomeRoute()} onClick={handleMenuClick} style={{ textDecoration: 'none' }}>
              <div className="logo-text"><span className="brand">LSP BLK SURABAYA</span></div>
            </Link>
          </div>

          <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
            {currentPath.startsWith('/super-admin') && (
              <>
                <div className="menu-label">SISTEM KONTROL</div>
                <Link to="/super-admin" className={getActiveClass('/super-admin')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/super-admin/manajemen-akun" className={getActiveClass('/super-admin/manajemen-akun')} onClick={handleMenuClick}><i className="fas fa-users-cog"></i> Manajemen Akun</Link>
              </>
            )}
            {currentPath.startsWith('/admin-lsp') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">The Controller</p>
                <Link to="/admin-lsp" className={getActiveClass('/admin-lsp')} onClick={handleMenuClick}>
                  <i className="fas fa-home"></i> Dashboard 
                </Link>
                
                <p className="menu-label">Master Data</p>
                <Link to="/admin-lsp/skema" className={getActiveClass('/admin-lsp/skema')} onClick={handleMenuClick}>
                  <i className="fas fa-file-code"></i> Data Skema
                </Link>
                <Link to="/admin-lsp/asesor" className={getActiveClass('/admin-lsp/asesor')} onClick={handleMenuClick}>
                  <i className="fas fa-user-tie"></i> Data Asesor
                </Link>
                <Link to="/admin-lsp/penyelia" className={getActiveClass('/admin-lsp/penyelia')} onClick={handleMenuClick}>
                  <i className="fas fa-user-shield"></i> Data Penyelia
                </Link>
                <Link to="/admin-lsp/tuk" className={getActiveClass('/admin-lsp/tuk')} onClick={handleMenuClick}>
                  <i className="fas fa-map-marker-alt"></i> Data TUK
                </Link>
                <p className="menu-label">Manajemen UJK</p>
                <Link to="/admin-lsp/penugasan" className={getActiveClass('/admin-lsp/penugasan')} onClick={handleMenuClick}>
                  <i className="fas fa-tasks"></i> Penugasan & Plotting
                </Link>
              </>
            )}
            {currentPath.startsWith('/staff-lsp') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">Workspace Staff</p>
                <Link to="/staff-lsp" className={getActiveClass('/staff-lsp')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/staff-lsp/surat" className={getActiveClass('/staff-lsp/surat')} onClick={handleMenuClick}><i className="fas fa-envelope-open-text"></i> Surat Menyurat</Link>
              </>
            )}
            {currentPath.startsWith('/admin-blk') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">Workspace Admin BLK</p>
                <Link to="/admin-blk" className={getActiveClass('/admin-blk')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/admin-blk/pengajuan" className={getActiveClass('/admin-blk/pengajuan')} onClick={handleMenuClick}><i className="fas fa-paper-plane"></i> Pengajuan UJK</Link>
              </>
            )}
            {currentPath.startsWith('/asesor') && primaryRole !== 'super-admin' && (
              <>
                <p className="menu-label">The Field Expert</p>
                <Link to="/asesor" className={getActiveClass('/asesor')} onClick={handleMenuClick}><i className="fas fa-home"></i> Dashboard </Link>
                <Link to="/asesor/tugas" className={getActiveClass('/asesor/tugas')} onClick={handleMenuClick}><i className="fas fa-calendar-check"></i> Ujian Aktif</Link>
                <Link to="/asesor/manajemen-akun" className={getActiveClass('/asesor/manajemen-akun')} onClick={handleMenuClick}><i className="fas fa-user-cog"></i> Manajemen Akun</Link>
              </>
            )}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-switch-card">
            <div className="user-profile-info" onClick={() => setShowEditModal(true)}>
              <div className="user-avatar-wrapper">{profileData.foto ? <img src={profileData.foto} alt="Avatar" className="user-avatar-img" /> : <i className="fas fa-user-circle user-avatar-icon"></i>}<span className="status-indicator"></span></div>
              <div className="user-details"><span className="user-name">{getShortName(profileData.namaLengkap)}</span><span className="user-role-text">{primaryRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span></div>
            </div>

            {primaryRole !== 'super-admin' && roles.length > 1 && (
              <div className="switch-role-container" ref={dropdownRef}>
                <div className={`switch-role-ui ${isRoleMenuOpen ? 'active' : ''}`} onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}>
                  <div className="switch-left"><i className="fas fa-sync-alt"></i><span>Ganti Akses</span></div><i className={`fas fa-chevron-${isRoleMenuOpen ? 'up' : 'down'} arrow-icon`}></i>
                </div>
                <div className={`custom-role-dropdown ${isRoleMenuOpen ? 'show' : ''}`}>
                  <div className="dropdown-header">Pilih Akses Role</div>
                  <div className="dropdown-list">
                    {roles.map(role => (
                      <button key={role.path} onClick={() => handleRoleSelect(role.path)} className={`role-option ${currentPath.startsWith(role.path) ? 'active-role' : ''}`}>
                        <span>{role.label}</span> {currentPath.startsWith(role.path) && <i className="fas fa-check check-icon"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/login" className="logout-btn-premium"><i className="fas fa-sign-out-alt"></i> <span>Keluar Sistem</span></Link>
        </div>
      </aside>

      {/* --- MODAL EDIT PROFIL --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '450px' }}>
            <h3>Profil Pengguna</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="avatar-upload-section">
                <div className="avatar-upload-wrapper" onClick={() => fileInputRef.current.click()}>
                  <div className="avatar-preview-container">{profileData.foto ? <img src={profileData.foto} alt="Preview" className="avatar-preview-img" /> : <i className="fas fa-user-circle avatar-placeholder-icon"></i>}</div>
                  <div className="avatar-camera-icon"><i className="fas fa-camera"></i></div>
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} />
                <p className="avatar-upload-text">Ketuk untuk ganti foto</p>
              </div>

              <div className="form-group"><label>Nama Lengkap</label><input type="text" className="form-input" value={profileData.namaLengkap} onChange={(e) => setProfileData({...profileData, namaLengkap: e.target.value})} required /></div>
              <div className="form-group"><label>Nomor WhatsApp</label><input type="tel" className="form-input" value={profileData.noTelp} onChange={(e) => setProfileData({...profileData, noTelp: e.target.value})} required /></div>
              <div className="form-group"><label>Asal Instansi / Lembaga</label><input type="text" className="form-input" value={profileData.instansi} onChange={(e) => setProfileData({...profileData, instansi: e.target.value})} required /></div>
              <div className="form-group"><label>Alamat Domisili</label><textarea className="form-input" value={profileData.alamat} onChange={(e) => setProfileData({...profileData, alamat: e.target.value})} required rows="2" style={{ resize: 'none' }}></textarea></div>

              <div className="modal-actions" style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                <Button variant="secondary" isFullWidth onClick={handleModalClose}>Batal</Button>
                <Button type="submit" variant="primary" isFullWidth icon="save">Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <AlertPopup {...alert} />
    </>
  );
};

export default Sidebar;