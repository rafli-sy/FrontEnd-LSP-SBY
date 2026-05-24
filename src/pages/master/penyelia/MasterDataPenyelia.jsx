import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import Modal from '../../../components/ui/Modal';
import './MasterDataPenyelia.css';

const MasterDataPenyelia = () => {
  // Konfigurasi API
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

  const [filterStatus, setFilterStatus] = useState('Aktif');
  const [formData, setFormData] = useState({ 
    id: null, namaPenyilia: '', noRegistrasi: '', jabatan: '', institusi: '', alamat: '', kota: '', status: 'Aktif' 
  });

  // Fetch Data dari API
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

  const filteredPenyelia = penyeliaList.filter(p => filterStatus === 'Semua' ? true : p.status === filterStatus);

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Penyelia</h2>
          <p className="text-muted">Manajemen data Penyelia tersertifikasi.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 'auto', padding: '10px 14px', cursor: 'pointer' }}>
            <option value="Aktif">Lihat Aktif Saja</option>
            <option value="Non-Aktif">Lihat Non-Aktif</option>
            <option value="Semua">Semua Status</option>
          </select>
          <Button variant="primary" icon="plus" onClick={handleBukaTambah}>Tambah Penyelia</Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="table-responsive">
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
              {isLoading ? <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Memuat Data...</td></tr> : filteredPenyelia.map((penyelia, index) => (
                <tr key={penyelia.id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td><strong>{penyelia.namaPenyilia}</strong></td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Data Penyelia' : 'Tambah Penyelia Baru'}</h3>
            <form onSubmit={handleSimpan}>
               <div className="form-group">
                 <label>Nama Lengkap</label>
                 <input type="text" name="namaPenyilia" className="form-input" value={formData.namaPenyilia} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Jabatan</label>
                 <input type="text" name="jabatan" className="form-input" value={formData.jabatan} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>No. Registrasi</label>
                 <input type="text" name="noRegistrasi" className="form-input" value={formData.noRegistrasi} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Institusi</label>
                 <input type="text" name="institusi" className="form-input" value={formData.institusi} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Alamat</label>
                 <input type="text" name="alamat" className="form-input" value={formData.alamat} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Kota</label>
                 <input type="text" name="kota" className="form-input" value={formData.kota} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Status</label>
                 <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                   <option value="Aktif">Aktif</option>
                   <option value="Non-Aktif">Non-Aktif</option>
                 </select>
               </div>
               
               <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                 <Button variant="secondary" isFullWidth onClick={() => setShowModal(false)}>Batal</Button>
                 <Button type="submit" variant="primary" isFullWidth icon="save">{isEditing ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
               </div>
            </form>
          </div>
        </div>
      )}
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default MasterDataPenyelia;