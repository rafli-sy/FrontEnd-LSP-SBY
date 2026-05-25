import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';

// ─── NILAI AWAL FORM ───────────────────────────────────────────────────────────
const INITIAL_FORM = {
  peserta_pengajuan_ujk_id: '',
  no_sertifikat: '',
  tanggal_penerbitan: '',
  masa_berlaku: '',
  status: 'Aktif',
};

const Sertifikat = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  // State Live Search Peserta
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [searchPesertaKeyword, setSearchPesertaKeyword] = useState('');
  const [pesertaSuggestions, setPesertaSuggestions] = useState([]);
  const [selectedPesertaData, setSelectedPesertaData] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── CONFIG API UTAMA ────────────────────────────────────────────────────────
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  
  const config = useMemo(() => ({ 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true' 
    } 
  }), [token]);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ 
      type, 
      title, 
      text, 
      onConfirm: () => { if (action) action(); setAlertConfig(null); }, 
      onCancel: () => setAlertConfig(null) 
    });
  };

  // ─── KALKULASI STATUS OTOMATIS BERDASARKAN TANGGAL ───────────────────────────
  useEffect(() => {
    if (!formData.tanggal_penerbitan || !formData.masa_berlaku) {
      setFormData(prev => ({ ...prev, status: 'Aktif' }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tglPenerbitan = new Date(formData.tanggal_penerbitan);
    tglPenerbitan.setHours(0, 0, 0, 0);

    const tglMasaBerlaku = new Date(formData.masa_berlaku);
    tglMasaBerlaku.setHours(0, 0, 0, 0);

    let calculatedStatus = 'Aktif';

    if (today > tglMasaBerlaku) {
      calculatedStatus = 'Kedaluwarsa';
    } else if (today < tglPenerbitan) {
      calculatedStatus = 'Tidak Aktif';
    }

    setFormData(prev => ({ ...prev, status: calculatedStatus }));
  }, [formData.tanggal_penerbitan, formData.masa_berlaku]);

  // ─── FETCH UTAMA TABEL SERTIFIKAT ───────────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Langsung point ke admin-lsp
      const response = await axios.get(`${baseUrl}/api/admin-lsp/sertifikat`, config);
      setData(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching sertifikat:', error);
      setData([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── LIVE SEARCH PESERTA KE BACKEND ─────────────────────────────────────────
  const handleSearchPeserta = async (keyword) => {
    setSearchPesertaKeyword(keyword);
    
    if (selectedPesertaData) {
      setFormData({ ...formData, peserta_pengajuan_ujk_id: '' });
      setSelectedPesertaData(null);
    }

    if (keyword.trim() === '') {
      setPesertaSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/api/admin-lsp/peserta-kompeten?keyword=${keyword}`, config);
      setPesertaSuggestions(response.data?.data || []);
    } catch (error) {
      console.error('Error live search peserta:', error);
      setPesertaSuggestions([]);
    }
  };

  const handleSelectPeserta = (peserta) => {
    setFormData({ ...formData, peserta_pengajuan_ujk_id: peserta.id });
    setSelectedPesertaData(peserta);
    setSearchPesertaKeyword(`${peserta.namaPeserta} (NIK: ${peserta.nik})`);
    setPesertaSuggestions([]);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(INITIAL_FORM);
    setSearchPesertaKeyword('');
    setPesertaSuggestions([]);
    setSelectedPesertaData(null);
  };

  // ─── SUBMIT DATA ASLI KE DATABASE ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/api/admin-lsp/tambah-data-sertifikat`, formData, config);
      showAlert('success', 'Berhasil', response.data?.message || 'Sertifikat berhasil disimpan!');
      fetchData();
      closeModal();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan sistem.';
      showAlert('error', 'Gagal', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── FILTER & PAGINASI ────────────────────────────────────────────────────────
  const filteredData = data.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.no_sertifikat || '').toLowerCase().includes(q) ||
      (item.peserta?.namaPeserta || '').toLowerCase().includes(q)
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

  const badgeClass = (status) => {
    switch (status) {
      case 'Aktif':       return 'badge success';
      case 'Tidak Aktif': return 'badge warning';
      case 'Kedaluwarsa': return 'badge danger';
      default:            return 'badge success';
    }
  };

  const inputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', outline: 'none', fontSize: '0.9rem' };
  const labelStyle = { fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', display: 'block' };

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f4f7fb', padding: '20px' }}>
      
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />}

      <div className="dashboard-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px', fontWeight: 'bold' }}>Manajemen Sertifikat</h2>
        <p className="text-muted">Kelola data penerbitan sertifikat kompetensi untuk peserta UJK langsung dari database.</p>
      </div>

      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari No. Sertifikat atau Nama Peserta..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
          </div>
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Tambah Sertifikat</Button>
        </div>

        <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%',  textAlign: 'center' }}>No.</th>
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
                    <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px', display: 'block' }}></i>
                    Memuat Data Sertifikat...
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
                    <td style={{ textAlign: 'center' }}><span className={badgeClass(item.status)}>{item.status || 'Aktif'}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Tidak ada data sertifikat ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredData.length} itemsPerPage={itemsPerPage} />
      </div>

      {/* ── MODAL TAMBAH SERTIFIKAT ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
            
            <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem' }}><i className="fas fa-plus-circle" style={{ marginRight: '8px', color: '#3b82f6' }}></i>Tambah Sertifikat Baru</h3>
              <button onClick={closeModal} disabled={isSubmitting} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}><i className="fas fa-times"></i></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: '20px' }}>

                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <i className="fas fa-info-circle" style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }}></i>
                  <span style={{ fontSize: '0.82rem', color: '#1e40af', lineHeight: '1.5' }}>Sertifikat hanya dapat dibuat jika peserta memiliki status keputusan uji <strong>Kompeten</strong> di database.</span>
                </div>

                {/* 1. Live Search Input Peserta */}
                <div style={{ marginBottom: '15px', position: 'relative' }}>
                  <label style={labelStyle}>Cari Peserta UJK (Nama / NIK) <span style={{ color: 'red' }}>*</span></label>
                  <input 
                    type="text" 
                    placeholder="Ketik Nama atau NIK Peserta..." 
                    style={inputStyle}
                    value={searchPesertaKeyword}
                    onChange={(e) => handleSearchPeserta(e.target.value)}
                    required
                  />
                  
                  {/* Dropdown Hasil Pencarian DB */}
                  {pesertaSuggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', marginTop: '4px' }}>
                      {pesertaSuggestions.map((peserta) => (
                        <div 
                          key={peserta.id}
                          onClick={() => handleSelectPeserta(peserta)}
                          style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '0.88rem' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                        >
                          <strong>{peserta.namaPeserta}</strong> <span style={{ color: '#64748b' }}>(NIK: {peserta.nik})</span>
                          <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Skema: {peserta.detailPengajuan?.skema?.namaSkema || '-'}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPesertaData && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '500' }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '4px' }}></i> Peserta Terpilih Terkunci.
                    </div>
                  )}
                </div>

                {/* 2. Nomor Sertifikat */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>Nomor Sertifikat <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" placeholder="Masukkan Nomor Sertifikat" style={inputStyle} value={formData.no_sertifikat} onChange={(e) => setFormData({ ...formData, no_sertifikat: e.target.value })} required />
                </div>

                {/* 3. Tanggal Penerbitan & Masa Berlaku */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={labelStyle}>Tanggal Penerbitan <span style={{ color: 'red' }}>*</span></label>
                    <input type="date" style={inputStyle} value={formData.tanggal_penerbitan} onChange={(e) => setFormData({ ...formData, tanggal_penerbitan: e.target.value })} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Masa Berlaku <span style={{ color: 'red' }}>*</span></label>
                    <input type="date" style={inputStyle} value={formData.masa_berlaku} min={formData.tanggal_penerbitan || undefined} onChange={(e) => setFormData({ ...formData, masa_berlaku: e.target.value })} required />
                  </div>
                </div>

                {/* 4. Tampilan Status Otomatis */}
                <div style={{ marginBottom: '5px' }}>
                  <label style={labelStyle}>Status Sertifikat (Otomatis)</label>
                  <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={badgeClass(formData.status)}>{formData.status}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {formData.status === 'Kedaluwarsa' && '• Melampaui batas masa berlaku.'}
                      {formData.status === 'Tidak Aktif' && '• Belum memasuki tanggal terbit resmi.'}
                      {formData.status === 'Aktif' && '• Sertifikat sah dan sedang berjalan.'}
                    </span>
                  </div>
                </div>

              </div>

              <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                <Button variant="secondary" onClick={closeModal} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" variant="primary" icon={isSubmitting ? 'spinner' : 'save'} disabled={isSubmitting || !formData.peserta_pengajuan_ujk_id}>{isSubmitting ? 'Menyimpan...' : 'Simpan Sertifikat'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sertifikat;