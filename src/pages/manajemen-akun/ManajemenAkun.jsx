import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AlertPopup from '../../components/ui/AlertPopup';
import './ManajemenAkun.css';

const kejuruanSkemaMap = {
  'Teknologi Informasi': ['Pemrograman Web Full-Stack', 'Desain Grafis Muda', 'Network Administrator'],
  'Pariwisata & Perhotelan': ['Pembuatan Roti Dan Kue', 'Barista (Peracik Kopi)', 'Room Attendant'],
  'Listrik & Elektronika': ['Pemasangan Instalasi Listrik', 'Teknisi Instalasi CCTV', 'Pengoperasian PLC Dasar'],
  'Teknik Manufaktur': ['Welder SMAW 3G', 'Operator Mesin Bubut', 'Pengoperasian Mesin CNC'],
  'Teknik Otomotif': ['Servis Sepeda Motor Injeksi', 'Tune Up Mobil Bensin EFI', 'Teknisi Spooring Balancing'],
  'Refrigerasi & Tata Udara': ['Teknisi Perawatan AC Residential', 'Pemeliharaan AC Sentral', 'Instalasi Pendingin Komersial']
};

const ViewAsesor = () => {
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    nama: 'Mitsuri Kanroji', telepon: '081234567890', kejuruan: 'Teknologi Informasi',
    noReg: 'REG-IT-2025-00192', masaBerlaku: '2027-03-04', skema: ['Pemrograman Web Full-Stack']
  });

  const handleKejuruanChange = (e) => {
    const newKejuruan = e.target.value;
    setFormData({ ...formData, kejuruan: newKejuruan, skema: [] });
  };

  const handleCheckboxChange = (skemaName) => {
    if (formData.skema.includes(skemaName)) {
      setFormData({ ...formData, skema: formData.skema.filter(s => s !== skemaName) });
    } else {
      setFormData({ ...formData, skema: [...formData.skema, skemaName] });
    }
  };

  const closeAlert = () => setAlert(null);
  const showSuccess = (text) => {
    setAlert({ type: 'success', title: 'Sukses!', text });
    setTimeout(() => setAlert(null), 2000);
  };

  const handleSaveProfile = () => {
    setAlert({
      type: 'save',
      title: 'Apakah anda yakin?',
      text: 'Periksa data yang terisi dengan benar.',
      onConfirm: () => showSuccess('Data berhasil disimpan.'),
      onCancel: closeAlert
    });
  };

  const availableSkema = formData.kejuruan ? kejuruanSkemaMap[formData.kejuruan] : [];

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Manajemen Akun Asesor</h2>
        <p className="text-muted" style={{ margin: 0 }}>Kelola profil kompetensi kejuruan dan sertifikat teknis Anda di sini.</p>
      </div>

      <div className="maa-card">
        <h3 className="maa-card-title">Update Data Kejuruan & Sertifikasi</h3>
        <form>
          <div className="maa-form-row">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Nama Lengkap</label>
              <input type="text" className="form-input" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Nomor Telepon (WhatsApp)</label>
              <input type="text" className="form-input" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} />
            </div>
          </div>
          <div className="maa-form-row">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Asal Kejuruan / Bidang Kompetensi</label>
              <select className="form-select" value={formData.kejuruan} onChange={handleKejuruanChange}>
                <option value="">-- Pilih Kejuruan --</option>
                {Object.keys(kejuruanSkemaMap).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Nomor Registrasi BNSP</label>
              <input type="text" className="form-input" value={formData.noReg} onChange={(e) => setFormData({...formData, noReg: e.target.value})} />
            </div>
          </div>
          <div className="maa-form-row">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Masa Berlaku Sertifikat Asesor</label>
              <input type="date" className="form-input" value={formData.masaBerlaku} onChange={(e) => setFormData({...formData, masaBerlaku: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Upload Sertifikat Baru (PDF/JPG)</label>
              <div className="maa-file-wrapper">
                <input type="file" className="form-input maa-file-input" />
                <button type="button" className="maa-btn-lihat"><i className="fas fa-eye"></i> Lihat Sertifikat</button>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px', marginBottom: '15px' }}>
            <label>Pilih Skema Kompetensi yang Dikuasai (Dapat memilih lebih dari satu)</label>
            {formData.kejuruan ? (
              <div className="maa-checkbox-grid">
                {availableSkema.map((skemaName, idx) => (
                  <label key={idx} className={`maa-checkbox-label ${formData.skema.includes(skemaName) ? 'checked' : ''}`}>
                    <div className="maa-checkbox-custom"><i className={`fas fa-check ${formData.skema.includes(skemaName) ? 'visible' : 'hidden'}`}></i></div>
                    <input type="checkbox" className="maa-checkbox-hidden" checked={formData.skema.includes(skemaName)} onChange={() => handleCheckboxChange(skemaName)} />
                    <span>{skemaName}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="maa-empty-skema"><div className="maa-empty-icon"><i className="fas fa-layer-group"></i></div><p>Silakan pilih <strong>Asal Kejuruan</strong> terlebih dahulu.</p></div>
            )}
          </div>
          <button type="button" className="maa-btn-submit" onClick={handleSaveProfile}>
            <i className="fas fa-save" style={{ marginRight: '8px' }}></i> Simpan Data Kejuruan
          </button>
        </form>
      </div>

      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        <h3 className="maa-card-title">Riwayat Frekuensi Menguji</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr><th>Tahun</th><th style={{ textAlign: 'center' }}>Total Penugasan</th><th style={{ textAlign: 'center' }}>Asesi Dinilai</th><th>Skema Paling Sering Diuji</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>2026</strong></td><td style={{ textAlign: 'center' }}><span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>12 Kali</span></td><td style={{ textAlign: 'center' }}>185 Orang</td><td>Pemrograman Web Full-Stack</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <AlertPopup {...alert} />
    </div>
  );
};

const ViewSuperAdmin = () => {
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, nama: 'Bambang Nurianto', email: 'bambang@gmail.com', phone: '08123456789', role: 'Asesor', instansi: 'Pariwisata', status: 'Aktif' },
    { id: 2, nama: 'Admin Wonojati', email: 'wonojati@jatim.go.id', phone: '0341-458951', role: 'Admin BLK', instansi: 'UPT BLK Wonojati', status: 'Aktif' },
  ]);
  const [formData, setFormData] = useState({ nama: '', email: '', phone: '', role: 'Asesor', instansi: '' });

  const closeAlert = () => setAlert(null);
  const showSuccess = (text) => { setAlert({ type: 'success', title: 'Sukses!', text }); setTimeout(() => setAlert(null), 2000); };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTambah = () => { setEditId(null); setFormData({ nama: '', email: '', phone: '', role: 'Asesor', instansi: '' }); setIsModalOpen(true); };
  const handleEdit = (user) => { setFormData(user); setEditId(user.id); setIsModalOpen(true); };

  const handleModalClose = () => {
    setAlert({ type: 'cancel', title: 'Apakah anda yakin ingin batal?', text: 'Semua perubahan akan hilang.', onConfirm: () => { setIsModalOpen(false); closeAlert(); }, onCancel: closeAlert });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert({
      type: 'save', title: 'Apakah anda yakin?', text: 'Periksa data yang terisi dengan benar.',
      onConfirm: () => {
        if (editId) setUsers(users.map(u => u.id === editId ? { ...u, ...formData } : u));
        else setUsers([...users, { id: Date.now(), ...formData, status: 'Aktif' }]);
        setIsModalOpen(false);
        showSuccess('Data berhasil disimpan.');
      },
      onCancel: closeAlert
    });
  };

  const handleDelete = (id) => {
    setAlert({
      type: 'delete', title: 'Hapus pengguna?', text: 'Data pengguna ini akan dinonaktifkan.',
      onConfirm: () => { setUsers(users.filter(u => u.id !== id)); showSuccess('Data berhasil dihapus.'); },
      onCancel: closeAlert
    });
  };

  const getRoleBadge = (role) => {
    switch(role) { case 'Super Admin': return 'badge danger'; case 'Admin LSP': return 'badge success'; case 'Staff LSP': return 'badge warning'; case 'Admin BLK': return 'badge primary'; default: return 'badge info'; }
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div><h2>Manajemen Akun Pengguna</h2><p className="text-muted">Kelola hak akses, tambah akun baru, atau edit data pengguna.</p></div>
        <Button variant="primary" icon="user-plus" onClick={handleTambah}>Tambah Pengguna</Button>
      </div>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead><tr><th>Nama Pengguna</th><th>Kontak Info</th><th>Role / Akses</th><th>Instansi / Asal</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.nama}</strong></td>
                  <td>{user.email}<br/><small className="text-muted">{user.phone}</small></td>
                  <td><span className={getRoleBadge(user.role)}>{user.role}</span></td>
                  <td>{user.instansi}</td>
                  <td><span className={`status-badge ${user.status === 'Aktif' ? 'disetujui' : 'ditolak'}`}>{user.status}</span></td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" icon="edit" onClick={() => handleEdit(user)} />
                    <Button variant="danger" icon="trash" onClick={() => handleDelete(user.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={editId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}><label>Nama Lengkap</label><input type="text" className="form-input" name="nama" value={formData.nama} onChange={handleInputChange} required /></div>
          <div className="form-group" style={{ marginBottom: '15px' }}><label>Email Akses</label><input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} required /></div>
          <div className="form-group" style={{ marginBottom: '15px' }}><label>Nomor Telepon</label><input type="text" className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} required /></div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Role / Akses</label>
            <select className="form-select" name="role" value={formData.role} onChange={handleInputChange}>
              <option value="Super Admin">Super Admin</option><option value="Admin LSP">Admin LSP</option><option value="Staff LSP">Staff LSP</option><option value="Admin BLK">Admin BLK</option><option value="Asesor">Asesor</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}><label>Asal Instansi / Kejuruan</label><input type="text" className="form-input" name="instansi" value={formData.instansi} onChange={handleInputChange} required /></div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={handleModalClose} style={{ flex: 1 }}>Batal</Button>
            <Button type="submit" variant="success" icon="save" style={{ flex: 1 }}>Simpan Data</Button>
          </div>
        </form>
      </Modal>
      <AlertPopup {...alert} />
    </div>
  );
};

const ManajemenAkun = () => {
  const location = useLocation();
  return location.pathname.includes('/asesor') ? <ViewAsesor /> : <ViewSuperAdmin />;
};

export default ManajemenAkun;