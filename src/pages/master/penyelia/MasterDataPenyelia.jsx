import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import './MasterDataPenyelia.css';

const MasterDataPenyelia = () => {
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const alertTimer = useRef(null);
  
  // State untuk menyimpan list penyelia
  const [penyeliaList, setPenyeliaList] = useState([
    { id: 1, nama: 'Budi Santoso', noReg: 'REG.LSP.001 2021', status: 'Aktif' },
    { id: 2, nama: 'Siti Aminah', noReg: 'REG.LSP.045 2022', status: 'Non-Aktif' }
  ]);

  // State untuk form input (Tambah & Edit)
  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    noReg: '',
    status: 'Aktif'
  });

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  // Fungsi menangani perubahan input pada form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Buka modal untuk Tambah Data
  const handleBukaTambah = () => {
    setFormData({ id: null, nama: '', noReg: '', status: 'Aktif' });
    setIsEditing(false);
    setShowModal(true);
  };

  // Buka modal untuk Edit Data
  const handleBukaEdit = (penyelia) => {
    setFormData(penyelia);
    setIsEditing(true);
    setShowModal(true);
  };

  // Fungsi Hapus
  const handleHapus = (id) => {
    setAlert({
      type: 'delete', 
      title: 'Hapus Data Penyelia?', 
      text: 'Data penyelia yang terhapus tidak dapat dipulihkan.',
      onConfirm: () => {
        setPenyeliaList(penyeliaList.filter(p => p.id !== id));
        showSuccess('Dihapus!', 'Data Penyelia berhasil dihapus dari sistem.');
      },
      onCancel: closeAlert
    });
  };

  // Fungsi Simpan (Menangani Tambah Baru & Simpan Edit)
  const handleSimpan = (e) => {
    e.preventDefault();
    const actionTitle = isEditing ? 'Simpan Perubahan?' : 'Simpan Penyelia Baru?';
    const actionText = isEditing ? 'Data penyelia akan diperbarui.' : 'Pastikan Nomor Registrasi LSP sudah sesuai.';

    setAlert({
      type: 'save', 
      title: actionTitle, 
      text: actionText,
      onConfirm: () => {
        if (isEditing) {
          // Update data yang ada
          setPenyeliaList(penyeliaList.map(p => (p.id === formData.id ? formData : p)));
          showSuccess('Diperbarui!', 'Data Penyelia berhasil diperbarui.');
        } else {
          // Tambah data baru
          const newId = penyeliaList.length > 0 ? Math.max(...penyeliaList.map(p => p.id)) + 1 : 1;
          setPenyeliaList([...penyeliaList, { ...formData, id: newId }]);
          showSuccess('Tersimpan!', 'Penyelia berhasil ditambahkan ke dalam Master Data.');
        }
        setShowModal(false);
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Penyelia</h2>
          <p className="text-muted">Manajemen data Penyelia tersertifikasi.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={handleBukaTambah}>Tambah Penyelia</Button>
      </div>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Penyelia</th>
                <th>No Registrasi (REG LSP)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {penyeliaList.map((penyelia) => (
                <tr key={penyelia.id}>
                  <td><strong>{penyelia.nama}</strong></td>
                  <td><span className="badge info">{penyelia.noReg}</span></td>
                  <td>
                    <span className={`badge ${penyelia.status === 'Aktif' ? 'success' : 'danger'}`}>
                      {penyelia.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="warning" size="sm" icon="edit" onClick={() => handleBukaEdit(penyelia)}>Edit</Button>
                      <Button variant="danger" size="sm" icon="trash-alt" onClick={() => handleHapus(penyelia.id)}>Hapus</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {penyeliaList.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    Belum ada data penyelia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Data Penyelia' : 'Tambah Penyelia Baru'}</h3>
            <form onSubmit={handleSimpan}>
               <div className="form-group">
                 <label>Nama Lengkap</label>
                 <input 
                   type="text" 
                   name="nama"
                   className="form-input" 
                   value={formData.nama}
                   onChange={handleInputChange}
                   required 
                 />
               </div>
               <div className="form-group">
                 <label>No. Registrasi (REG LSP)</label>
                 <input 
                   type="text" 
                   name="noReg"
                   className="form-input" 
                   placeholder="REG.LSP.XXXXX" 
                   value={formData.noReg}
                   onChange={handleInputChange}
                   required 
                 />
               </div>
               <div className="form-group">
                 <label>Status Penyelia</label>
                 <select 
                   name="status"
                   className="form-select" 
                   value={formData.status}
                   onChange={handleInputChange}
                 >
                   <option value="Aktif">Aktif</option>
                   <option value="Non-Aktif">Non-Aktif</option>
                 </select>
               </div>
               <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                 <Button variant="secondary" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                 <Button type="submit" variant="primary" isFullWidth icon="save">
                   {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
                 </Button>
               </div>
            </form>
          </div>
        </div>
      )}
      <AlertPopup {...alert} />
    </div>
  );
};

export default MasterDataPenyelia;