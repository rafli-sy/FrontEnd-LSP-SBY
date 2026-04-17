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
  
  // Dummy State (Status dihapus)
  const [users, setUsers] = useState([
    { id: 1, username: 'admin_rafli', role: 'Super Admin' },
    { id: 2, username: 'hadiid_lsp', role: 'Admin LSP' },
    { id: 3, username: 'ade_staff', role: 'Staff LSP' },
    { id: 4, username: 'ridho_blk', role: 'Admin BLK' }
  ]);
  
  // FormData (Status dihapus)
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Staff LSP' });

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

  // Fungsi untuk membuka modal Edit Pengguna
  const handleEditClick = (user) => {
    setFormData({ username: user.username, password: '', role: user.role });
    setEditId(user.id);
    setIsEdit(true);
    setShowModal(true);
  };

  // Fungsi untuk membuka modal Tambah Pengguna Baru
  const handleTambahClick = () => {
    setFormData({ username: '', password: '', role: 'Staff LSP' });
    setIsEdit(false);
    setEditId(null);
    setShowModal(true);
  };

  // Fungsi untuk tombol Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setAlert({
      type: 'confirm',
      title: 'Reset Password', 
      text: 'Yakin ingin mereset password pengguna ini ke bawaan sistem?',
      onConfirm: () => {
        setShowModal(false); 
        showSuccess('Berhasil!', 'Password pengguna telah direset.');
      },
      onCancel: closeAlert
    });
  };

  const handleSimpanUser = (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!formData.username || (!isEdit && !formData.password)) {
      setAlert({ type: 'warning', title: 'Data Tidak Lengkap', text: 'Semua field wajib diisi.', onCancel: closeAlert });
      return;
    }
    
    if (isEdit) {
      // Logika Edit User
      setAlert({
        type: 'save', title: 'Simpan Perubahan?', text: 'Data pengguna ini akan diperbarui.',
        onConfirm: () => {
          setUsers(users.map(u => u.id === editId ? { ...u, username: formData.username, role: formData.role } : u));
          setShowModal(false);
          showSuccess('Tersimpan!', 'Data pengguna berhasil diperbarui.');
        },
        onCancel: closeAlert
      });
    } else {
      // Logika Tambah User Baru
      setAlert({
        type: 'save', title: 'Simpan Pengguna?', text: 'Akun baru akan dibuat dan diberikan akses sistem.',
        onConfirm: () => {
          const newUser = { ...formData, id: Date.now() };
          setUsers([...users, newUser]);
          setShowModal(false);
          setFormData({ username: '', password: '', role: 'Staff LSP' });
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
          <p className="text-muted">Kelola akun pengguna dan role untuk masuk ke sistem LSP.</p>
        </div>
        <Button variant="primary" icon="user-plus" onClick={handleTambahClick}>Tambah Pengguna Baru</Button>
      </div>

      <div className="dashboard-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role Akses</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td><span className="badge info">{user.role}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <Button variant="warning" size="sm" icon="edit" onClick={() => handleEditClick(user)}>Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}><i className={`fas ${isEdit ? 'fa-user-edit' : 'fa-user-shield'} text-blue`}></i> {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSimpanUser}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-input" name="username" value={formData.username} onChange={handleInputChange} />
              </div>
              
              {!isEdit && (
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-input" name="password" value={formData.password} onChange={handleInputChange} />
                </div>
              )}

              <div className="form-group">
                <label>Role</label>
                <select className="form-input" name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin LSP">Admin LSP</option>
                  <option value="Staff LSP">Staff LSP</option>
                  <option value="Admin BLK">Admin BLK</option>
                  <option value="Asesor">Asesor</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: isEdit ? 'flex-end' : 'space-between' }}>
                {isEdit ? (
                  <>
                    <Button variant="secondary" icon="edit" onClick={handleResetPassword}>Reset Password</Button>
                    <Button type="submit" variant="primary" icon="lock">Simpan Data</Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                    <Button type="submit" variant="primary" isFullWidth icon="save">Simpan Akun</Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <AlertPopup {...alert} />
    </div>
  );
};

export default ManajemenAkun;