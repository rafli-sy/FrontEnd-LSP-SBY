import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal'; 
import AlertPopup from '../../../components/ui/AlertPopup'; 
import Pagination from '../../../components/ui/Pagination';

const DataTUK = () => {
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
  const [initialData, setInitialData] = useState(null); // STATE BARU: Menyimpan wujud asli data sebelum diedit
  
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusParam = filterStatus === 'Semua' ? 'semua' : filterStatus.toLowerCase();
      const res = await axios.get(`${baseUrl}/master/jejaring?status=${statusParam}`, config);
      const dataTuk = res.data.data || [];
      dataTuk.sort((a, b) => b.id - a.id);
      setTukList(dataTuk);
    } catch (error) {
      console.error("Gagal mengambil data TUK:", error);
      showAlert('error', 'Gagal', 'Gagal memuat data dari server.');
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

  const showAlert = (type, title, text) => {
    setAlert({ type, title, text, onCancel: closeAlert });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- FUNGSI TOGGLE STATUS DI DALAM MODAL ---
  const handleToggleStatusForm = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 'Aktif' ? 'Non-aktif' : 'Aktif'
    }));
  };

  const handleTambah = () => {
    setModalMode('create');
    const newData = { id: null, kodeInstitusi: '', namaInstitusi: '', alamat: '', kota: '', status: 'Aktif' };
    setFormData(newData);
    setInitialData(newData); // Set data awal
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalMode('edit');
    const editData = {
      id: data.id,
      kodeInstitusi: data.kodeInstitusi,
      namaInstitusi: data.namaInstitusi,
      alamat: data.alamat,
      kota: data.kota,
      status: data.status
    };
    setFormData(editData);
    setInitialData(editData); // Simpan data awal sebelum user mulai mengetik
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalMode === 'edit') {
      // CEK PERUBAHAN: Jika formData persis sama dengan initialData, langsung tutup modal
      if (JSON.stringify(formData) === JSON.stringify(initialData)) {
        setIsModalOpen(false);
        return;
      }

      setAlert({
        type: 'confirm',
        title: 'Konfirmasi Ubah Data',
        text: 'Apakah Anda yakin ingin menyimpan perubahan data TUK ini?',
        onConfirm: async () => {
          closeAlert(); // Tutup popup konfirmasi
          try {
            await axios.put(`${baseUrl}/admin-lsp/jejaring/${formData.id}/edit`, formData, config);
            showSuccess('Berhasil!', 'Data TUK berhasil diperbarui.');
            setIsModalOpen(false);
            fetchData(); 
          } catch (error) {
            showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem.');
          }
        },
        onCancel: closeAlert
      });

    } else {
      setAlert({
        type: 'confirm',
        title: 'Konfirmasi Tambah Data',
        text: 'Apakah Anda yakin ingin menambahkan data TUK ini?',
        onConfirm: async () => {
          closeAlert();
          try {
            await axios.post(`${baseUrl}/admin-lsp/jejaring/add`, formData, config);
            showSuccess('Berhasil!', 'Data TUK berhasil ditambahkan.');
            setIsModalOpen(false);
            fetchData(); 
          } catch (error) {
            showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem.');
          }
        },
        onCancel: closeAlert
      });
    }
  };

  const filteredTUK = tukList.filter(tuk => {
    const matchSearch = tuk.namaInstitusi.toLowerCase().includes(searchQuery.toLowerCase()) || tuk.kodeInstitusi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredTUK.length / itemsPerPage) || 1;
  const paginatedTUK = filteredTUK.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div className="dashboard-content fade-in-content">
      {alert && <AlertPopup {...alert} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Data Tempat Uji Kompetensi (TUK)</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen daftar lokasi penyelenggaraan ujian kompetensi.</p>
        </div>
        <Button variant="primary" icon="map-marker-alt" onClick={handleTambah}>Tambah TUK</Button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari Institusi TUK / Kode..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }} />
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
                <th style={{ width: '15%' }}>Kode TUK</th>
                <th style={{ width: '30%' }}>Nama Institusi</th>
                <th style={{ width: '25%' }}>Alamat & Kota</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}><i className="fas fa-spinner fa-spin fa-2x"></i><br/>Memuat Data...</td></tr> : paginatedTUK.length > 0 ? paginatedTUK.map((tuk, index) => (
                <tr key={tuk.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td><strong>{tuk.kodeInstitusi}</strong></td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{tuk.namaInstitusi}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>{tuk.alamat}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3b82f6' }}>Kota {tuk.kota}</div>
                  </td>
                  
                  {/* DI TABEL CUMA TAMPIL BADGE (TIDAK BISA DIKLIK) */}
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${tuk.status === 'Aktif' ? 'success' : 'danger'}`} style={{ padding: '6px 12px', display: 'inline-block' }}>
                      {tuk.status}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="outline" icon="edit" onClick={() => handleEdit(tuk)} />
                  </td>
                </tr>
              )) : <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>Data tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredTUK.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Data TUK' : 'Edit Data TUK'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}><i className="fas fa-barcode text-muted" style={{marginRight: '5px'}}></i> Kode TUK</label>
            <input type="text" name="kodeInstitusi" style={inputStyle} placeholder="Misal: TUK-001" value={formData.kodeInstitusi} onChange={handleInputChange} required />
          </div>

          <div>
            <label style={labelStyle}><i className="fas fa-building text-muted" style={{marginRight: '5px'}}></i> Nama Institusi TUK</label>
            <input type="text" name="namaInstitusi" style={inputStyle} placeholder="Contoh: TUK Sewaktu BLK Surabaya" value={formData.namaInstitusi} onChange={handleInputChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}><i className="fas fa-city text-muted" style={{marginRight: '5px'}}></i> Kota</label>
              <input type="text" name="kota" style={inputStyle} placeholder="Contoh: Surabaya" value={formData.kota} onChange={handleInputChange} required />
            </div>

            {/* GANTI DROPDOWN MENJADI TOMBOL SWITCH */}
            <div>
              <label style={labelStyle}><i className="fas fa-toggle-on text-muted" style={{marginRight: '5px'}}></i> Status TUK</label>
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
          </div>

          <div>
            <label style={labelStyle}><i className="fas fa-map-marker-alt text-muted" style={{marginRight: '5px'}}></i> Alamat Lengkap</label>
            <textarea name="alamat" style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} rows="3" placeholder="Masukkan alamat lengkap TUK" value={formData.alamat} onChange={handleInputChange} required></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            
            {/* Tombol Batal (Abu-abu) */}
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            
            {/* Tombol Simpan (Biru) - Ganti variant="success" jika ingin warna hijau */}
            <Button type="submit" variant="primary" icon="save">
              {modalMode === 'create' ? 'Simpan Data Baru' : 'Simpan Perubahan'}
            </Button>

          </div>

        </form>
      </Modal>
    </div>
  );
};

export default DataTUK;