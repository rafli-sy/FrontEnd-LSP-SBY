import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';


const DashboardSuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Semua Role');
  const [filterStatus, setFilterStatus] = useState('Semua Status'); 
  const [alertConfig, setAlertConfig] = useState(null);

  // --- STATE DATA DARI BACKEND ---
  const [users, setUsers] = useState([]);
  const [masterTUK, setMasterTUK] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL UTAMA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  // Perubahan: Menambahkan ID untuk Instansi dan TUK agar sesuai dengan Relasi Backend
  const [formAccount, setFormAccount] = useState({
    username: '',
    password: '',
    instansi_id: '',
    instansi_nama: '',
    role: 'adminLsp',
    status: 'Aktif',
    tuk_ids: [],
    tuk_namas: []
  });

  // --- STATE SUB-MODAL PENCARIAN ---
  const [isInstansiModalOpen, setIsInstansiModalOpen] = useState(false);
  const [searchInstansi, setSearchInstansi] = useState('');
  
  const [isTukModalOpen, setIsTukModalOpen] = useState(false);
  const [searchTuk, setSearchTuk] = useState('');

  // Konfigurasi API
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
    'ngrok-skip-browser-warning': '69420'
  });

  // --- FETCH DATA BACKEND ---
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/superAdmin/users?per_page=100`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        // Mengambil array data user dari paginasi Laravel
        const dataArray = data.users.data || [];
        dataArray.sort((a, b) => b.id - a.id);
        setUsers(dataArray);
      }
    } catch (error) {
      console.error("Gagal mengambil data users:", error);
    }
  };

  const fetchMasterJejaring = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/master/jejaring`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setMasterTUK(data.data || data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data jejaring:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchMasterJejaring()]);
      setIsLoading(false);
    };
    loadInitialData();
  }, []);


  // --- LOGIKA FILTER & PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = users.filter(user => {
    const instansiName = user.instansi?.namaInstitusi || user.instansi?.nama_lembaga || user.instansi?.nama || '';
    const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || instansiName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Mapping format role (Backend uses camelCase)
    const mapRoleDisplay = (role) => {
      const roles = { 'superAdmin': 'Super Admin', 'adminLsp': 'Admin LSP', 'stafLsp': 'Staff LSP', 'adminBlk': 'Admin BLK', 'asesor': 'Asesor' };
      return roles[role] || role;
    };
    
    const displayRole = mapRoleDisplay(user.role);
    const matchRole = filterRole === 'Semua Role' || displayRole === filterRole;
    const matchStatus = filterStatus === 'Semua Status' || user.status === filterStatus;
    
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- HANDLERS MODAL UTAMA ---
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormAccount({ username: '', password: '', instansi_id: '', instansi_nama: '', role: 'adminLsp', status: 'Aktif', tuk_ids: [], tuk_namas: [] });
    setIsResettingPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUserId(user.id);
    
    const instansiName = user.instansi?.namaInstitusi || user.instansi?.nama_lembaga || user.instansi?.nama || '';
    const userTuks = user.tuk || [];

    setFormAccount({
      username: user.username,
      password: '', 
      instansi_id: user.instansi_id || '',
      instansi_nama: instansiName,
      role: user.role,
      status: user.status,
      tuk_ids: userTuks.map(t => t.id),
      tuk_namas: userTuks.map(t => t.namaInstitusi || t.nama_lembaga || t.nama)
    });
    setIsResettingPassword(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      if (value === 'adminBlk' && formAccount.instansi_id) {
        setFormAccount(prev => ({ ...prev, role: value, tuk_ids: [prev.instansi_id], tuk_namas: [prev.instansi_nama] }));
      } else {
        setFormAccount(prev => ({ ...prev, role: value, tuk_ids: [], tuk_namas: [] }));
      }
    } else {
      setFormAccount({ ...formAccount, [name]: value });
    }
  };

  // --- KUMPULAN LOGIKA KATA SANDI ---
  const handleInitiateResetPassword = () => {
    setIsResettingPassword(true);
    setFormAccount(prev => ({ ...prev, password: '' }));
  };

  const handleCancelResetPassword = () => {
    setIsResettingPassword(false);
    setFormAccount(prev => ({ ...prev, password: '' }));
  };

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormAccount(prev => ({ ...prev, password: pass }));
  };

  const handleCopyPassword = () => {
    if (formAccount.password) {
      navigator.clipboard.writeText(formAccount.password);
      setAlertConfig({ type: 'info', title: 'Tersalin!', text: 'Kata sandi berhasil disalin ke clipboard.' });
      setTimeout(() => setAlertConfig(null), 2000);
    }
  };

  // --- HANDLERS SUB-MODAL PENCARIAN ---
  const getJejaringName = (item) => item.namaInstitusi || item.nama_lembaga || item.nama || `Instansi ${item.id}`;

  const handlePilihInstansi = (instansi) => {
    const nama = getJejaringName(instansi);
    setFormAccount(prev => {
      const updated = { ...prev, instansi_id: instansi.id, instansi_nama: nama };
      if (prev.role === 'adminBlk') {
        if (!prev.tuk_ids.includes(instansi.id)) {
          updated.tuk_ids = [...prev.tuk_ids, instansi.id];
          updated.tuk_namas = [...prev.tuk_namas, nama];
        }
      }
      return updated;
    });
    setIsInstansiModalOpen(false);
  };

  const handleToggleKewenanganTuk = (tuk) => {
    const nama = getJejaringName(tuk);
    setFormAccount(prev => {
      const isExist = prev.tuk_ids.includes(tuk.id);
      
      const updatedTukIds = isExist ? prev.tuk_ids.filter(id => id !== tuk.id) : [...prev.tuk_ids, tuk.id];
      const updatedTukNamas = isExist ? prev.tuk_namas.filter(n => n !== nama) : [...prev.tuk_namas, nama];
      
      return { ...prev, tuk_ids: updatedTukIds, tuk_namas: updatedTukNamas };
    });
  };

  // --- SUBMIT FORM ---
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!formAccount.username || !formAccount.instansi_id || !formAccount.role) {
      setAlertConfig({ type: 'warning', title: 'Data Belum Lengkap', text: 'Username, Asal Instansi, dan Role wajib diisi.' });
      return setTimeout(() => setAlertConfig(null), 2500);
    }

    if ((modalMode === 'add' || isResettingPassword) && (!formAccount.password || formAccount.password.length < 6)) {
      setAlertConfig({ type: 'warning', title: 'Sandi Wajib', text: 'Kata sandi minimal 6 karakter wajib diisi.' });
      return setTimeout(() => setAlertConfig(null), 2500);
    }

    if (formAccount.role === 'adminBlk' && formAccount.tuk_ids.length === 0) {
      setAlertConfig({ type: 'warning', title: 'TUK Wajib Diisi', text: 'Role Admin BLK wajib mengelola minimal 1 TUK.' });
      return setTimeout(() => setAlertConfig(null), 2500);
    }

    setAlertConfig({
      type: 'save',
      title: modalMode === 'add' ? 'Simpan Akun Baru?' : 'Simpan Perubahan?',
      text: 'Apakah Anda yakin ingin menyimpan pengaturan akun ini?',
      onConfirm: async () => {
        try {
          if (modalMode === 'add') {
            const payload = {
              username: formAccount.username,
              password: formAccount.password,
              role: formAccount.role,
              instansi_id: formAccount.instansi_id,
            };
            if (formAccount.role === 'adminBlk') payload.tuk_ids = formAccount.tuk_ids;

            const res = await fetch(`${apiUrl}/api/superAdmin/create-user`, {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Gagal membuat user');
            
          } else {
            // Edit User Mode
            const payload = {
              new_username: formAccount.username,
              new_role: formAccount.role,
              instansi_id: formAccount.instansi_id,
            };
            if (formAccount.role === 'adminBlk') payload.tuk_ids = formAccount.tuk_ids;

            const resEdit = await fetch(`${apiUrl}/api/superAdmin/edit-user/${selectedUserId}`, {
              method: 'PUT',
              headers: getHeaders(),
              body: JSON.stringify(payload)
            });
            const dataEdit = await resEdit.json();
            if (!resEdit.ok) throw new Error(dataEdit.message || 'Gagal mengedit user');

            // Cek Jika Sandi Direset
            if (isResettingPassword && formAccount.password) {
              const resPass = await fetch(`${apiUrl}/api/superAdmin/reset-password`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                  username: formAccount.username,
                  new_password: formAccount.password,
                  new_password_confirmation: formAccount.password
                })
              });
              if (!resPass.ok) {
                 const errPass = await resPass.json();
                 throw new Error(errPass.message || 'Gagal mereset sandi.');
              }
            }

            // Cek Jika Status Berubah (Aktif/Nonaktif)
            const originalUser = users.find(u => u.id === selectedUserId);
            if (originalUser && originalUser.status !== formAccount.status) {
              const resStatus = await fetch(`${apiUrl}/api/superAdmin/user/${selectedUserId}/status`, {
                method: 'PATCH',
                headers: getHeaders()
              });
              if (!resStatus.ok) throw new Error('Gagal memperbarui status user');
            }
          }

          setIsModalOpen(false); 
          setAlertConfig({ type: 'success', title: 'Berhasil Disimpan', text: 'Data akun pengguna berhasil diperbarui.' });
          fetchUsers(); // Refresh Tabel
          setTimeout(() => setAlertConfig(null), 2500);

        } catch (error) {
           setAlertConfig({ type: 'error', title: 'Terjadi Kesalahan', text: error.message });
        }
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const filteredMasterInstansi = masterTUK.filter(t => getJejaringName(t).toLowerCase().includes(searchInstansi.toLowerCase()));
  const filteredMasterTuk = masterTUK.filter(t => getJejaringName(t).toLowerCase().includes(searchTuk.toLowerCase()));

  // Render Label Role
  const displayRoleLabel = (role) => {
    const roles = { 'superAdmin': 'Super Admin', 'adminLsp': 'Admin LSP', 'stafLsp': 'Staff LSP', 'adminBlk': 'Admin BLK', 'asesor': 'Asesor' };
    return roles[role] || role;
  };

  return (
    <div className="dashboard-content fade-in-content">
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel || (() => setAlertConfig(null))} />}
      
      <div className="dashboard-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 className="dashboard-title" style={{ margin: '0 0 5px 0' }}>Manajemen Akun Pengguna</h2>
          <p className="text-muted" style={{ margin: 0 }}>Kelola akses, role, status, dan kewenangan TUK seluruh pengguna sistem.</p>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* --- FILTER CONTROL --- */}
        <div className="table-controls" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari username atau asal instansi..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
          </div>
          
          <select value={filterRole} onChange={(e) => {setFilterRole(e.target.value); setCurrentPage(1);}} style={{ padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            <option value="Semua Role">Semua Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin LSP">Admin LSP</option>
            <option value="Staff LSP">Staff LSP</option>
            <option value="Admin BLK">Admin BLK</option>
            <option value="Asesor">Asesor</option>
          </select>

          <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            <option value="Semua Status">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-aktif">Nonaktif</option>
          </select>

          <Button variant="primary" icon="user-plus" onClick={handleOpenAddModal} style={{fontWeight: 'bold', padding: '12px 20px', borderRadius: '8px'}}>Tambah Akun</Button>
        </div>

        {/* --- TABEL UTAMA --- */}
        <div className="table-responsive" style={{ padding: '20px' }}>
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>Memuat Data Pengguna...</div>
          ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center', width: '5%', padding: '15px' }}>No.</th>
                <th style={{ width: '20%', padding: '15px' }}>Username</th>
                <th style={{ width: '25%', padding: '15px' }}>Asal Instansi</th>
                <th style={{ width: '20%', textAlign: 'center', padding: '15px' }}>Role</th>
                <th style={{ textAlign: 'center', width: '15%', padding: '15px' }}>Status</th>
                <th style={{ textAlign: 'center', width: '15%', padding: '15px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id} style={{transition: '0.2s', borderBottom: '1px solid #e2e8f0'}}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', padding: '15px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td style={{ padding: '15px' }}><strong style={{ color: '#0f172a', fontSize: '1rem' }}>{user.username}</strong></td>
                    <td style={{ color: '#475569', fontWeight: '500', padding: '15px' }}>{user.instansi?.namaInstitusi || user.instansi?.nama_lembaga || user.instansi?.nama || '-'}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', border: '1px solid #bfdbfe' }}>{displayRoleLabel(user.role)}</span>
                      {user.role === 'adminBlk' && (
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>
                          <i className="fas fa-building"></i> {user.tuk?.length || 0} TUK Dikelola
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <span className={`badge ${user.status === 'Aktif' ? 'success' : 'danger'}`} style={{padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'}}>
                        {user.status === 'Non-aktif' ? 'Nonaktif' : user.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <Button variant="outline" size="sm" icon="edit" onClick={() => handleOpenEditModal(user)} style={{padding: '8px 16px', borderRadius: '8px'}}>Kelola Data</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}><p>Tidak ada pengguna yang sesuai filter.</p></td></tr>
              )}
            </tbody>
          </table>
          )}
        </div>
        <div style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL FORM UTAMA (TAMBAH & EDIT AKUN)                     */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 999 }}>
          <div className="modal-content" style={{ width: '680px', maxWidth: '95%', padding: '35px', borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto', animation: 'zoomIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', fontWeight: '800' }}>
                  <i className={`fas ${modalMode === 'add' ? 'fa-user-plus text-blue' : 'fa-user-edit text-warning'}`} style={{ marginRight: '10px' }}></i>
                  {modalMode === 'add' ? 'Tambah Akun Baru' : 'Kelola Data Akun'}
                </h3>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>Lengkapi data kredensial dan hak akses pengguna di bawah ini.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>&times;</button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '25px' }}>
                
                {/* 1. Username */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Username <span style={{color: 'red'}}>*</span>
                  </label>
                  <input type="text" name="username" value={formAccount.username} onChange={handleInputChange} placeholder="Ketik username unik..." style={{ width: '100%', padding: '14px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none', background: '#f8fafc', fontSize: '0.95rem', color: '#0f172a' }} required />
                </div>
                
                {/* 2. Kata Sandi */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    {modalMode === 'add' ? 'Kata Sandi ' : (isResettingPassword ? 'Kata Sandi Baru ' : 'Manajemen Kata Sandi ')}
                    {(modalMode === 'add' || isResettingPassword) && <span style={{color: 'red'}}>*</span>}
                  </label>
                  
                  {modalMode === 'add' || isResettingPassword ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" name="password" value={formAccount.password} onChange={handleInputChange} placeholder={modalMode === 'add' ? "Min. 6 karakter" : "Ketik sandi baru..."} style={{ flex: 1, padding: '14px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none', background: '#f8fafc', fontSize: '0.95rem', color: '#0f172a' }} required />
                        <Button type="button" variant="outline" icon="random" onClick={handleGeneratePassword} style={{padding: '0 16px', borderRadius: '10px', borderColor: '#3b82f6', color: '#3b82f6'}} title="Acak Sandi Otomatis"></Button>
                        <Button type="button" variant="outline" icon="copy" onClick={handleCopyPassword} style={{padding: '0 16px', borderRadius: '10px', borderColor: '#10b981', color: '#10b981'}} title="Salin Sandi" disabled={!formAccount.password}></Button>
                      </div>
                      {isResettingPassword && (
                        <button type="button" onClick={handleCancelResetPassword} style={{ alignSelf: 'flex-end', fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Batal Reset Sandi</button>
                      )}
                    </div>
                  ) : (
                    <Button type="button" variant="outline" icon="sync-alt" onClick={handleInitiateResetPassword} style={{ width: '100%', padding: '14px', borderColor: '#f59e0b', color: '#d97706', borderRadius: '10px', justifyContent: 'center', background: '#fffbeb', fontSize: '0.95rem', fontWeight: '800' }}>
                      Reset Kata Sandi
                    </Button>
                  )}
                </div>

                {/* 3. Role */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Pilih Role <span style={{color: 'red'}}>*</span>
                  </label>
                  <select name="role" value={formAccount.role} onChange={handleInputChange} style={{ width: '100%', padding: '14px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', color: '#0f172a' }} required>
                    <option value="superAdmin">Super Admin</option>
                    <option value="adminLsp">Admin LSP</option>
                    <option value="stafLsp">Staff LSP</option>
                    <option value="adminBlk">Admin BLK</option>
                    <option value="asesor">Asesor</option>
                  </select>
                </div>

                {/* 4. Asal Instansi */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Asal Instansi <span style={{color: 'red'}}>*</span>
                  </label>
                  <Button type="button" variant="outline" isFullWidth onClick={() => setIsInstansiModalOpen(true)} style={{ justifyContent: 'space-between', backgroundColor: '#fff', textAlign: 'left', borderColor: '#cbd5e1', color: formAccount.instansi_nama ? '#0f172a' : '#94a3b8', padding: '14px 16px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: formAccount.instansi_nama ? '600' : 'normal' }}>
                    <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{formAccount.instansi_nama || 'Cari Instansi...'}</span><i className="fas fa-search text-muted"></i>
                  </Button>
                </div>
                
              </div>

              {/* BARIS STATUS AKUN (HANYA EDIT) */}
              {modalMode === 'edit' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}><i className="fas fa-power-off" style={{marginRight: '8px'}}></i> Status Akun:</label>
                   <select name="status" value={formAccount.status} onChange={handleInputChange} style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', color: formAccount.status === 'Aktif' ? '#059669' : '#dc2626' }}>
                     <option value="Aktif">Aktif</option>
                     <option value="Non-aktif">Nonaktif</option>
                   </select>
                </div>
              )}

              {/* KEWENANGAN LOKASI TUK (Hanya Muncul Jika Role === adminBlk) */}
              {formAccount.role === 'adminBlk' && (
                <div style={{ padding: '24px', backgroundColor: '#f0fdf4', border: '2px dashed #4ade80', borderRadius: '14px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: '800', color: '#166534', marginBottom: '4px' }}>
                        <i className="fas fa-shield-alt" style={{marginRight: '6px'}}></i> Kewenangan Otoritas TUK
                      </label>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d' }}>Instansi asal otomatis menjadi TUK Default.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={() => setIsTukModalOpen(true)} style={{ backgroundColor: '#fff', borderColor: '#4ade80', color: '#166534', fontWeight: '800', padding: '10px 16px', borderRadius: '8px' }}>
                      <i className="fas fa-plus"></i> Atur Lokasi
                    </Button>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {formAccount.tuk_namas?.length > 0 ? formAccount.tuk_namas.map((namaTuk, idx) => (
                      <span key={idx} style={{ background: '#10b981', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
                        {namaTuk} {namaTuk === formAccount.instansi_nama && <small style={{background:'rgba(255,255,255,0.3)', padding:'2px 8px', borderRadius:'10px', fontSize: '0.7rem'}}>Default</small>}
                      </span>
                    )) : (
                      <span style={{ fontSize: '0.85rem', color: '#b91c1c', fontStyle: 'italic', fontWeight: '600', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '8px', width: '100%' }}>Belum ada TUK yang dipilih.</span>
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER BUTTONS */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} style={{padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem'}}>Batal</Button>
                <Button type="submit" variant="primary" icon="save" style={{backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem'}}>
                  {modalMode === 'add' ? 'Simpan Akun Baru' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POP-UP PENCARIAN ASAL INSTANSI                            */}
      {/* ========================================================= */}
      {isInstansiModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '450px', maxWidth: '90%', padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>Pilih Asal Instansi</h3>
            </div>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }}></i>
              <input type="text" placeholder="Cari instansi..." value={searchInstansi} onChange={(e) => setSearchInstansi(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {filteredMasterInstansi.length > 0 ? filteredMasterInstansi.map((ins, idx) => (
                <button key={idx} type="button" onClick={() => handlePilihInstansi(ins)} style={{ textAlign: 'left', padding: '16px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', transition: '0.2s' }}
                  onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
                >{getJejaringName(ins)}</button>
              )) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', margin: '20px 0' }}>Instansi tidak ditemukan.</p>
              )}
            </div>
            <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
               <Button type="button" variant="secondary" onClick={() => setIsInstansiModalOpen(false)} style={{padding: '12px 24px', borderRadius: '10px'}}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POP-UP PENCARIAN & CHECKLIST KEWENANGAN LOKASI TUK        */}
      {/* ========================================================= */}
      {isTukModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '500px', maxWidth: '90%', padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>Otoritas Lokasi TUK</h3>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>Centang TUK untuk diberikan kewenangan.</p>
              </div>
            </div>
            
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }}></i>
              <input type="text" placeholder="Cari nama TUK..." value={searchTuk} onChange={(e) => setSearchTuk(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
              {filteredMasterTuk.map((tuk, idx) => {
                const isChecked = formAccount.tuk_ids.includes(tuk.id);
                const isDefault = tuk.id === formAccount.instansi_id;
                return (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: isChecked ? '2px solid #34d399' : '1px solid #e2e8f0', borderRadius: '10px', background: isChecked ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input type="checkbox" checked={isChecked} onChange={() => handleToggleKewenanganTuk(tuk)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#10b981' }} />
                      <span style={{ fontSize: '1rem', color: isChecked ? '#064e3b' : '#334155', fontWeight: isChecked ? '800' : '600' }}>{getJejaringName(tuk)}</span>
                    </div>
                    {isDefault && <span style={{ fontSize: '0.75rem', backgroundColor: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Default</span>}
                  </label>
                );
              })}
            </div>

            <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
               <Button type="button" variant="primary" onClick={() => setIsTukModalOpen(false)} style={{padding: '12px 28px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem'}}>Selesai Memilih</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardSuperAdmin;