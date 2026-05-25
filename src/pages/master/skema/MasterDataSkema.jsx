import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AlertPopup from '../../../components/ui/AlertPopup';


const MasterDataSkema = () => {
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: { 'ngrok-skip-browser-warning': 'true', 'Authorization': `Bearer ${token}` }
  }), [token]);

  const [skemaList, setSkemaList] = useState([]);
  const [listBidang, setListBidang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Aktif');
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({ 
    id: null, kodeSkema: '', namaSkema: '', jenisSkema: 'Klaster', bidang_id: '', profesi: '', status: 'Aktif' 
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Skema (sudah dengan relasi bidang setelah perbaikan backend)
      const res = await axios.get(`${baseUrl}/master/skema?status=semua`, config);
      setSkemaList(res.data.data || []);
      
      // Fetch Bidang untuk Dropdown
      const resBidang = await axios.get(`${baseUrl}/master/bidang`, config);
      setListBidang(resBidang.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTambah = () => {
    setModalMode('create');
    setFormData({ id: null, kodeSkema: '', namaSkema: '', jenisSkema: 'Klaster', bidang_id: '', profesi: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    setFormData({
      id: data.id,
      kodeSkema: data.kodeSkema,
      namaSkema: data.namaSkema,
      jenisSkema: data.jenisSkema,
      bidang_id: data.bidang_id, // Pastikan ID ini tersimpan dari backend
      profesi: data.profesi,
      status: data.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await axios.post(`${baseUrl}/admin-lsp/skema/add`, formData, config);
        showAlert('success', 'Berhasil!', 'Data skema berhasil ditambahkan.');
      } else {
        await axios.put(`${baseUrl}/admin-lsp/skema/${formData.id}/edit`, formData, config);
        showAlert('success', 'Berhasil!', 'Data skema berhasil diperbarui.');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showAlert('warning', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  const handleToggleStatus = async (skema) => {
    try {
      await axios.patch(`${baseUrl}/admin-lsp/skema/${skema.id}/status`, {}, config);
      fetchData();
    } catch (error) {
      showAlert('error', 'Gagal', 'Gagal mengubah status.');
    }
  };

  const filteredSkema = skemaList.filter(s => {
    const matchSearch = s.namaSkema?.toLowerCase().includes(searchQuery.toLowerCase()) || s.kodeSkema?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' ? true : s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredSkema.length / itemsPerPage) || 1;
  const paginatedSkema = filteredSkema.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (type === 'success') setTimeout(() => setAlertConfig({ type: null }), 2000);
  };

  return (
    <div className="dashboard-content fade-in-content">
      {alertConfig.type && <AlertPopup {...alertConfig} onCancel={() => setAlertConfig({ type: null })} />}
      
      <div className="dashboard-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div><h2>Master Data Skema</h2></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Aktif">Lihat Aktif</option>
            <option value="Non-aktif">Lihat Non-Aktif</option>
            <option value="Semua">Semua</option>
          </select>
          <Button variant="primary" icon="plus" onClick={handleTambah}>Tambah Skema</Button>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 0 }}>
        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th><th>Kode</th><th>Judul Skema</th><th>Jenis</th><th>Bidang</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="7">Memuat...</td></tr> : paginatedSkema.map((skema, index) => (
                <tr key={skema.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{skema.kodeSkema}</td>
                  <td>{skema.namaSkema}</td>
                  <td>{skema.jenisSkema}</td>
                  {/* DATA BIDANG SEKARANG AKAN MUNCUL DENGAN BENAR */}
                  <td>{skema.bidang?.namaBidang || '-'}</td>
                  <td>
                    <Button variant={skema.status === 'Aktif' ? 'success' : 'danger'} size="sm" onClick={() => handleToggleStatus(skema)}>
                      {skema.status}
                    </Button>
                  </td>
                  <td><Button variant="outline" icon="edit" onClick={() => handleEdit(skema)} /></td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Skema' : 'Edit Skema'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Kode Skema</label><input type="text" name="kodeSkema" className="form-input" value={formData.kodeSkema} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Judul Skema</label><input type="text" name="namaSkema" className="form-input" value={formData.namaSkema} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Profesi</label><input type="text" name="profesi" className="form-input" value={formData.profesi} onChange={handleInputChange} required /></div>
          <div className="form-group">
            <label>Bidang</label>
            <select name="bidang_id" className="form-select" value={formData.bidang_id} onChange={handleInputChange} required>
              <option value="">-- Pilih Bidang --</option>
              {listBidang.map(b => <option key={b.id} value={b.id}>{b.namaBidang}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Jenis</label><input type="text" name="jenisSkema" className="form-input" value={formData.jenisSkema} onChange={handleInputChange} required /></div>
          <Button type="submit" variant="primary" isFullWidth>Simpan</Button>
        </form>
      </Modal>
    </div>
  );
};

export default MasterDataSkema;