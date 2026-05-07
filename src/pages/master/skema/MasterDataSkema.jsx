import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AlertPopup from '../../../components/ui/AlertPopup';
import Pagination from '../../../components/ui/Pagination';
import './MasterDataSkema.css';

const MasterDataSkema = () => {
  const [skemaList, setSkemaList] = useState([
    { id: 1, kode: 'SKM-001', nama: 'Pembuatan Roti Dan Kue', jenis: 'Klaster', bidang: 'Pariwisata', status: 'Aktif' },
    { id: 2, kode: 'SKM-002', nama: 'Practical Office Advance', jenis: 'KKNI', bidang: 'TIK', status: 'Aktif' },
    { id: 3, kode: 'SKM-003', nama: 'Teknisi Perawatan AC Residential', jenis: 'Klaster', bidang: 'Refrigerasi', status: 'Non-Aktif' },
    { id: 4, kode: 'SKM-004', nama: 'Barista', jenis: 'Klaster', bidang: 'Pariwisata', status: 'Aktif' },
    { id: 5, kode: 'SKM-005', nama: 'Desain Grafis Muda', jenis: 'KKNI', bidang: 'TIK', status: 'Aktif' },
    { id: 6, kode: 'SKM-006', nama: 'Teknisi Kendaraan Ringan', jenis: 'Klaster', bidang: 'Otomotif', status: 'Aktif' },
    { id: 7, kode: 'SKM-007', nama: 'Budidaya Hidroponik', jenis: 'Klaster', bidang: 'Pertanian', status: 'Aktif' },
    { id: 8, kode: 'SKM-008', nama: 'Tata Rias Rambut', jenis: 'Klaster', bidang: 'Kecantikan', status: 'Aktif' },
    { id: 9, kode: 'SKM-009', nama: 'Menjahit Pakaian Sesuai Style', jenis: 'Klaster', bidang: 'Garmen', status: 'Aktif' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ id: null, kode: '', nama: '', jenis: 'Klaster', bidang: '', status: 'Aktif' });
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
    setFormData({ id: null, kode: '', nama: '', jenis: 'Klaster', bidang: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData(data);
    setIsModalOpen(true);
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
  const totalPages = Math.ceil(filteredSkema.length / itemsPerPage);
  const paginatedSkema = filteredSkema.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

      <div className="dashboard-card" style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, alignSelf: 'center' }}>Daftar Skema Ujian</h3>
          <input type="text" className="form-input" placeholder="Cari Skema / Kode..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '15%' }}>Kode Skema</th>
                <th style={{ width: '35%' }}>Judul Skema Kompetensi</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Jenis</th>
                <th style={{ width: '10%' }}>Bidang</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSkema.map((skema, index) => (
                <tr key={skema.id}>
                  <td style={{ textAlign: 'center' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong>{skema.kode}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{skema.nama}</td>
                  <td style={{ textAlign: 'center' }}><span className="badge warning" style={{ backgroundColor: skema.jenis === 'KKNI' ? '#dbeafe' : '#fef3c7', color: skema.jenis === 'KKNI' ? '#1e40af' : '#b45309' }}>{skema.jenis}</span></td>
                  <td>{skema.bidang}</td>
                  
                  {/* STATUS DIKEMBALIKAN JADI BADGE BIASA (EDIT VIA FORM) */}
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${skema.status === 'Aktif' ? 'success' : 'danger'}`}>
                      {skema.status}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button variant="outline" icon="edit" onClick={() => handleEdit(skema)} />
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedSkema.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Tidak ada data Skema.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredSkema.length} itemsPerPage={itemsPerPage} />
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
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
             <div className="form-group">
                <label>Bidang Keahlian</label>
                <select name="bidang" className="form-select" value={formData.bidang} onChange={handleInputChange} required>
                  <option value="">-- Pilih --</option>
                  <option value="Pariwisata">Pariwisata</option>
                  <option value="TIK">TIK</option>
                  <option value="Refrigerasi">Refrigerasi</option>
                  <option value="Otomotif">Otomotif</option>
                  <option value="Manufaktur">Manufaktur</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Kecantikan">Kecantikan</option>
                  <option value="Garmen">Garmen</option>
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
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Status Skema</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
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