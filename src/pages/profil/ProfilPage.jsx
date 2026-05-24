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
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';

  // --- Cek apakah user ini Super Admin atau bukan ---
  const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userRole = storedUser.role ? storedUser.role.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const isSuperAdmin = userRole === 'superadmin';
  // ----------------------------------------------------------

  useEffect(() => {
    if (!isEditing) {
      setTempData({ ...userData });
      setSelectedFile(null); 
    }
  }, [userData, isEditing]);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { 
      setSelectedFile(file); 
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
      type: 'save', title: 'Simpan Perubahan?', text: 'Data diri Anda akan diperbarui di sistem.',
      onConfirm: async () => {
        closeAlert();
        setIsLoading(true);
        const token = sessionStorage.getItem('auth_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        };

        try {
          const payloadProfile = {
            namaLengkap: tempData.namaLengkap,
            nomorTelpon: tempData.nomorTelpon,
            alamatDomisili: tempData.alamatDomisili,
            nama_lengkap: tempData.namaLengkap,
            nama: tempData.namaLengkap,
            nomor_telpon: tempData.nomorTelpon,
            no_telp: tempData.nomorTelpon,
            alamat_domisili: tempData.alamatDomisili,
            alamat: tempData.alamatDomisili,
            username: tempData.username, 
            email: tempData.email,
            tanggalLahir: tempData.tanggalLahir,
            jenisKelamin: tempData.jenisKelamin === 'Laki-laki' ? 'L' : (tempData.jenisKelamin === 'Perempuan' ? 'P' : tempData.jenisKelamin),
          };

          const resProfile = await fetch(`${apiUrl}/api/profile/update`, { 
            method: 'PUT', 
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadProfile)
          });

          if (!resProfile.ok) {
            const isJson = resProfile.headers.get('content-type')?.includes('application/json');
            const errData = isJson ? await resProfile.json() : null;
            throw new Error(errData?.message || 'Gagal memperbarui data profil');
          }

          let latestFotoUrl = userData.foto;

          if (selectedFile) {
            const formData = new FormData();
            formData.append('fotoProfil', selectedFile);
            formData.append('foto_profil', selectedFile);
            formData.append('foto', selectedFile);
            formData.append('avatar', selectedFile);

            const resFoto = await fetch(`${apiUrl}/api/profile/update-picture`, { 
              method: 'POST', 
              headers: headers, 
              body: formData
            });

            if (!resFoto.ok) {
               const isJson = resFoto.headers.get('content-type')?.includes('application/json');
               const errData = isJson ? await resFoto.json() : null;
               console.error("ALASAN BACKEND NOLAK FOTO:", errData);
               throw new Error(errData?.message || 'Data teks berhasil, tapi backend menolak foto profil. Cek F12 Console.');
            }
            
            const fotoResult = await resFoto.json();
            latestFotoUrl = fotoResult.foto_url || fotoResult.data?.foto_url || fotoResult.fotoProfil || fotoResult.foto_profil || latestFotoUrl;
          }

          updateUserData({ 
            ...tempData, 
            foto: latestFotoUrl 
          }); 
          
          setIsEditing(false);
          setAlert({ type: 'success', title: 'Sukses!', text: 'Profil berhasil diperbarui.', onCancel: closeAlert });
          alertTimer.current = setTimeout(() => closeAlert(), 2500);

        } catch (error) {
          console.error(error);
          setAlert({ type: 'error', title: 'Gagal', text: error.message, onCancel: closeAlert });
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: closeAlert
    });
  };

  return (
    <div className="dashboard-content fade-in-content">
      {/* REVISI: 
        Bagian <div style={{ marginBottom: '20px' }}> dengan Button "Kembali" 
        yang sebelumnya ada di sini TELAH DIHAPUS.
      */}

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
              style={{ 
                width: '140px', 
                height: '140px', 
                borderRadius: '50%', 
                backgroundColor: '#f8fafc', 
                border: '4px solid #fff', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                overflow: 'hidden',
                cursor: isEditing ? 'pointer' : 'default', 
                position: 'relative' 
              }}
            >
              {tempData.foto ? (
                <img 
                  src={tempData.foto.startsWith('data:') ? tempData.foto : `${apiUrl}/storage/${tempData.foto}`}  
                  alt="Foto Profil"  
                  style={{
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    padding: '5px'
                  }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
              ) : (
                <i className="fas fa-user text-muted" style={{ fontSize: '4.5rem', color: '#cbd5e1' }}></i>
              )}
              {isEditing && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', padding: '8px 0', textAlign: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <i className="fas fa-camera"></i> Ubah
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} disabled={isLoading} />
            
            <div style={{ marginTop: '10px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.25rem' }}>{tempData.namaLengkap || 'Nama Belum Diisi'}</h3>
              <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }} title="Instansi ditentukan oleh Super Admin">
                <i className="fas fa-building" style={{ marginRight: '5px' }}></i> {tempData.instansi || 'Belum ada instansi'}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" className="form-input" name="namaLengkap" value={tempData.namaLengkap || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>
              
              {/* Input Username terkunci (Hanya Super Admin) */}
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="username" 
                  value={tempData.username || ''} 
                  onChange={handleChange} 
                  disabled={!isEditing || isLoading || !isSuperAdmin} 
                  style={{ 
                    backgroundColor: (!isEditing || !isSuperAdmin) ? '#f8fafc' : '#fff',
                    cursor: (!isEditing || !isSuperAdmin) ? 'not-allowed' : 'text'
                  }} 
                  title={!isSuperAdmin ? "Hanya Super Admin yang dapat mengubah Username" : ""}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" name="email" value={tempData.email || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>No. Telepon / WhatsApp</label>
                <input type="tel" className="form-input" name="nomorTelpon" value={tempData.nomorTelpon || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input type="date" className="form-input" name="tanggalLahir" value={tempData.tanggalLahir || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select className="form-input" name="jenisKelamin" value={tempData.jenisKelamin === 'L' ? 'Laki-laki' : (tempData.jenisKelamin === 'P' ? 'Perempuan' : (tempData.jenisKelamin || ''))} onChange={handleChange} disabled={!isEditing || isLoading} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required>
                  <option value="" disabled>Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Alamat Lengkap Domisili</label>
              <textarea 
                className="form-input" 
                name="alamatDomisili"
                value={tempData.alamatDomisili || ''} 
                onChange={handleChange} 
                disabled={!isEditing || isLoading} 
                required 
                rows="3" 
                style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff', resize: 'none' }}
              ></textarea>
            </div>

            {isEditing && (
              <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <Button type="button" variant="secondary" icon="undo" onClick={() => { setIsEditing(false); setTempData({...userData}); setSelectedFile(null); }} disabled={isLoading}>Batal Edit</Button>
                <Button type="submit" variant="primary" icon={isLoading ? 'spinner' : 'save'} disabled={isLoading}>
                   {isLoading ? 'Memproses...' : 'Simpan Perubahan'}
                </Button>
              </div>
            )}
          </form>
        </div>

      </div>

      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default ProfilPage;