import { useState } from 'react';

const VerifikasiSertifikat = () => {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // Reset hasil jika ada file baru yang dipilih
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Silakan pilih file dokumen/scan sertifikat terlebih dahulu!');
      return;
    }

    // Memulai simulasi loading pencocokan database
    setIsVerifying(true);
    setResult(null);

    // Simulasi delay proses pencarian data (2 detik)
    setTimeout(() => {
      setIsVerifying(false);
      // Contoh hasil simulasi: Data berhasil divalidasi dan ditemukan di database
      setResult({
        status: 'valid',
        noSertifikat: 'SER/JWD/10/26/001',
        nama: 'Andi Setiawan',
        nik: '35780123456789',
        skema: 'Junior Web Developer',
        tglTerbit: '14 Oktober 2026',
        penerbit: 'LSP UPT BLK Surabaya',
      });
    }, 2000);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Verifikasi Keaslian Sertifikat</h2>
        <p>Unggah dokumen scan sertifikat dari pihak eksternal (Perusahaan/Umum) untuk dicocokkan dengan database Buku Induk kami.</p>
      </div>

      <div className="dashboard-card mt-20">
        <h3 style={{ marginBottom: '20px' }}>Form Cek Keaslian</h3>
        
        <form className="admin-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label>Unggah Scan Sertifikat (PDF / JPG / PNG)</label>
            <input 
              type="file" 
              className="form-input" 
              accept=".pdf, .jpg, .jpeg, .png" 
              onChange={handleFileChange}
              style={{ padding: '10px 15px' }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '15px' }}>
            <button 
              type="submit" 
              className="btn-action" 
              disabled={isVerifying}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
              {isVerifying ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Memproses Data...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i> Mulai Verifikasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* TAMPILAN HASIL VERIFIKASI MUNCUL SETELAH LOADING SELESAI */}
      {result && (
        <div className="dashboard-card mt-20" style={{ borderTop: '5px solid #198754' }}>
          <h3 style={{ marginBottom: '20px', color: '#198754', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '1.5rem' }}></i> 
            Sertifikat Valid & Terdaftar!
          </h3>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef', lineHeight: '1.8' }}>
            <p style={{ margin: 0 }}><strong>Nomor Sertifikat:</strong> {result.noSertifikat}</p>
            <p style={{ margin: 0 }}><strong>Nama Pemilik:</strong> {result.nama}</p>
            <p style={{ margin: 0 }}><strong>NIK:</strong> {result.nik}</p>
            <p style={{ margin: 0 }}><strong>Skema Kompetensi:</strong> {result.skema}</p>
            <p style={{ margin: 0 }}><strong>Tanggal Terbit:</strong> {result.tglTerbit}</p>
            <p style={{ margin: 0 }}><strong>Diterbitkan Oleh:</strong> {result.penerbit}</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button className="btn-approve" onClick={() => alert('Hasil verifikasi diteruskan ke pihak eksternal/pemohon.')}>
              <i className="fas fa-paper-plane"></i> Kirim Bukti Validasi ke Pemohon
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerifikasiSertifikat;