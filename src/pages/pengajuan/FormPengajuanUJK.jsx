import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';
import TablePeserta from '../TablePeserta/TablePeserta'; 

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

  const [viewPeserta, setViewPeserta] = useState(null);
  const [activeModal, setActiveModal] = useState({ type: null, targetId: null });
  const [modalSearch, setModalSearch] = useState('');

  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token'); 
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';

  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#475569' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#334155', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', backgroundColor: '#fff' };

  const initialForm = { sumber_anggaran_id: '', nomorSurat: '', fileSurat: null };
  const initialSkema = { id: Date.now(), skema_id: '', namaSkema: '', jejaring_id: '', namaTuk: '', tglMulai: '', tglSelesai: '', fileNominatif: null, fileKurikulum: null, jumlahAsesi: 0 };
  
  const [formData, setFormData] = useState(initialForm);
  const [skemaUsulan, setSkemaUsulan] = useState([{ ...initialSkema }]);

  const closeAlert = () => { setAlert(null); if (alertTimer.current) clearTimeout(alertTimer.current); };

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

      if(resSkema.status === 401 || resTuk.status === 401 || resAnggaran.status === 401) return;

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

  const handleEdit = (item) => {
    setShowForm(true);
    setEditingId(item.id);
    setFormData({
      sumber_anggaran_id: item.sumber_anggaran_id || '',
      nomorSurat: item.nomor_surat_pengajuan || '',
      fileSurat: null
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

  // --- PERBAIKAN: Fungsi Pembuka URL PDF via Rute Backend Baru ---
  const handleOpenPreviewPdf = async (tipeDokumen, namaDokumen, targetId) => {
    if (!targetId) {
      showAlert('info', 'File Tidak Ditemukan', 'Belum ada file yang diunggah untuk dokumen ini.');
      return;
    }

    try {
      setAlert({ type: 'info', title: 'Memuat Dokumen...', text: 'Mengambil file PDF dari server...' });
      
      const token = sessionStorage.getItem('auth_token');
      
      // Tentukan endpoint berdasarkan tipe dokumen yang diklik
      let apiEndpoint = '';
      if (tipeDokumen === 'Surat Pengajuan') {
        apiEndpoint = `${apiUrl}/api/pengajuan/surat/${targetId}`;
      } else if (tipeDokumen === 'Kurikulum') {
        apiEndpoint = `${apiUrl}/api/pengajuan/kurikulum/${targetId}`;
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': '69420',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
         if (response.status === 404) throw new Error('File tidak ditemukan di server.');
         throw new Error('Gagal memuat file dari server.');
      }

      // Ubah response menjadi Blob (File Biner) untuk membypass Iframe CORS Ngrok
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      setViewPdf({ name: namaDokumen, url: blobUrl, isBlob: true });
      closeAlert(); 

    } catch (error) {
      console.error(error);
      showAlert('error', 'Gagal Memuat', error.message || 'Tidak dapat memuat dokumen PDF dari server.');
    }
  };

  // Fungsi tambahan untuk membersihkan URL Object memory leak
  const closePdfViewer = () => {
    if (viewPdf?.isBlob) {
      URL.revokeObjectURL(viewPdf.url);
    }
    setViewPdf(null);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  const totalPages = Math.ceil(usulan.length / itemsPerPage) || 1;
  const paginatedUsulan = usulan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTanggal = (start, end) => {
    if (!start || !end) return '-';
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} - ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getFullYear()}`;
  };

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
                <p className="text-muted" style={{ margin: 0 }}>Lengkapi dokumen persyaratan dan data asesi dalam satu form terpusat.</p>
              </div>
            </div>
          </div>

          <form className="dashboard-card" onSubmit={handleSubmit} style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', margin: 0 }}>
             <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                
                {/* KOLOM KIRI: ADMINISTRASI */}
                <div style={{ flex: '1 1 320px', backgroundColor: '#f8fafc', padding: '30px', borderRight: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                     <i className="fas fa-file-signature text-blue" style={{marginRight: 8}}></i>Administrasi
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Nomor Surat Pengajuan <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" name="nomorSurat" value={formData.nomorSurat} onChange={handleInputGlobalChange} style={inputStyle} placeholder="Masukkan nomor surat..." required />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Jenis Pendanaan <span style={{color: '#ef4444'}}>*</span></label>
                    <select name="sumber_anggaran_id" value={formData.sumber_anggaran_id} onChange={handleInputGlobalChange} style={{...inputStyle, cursor: 'pointer'}} required>
                      <option value="" disabled>---Pilih Sumber Dana---</option>
                      {masterAnggaran.map(ang => (
                        <option key={ang.id} value={ang.id}>{ang.namaAnggaran}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={labelStyle}>Upload Surat Pengajuan (PDF) {editingId ? '' : <span style={{color: '#ef4444'}}>*</span>}</label>
                    <input type="file" name="fileSurat" accept=".pdf" style={{ ...inputStyle, padding: '8px', border: '1px dashed #cbd5e1' }} onChange={handleInputGlobalChange} required={!editingId} />
                    {editingId && <small className="text-muted" style={{display: 'block', marginTop: '6px', fontSize: '0.8rem'}}>*Biarkan kosong jika tidak mengubah file.</small>}
                  </div>
                </div>

                {/* KOLOM KANAN: SKEMA (DATA PELAKSANAAN) */}
                <div style={{ flex: '2 1 600px', padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>
                       <i className="fas fa-users-cog text-blue" style={{marginRight: 8}}></i> Data Pelaksanaan
                    </h3>
                  </div>
                  
                  {skemaUsulan.map((skema, index) => (
                    <div key={skema.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '20px', backgroundColor: '#fff', position: 'relative' }}>
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                         <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                           <i className="fas fa-layer-group" style={{marginRight: '6px'}}></i> Skema {index + 1}
                         </span>
                         {index > 0 && <Button type="button" variant="outline-danger" size="sm" icon="trash" onClick={() => handleRemoveSkema(skema.id)}>Hapus Skema</Button>}
                       </div>

                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                         {/* TOMBOL MODAL SKEMA */}
                         <div>
                           <label style={labelStyle}>Pilihan Skema Kompetensi <span style={{color: '#ef4444'}}>*</span></label>
                           <button 
                             type="button" 
                             style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                             onClick={() => { setActiveModal({ type: 'skema', targetId: skema.id }); setModalSearch(''); }}
                           >
                             <span style={{ color: skema.skema_id ? '#0f172a' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                               {skema.namaSkema || '-- Klik untuk Mencari Skema --'}
                             </span>
                             <i className="fas fa-search" style={{ color: '#cbd5e1' }}></i>
                           </button>
                         </div>

                         {/* TOMBOL MODAL TUK */}
                         <div>
                           <label style={labelStyle}>Lokasi Ujian (TUK) <span style={{color: '#ef4444'}}>*</span></label>
                           <button 
                             type="button" 
                             style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                             onClick={() => { setActiveModal({ type: 'tuk', targetId: skema.id }); setModalSearch(''); }}
                           >
                             <span style={{ color: skema.jejaring_id ? '#0f172a' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                               {skema.namaTuk || '-- Klik untuk Memilih TUK --'}
                             </span>
                             <i className="fas fa-search" style={{ color: '#cbd5e1' }}></i>
                           </button>
                         </div>
                       </div>

                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                          <div>
                            <label style={labelStyle}>Tanggal Mulai <span style={{color: '#ef4444'}}>*</span></label>
                            <input type="date" style={inputStyle} value={skema.tglMulai} onChange={(e) => setSkemaUsulan(skemaUsulan.map(s => s.id === skema.id ? {...s, tglMulai: e.target.value} : s))} required/>
                          </div>
                          <div>
                            <label style={labelStyle}>Tanggal Selesai <span style={{color: '#ef4444'}}>*</span></label>
                            <input type="date" style={inputStyle} value={skema.tglSelesai} onChange={(e) => setSkemaUsulan(skemaUsulan.map(s => s.id === skema.id ? {...s, tglSelesai: e.target.value} : s))} required/>
                          </div>
                       </div>

                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                          <div>
                            <label style={labelStyle}>Kurikulum Program (PDF) {editingId ? '' : <span style={{color: '#ef4444'}}>*</span>}</label>
                            <input type="file" accept=".pdf" style={{ ...inputStyle, padding: '8px', border: '1px dashed #cbd5e1' }} onChange={(e) => handleSkemaFileChange(skema.id, 'fileKurikulum', e.target.files[0])} required={!editingId}/>
                          </div>
                          <div>
                            <label style={labelStyle}>Data Nominatif Asesi (Excel) {editingId ? '' : <span style={{color: '#ef4444'}}>*</span>}</label>
                            <input type="file" accept=".xls, .xlsx, .csv" style={{ ...inputStyle, padding: '8px', border: '1px dashed #cbd5e1' }} onChange={(e) => handleSkemaFileChange(skema.id, 'fileNominatif', e.target.files[0])} required={!editingId}/>
                          </div>
                       </div>
                    </div>
                  ))}
                  
                  {!editingId && (
                    <Button type="button" variant="dashed" size="lg" isFullWidth icon="plus-circle" onClick={handleAddSkema} style={{ borderStyle: 'dashed' }}>
                      Tambah Skema Ujian Lainnya
                    </Button>
                  )}
                </div>
             </div>
             
             {/* FOOTER AKSI */}
             <div style={{ padding: '20px 30px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Batal</Button>
                <Button type="submit" variant="primary" icon="save">
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
                          {/* PERBAIKAN: Pemanggilan Surat Pengajuan menggunakan ID dari tabel ujk (item.id) */}
                          <Button 
                            variant="outline" size="sm" icon="file-pdf" 
                            onClick={() => handleOpenPreviewPdf('Surat Pengajuan', `Surat Pengajuan ${item.nomor_surat_pengajuan}`, item.id)}
                          >
                            Buka
                          </Button>
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
                                {/* PERBAIKAN: Pemanggilan Kurikulum menggunakan ID dari tabel detail (ds.id) */}
                                <Button 
                                  variant="outline" size="sm" icon="file-pdf" 
                                  onClick={() => handleOpenPreviewPdf('Kurikulum', `Kurikulum ${ds.skema?.namaSkema}`, ds.id)}
                                >
                                  Buka
                                </Button>
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
                                  onClick={() => setViewPeserta(ds)}
                                >
                                  <strong>{ds.jumlah_peserta || 0}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
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

      {/* --- MODAL PDF VIEWER (DENGAN IFRAME) --- */}
      {viewPdf && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content fade-in-content" style={{ width: '800px', maxWidth: '95%', height: '85vh', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', display: 'flex', flexDirection: 'column' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
               <h3 style={{margin:0, color: '#0f172a', fontSize: '1.25rem'}}>
                 <i className="fas fa-file-pdf" style={{color: '#ef4444', marginRight: 8}}></i> {viewPdf.name}
               </h3>
               <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }} onClick={closePdfViewer}>&times;</button>
             </div>
             
             <div className="modal-body" style={{ flex: 1, backgroundColor: '#e2e8f0', padding: '10px' }}>
                <iframe 
                  src={viewPdf.url} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                  title={viewPdf.name} 
                />
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
                style={{ ...inputStyle, paddingLeft: '35px' }}
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
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