import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import './MasterDataPenyelia.css';

const MasterDataPenyelia = () => {
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const alertTimer = useRef(null);

  const [penyeliaList, setPenyeliaList] = useState([
    { id: 1, nama: 'Budi Santoso', noReg: 'REG.LSP.001 2021', status: 'Aktif' },
    { id: 2, nama: 'Siti Aminah', noReg: 'REG.LSP.045 2022', status: 'Non-Aktif' },
    { id: 3, nama: 'Miftahul Huda', noReg: 'REG.LSP.055 2023', status: 'Aktif' },
    { id: 4, nama: 'Mohamad Andrian A', noReg: 'REG.LSP.066 2023', status: 'Aktif' },
    { id: 5, nama: 'Ramadhan Budi Prasetyo', noReg: 'REG.LSP.077 2024', status: 'Aktif' },
    { id: 6, nama: 'Dewi Ratnasari', noReg: 'REG.LSP.088 2024', status: 'Aktif' },
    { id: 7, nama: 'Agus Setiawan', noReg: 'REG.LSP.099 2025', status: 'Aktif' },
    { id: 8, nama: 'Sri Wahyuni', noReg: 'REG.LSP.100 2025', status: 'Aktif' }
  ]);

  const [formData, setFormData] = useState({ id: null, nama: '', noReg: '', status: 'Aktif' });

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBukaTambah = () => {
    setFormData({ id: null, nama: '', noReg: '', status: 'Aktif' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleBukaEdit = (penyelia) => {
    setFormData(penyelia);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    const actionTitle = isEditing ? 'Simpan Perubahan?' : 'Simpan Penyelia Baru?';
    const actionText = isEditing ? 'Data penyelia akan diperbarui.' : 'Pastikan Nomor Registrasi LSP sudah sesuai.';

    setAlert({
      type: 'save', title: actionTitle, text: actionText,
      onConfirm: () => {
        if (isEditing) {
          setPenyeliaList(penyeliaList.map(p => (p.id === formData.id ? formData : p)));
          showSuccess('Diperbarui!', 'Data Penyelia berhasil diperbarui.');
        } else {
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
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '35%' }}>Nama Penyelia</th>
                <th style={{ width: '25%' }}>No Registrasi (REG LSP)</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {penyeliaList.map((penyelia, index) => (
                <tr key={penyelia.id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td><strong>{penyelia.nama}</strong></td>
                  <td><span className="badge info">{penyelia.noReg}</span></td>
                  
                  {/* STATUS MURNI HANYA MENAMPILKAN BADGE (TIDAK BISA DIKLIK) */}
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${penyelia.status === 'Aktif' ? 'success' : 'danger'}`}>
                      {penyelia.status}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button variant="outline" size="sm" icon="edit" onClick={() => handleBukaEdit(penyelia)} />
                    </div>
                  </td>
                </tr>
              ))}
              {penyeliaList.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada data penyelia.</td></tr>
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
                 <input type="text" name="nama" className="form-input" value={formData.nama} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>No. Registrasi (REG LSP)</label>
                 <input type="text" name="noReg" className="form-input" placeholder="REG.LSP.XXXXX" value={formData.noReg} onChange={handleInputChange} required />
               </div>
               
               <div className="form-group">
                 <label>Status Penyelia</label>
                 <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                   <option value="Aktif">Aktif</option>
                   <option value="Non-Aktif">Non-Aktif</option>
                 </select>
               </div>
               
               <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                 <Button variant="secondary" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                 <Button type="submit" variant="primary" isFullWidth icon="save">{isEditing ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
               </div>
            </form>
          </div>
        </div>
      )}
      
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default MasterDataPenyelia;