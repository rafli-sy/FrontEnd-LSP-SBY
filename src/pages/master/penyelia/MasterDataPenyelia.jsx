import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import Modal from '../../../components/ui/Modal';
import Pagination from '../../../components/ui/Pagination';

const MasterDataPenyelia = () => {
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: { 'ngrok-skip-browser-warning': 'true', 'Authorization': `Bearer ${token}` }
  }), [token]);

  const [penyeliaList, setPenyeliaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const alertTimer = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Aktif');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({ 
    id: null, namaPenyilia: '', noRegistrasi: '', jabatan: '', institusi: '', alamat: '', kota: '', status: 'Aktif' 
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/admin-lsp/Penyilia?status=semua`, config);
      setPenyeliaList(res.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data penyelia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
    setFormData({ id: null, namaPenyilia: '', noRegistrasi: '', jabatan: '', institusi: '', alamat: '', kota: '', status: 'Aktif' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleBukaEdit = (penyelia) => {
    setFormData(penyelia);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${baseUrl}/admin-lsp/penyilia/${formData.id}/edit`, formData, config);
        showSuccess('Diperbarui!', 'Data Penyelia berhasil diperbarui.');
      } else {
        await axios.post(`${baseUrl}/admin-lsp/penyilia/add`, formData, config);
        showSuccess('Tersimpan!', 'Penyelia berhasil ditambahkan.');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      setAlert({ type: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan.', onCancel: closeAlert });
    }
  };

  const handleToggleStatus = async (penyelia) => {
    try {
      await axios.patch(`${baseUrl}/admin-lsp/penyilia/${penyelia.id}/status`, {}, config);
      fetchData();
      showSuccess('Berhasil!', 'Status berhasil diubah.');
    } catch (error) {
      setAlert({ type: 'error', title: 'Gagal', text: 'Gagal mengubah status.', onCancel: closeAlert });
    }
  };

  // Logika Filter & Search digabung
  const filteredPenyelia = penyeliaList.filter(p => {
    const matchSearch = p.namaPenyilia.toLowerCase().includes(searchQuery.toLowerCase()) || p.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' ? true : p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredPenyelia.length / itemsPerPage) || 1;
  const paginatedPenyelia = filteredPenyelia.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-content fade-in-content">
      
      {/* HEADER UTAMA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Penyelia</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen data Penyelia tersertifikasi.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={handleBukaTambah}>Tambah Penyelia</Button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* TOOLBAR PENCARIAN & FILTER MODERN */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari Nama / No Registrasi..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Filter:</label>
            <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
              <option value="Aktif">Lihat Aktif</option>
              <option value="Non-Aktif">Lihat Non-Aktif</option>
              <option value="Semua">Semua Status</option>
            </select>
          </div>
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '25%' }}>Nama Penyelia</th>
                <th style={{ width: '20%' }}>No Registrasi</th>
                <th style={{ width: '15%' }}>Institusi</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}><i className="fas fa-spinner fa-spin fa-2x"></i><br/>Memuat Data...</td></tr> : paginatedPenyelia.length > 0 ? paginatedPenyelia.map((penyelia, index) => (
                <tr key={penyelia.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong style={{ color: '#0f172a' }}>{penyelia.namaPenyilia}</strong><br/><small style={{ color: '#3b82f6' }}>{penyelia.jabatan}</small></td>
                  <td><span className="badge info">{penyelia.noRegistrasi}</span></td>
                  <td>{penyelia.institusi}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant={penyelia.status === 'Aktif' ? 'success' : 'danger'} size="sm" onClick={() => handleToggleStatus(penyelia)}>
                      {penyelia.status}
                    </Button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="outline" size="sm" icon="edit" onClick={() => handleBukaEdit(penyelia)} />
                  </td>
                </tr>
              )) : <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>Data tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredPenyelia.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Data Penyelia' : 'Tambah Penyelia Baru'}>
        <form onSubmit={handleSimpan}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Lengkap</label>
            <input type="text" name="namaPenyilia" className="form-input" value={formData.namaPenyilia} onChange={handleInputChange} required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Jabatan</label>
              <input type="text" name="jabatan" className="form-input" value={formData.jabatan} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>No. Registrasi</label>
              <input type="text" name="noRegistrasi" className="form-input" value={formData.noRegistrasi} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Institusi</label>
              <input type="text" name="institusi" className="form-input" value={formData.institusi} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Kota</label>
              <input type="text" name="kota" className="form-input" value={formData.kota} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div className="form-group">
              <label>Alamat</label>
              <input type="text" name="alamat" className="form-input" value={formData.alamat} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                <option value="Aktif">Aktif</option>
                <option value="Non-Aktif">Non-Aktif</option>
              </select>
            </div>
          </div>
          
          <Button type="submit" variant="primary" isFullWidth icon="save">{isEditing ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
        </form>
      </Modal>
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default MasterDataPenyelia;