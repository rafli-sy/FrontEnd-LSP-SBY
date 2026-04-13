import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/AlertPopup';
import './MasterDataAsesor.css';

const MasterDataAsesor = () => {
  const [asesorList, setAsesorList] = useState([
    { id: 1, nik: '3578012345670001', nama: 'Kartika Nova Wahyuni', noReg: 'MET.000.001234 2020', kontak: '08123456789', skema: 'Pembuatan Roti Dan Kue', status: 'Aktif' },
    { id: 2, nik: '3578012345670002', nama: 'Miftahul Huda', noReg: 'MET.000.005678 2021', kontak: '08998877665', skema: 'Teknisi Perawatan AC Residential', status: 'Aktif' },
    { id: 3, nik: '3578012345670003', nama: 'Bambang Supriyanto', noReg: 'MET.000.009999 2019', kontak: '08554433221', skema: 'Practical Office Advance', status: 'Tidak Aktif' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ id: null, nik: '', nama: '', noReg: '', kontak: '', skema: '', status: 'Aktif' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTambah = () => {
    setModalMode('create');
    setFormData({ id: null, nik: '', nama: '', noReg: '', kontak: '', skema: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus / menonaktifkan asesor ini?')) {
      setAsesorList(asesorList.filter(item => item.id !== id));
    }
  };

  // POP-UP KONFIRMASI SIMPAN
  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Apakah Anda yakin ingin menyimpan perubahan data asesor ini?')) {
      if (modalMode === 'create') {
        setAsesorList([...asesorList, { ...formData, id: Date.now() }]);
      } else {
        setAsesorList(asesorList.map(item => item.id === formData.id ? formData : item));
      }
      setIsModalOpen(false);
      alert('Data asesor berhasil disimpan!');
    }
  };

  const filteredAsesor = asesorList.filter(asesor => 
    asesor.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asesor.skema.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <h2>Master Data Asesor</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen data profil dan lisensi skema Asesor Kompetensi.</p>
        </div>
        <Button variant="primary" icon="user-plus" onClick={handleTambah}>Tambah Asesor</Button>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Daftar Asesor LSP BLK</h3>
          <input type="text" className="form-input" placeholder="Cari Nama / Skema..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th>Nama Lengkap & NIK</th>
                <th>No. Registrasi / Kontak</th>
                <th>Lisensi Skema</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAsesor.map((asesor, index) => (
                <tr key={asesor.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                  <td><strong>{asesor.nama}</strong><br/><small className="text-muted">NIK: {asesor.nik}</small></td>
                  <td>{asesor.noReg}<br/><small className="text-muted"><i className="fas fa-phone-alt"></i> {asesor.kontak}</small></td>
                  <td>{asesor.skema}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${asesor.status === 'Aktif' ? 'success' : 'danger'}`}>
                      {asesor.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Button variant="outline" icon="edit" onClick={() => handleEdit(asesor)} />
                      <Button variant="danger" icon="trash" onClick={() => handleDelete(asesor.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAsesor.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data asesor.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data Asesor' : 'Edit Data Asesor'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Lengkap (Sesuai KTP)</label>
            <input type="text" name="nama" className="form-input" value={formData.nama} onChange={handleInputChange} required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>NIK</label>
              <input type="text" name="nik" className="form-input" value={formData.nik} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Nomor HP / WhatsApp</label>
              <input type="text" name="kontak" className="form-input" value={formData.kontak} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>No. Registrasi (Metodologi)</label>
            <input type="text" name="noReg" className="form-input" placeholder="MET.000..." value={formData.noReg} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Lisensi Skema yang Dikuasai</label>
            <select name="skema" className="form-select" value={formData.skema} onChange={handleInputChange} required>
              <option value="">-- Pilih Skema --</option>
              <option value="Pembuatan Roti Dan Kue">Pembuatan Roti Dan Kue</option>
              <option value="Practical Office Advance">Practical Office Advance</option>
              <option value="Teknisi Perawatan AC Residential">Teknisi Perawatan AC Residential</option>
              <option value="Welder SMAW 3G">Welder SMAW 3G</option>
              <option value="Barista">Barista</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Status Asesor</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Batal</Button>
            <Button type="submit" variant="success" icon="save" style={{ flex: 1 }}>Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterDataAsesor;