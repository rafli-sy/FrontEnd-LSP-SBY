import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({ id: null, kodeSkema: '', namaSkema: '', jenisSkema: 'Klaster', bidang_id: '', profesi: '', status: 'Aktif' });
  const [initialData, setInitialData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusParam = filterStatus === 'Semua' ? 'semua' : filterStatus.toLowerCase();
      const res = await axios.get(`${baseUrl}/master/skema?status=${statusParam}`, config);
      setSkemaList(res.data.data || []);
      const resBidang = await axios.get(`${baseUrl}/master/bidang`, config);
      setListBidang(resBidang.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterStatus]);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const showAlert = (type, title, text, onConfirmAction = null) => {
    setAlert({ 
      type, title, text, onCancel: closeAlert,
      ...(onConfirmAction && { onConfirm: onConfirmAction }) 
    });
  };

  const handleToggleStatusForm = () => {
    setFormData((prev) => ({ ...prev, status: prev.status === 'Aktif' ? 'Non-aktif' : 'Aktif' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'bidang_id') {
        const selectedBidang = listBidang.find(b => String(b.id) === String(value));
        if (selectedBidang) {
          updated.profesi = selectedBidang.namaBidang;
        }
      }
      return updated;
    });
  };

  const handleTambah = () => {
    setModalMode('create');
    const newData = { id: null, kodeSkema: '', namaSkema: '', jenisSkema: 'Klaster', bidang_id: '', profesi: '', status: 'Aktif' };
    setFormData(newData);
    setInitialData(newData);
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    const editData = {
      id: data.id,
      kodeSkema: data.kodeSkema,
      namaSkema: data.namaSkema,
      jenisSkema: data.jenisSkema,
      bidang_id: data.bidang_id, 
      profesi: data.profesi,
      status: data.status
    };
    setFormData(editData);
    setInitialData(editData);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'edit') {
      if (JSON.stringify(formData) === JSON.stringify(initialData)) {
        setIsModalOpen(false);
        return;
      }
      showAlert('confirm', 'Konfirmasi Ubah Data', 'Apakah Anda yakin ingin menyimpan perubahan data Skema ini?', async () => {
        closeAlert();
        try {
          await axios.put(`${baseUrl}/admin-lsp/skema/${formData.id}/edit`, formData, config);
          showSuccess('Berhasil!', 'Data skema berhasil diperbarui.');
          setIsModalOpen(false);
          fetchData();
        } catch (error) {
          showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem.');
        }
      });
    } else {
      showAlert('confirm', 'Konfirmasi Tambah Data', 'Apakah Anda yakin ingin menambahkan data Skema ini?', async () => {
        closeAlert();
        try {
          await axios.post(`${baseUrl}/admin-lsp/skema/add`, formData, config);
          showSuccess('Berhasil!', 'Data skema berhasil ditambahkan.');
          setIsModalOpen(false);
          fetchData();
        } catch (error) {
          showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem.');
        }
      });
    }
  };

  const filteredSkema = skemaList.filter(s => {
    const matchSearch = s.namaSkema?.toLowerCase().includes(searchQuery.toLowerCase()) || s.kodeSkema?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' ? true : s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredSkema.length / itemsPerPage) || 1;
  const paginatedSkema = filteredSkema.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div className="dashboard-content fade-in-content">
      {alert && <AlertPopup {...alert} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Skema</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Kelola daftar skema sertifikasi yang tersedia.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={handleTambah}>Tambah Skema</Button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari Nama Skema / Kode..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }} />
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
                <th style={{ width: '15%' }}>Kode Skema</th>
                <th style={{ width: '30%' }}>Nama Skema</th>
                <th style={{ width: '15%' }}>Jenis</th>
                <th style={{ width: '15%' }}>Bidang</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}><i className="fas fa-spinner fa-spin fa-2x"></i><br/>Memuat Data...</td></tr> : paginatedSkema.length > 0 ? paginatedSkema.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong>{item.kodeSkema}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{item.namaSkema}</td>
                  <td>{item.jenisSkema}</td>
                  <td>{item.bidang?.namaBidang || '-'}</td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${item.status === 'Aktif' ? 'success' : 'danger'}`} style={{ padding: '6px 12px', display: 'inline-block' }}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="outline" icon="edit" onClick={() => handleEdit(item)} />
                  </td>
                </tr>
              )) : <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>Data tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredSkema.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data Skema' : 'Edit Data Skema'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}><i className="fas fa-barcode text-muted" style={{marginRight: '5px'}}></i> Kode Skema</label>
            <input type="text" name="kodeSkema" style={inputStyle} placeholder="Contoh: SKM-001" value={formData.kodeSkema} onChange={handleInputChange} required />
          </div>

          <div>
            <label style={labelStyle}><i className="fas fa-book text-muted" style={{marginRight: '5px'}}></i> Nama Skema</label>
            <input type="text" name="namaSkema" style={inputStyle} placeholder="Contoh: Web Developer" value={formData.namaSkema} onChange={handleInputChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}><i className="fas fa-layer-group text-muted" style={{marginRight: '5px'}}></i> Jenis Skema</label>
              <select name="jenisSkema" value={formData.jenisSkema} onChange={handleInputChange} style={{...inputStyle, cursor: 'pointer'}} required>
                <option value="Okupasi">Okupasi</option>
                <option value="Klaster">Klaster</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}><i className="fas fa-briefcase text-muted" style={{marginRight: '5px'}}></i> Bidang</label>
              <select name="bidang_id" value={formData.bidang_id} onChange={handleInputChange} style={{...inputStyle, cursor: 'pointer'}} required>
                <option value="" disabled>Pilih Bidang</option>
                {listBidang.map(b => (
                  <option key={b.id} value={b.id}>{b.namaBidang}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}><i className="fas fa-user-tie text-muted" style={{marginRight: '5px'}}></i> Profesi (Opsional)</label>
              <input type="text" name="profesi" style={inputStyle} placeholder="Contoh: Programmer" value={formData.profesi || ''} onChange={handleInputChange} />
            </div>

            {modalMode === 'edit' && (
              <div>
                <label style={labelStyle}><i className="fas fa-toggle-on text-muted" style={{marginRight: '5px'}}></i> Status Skema</label>
                <button 
                  type="button"
                  onClick={handleToggleStatusForm}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px', 
                    border: formData.status === 'Aktif' ? '1px solid #10b981' : '1px solid #ef4444', 
                    backgroundColor: formData.status === 'Aktif' ? '#ecfdf5' : '#fef2f2', 
                    color: formData.status === 'Aktif' ? '#047857' : '#b91c1c', 
                    fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s'
                  }}
                >
                  <span>{formData.status}</span>
                  <i className="fas fa-exchange-alt"></i>
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" icon="save">{modalMode === 'create' ? 'Simpan Data Baru' : 'Simpan Perubahan'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterDataSkema;