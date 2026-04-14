import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';

const MasterDataAsesor = () => {
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const [showModal, setShowModal] = useState(false);
  
  const [asesorList, setAsesorList] = useState([
    { id: 1, nama: 'Endang Lestari', noReg: 'MET.011411 2019', bidang: 'Garmen', status: 'Aktif' },
    { id: 2, nama: 'Ahmad Fauzi', noReg: 'MET.123456 2020', bidang: 'Pariwisata', status: 'Aktif' }
  ]);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const handleHapus = (id) => {
    setAlert({
      type: 'delete', title: 'Hapus Data Asesor?', text: 'Data asesor yang terhapus tidak dapat dipulihkan.',
      onConfirm: () => {
        setAsesorList(asesorList.filter(a => a.id !== id));
        showSuccess('Dihapus!', 'Data Asesor berhasil dihapus dari sistem.');
      },
      onCancel: closeAlert
    });
  };

  const handleTambah = (e) => {
    e.preventDefault();
    setAlert({
      type: 'save', title: 'Simpan Asesor Baru?', text: 'Pastikan Nomor Registrasi MET sudah sesuai.',
      onConfirm: () => {
        setShowModal(false);
        showSuccess('Tersimpan!', 'Asesor berhasil ditambahkan ke dalam Master Data.');
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div><h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Asesor</h2><p className="text-muted">Manajemen data Asesor tersertifikasi.</p></div>
        <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Tambah Asesor</Button>
      </div>

      <div className="dashboard-card">
        <table className="admin-table">
          <thead>
            <tr><th>Nama Asesor</th><th>No Registrasi (MET)</th><th>Bidang Keahlian</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {asesorList.map((asesor) => (
              <tr key={asesor.id}>
                <td><strong>{asesor.nama}</strong></td>
                <td><span className="badge info">{asesor.noReg}</span></td>
                <td>{asesor.bidang}</td>
                <td><span className="badge success">{asesor.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="warning" size="sm" icon="edit">Edit</Button>
                    <Button variant="danger" size="sm" icon="trash-alt" onClick={() => handleHapus(asesor.id)}>Hapus</Button>
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
            <h3>Tambah Asesor Baru</h3>
            <form onSubmit={handleTambah}>
               <div className="form-group"><label>Nama Lengkap</label><input type="text" className="form-input" required /></div>
               <div className="form-group"><label>No. Registrasi (MET)</label><input type="text" className="form-input" placeholder="MET.XXXXX" required /></div>
               <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                 <Button variant="secondary" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                 <Button type="submit" variant="primary" isFullWidth icon="save">Simpan Data</Button>
               </div>
            </form>
          </div>
        </div>
      )}
      <AlertPopup {...alert} />
    </div>
  );
};
export default MasterDataAsesor;