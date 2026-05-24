import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';
import TablePeserta from '../TablePeserta/TablePeserta'; // PERBAIKAN: Import komponen tabel

const FormPengajuanUJK = () => {
  const navigate = useNavigate();
  const { userData } = useUser(); 
  
  const [usulan, setUsulan] = useState([]);
  const [masterSkema, setMasterSkema] = useState([]);
  const [masterTuk, setMasterTuk] = useState([]);
  const [masterAnggaran, setMasterAnggaran] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [viewPdf, setViewPdf] = useState(null); 
  const alertTimer = useRef(null);

  // STATE BARU: Untuk menampilkan tabel peserta
  const [viewPeserta, setViewPeserta] = useState(null);

  // STATE UNTUK POP-UP PEMILIHAN SKEMA & TUK
  const [activeModal, setActiveModal] = useState({ type: null, targetId: null });
  const [modalSearch, setModalSearch] = useState('');

  // Fallback Token (Session atau Local)
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token'); 
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';

  // --- INISIALISASI FORM STATE ---
  const initialForm = { sumber_anggaran_id: '', nomorSurat: '', fileSurat: null };
  const initialSkema = { id: Date.now(), skema_id: '', namaSkema: '', jejaring_id: '', namaTuk: '', tglMulai: '', tglSelesai: '', fileNominatif: null, fileKurikulum: null, jumlahAsesi: 0 };
  
  const [formData, setFormData] = useState(initialForm);
  const [skemaUsulan, setSkemaUsulan] = useState([{ ...initialSkema }]);

  const closeAlert = () => { setAlert(null); if (alertTimer.current) clearTimeout(alertTimer.current); };

  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (activeModal.type) { setActiveModal({ type: null, targetId: null }); e.preventDefault(); }
      else if (viewPeserta) { setViewPeserta(null); e.preventDefault(); }
      else if (viewPdf) { setViewPdf(null); e.preventDefault(); }
      else if (showForm) { setShowForm(false); setEditingId(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [showForm, activeModal, viewPdf, viewPeserta]);

  // --- FETCH MASTER DATA & DRAFTS ---
  useEffect(() => {
    if (token) {
      fetchMasterData();
      fetchDrafts();
    } else {
      console.warn("Token tidak ditemukan. Pastikan Anda sudah login.");
    }
  }, [token]);

  const fetchMasterData = async () => {
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      };
      
      const [resSkema, resTuk, resAnggaran] = await Promise.all([
        fetch(`${apiUrl}/api/admin-blk/list-skema-pengajuan`,  { method: 'GET', headers }),
        fetch(`${apiUrl}/api/master/jejaring`, { headers }),
        fetch(`${apiUrl}/api/master/sumber-anggaran`, { headers })
      ]);

      if(resSkema.status === 401 || resTuk.status === 401 || resAnggaran.status === 401) {
         console.error("Akses ditolak (401). Token invalid/expired.");
         return;
      }

      const [dataSkema, dataTuk, dataAnggaran] = await Promise.all([resSkema.json(), resTuk.json(), resAnggaran.json()]);

      if (dataSkema.status === 'success') setMasterSkema(dataSkema.data);
      if (dataTuk.status === 'success') setMasterTuk(dataTuk.data);
      if (dataAnggaran.status === 'success') setMasterAnggaran(dataAnggaran.data);
    } catch (error) {
      console.error("Gagal memuat master data:", error);
    }
  };

  const fetchDrafts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin-blk/draft-pengajuan`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      if (res.status === 401) return;

      const data = await res.json();
      if (data.status === 'success') {
        setUsulan(data.data);
      }
    } catch (error) {
      console.error("Gagal memuat draft:", error);
    }
  };

  // --- HANDLER FORM & FILE ---
  const handleInputGlobalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fileSurat') {
      setFormData({ ...formData, fileSurat: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkemaFileChange = (id, fieldName, file) => {
    setSkemaUsulan(skemaUsulan.map(s => s.id === id ? { ...s, [fieldName]: file } : s));
  };

  const handleAddSkema = () => setSkemaUsulan([...skemaUsulan, { ...initialSkema, id: Date.now() }]);
  const handleRemoveSkema = (id) => setSkemaUsulan(skemaUsulan.filter(s => s.id !== id));

  // --- HANDLER EDIT DATA ---
  const handleEdit = (item) => {
    setShowForm(true);
    setEditingId(item.id);
    setFormData({
      sumber_anggaran_id: item.sumber_anggaran_id || '',
      nomorSurat: item.nomor_surat_pengajuan || '',
      fileSurat: null // File lama tersimpan di backend, kosongkan input frontend
    });

    const mappedSkema = (item.detail_skema || item.detailSkema || []).map(ds => ({
      id: ds.id || Date.now() + Math.random(),
      skema_id: ds.skema_id || '',
      namaSkema: ds.skema?.namaSkema || '',
      jejaring_id: ds.jejaring_id || '',
      namaTuk: ds.tuk?.namaInstitusi || '',
      tglMulai: ds.tanggal_mulai || '',
      tglSelesai: ds.tanggal_selesai || '',
      jumlahAsesi: ds.jumlah_peserta || 0,
      fileNominatif: null,
      fileKurikulum: null
    }));
    
    setSkemaUsulan(mappedSkema.length > 0 ? mappedSkema : [{...initialSkema}]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SUBMIT PENGJUAN (CREATE / UPDATE DRAFT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: 'save', title: 'Menyimpan...', text: 'Mohon tunggu proses upload file.' });

    const formPayload = new FormData();
    formPayload.append('sumber_anggaran_id', formData.sumber_anggaran_id);
    formPayload.append('nomor_surat_pengajuan', formData.nomorSurat);
    
    if (formData.fileSurat) {
      formPayload.append('file_surat_pengajuan', formData.fileSurat);
    }

    skemaUsulan.forEach((skema, index) => {
      formPayload.append(`skemas[${index}][skema_id]`, skema.skema_id);
      formPayload.append(`skemas[${index}][jejaring_id]`, skema.jejaring_id);
      formPayload.append(`skemas[${index}][tanggal_mulai]`, skema.tglMulai);
      formPayload.append(`skemas[${index}][tanggal_selesai]`, skema.tglSelesai);
      if (skema.fileNominatif) formPayload.append(`skemas[${index}][file_nominatif]`, skema.fileNominatif);
      if (skema.fileKurikulum) formPayload.append(`skemas[${index}][file_kurikulum]`, skema.fileKurikulum);
    });

    try {
      const endpoint = editingId 
        ? `${apiUrl}/api/admin-blk/update-draft-pengajuan/${editingId}` 
        : `${apiUrl}/api/admin-blk/pengajuan-ujk`;
      
      const response = await fetch(endpoint, {
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }, 
        body: formPayload
      });

      const resData = await response.json();

      if (response.ok && resData.status === 'success') {
        setAlert({ type: 'success', title: 'Tersimpan!', text: 'Draft berhasil disimpan.', onCancel: closeAlert });
        setShowForm(false);
        setEditingId(null);
        fetchDrafts(); 
      } else {
        setAlert({ type: 'warning', title: 'Gagal Menyimpan', text: resData.message || 'Periksa kembali data Anda.', onCancel: closeAlert });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', title: 'Error', text: 'Terjadi kesalahan jaringan atau server.', onCancel: closeAlert });
    }
  };

  // --- KIRIM PENGAJUAN (SUBMIT KE LSP) --- PERBAIKAN POP-UP BUKAN window.confirm
  const handleKirimLsp = (id) => {
    setAlert({
      type: 'warning',
      title: 'Kirim Pengajuan?',
      text: 'Kirim pengajuan ini ke LSP? Data tidak bisa diubah setelah dikirim.',
      onConfirm: async () => {
        setAlert({ type: 'info', title: 'Memproses...', text: 'Mengirim data ke LSP...' });
        try {
          const response = await fetch(`${apiUrl}/api/admin-blk/simpan-pengajuan-ujk/${id}`, {
            method: 'PUT',
            headers: { 
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'ngrok-skip-browser-warning': '69420'
            }
          });
          const resData = await response.json();
          if (response.ok) {
            setAlert({ type: 'success', title: 'Terkirim', text: 'Data berhasil dikirim ke LSP. Silakan cek Dashboard.', onCancel: closeAlert, onConfirm: closeAlert });
            fetchDrafts();
          } else {
            setAlert({ type: 'error', title: 'Gagal Kirim', text: resData.message || 'Terjadi kesalahan saat pengiriman.', onCancel: closeAlert, onConfirm: closeAlert });
          }
        } catch (error) {
          console.error(error);
          setAlert({ type: 'error', title: 'Error', text: 'Gagal memproses data ke server.', onCancel: closeAlert, onConfirm: closeAlert });
        }
      },
      onCancel: closeAlert
    });
  };

  // --- REVISI: FUNGSI HAPUS DRAFT (DENGAN KONFIRMASI) ---
  const handleDelete = (id) => {
    setAlert({
      type: 'warning',
      title: 'Hapus Draft?',
      text: 'Apakah Anda yakin ingin menghapus draft ini secara permanen?',
      onConfirm: async () => {
        setAlert({ type: 'info', title: 'Menghapus...', text: 'Mohon tunggu...' });
        try {
          const res = await fetch(`${apiUrl}/api/admin-blk/cancel-pengajuan-ujk/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'ngrok-skip-browser-warning': '69420' }});
          if (res.ok) {
            setAlert({ type: 'success', title: 'Terhapus', text: 'Draft berhasil dihapus.', onConfirm: () => { closeAlert(); fetchDrafts(); } });
          } else {
            setAlert({ type: 'error', title: 'Gagal', text: 'Gagal menghapus.' });
          }
        } catch(e) { setAlert({ type: 'error', title: 'Error', text: 'Koneksi gagal.' }); }
      },
      onCancel: closeAlert
    });
  };

  // Pagination Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  const totalPages = Math.ceil(usulan.length / itemsPerPage) || 1;
  const paginatedUsulan = usulan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Format Tanggal untuk Table (Tampilan Cantik)
  const formatTanggal = (start, end) => {
    if (!start || !end) return '-';
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} - ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getFullYear()}`;
  };

  // --- RENDER TABEL PESERTA ---
  if (viewPeserta) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setViewPeserta(null)}>Kembali ke Draft</Button>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Nominatif Peserta</h2>
            <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPeserta.skema?.namaSkema}</strong></p>
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '25px' }}>
           <TablePeserta 
             dataPeserta={viewPeserta.peserta_pengajuan_ujk || viewPeserta.pesertaPengajuanUjk || []} 
             skemaName={viewPeserta.skema?.namaSkema || 'Skema'} 
             isAdmin={false} 
             asesorList={[]}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content">
      {alert && <AlertPopup type={alert.type} title={alert.title} text={alert.text} onConfirm={alert.onConfirm} onCancel={alert.onCancel || closeAlert} />}
      
      {showForm ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => { setShowForm(false); setEditingId(null); }}>Kembali</Button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{editingId ? 'Edit Pengajuan UJK' : 'Pengajuan UJK Baru'}</h2>
                <p className="text-muted" style={{ margin: 0 }}>Lengkapi dokumen persyaratan dan data asesi.</p>
              </div>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
             <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                
                {/* KOLOM KIRI: ADMINISTRASI */}
                <div className="dashboard-card" style={{ flex: '1 1 300px', padding: '24px', margin: 0 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}><i className="fas fa-file-signature text-blue" style={{marginRight: 8}}></i>Administrasi</h3>
                  
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Nomor Surat Pengajuan <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" className="form-input" name="nomorSurat" value={formData.nomorSurat} onChange={handleInputGlobalChange} required />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Jenis Pendanaan <span style={{color: '#ef4444'}}>*</span></label>
                    <select className="form-input" name="sumber_anggaran_id" value={formData.sumber_anggaran_id} onChange={handleInputGlobalChange} required>
                      <option value="">---Pilih Sumber Dana---</option>
                      {masterAnggaran.map(ang => (
                        <option key={ang.id} value={ang.id}>{ang.namaAnggaran}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Upload Surat Pengajuan (PDF) {editingId ? '' : <span style={{color: '#ef4444'}}>*</span>}</label>
                    <input type="file" name="fileSurat" accept=".pdf" className="form-input" style={{ padding: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1' }} onChange={handleInputGlobalChange} required={!editingId} />
                    {editingId && <small className="text-muted" style={{display: 'block', marginTop: '4px'}}>Biarkan kosong jika tidak ingin mengubah file surat lama.</small>}
                  </div>
                </div>

                {/* KOLOM KANAN: SKEMA */}
                <div style={{ flex: '2.5 1 600px' }}>
                  <div className="dashboard-card" style={{ padding: '24px', margin: 0 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}><i className="fas fa-users-cog text-blue" style={{marginRight: 8}}></i> Data Pelaksanaan</h3>
                    
                    {skemaUsulan.map((skema, index) => (
                      <div key={skema.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
                         
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                           <h4 style={{ margin: 0, color: '#1e293b' }}><span className="badge primary"><i className="fas fa-layer-group"></i> Skema {index + 1}</span></h4>
                           {index > 0 && <Button type="button" variant="outline-danger" size="sm" icon="trash" onClick={() => handleRemoveSkema(skema.id)}>Hapus</Button>}
                         </div>

                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                           {/* TOMBOL MODAL SKEMA */}
                           <div className="form-group" style={{ margin: 0 }}>
                             <label>Pilihan Skema Kompetensi <span style={{color: '#ef4444'}}>*</span></label>
                             <button 
                               type="button" 
                               className="form-input" 
                               style={{ textAlign: 'left', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                               onClick={() => { setActiveModal({ type: 'skema', targetId: skema.id }); setModalSearch(''); }}
                             >
                               <span style={{ color: skema.skema_id ? '#0f172a' : '#94a3b8' }}>{skema.namaSkema || '-- Klik untuk Mencari Skema --'}</span>
                               <i className="fas fa-search text-muted"></i>
                             </button>
                           </div>

                           {/* TOMBOL MODAL TUK */}
                           <div className="form-group" style={{ margin: 0 }}>
                             <label>Lokasi Ujian (TUK) <span style={{color: '#ef4444'}}>*</span></label>
                             <button 
                               type="button" 
                               className="form-input" 
                               style={{ textAlign: 'left', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                               onClick={() => { setActiveModal({ type: 'tuk', targetId: skema.id }); setModalSearch(''); }}
                             >
                               <span style={{ color: skema.jejaring_id ? '#0f172a' : '#94a3b8' }}>{skema.namaTuk || '-- Klik untuk Memilih TUK --'}</span>
                               <i className="fas fa-search text-muted"></i>
                             </button>
                           </div>
                         </div>

                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label>Tgl Mulai <span style={{color: '#ef4444'}}>*</span></label>
                              <input type="date" className="form-input" value={skema.tglMulai} onChange={(e) => setSkemaUsulan(skemaUsulan.map(s => s.id === skema.id ? {...s, tglMulai: e.target.value} : s))} required/>
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label>Tgl Selesai <span style={{color: '#ef4444'}}>*</span></label>
                              <input type="date" className="form-input" value={skema.tglSelesai} onChange={(e) => setSkemaUsulan(skemaUsulan.map(s => s.id === skema.id ? {...s, tglSelesai: e.target.value} : s))} required/>
                            </div>
                         </div>

                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label>Kurikulum Program (PDF) {editingId ? '' : <span style={{color: '#ef4444'}}>*</span>}</label>
                              <input type="file" accept=".pdf" className="form-input" style={{ padding: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1' }} onChange={(e) => handleSkemaFileChange(skema.id, 'fileKurikulum', e.target.files[0])} required={!editingId}/>
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label>Data Nominatif Asesi (Excel) {editingId ? '' : <span style={{color: '#ef4444'}}>*</span>}</label>
                              <input type="file" accept=".xls, .xlsx, .csv" className="form-input" style={{ padding: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1' }} onChange={(e) => handleSkemaFileChange(skema.id, 'fileNominatif', e.target.files[0])} required={!editingId}/>
                            </div>
                         </div>

                      </div>
                    ))}
                    
                    {!editingId && <Button type="button" variant="dashed" size="lg" isFullWidth icon="plus-circle" onClick={handleAddSkema}>Tambah Skema Ujian Lainnya</Button>}
                  </div>
                </div>
             </div>
             
             <div style={{ marginTop: '24px' }}>
               <Button type="submit" variant="primary" size="lg" isFullWidth icon="save" style={{ padding: '16px', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                 {editingId ? 'Simpan Perubahan Draft' : 'Simpan Sebagai Draft'}
               </Button>
             </div>
          </form>
        </div>
      ) : (
        <div className="fade-in-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Draft Pengajuan UJK</h2>
              <p className="text-muted" style={{ margin: 0 }}>Kelola dan kirim draft pengajuan ke pihak LSP.</p>
            </div>
            <Button variant="primary" icon="plus" onClick={() => { setFormData(initialForm); setSkemaUsulan([{...initialSkema, id: Date.now()}]); setShowForm(true); }}>
              Buat Pengajuan Baru
            </Button>
          </div>
          
          <div className="dashboard-card fade-in-content">
            <div className="table-responsive">
              <table className="admin-table">
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ width: '4%', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '14%' }}>Nomor Surat & Dana</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Surat Pengajuan</th>
                    <th style={{ width: '18%' }}>Lokasi TUK</th>
                    <th style={{ width: '22%' }}>Skema & Tanggal</th>
                    <th style={{ width: '8%', textAlign: 'center' }}>Kurikulum</th>
                    <th style={{ width: '8%', textAlign: 'center' }}>Peserta</th>
                    <th style={{ width: '16%', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsulan.length > 0 ? (
                    paginatedUsulan.map((item, index) => (
                      <tr key={item.id}>
                        <td style={{ textAlign: 'center', color: '#64748b', verticalAlign: 'top', paddingTop: '20px' }}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        
                        <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                          <strong style={{color: '#0f172a', display: 'block'}}>{item.nomor_surat_pengajuan || '-'}</strong>
                          <span className="badge info" style={{ marginTop: '4px', display: 'inline-block' }}>{item.sumber_anggaran?.namaAnggaran || 'Anggaran'}</span>
                        </td>

                        <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                          <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Surat Pengajuan ${item.nomor_surat_pengajuan}`)}>Buka</Button>
                        </td>

                        <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {(item.detail_skema || item.detailSkema || []).map((ds, i) => (
                              <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                                   <i className="fas fa-map-marker-alt text-muted" style={{ marginRight: '6px' }}></i> {ds.tuk?.namaInstitusi || '-'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        
                        <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {(item.detail_skema || item.detailSkema || []).map((ds, i) => (
                              <div key={i} style={{ minHeight: '55px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <strong style={{ color: '#1e293b', fontSize: '0.9rem' }}>{ds.skema?.namaSkema || 'Skema Tidak Diketahui'}</strong>
                                <small className="text-muted" style={{ marginTop: '4px' }}>
                                  <i className="far fa-calendar-alt" style={{marginRight: '4px'}}></i> {formatTanggal(ds.tanggal_mulai, ds.tanggal_selesai)}
                                </small>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                            {(item.detail_skema || item.detailSkema || []).map((ds, i) => (
                              <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                                <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Kurikulum ${ds.skema?.namaSkema}`)}>Buka</Button>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                            {(item.detail_skema || item.detailSkema || []).map((ds, i) => (
                              <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  style={{ minWidth: '60px' }} 
                                  onClick={() => setViewPeserta(ds)} // Membuka tabel peserta
                                >
                                  <strong>{ds.jumlah_peserta || 0}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                              {/* MEMANGGIL FUNGSI YANG SUDAH DIREVISI */}
                              <Button variant="outline" size="sm" icon="paper-plane" onClick={() => handleKirimLsp(item.id)} style={{ width: '85px' }}>Kirim</Button>
                              <Button variant="outline" size="sm" icon="edit" onClick={() => handleEdit(item)} style={{ width: '85px' }}>Edit</Button>
                              <Button variant="outline-danger" size="sm" icon="trash" onClick={() => handleDelete(item.id)} style={{ width: '85px' }}>Hapus</Button>
                            </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        Belum ada draft pengajuan. Silakan buat pengajuan baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
          </div>
        </div>
      )}

      {/* --- MODAL PDF VIEWER (Simulasi) --- */}
      {viewPdf && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '800px', maxWidth: '90%', height: '80vh', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', display: 'flex', flexDirection: 'column' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0, color: '#0f172a'}}><i className="fas fa-file-pdf" style={{color: '#ef4444', marginRight: 8}}></i> Pratinjau Dokumen</h3>
               <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }} onClick={() => setViewPdf(null)}>&times;</button>
             </div>
             <div className="modal-body" style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fas fa-file-pdf" style={{ fontSize: '5rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#334155' }}>Simulasi Penampil Dokumen</p>
                  <p style={{ fontSize: '0.95rem' }}>Dokumen <strong>{viewPdf}</strong> yang diunggah akan tampil di area ini.</p>
               </div>
             </div>
           </div>
         </div>
      )}

      {/* --- POP-UP MODAL PENCARIAN SKEMA & TUK --- */}
      {activeModal.type && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content fade-in-content" style={{ width: '500px', maxWidth: '95%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>
                <i className={`fas ${activeModal.type === 'skema' ? 'fa-layer-group' : 'fa-map-marker-alt'} text-blue`} style={{ marginRight: '8px' }}></i>
                Pilih {activeModal.type === 'skema' ? 'Skema Kompetensi' : 'TUK Pelaksanaan'}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setActiveModal({ type: null, targetId: null })}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
              <input
                type="text"
                placeholder={`Cari nama ${activeModal.type === 'skema' ? 'skema...' : 'TUK...'}`}
                className="form-input"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                style={{ paddingLeft: '35px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px' }}
                autoFocus
              />
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
              
              {/* RENDER LIST SKEMA */}
              {activeModal.type === 'skema' && masterSkema
                .filter(s => (s.namaSkema || '').toLowerCase().includes(modalSearch.toLowerCase()))
                .map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.2s' }}
                    onClick={() => {
                      setSkemaUsulan(skemaUsulan.map(su => su.id === activeModal.targetId ? {...su, skema_id: item.id, namaSkema: item.namaSkema} : su));
                      setActiveModal({ type: null, targetId: null });
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '1rem', marginBottom: '4px' }}>{item.namaSkema}</strong>
                    <small className="text-muted" style={{ fontWeight: '500' }}>Jenis: {item.jenisSkema || 'N/A'}</small>
                  </div>
              ))}

              {/* RENDER LIST TUK */}
              {activeModal.type === 'tuk' && masterTuk
                .filter(t => (t.namaInstitusi || '').toLowerCase().includes(modalSearch.toLowerCase()))
                .map((tuk, idx) => (
                  <div 
                    key={idx} 
                    style={{ padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}
                    onClick={() => {
                      setSkemaUsulan(skemaUsulan.map(su => su.id === activeModal.targetId ? {...su, jejaring_id: tuk.id, namaTuk: tuk.namaInstitusi} : su));
                      setActiveModal({ type: null, targetId: null });
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <i className="fas fa-building"></i>
                    </div>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{tuk.namaInstitusi}</strong>
                  </div>
              ))}
              
              {/* PESAN KOSONG */}
              {((activeModal.type === 'skema' && masterSkema.filter(s => (s.namaSkema || '').toLowerCase().includes(modalSearch.toLowerCase())).length === 0) || 
                (activeModal.type === 'tuk' && masterTuk.filter(t => (t.namaInstitusi || '').toLowerCase().includes(modalSearch.toLowerCase())).length === 0)) && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  <i className="fas fa-search" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', opacity: 0.5 }}></i>
                  Data tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FormPengajuanUJK;