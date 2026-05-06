import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './ManajemenAkun.css';

const ManajemenAkun = () => {
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // KUNCI: Role 'Super Admin' dihapus dari pilihan UI agar hanya bisa diatur via Database
  const availableRoles = ['Admin LSP', 'Staff LSP', 'Admin BLK', 'Asesor'];

  const [users, setUsers] = useState([
    { id: 1, username: 'admin_rafli', roles: ['Super Admin'], status: 'Aktif' }, // Tampil di tabel tapi tidak bisa di-set dari modal
    { id: 2, username: 'hadiid_lsp', roles: ['Admin LSP'], status: 'Aktif' },
    { id: 3, username: 'ade_staff', roles: ['Staff LSP'], status: 'Aktif' },
    { id: 4, username: 'ridho_blk', roles: ['Admin BLK'], status: 'Non Aktif' },
    { id: 5, username: 'johan_multi', roles: ['Asesor', 'Admin BLK'], status: 'Aktif' }
  ]);

  const [formData, setFormData] = useState({ username: '', password: '', roles: ['Staff LSP'], status: 'Aktif' });

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleToggle = (selectedRole) => {
    let currentRoles = [...(formData.roles || [])];
    if (currentRoles.includes(selectedRole)) {
      currentRoles = currentRoles.filter(r => r !== selectedRole); // Uncheck
    } else {
      currentRoles.push(selectedRole); // Check
    }
    setFormData({ ...formData, roles: currentRoles });
  };

  const handleGeneratePassword = (e) => {
    e?.preventDefault();
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let newPass = "";
    for (let i = 0; i < 10; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: newPass });
    setShowPassword(true);
  };

  const handleCopyPassword = (e) => {
    e?.preventDefault();
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      showSuccess('Tersalin!', 'Kata sandi berhasil disalin ke clipboard.');
    } else {
      setAlert({ type: 'warning', title: 'Kosong', text: 'Tidak ada kata sandi untuk disalin.', onCancel: closeAlert });
    }
  };

  const handleEditClick = (user) => {
    setFormData({ username: user.username, password: '', roles: user.roles, status: user.status });
    setEditId(user.id);
    setIsEdit(true);
    setShowPassword(false);
    setShowResetPassword(false);
    setShowModal(true);
  };

  const handleTambahClick = () => {
    setFormData({ username: '', password: '', roles: ['Staff LSP'], status: 'Aktif' });
    setIsEdit(false);
    setEditId(null);
    setShowPassword(false);
    setShowResetPassword(false);
    setShowModal(true);
  };

  const handleSimpanUser = (e) => {
    e.preventDefault();
    if (!formData.username || formData.roles.length === 0 || (!isEdit && !formData.password) || (isEdit && showResetPassword && !formData.password)) {
      setAlert({ type: 'warning', title: 'Data Tidak Lengkap', text: 'Pastikan Username, Password, dan minimal 1 Role telah diisi.', onCancel: closeAlert });
      return;
    }
    
    if (isEdit) {
      setAlert({
        type: 'save', title: 'Simpan Perubahan?', text: 'Data akun pengguna ini akan diperbarui.',
        onConfirm: () => {
          setUsers(users.map(u => u.id === editId ? { ...u, username: formData.username, roles: formData.roles, status: formData.status } : u));
          setShowModal(false);
          showSuccess('Tersimpan!', showResetPassword ? 'Data dan kata sandi baru berhasil diperbarui.' : 'Data pengguna berhasil diperbarui.');
        },
        onCancel: closeAlert
      });
    } else {
      setAlert({
        type: 'save', title: 'Buat Pengguna?', text: 'Akun baru akan dibuat dan diberikan akses ke sistem.',
        onConfirm: () => {
          const newUser = { ...formData, id: Date.now() };
          setUsers([...users, newUser]);
          setShowModal(false);
          showSuccess('Tersimpan!', 'Akun pengguna berhasil ditambahkan.');
        },
        onCancel: closeAlert
      });
    }
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Manajemen Hak Akses & Akun</h2>
          <p className="text-muted">Kelola akun pengguna, ubah multi-role, dan reset kata sandi.</p>
        </div>
        <Button variant="primary" icon="user-plus" onClick={handleTambahClick}>Tambah Pengguna Baru</Button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table akun-table">
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ width: '5%', textAlign: 'center' }}>No</th>
              <th style={{ width: '25%' }}>Username</th>
              <th style={{ width: '35%' }}>Role Akses</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Status Akun</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                <td><strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{user.username}</strong></td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {user.roles.map(r => (
                      <span key={r} className="badge info">{r}</span>
                    ))}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${user.status === 'Aktif' ? 'success' : 'danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Button variant="outline" size="sm" icon="user-edit" onClick={() => handleEditClick(user)}>
                    Kelola Akun
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '500px', maxWidth: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}><i className={`fas ${isEdit ? 'fa-user-cog' : 'fa-user-plus'} text-blue`}></i> {isEdit ? 'Kelola Akun' : 'Tambah Pengguna Baru'}</h3>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8' }} onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSimpanUser}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Username</label>
                <input type="text" className="form-input" name="username" value={formData.username} onChange={handleInputChange} required />
              </div>
              
              {(!isEdit || showResetPassword) ? (
                <div className="form-group fade-in-content" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ margin: 0 }}>{isEdit ? 'Reset Sandi Baru' : 'Kata Sandi'}</label>
                    {isEdit && (
                      <button 
                         type="button" 
                         onClick={() => { setShowResetPassword(false); setFormData({ ...formData, password: '' }); }} 
                         style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <i className="fas fa-times"></i> Batal Reset
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input 
                         type={showPassword ? "text" : "password"} 
                         className="form-input" 
                         name="password" 
                         value={formData.password} 
                         onChange={handleInputChange} 
                         placeholder="Ketik sandi atau acak otomatis"
                        required={!isEdit || showResetPassword}
                      />
                      {formData.password && (
                        <button 
                           type="button" 
                           onClick={() => setShowPassword(!showPassword)} 
                           style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        >
                          <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </button>
                      )}
                    </div>
                    <button type="button" onClick={handleCopyPassword} title="Salin Sandi" style={{ padding: '10px 14px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', color: '#3b82f6', transition: '0.2s' }}>
                      <i className="fas fa-copy"></i>
                    </button>
                    <button type="button" onClick={handleGeneratePassword} title="Buat Sandi Acak" style={{ padding: '10px 14px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #93c5fd', cursor: 'pointer', color: '#2563eb', transition: '0.2s' }}>
                      <i className="fas fa-random"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="form-group fade-in-content" style={{ marginBottom: '20px' }}>
                  <label>Keamanan Akun</label>
                  <Button 
                     variant="outline" 
                     type="button" 
                     isFullWidth 
                     icon="key" 
                     onClick={() => setShowResetPassword(true)} 
                     style={{ borderStyle: 'dashed', backgroundColor: '#f8fafc', color: '#475569', borderColor: '#cbd5e1' }}
                  >
                    Ubah / Reset Kata Sandi
                  </Button>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Pilih Role / Peran (Bisa Lebih Dari Satu)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {availableRoles.map(r => (
                    <label key={r} style={{ 
                       display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', 
                       border: formData.roles?.includes(r) ? '2px solid #3b82f6' : '1px solid #cbd5e1', 
                       backgroundColor: formData.roles?.includes(r) ? '#eff6ff' : '#fff', 
                       borderRadius: '8px', cursor: 'pointer', transition: '0.2s' 
                     }}>
                      <input 
                         type="checkbox" 
                         checked={formData.roles?.includes(r) || false} 
                         onChange={() => handleRoleToggle(r)} 
                         style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }} 
                       />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: formData.roles?.includes(r) ? '#1e3a8a' : '#475569' }}>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isEdit && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Status Akses (Pemblokiran)</label>
                  <select className="form-input" name="status" value={formData.status} onChange={handleInputChange} style={{ fontWeight: '600', color: formData.status === 'Aktif' ? '#059669' : '#dc2626' }}>
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <Button variant="secondary" type="button" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" isFullWidth icon="save">{isEdit ? 'Simpan Perubahan' : 'Buat Akun'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default ManajemenAkun;