import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal'; 
import AlertPopup from '../../../components/ui/AlertPopup'; 
import Pagination from '../../../components/ui/Pagination';
import './DataTUK.css';

const DataTUK = () => {
  const [tukList, setTukList] = useState([
    { id: 1, kode: 'TUK-001', institusi: 'TUK Sewaktu BLK Surabaya', alamat: 'Dukuh Menanggal III/29', kota: 'Surabaya', status: 'Aktif' },
    { id: 2, kode: 'TUK-002', institusi: 'TUK Mandiri PT. Bambang Jaya', alamat: 'Kawasan Industri Rungkut', kota: 'Surabaya', status: 'Aktif' },
    { id: 3, kode: 'TUK-003', institusi: 'TUK Sewaktu BLK Wonojati', alamat: 'Jl. Raya Singosari', kota: 'Malang', status: 'Non-Aktif' },
    { id: 4, kode: 'TUK-004', institusi: 'TUK Sewaktu BLK Singosari', alamat: 'Jl. Raya Randuagung', kota: 'Malang', status: 'Aktif' },
    { id: 5, kode: 'TUK-005', institusi: 'TUK Mandiri PT ABC', alamat: 'Kawasan SIER', kota: 'Surabaya', status: 'Aktif' },
    { id: 6, kode: 'TUK-006', institusi: 'TUK Sewaktu BLK Jember', alamat: 'Jl. Letjen Panjaitan', kota: 'Jember', status: 'Aktif' },
    { id: 7, kode: 'TUK-007', institusi: 'TUK Mandiri LKP Mutiara', alamat: 'Jl. Pemuda No 10', kota: 'Madiun', status: 'Aktif' },
    { id: 8, kode: 'TUK-008', institusi: 'TUK Sewaktu BLK Kediri', alamat: 'Jl. Mayor Bismo', kota: 'Kediri', status: 'Aktif' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ id: null, kode: '', institusi: '', alamat: '', kota: '', status: 'Aktif' });
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleCancelAlert = () => setAlertConfig({ type: null, title: '', text: '', action: null });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTambah = () => {
    setModalMode('create');
    setFormData({ id: null, kode: '', institusi: '', alamat: '', kota: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showAlert('save', 'Simpan TUK', 'Apakah Anda yakin ingin menyimpan perubahan data TUK ini?', () => {
      if (modalMode === 'create') {
        const newId = tukList.length > 0 ? Math.max(...tukList.map(t => t.id)) + 1 : 1;
        setTukList([...tukList, { ...formData, id: newId }]);
      } else {
        setTukList(tukList.map(item => item.id === formData.id ? formData : item));
      }
      setIsModalOpen(false);
      showAlert('success', 'Berhasil!', 'Data TUK berhasil disimpan!');
    });
  };

  const filteredTUK = tukList.filter(tuk => tuk.institusi.toLowerCase().includes(searchQuery.toLowerCase()) || tuk.kode.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredTUK.length / itemsPerPage);
  const paginatedTUK = filteredTUK.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

      <div className="dashboard-card" style={{ padding: 0 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <input type="text" className="form-input" placeholder="Cari Institusi TUK / Kode..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '15%' }}>Kode TUK</th>
                <th style={{ width: '30%' }}>Nama Institusi</th>
                <th style={{ width: '25%' }}>Alamat & Kota</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTUK.map((tuk, index) => (
                <tr key={tuk.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong>{tuk.kode}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{tuk.institusi}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>{tuk.alamat}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3b82f6' }}>Kota {tuk.kota}</div>
                  </td>
                  
                  {/* STATUS DIKEMBALIKAN JADI BADGE BIASA (EDIT VIA FORM) */}
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${tuk.status === 'Aktif' ? 'success' : 'danger'}`}>
                      {tuk.status}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button variant="outline" icon="edit" onClick={() => handleEdit(tuk)} />
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTUK.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data TUK.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredTUK.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data TUK' : 'Edit Data TUK'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Kode TUK</label>
            <input type="text" name="kode" className="form-input" placeholder="Misal: TUK-001" value={formData.kode} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Institusi TUK</label>
            <input type="text" name="institusi" className="form-input" placeholder="Contoh: TUK Sewaktu BLK Surabaya" value={formData.institusi} onChange={handleInputChange} required />
          </div>
          
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Kota</label>
              <input type="text" name="kota" className="form-input" placeholder="Contoh: Surabaya" value={formData.kota} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Status TUK</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                <option value="Aktif">Aktif</option>
                <option value="Non-Aktif">Non-Aktif</option>
              </select>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Alamat Lengkap</label>
            <textarea name="alamat" className="form-input" rows="3" value={formData.alamat} onChange={handleInputChange} required style={{ resize: 'vertical' }}></textarea>
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