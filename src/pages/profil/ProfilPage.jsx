import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';

const ProfilPage = () => {
  const { userData, updateUserData } = useUser();
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...userData });

  useEffect(() => {
    // Sinkronkan form jika tiba-tiba data pusat berubah
    if (!isEditing) setTempData({ ...userData });
  }, [userData, isEditing]);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => setTempData({ ...tempData, foto: reader.result }); 
      reader.readAsDataURL(file); 
    }
    e.target.value = null; 
  };

  const handleChange = (e) => setTempData({ ...tempData, [e.target.name]: e.target.value });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setAlert({
      type: 'save', title: 'Simpan Perubahan?', text: 'Data diri Anda akan diperbarui di seluruh sistem.',
      onConfirm: () => {
        updateUserData(tempData); // Update data ke Context/Pusat
        setIsEditing(false);      // Tutup mode edit
        setAlert({ type: 'success', title: 'Sukses!', text: 'Profil berhasil diperbarui.', onCancel: closeAlert });
        if (alertTimer.current) clearTimeout(alertTimer.current);
        alertTimer.current = setTimeout(() => closeAlert(), 2500);
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      <div className="dashboard-header" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Profil Pengguna</h2>
          <p className="text-muted">Kelola informasi data diri, identitas, dan kontak Anda.</p>
        </div>
        {!isEditing && (
          <Button variant="outline" icon="user-edit" onClick={() => setIsEditing(true)}>Edit Profil</Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* KOLOM KIRI: KARTU FOTO PROFIL */}
        <div className="dashboard-card" style={{ flex: '1 1 300px', padding: '35px', textAlign: 'center', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div 
              onClick={() => isEditing && fileInputRef.current.click()}
              style={{ width: '140px', height: '140px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '4px solid #fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}
            >
              {tempData.foto ? (
                <img src={tempData.foto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="fas fa-user text-muted" style={{ fontSize: '4.5rem', color: '#cbd5e1' }}></i>
              )}
              {isEditing && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', padding: '8px 0', textAlign: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <i className="fas fa-camera"></i> Ubah
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} />
            
            <div style={{ marginTop: '10px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.25rem' }}>{tempData.namaLengkap}</h3>
              <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                <i className="fas fa-building" style={{ marginRight: '5px' }}></i> {tempData.instansi}
              </span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORMULIR PROFIL */}
        <div className="dashboard-card" style={{ flex: '2 1 500px', padding: '35px' }}>
          <form onSubmit={handleUpdateProfile}>
            <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
              <i className="fas fa-user-circle text-blue" style={{ marginRight: '8px' }}></i> Informasi Pribadi
            </h3>

            {/* INPUT GRID UNTUK LAPTOP/TABLET */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" className="form-input" name="namaLengkap" value={tempData.namaLengkap} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-input" name="username" value={tempData.username} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" name="email" value={tempData.email} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>No. Telepon / WhatsApp</label>
                <input type="tel" className="form-input" name="noTelp" value={tempData.noTelp} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input type="date" className="form-input" name="tanggalLahir" value={tempData.tanggalLahir} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select className="form-input" name="jenisKelamin" value={tempData.jenisKelamin} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* INPUT FULL WIDTH */}
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Asal Instansi / Lembaga</label>
              <input type="text" className="form-input" name="instansi" value={tempData.instansi} onChange={handleChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Alamat Lengkap Domisili</label>
              <textarea 
                className="form-input" 
                name="alamat" 
                value={tempData.alamat} 
                onChange={handleChange} 
                disabled={!isEditing} 
                required 
                rows="3" 
                // PERBAIKAN: Style sudah digabungkan menjadi satu objek
                style={{ 
                  backgroundColor: !isEditing ? '#f8fafc' : '#fff', 
                  resize: 'none' 
                }}
              ></textarea>
            </div>

            {isEditing && (
              <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <Button type="button" variant="secondary" icon="undo" onClick={() => { setIsEditing(false); setTempData({...userData}); }}>Batal Edit</Button>
                <Button type="submit" variant="primary" icon="save">Simpan Perubahan</Button>
              </div>
            )}
          </form>
        </div>

      </div>

      <AlertPopup {...alert} />
    </div>
  );
};

export default ProfilPage;