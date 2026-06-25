import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';

// ─── NILAI AWAL FORM ──────────────────────────────────
const INITIAL_FORM = {
  peserta_pengajuan_ujk_id: '',
  no_sertifikat: '',
  no_registrasi: '',
  tanggal_penerbitan: '',
  masa_berlaku: '',
  status: 'Aktif',
};

const Sertifikat = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null); // <-- State baru untuk nyimpen array error Excel

  // State Live Search Peserta & Upload Excel
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'excel'
  const [excelFile, setExcelFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [searchPesertaKeyword, setSearchPesertaKeyword] = useState('');
  const [pesertaSuggestions, setPesertaSuggestions] = useState([]);
  const [selectedPesertaData, setSelectedPesertaData] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Aktif');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [hoveredFilterOption, setHoveredFilterOption] = useState(null);
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
      calculatedStatus = 'Kadaluwarsa';
    } else if (today < tglPenerbitan) {
      calculatedStatus = 'Tidak-Aktif';
    }

    setFormData(prev => ({ ...prev, status: calculatedStatus }));
  }, [formData.tanggal_penerbitan, formData.masa_berlaku]);

  // ─── FETCH UTAMA TABEL SERTIFIKAT ───────────────────
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/admin-lsp/list-sertifikat`, config);
      const fetchedData = response.data?.data || [];
      fetchedData.sort((a, b) => b.id - a.id);
      setData(fetchedData);
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
    setExcelFile(null);
    setIsDragging(false);
    setActiveTab('manual');
    setIsEditMode(false);
    setEditId(null);
  };

  // ─── DRAG AND DROP LOGIC ───────────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setExcelFile(file);
      } else {
        showAlert('error', 'Format Tidak Sesuai', 'Harap unggah file dengan format .xlsx atau .xls');
      }
    }
  };

  const handleExcelChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
    }
  };

  // ─── DOWNLOAD TEMPLATE EXCEL (dari backend) ──────────────────────────────
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin-lsp/download-template-sertifikat`,
        { headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );

      if (!response.ok) {
        showAlert('error', 'Gagal', 'Template tidak ditemukan. Hubungi administrator.');
        return;
      }

      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'template_import_sertifikat.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showAlert('error', 'Gagal', 'Terjadi kesalahan saat mengunduh template.');
      console.error('Download template error:', err);
    }
  };

  // ─── SUBMIT EXCEL KE DATABASE ──────────────────────────────────────────────
  const handleUploadExcel = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      showAlert('warning', 'Peringatan', 'Pilih file Excel terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const formDataObj = new FormData();
    formDataObj.append('file_excel', excelFile); // Default key name, adjust as needed

    try {
      const response = await axios.post(`${baseUrl}/api/admin-lsp/import-sertifikat-excel`, formDataObj, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      showAlert('success', 'Berhasil', response.data?.message || 'Data sertifikat lama berhasil diunggah!');
      fetchData();
      closeModal();
    } catch (error) {
      const errData = error.response?.data;
      if (error.response?.status === 422 && errData?.errors && Array.isArray(errData.errors)) {
        // Tampilkan Modal Laporan Validasi yang rapi
        setValidationErrors({
          message: errData.message || 'Ditemukan kesalahan pada data Excel.',
          list: errData.errors
        });
      } else {
        // Error umum
        showAlert('error', 'Gagal Diunggah', errData?.message || 'Terjadi kesalahan sistem saat menghubungi backend.');
      }
      console.error("Detail Error Upload Excel:", errData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── SUBMIT DATA ASLI KE DATABASE (REVISI ERROR HANDLING) ────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const response = await axios.put(`${baseUrl}/api/admin-lsp/sertifikat/${editId}`, formData, config);
        showAlert('success', 'Berhasil', response.data?.message || 'Sertifikat berhasil diperbarui!');
      } else {
        const response = await axios.post(`${baseUrl}/api/admin-lsp/tambah-data-sertifikat`, formData, config);
        showAlert('success', 'Berhasil', response.data?.message || 'Sertifikat berhasil disimpan!');
      }
      fetchData();
      closeModal();
    } catch (error) {
      const errData = error.response?.data;
      let errorMsg = errData?.message || 'Terjadi kesalahan sistem saat menghubungi backend.';

      // 🔥 MENANGKAP ERROR VALIDASI (422) DARI LARAVEL
      if (error.response?.status === 422 && errData?.errors) {
        const firstErrorKey = Object.keys(errData.errors)[0];
        errorMsg = errData.errors[firstErrorKey][0];
      } else if (errData?.error_detail) {
        errorMsg = errData.error_detail;
      }

      showAlert('error', 'Gagal Disimpan', errorMsg);
      console.error("Detail Error Submit Sertifikat:", errData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── EDIT & DELETE LOGIC ──────────────────────────────────────────────────
  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    
    // Parse the display date format back to YYYY-MM-DD for the input type="date"
    // Since we receive formatted string like '12 Mei 2026', we need raw format if possible, 
    // or we fetch the raw data directly from original response.
    // For now, let's try parsing or rely on the item if it has raw date (assuming item.tanggal_penerbitan might be formatted).
    // Let's assume the API returns the date in a way we can parse, or we just format it.
    // To be safe, we map the fields. If dates are complex, consider returning raw dates in listDataSertifikat.
    // For this example, we parse simple Indonesian format manually if needed, or pass the raw data from backend.
    
    // Convert 'd F Y' (e.g. 25 Juni 2026) to 'YYYY-MM-DD' if it's formatted.
    // A better way is if backend returned raw date. Since backend returns formatted date, we must parse it carefully.
    const parseIndonesianDate = (dateStr) => {
      if (!dateStr || dateStr === '-') return '';
      const months = { 'Januari':'01', 'Februari':'02', 'Maret':'03', 'April':'04', 'Mei':'05', 'Juni':'06', 'Juli':'07', 'Agustus':'08', 'September':'09', 'Oktober':'10', 'November':'11', 'Desember':'12' };
      const parts = dateStr.split(' ');
      if(parts.length === 3) return `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, '0')}`;
      return dateStr;
    };

    setFormData({
      peserta_pengajuan_ujk_id: item.peserta_pengajuan_ujk_id || '', 
      nama_peserta_lama: item.nama_peserta !== '-' ? item.nama_peserta : '',
      skema_sertifikasi_lama: item.skema_sertifikasi !== '-' ? item.skema_sertifikasi : '',
      no_sertifikat: item.no_sertifikat,
      no_registrasi: item.no_registrasi || '',
      tanggal_penerbitan: parseIndonesianDate(item.tanggal_penerbitan),
      masa_berlaku: parseIndonesianDate(item.masa_berlaku),
      status: item.status
    });

    if (item.peserta_pengajuan_ujk_id) {
      setSearchPesertaKeyword(`${item.nama_peserta} (NIK: ${item.nik})`);
      setSelectedPesertaData({ id: item.peserta_pengajuan_ujk_id });
    } else {
      setSearchPesertaKeyword('');
      setSelectedPesertaData(null);
    }
    
    setActiveTab('manual');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    showAlert('delete', 'Hapus Sertifikat', 'Yakin ingin menghapus sertifikat ini? Data tidak dapat dikembalikan.', async () => {
      try {
        await axios.delete(`${baseUrl}/api/admin-lsp/sertifikat/${id}`, config);
        showAlert('success', 'Berhasil', 'Sertifikat berhasil dihapus!');
        fetchData();
      } catch (error) {
        showAlert('error', 'Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan sistem.');
      }
    });
  };

  // ─── FILTER & PAGINASI ────────────────────────────────────────────────────────
  const filteredData = data.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (item.no_sertifikat || '').toLowerCase().includes(q) ||
                        (item.no_registrasi || '').toLowerCase().includes(q) ||
                        (item.nama_peserta || '').toLowerCase().includes(q);
    
    const matchStatus = filterStatus === 'Semua' ? true : item.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const badgeClass = (status) => {
    switch (status) {
      case 'Aktif': return 'badge success';
      case 'Tidak-Aktif': return 'badge warning';
      case 'Kadaluwarsa': return 'badge danger';
      default: return 'badge success';
    }
  };

  const inputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', outline: 'none', fontSize: '0.9rem' };
  const labelStyle = { fontWeight: 'bold', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', display: 'block' };

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f4f7fb', padding: '20px' }}>

      {alertConfig && (
        <AlertPopup 
          type={alertConfig.type} 
          title={alertConfig.title} 
          text={alertConfig.text} 
          onConfirm={alertConfig.onConfirm} 
          onCancel={alertConfig.onCancel} 
        />
      )}

      {/* --- MODAL LAPORAN VALIDASI EXCEL --- */}
      {validationErrors && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }}>
          <div style={{
            backgroundColor: '#fff', width: '90%', maxWidth: '700px',
            borderRadius: '12px', padding: '25px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '1.2rem' }}>
                <i className="fas fa-exclamation-triangle" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Laporan Validasi Data</h3>
                <p style={{ margin: '4px 0 0', color: '#ef4444', fontSize: '0.9rem', fontWeight: '500' }}>{validationErrors.message}</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                Sistem mendeteksi ada <strong>{validationErrors.list.length} error</strong> pada file Excel yang diunggah. Seluruh proses import telah dibatalkan untuk mencegah data ganda masuk ke dalam database. Silakan perbaiki file Excel Anda berdasarkan daftar di bawah ini, lalu unggah kembali.
              </p>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <tr>
                    <th style={{ padding: '10px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#334155', width: '100px' }}>Baris Excel</th>
                    <th style={{ padding: '10px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>Keterangan Error</th>
                  </tr>
                </thead>
                <tbody>
                  {validationErrors.list.map((err, i) => {
                    // Extract baris angka dari string error (opsional, karena error string langsung dari backend)
                    const match = err.match(/^Baris (\d+):/);
                    const baris = match ? match[1] : '-';
                    const msg = match ? err.replace(`Baris ${baris}:`, '').trim() : err;

                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 15px', color: '#ef4444', fontWeight: '600', backgroundColor: '#fef2f2' }}>Baris {baris}</td>
                        <td style={{ padding: '10px 15px', color: '#475569' }}>{msg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="button" variant="primary" onClick={() => setValidationErrors(null)}>Tutup & Perbaiki Excel</Button>
            </div>

          </div>
        </div>
      )}

      <div className="dashboard-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px', fontWeight: 'bold' }}>Manajemen Sertifikat</h2>
        <p className="text-muted">Kelola data penerbitan sertifikat kompetensi untuk peserta UJK langsung dari database.</p>
      </div>

      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', flex: '1', minWidth: '250px', maxWidth: '600px' }}>
            <div style={{ flex: '1', position: 'relative' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
              <input type="text" placeholder="Cari No. Sertifikat / Registrasi / Nama..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ height: '42px', width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <div 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{ 
                  height: '42px',
                  padding: '0 15px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  backgroundColor: 'white', 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: '500',
                  color: '#475569',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
              >
                <span>Status: {filterStatus === 'Tidak-Aktif' ? 'Tidak Aktif' : filterStatus}</span>
                <i className={`fas fa-chevron-${showFilterDropdown ? 'up' : 'down'}`} style={{ fontSize: '0.8rem', color: '#94a3b8' }}></i>
              </div>

              {showFilterDropdown && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  zIndex: 50,
                  listStyle: 'none',
                  padding: '5px'
                }}>
                  {['Aktif', 'Kadaluwarsa', 'Tidak-Aktif', 'Semua'].map((statusOption) => {
                    const isSelected = filterStatus === statusOption;
                    const isHovered = hoveredFilterOption === statusOption;
                    const isActive = isSelected || isHovered;
                    
                    let bg = 'transparent';
                    let text = '#475569';
                    if (isActive) {
                      if (statusOption === 'Aktif') { bg = '#dcfce7'; text = '#166534'; }
                      else if (statusOption === 'Kadaluwarsa') { bg = '#fee2e2'; text = '#991b1b'; }
                      else if (statusOption === 'Tidak-Aktif') { bg = '#fef3c7'; text = '#92400e'; }
                      else { bg = '#f1f5f9'; text = '#0f172a'; }
                    }

                    return (
                      <li 
                        key={statusOption}
                        onClick={() => {
                          setFilterStatus(statusOption);
                          setCurrentPage(1);
                          setShowFilterDropdown(false);
                        }}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          backgroundColor: bg,
                          color: text,
                          fontWeight: isSelected ? '600' : '500',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onMouseEnter={() => setHoveredFilterOption(statusOption)}
                        onMouseLeave={() => setHoveredFilterOption(null)}
                      >
                        {statusOption === 'Tidak-Aktif' ? 'Tidak Aktif' : statusOption}
                        {isSelected && <i className="fas fa-check" style={{ color: text, fontSize: '0.85rem' }}></i>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <Button variant="primary" icon="plus" onClick={() => setShowModal(true)}>Tambah Sertifikat</Button>
        </div>

        <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th style={{ width: '25%' }}>No. Dokumen</th>
                <th style={{ width: '25%' }}>Nama Peserta</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Tgl. Penerbitan</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Masa Berlaku</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px', display: 'block' }}></i>
                    Memuat Data Sertifikat...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{item.no_sertifikat}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Reg: {item.no_registrasi}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#334155', display: 'block' }}>{item.nama_peserta}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>{item.skema_sertifikasi}</span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>{item.tanggal_penerbitan}</td>
                    <td style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>{item.masa_berlaku}</td>
                    <td style={{ textAlign: 'center' }}><span className={badgeClass(item.status)}>{item.status || 'Aktif'}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer', transition: '0.2s' }} title="Edit"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fef2f2', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', transition: '0.2s' }} title="Hapus"><i className="fas fa-trash-alt"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Tidak ada data sertifikat ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredData.length} itemsPerPage={itemsPerPage} />
      </div>

      {/* ── MODAL TAMBAH SERTIFIKAT ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '550px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>

            <div className="modal-header" style={{ padding: '0', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem' }}><i className={isEditMode ? "fas fa-edit" : "fas fa-plus-circle"} style={{ marginRight: '8px', color: '#3b82f6' }}></i>{isEditMode ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h3>
                <button onClick={closeModal} disabled={isSubmitting} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}><i className="fas fa-times"></i></button>
              </div>
              <div style={{ display: 'flex', width: '100%', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setActiveTab('manual')}
                  style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: activeTab === 'manual' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'manual' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'manual' ? 'bold' : 'normal', cursor: 'pointer', transition: '0.2s' }}
                >
                  <i className="fas fa-keyboard" style={{ marginRight: '6px' }}></i> {isEditMode ? 'Form Edit Sertifikat' : 'Input Sertifikat Baru'}
                </button>
                {!isEditMode && (
                  <button
                    onClick={() => setActiveTab('excel')}
                    style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: activeTab === 'excel' ? '3px solid #10b981' : '3px solid transparent', color: activeTab === 'excel' ? '#10b981' : '#64748b', fontWeight: activeTab === 'excel' ? 'bold' : 'normal', cursor: 'pointer', transition: '0.2s' }}
                  >
                    <i className="fas fa-file-excel" style={{ marginRight: '6px' }}></i> Upload Sertifikat Lama
                  </button>
                )}
              </div>
            </div>

            {activeTab === 'manual' ? (
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ padding: '20px' }}>

                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <i className="fas fa-info-circle" style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }}></i>
                    <span style={{ fontSize: '0.82rem', color: '#1e40af', lineHeight: '1.5' }}>Sertifikat hanya dapat dibuat jika peserta memiliki status keputusan uji <strong>Kompeten</strong> di database.</span>
                  </div>

                  {!(isEditMode && formData.peserta_pengajuan_ujk_id === '') && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={labelStyle}>Pilih Peserta (Live Search)</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Ketik NIK atau Nama Peserta..."
                          value={searchPesertaKeyword}
                          onChange={(e) => handleSearchPeserta(e.target.value)}
                          style={{ ...inputStyle, paddingRight: '35px' }}
                          disabled={isEditMode}
                        />
                        {selectedPesertaData && !isEditMode && (
                          <i className="fas fa-check-circle" style={{ position: 'absolute', right: '12px', top: '12px', color: '#10b981' }}></i>
                        )}
                        
                        {pesertaSuggestions.length > 0 && !isEditMode && (
                          <ul style={{ position: 'absolute', zIndex: 10, width: '100%', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', maxHeight: '200px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: '5px 0 0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            {pesertaSuggestions.map(p => (
                              <li key={p.id} onClick={() => handleSelectPeserta(p)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                                <strong style={{ color: '#0f172a', display: 'block' }}>{p.namaPeserta}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>NIK: {p.nik} | {p.detail_pengajuan?.skema?.namaSkema}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {!selectedPesertaData && formData.peserta_pengajuan_ujk_id === '' && !isEditMode && (
                        <small style={{ color: '#ef4444', marginTop: '5px', display: 'block' }}>* Wajib memilih peserta yang valid dari daftar.</small>
                      )}
                    </div>
                  )}

                  {isEditMode && formData.peserta_pengajuan_ujk_id === '' && (
                    <>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Nama Peserta (Data Lama)</label>
                        <input type="text" value={formData.nama_peserta_lama || ''} onChange={(e) => setFormData({ ...formData, nama_peserta_lama: e.target.value })} style={inputStyle} required />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Skema Sertifikasi (Data Lama)</label>
                        <input type="text" value={formData.skema_sertifikasi_lama || ''} onChange={(e) => setFormData({ ...formData, skema_sertifikasi_lama: e.target.value })} style={inputStyle} required />
                      </div>
                    </>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={labelStyle}>Nomor Sertifikat <span style={{ color: 'red' }}>*</span></label>
                      <input type="text" placeholder="Masukkan No. Sertifikat" style={inputStyle} value={formData.no_sertifikat} onChange={(e) => setFormData({ ...formData, no_sertifikat: e.target.value })} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Nomor Registrasi <span style={{ color: 'red' }}>*</span></label>
                      <input type="text" placeholder="Masukkan No. Registrasi" style={inputStyle} value={formData.no_registrasi} onChange={(e) => setFormData({ ...formData, no_registrasi: e.target.value })} required />
                    </div>
                  </div>

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

                  <div style={{ marginBottom: '5px' }}>
                    <label style={labelStyle}>Status Sertifikat (Otomatis)</label>
                    <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={badgeClass(formData.status)}>{formData.status}</span>
                    </div>
                  </div>

                </div>

                <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                  <Button type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>Batal</Button>
                  <Button type="submit" variant="primary" icon="save" disabled={isSubmitting || (!selectedPesertaData && formData.peserta_pengajuan_ujk_id === '' && !isEditMode)} loading={isSubmitting}>
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan Sertifikat'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUploadExcel}>
                <div className="modal-body" style={{ padding: '20px' }}>
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <i className="fas fa-lightbulb" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }}></i>
                    <span style={{ fontSize: '0.82rem', color: '#166534', lineHeight: '1.5' }}>Gunakan fitur ini untuk melakukan mass-upload data sertifikat lama secara sekaligus. Pastikan file menggunakan format <strong>.xlsx</strong>.</span>
                  </div>

                  {/* Baris header: label + tombol download template */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Upload File Excel (.xlsx)</label>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', border: '1.5px solid #10b981', borderRadius: '6px',
                        backgroundColor: '#f0fdf4', color: '#059669', fontSize: '0.8rem',
                        fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; e.currentTarget.style.color = '#059669'; }}
                    >
                      <i className="fas fa-download" />
                      Download Template
                    </button>
                  </div>

                  <label
                    className={`drag-drop-zone ${isDragging ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '40px 20px', borderRadius: '12px', minHeight: '200px', textAlign: 'center', position: 'relative'
                    }}
                  >
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleExcelChange}
                      style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />

                    {excelFile ? (
                      <>
                        <i className="fas fa-file-excel" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '15px' }}></i>
                        <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.1rem' }}>{excelFile.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{(excelFile.size / 1024).toFixed(2)} KB</span>
                        <div style={{ marginTop: '15px', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 'bold' }}>Ganti File</div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: isDragging ? '#d1fae5' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', transition: 'all 0.3s' }}>
                          <i className={`fas fa-cloud-upload-alt ${isDragging ? 'text-emerald-500' : 'text-indigo-500'}`} style={{ fontSize: '2rem' }}></i>
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.1rem' }}>Drag & Drop file Excel di sini</h4>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>atau klik untuk memilih file manual</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                  <Button variant="secondary" onClick={closeModal} disabled={isSubmitting}>Batal</Button>
                  <Button type="submit" variant="success" icon={isSubmitting ? 'spinner' : 'upload'} disabled={isSubmitting || !excelFile}>{isSubmitting ? 'Mengunggah...' : 'Upload Excel'}</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sertifikat;