import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal'; // <-- BUG FIX IMPORT SEBELUMNYA
import AlertPopup from '../../../components/ui/AlertPopup'; // <-- IMPORT BARU
import './DataTUK.css';

const DataTUK = () => {
  const [tukList, setTukList] = useState([
    { id: 1, kode: 'TUK-001', nama: 'TUK Sewaktu BLK Surabaya', jenis: 'Sewaktu', lokasi: 'Dukuh Menanggal III/29', kapasitas: 20, status: 'Aktif' },
    { id: 2, kode: 'TUK-002', nama: 'TUK Mandiri PT. Bambang Jaya', jenis: 'Mandiri', lokasi: 'Kawasan Industri Rungkut', kapasitas: 15, status: 'Aktif' },
    { id: 3, kode: 'TUK-003', nama: 'TUK Sewaktu BLK Wonojati', jenis: 'Sewaktu', lokasi: 'Kabupaten Malang', kapasitas: 25, status: 'Aktif' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ id: null, kode: '', nama: '', jenis: 'Sewaktu', lokasi: '', kapasitas: '', status: 'Aktif' });

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
    setFormData({ id: null, kode: '', nama: '', jenis: 'Sewaktu', lokasi: '', kapasitas: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    showAlert('delete', 'Hapus TUK', 'Yakin ingin menghapus data TUK ini?', () => {
      setTukList(tukList.filter(item => item.id !== id));
      showAlert('success', 'Berhasil', 'Data TUK telah dihapus.');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showAlert('save', 'Simpan TUK', 'Apakah Anda yakin ingin menyimpan perubahan data TUK ini?', () => {
      if (modalMode === 'create') {
        setTukList([...tukList, { ...formData, id: Date.now() }]);
      } else {
        setTukList(tukList.map(item => item.id === formData.id ? formData : item));
      }
      setIsModalOpen(false);
      showAlert('success', 'Berhasil!', 'Data TUK berhasil disimpan!');
    });
  };

  const filteredTUK = tukList.filter(tuk => tuk.nama.toLowerCase().includes(searchQuery.toLowerCase()) || tuk.kode.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard-content fade-in-content">
      
      {alertConfig.type && (
        <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <h2>Data Tempat Uji Kompetensi (TUK)</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen daftar lokasi penyelenggaraan ujian kompetensi.</p>
        </div>
        <Button variant="primary" icon="map-marker-alt" onClick={handleTambah}>Tambah TUK</Button>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Daftar Lokasi TUK</h3>
          <input type="text" className="form-input" placeholder="Cari TUK / Kode..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '15%' }}>Kode TUK</th>
                <th>Nama TUK & Lokasi</th>
                <th style={{ textAlign: 'center' }}>Jenis</th>
                <th style={{ textAlign: 'center' }}>Kapasitas</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTUK.map((tuk, index) => (
                <tr key={tuk.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                  <td><strong>{tuk.kode}</strong></td>
                  <td><strong>{tuk.nama}</strong><br/><small className="text-muted"><i className="fas fa-map-pin"></i> {tuk.lokasi}</small></td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge warning" style={{ backgroundColor: tuk.jenis === 'Mandiri' ? '#dbeafe' : '#fef3c7', color: tuk.jenis === 'Mandiri' ? '#1e40af' : '#b45309' }}>
                      {tuk.jenis}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}><strong>{tuk.kapasitas}</strong> Peserta</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button variant="outline" icon="edit" onClick={() => handleEdit(tuk)} />
                      <Button variant="danger" icon="trash" onClick={() => handleDelete(tuk.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTUK.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data TUK.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data TUK' : 'Edit Data TUK'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Kode TUK</label>
            <input type="text" name="kode" className="form-input" placeholder="Misal: TUK-001" value={formData.kode} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Tempat Uji (TUK)</label>
            <input type="text" name="nama" className="form-input" value={formData.nama} onChange={handleInputChange} required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Jenis TUK</label>
              <select name="jenis" className="form-select" value={formData.jenis} onChange={handleInputChange}>
                <option value="Sewaktu">Sewaktu</option>
                <option value="Mandiri">Mandiri</option>
                <option value="Tempat Kerja">Tempat Kerja</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kapasitas Peserta (Orang)</label>
              <input type="number" name="kapasitas" className="form-input" min="1" value={formData.kapasitas} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Lokasi / Alamat Lengkap</label>
            <textarea name="lokasi" className="form-input" rows="3" value={formData.lokasi} onChange={handleInputChange} required style={{ resize: 'vertical' }}></textarea>
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

export default DataTUK;