import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './ManajemenAkun.css';

const ManajemenAkun = () => {
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const [showModal, setShowModal] = useState(false);
  
  // Dummy State
  const [users, setUsers] = useState([
    { id: 1, nama: 'Moch. Nur Rafli Hikmal Putra', username: 'admin_rafli', role: 'Super Admin', status: 'Aktif' },
    { id: 2, nama: 'Hadid Yulian', username: 'hadid_lsp', role: 'Admin LSP', status: 'Aktif' },
    { id: 3, nama: 'Ade Ninda', username: 'ninda_staff', role: 'Staff LSP', status: 'Aktif' },
    { id: 4, nama: 'Ali Ridho', username: 'ali_blk', role: 'Admin BLK', status: 'Nonaktif' }
  ]);
  const [formData, setFormData] = useState({ nama: '', username: '', role: 'Staff LSP', status: 'Aktif' });

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

  const handleSimpanUser = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.username) {
      setAlert({ type: 'warning', title: 'Data Tidak Lengkap', text: 'Nama dan Username wajib diisi.', onCancel: closeAlert });
      return;
    }
    
    setAlert({
      type: 'save', title: 'Simpan Pengguna?', text: 'Akun baru akan dibuat dan diberikan akses sistem.',
      onConfirm: () => {
        const newUser = { ...formData, id: Date.now() };
        setUsers([...users, newUser]);
        setShowModal(false);
        setFormData({ nama: '', username: '', role: 'Staff LSP', status: 'Aktif' });
        showSuccess('Tersimpan!', 'Akun pengguna berhasil ditambahkan.');
      },
      onCancel: closeAlert
    });
  };

  const handleHapus = (id) => {
    setAlert({
      type: 'delete', title: 'Hapus Akun?', text: 'Pengguna tidak akan bisa lagi mengakses sistem ini.',
      onConfirm: () => {
        setUsers(users.filter(u => u.id !== id));
        showSuccess('Terhapus!', 'Akun pengguna berhasil dihapus dari sistem.');
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Manajemen Hak Akses & Akun</h2>
          <p className="text-muted">Kelola akun pengguna dan role untuk masuk ke sistem LSP.</p>
        </div>
        <Button variant="primary" icon="user-plus" onClick={() => setShowModal(true)}>Tambah Pengguna Baru</Button>
      </div>

      <div className="dashboard-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>Username</th>
              <th>Role Akses</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.nama}</strong></td>
                <td>{user.username}</td>
                <td><span className="badge info">{user.role}</span></td>
                <td><span className={`badge ${user.status === 'Aktif' ? 'success' : 'danger'}`}>{user.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="warning" size="sm" icon="edit" onClick={() => setAlert({ type: 'warning', title: 'Info', text: 'Fitur edit sedang dikembangkan', onCancel: closeAlert })}>Edit</Button>
                    <Button variant="danger" size="sm" icon="trash-alt" onClick={() => handleHapus(user.id)}>Hapus</Button>
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
            <h3><i className="fas fa-user-shield text-blue"></i> Tambah Pengguna</h3>
            <form onSubmit={handleSimpanUser}>
              <div className="form-group"><label>Nama Lengkap</label><input type="text" className="form-input" name="nama" value={formData.nama} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Username Default</label><input type="text" className="form-input" name="username" value={formData.username} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Role Akses Sistem</label>
                <select className="form-input" name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="Admin LSP">Admin LSP</option><option value="Staff LSP">Staff LSP</option><option value="Admin BLK">Admin BLK</option><option value="Asesor">Asesor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button variant="secondary" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" isFullWidth icon="save">Simpan Akun</Button>
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