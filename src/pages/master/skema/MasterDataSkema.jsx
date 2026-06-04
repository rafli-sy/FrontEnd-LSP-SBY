import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AlertPopup from '../../../components/ui/AlertPopup';
import Pagination from '../../../components/ui/Pagination';

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
      const res = await axios.get(`${baseUrl}/master/skema?status=semua`, config);
      setSkemaList(res.data.data || []);
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
      bidang_id: data.bidang_id, 
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
      
      {/* HEADER UTAMA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Skema</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen data skema sertifikasi yang tersedia.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={handleTambah}>Tambah Skema</Button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* TOOLBAR PENCARIAN & FILTER MODERN */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari Kode atau Judul Skema..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Filter:</label>
            <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
              <option value="Aktif">Lihat Aktif</option>
              <option value="Non-aktif">Lihat Non-Aktif</option>
              <option value="Semua">Semua Status</option>
            </select>
          </div>
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '15%' }}>Kode</th>
                <th style={{ width: '30%' }}>Judul Skema</th>
                <th style={{ width: '15%' }}>Jenis</th>
                <th style={{ width: '15%' }}>Bidang</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}><i className="fas fa-spinner fa-spin fa-2x"></i><br/>Memuat Data...</td></tr> : paginatedSkema.length > 0 ? paginatedSkema.map((skema, index) => (
                <tr key={skema.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong>{skema.kodeSkema}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{skema.namaSkema}</td>
                  <td>{skema.jenisSkema}</td>
                  <td><span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '600' }}>{skema.bidang?.namaBidang || '-'}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant={skema.status === 'Aktif' ? 'success' : 'danger'} size="sm" onClick={() => handleToggleStatus(skema)}>
                      {skema.status}
                    </Button>
                  </td>
                  <td style={{ textAlign: 'center' }}><Button variant="outline" icon="edit" onClick={() => handleEdit(skema)} /></td>
                </tr>
              )) : <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>Data tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredSkema.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Skema' : 'Edit Skema'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}><label>Kode Skema</label><input type="text" name="kodeSkema" className="form-input" value={formData.kodeSkema} onChange={handleInputChange} required /></div>
          <div className="form-group" style={{ marginBottom: '15px' }}><label>Judul Skema</label><input type="text" name="namaSkema" className="form-input" value={formData.namaSkema} onChange={handleInputChange} required /></div>
          <div className="form-group" style={{ marginBottom: '15px' }}><label>Profesi</label><input type="text" name="profesi" className="form-input" value={formData.profesi} onChange={handleInputChange} required /></div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div className="form-group">
              <label>Bidang</label>
              <select name="bidang_id" className="form-select" value={formData.bidang_id} onChange={handleInputChange} required>
                <option value="">-- Pilih Bidang --</option>
                {listBidang.map(b => <option key={b.id} value={b.id}>{b.namaBidang}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Jenis</label><input type="text" name="jenisSkema" className="form-input" value={formData.jenisSkema} onChange={handleInputChange} required /></div>
          </div>
          <Button type="submit" variant="primary" isFullWidth icon="save">Simpan Data</Button>
        </form>
      </Modal>
    </div>
  );
};

export default MasterDataSkema;