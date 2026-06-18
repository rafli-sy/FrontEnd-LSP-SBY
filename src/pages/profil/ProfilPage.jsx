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
  
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://lspblksurabaya.id';
  
  // Ambil token untuk mendeteksi perubahan sesi (ganti akun)
  const authToken = sessionStorage.getItem('auth_token');

  const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userRole = storedUser.role ? storedUser.role.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const isSuperAdmin = userRole === 'superadmin';

  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#475569' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#334155', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' };

  // --- FUNGSI BARU BUAT HAPUS FOTO ---
  const handleDeletePhoto = () => {
    setAlert({
      type: 'warning', 
      title: 'Hapus Foto Profil?', 
      text: 'Foto profil akan dihapus permanen dan kembali ke inisial nama. Lanjutkan?',
      onConfirm: async () => {
        closeAlert();
        setIsLoading(true);
        try {
          const resDelete = await fetch(`${apiUrl}/api/profile/delete-picture`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'ngrok-skip-browser-warning': '69420'
            }
          });

          const resultDelete = await resDelete.json();

          if (!resDelete.ok) {
            throw new Error(resultDelete.message || 'Gagal menghapus foto profil');
          }

          // Kosongin foto di layar
          setProfilePhotoUrl('');
          setSelectedFile(null);
          
          // Update context global pakai data fresh dari backend (fotonya udah null)
          updateUserData(resultDelete.data);

          setAlert({ type: 'success', title: 'Terhapus!', text: 'Foto profil berhasil dihapus.', onCancel: closeAlert });
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

  const fetchProfilePhoto = async () => {
    if (!authToken) {
      setProfilePhotoUrl('');
      return;
    }

    try {
      // PERBAIKAN 1: Tambahkan parameter timestamp (Cache-Busting) agar browser selalu mengambil foto terbaru
      const timestamp = new Date().getTime();
      const imgResponse = await fetch(`${apiUrl}/api/getFotoProfile?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      if (imgResponse.ok) {
        const imageBlob = await imgResponse.blob();
        
        if (imageBlob.type.includes('application/json')) {
          setProfilePhotoUrl('');
          return;
        }

        // PERBAIKAN 2: Pastikan ObjectURL lama dihapus sebelum membuat yang baru
        setProfilePhotoUrl((prev) => {
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
          return URL.createObjectURL(imageBlob);
        });
      } else {
        setProfilePhotoUrl('');
      }
    } catch (error) {
      console.error("Gagal load foto profil:", error);
      setProfilePhotoUrl('');
    }
  };

  const fetchProfileData = async () => {
    if (!authToken) return;
    try {
      const response = await fetch(`${apiUrl}/api/getProfile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.status === 'success' && resData.data) {
          updateUserData(resData.data);
        }
      }
    } catch (error) {
      console.error("Gagal memuat data profil:", error);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setTempData({ ...userData });
      setSelectedFile(null); 
    }
  }, [userData, isEditing]);

  // PERBAIKAN 3: Dependency diubah menjadi authToken agar foto di-fetch ulang saat user berganti
  useEffect(() => {
    fetchProfileData();
    fetchProfilePhoto();

    return () => {
      if (profilePhotoUrl && profilePhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, apiUrl]);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { 
      setSelectedFile(file); 
      const reader = new FileReader(); 
      reader.onloadend = () => setProfilePhotoUrl(reader.result); 
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
        const headers = {
          'Authorization': `Bearer ${authToken}`,
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
            asalDaerah: tempData.asalDaerah,
            asal_daerah: tempData.asalDaerah,
          };

          const resProfile = await fetch(`${apiUrl}/api/profile/update`, { 
            method: 'PUT', 
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadProfile)
          });

          const isJsonProfile = resProfile.headers.get('content-type')?.includes('application/json');
          const resultProfile = isJsonProfile ? await resProfile.json() : null;

          if (!resProfile.ok) { 
            // 1. Ambil pesan default (kalau bukan error validasi)
            let errorMsg = resultProfile?.message || 'Gagal memperbarui data profil';
            
            // 2. Trik nangkep custom message dari Backend (Laravel Validation)
            if (resultProfile?.errors) {
               // Ambil array error pertama yang dikirim Laravel (misal: asalDaerah)
               const firstError = Object.values(resultProfile.errors)[0][0];
               errorMsg = firstError; // Timpa pesannya dengan pesan dari backend lu
            }
            
            // 3. Lempar errornya biar ditangkep sama try-catch dan masuk ke AlertPopup
            throw new Error(errorMsg);
          }

          let updatedUserDariBackend = resultProfile.data;

          let latestFotoUrl = profilePhotoUrl;

          if (selectedFile) {
            const formData = new FormData();
            formData.append('fotoProfil', selectedFile);

            const resFoto = await fetch(`${apiUrl}/api/profile/update-picture`, { 
              method: 'POST', 
              headers: headers, 
              body: formData
            });

            const isJsonFoto = resFoto.headers.get('content-type')?.includes('application/json');
            const fotoResult = isJsonFoto ? await resFoto.json() : null;

            if (!resFoto.ok) {
               const isJson = resFoto.headers.get('content-type')?.includes('application/json');
               const errData = isJson ? await resFoto.json() : null;
               throw new Error(errData?.message || 'Data teks berhasil, tetapi gagal mengunggah foto profil.');
            }
            
            latestFotoUrl = fotoResult.data?.foto_url || fotoResult.foto_url || latestFotoUrl;
            updatedUserDariBackend.fotoProfil = latestFotoUrl;
            updatedUserDariBackend.foto = latestFotoUrl;
          }

          updateUserData(updatedUserDariBackend);
          
          await fetchProfilePhoto();
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

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(tempData.namaLengkap || 'User')}&background=random&color=fff&size=150`;

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
        {/* KARTU FOTO PROFIL */}
        <div className="dashboard-card" style={{ flex: '1 1 300px', padding: '35px', textAlign: 'center', position: 'sticky', top: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div 
              onClick={() => isEditing && fileInputRef.current.click()}
              style={{ 
                width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '4px solid #fff', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                overflow: 'hidden', cursor: isEditing ? 'pointer' : 'default', position: 'relative' 
              }}
            >
              <img 
                src={profilePhotoUrl || avatarFallback}  
                alt="Foto Profil"  
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = avatarFallback; 
                }}
              />
              {isEditing && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', padding: '8px 0', textAlign: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <i className="fas fa-camera"></i> Ubah
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} disabled={isLoading} />
            
            {isEditing && (profilePhotoUrl || userData?.fotoProfil) && (
               <button 
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={isLoading}
                  style={{ 
                    marginTop: '-5px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #f87171', 
                    padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
               >
                 <i className="fas fa-trash-alt"></i> Hapus Foto
               </button>
            )}

            <div style={{ marginTop: '10px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '800' }}>{tempData.namaLengkap || 'Nama Belum Diisi'}</h3>
              <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }} title="Instansi ditentukan oleh Super Admin">
                <i className="fas fa-building" style={{ marginRight: '5px' }}></i> 
                  {tempData.instansi?.namaInstitusi || 'Belum ada instansi'}
              </span>
            </div>
          </div>
        </div>

        {/* FORMULIR PROFIL */}
        <div className="dashboard-card" style={{ flex: '2 1 500px', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
          <form onSubmit={handleUpdateProfile}>
            <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', fontSize: '1.2rem', fontWeight: '800' }}>
              <i className="fas fa-user-circle text-blue" style={{ marginRight: '8px', color: '#3b82f6' }}></i> Informasi Pribadi
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input type="text" name="namaLengkap" value={tempData.namaLengkap || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', cursor: !isEditing ? 'not-allowed' : 'text' }} />
              </div>
              
              <div>
                <label style={labelStyle}>Username</label>
                <input 
                  type="text" name="username" value={tempData.username || ''} onChange={handleChange} disabled={!isEditing || isLoading || !isSuperAdmin} 
                  style={{ ...inputStyle, backgroundColor: (!isEditing || !isSuperAdmin) ? '#f8fafc' : '#fff', cursor: (!isEditing || !isSuperAdmin) ? 'not-allowed' : 'text' }} 
                  title={!isSuperAdmin ? "Hanya Super Admin yang dapat mengubah Username" : ""} 
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={tempData.email || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', cursor: !isEditing ? 'not-allowed' : 'text' }} />
              </div>

              <div>
                <label style={labelStyle}>No. Telepon / WhatsApp</label>
                <input type="tel" name="nomorTelpon" value={tempData.nomorTelpon || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', cursor: !isEditing ? 'not-allowed' : 'text' }} />
              </div>

              <div>
                <label style={labelStyle}>Tanggal Lahir</label>
                <input type="date" name="tanggalLahir" value={tempData.tanggalLahir || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', cursor: !isEditing ? 'not-allowed' : 'text' }} />
              </div>

              <div>
                <label style={labelStyle}>Jenis Kelamin</label>
                <select name="jenisKelamin" value={tempData.jenisKelamin === 'L' ? 'Laki-laki' : (tempData.jenisKelamin === 'P' ? 'Perempuan' : (tempData.jenisKelamin || ''))} onChange={handleChange} disabled={!isEditing || isLoading} style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', cursor: !isEditing ? 'not-allowed' : 'pointer' }}>
                  <option value="" disabled>Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Asal Daerah</label>
                <input type="text" name="asalDaerah" value={tempData.asalDaerah || tempData.asal_daerah || ''} onChange={handleChange} disabled={!isEditing || isLoading} style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', cursor: !isEditing ? 'not-allowed' : 'text' }} placeholder="Contoh: Surabaya" />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={labelStyle}>Alamat Lengkap Domisili</label>
              <textarea 
                name="alamatDomisili" value={tempData.alamatDomisili || ''} onChange={handleChange} disabled={!isEditing || isLoading} rows="3" 
                style={{ ...inputStyle, backgroundColor: !isEditing ? '#f8fafc' : '#fff', resize: 'none', fontFamily: 'inherit', cursor: !isEditing ? 'not-allowed' : 'text' }}
              ></textarea>
            </div>

            {isEditing && (
              <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
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