import React, { useState } from 'react';

const FormPengajuanUJK = () => {
  const [submitted, setSubmitted] = useState(false);
  
  // Daftar skema asli dari file Excel "Master Skema & Penyelia"
  const listSkema = [
    "Pembuatan Roti Dan Kue",
    "Barista",
    "Practical Office Advance",
    "Junior Web Developer",
    "Teknisi Perawatan AC Residential",
    "Welder SMAW 3G"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="dashboard-card text-center" style={{ padding: '50px' }}>
        <i className="fas fa-paper-plane fa-3x" style={{ color: '#007bff', marginBottom: '20px' }}></i>
        <h2>Usulan Berhasil Dikirim!</h2>
        <p>Surat usulan Anda sedang diproses oleh Admin LSP. Mohon cek berkala di Dashboard.</p>
        <button className="btn-outline mt-20" onClick={() => setSubmitted(false)}>Buat Pengajuan Lagi</button>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h2>Form Permohonan UJK</h2>
      <div className="dashboard-card mt-20">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nomor Surat Keluar BLK</label>
              <input type="text" className="form-input" placeholder="Contoh: 400.3.5.3/XXX/2026" required />
            </div>
            <div className="form-group">
              <label>Skema Sertifikasi</label>
              <select className="form-select" required>
                <option value="">-- Pilih Skema --</option>
                {listSkema.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Rencana Tanggal Mulai</label>
              <input type="date" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Jumlah Peserta</label>
              <input type="number" className="form-input" placeholder="Contoh: 16" required />
            </div>
          </div>
          <div className="form-group">
            <label>Upload File Scan Surat Usulan (PDF)</label>
            <input type="file" className="form-input" accept=".pdf" required />
          </div>
          <button type="submit" className="btn-add mt-20" style={{ width: '100%' }}>
            Kirim Permohonan ke LSP Surabaya
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPengajuanUJK;