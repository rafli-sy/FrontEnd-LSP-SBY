import { useState } from 'react';

const FormPengajuanUJK = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Nanti ditambahkan logika kirim data ke API backend
  };

  return (
    <div className="dashboard-content">
      <h2>Form Pengajuan Surat UJK</h2>
      <p>Isi formulir pengajuan Uji Kompetensi untuk instansi Anda.</p>
  
      <div className="dashboard-card mt-20">
        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#28a745', marginBottom: '10px' }}></i>
            <h3>Pengajuan Berhasil Dikirim!</h3>
            <p>Admin LSP akan memproses dan melakukan plotting Asesor untuk pengajuan ini.</p>
            <button className="btn-action mt-20" onClick={() => setIsSubmitted(false)}>Buat Pengajuan Baru</button>
          </div>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nomor Surat Keluar</label>
                <input type="text" className="form-input" placeholder="Contoh: 012/BLK-SBY/UJK/2026" required />
              </div>
              <div className="form-group">
                <label>Pilihan Skema</label>
                <select className="form-select" required>
                  <option value="">-- Pilih Skema --</option>
                  <option value="IT">Junior Web Developer</option>
                  <option value="MF">Welder SMAW 3G</option>
                  <option value="OT">Servis Motor Injeksi</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Mulai Ujian</label>
                <input type="date" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Tanggal Selesai Ujian</label>
                <input type="date" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label>Upload Scan Surat Pengajuan (PDF)</label>
              <input type="file" className="form-input" accept=".pdf" required />
            </div>

            <button type="submit" className="btn-add mt-20">
              <i className="fas fa-paper-plane"></i> Kirim Pengajuan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormPengajuanUJK;