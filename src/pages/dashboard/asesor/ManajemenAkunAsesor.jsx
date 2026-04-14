import { useState } from 'react';

const ManajemenAkunAsesor = () => {
  const [formData, setFormData] = useState({
    kejuruan: 'Teknologi Informasi',
    noReg: 'REG-IT-2025-00192',
    masaBerlaku: '2027-03-04',
    fileSertifikat: null,
    // Dummy link untuk simulasi sertifikat lama yang ada di database
    sertifikatLama: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, fileSertifikat: file });
    }
  };

  const handleLihatSertifikat = () => {
    if (formData.fileSertifikat) {
      // Jika ada file baru yang di-upload, buat URL object sementara untuk preview
      const fileUrl = URL.createObjectURL(formData.fileSertifikat);
      window.open(fileUrl, '_blank');
    } else if (formData.sertifikatLama) {
      // Jika tidak ada file baru, buka sertifikat lama dari database
      window.open(formData.sertifikatLama, '_blank');
    } else {
      alert('Belum ada sertifikat yang tersedia.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perubahan data kompetensi dan sertifikat berhasil disimpan!');
    console.log('Data kompetensi yang disimpan:', formData);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manajemen Akun Asesor</h2>
        <p>Kelola profil kompetensi kejuruan dan sertifikat teknis Anda di sini.</p>
      </div>

      <div className="dashboard-card mt-20">
        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', borderBottom: 'none' }}>
          Update Data Kejuruan & Sertifikasi
        </h3>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group mt-20">
            <label>Asal Kejuruan</label>
            <select 
              name="kejuruan" 
              className="form-select" 
              value={formData.kejuruan}
              onChange={handleInputChange}
            >
              <option value="Teknologi Informasi">Teknologi Informasi</option>
              <option value="Listrik">Listrik</option>
              <option value="Manufaktur">Manufaktur</option>
              <option value="Pariwisata">Pariwisata</option>
              <option value="Bisnis Manajemen">Bisnis Manajemen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nomor Registrasi</label>
            <input 
              type="text" 
              name="noReg" 
              className="form-input" 
              value={formData.noReg}
              onChange={handleInputChange}
              placeholder="Masukkan nomor registrasi Anda"
            />
          </div>

          <div className="form-group">
            <label>Masa Berlaku Sertifikat</label>
            <input 
              type="date" 
              name="masaBerlaku" 
              className="form-input" 
              value={formData.masaBerlaku}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Upload Sertifikat Baru (PDF/JPG)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="file" 
                className="form-input" 
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                style={{ padding: '9px 15px', flex: 1, marginBottom: '0' }} 
              />
              <button 
                type="button" 
                onClick={handleLihatSertifikat} 
                className="btn-action" 
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#6c757d', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                Lihat Sertifikat
              </button>
            </div>
            {/* Indikator visual opsional jika file baru berhasil dimuat ke memori browser */}
            {formData.fileSertifikat && (
              <small style={{ color: '#198754', display: 'block', marginTop: '8px' }}>
                <i className="fas fa-check-circle"></i> File baru dipilih: {formData.fileSertifikat.name}
              </small>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '25px' }}>
            <button type="submit" className="btn-action" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              Simpan Data Kejuruan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManajemenAkunAsesor;