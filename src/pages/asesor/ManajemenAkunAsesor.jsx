import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Modal from '../../components/ui/Modal';
import './ManajemenAkunAsesor.css';

const ManajemenAkunAsesor = () => {
  // MENGAMBIL DATA GLOBAL DARI USER CONTEXT AGAR SINKRON
  const { userData, updateUserData } = useUser();

  const masterBidang = [
    'TIK', 'Garmen', 'Pariwisata', 'Otomotif', 'Bisnis Manajemen', 
    'Pertanian', 'Manufaktur', 'Kesehatan', 'Konstruksi', 'Logistik', 
    'Multimedia', 'Elektronika', 'Perhotelan', 'Kuliner', 'Desain Grafis', 'Teknologi Informasi'
  ];
  
  const skemaByBidang = {
    'TIK': ['Junior Web Developer', 'Network Administrator', 'Practical Office Advance', 'Pemrograman Web Full-Stack'],
    'Teknologi Informasi': ['Junior Web Developer', 'Network Administrator', 'Practical Office Advance', 'Pemrograman Web Full-Stack'],
    'Garmen': ['Menjahit dengan Mesin Lockstich', 'Pembuatan Pola Pakaian', 'Desain Fashion'],
    'Pariwisata': ['Barista', 'Pembuatan Roti Dan Kue', 'Tour Guide'],
    'Otomotif': ['Mekanik Sepeda Motor', 'Teknisi Mobil', 'Audio Video Mobil'],
    'Bisnis Manajemen': ['Administrasi Perkantoran', 'Akuntansi Dasar', 'Digital Marketing']
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });

  // State untuk Pop-up Bidang Keahlian
  const [isBidangModalOpen, setIsBidangModalOpen] = useState(false);
  const [bidangSearch, setBidangSearch] = useState('');
  const [bidangPage, setBidangPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    // Sinkronkan state lokal dengan data global
    if (!isEditing) setEditData({ ...userData });
  }, [userData, isEditing]);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) {
      setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2000);
    }
  };

  const handleEditClick = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSkemaToggle = (skemaName) => {
    const currentSkema = editData.skema || [];
    if (currentSkema.includes(skemaName)) {
      setEditData({ ...editData, skema: currentSkema.filter(s => s !== skemaName) });
    } else {
      setEditData({ ...editData, skema: [...currentSkema, skemaName] });
    }
  };

  const handleSave = () => {
    if (!editData.noReg || !editData.kejuruan || !editData.skema || editData.skema.length === 0) {
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan No. Reg, Bidang, dan Skema telah diisi.');
      return;
    }
    showAlert('save', 'Simpan Pembaruan', 'Apakah Anda yakin ingin menyimpan perubahan data lisensi ini?', () => {
      updateUserData(editData);
      setIsEditing(false);
      showAlert('success', 'Berhasil Disimpan', 'Data Lisensi dan Skema telah diperbarui secara global.');
    });
  };

  const filteredBidang = masterBidang.filter(b => b.toLowerCase().includes(bidangSearch.toLowerCase()));
  const totalBidangPages = Math.ceil(filteredBidang.length / ITEMS_PER_PAGE);
  const currentBidangItems = filteredBidang.slice((bidangPage - 1) * ITEMS_PER_PAGE, bidangPage * ITEMS_PER_PAGE);

  const handleSelectBidang = (b) => {
    setEditData({ ...editData, kejuruan: b, skema: [] });
    setIsBidangModalOpen(false);
    setBidangSearch('');
    setBidangPage(1);
  };

  const skemaOptions = editData.kejuruan && skemaByBidang[editData.kejuruan] ? skemaByBidang[editData.kejuruan] : [];

  return (
    <div className="dashboard-content fade-in-content" style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {alertConfig.type && (
        <AlertPopup 
          type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} 
          onConfirm={() => { if (alertConfig.action) alertConfig.action(); else setAlertConfig({ type: null }); }} 
          onCancel={() => setAlertConfig({ type: null })} 
        />
      )}

      <div className="dashboard-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Data Profil & Lisensi Asesor</h2>
        <p className="text-muted" style={{ margin: '5px 0 0 0' }}>Kelola informasi identitas, nomor registrasi MET, serta skema yang Anda kuasai.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* KARTU 1: INFORMASI PROFIL (SINKRON DARI USERCONTEXT) */}
        <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', color: '#0f172a' }}>
            <i className="fas fa-user-circle text-blue" style={{ marginRight: '8px' }}></i> Informasi Pribadi
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                  {userData.foto ? (
                    <img src={userData.foto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    userData.namaLengkap?.charAt(0) || 'A'
                  )}
               </div>
               <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1e293b' }}>{userData.namaLengkap}</h4>
                  <span style={{ fontSize: '0.85rem', padding: '4px 10px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '20px', fontWeight: 'bold' }}>Asesor Aktif</span>
               </div>
            </div>
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><small style={{ color: '#64748b', display: 'block' }}>Nomor Induk Kependudukan (NIK)</small><strong style={{ color: '#334155' }}>{userData.nik || '3578001122334455'}</strong></div>
              <div><small style={{ color: '#64748b', display: 'block' }}>Alamat Email</small><strong style={{ color: '#334155' }}>{userData.email}</strong></div>
              <div><small style={{ color: '#64748b', display: 'block' }}>No. Handphone / WhatsApp</small><strong style={{ color: '#334155' }}>{userData.noTelp}</strong></div>
            </div>
          </div>
        </div>

        {/* KARTU 2: LISENSI & KEAHLIAN (READ MODE) */}
        <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>
              <i className="fas fa-id-badge text-blue" style={{ marginRight: '8px' }}></i> Detail Lisensi
            </h3>
            <Button variant="outline" size="sm" icon="edit" onClick={handleEditClick}>Perbarui Lisensi</Button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div><small style={{ color: '#64748b', display: 'block' }}>Nomor Registrasi MET</small><strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{userData.noReg || '-'}</strong></div>
            <div>
              <small style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Sertifikat Asesor</small>
              <span style={{ display: 'inline-block', padding: '6px 12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #10b981' }}>
                <i className="fas fa-file-pdf" style={{ marginRight: '6px' }}></i> File Tersimpan
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div><small style={{ color: '#64748b', display: 'block' }}>Masa Berlaku</small><strong style={{ color: '#334155' }}>{userData.masaBerlaku || '-'}</strong></div>
              <div><small style={{ color: '#64748b', display: 'block' }}>Bidang Keahlian</small><strong style={{ color: '#3b82f6' }}>{userData.kejuruan || '-'}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '24px', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', color: '#0f172a' }}>
          <i className="fas fa-tags text-blue" style={{ marginRight: '8px' }}></i> Daftar Skema Kompetensi yang Dimiliki
        </h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {userData.skema && userData.skema.length > 0 ? (
            userData.skema.map((s, index) => (
              <div key={index} style={{ 
                 padding: '10px 20px', 
                 backgroundColor: '#eff6ff', 
                 color: '#1e3a8a', 
                 border: '1px solid #93c5fd', 
                 borderRadius: '12px', 
                fontSize: '0.95rem', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)' 
              }}>
                <i className="fas fa-check-circle" style={{ color: '#3b82f6' }}></i> {s}
              </div>
            ))
          ) : (
            <p className="text-muted" style={{ fontStyle: 'italic' }}>Belum ada skema kompetensi yang didaftarkan.</p>
          )}
        </div>
      </div>

      {/* MODAL EDIT LISENSI MENGGANTIKAN INLINE FORM */}
      <Modal isOpen={isEditing} onClose={handleCancelEdit} title="Perbarui Data Lisensi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>1. No. Registrasi MET <span style={{color:'red'}}>*</span></label>
            <input type="text" name="noReg" value={editData.noReg || ''} onChange={handleInputChange} placeholder="Contoh: MET.000.003697 2013" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>2. Upload File Sertifikat (PDF)</label>
            <input type="file" accept=".pdf" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>3. Masa Berlaku Sertifikat <span style={{color:'red'}}>*</span></label>
            <input type="date" name="masaBerlaku" value={editData.masaBerlaku || ''} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>4. Bidang Keahlian <span style={{color:'red'}}>*</span></label>
            <div 
               onClick={() => setIsBidangModalOpen(true)} 
               style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #3b82f6', backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{editData.kejuruan || '-- Klik untuk Memilih Bidang --'}</span>
              <i className="fas fa-search"></i>
            </div>
          </div>
          {editData.kejuruan && (
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '10px' }}>5. Pilih Skema Kompetensi (Bisa Lebih Dari 1)</label>
              {skemaOptions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {skemaOptions.map(skema => (
                    <label key={skema} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <input 
                         type="checkbox" 
                         checked={(editData.skema || []).includes(skema)} 
                         onChange={() => handleSkemaToggle(skema)} 
                         style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
                      />
                      <span style={{ fontSize: '0.9rem', color: '#334155' }}>{skema}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: 0 }}>Belum ada data skema untuk bidang ini.</p>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <Button variant="secondary" onClick={handleCancelEdit} style={{ flex: 1 }}>Batal</Button>
            <Button variant="primary" icon="save" onClick={handleSave} style={{ flex: 1 }}>Simpan Data</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isBidangModalOpen} onClose={() => setIsBidangModalOpen(false)} title="Pilih Bidang Keahlian">
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <i className="fas fa-search" style={{ position: 'absolute', top: '12px', left: '15px', color: '#94a3b8' }}></i>
          <input 
             type="text" 
             placeholder="Cari bidang keahlian..." 
             value={bidangSearch}
            onChange={(e) => { setBidangSearch(e.target.value); setBidangPage(1); }}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', minHeight: '220px', alignItems: 'start' }}>
          {currentBidangItems.length > 0 ? (
            currentBidangItems.map(b => (
              <div 
                 key={b} 
                 onClick={() => handleSelectBidang(b)}
                style={{ 
                   padding: '12px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: '600', transition: '0.2s',
                  borderColor: editData.kejuruan === b ? '#3b82f6' : '#cbd5e1',
                  backgroundColor: editData.kejuruan === b ? '#eff6ff' : '#fff',
                  color: editData.kejuruan === b ? '#1e3a8a' : '#334155'
                }}
              >
                {b}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
              Bidang tidak ditemukan.
            </div>
          )}
        </div>
        {totalBidangPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
            {Array.from({ length: totalBidangPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = bidangPage === pageNum;
              return (
                <button 
                   key={pageNum}
                  onClick={() => setBidangPage(pageNum)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: '1px solid', cursor: 'pointer', fontWeight: 'bold',
                    borderColor: isActive ? '#3b82f6' : '#cbd5e1',
                    backgroundColor: isActive ? '#3b82f6' : '#fff',
                    color: isActive ? '#fff' : '#475569'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ManajemenAkunAsesor;