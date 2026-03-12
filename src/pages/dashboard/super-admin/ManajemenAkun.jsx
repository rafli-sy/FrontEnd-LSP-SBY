import React, { useState } from 'react';

const ManajemenAkun = () => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State Simulasi Data
  const [users, setUsers] = useState([
    { id: 1, nama: 'Bambang Nurianto', email: 'bambang@gmail.com', phone: '08123456789', role: 'Asesor', instansi: 'Pariwisata', status: 'Aktif' },
    { id: 2, nama: 'Admin Wonojati', email: 'wonojati@jatim.go.id', phone: '0341-458951', role: 'Admin BLK', instansi: 'UPT BLK Wonojati', status: 'Aktif' },
    { id: 3, nama: 'Kartika Nova', email: 'kartika.lsp@gmail.com', phone: '08997766554', role: 'Staff LSP', instansi: 'LSP BLK Surabaya', status: 'Suspend' },
  ]);

  const [formData, setFormData] = useState({ nama: '', email: '', phone: '', role: 'Asesor', instansi: '' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...u, ...formData } : u));
    } else {
      setUsers([...users, { id: Date.now(), ...formData, status: 'Aktif' }]);
    }
    setShowForm(false);
    setEditId(null);
    setFormData({ nama: '', email: '', phone: '', role: 'Asesor', instansi: '' });
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menonaktifkan akun ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Super Admin': return 'badge danger';
      case 'Admin LSP': return 'badge success';
      case 'Staff LSP': return 'badge warning';
      case 'Admin BLK': return 'badge primary';
      default: return 'badge info';
    }
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Manajemen Akun Pengguna</h2>
          <p className="text-muted">Kelola hak akses, tambah akun baru, atau edit data pengguna.</p>
        </div>
        <button className="btn-add" onClick={() => { setShowForm(!showForm); setEditId(null); setFormData({ nama: '', email: '', phone: '', role: 'Asesor', instansi: '' }); }}>
          <i className={`fas ${showForm ? 'fa-times' : 'fa-user-plus'}`}></i> {showForm ? 'Batal' : 'Tambah Pengguna'}
        </button>
      </div>

      {showForm && (
        <div className="dashboard-card fade-in-content" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3>{editId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" className="form-input" name="nama" value={formData.nama} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email Akses</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input type="text" className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Role / Akses</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin LSP">Admin LSP</option>
                  <option value="Staff LSP">Staff LSP</option>
                  <option value="Admin BLK">Admin BLK</option>
                  <option value="Asesor">Asesor</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Asal Instansi / Kejuruan</label>
              <input type="text" className="form-input" name="instansi" value={formData.instansi} onChange={handleInputChange} required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-add"><i className="fas fa-save"></i> Simpan Data</button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Pengguna</th>
                <th>Kontak Info</th>
                <th>Role / Akses</th>
                <th>Instansi / Asal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.nama}</strong></td>
                  <td>{user.email}<br/><small className="text-muted">{user.phone}</small></td>
                  <td><span className={getRoleBadge(user.role)}>{user.role}</span></td>
                  <td>{user.instansi}</td>
                  <td><span className={`status-badge ${user.status === 'Aktif' ? 'disetujui' : 'ditolak'}`}>{user.status}</span></td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(user)} className="btn-outline btn-sm" title="Edit Akun"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(user.id)} className="btn-outline btn-sm" title="Hapus Akun" style={{ color: '#dc3545', borderColor: '#dc3545' }}><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data pengguna.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManajemenAkun;