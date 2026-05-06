import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';

const FormPengajuanUJK = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [viewPdf, setViewPdf] = useState(null); 
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (viewPdf) { setViewPdf(null); e.preventDefault(); } 
      else if (selectedPeserta) { setSelectedPeserta(null); e.preventDefault(); } 
      else if (showForm) { setShowForm(false); setEditingId(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [viewPdf, selectedPeserta, showForm]);

  const [usulan, setUsulan] = useState([
    { 
      id: generateId(), nomorSurat: '001/BLK-SBY/UJK/II/2026', pendanaan: 'APBN', tuk: 'TUK Sewaktu BLK Surabaya', 
      skemaList: [
        { 
          idSkema: generateId(), judul: 'Barista', kejuruan: 'Pariwisata', jenis: 'Klaster', tglMulai: '2026-02-21', tglSelesai: '2026-02-22', jumlahAsesi: 15, 
          peserta: [{ id: 1, nama: 'Mohammad Tohir', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '20 Juni 1990', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'tohirm@gmail.com', pendidikan: 'S1' }] 
        }
      ]
    },
    { 
      id: generateId(), nomorSurat: '002/BLK-SBY/UJK/II/2026', pendanaan: 'APBD', tuk: 'TUK Mandiri PT Sejahtera', 
      skemaList: [
        { 
          idSkema: generateId(), judul: 'Teknisi Kendaraan Ringan', kejuruan: 'Otomotif', jenis: 'Klaster', tglMulai: '2026-03-01', tglSelesai: '2026-03-02', jumlahAsesi: 10, 
          peserta: [{ id: 2, nama: 'Budi Santoso', nik: '3578009988776655', jk: 'L', tempatLahir: 'Gresik', tanggalLahir: '08 Agustus 1996', alamat: 'Jl. Veteran 45', rt: '03', rw: '04', kelurahan: 'Sidomoro', kecamatan: 'Kebomas', hp: '08987654321', email: 'budi@mail.com', pendidikan: 'SMK' }] 
        },
        { 
          idSkema: generateId(), judul: 'Desain Grafis Madya', kejuruan: 'TIK', jenis: 'Klaster', tglMulai: '2026-03-05', tglSelesai: '2026-03-06', jumlahAsesi: 16, 
          peserta: [] 
        }
      ]
    },
    { 
      id: generateId(), nomorSurat: '003/BLK-SBY/UJK/III/2026', pendanaan: 'Mandiri', tuk: 'TUK Sewaktu BLK Kediri', 
      skemaList: [
        { 
          idSkema: generateId(), judul: 'Welder SMAW 3G', kejuruan: 'Manufaktur', jenis: 'KKNI', tglMulai: '2026-04-10', tglSelesai: '2026-04-11', jumlahAsesi: 20, 
          peserta: [] 
        }
      ]
    }
  ]);

  const masterSkema = [
    { judul: 'Barista', kejuruan: 'Pariwisata', jenis: 'Klaster' }, { judul: 'Pembuatan Roti Dan Kue', kejuruan: 'Pariwisata', jenis: 'Klaster' }, { judul: 'Practical Office Advance', kejuruan: 'TIK', jenis: 'Klaster' }, { judul: 'Teknisi Perawatan AC Residential', kejuruan: 'Refrigerasi', jenis: 'Okupasi' }, { judul: 'Welder SMAW 3G', kejuruan: 'Manufaktur', jenis: 'KKNI' }, { judul: 'Desain Grafis Madya', kejuruan: 'TIK', jenis: 'Klaster' }, { judul: 'Junior Web Developer', kejuruan: 'TIK', jenis: 'Okupasi' }, { judul: 'Teknisi Kendaraan Ringan', kejuruan: 'Otomotif', jenis: 'Klaster' }
  ];

  const [formData, setFormData] = useState({ tuk: '', nomorSurat: '', pendanaan: '' });
  const [skemaUsulan, setSkemaUsulan] = useState([{ id: generateId(), skema: '', kejuruan: '', jenis: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
  const [editingId, setEditingId] = useState(null);

  const closeAlert = () => { setAlert(null); if (alertTimer.current) clearTimeout(alertTimer.current); };
  const handleInputGlobalChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddSkema = () => setSkemaUsulan([...skemaUsulan, { id: generateId(), skema: '', kejuruan: '', jenis: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
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
      id: s.idSkema || generateId(), skema: s.judul, kejuruan: s.kejuruan, jenis: s.jenis, tglMulai: s.tglMulai, tglSelesai: s.tglSelesai, jumlahAsesi: s.jumlahAsesi
    }));
    setSkemaUsulan(mappedSkema);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skemaUsulan.some(s => !s.skema || !s.tglMulai || !s.tglSelesai || !s.jumlahAsesi)) {
       setAlert({ type: 'warning', title: 'Data Belum Lengkap', text: 'Mohon lengkapi form dan upload file PDF dan Excel.', onCancel: closeAlert });
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
             return { idSkema: s.id, judul: s.skema, kejuruan: selectedMaster?.kejuruan || 'Umum', jenis: selectedMaster?.jenis || 'Lainnya', tglMulai: s.tglMulai, tglSelesai: s.tglSelesai, jumlahAsesi: jumlah, peserta: dummyPesertaBaru };
          })
        };

        if (editingId) { setUsulan(usulan.map(u => u.id === editingId ? newDraftItem : u)); } else { setUsulan([newDraftItem, ...usulan]); }
        setShowForm(false);
        setEditingId(null);
        setFormData({ tuk: '', nomorSurat: '', pendanaan: '' });
        setSkemaUsulan([{ id: generateId(), skema: '', kejuruan: '', jenis: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
        
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
                    <label>Tempat Uji Kompetensi (TUK) <span style={{color: '#ef4444'}}>*</span></label>
                    <select className="form-input" name="tuk" value={formData.tuk} onChange={handleInputGlobalChange} required>
                      <option value="">---Pilih Lokasi TUK---</option>
                      <option value="TUK Sewaktu BLK Surabaya">TUK Sewaktu BLK Surabaya</option>
                      <option value="TUK Mandiri PT ABC">TUK Mandiri PT ABC</option>
                      <option value="TUK Mandiri PT Sejahtera">TUK Mandiri PT Sejahtera</option>
                      <option value="TUK Sewaktu BLK Kediri">TUK Sewaktu BLK Kediri</option>
                    </select>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '15px' }}>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label>Pilihan Skema Kompetensi <span style={{color: '#ef4444'}}>*</span></label>
                                <select className="form-input" value={skema.skema} onChange={(e) => handleSkemaChange(skema.id, 'skema', e.target.value)} required>
                                  <option value="">-- Pilih Judul Skema --</option>
                                  {masterSkema.map((item, idx) => <option key={idx} value={item.judul}>{item.judul}</option>)}
                                </select>
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
                    <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '15%' }}>Nomor Surat & Dana</th>
                    <th style={{ width: '15%' }}>TUK</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Surat Pengajuan (PDF)</th>
                    <th style={{ width: '20%' }}>Daftar Skema (Bidang & Jenis)</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Kurikulum (PDF)</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Peserta</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {usulan.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#64748b', verticalAlign: 'top', paddingTop: '20px' }}>{index + 1}</td>
                      <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                        <strong style={{color: '#1e293b', display: 'block'}}>{item.nomorSurat || '-'}</strong>
                        <span className="badge info" style={{ marginTop: '4px', display: 'inline-block' }}>{item.pendanaan}</span>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.9rem', verticalAlign: 'top', paddingTop: '20px' }}>
                        <i className="fas fa-map-marker-alt text-muted" style={{marginRight: '5px'}}></i> {item.tuk}
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                        <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Surat Pengajuan ${item.nomorSurat}`)} style={{color: '#ef4444', borderColor: '#fca5a5'}}>Lihat</Button>
                      </td>
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {item.skemaList.map((skema, i) => (
                              <div key={i} style={{ height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <strong style={{ color: '#1e293b', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{skema.judul}</strong>
                                <small className="text-muted" style={{ margin: 0 }}>{skema.kejuruan || 'Umum'} <span style={{margin: '0 4px'}}>|</span> {skema.jenis || 'Lainnya'}</small>
                              </div>
                            ))}
                          </div>
                      </td>
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                              <Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf(`Kurikulum ${skema.judul}`)}>Kurikulum</Button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                              <Button variant="outline" size="sm" onClick={() => setSelectedPeserta({ skema: skema.judul, peserta: skema.peserta || [] })} style={{ minWidth: '70px', justifyContent: 'center' }}>
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
          </div>
        </div>
      )}

      {/* MODAL VIEWER PDF KURIKULUM & SURAT PENGAJUAN (SIMULASI) */}
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
      
      {alert && <AlertPopup type={alert.type} title={alert.title} text={alert.text} onConfirm={alert.onConfirm} onCancel={alert.onCancel || closeAlert} />}
    </div>
  );
};

export default FormPengajuanUJK;