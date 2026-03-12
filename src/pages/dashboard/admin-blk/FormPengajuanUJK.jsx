import React, { useState } from 'react';

const FormPengajuanUJK = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState(null); // State untuk Full Screen Detail Peserta
  
  // Data simulasi riwayat pengajuan
  const [usulan, setUsulan] = useState([
    { 
      id: 1, 
      skema: 'Barista', 
      kejuruan: 'Pariwisata', 
      tglMulai: '2026-02-21', 
      tglSelesai: '2026-02-22', 
      status: 'Pending',
      peserta: [
        { id: 1, nama: 'Fernando Torres', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '1990-06-20', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'f.torres@gmail.com', pendidikan: 'S1' },
        { id: 2, nama: 'Budi Santoso', nik: '3578902006900002', jk: 'L', tempatLahir: 'Malang', tanggalLahir: '1995-08-15', alamat: 'Jl. Raya Mondoroko No 1', rt: '2', rw: '3', kelurahan: 'Singosari', kecamatan: 'Singosari', hp: '081234567890', email: 'budi@gmail.com', pendidikan: 'SMA/Sederajat' }
      ]
    }
  ]);

  const masterSkema = [
    { judul: 'Barista', jenis: 'Okupasi', kejuruan: 'Pariwisata' },
    { judul: 'Pembuatan Roti Dan Kue', jenis: 'Klaster', kejuruan: 'Pariwisata' },
    { judul: 'Practical Office Advance', jenis: 'Klaster', kejuruan: 'TIK' },
    { judul: 'Teknisi Perawatan AC Residential', jenis: 'Okupasi', kejuruan: 'Refrigerasi' },
    { judul: 'Welder SMAW 3G', jenis: 'Okupasi', kejuruan: 'Las' },
  ];

  const [formData, setFormData] = useState({ 
    skema: '', jenisSkema: '', kejuruan: '', tglMulai: '', tglSelesai: ''
  });

  const handleSkemaChange = (e) => {
    const pilihanSkema = e.target.value;
    const dataDitemukan = masterSkema.find(item => item.judul === pilihanSkema);
    if (dataDitemukan) {
      setFormData({ ...formData, skema: dataDitemukan.judul, jenisSkema: dataDitemukan.jenis, kejuruan: dataDitemukan.kejuruan });
    } else {
      setFormData({ ...formData, skema: '', jenisSkema: '', kejuruan: '' });
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dummyPesertaBaru = Array.from({ length: 16 }).map((_, i) => ({
      id: i + 1, nama: `Peserta Ujian ke-${i + 1}`, nik: `35780000000000${i}`, jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '2000-01-01', alamat: 'Jl. Pahlawan', rt: '1', rw: '2', kelurahan: 'Sidoarjo', kecamatan: 'Sidoarjo', hp: '0800000000', email: 'peserta@gmail.com', pendidikan: 'SMK'
    }));

    setUsulan([...usulan, { id: Date.now(), ...formData, status: 'Pending', peserta: dummyPesertaBaru }]);
    setShowForm(false);
    setFormData({ skema: '', jenisSkema: '', kejuruan: '', tglMulai: '', tglSelesai: '' });
  };

  const handleDelete = (id) => {
    if(window.confirm('Yakin ingin membatalkan pengajuan ini?')) {
      setUsulan(usulan.filter(u => u.id !== id));
    }
  };

  return (
    <div className="dashboard-content">
      
      {/* =========================================================
          LOGIKA TAMPILAN (Jika dipilih, tampilkan layar penuh data peserta)
          ========================================================= */}
      {selectedPeserta ? (
        
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <button onClick={() => setSelectedPeserta(null)} className="btn-outline" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-arrow-left"></i> Kembali
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Data Peserta Ujian</h2>
              <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '20px 0' }}>
            <div className="table-responsive" style={{ padding: '0 20px' }}>
              <table className="admin-table" style={{ border: '1px solid #e2e8f0', minWidth: '1300px' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center', width: '50px' }}>No.</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Nama Lengkap</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>NIK</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center', width: '80px' }}>L/P</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Tempat Lahir</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Tanggal Lahir</th>
                    <th colSpan="5" style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f1f5f9' }}>Tempat Tinggal</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>No. HP</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Email</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Pendidikan</th>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Alamat</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc', width: '50px' }}>RT</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc', width: '50px' }}>RW</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Kelurahan</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Kecamatan</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPeserta.peserta && selectedPeserta.peserta.length > 0 ? (
                    selectedPeserta.peserta.map((item, index) => (
                      <tr key={item.id}>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.nama}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.nik}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.jk}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.tempatLahir}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.tanggalLahir}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.alamat}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.rt}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.rw}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.kelurahan}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.kecamatan}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.hp}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.email}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.pendidikan}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="14" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        Data peserta belum diunggah atau tidak tersedia untuk skema ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      ) : (

        /* =========================================================
           TAMPILAN NORMAL HALAMAN PENGAJUAN
           ========================================================= */
        <div className="fade-in-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2>Kirim Pengajuan Ujian Baru</h2>
              <p className="text-muted">Pilih skema ujian, atur jadwal, upload surat, dan upload data peserta sekaligus di sini.</p>
            </div>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i> {showForm ? 'Batal' : 'Buat Pengajuan Baru'}
            </button>
          </div>

          {showForm && (
            <div className="dashboard-card fade-in-content" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: '20px' }}>Formulir Usulan Ujian & Data Peserta</h3>
              <form className="admin-form" onSubmit={handleSubmit}>
                
                <div className="form-group">
                  <label>Pilih Judul Skema Ujian</label>
                  <select className="form-select" name="skema" value={formData.skema} onChange={handleSkemaChange} required>
                    <option value="">-- Pilih Skema Sertifikasi --</option>
                    {masterSkema.map((item, index) => (
                      <option key={index} value={item.judul}>{item.judul}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Jenis Skema (Otomatis)</label>
                    <input type="text" className="form-input" value={formData.jenisSkema} placeholder="Terisi otomatis..." disabled style={{ backgroundColor: '#f8fafc', color: '#64748b' }} />
                  </div>
                  <div className="form-group">
                    <label>Kejuruan (Otomatis)</label>
                    <input type="text" className="form-input" value={formData.kejuruan} placeholder="Terisi otomatis..." disabled style={{ backgroundColor: '#f8fafc', color: '#64748b' }} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tanggal Mulai Ujian</label>
                    <input type="date" className="form-input" name="tglMulai" value={formData.tglMulai} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Selesai Ujian</label>
                    <input type="date" className="form-input" name="tglSelesai" value={formData.tglSelesai} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: '10px' }}>
                  <div className="form-group">
                    <label><i className="fas fa-file-pdf" style={{ color: '#dc3545' }}></i> Upload Bukti Surat Pengajuan (PDF)</label>
                    <input type="file" className="form-input" accept=".pdf" required />
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-file-excel" style={{ color: '#10b981' }}></i> Upload Data Peserta (Template Excel)</label>
                    <input type="file" className="form-input" accept=".xlsx, .xls, .csv" required />
                    <small style={{ color: '#0ea5e9', marginTop: '5px', display: 'block', cursor: 'pointer' }}>
                      <i className="fas fa-download"></i> Download Template Excel
                    </small>
                  </div>
                </div>

                <button type="submit" className="btn-add mt-20" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  <i className="fas fa-paper-plane"></i> Kirim Seluruh Pengajuan
                </button>
              </form>
            </div>
          )}

          <div className="dashboard-card">
            <h3>Riwayat Pengajuan Ujian Saya</h3>
            <div className="table-responsive mt-20">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>No.</th>
                    <th>Judul Skema</th>
                    <th>Tanggal Ujian (Mulai - Selesai)</th>
                    <th>Detail Peserta</th>
                    <th>Status Terkini</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {usulan.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                      <td><strong>{item.skema}</strong><br/><small className="text-muted">{item.kejuruan}</small></td>
                      <td>{item.tglMulai} s/d {item.tglSelesai}</td>
                      <td>
                        {/* TOMBOL GABUNGAN JUMLAH & DETAIL */}
                        <button 
                          onClick={() => setSelectedPeserta(item)} 
                          className="btn-outline btn-sm" 
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '130px', padding: '8px 12px' }}
                          title="Klik untuk melihat detail peserta"
                        >
                          <span><strong>{item.peserta?.length || 0}</strong> Orang</span>
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                      </td>
                      <td><span className={`badge ${item.status === 'Pending' ? 'warning' : 'success'}`}>{item.status}</span></td>
                      <td>
                        {item.status === 'Pending' && (
                          <button onClick={() => handleDelete(item.id)} className="btn-outline btn-sm" style={{ color: '#dc3545', borderColor: '#dc3545' }}>Batalkan</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {usulan.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>Belum ada pengajuan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPengajuanUJK;