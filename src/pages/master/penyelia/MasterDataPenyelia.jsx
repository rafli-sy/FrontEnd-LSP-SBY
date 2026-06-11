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

  const [formData, setFormData] = useState({ id: null, namaPenyilia: '', noRegistrasi: '', jabatan: '', institusi: '', alamat: '', kota: '', status: 'Aktif' });
  const [initialData, setInitialData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusParam = filterStatus === 'Semua' ? 'semua' : filterStatus.toLowerCase();
      const res = await axios.get(`${baseUrl}/admin-lsp/Penyilia?status=${statusParam}`, config);
      setPenyeliaList(res.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data penyelia:", error);
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

  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleToggleStatusForm = () => {
    setFormData((prev) => ({ ...prev, status: prev.status === 'Aktif' ? 'Non-aktif' : 'Aktif' }));
  };

  const handleBukaTambah = () => {
    const newData = { id: null, namaPenyilia: '', noRegistrasi: '', jabatan: '', institusi: '', alamat: '', kota: '', status: 'Aktif' };
    setFormData(newData);
    setInitialData(newData);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleBukaEdit = (penyelia) => {
    const editData = {
      id: penyelia.id,
      namaPenyilia: penyelia.namaPenyilia || '',
      noRegistrasi: penyelia.noRegistrasi || '',
      jabatan: penyelia.jabatan || '',
      institusi: penyelia.institusi || '',
      alamat: penyelia.alamat || '',
      kota: penyelia.kota || '',
      status: penyelia.status || 'Aktif'
    };
    setFormData(editData);
    setInitialData(editData);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (isEditing) {
      if (JSON.stringify(formData) === JSON.stringify(initialData)) {
        setShowModal(false);
        return;
      }
      setAlert({
        type: 'confirm',
        title: 'Konfirmasi Ubah Data',
        text: 'Apakah Anda yakin ingin menyimpan perubahan data Penyelia ini?',
        onConfirm: async () => {
          closeAlert();
          try {
            await axios.put(`${baseUrl}/admin-lsp/penyilia/${formData.id}/edit`, formData, config);
            showSuccess('Diperbarui!', 'Data Penyelia berhasil diperbarui.');
            setShowModal(false);
            fetchData();
          } catch (error) {
            setAlert({ type: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan.', onCancel: closeAlert });
          }
        },
        onCancel: closeAlert
      });
    } else {
      setAlert({
        type: 'confirm',
        title: 'Konfirmasi Tambah Data',
        text: 'Apakah Anda yakin ingin menambahkan data Penyelia ini?',
        onConfirm: async () => {
          closeAlert();
          try {
            await axios.post(`${baseUrl}/admin-lsp/penyilia/add`, formData, config);
            showSuccess('Tersimpan!', 'Penyelia berhasil ditambahkan.');
            setShowModal(false);
            fetchData();
          } catch (error) {
            setAlert({ type: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan.', onCancel: closeAlert });
          }
        },
        onCancel: closeAlert
      });
    }
  };

  const filteredPenyelia = penyeliaList.filter(p => {
    const matchSearch = p.namaPenyilia.toLowerCase().includes(searchQuery.toLowerCase()) || p.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' ? true : p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredPenyelia.length / itemsPerPage) || 1;
  const paginatedPenyelia = filteredPenyelia.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div className="dashboard-content fade-in-content">
      {alert && <AlertPopup {...alert} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Penyelia</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Kelola data supervisor atau penyelia asesi.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={handleBukaTambah}>Tambah Penyelia</Button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari Nama / No. Registrasi..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }} />
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
                <th style={{ width: '25%' }}>Nama Penyelia</th>
                <th style={{ width: '15%' }}>No. Registrasi</th>
                <th style={{ width: '15%' }}>Jabatan</th>
                <th style={{ width: '20%' }}>Institusi</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}><i className="fas fa-spinner fa-spin fa-2x"></i><br/>Memuat Data...</td></tr> : paginatedPenyelia.length > 0 ? paginatedPenyelia.map((p, index) => (
                <tr key={p.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{p.namaPenyilia}</td>
                  <td>{p.noRegistrasi || '-'}</td>
                  <td>{p.jabatan || '-'}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>{p.institusi || '-'}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3b82f6' }}>{p.kota ? `Kota ${p.kota}` : ''}</div>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${p.status === 'Aktif' ? 'success' : 'danger'}`} style={{ padding: '6px 12px', display: 'inline-block' }}>
                      {p.status}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="outline" icon="edit" onClick={() => handleBukaEdit(p)} />
                  </td>
                </tr>
              )) : <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>Data tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredPenyelia.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Data Penyelia' : 'Tambah Data Penyelia'}>
        <form onSubmit={handleSimpan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={labelStyle}><i className="fas fa-user-tie text-muted" style={{marginRight: '5px'}}></i> Nama Penyelia</label>
            <input type="text" name="namaPenyilia" style={inputStyle} placeholder="Masukkan nama lengkap" value={formData.namaPenyilia || ''} onChange={handleInputChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div>
              <label style={labelStyle}><i className="fas fa-id-card text-muted" style={{marginRight: '5px'}}></i> No. Registrasi</label>
              <input type="text" name="noRegistrasi" style={inputStyle} placeholder="Contoh: REG-123" value={formData.noRegistrasi || ''} onChange={handleInputChange} />
            </div>
            <div>
              <label style={labelStyle}><i className="fas fa-briefcase text-muted" style={{marginRight: '5px'}}></i> Jabatan</label>
              <input type="text" name="jabatan" style={inputStyle} placeholder="Contoh: Supervisor" value={formData.jabatan || ''} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}><i className="fas fa-building text-muted" style={{marginRight: '5px'}}></i> Institusi</label>
              <input type="text" name="institusi" style={inputStyle} placeholder="Nama institusi" value={formData.institusi || ''} onChange={handleInputChange} />
            </div>
            <div>
              <label style={labelStyle}><i className="fas fa-city text-muted" style={{marginRight: '5px'}}></i> Kota</label>
              <input type="text" name="kota" style={inputStyle} placeholder="Contoh: Surabaya" value={formData.kota || ''} onChange={handleInputChange} />
            </div>
          </div>

          {isEditing && (
            <div>
              <label style={labelStyle}><i className="fas fa-toggle-on text-muted" style={{marginRight: '5px'}}></i> Status Penyelia</label>
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

          <div>
            <label style={labelStyle}><i className="fas fa-map-marker-alt text-muted" style={{marginRight: '5px'}}></i> Alamat Lengkap</label>
            <textarea name="alamat" style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} rows="3" placeholder="Masukkan alamat lengkap" value={formData.alamat || ''} onChange={handleInputChange}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit" variant="primary" icon="save">{!isEditing ? 'Simpan Data Baru' : 'Simpan Perubahan'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterDataPenyelia;