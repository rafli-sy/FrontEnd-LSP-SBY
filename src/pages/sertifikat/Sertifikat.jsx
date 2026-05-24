import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';

const Sertifikat = () => {
  const [data, setData] = useState([]);
  const [pesertaList, setPesertaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  
  // State untuk pencarian dan paginasi
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    peserta_pengajuan_ujk_id: '',
    no_sertifikat: '',
    tanggal_penerbitan: '',
    masa_berlaku: '',
    status: 'Aktif'
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  
  const config = useMemo(() => ({
    headers: { 
      'ngrok-skip-browser-warning': 'true', 
      'Authorization': `Bearer ${token}` 
    }
  }), [token]);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, onConfirm: () => { if(action) action(); setAlertConfig(null); }, onCancel: () => setAlertConfig(null) });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/sertifikat`, config);
      setData(response.data.data || []);
    } catch (error) { 
      console.error('Error fetching sertifikat:', error); 
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeserta = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/peserta-ujk`, config);
      setPesertaList(response.data.data || []);
    } catch (error) { 
      console.error('Error fetching peserta:', error); 
    }
  };

  useEffect(() => {
    fetchData();
    fetchPeserta();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/sertifikat`, formData, config);
      showAlert('success', 'Berhasil', 'Sertifikat berhasil ditambahkan.');
      setShowModal(false);
      setFormData({
        peserta_pengajuan_ujk_id: '',
        no_sertifikat: '',
        tanggal_penerbitan: '',
        masa_berlaku: '',
        status: 'Aktif'
      });
      fetchData();
    } catch (error) {
      console.error('Error submitting:', error);
      showAlert('error', 'Gagal', 'Terjadi kesalahan saat menyimpan sertifikat.');
    }
  };

  // --- LOGIKA FILTER & PAGINASI ---
  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.no_sertifikat || '').toLowerCase().includes(searchLower) ||
      (item.peserta?.namaPeserta || '').toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTgl = (tgl) => {
    if (!tgl) return '-';
    const parts = tgl.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return tgl;
  };

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f4f7fb', padding: '20px' }}>
      
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />}

      <div className="dashboard-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px', fontWeight: 'bold' }}>Manajemen Sertifikat</h2>
        <p className="text-muted">Kelola data penerbitan sertifikat kompetensi untuk peserta UJK.</p>
      </div>

      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        
        {/* HEADER CARD: PENCARIAN & TOMBOL TAMBAH */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input 
              type="text" 
              placeholder="Cari No. Sertifikat atau Nama Peserta..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>
            Tambah Sertifikat
          </Button>
        </div>

        {/* TABEL SERTIFIKAT */}
        <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th style={{ width: '25%' }}>No. Sertifikat</th>
                <th style={{ width: '25%' }}>Nama Peserta</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Tgl. Penerbitan</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Masa Berlaku</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
                    <p>Memuat Data Sertifikat...</p>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td><strong style={{ color: '#0f172a' }}>{item.no_sertifikat}</strong></td>
                    <td>{item.peserta?.namaPeserta || 'Peserta Tidak Diketahui'}</td>
                    <td style={{ textAlign: 'center', color: '#475569' }}>{formatTgl(item.tanggal_penerbitan)}</td>
                    <td style={{ textAlign: 'center', color: '#475569' }}>{formatTgl(item.masa_berlaku)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${item.status === 'Aktif' ? 'success' : 'danger'}`}>
                        {item.status || 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Tidak ada data sertifikat ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION TERINTEGRASI */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalData={filteredData.length} 
          itemsPerPage={itemsPerPage} 
        />
      </div>

      {/* MODAL TAMBAH SERTIFIKAT - STYLE ADMIN LSP */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
            <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Tambah Sertifikat Baru</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block' }}>Peserta UJK <span style={{color:'red'}}>*</span></label>
                  <select 
                    className="form-select"
                    style={{ width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px', outline: 'none' }}
                    value={formData.peserta_pengajuan_ujk_id}
                    onChange={(e) => setFormData({...formData, peserta_pengajuan_ujk_id: e.target.value})}
                    required
                  >
                    <option value="">Pilih Peserta...</option>
                    {pesertaList.map(p => <option key={p.id} value={p.id}>{p.namaPeserta}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block' }}>Nomor Sertifikat <span style={{color:'red'}}>*</span></label>
                  <input 
                    type="text" 
                    placeholder="Masukkan Nomor Sertifikat" 
                    style={{ width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px', outline: 'none' }} 
                    value={formData.no_sertifikat}
                    onChange={(e) => setFormData({...formData, no_sertifikat: e.target.value})} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block' }}>Tanggal Penerbitan <span style={{color:'red'}}>*</span></label>
                    <input 
                      type="date" 
                      style={{ width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px', outline: 'none' }} 
                      value={formData.tanggal_penerbitan}
                      onChange={(e) => setFormData({...formData, tanggal_penerbitan: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block' }}>Masa Berlaku <span style={{color:'red'}}>*</span></label>
                    <input 
                      type="date" 
                      style={{ width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px', outline: 'none' }} 
                      value={formData.masa_berlaku}
                      onChange={(e) => setFormData({...formData, masa_berlaku: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" icon="save">Simpan Sertifikat</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sertifikat;