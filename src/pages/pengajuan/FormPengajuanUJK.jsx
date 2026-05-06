import React, { useState, useRef } from 'react';
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';

const FormPengajuanUJK = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState(null); 
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null); 
  
  // STATE DRAFT: Menyimpan data berdasarkan Nomor Surat (Bukan per skema lagi)
  const [draftUsulan, setDraftUsulan] = useState([
    { 
      id: 1, 
      nomorSurat: '001/BLK-SBY/UJK/II/2026', 
      pendanaan: 'APBN', 
      tuk: 'TUK Sewaktu BLK Surabaya',
      status: 'Draft',
      listSkema: [
        { idSkema: 101, skema: 'Barista', kejuruan: 'Pariwisata', tglMulai: '2026-02-21', tglSelesai: '2026-02-22', jumlahAsesi: 16 }
      ]
    }
  ]);

  const masterSkema = [
    { judul: 'Barista', kejuruan: 'Pariwisata', jenis: 'Klaster' },
    { judul: 'Pembuatan Roti Dan Kue', kejuruan: 'Pariwisata', jenis: 'Klaster' },
    { judul: 'Practical Office Advance', kejuruan: 'TIK', jenis: 'Klaster' },
    { judul: 'Teknisi Perawatan AC Residential', kejuruan: 'Refrigerasi', jenis: 'Okupasi' },
    { judul: 'Welder SMAW 3G', kejuruan: 'Manufaktur', jenis: 'KKNI' },
  ];

  const [formData, setFormData] = useState({ tuk: '', nomorSurat: '', pendanaan: '' });
  const [skemaUsulan, setSkemaUsulan] = useState([{ id: Date.now(), skema: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handleInputGlobalChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddSkema = () => setSkemaUsulan([...skemaUsulan, { id: Date.now(), skema: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
  const handleRemoveSkema = (id) => setSkemaUsulan(skemaUsulan.filter(s => s.id !== id));
  const handleSkemaChange = (id, field, value) => setSkemaUsulan(skemaUsulan.map(s => s.id === id ? { ...s, [field]: value } : s));

  // VALIDASI IMPORT DATA EXCEL
  const handleExcelUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ekstensi file
      const allowedExtensions = ['xls', 'xlsx'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setAlert({
          type: 'error',
          title: 'Format Salah!',
          text: 'Harap unggah file dengan format .xls atau .xlsx saja.',
          onCancel: closeAlert
        });
        e.target.value = null; // Reset input
        return;
      }

      const simulatedCount = Math.floor(Math.random() * 11) + 15; 
      handleSkemaChange(id, 'jumlahAsesi', simulatedCount);
      
      setAlert({ 
        type: 'success', 
        title: 'File Terbaca!', 
        text: `Sistem menemukan ${simulatedCount} data calon asesi tanpa error.`,
        onCancel: closeAlert 
      });
      
      if (alertTimer.current) clearTimeout(alertTimer.current);
      alertTimer.current = setTimeout(() => closeAlert(), 2500);
    }
    e.target.value = null; 
  };

  // SIMPAN SEBAGAI DRAFT
  const handleSimpanDraft = (e) => {
    e.preventDefault();
    if (skemaUsulan.some(s => !s.skema || !s.tglMulai || !s.tglSelesai || !s.jumlahAsesi)) {
       setAlert({
         type: 'warning', 
         title: 'Data Belum Lengkap', 
         text: 'Mohon isi seluruh bidang form, termasuk upload file Excel nominatif.',
         onCancel: closeAlert 
       });
       return;
    }
    
    // Simpan data sebagai 1 Surat dengan Array Skema di dalamnya
    const newDraft = {
      id: Date.now(),
      nomorSurat: formData.nomorSurat,
      pendanaan: formData.pendanaan,
      tuk: formData.tuk,
      status: 'Draft',
      listSkema: skemaUsulan.map((s, index) => ({
        idSkema: Date.now() + index,
        skema: s.skema,
        kejuruan: masterSkema.find(m => m.judul === s.skema)?.kejuruan || 'Umum',
        tglMulai: s.tglMulai,
        tglSelesai: s.tglSelesai,
        jumlahAsesi: s.jumlahAsesi
      }))
    };

    setDraftUsulan([newDraft, ...draftUsulan]);
    setShowForm(false);
    setFormData({ tuk: '', nomorSurat: '', pendanaan: '' });
    setSkemaUsulan([{ id: Date.now(), skema: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
    
    setAlert({ 
      type: 'success', 
      title: 'Tersimpan di Draft!', 
      text: 'Pengajuan berhasil disimpan. Anda bisa mengirimkannya melalui tabel di bawah.',
      onCancel: closeAlert 
    });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2000);
  };

  // AKSI CRUD DRAFT: KIRIM, BATAL, EDIT
  const handleKirimKeDashboard = (id) => {
    setAlert({
      type: 'save',
      title: 'Kirim Pengajuan?',
      text: 'Surat dan semua skema di dalamnya akan dikirim ke LSP dan masuk ke Dashboard.',
      onConfirm: () => {
        setDraftUsulan(draftUsulan.filter(d => d.id !== id));
        setAlert({ 
          type: 'success', 
          title: 'Terkirim!', 
          text: 'Data berhasil dikirim dan otomatis berpindah ke Dashboard.',
          onCancel: closeAlert 
        });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2500);
      },
      onCancel: closeAlert
    });
  };

  const handleBatalDraft = (id) => {
    setAlert({
      type: 'delete', title: 'Batalkan Draft?', text: 'Draft pengajuan ini akan dibatalkan permanen.',
      onConfirm: () => {
        setDraftUsulan(draftUsulan.filter(d => d.id !== id));
        setAlert({ type: 'success', title: 'Dibatalkan!', text: 'Draft berhasil dibatalkan.', onCancel: closeAlert });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2000);
      },
      onCancel: closeAlert
    });
  };

  const handleEditDraft = () => {
    setAlert({ type: 'info', title: 'Fitur Edit', text: 'Membuka ulang draft ke dalam form...', onCancel: closeAlert });
  };

  return (
    <div className="dashboard-content">
      <div className="fade-in-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Form Pengajuan UJK</h2>
            <p className="text-muted" style={{ margin: 0 }}>Input pengajuan baru sebagai draft sebelum dikirim ke Dashboard.</p>
          </div>
          <div className="page-header-actions">
            <Button variant={showForm ? 'danger' : 'primary'} icon={showForm ? 'times' : 'plus'} size="lg" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Batal Mengajukan' : 'Buat Draft Baru'}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="form-container-main fade-in-content">
            <form className="admin-form" onSubmit={handleSimpanDraft}>
              
              <div className="form-section">
                <div className="section-header">
                  <div className="step-badge">1</div>
                  <div>
                    <h3 className="section-title">Data Surat & Administrasi Global</h3>
                    <p className="section-subtitle">Lengkapi informasi dasar surat tugas dan skema pendanaan.</p>
                  </div>
                </div>
                
                <div className="form-grid-3 mb-20">
                  <div className="form-group">
                    <label>Tempat Uji Kompetensi (TUK) <span style={{color: '#ef4444'}}>*</span></label>
                    <select className="form-input" name="tuk" value={formData.tuk} onChange={handleInputGlobalChange} required>
                      <option value="">---Pilih Lokasi TUK---</option><option value="TUK Sewaktu BLK Surabaya">TUK Sewaktu BLK Surabaya</option><option value="TUK Mandiri">TUK Mandiri</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Nomor Surat Pengajuan <span style={{color: '#ef4444'}}>*</span></label><input type="text" className="form-input" name="nomorSurat" value={formData.nomorSurat} onChange={handleInputGlobalChange} placeholder="Contoh: 001/BLK/2026" required /></div>
                  <div className="form-group">
                    <label>Jenis Pendanaan <span style={{color: '#ef4444'}}>*</span></label>
                    <select className="form-input" name="pendanaan" value={formData.pendanaan} onChange={handleInputGlobalChange} required>
                      <option value="">---Pilih Sumber Dana---</option><option value="APBN">APBN</option><option value="APBD">APBD</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Unggah Surat Pengajuan UJK Utama <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="file" className="form-input" accept=".pdf" required />
                  <small className="text-muted"><i className="fas fa-info-circle"></i> Wajib format .pdf (Maks. 5MB)</small>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <div className="step-badge">2</div>
                  <div>
                    <h3 className="section-title">Data Pelaksanaan & Skema</h3>
                    <p className="section-subtitle">Tambahkan skema dan upload file nominatif.</p>
                  </div>
                </div>
                
                <div className="skema-dynamic-container">
                  {skemaUsulan.map((skema, index) => {
                    const selectedMaster = masterSkema.find(m => m.judul === skema.skema) || { kejuruan: '', jenis: '' };
                    return (
                      <div key={skema.id} className="skema-item-card fade-in-content">
                         <div className="skema-item-header">
                           <h4 className="skema-item-title" style={{ margin: 0 }}><span className="skema-badge"><i className="fas fa-layer-group"></i> Skema {index + 1}</span></h4>
                           {index > 0 && (
                             <Button variant="danger" size="sm" icon="trash-alt" className="btn-delete-skema" onClick={() => handleRemoveSkema(skema.id)}>Hapus Skema</Button>
                           )}
                         </div>
                         
                         <div className="form-grid-3 mb-20">
                           <div className="form-group">
                             <label>Pilihan Skema Kompetensi <span style={{color: '#ef4444'}}>*</span></label>
                             <select className="form-input" value={skema.skema} onChange={(e) => handleSkemaChange(skema.id, 'skema', e.target.value)} required>
                               <option value="">-- Pilih Judul Skema --</option>
                               {masterSkema.map((item, idx) => <option key={idx} value={item.judul}>{item.judul}</option>)}
                             </select>
                           </div>
                           <div className="form-group">
                             <label>Jenis Skema</label>
                             <input type="text" className="form-input" value={selectedMaster.jenis} readOnly placeholder="Terisi otomatis" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}}/>
                           </div>
                           <div className="form-group">
                             <label>Kejuruan / Bidang</label>
                             <input type="text" className="form-input" value={selectedMaster.kejuruan} readOnly placeholder="Terisi otomatis" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}}/>
                           </div>
                         </div>
                         
                         <div className="form-grid-2 mb-20">
                           <div className="form-group"><label>Tanggal Mulai <span style={{color: '#ef4444'}}>*</span></label><input type="date" className="form-input" value={skema.tglMulai} onChange={(e) => handleSkemaChange(skema.id, 'tglMulai', e.target.value)} required/></div>
                           <div className="form-group"><label>Tanggal Selesai <span style={{color: '#ef4444'}}>*</span></label><input type="date" className="form-input" value={skema.tglSelesai} onChange={(e) => handleSkemaChange(skema.id, 'tglSelesai', e.target.value)} required/></div>
                         </div>
                         
                         <div className="form-grid-3">
                           <div className="form-group">
                             <label>File Nominatif Calon Asesi <span style={{color: '#ef4444'}}>*</span></label>
                             <input type="file" className="form-input" accept=".xls, .xlsx" onChange={(e) => handleExcelUpload(skema.id, e)} required/>
                             <small className="text-muted"><i className="fas fa-file-excel" style={{color: '#10b981'}}></i> Wajib upload .xls / .xlsx</small>
                           </div>
                           <div className="form-group">
                             <label>Jumlah Peserta (Otomatis)</label>
                             <input type="number" className="form-input" value={skema.jumlahAsesi} readOnly placeholder="0" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold'}} required/>
                             <small className="text-muted"><i className="fas fa-magic" style={{color: '#3b82f6'}}></i> Terbaca otomatis dari Excel</small>
                           </div>
                           <div className="form-group">
                             <label>File Kurikulum <span style={{color: '#ef4444'}}>*</span></label>
                             <input type="file" className="form-input" accept=".pdf" required/>
                           </div>
                         </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-30 mt-20">
                  <Button variant="dashed" size="lg" isFullWidth icon="plus-circle" onClick={handleAddSkema}>Tambah Skema Lainnya di Surat Ini</Button>
                </div>
              </div>

              <div style={{ marginTop: '40px' }}>
                <Button type="submit" variant="primary" size="lg" isFullWidth icon="save" style={{ padding: '18px', fontSize: '1.15rem' }}>
                  Simpan Sebagai Draft
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="dashboard-card">
          <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Daftar Draft Pengajuan (Belum Terkirim)</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                  <th style={{ width: '25%' }}>Nomor Surat & TUK</th>
                  <th style={{ width: '35%' }}>Daftar Skema Terlampir</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '25%', textAlign: 'center' }}>Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody>
                {draftUsulan.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Belum ada draft pengajuan.</td></tr>
                ) : (
                  draftUsulan.map((draft, index) => (
                    <tr key={draft.id}>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                      <td>
                        <strong style={{color: '#1e293b'}}>{draft.nomorSurat}</strong><br/>
                        <span className="badge info" style={{ marginTop: '4px', marginBottom: '4px', display: 'inline-block' }}>{draft.pendanaan}</span><br/>
                        <small className="text-muted"><i className="fas fa-map-marker-alt"></i> {draft.tuk}</small>
                      </td>
                      <td>
                        <ul style={{ margin: 0, paddingLeft: '15px', color: '#334155', fontSize: '0.9rem' }}>
                          {draft.listSkema.map((sk, idx) => (
                            <li key={idx}><strong>{sk.skema}</strong> ({sk.jumlahAsesi} Asesi)</li>
                          ))}
                        </ul>
                      </td>
                      <td><span className="badge warning">Draft</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Button variant="outline" size="sm" icon="edit" onClick={handleEditDraft}>Edit</Button>
                          <Button variant="danger" size="sm" icon="times" onClick={() => handleBatalDraft(draft.id)}>Batal</Button>
                          <Button variant="success" size="sm" icon="paper-plane" onClick={() => handleKirimKeDashboard(draft.id)}>Kirim</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <AlertPopup {...alert} />
    </div>
  );
};

export default FormPengajuanUJK;