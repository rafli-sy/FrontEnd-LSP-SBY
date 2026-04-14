import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';

const ManajemenAkunAsesor = () => {
  const { userData, updateUserData } = useUser();
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => {
    if (!isEditing) setFormData({ ...userData });
  }, [userData, isEditing]);

  const masterSkemaList = [
    'Barista', 'Pembuatan Roti Dan Kue', 'Practical Office Advance', 
    'Teknisi Perawatan AC Residential', 'Welder SMAW 3G', 'Desain Grafis', 'Network Administrator'
  ];

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSkemaToggle = (skema) => {
    if (!isEditing) return; // Kunci jika tidak dalam mode edit
    const currentSkema = formData.skema || [];
    if (currentSkema.includes(skema)) {
      setFormData({ ...formData, skema: currentSkema.filter(s => s !== skema) });
    } else {
      setFormData({ ...formData, skema: [...currentSkema, skema] });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setAlert({ type: 'warning', title: 'Format Salah', text: 'Harap unggah file dalam format PDF.', onCancel: closeAlert });
      e.target.value = null;
      return;
    }
    setFormData({ ...formData, fileSertifikat: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.skema || formData.skema.length === 0) {
      setAlert({ type: 'warning', title: 'Skema Kosong', text: 'Pilih minimal satu skema sertifikasi.', onCancel: closeAlert });
      return;
    }

    setAlert({
      type: 'save', title: 'Simpan Lisensi?', text: 'Data sertifikasi Anda akan diperbarui di sistem.',
      onConfirm: () => {
        updateUserData(formData); // Sinkron ke pusat
        setIsEditing(false);
        setAlert({ type: 'success', title: 'Tersimpan!', text: 'Data Lisensi Asesor berhasil diperbarui.', onCancel: closeAlert });
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
          <h2 style={{ margin: 0, color: '#0f172a' }}>Lisensi & Sertifikasi Asesor</h2>
          <p className="text-muted">Kelola data profesional, nomor registrasi, dan keahlian Anda.</p>
        </div>
        {!isEditing && (
          <Button variant="outline" icon="edit" onClick={() => setIsEditing(true)}>Ubah Lisensi</Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* KOLOM KIRI: KARTU IDENTITAS (DITARIK DARI PUSAT) */}
        <div className="dashboard-card" style={{ flex: '1 1 300px', padding: '30px', textAlign: 'center', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#3b82f6', fontSize: '3.5rem', overflow: 'hidden' }}>
              {userData.foto ? <img src={userData.foto} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}}/> : <i className="fas fa-user-tie"></i>}
            </div>
            <div>
              <h3 style={{ margin: '10px 0 5px 0', color: '#0f172a', fontSize: '1.25rem' }}>{userData.namaLengkap}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}><i className="fas fa-map-marker-alt text-red"></i> {userData.alamat}</p>
            </div>
            
            <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', margin: '10px 0' }}></div>
            
            <div style={{ width: '100%', textAlign: 'left', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Status Asesor</span>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}><i className="fas fa-check-circle"></i> Aktif</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Skema</span>
                <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem' }}>{userData.skema ? userData.skema.length : 0} Keahlian</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORMULIR LISENSI */}
        <div className="dashboard-card" style={{ flex: '2 1 500px', padding: '35px' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
              <i className="fas fa-id-badge text-blue" style={{ marginRight: '8px' }}></i> Form Data Lisensi
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>Nomor Registrasi (MET)</label>
                <input type="text" className="form-input" name="noReg" value={formData.noReg || ''} onChange={handleInputChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>
              
              <div className="form-group">
                <label>Kejuruan / Bidang</label>
                <input type="text" className="form-input" name="kejuruan" value={formData.kejuruan || ''} onChange={handleInputChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Masa Berlaku Sertifikat</label>
                <input type="date" className="form-input" name="masaBerlaku" value={formData.masaBerlaku || ''} onChange={handleInputChange} disabled={!isEditing} style={{ backgroundColor: !isEditing ? '#f8fafc' : '#fff' }} required />
              </div>

              <div className="form-group">
                <label>Upload Sertifikat (PDF)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="file" id="upload-pdf" accept=".pdf" onChange={handleFileUpload} hidden disabled={!isEditing} />
                  <Button type="button" variant="outline" icon="upload" onClick={() => isEditing && document.getElementById('upload-pdf').click()} isFullWidth disabled={!isEditing}>
                    {formData.fileSertifikat ? 'Ganti File' : 'Pilih File PDF'}
                  </Button>
                </div>
                {formData.fileSertifikat && <small style={{ display: 'block', marginTop: '8px', color: '#10b981', fontWeight: '500' }}><i className="fas fa-file-pdf"></i> {formData.fileSertifikat.name}</small>}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '30px' }}>
              <label>Pilih Skema Yang Dikuasai</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px' }}>
                {masterSkemaList.map((skema, idx) => {
                  const isSelected = formData.skema && formData.skema.includes(skema);
                  return (
                    <label key={idx} style={{ 
                      padding: '10px 18px', 
                      borderRadius: '30px', 
                      border: `1.5px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`, 
                      backgroundColor: isSelected ? '#eff6ff' : (isEditing ? '#ffffff' : '#f8fafc'), 
                      cursor: isEditing ? 'pointer' : 'default', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '0.9rem', 
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected && isEditing ? '0 2px 4px rgba(59, 130, 246, 0.1)' : 'none'
                    }}>
                      <input type="checkbox" hidden checked={isSelected} onChange={() => handleSkemaToggle(skema)} disabled={!isEditing} />
                      <i className={`fas ${isSelected ? 'fa-check-circle text-blue' : 'fa-plus-circle text-muted'}`} style={{ color: isSelected ? '#3b82f6' : '#94a3b8' }}></i>
                      <span style={{ color: isSelected ? '#1e40af' : '#475569', fontWeight: isSelected ? '600' : '500' }}>{skema}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {isEditing && (
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <Button type="button" variant="secondary" icon="undo" onClick={() => { setIsEditing(false); setFormData({...userData}); }}>Batal Edit</Button>
                <Button type="submit" variant="primary" icon="save">Simpan Lisensi Asesor</Button>
              </div>
            )}
          </form>
        </div>
      </div>

      <AlertPopup {...alert} />
    </div>
  );
};

export default ManajemenAkunAsesor;