import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';
import './DashboardSuperAdmin.css';

const masterTUK = [
  'UPT BLK Surabaya', 'UPT BLK Madiun', 'UPT BLK Kediri', 'UPT BLK Jember', 
  'UPT BLK Singosari', 'UPT BLK Malang', 'LKP Mutiara', 'PT ABC Motor'
];

const DashboardSuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Semua Role');
  const [filterStatus, setFilterStatus] = useState('Aktif'); 
  const [alertConfig, setAlertConfig] = useState(null);

  // --- STATE MODAL UTAMA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const [formAccount, setFormAccount] = useState({
    username: '',
    password: '',
    instansi: '',
    role: 'Admin LSP',
    status: 'Aktif',
    kewenanganTUK: []
  });

  // --- STATE SUB-MODAL PENCARIAN ---
  const [isInstansiModalOpen, setIsInstansiModalOpen] = useState(false);
  const [searchInstansi, setSearchInstansi] = useState('');
  
  const [isTukModalOpen, setIsTukModalOpen] = useState(false);
  const [searchTuk, setSearchTuk] = useState('');

  // DATA SOURCE UTAMA
  const [users, setUsers] = useState([
    { id: 1, username: 'admin_utama', instansi: 'LSP BLK Surabaya', role: 'Admin LSP', status: 'Aktif', kewenanganTUK: [] },
    { id: 2, username: 'rafli_blk', instansi: 'UPT BLK Surabaya', role: 'Admin BLK', status: 'Aktif', kewenanganTUK: ['UPT BLK Surabaya'] },
    { id: 3, username: 'budi_asesor', instansi: 'Independen', role: 'Asesor', status: 'Nonaktif', kewenanganTUK: [] },
    { id: 4, username: 'siti_staff', instansi: 'LSP BLK Surabaya', role: 'Staff LSP', status: 'Aktif', kewenanganTUK: [] },
    { id: 5, username: 'andi_wijaya', instansi: 'UPT BLK Madiun', role: 'Admin BLK', status: 'Aktif', kewenanganTUK: ['UPT BLK Madiun', 'UPT BLK Kediri'] },
    { id: 6, username: 'rina_rose', instansi: 'Independen', role: 'Asesor', status: 'Aktif', kewenanganTUK: [] },
  ]);

  // --- LOGIKA FILTER & PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = users.filter(user => {
    const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Semua Role' || user.role === filterRole;
    const matchStatus = filterStatus === 'Semua Status' || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- HANDLERS MODAL UTAMA ---
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormAccount({ username: '', password: '', instansi: '', role: 'Admin LSP', status: 'Aktif', kewenanganTUK: [] });
    setIsResettingPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUserId(user.id);
    setFormAccount({
      username: user.username,
      password: '', 
      instansi: user.instansi,
      role: user.role,
      status: user.status,
      kewenanganTUK: user.kewenanganTUK || []
    });
    setIsResettingPassword(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      if (value === 'Admin BLK' && formAccount.instansi) {
        setFormAccount(prev => ({ ...prev, role: value, kewenanganTUK: masterTUK.includes(prev.instansi) ? [prev.instansi] : [] }));
      } else {
        setFormAccount(prev => ({ ...prev, role: value, kewenanganTUK: [] }));
      }
    } else {
      setFormAccount({ ...formAccount, [name]: value });
    }
  };

  // --- KUMPULAN LOGIKA KATA SANDI ---
  const handleInitiateResetPassword = () => {
    // LANGSUNG BUKA FORM INPUT TANPA POP-UP PERINGATAN
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
  const handlePilihInstansi = (instansi) => {
    setFormAccount(prev => {
      const updated = { ...prev, instansi };
      if (prev.role === 'Admin BLK' && masterTUK.includes(instansi)) {
        if (!prev.kewenanganTUK.includes(instansi)) {
          updated.kewenanganTUK = [...prev.kewenanganTUK, instansi];
        }
      }
      return updated;
    });
    setIsInstansiModalOpen(false);
  };

  const handleToggleKewenanganTuk = (tuk) => {
    setFormAccount(prev => {
      const isExist = prev.kewenanganTUK.includes(tuk);
      const updatedTuk = isExist ? prev.kewenanganTUK.filter(t => t !== tuk) : [...prev.kewenanganTUK, tuk];
      return { ...prev, kewenanganTUK: updatedTuk };
    });
  };

  // --- SUBMIT FORM ---
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (!formAccount.username || !formAccount.instansi || !formAccount.role) {
      setAlertConfig({ type: 'warning', title: 'Data Belum Lengkap', text: 'Username, Asal Instansi, dan Role wajib diisi.' });
      setTimeout(() => setAlertConfig(null), 2500);
      return;
    }

    if ((modalMode === 'add' || isResettingPassword) && !formAccount.password) {
      setAlertConfig({ type: 'warning', title: 'Sandi Wajib', text: 'Kata sandi wajib diisi sebelum menyimpan.' });
      setTimeout(() => setAlertConfig(null), 2500);
      return;
    }

    // POP-UP KONFIRMASI SIMPAN
    setAlertConfig({
      type: 'save',
      title: modalMode === 'add' ? 'Simpan Akun Baru?' : 'Simpan Perubahan?',
      text: 'Apakah Anda yakin ingin menyimpan pengaturan akun ini?',
      onConfirm: () => {
        if (modalMode === 'add') {
          const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username: formAccount.username,
            instansi: formAccount.instansi,
            role: formAccount.role,
            status: formAccount.status,
            kewenanganTUK: formAccount.role === 'Admin BLK' ? formAccount.kewenanganTUK : []
          };
          setUsers([newUser, ...users]);
        } else {
          setUsers(users.map(u => u.id === selectedUserId ? { 
            ...u, 
            username: formAccount.username, 
            instansi: formAccount.instansi, 
            role: formAccount.role,
            status: formAccount.status,
            kewenanganTUK: formAccount.role === 'Admin BLK' ? formAccount.kewenanganTUK : []
          } : u));
        }
        
        setIsModalOpen(false); 
        setAlertConfig({ type: 'success', title: 'Berhasil Disimpan', text: 'Data akun pengguna berhasil diperbarui.' });
        setTimeout(() => setAlertConfig(null), 2500);
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const filteredMasterInstansi = masterTUK.filter(t => t.toLowerCase().includes(searchInstansi.toLowerCase()));
  const filteredMasterTuk = masterTUK.filter(t => t.toLowerCase().includes(searchTuk.toLowerCase()));

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
            <option value="Admin LSP">Admin LSP</option>
            <option value="Staff LSP">Staff LSP</option>
            <option value="Admin BLK">Admin BLK</option>
            <option value="Asesor">Asesor</option>
          </select>

          <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            <option value="Semua Status">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>

          <Button variant="primary" icon="user-plus" onClick={handleOpenAddModal} style={{fontWeight: 'bold', padding: '12px 20px', borderRadius: '8px'}}>Tambah Akun</Button>
        </div>

        {/* --- TABEL UTAMA --- */}
        <div className="table-responsive" style={{ padding: '20px' }}>
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
                    <td style={{ color: '#475569', fontWeight: '500', padding: '15px' }}>{user.instansi}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', border: '1px solid #bfdbfe' }}>{user.role}</span>
                      {user.role === 'Admin BLK' && (
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>
                          <i className="fas fa-building"></i> {user.kewenanganTUK?.length || 0} TUK Dikelola
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <span className={`badge ${user.status === 'Aktif' ? 'success' : 'danger'}`} style={{padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'}}>{user.status}</span>
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
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>&times;</button>
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
                        <input type="text" name="password" value={formAccount.password} onChange={handleInputChange} placeholder={modalMode === 'add' ? "Ketik sandi..." : "Ketik sandi baru..."} style={{ flex: 1, padding: '14px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none', background: '#f8fafc', fontSize: '0.95rem', color: '#0f172a' }} required />
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
                    <option value="Admin LSP">Admin LSP</option>
                    <option value="Staff LSP">Staff LSP</option>
                    <option value="Admin BLK">Admin BLK</option>
                    <option value="Asesor">Asesor</option>
                  </select>
                </div>

                {/* 4. Asal Instansi */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Asal Instansi <span style={{color: 'red'}}>*</span>
                  </label>
                  <Button type="button" variant="outline" isFullWidth onClick={() => setIsInstansiModalOpen(true)} style={{ justifyContent: 'space-between', backgroundColor: '#fff', textAlign: 'left', borderColor: '#cbd5e1', color: formAccount.instansi ? '#0f172a' : '#94a3b8', padding: '14px 16px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: formAccount.instansi ? '600' : 'normal' }}>
                    <span>{formAccount.instansi || 'Cari Instansi...'}</span><i className="fas fa-search text-muted"></i>
                  </Button>
                </div>
                
              </div>

              {/* BARIS STATUS AKUN (HANYA EDIT) */}
              {modalMode === 'edit' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}><i className="fas fa-power-off" style={{marginRight: '8px'}}></i> Status Akun:</label>
                   <select name="status" value={formAccount.status} onChange={handleInputChange} style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', color: formAccount.status === 'Aktif' ? '#059669' : '#dc2626' }}>
                     <option value="Aktif">Aktif</option>
                     <option value="Nonaktif">Nonaktif</option>
                   </select>
                </div>
              )}

              {/* KEWENANGAN LOKASI TUK (Hanya Muncul Jika Role === Admin BLK) */}
              {formAccount.role === 'Admin BLK' && (
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
                    {formAccount.kewenanganTUK?.length > 0 ? formAccount.kewenanganTUK.map((t, idx) => (
                      <span key={idx} style={{ background: '#10b981', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
                        {t} {t === formAccount.instansi && <small style={{background:'rgba(255,255,255,0.3)', padding:'2px 8px', borderRadius:'10px', fontSize: '0.7rem'}}>Default</small>}
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
                >{ins}</button>
              )) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', margin: '20px 0' }}>Instansi tidak ditemukan.</p>
              )}
            </div>
            <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
               <Button variant="secondary" onClick={() => setIsInstansiModalOpen(false)} style={{padding: '12px 24px', borderRadius: '10px'}}>Tutup</Button>
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
                const isChecked = formAccount.kewenanganTUK.includes(tuk);
                const isDefault = tuk === formAccount.instansi;
                return (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: isChecked ? '2px solid #34d399' : '1px solid #e2e8f0', borderRadius: '10px', background: isChecked ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input type="checkbox" checked={isChecked} onChange={() => handleToggleKewenanganTuk(tuk)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#10b981' }} />
                      <span style={{ fontSize: '1rem', color: isChecked ? '#064e3b' : '#334155', fontWeight: isChecked ? '800' : '600' }}>{tuk}</span>
                    </div>
                    {isDefault && <span style={{ fontSize: '0.75rem', backgroundColor: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Default</span>}
                  </label>
                );
              })}
            </div>

            <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
               <Button variant="primary" onClick={() => setIsTukModalOpen(false)} style={{padding: '12px 28px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem'}}>Selesai Memilih</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardSuperAdmin;