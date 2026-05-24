import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal'; 
import AlertPopup from '../../../components/ui/AlertPopup'; 
import Pagination from '../../../components/ui/Pagination';
import './DataTUK.css';

const DataTUK = () => {
  // Konfigurasi API
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: { 'ngrok-skip-browser-warning': 'true', 'Authorization': `Bearer ${token}` }
  }), [token]);

  const [tukList, setTukList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Aktif');
  const [formData, setFormData] = useState({ id: null, kodeInstitusi: '', namaInstitusi: '', alamat: '', kota: '', status: 'Aktif' });
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // FETCH DATA DARI BACKEND
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Backend menggunakan endpoint /master/jejaring
      const statusParam = filterStatus === 'Semua' ? 'semua' : filterStatus.toLowerCase();
      const res = await axios.get(`${baseUrl}/master/jejaring?status=${statusParam}`, config);
      setTukList(res.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data TUK:", error);
      showAlert('error', 'Gagal', 'Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterStatus]);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTambah = () => {
    setModalMode('create');
    setFormData({ id: null, kodeInstitusi: '', namaInstitusi: '', alamat: '', kota: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData({
      id: data.id,
      kodeInstitusi: data.kodeInstitusi,
      namaInstitusi: data.namaInstitusi,
      alamat: data.alamat,
      kota: data.kota,
      status: data.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await axios.post(`${baseUrl}/admin-lsp/jejaring/add`, formData, config);
        showAlert('success', 'Berhasil!', 'Data TUK berhasil ditambahkan.');
      } else {
        await axios.put(`${baseUrl}/admin-lsp/jejaring/${formData.id}/edit`, formData, config);
        showAlert('success', 'Berhasil!', 'Data TUK berhasil diperbarui.');
      }
      setIsModalOpen(false);
      fetchData(); // Refresh tabel
    } catch (error) {
      showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleToggleStatus = async (tuk) => {
    try {
      await axios.patch(`${baseUrl}/admin-lsp/jejaring/${tuk.id}/status`, {}, config);
      fetchData();
    } catch (error) {
      showAlert('error', 'Gagal', 'Terjadi kesalahan saat mengubah status.');
    }
  };

  const filteredTUK = tukList.filter(tuk => {
    const matchSearch = tuk.namaInstitusi.toLowerCase().includes(searchQuery.toLowerCase()) || tuk.kodeInstitusi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredTUK.length / itemsPerPage) || 1;
  const paginatedTUK = filteredTUK.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-content fade-in-content">
      {alertConfig.type && (
        <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={() => { if(alertConfig.action) alertConfig.action(); setAlertConfig({type:null})}} onCancel={() => setAlertConfig({type:null})} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Data Tempat Uji Kompetensi (TUK)</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen daftar lokasi penyelenggaraan ujian kompetensi.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select className="form-input" value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ width: 'auto', padding: '10px 14px', cursor: 'pointer' }}>
            <option value="Aktif">Lihat Aktif</option>
            <option value="Non-aktif">Lihat Non-Aktif</option>
            <option value="Semua">Semua</option>
          </select>
          <Button variant="primary" icon="map-marker-alt" onClick={handleTambah}>Tambah TUK</Button>
        </div>
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
              {isLoading ? <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Memuat Data...</td></tr> : paginatedTUK.map((tuk, index) => (
                <tr key={tuk.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong>{tuk.kodeInstitusi}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{tuk.namaInstitusi}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>{tuk.alamat}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3b82f6' }}>Kota {tuk.kota}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant={tuk.status === 'Aktif' ? 'success' : 'danger'} size="sm" onClick={() => handleToggleStatus(tuk)}>
                      {tuk.status}
                    </Button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="outline" icon="edit" onClick={() => handleEdit(tuk)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{color:'#64748b'}}>Halaman {currentPage} dari {totalPages}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Sebelumnya</Button>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Selanjutnya</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data TUK' : 'Edit Data TUK'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Kode TUK</label>
            <input type="text" name="kodeInstitusi" className="form-input" placeholder="Misal: TUK-001" value={formData.kodeInstitusi} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Institusi TUK</label>
            <input type="text" name="namaInstitusi" className="form-input" placeholder="Contoh: TUK Sewaktu BLK Surabaya" value={formData.namaInstitusi} onChange={handleInputChange} required />
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
                <option value="Non-aktif">Non-Aktif</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Alamat Lengkap</label>
            <textarea name="alamat" className="form-input" rows="3" value={formData.alamat} onChange={handleInputChange} required style={{ resize: 'vertical' }}></textarea>
          </div>
          <Button type="submit" variant="success" isFullWidth icon="save">Simpan Data</Button>
        </form>
      </Modal>
    </div>
  );
};

export default DataTUK;