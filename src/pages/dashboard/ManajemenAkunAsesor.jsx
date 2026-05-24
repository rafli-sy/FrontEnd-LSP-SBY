import { useState } from 'react';

const ManajemenAkunAsesor = () => {
  const [formData, setFormData] = useState({
    kejuruan: 'Teknologi Informasi',
    noReg: 'REG-IT-2025-00192',
    masaBerlaku: '2027-03-04',
    fileSertifikat: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, fileSertifikat: e.target.files[0] });
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
            <input 
              type="file" 
              className="form-input" 
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
              style={{ padding: '9px 15px' }} 
            />
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