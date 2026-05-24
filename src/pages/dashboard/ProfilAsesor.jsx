import { useState } from 'react';

const ProfilAsesor = () => {
  const [formData, setFormData] = useState({
    namaLengkap: 'Mitsuri Kanroji',
    noTelp: '081234567890',
    email: 'asesor-mitsuri@blksurabaya.com', // Menambahkan email seperti di contoh Admin
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perubahan data profil Asesor berhasil disimpan!');
    console.log('Data profil yang disimpan:', formData);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Profil Asesor</h2>
        <p>Perbarui informasi data pribadi Anda sebagai Asesor.</p>
      </div>

      <div className="dashboard-card mt-20">
        <h3 style={{ marginBottom: '20px' }}>Update Data Pribadi</h3>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" name="namaLengkap" className="form-input" 
                value={formData.namaLengkap} onChange={handleInputChange} required
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="form-group">
              <label>Nomor Telepon (WhatsApp)</label>
              <input 
                type="tel" name="noTelp" className="form-input" 
                value={formData.noTelp} onChange={handleInputChange} required
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>

          <div className="form-group mt-20">
            <label>Email Login</label>
            <input 
              type="email" name="email" className="form-input" 
              value={formData.email} disabled 
              style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
              title="Email tidak dapat diubah secara mandiri."
            />
          </div>

          <div className="form-group" style={{ marginTop: '25px' }}>
            <button type="submit" className="btn-action" style={{ padding: '10px 24px' }}>
              Simpan Perubahan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilAsesor;