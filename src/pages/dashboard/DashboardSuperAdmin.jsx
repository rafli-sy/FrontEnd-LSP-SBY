import React, { useState, useRef, useEffect } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './DashboardSuperAdmin.css';

const DashboardSuperAdmin = () => {
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // KUNCI: Menyesuaikan value dengan enum di backend
  const roleOptions = [
    { label: 'Admin LSP', value: 'adminLsp' },
    { label: 'Staff LSP', value: 'stafLsp' },
    { label: 'Admin BLK', value: 'adminBlk' },
    { label: 'Asesor', value: 'asesor' }
  ];

  const [users, setUsers] = useState([]);
  
  // Tambahan field originalUsername & originalStatus untuk acuan saat Update
  const [formData, setFormData] = useState({ 
    originalUsername: '', 
    originalStatus: '',
    username: '', 
    password: '', 
    role: 'stafLsp', // Default single role
    status: 'Aktif' 
  });

  const token = localStorage.getItem('access_token'); 
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // ==== 1. GET ALL USERS ====
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/superAdmin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const result = await response.json();
      if (response.ok) {
        // Mengambil array data dari struktur paginate() Laravel
        setUsers(result.users?.data || []); 
      } else {
        showError('Gagal Mengambil Data', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const showError = (title, text) => {
    setAlert({ type: 'warning', title, text, onCancel: closeAlert });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      showSuccess('Tersalin!', 'Kata sandi berhasil disalin.');
    }
  };

  const handleEditClick = (user) => {
    setFormData({ 
      originalUsername: user.username, 
      originalStatus: user.status || 'Aktif',
      username: user.username, 
      password: '', 
      role: user.role, 
      status: user.status || 'Aktif' 
    });
    setEditId(user.id);
    setIsEdit(true);
    setShowPassword(false);
    setShowResetPassword(false);
    setShowModal(true);
  };

  const handleTambahClick = () => {
    setFormData({ originalUsername: '', originalStatus: '', username: '', password: '', role: 'stafLsp', status: 'Aktif' });
    setIsEdit(false);
    setEditId(null);
    setShowPassword(false);
    setShowResetPassword(false);
    setShowModal(true);
  };

  // ==== 2. HANDLE SUBMIT (CREATE & UPDATE) ====
  const handleSimpanUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.role || (!isEdit && !formData.password) || (isEdit && showResetPassword && !formData.password)) {
      showError('Data Tidak Lengkap', 'Pastikan Username, Password, dan Role telah diisi.');
      return;
    }

    setIsLoading(true);
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      };

      if (!isEdit) {
        // -- CREATE USER --
        const res = await fetch(`${baseUrl}/api/superAdmin/create-user`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            role: formData.role
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal membuat user.');
        showSuccess('Tersimpan!', 'Akun pengguna berhasil ditambahkan.');

      } else {
        // -- EDIT USER --
        // 1. Update Profile (Jika ada perubahan Username / Role)
        let editPayload = { username: formData.originalUsername };
        let isProfileChanged = false;

        if (formData.username !== formData.originalUsername) {
          editPayload.new_username = formData.username;
          isProfileChanged = true;
        }
        if (formData.role !== formData.originalRole) {
          editPayload.new_role = formData.role;
          isProfileChanged = true;
        }

        if (isProfileChanged) {
          const resEdit = await fetch(`${baseUrl}/api/superAdmin/edit-user`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(editPayload)
          });
          const dataEdit = await resEdit.json();
          if (!resEdit.ok) throw new Error(dataEdit.message);
        }

        // 2. Reset Password (Jika tombol reset ditekan)
        if (showResetPassword && formData.password) {
          const resPass = await fetch(`${baseUrl}/api/superAdmin/reset-password`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
              username: formData.originalUsername, 
              new_password: formData.password,
              new_password_confirmation: formData.password // Wajib untuk laravel 'confirmed'
            })
          });
          const dataPass = await resPass.json();
          if (!resPass.ok) throw new Error(dataPass.message);
        }

        // 3. Update Status (Hanya jika dropdown status diubah di modal)
        if (formData.status !== formData.originalStatus) {
          const resStatus = await fetch(`${baseUrl}/api/superAdmin/user/${editId}/status`, {
            method: 'PATCH',
            headers
          });
          const dataStatus = await resStatus.json();
          if (!resStatus.ok) throw new Error(dataStatus.message);
        }

        showSuccess('Tersimpan!', 'Data pengguna berhasil diperbarui.');
      }

      fetchUsers();
      setShowModal(false);

    } catch (error) {
      showError('Terjadi Kesalahan', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk format tampilan Role
  const formatRole = (roleString) => {
    const roleMapping = {
      'superAdmin': 'Super Admin',
      'adminLsp': 'Admin LSP',
      'stafLsp': 'Staff LSP',
      'adminBlk': 'Admin BLK',
      'asesor': 'Asesor'
    };
    return roleMapping[roleString] || roleString;
  };

  // REVISI: Variabel ini memfilter akun superAdmin agar tidak muncul di tabel
  const displayUsers = users.filter(user => user.role !== 'superAdmin');

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Manajemen Hak Akses & Akun</h2>
          <p className="text-muted">Kelola akun pengguna, ubah role, dan reset kata sandi.</p>
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
            {/* REVISI: Menggunakan displayUsers bukan users */}
            {displayUsers.length > 0 ? displayUsers.map((user, index) => (
              <tr key={user.id}>
                <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                <td><strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{user.username}</strong></td>
                <td><span className="badge info">{formatRole(user.role)}</span></td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${user.status === 'Aktif' ? 'success' : 'danger'}`}>
                    {user.status || 'Aktif'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {/* Pengecekan != superAdmin di sini sekarang bersifat sebagai lapis ganda saja */}
                  {user.role !== 'superAdmin' && (
                    <Button variant="outline" size="sm" icon="user-edit" onClick={() => handleEditClick(user)}>
                      Kelola
                    </Button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Data pengguna tidak ditemukan...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '500px', maxWidth: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}><i className={`fas ${isEdit ? 'fa-user-cog' : 'fa-user-plus'} text-blue`}></i> {isEdit ? 'Kelola Akun' : 'Tambah Pengguna Baru'}</h3>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8' }} onClick={() => setShowModal(false)} disabled={isLoading}><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSimpanUser}>
              {/* Username */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Username</label>
                <input type="text" className="form-input" name="username" value={formData.username} onChange={handleInputChange} required disabled={isLoading} />
              </div>
              
              {/* Password */}
              {(!isEdit || showResetPassword) ? (
                <div className="form-group fade-in-content" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ margin: 0 }}>{isEdit ? 'Reset Sandi Baru' : 'Kata Sandi'}</label>
                    {isEdit && (
                      <button type="button" onClick={() => { setShowResetPassword(false); setFormData({ ...formData, password: '' }); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <i className="fas fa-times"></i> Batal Reset
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input type={showPassword ? "text" : "password"} className="form-input" name="password" value={formData.password} onChange={handleInputChange} placeholder="Minimal 6 Karakter" required={!isEdit || showResetPassword} disabled={isLoading} />
                      {formData.password && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                          <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </button>
                      )}
                    </div>
                    <button type="button" onClick={handleCopyPassword} title="Salin" style={{ padding: '10px 14px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', color: '#3b82f6' }}><i className="fas fa-copy"></i></button>
                    <button type="button" onClick={handleGeneratePassword} title="Acak" style={{ padding: '10px 14px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #93c5fd', cursor: 'pointer', color: '#2563eb' }}><i className="fas fa-random"></i></button>
                  </div>
                </div>
              ) : (
                <div className="form-group fade-in-content" style={{ marginBottom: '20px' }}>
                  <label>Keamanan Akun</label>
                  <Button variant="outline" type="button" isFullWidth icon="key" onClick={() => setShowResetPassword(true)} style={{ borderStyle: 'dashed', backgroundColor: '#f8fafc', color: '#475569', borderColor: '#cbd5e1' }}>
                    Ubah / Reset Kata Sandi
                  </Button>
                </div>
              )}

              {/* Role (Radio Button - Single Select) */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Pilih Role / Peran</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {roleOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: formData.role === opt.value ? '2px solid #3b82f6' : '1px solid #cbd5e1', backgroundColor: formData.role === opt.value ? '#eff6ff' : '#fff', borderRadius: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="role" value={opt.value} checked={formData.role === opt.value} onChange={handleInputChange} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }} disabled={isLoading} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: formData.role === opt.value ? '#1e3a8a' : '#475569' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              {isEdit && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Status Akses (Pemblokiran)</label>
                  <select className="form-input" name="status" value={formData.status} onChange={handleInputChange} style={{ fontWeight: '600', color: formData.status === 'Aktif' ? '#059669' : '#dc2626' }} disabled={isLoading}>
                    <option value="Aktif">Aktif</option>
                    <option value="Non-aktif">Non-aktif</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <Button variant="secondary" type="button" isFullWidth onClick={() => setShowModal(false)} disabled={isLoading}>Batal</Button>
                <Button type="submit" variant="primary" isFullWidth icon={isLoading ? 'spinner' : 'save'} disabled={isLoading}>
                  {isLoading ? 'Memproses...' : (isEdit ? 'Simpan Perubahan' : 'Buat Akun')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default DashboardSuperAdmin;