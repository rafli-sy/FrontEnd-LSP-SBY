import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal'; // <-- BUG FIX IMPORT SEBELUMNYA
import AlertPopup from '../../../components/ui/AlertPopup'; // <-- IMPORT BARU
import './MasterDataSkema.css';

const MasterDataSkema = () => {
  const [skemaList, setSkemaList] = useState([
    { id: 1, kode: 'SKM-001', nama: 'Pembuatan Roti Dan Kue', jenis: 'Klaster', bidang: 'Pariwisata' },
    { id: 2, kode: 'SKM-002', nama: 'Practical Office Advance', jenis: 'KKNI', bidang: 'TIK' },
    { id: 3, kode: 'SKM-003', nama: 'Teknisi Perawatan AC Residential', jenis: 'Klaster', bidang: 'Refrigerasi' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ id: null, kode: '', nama: '', jenis: 'Klaster', bidang: '' });

  // --- LOGIKA ALERT POPUP ---
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (type === 'success' || type === 'warning' || type === 'info') {
      setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2000);
    }
  };

  const handleConfirmAlert = () => {
    if (alertConfig.action) alertConfig.action();
    setAlertConfig({ type: null, title: '', text: '', action: null });
  };

  const handleCancelAlert = () => {
    setAlertConfig({ type: null, title: '', text: '', action: null });
  };
  // -------------------------

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTambah = () => {
    setModalMode('create');
    setFormData({ id: null, kode: '', nama: '', jenis: 'Klaster', bidang: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    showAlert('delete', 'Hapus Skema', 'Hapus Skema ini? Pastikan skema tidak sedang digunakan dalam ujian berjalan.', () => {
      setSkemaList(skemaList.filter(item => item.id !== id));
      showAlert('success', 'Berhasil', 'Data Skema telah dihapus.');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showAlert('save', 'Simpan Skema', 'Apakah Anda yakin ingin menyimpan perubahan data skema ini?', () => {
      if (modalMode === 'create') {
        const newId = skemaList.length > 0 ? Math.max(...skemaList.map(s => s.id)) + 1 : 1;
        setSkemaList([...skemaList, { ...formData, id: newId }]);
      } else {
        setSkemaList(skemaList.map(item => item.id === formData.id ? formData : item));
      }
      setIsModalOpen(false);
      showAlert('success', 'Berhasil!', 'Data skema berhasil disimpan!');
    });
  };

  const filteredSkema = skemaList.filter(skema => skema.nama.toLowerCase().includes(searchQuery.toLowerCase()) || skema.kode.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard-content fade-in-content">
      
      {alertConfig.type && (
        <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />
      )}

      <div className="dashboard-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Master Data Skema</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen daftar skema uji kompetensi yang aktif di LSP.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={handleTambah}>Tambah Skema</Button>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Daftar Skema Ujian</h3>
          <input type="text" className="form-input" placeholder="Cari Skema / Kode..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '15%' }}>Kode Skema</th>
                <th style={{ width: '40%' }}>Judul Skema Kompetensi</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Jenis</th>
                <th style={{ width: '15%' }}>Bidang</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkema.map((skema, index) => (
                <tr key={skema.id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td><strong>{skema.kode}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{skema.nama}</td>
                  <td style={{ textAlign: 'center' }}><span className="badge warning" style={{ backgroundColor: skema.jenis === 'KKNI' ? '#dbeafe' : '#fef3c7', color: skema.jenis === 'KKNI' ? '#1e40af' : '#b45309' }}>{skema.jenis}</span></td>
                  <td>{skema.bidang}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button variant="outline" icon="edit" onClick={() => handleEdit(skema)} />
                      <Button variant="danger" icon="trash" onClick={() => handleDelete(skema.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data Skema' : 'Edit Skema'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Kode Skema</label>
            <input type="text" name="kode" className="form-input" placeholder="Misal: SKM-001" value={formData.kode} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama / Judul Skema</label>
            <input type="text" name="nama" className="form-input" placeholder="Misal: Pembuatan Roti Dan Kue" value={formData.nama} onChange={handleInputChange} required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
             <div className="form-group">
                <label>Bidang Keahlian</label>
                <select name="bidang" className="form-select" value={formData.bidang} onChange={handleInputChange} required>
                  <option value="">-- Pilih --</option>
                  <option value="Pariwisata">Pariwisata</option>
                  <option value="TIK">TIK</option>
                  <option value="Refrigerasi">Refrigerasi</option>
                  <option value="Otomotif">Otomotif</option>
                  <option value="Manufaktur">Manufaktur</option>
                </select>
             </div>
             <div className="form-group">
                <label>Jenis Skema</label>
                <select name="jenis" className="form-select" value={formData.jenis} onChange={handleInputChange}>
                  <option value="Klaster">Klaster</option>
                  <option value="KKNI">KKNI</option>
                </select>
             </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }} type="button">Batal</Button>
            <Button type="submit" variant="success" icon="save" style={{ flex: 1 }}>Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterDataSkema;