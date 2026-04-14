import React, { useState, useRef } from 'react'; 
import TablePeserta from '../TablePeserta/TablePeserta'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';

const FormPengajuanUJK = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState(null); 
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null); 
  
  const [usulan, setUsulan] = useState([
    { 
      id: 1, nomorSurat: '001/BLK-SBY/UJK/II/2026', pendanaan: 'APBN', skema: 'Barista', kejuruan: 'Pariwisata', tuk: 'TUK Sewaktu BLK Surabaya',
      tglMulai: '2026-02-21', tglSelesai: '2026-02-22', jumlahAsesi: 16, status: 'Pending',
      peserta: [
        { id: 1, nama: 'Mohammad Tohir', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '20 Juni 1990', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'tohirm@gmail.com', pendidikan: 'S1' },
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
  const [editingId, setEditingId] = useState(null); // State untuk melacak ID yang sedang diedit

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handleInputGlobalChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddSkema = () => setSkemaUsulan([...skemaUsulan, { id: Date.now(), skema: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
  const handleRemoveSkema = (id) => setSkemaUsulan(skemaUsulan.filter(s => s.id !== id));
  const handleSkemaChange = (id, field, value) => setSkemaUsulan(skemaUsulan.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleExcelUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const simulatedCount = Math.floor(Math.random() * 11) + 15; 
      handleSkemaChange(id, 'jumlahAsesi', simulatedCount);
      setAlert({ type: 'success', title: 'File Terbaca!', text: `Sistem menemukan ${simulatedCount} data calon asesi dari file Excel.`, onCancel: closeAlert });
      if (alertTimer.current) clearTimeout(alertTimer.current);
      alertTimer.current = setTimeout(() => closeAlert(), 2500);
    }
    e.target.value = null; 
  };

  // --- FUNGSI EDIT PENGAJUAN ---
  const handleEdit = (item) => {
    setShowForm(true);
    setEditingId(item.id);
    setFormData({ tuk: item.tuk, nomorSurat: item.nomorSurat, pendanaan: item.pendanaan });
    setSkemaUsulan([{ id: item.id, skema: item.skema, tglMulai: item.tglMulai, tglSelesai: item.tglSelesai, jumlahAsesi: item.jumlahAsesi || item.peserta?.length || 0 }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skemaUsulan.some(s => !s.skema || !s.tglMulai || !s.tglSelesai || !s.jumlahAsesi)) {
       setAlert({ type: 'warning', title: 'Data Belum Lengkap', text: 'Mohon isi seluruh bidang form, termasuk upload file Excel.', onCancel: closeAlert });
       return;
    }
    
    setAlert({
      type: 'save', title: editingId ? 'Simpan Perubahan?' : 'Kirim Pengajuan?', text: 'Pastikan seluruh dokumen dan data peserta sudah benar.',
      onConfirm: () => {
        const newUsulanList = skemaUsulan.map((s, index) => {
          const dummyPesertaBaru = Array.from({ length: parseInt(s.jumlahAsesi) || 10 }).map((_, i) => ({
            id: i + 1, nama: `Peserta Baru ke-${i + 1}`, nik: `35780000000000${i}`, jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', rt: '01', rw: '02', kelurahan: 'Sidoarjo', kecamatan: 'Sidoarjo Kota', hp: '0800000000', email: `peserta${i+1}@gmail.com`, pendidikan: 'SMK'
          }));
          const kejuruanSkema = masterSkema.find(m => m.judul === s.skema)?.kejuruan || 'Umum';
          return {
            id: editingId || Date.now() + index, nomorSurat: formData.nomorSurat, pendanaan: formData.pendanaan, tuk: formData.tuk,
            skema: s.skema, kejuruan: kejuruanSkema, tglMulai: s.tglMulai, tglSelesai: s.tglSelesai, jumlahAsesi: s.jumlahAsesi,
            status: 'Pending', peserta: dummyPesertaBaru
          };
        });

        if (editingId) {
          setUsulan(usulan.map(u => u.id === editingId ? newUsulanList[0] : u));
        } else {
          setUsulan([...newUsulanList, ...usulan]); // Taruh pengajuan baru di atas
        }
        
        setShowForm(false);
        setEditingId(null);
        setFormData({ tuk: '', nomorSurat: '', pendanaan: '' });
        setSkemaUsulan([{ id: Date.now(), skema: '', tglMulai: '', tglSelesai: '', jumlahAsesi: '' }]);
        
        setAlert({ type: 'success', title: 'Terkirim!', text: editingId ? 'Pengajuan berhasil diperbarui.' : 'Pengajuan UJK berhasil dikirim ke LSP.', onCancel: closeAlert });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2000);
      },
      onCancel: closeAlert
    });
  };

  const handleDelete = (id) => {
    setAlert({
      type: 'delete', title: 'Batalkan Pengajuan?', text: 'Pengajuan yang belum diproses akan ditarik kembali.',
      onConfirm: () => {
        setUsulan(usulan.filter(u => u.id !== id));
        setAlert({ type: 'success', title: 'Dibatalkan!', text: 'Pengajuan berhasil ditarik.', onCancel: closeAlert });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2000);
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content">
      {selectedPeserta ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali</Button>
            <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Peserta Ujian</h2><p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p></div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}><TablePeserta dataPeserta={selectedPeserta.peserta} skemaName={selectedPeserta.skema} /></div>
        </div>
      ) : (

        <div className="fade-in-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <div><h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Pengajuan UJK Baru</h2><p className="text-muted" style={{ margin: 0 }}>Isi formulir bertahap di bawah ini untuk mengajukan jadwal ujian kompetensi baru.</p></div>
            <div className="page-header-actions">
              <Button variant={showForm ? 'danger' : 'primary'} icon={showForm ? 'times' : (editingId ? 'edit' : 'plus')} size="lg" onClick={() => {setShowForm(!showForm); setEditingId(null);}}>
                {showForm ? 'Batal' : 'Buat Pengajuan Baru'}
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="form-container-main fade-in-content">
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="section-header"><div className="step-badge"></div><div><h3 className="section-title">Data Surat & Administrasi Global</h3><p className="section-subtitle">Lengkapi informasi dasar surat tugas dan skema pendanaan.</p></div></div>
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
                    <input type="file" className="form-input" accept=".pdf" required={!editingId} />
                    <small className="text-muted"><i className="fas fa-info-circle"></i> Wajib menggunakan format .pdf (Maks. 5MB) {editingId && '- Abaikan jika tidak ingin mengubah file'}</small>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header"><div className="step-badge"></div><div><h3 className="section-title">Data Pelaksanaan & Peserta</h3><p className="section-subtitle">Tambahkan skema, upload file Excel nominatif, dan sistem akan menghitung peserta otomatis.</p></div></div>
                  <div className="skema-dynamic-container">
                    {skemaUsulan.map((skema, index) => {
                      const selectedMaster = masterSkema.find(m => m.judul === skema.skema) || { kejuruan: '', jenis: '' };
                      return (
                        <div key={skema.id} className="skema-item-card fade-in-content">
                           <div className="skema-item-header">
                             <h4 className="skema-item-title" style={{ margin: 0 }}><span className="skema-badge"><i className="fas fa-layer-group"></i> Skema {index + 1}</span></h4>
                             {index > 0 && <Button variant="danger" size="sm" icon="trash-alt" className="btn-delete-skema" onClick={() => handleRemoveSkema(skema.id)}>Hapus Skema</Button>}
                           </div>
                           <div className="form-grid-3 mb-20">
                             <div className="form-group">
                               <label>Pilihan Skema Kompetensi <span style={{color: '#ef4444'}}>*</span></label>
                               <select className="form-input" value={skema.skema} onChange={(e) => handleSkemaChange(skema.id, 'skema', e.target.value)} required>
                                 <option value="">-- Pilih Judul Skema --</option>
                                 {masterSkema.map((item, idx) => <option key={idx} value={item.judul}>{item.judul}</option>)}
                               </select>
                             </div>
                             <div className="form-group"><label>Jenis Skema</label><input type="text" className="form-input" value={selectedMaster.jenis} readOnly placeholder="Terisi otomatis" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}}/></div>
                             <div className="form-group"><label>Kejuruan / Bidang</label><input type="text" className="form-input" value={selectedMaster.kejuruan} readOnly placeholder="Terisi otomatis" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}}/></div>
                           </div>
                           <div className="form-grid-2 mb-20">
                             <div className="form-group"><label>Tanggal Mulai <span style={{color: '#ef4444'}}>*</span></label><input type="date" className="form-input" value={skema.tglMulai} onChange={(e) => handleSkemaChange(skema.id, 'tglMulai', e.target.value)} required/></div>
                             <div className="form-group"><label>Tanggal Selesai <span style={{color: '#ef4444'}}>*</span></label><input type="date" className="form-input" value={skema.tglSelesai} onChange={(e) => handleSkemaChange(skema.id, 'tglSelesai', e.target.value)} required/></div>
                           </div>
                           <div className="form-grid-3">
                             <div className="form-group">
                               <label>File Nominatif Calon Asesi <span style={{color: '#ef4444'}}>*</span></label>
                               <input type="file" className="form-input" accept=".xls, .xlsx" onChange={(e) => handleExcelUpload(skema.id, e)} required={!editingId}/>
                               <small className="text-muted"><i className="fas fa-file-excel" style={{color: '#10b981'}}></i> Wajib upload .xls / .xlsx {editingId && '- Biarkan kosong jika tidak berubah'}</small>
                             </div>
                             <div className="form-group">
                               <label>Jumlah Peserta (Otomatis)</label>
                               <input type="number" className="form-input" value={skema.jumlahAsesi} readOnly placeholder="0" style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold'}} required/>
                               <small className="text-muted"><i className="fas fa-magic" style={{color: '#3b82f6'}}></i> Terbaca otomatis dari file Excel</small>
                             </div>
                             <div className="form-group">
                               <label>File Kurikulum Pelatihan <span style={{color: '#ef4444'}}>*</span></label>
                               <input type="file" className="form-input" accept=".pdf" required={!editingId}/>
                               <small className="text-muted"><i className="fas fa-file-pdf" style={{color: '#ef4444'}}></i> Wajib format .pdf</small>
                             </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                  {!editingId && <div className="mb-30 mt-20"><Button variant="dashed" size="lg" isFullWidth icon="plus-circle" onClick={handleAddSkema}>Tambah Skema Ujian Lainnya</Button></div>}
                </div>

                <div style={{ marginTop: '40px' }}>
                  <Button type="submit" variant="success" size="lg" isFullWidth icon="paper-plane" style={{ padding: '18px', fontSize: '1.15rem' }}>
                    {editingId ? 'Simpan Perubahan Pengajuan' : 'Kirim Seluruh Pengajuan UJK ke LSP'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="dashboard-card">
            <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Riwayat Pengajuan Ujian Saya</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>No.</th>
                    <th>Nomor Surat & Dana</th>
                    <th>Skema & TUK</th>
                    <th>Tanggal Pelaksanaan</th>
                    <th style={{ textAlign: 'center' }}>Peserta</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {usulan.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                      <td><strong style={{color: '#1e293b'}}>{item.nomorSurat || '-'}</strong><br/><span className="badge info" style={{ marginTop: '4px', display: 'inline-block' }}>{item.pendanaan}</span></td>
                      <td><strong style={{color: '#1e293b'}}>{item.skema}</strong><br/><small className="text-muted"><i className="fas fa-map-marker-alt"></i> {item.tuk}</small></td>
                      <td><span style={{fontWeight: '600'}}>{item.tglMulai}</span> <br/><small className="text-muted">s/d {item.tglSelesai}</small></td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPeserta(item)}>
                          <strong>{item.jumlahAsesi || item.peserta?.length || 0}</strong> Orang
                        </Button>
                      </td>
                      <td><span className={`badge ${item.status === 'Pending' ? 'warning' : 'success'}`}>{item.status}</span></td>
                      <td>
                        {item.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <Button variant="warning" size="sm" icon="edit" onClick={() => handleEdit(item)}>Edit</Button>
                             <Button variant="danger" size="sm" icon="trash" onClick={() => handleDelete(item.id)}>Batal</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <AlertPopup {...alert} />
    </div>
  );
};

export default FormPengajuanUJK;