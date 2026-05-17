import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../../context/UserContext';
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';
import Pagination from '../../components/ui/Pagination';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

const FormPengajuanUJK = () => {
  const navigate = useNavigate();
  const { userData } = useUser(); 
  const [showForm, setShowForm] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [viewPdf, setViewPdf] = useState(null); 
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  // --- STATE UNTUK POP-UP PEMILIHAN SKEMA & TUK ---
  const [activeModal, setActiveModal] = useState({ type: null, targetId: null });
  const [modalSearch, setModalSearch] = useState('');
  
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Mengambil daftar TUK yang diizinkan untuk Admin BLK ini
  const authorizedTUKs = userData?.assignedTUK?.length > 0 
    ? userData.assignedTUK 
    : ['BLK Surabaya', 'TUK Mandiri PT ABC', 'TUK Mandiri PT Sejahtera'];

  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (activeModal.type) { setActiveModal({ type: null, targetId: null }); e.preventDefault(); }
      else if (viewPdf) { setViewPdf(null); e.preventDefault(); } 
      else if (selectedPeserta) { setSelectedPeserta(null); e.preventDefault(); } 
      else if (showForm) { setShowForm(false); setEditingId(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [viewPdf, selectedPeserta, showForm, activeModal]);

  // --- DUMMY DATA YANG DISELARASKAN DENGAN DASHBOARD ADMIN BLK ---
  const [usulan, setUsulan] = useState([
    { 
      id: generateId(), 
      nomorSurat: '001/BLK-SBY/UJK/II/2026', 
      pendanaan: 'APBN', 
      skemaList: [
        { 
          idSkema: generateId(), 
          judul: 'Barista', kejuruan: 'Pariwisata', jenis: 'Klaster', 
          tglMulai: '2026-02-21', tglSelesai: '2026-02-22', 
          tanggal: '21 Feb - 22 Feb 2026', 
          jumlahAsesi: 15, 
          tukSkema: 'TUK Sewaktu BLK Surabaya',
          peserta: Array(15).fill({ id: 1, nama: 'Mohammad Tohir', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '20 Juni 1990', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'tohirm@gmail.com', pendidikan: 'S1' }) 
        }
      ]
    },
    { 
      id: generateId(), 
      nomorSurat: '002/BLK-SBY/UJK/II/2026', 
      pendanaan: 'APBD', 
      skemaList: [
        { 
          idSkema: generateId(), 
          judul: 'Teknisi Kendaraan Ringan', kejuruan: 'Otomotif', jenis: 'Klaster', 
          tglMulai: '2026-03-01', tglSelesai: '2026-03-02', 
          tanggal: '01 Mar - 02 Mar 2026',
          jumlahAsesi: 10, 
          tukSkema: 'TUK Mandiri PT Sejahtera',
          peserta: Array(10).fill({ id: 2, nama: 'Budi Santoso', nik: '3578009988776655', jk: 'L', tempatLahir: 'Gresik', tanggalLahir: '08 Agustus 1996', alamat: 'Jl. Veteran 45', rt: '03', rw: '04', kelurahan: 'Sidomoro', kecamatan: 'Kebomas', hp: '08987654321', email: 'budi@mail.com', pendidikan: 'SMK' }) 
        },
        { 
          idSkema: generateId(), 
          judul: 'Desain Grafis Madya', kejuruan: 'TIK', jenis: 'Klaster', 
          tglMulai: '2026-03-05', tglSelesai: '2026-03-06', 
          tanggal: '05 Mar - 06 Mar 2026',
          jumlahAsesi: 16, 
          tukSkema: 'TUK Sewaktu Unesa',
          peserta: Array(16).fill({ id: 3, nama: 'Peserta Desain', nik: '3578002233445566', jk: 'P', tempatLahir: 'Sidoarjo', tanggalLahir: '21 Juli 1998', alamat: 'Perumahan Tropodo', rt: '05', rw: '01', kelurahan: 'Tropodo', kecamatan: 'Waru', hp: '082233445566', email: 'andi@mail.com', pendidikan: 'D3' }) 
        }
      ]
    },
    { 
      id: generateId(), 
      nomorSurat: '003/BLK-SBY/UJK/III/2026', 
      pendanaan: 'Mandiri', 
      skemaList: [
        { 
          idSkema: generateId(), 
          judul: 'Welder SMAW 3G', kejuruan: 'Manufaktur', jenis: 'KKNI', 
          tglMulai: '2026-04-10', tglSelesai: '2026-04-11', 
          tanggal: '10 Apr - 11 Apr 2026',
          jumlahAsesi: 20, 
          tukSkema: 'TUK Sewaktu BLK Kediri',
          peserta: Array(20).fill({ id: 4, nama: 'Peserta Welder', nik: '3578005544332211', jk: 'L', tempatLahir: 'Malang', tanggalLahir: '15 Januari 1997', alamat: 'Jl. Kawi 22', rt: '02', rw: '05', kelurahan: 'Kauman', kecamatan: 'Klojen', hp: '085544332211', email: 'rina@mail.com', pendidikan: 'S1' }) 
        }
      ]
    }
  ]);

  const masterSkema = [
    { judul: 'Barista', kejuruan: 'Pariwisata', jenis: 'Klaster' }, { judul: 'Pembuatan Roti Dan Kue', kejuruan: 'Pariwisata', jenis: 'Klaster' }, { judul: 'Practical Office Advance', kejuruan: 'TIK', jenis: 'Klaster' }, { judul: 'Teknisi Perawatan AC Residential', kejuruan: 'Refrigerasi', jenis: 'Okupasi' }, { judul: 'Welder SMAW 3G', kejuruan: 'Manufaktur', jenis: 'KKNI' }, { judul: 'Desain Grafis Madya', kejuruan: 'TIK', jenis: 'Klaster' }, { judul: 'Junior Web Developer', kejuruan: 'TIK', jenis: 'Okupasi' }, { judul: 'Teknisi Kendaraan Ringan', kejuruan: 'Otomotif', jenis: 'Klaster' }
  ];

  // Inisialisasi awal form
  const [formData, setFormData] = useState({ tuk: authorizedTUKs[0] || '', nomorSurat: '', pendanaan: '' });
  const [skemaUsulan, setSkemaUsulan] = useState([{ id: generateId(), skema: '', kejuruan: '', jenis: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '', tukSkema: authorizedTUKs[0] || '' }]);
  const [editingId, setEditingId] = useState(null);

  // LOGIKA PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  const totalPages = Math.ceil(usulan.length / itemsPerPage);
  const paginatedUsulan = usulan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const closeAlert = () => { setAlert(null); if (alertTimer.current) clearTimeout(alertTimer.current); };
  
  const handleInputGlobalChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleAddSkema = () => setSkemaUsulan([...skemaUsulan, { id: generateId(), skema: '', kejuruan: '', jenis: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '', tukSkema: formData.tuk }]);
  
  const handleRemoveSkema = (id) => setSkemaUsulan(skemaUsulan.filter(s => s.id !== id));
  
  const handleSkemaChange = (id, field, value) => {
    setSkemaUsulan(skemaUsulan.map(s => {
      if (s.id === id) {
        if (field === 'skema') {
          const selectedMaster = masterSkema.find(m => m.judul === value);
          return { ...s, skema: value, kejuruan: selectedMaster?.kejuruan || '', jenis: selectedMaster?.jenis || '' };
        }
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleDownloadTemplate = () => {
    const templateContent = "\uFEFF" + `LSP BLK SURABAYA;;;;;;;;;;;;; Lembaga Sertifikasi Profesi BLK Surabaya;;;;;;;;;;;;; "Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071,8287532";;;;;;;;;;;;; Email:lsp.blksurabaya@gmail.com;;;;;;;;;;;;; ;;;;;;;;;;;;; DATA NOMINATIF PESERTA UJI KOMPETENSI;;;;;;;;;;;;; SKEMA : [ISI NAMA SKEMA];;;;;;;;;;;;; ANGGARAN APBD/APBN;;;;;;;;;;;;; UPT BALAI LATIHAN KERJA SURABAYA;;;;;;;;;;;;; ;;;;;;;;;;;;; No.;Nama;NIK;Jenis Kelamin (L/P);Tempat Lahir;Tanggal Lahir;Tempat Tinggal;;;;;No. HP;Email;Pendidikan Terakhir ;;;;;;Alamat;RT;RW;Kelurahan;Kecamatan;;; 1;Budi Santoso;3578902006900001;L;Surabaya;1990-06-20;Dukuh Menanggal III/29;1;1;Dukuh Menanggal;Gayungan;089689029754;budi@gmail.com;S1`;
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Nominatif_UJK_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelUpload = (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setAlert({ type: 'warning', title: 'File Terlalu Besar', text: 'Ukuran file tidak boleh lebih dari 5MB.', onCancel: closeAlert }); e.target.value = null; return; }
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
    if (!isExcel) { setAlert({ type: 'warning', title: 'Format Ditolak', text: 'Hanya menerima file berformat Excel (.xlsx / .xls / .csv).', onCancel: closeAlert }); e.target.value = null; return; }
    
    const simulatedCount = Math.floor(Math.random() * 11) + 15; 
    handleSkemaChange(id, 'jumlahAsesi', simulatedCount);
    setAlert({ type: 'success', title: 'Upload Berhasil!', text: `Sistem berhasil memvalidasi ${simulatedCount} data asesi dari file Excel Anda.`, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 3000);
  };

  const handleEdit = (item) => {
    setShowForm(true);
    setEditingId(item.id);
    setFormData({ tuk: item.tuk, nomorSurat: item.nomorSurat, pendanaan: item.pendanaan });
    const mappedSkema = item.skemaList.map(s => ({
      id: s.idSkema || generateId(), skema: s.judul, kejuruan: s.kejuruan, jenis: s.jenis, tglMulai: s.tglMulai, tglSelesai: s.tglSelesai, jumlahAsesi: s.jumlahAsesi, tukSkema: s.tukSkema || ''
    }));
    setSkemaUsulan(mappedSkema);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skemaUsulan.some(s => !s.skema || !s.tglMulai || !s.tglSelesai || !s.jumlahAsesi || !s.tukSkema)) {
       setAlert({ type: 'warning', title: 'Data Belum Lengkap', text: 'Mohon lengkapi seluruh form (termasuk TUK Skema) dan upload file PDF/Excel.', onCancel: closeAlert });
       return;
    }
    setAlert({
      type: 'save', title: editingId ? 'Simpan Perubahan?' : 'Simpan Sebagai Draft?', text: 'Data akan disimpan ke tabel draft di bawah.',
      onConfirm: () => {
        const newDraftItem = {
          id: editingId || generateId(), nomorSurat: formData.nomorSurat, pendanaan: formData.pendanaan, tuk: formData.tuk,
          skemaList: skemaUsulan.map(s => {
             const jumlah = parseInt(s.jumlahAsesi) || 10;
             const dummyPesertaBaru = Array.from({ length: jumlah }).map((_, i) => ({
                 id: generateId(), nama: `Peserta Nominatif ${i + 1}`, nik: `35780000000000${i}`, jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', rt: '01', rw: '02', kelurahan: 'Sidoarjo', kecamatan: 'Sidoarjo Kota', hp: '0800000000', email: `peserta${i+1}@gmail.com`, pendidikan: 'SMK'
             }));
             const selectedMaster = masterSkema.find(m => m.judul === s.skema);
             
             // Format tanggal sederhana untuk preview
             const startObj = new Date(s.tglMulai);
             const endObj = new Date(s.tglSelesai);
             const formatTgl = `${startObj.getDate()} ${startObj.toLocaleString('default', { month: 'short' })} - ${endObj.getDate()} ${endObj.toLocaleString('default', { month: 'short' })} ${endObj.getFullYear()}`;

             return { 
               idSkema: s.id, judul: s.skema, kejuruan: selectedMaster?.kejuruan || 'Umum', jenis: selectedMaster?.jenis || 'Lainnya', 
               tglMulai: s.tglMulai, tglSelesai: s.tglSelesai, tanggal: formatTgl,
               jumlahAsesi: jumlah, tukSkema: s.tukSkema, peserta: dummyPesertaBaru 
             };
          })
        };

        if (editingId) { setUsulan(usulan.map(u => u.id === editingId ? newDraftItem : u)); } else { setUsulan([newDraftItem, ...usulan]); }
        setShowForm(false);
        setEditingId(null);
        setFormData({ tuk: authorizedTUKs[0] || '', nomorSurat: '', pendanaan: '' });
        setSkemaUsulan([{ id: generateId(), skema: '', kejuruan: '', jenis: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '', tukSkema: authorizedTUKs[0] || '' }]);
        
        setAlert({ type: 'success', title: 'Tersimpan!', text: 'Draft pengajuan berhasil diperbarui.', onCancel: closeAlert });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2000);
      },
      onCancel: closeAlert
    });
  };

  const handleDelete = (id) => {
    setAlert({
      type: 'delete', title: 'Hapus Draft?', text: 'Draft pengajuan ini akan dihapus permanen dari sistem.',
      onConfirm: () => {
        setUsulan(usulan.filter(u => u.id !== id));
        setAlert({ type: 'success', title: 'Dihapus!', text: 'Draft berhasil dihapus.', onCancel: closeAlert });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2000);
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      <style>{`.btn-outline-danger { background-color: #ffffff; color: #ef4444; border: 1.5px solid #fca5a5; } .btn-outline-danger:hover { background-color: #fef2f2; border-color: #ef4444; }`}</style>
      
      {selectedPeserta ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali</Button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Nominatif Peserta</h2>
              <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}>
            <TablePeserta dataPeserta={selectedPeserta.peserta || []} skemaName={selectedPeserta.skema} />
          </div>
        </div>
      ) : showForm ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => { setShowForm(false); setEditingId(null); }}>Kembali</Button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Pengajuan UJK Baru</h2>
                <p className="text-muted" style={{ margin: 0 }}>Buat dan kelola draft jadwal ujian kompetensi baru.</p>
              </div>
            </div>
          </div>
          <form className="admin-form fade-in-content" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div className="dashboard-card" style={{ flex: '1 1 300px', padding: '24px', margin: 0 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', color: '#0f172a' }}>
                  <i className="fas fa-file-signature text-blue" style={{ marginRight: '8px' }}></i> Administrasi
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Instansi<span style={{color: '#ef4444'}}>*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      name="tuk" 
                      value={formData.tuk} 
                      readOnly 
                      style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#475569', fontWeight: 'bold'}}
                      title="Ditentukan oleh hak akses Admin BLK"
                    />
                    <small className="text-muted" style={{fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>Sesuai dengan wewenang akun Anda.</small>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Nomor Surat Pengajuan <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" className="form-input" name="nomorSurat" value={formData.nomorSurat} onChange={handleInputGlobalChange} placeholder="Contoh: 001/BLK/2026" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Jenis Pendanaan <span style={{color: '#ef4444'}}>*</span></label>
                    <select className="form-input" name="pendanaan" value={formData.pendanaan} onChange={handleInputGlobalChange} required>
                      <option value="">---Pilih Sumber Dana---</option>
                      <option value="APBN">APBN</option>
                      <option value="APBD">APBD</option>
                      <option value="Mandiri">Mandiri</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Upload Surat Pengajuan UJK (PDF) <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="file" accept=".pdf" className="form-input" required={!editingId} style={{ padding: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1' }} />
                  </div>
                </div>
              </div>
              <div style={{ flex: '2.5 1 600px' }}>
                <div className="dashboard-card" style={{ padding: '24px', margin: 0 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', color: '#0f172a' }}>
                    <i className="fas fa-users-cog text-blue" style={{ marginRight: '8px' }}></i> Data Pelaksanaan & Peserta
                  </h3>
                  <div className="skema-dynamic-container">
                    {skemaUsulan.map((skema, index) => {
                      return (
                        <div key={skema.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', backgroundColor: '#f8fafc' }} className="fade-in-content">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                              <h4 style={{ margin: 0, color: '#1e293b' }}><span className="badge primary"><i className="fas fa-layer-group"></i> Skema {index + 1}</span></h4>
                              {index > 0 && <Button type="button" variant="outline-danger" size="sm" icon="trash" onClick={() => handleRemoveSkema(skema.id)}>Hapus</Button>}
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label>Pilihan Skema Kompetensi <span style={{color: '#ef4444'}}>*</span></label>
                                <button 
                                  type="button" 
                                  className="form-input" 
                                  style={{ textAlign: 'left', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                                  onClick={() => { setActiveModal({ type: 'skema', targetId: skema.id }); setModalSearch(''); }}
                                >
                                  <span style={{ color: skema.skema ? '#0f172a' : '#94a3b8' }}>{skema.skema || '-- Klik untuk Mencari Skema --'}</span>
                                  <i className="fas fa-search text-muted"></i>
                                </button>
                              </div>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label>Lokasi Ujian (TUK Skema Ini) <span style={{color: '#ef4444'}}>*</span></label>
                                <button 
                                  type="button" 
                                  className="form-input" 
                                  style={{ textAlign: 'left', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                                  onClick={() => { setActiveModal({ type: 'tuk', targetId: skema.id }); setModalSearch(''); }}
                                >
                                  <span style={{ color: skema.tukSkema ? '#0f172a' : '#94a3b8' }}>{skema.tukSkema || '-- Klik untuk Memilih TUK --'}</span>
                                  <i className="fas fa-search text-muted"></i>
                                </button>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label>Bidang Kejuruan</label>
                                <input type="text" className="form-input" value={skema.kejuruan || ''} readOnly style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#475569', fontWeight: 'bold'}} placeholder="Terisi otomatis" />
                              </div>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label>Jenis Skema</label>
                                <input type="text" className="form-input" value={skema.jenis || ''} readOnly style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#475569', fontWeight: 'bold'}} placeholder="Terisi otomatis" />
                              </div>
                              <div className="form-group" style={{ margin: 0 }}><label>Tanggal Mulai <span style={{color: '#ef4444'}}>*</span></label><input type="date" className="form-input" value={skema.tglMulai} onChange={(e) => handleSkemaChange(skema.id, 'tglMulai', e.target.value)} required/></div>
                              <div className="form-group" style={{ margin: 0 }}><label>Tanggal Selesai <span style={{color: '#ef4444'}}>*</span></label><input type="date" className="form-input" value={skema.tglSelesai} onChange={(e) => handleSkemaChange(skema.id, 'tglSelesai', e.target.value)} required/></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Kurikulum Program (PDF) <span style={{color: '#ef4444'}}>*</span></label>
                                <input type="file" className="form-input" accept=".pdf" required={!editingId} style={{ padding: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1' }}/>
                              </div>
                              <div className="form-group" style={{ margin: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <label style={{ margin: 0 }}>Data Nominatif Asesi (Excel) <span style={{color: '#ef4444'}}>*</span></label>
                                  <button type="button" onClick={handleDownloadTemplate} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}><i className="fas fa-download"></i> Template</button>
                                </div>
                                <input type="file" className="form-input" accept=".xls, .xlsx, .csv" onChange={(e) => handleExcelUpload(skema.id, e)} required={!editingId} style={{ padding: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1' }}/>
                              </div>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Jumlah Peserta (Otomatis)</label>
                                <input type="number" className="form-input" value={skema.jumlahAsesi} readOnly placeholder="0" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold'}} required/>
                              </div>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                  {!editingId && (
                    <div style={{ marginTop: '10px' }}>
                      <Button type="button" variant="dashed" size="lg" isFullWidth icon="plus-circle" onClick={handleAddSkema}>Tambah Skema Ujian Lainnya</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <Button type="submit" variant="primary" size="lg" isFullWidth icon="save" style={{ padding: '16px', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                {editingId ? 'Simpan Perubahan' : 'Simpan Sebagai Draft'}
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
            <Button variant="primary" icon="plus" onClick={() => setShowForm(true)}>Buat Pengajuan Baru</Button>
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
                  {paginatedUsulan.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#64748b', verticalAlign: 'top', paddingTop: '20px' }}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      
                      <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                        <strong style={{color: '#0f172a', display: 'block'}}>{item.nomorSurat || '-'}</strong>
                        <span className="badge info" style={{ marginTop: '4px', display: 'inline-block' }}>{item.pendanaan}</span>
                      </td>

                      {/* SURAT PENGAJUAN (SUDAH DIPERBAIKI MENGGUNAKAN BUTTON) */}
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                        <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Surat Pengajuan ${item.nomorSurat}`)}>Buka</Button>
                      </td>

                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                                 <i className="fas fa-map-marker-alt text-muted" style={{ marginRight: '6px' }}></i> {skema.tukSkema}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ minHeight: '55px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <strong style={{ color: '#1e293b', fontSize: '0.9rem' }}>{skema.judul}</strong>
                              <small className="text-muted" style={{ marginTop: '4px' }}>
                                <i className="far fa-calendar-alt" style={{marginRight: '4px'}}></i> {skema.tanggal}
                              </small>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                              <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Kurikulum ${skema.judul}`)}>Buka</Button>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}>
                              <Button variant="outline" size="sm" onClick={() => setSelectedPeserta({ skema: skema.judul, peserta: skema.peserta || [] })} style={{ minWidth: '60px' }}>
                                <strong>{skema.jumlahAsesi}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button variant="outline" size="sm" icon="paper-plane" onClick={() => {
                              setAlert({
                                type: 'save', title: 'Kirim Pengajuan?', text: 'Data akan dikirim ke LSP dan Anda akan dialihkan ke Dashboard.',
                                onConfirm: () => {
                                  setUsulan(usulan.filter(u => u.id !== item.id));
                                    setAlert({ type: 'success', title: 'Terkirim', text: 'Berhasil dikirim ke LSP.', onCancel: () => closeAlert() });
                                },
                                onCancel: closeAlert
                              });
                            }}>Kirim</Button>
                            <Button variant="outline" size="sm" icon="edit" onClick={() => handleEdit(item)}>Edit</Button>
                            <Button variant="outline-danger" size="sm" icon="trash" onClick={() => handleDelete(item.id)}>Hapus</Button>
                          </div>
                      </td>
                    </tr>
                  ))}
                  {usulan.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Tidak ada draft pengajuan.</td></tr>}
                </tbody>
              </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      )}

      {/* MODAL VIEWER PDF KURIKULUM & SURAT PENGAJUAN */}
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
              {activeModal.type === 'skema' ? (
                masterSkema.filter(s => s.judul.toLowerCase().includes(modalSearch.toLowerCase())).map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.2s' }}
                    onClick={() => {
                      handleSkemaChange(activeModal.targetId, 'skema', item.judul);
                      setActiveModal({ type: null, targetId: null });
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '1rem', marginBottom: '4px' }}>{item.judul}</strong>
                    <small className="text-muted" style={{ fontWeight: '500' }}>{item.kejuruan} <span style={{margin: '0 4px'}}>|</span> Jenis: {item.jenis}</small>
                  </div>
                ))
              ) : (
                authorizedTUKs.filter(t => t.toLowerCase().includes(modalSearch.toLowerCase())).map((tuk, idx) => (
                  <div 
                    key={idx} 
                    style={{ padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}
                    onClick={() => {
                      handleSkemaChange(activeModal.targetId, 'tukSkema', tuk);
                      setActiveModal({ type: null, targetId: null });
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <i className="fas fa-building"></i>
                    </div>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{tuk}</strong>
                  </div>
                ))
              )}
              
              {/* Pesan Kosong */}
              {(activeModal.type === 'skema' ? masterSkema.filter(s => s.judul.toLowerCase().includes(modalSearch.toLowerCase())) : authorizedTUKs.filter(t => t.toLowerCase().includes(modalSearch.toLowerCase()))).length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  <i className="fas fa-search" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', opacity: 0.5 }}></i>
                  Data tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {alert && <AlertPopup type={alert.type} title={alert.title} text={alert.text} onConfirm={alert.onConfirm} onCancel={alert.onCancel || closeAlert} />}
    </div>
  );
};

export default FormPengajuanUJK;