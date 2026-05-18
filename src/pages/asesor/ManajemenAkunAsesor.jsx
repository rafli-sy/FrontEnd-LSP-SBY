import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Modal from '../../components/ui/Modal';
import './ManajemenAkunAsesor.css';

const ManajemenAkunAsesor = () => {
  const { userData, updateUserData } = useUser();
  const [isFetching, setIsFetching] = useState(true);

  // State untuk menyimpan data dari Master API
  const [masterBidang, setMasterBidang] = useState([]);
  const [masterSkema, setMasterSkema] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    noRegistrasi: '',
    bidang_id: [],
    skema_id: [],
    sertifikatFile: null 
  });
  
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });
  
  // State untuk mengembalikan UI Sub-Modal Bidang yang lama
  const [isBidangModalOpen, setIsBidangModalOpen] = useState(false);
  const [bidangSearch, setBidangSearch] = useState('');
  const [bidangPage, setBidangPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  const token = localStorage.getItem('access_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // ==== 1. FETCH DATA ASESOR & MASTER DATA (DIPISAH AGAR AMAN) ====
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetching(true); 

      // Headers TANPA Token (Untuk master data publik)
      const publicHeaders = {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      };

      // Headers DENGAN Token (Untuk data spesifik user)
      const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      };

      // --- FETCH 1: MASTER BIDANG ---
      try {
        const resBidang = await fetch(`${baseUrl}/api/master/bidang`, { headers: publicHeaders });
        if (resBidang.ok) {
          const dataBidang = await resBidang.json();
          const arrBidang = dataBidang.data || dataBidang;
          setMasterBidang(Array.isArray(arrBidang) ? arrBidang : []);
        } else {
          console.error("Gagal fetch Bidang. Status:", resBidang.status);
        }
      } catch (error) {
        console.error('Error jaringan saat fetch Bidang:', error);
      }

      // --- FETCH 2: MASTER SKEMA ---
      try {
        const resSkema = await fetch(`${baseUrl}/api/master/skema`, { headers: publicHeaders });
        if (resSkema.ok) {
          const dataSkema = await resSkema.json();
          const arrSkema = dataSkema.data || dataSkema;
          setMasterSkema(Array.isArray(arrSkema) ? arrSkema : []);
        } else {
          console.error("Gagal fetch Skema. Status:", resSkema.status);
        }
      } catch (error) {
        console.error('Error jaringan saat fetch Skema:', error);
      }

      // --- FETCH 3: DATA PROFIL ASESOR ---
      try {
        const resAsesor = await fetch(`${baseUrl}/api/asesor/data`, { headers: authHeaders });
        if (resAsesor.ok) {
          const resultAsesor = await resAsesor.json();
          if (resultAsesor.data) {
            const asesorInfo = resultAsesor.data;
            
            updateUserData({
              ...userData,
              noReg: asesorInfo.noRegistrasi || '',
              bidang: asesorInfo.bidang || [], 
              skema: asesorInfo.skema || [], 
              sertifikatUrl: asesorInfo.sertifikat || null
            });

            setEditData({
              noRegistrasi: asesorInfo.noRegistrasi || '',
              bidang_id: asesorInfo.bidang ? asesorInfo.bidang.map(b => b.id) : [],
              skema_id: asesorInfo.skema ? asesorInfo.skema.map(s => s.id) : [],
              sertifikatFile: null
            });
          }
        } else {
          console.error("Gagal fetch Profil Asesor. Status:", resAsesor.status);
        }
      } catch (error) {
        console.error('Error jaringan saat fetch Profil Asesor:', error);
      }

      setIsFetching(false);
    };

    fetchInitialData();
  }, []); 

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) {
      setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2000);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      noRegistrasi: userData?.noReg || '',
      bidang_id: userData?.bidang?.map(b => b.id) || [],
      skema_id: userData?.skema?.map(s => s.id) || [],
      sertifikatFile: null
    });
  };

  const handleInputChange = (e) => setEditData({ ...editData, noRegistrasi: e.target.value });
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setEditData({ ...editData, sertifikatFile: e.target.files[0] });
    }
  };

  // Logika toggle bidang (Bisa pilih lebih dari satu)
  const handleBidangToggle = (id) => {
    const current = [...editData.bidang_id];
    if (current.includes(id)) {
      const skemaToKeep = masterSkema.filter(s => current.filter(b => b !== id).includes(s.bidang_id)).map(s => s.id);
      const updatedSkemaIds = editData.skema_id.filter(skemaId => skemaToKeep.includes(skemaId));
      
      setEditData({ 
        ...editData, 
        bidang_id: current.filter(b => b !== id),
        skema_id: updatedSkemaIds
      });
    } else {
      setEditData({ ...editData, bidang_id: [...current, id] });
    }
  };

  const handleSkemaToggle = (id) => {
    const current = [...editData.skema_id];
    if (current.includes(id)) {
      setEditData({ ...editData, skema_id: current.filter(s => s !== id) });
    } else {
      setEditData({ ...editData, skema_id: [...current, id] });
    }
  };

  // ==== 2. HANDLE SAVE ====
  const handleSave = () => {
    if (!editData.noRegistrasi || editData.bidang_id.length === 0 || editData.skema_id.length === 0) {
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan No. Registrasi MET, Bidang, dan Skema telah dipilih.');
      return;
    }

    showAlert('save', 'Simpan Pembaruan', 'Apakah Anda yakin ingin menyimpan perubahan data lisensi ini?', async () => {
      try {
        const formData = new FormData();
        formData.append('noRegistrasi', editData.noRegistrasi);
        
        editData.bidang_id.forEach(id => formData.append('bidang_id[]', id));
        editData.skema_id.forEach(id => formData.append('skema_id[]', id));
        
        if (editData.sertifikatFile) {
          formData.append('sertifikat', editData.sertifikatFile);
        }

        const response = await fetch(`${baseUrl}/api/asesor/edit-data`, {
          method: 'POST', 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          setIsEditing(false);
          showAlert('success', 'Berhasil Disimpan', 'Data Lisensi dan Skema telah diperbarui.');
          setTimeout(() => window.location.reload(), 1500); 
        } else {
          const errorMsg = result.errors ? Object.values(result.errors).flat().join('\n') : result.message;
          showAlert('warning', 'Gagal', errorMsg || 'Periksa kembali data Anda.');
        }
      } catch (error) {
        showAlert('warning', 'Error Jaringan', 'Terjadi kesalahan saat menghubungi server.');
      }
    });
  };

  // Pagination & Pencarian Bidang
  const filteredBidang = masterBidang.filter(b => (b.namaBidang || b.nama_bidang || '').toLowerCase().includes(bidangSearch.toLowerCase()));
  const totalBidangPages = Math.ceil(filteredBidang.length / ITEMS_PER_PAGE);
  const currentBidangItems = filteredBidang.slice((bidangPage - 1) * ITEMS_PER_PAGE, bidangPage * ITEMS_PER_PAGE);

  const skemaOptions = masterSkema.filter(skema => editData.bidang_id.includes(skema.bidang_id));

  if (isFetching || !userData) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Memuat data Asesor...</div>;
  }

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
        
        {/* KARTU 1: INFORMASI PROFIL */}
        <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', color: '#0f172a' }}>
            <i className="fas fa-user-circle text-blue" style={{ marginRight: '8px' }}></i> Informasi Pribadi
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {userData?.namaLengkap?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1e293b' }}>{userData?.namaLengkap || 'User Asesor'}</h4>
                  <span style={{ fontSize: '0.85rem', padding: '4px 10px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '20px', fontWeight: 'bold' }}>Asesor Aktif</span>
                </div>
             </div>
             <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><small style={{ color: '#64748b', display: 'block' }}>Alamat Email</small><strong style={{ color: '#334155' }}>{userData?.email || '-'}</strong></div>
                <div><small style={{ color: '#64748b', display: 'block' }}>Username</small><strong style={{ color: '#334155' }}>{userData?.username || '-'}</strong></div>
             </div>
          </div>
        </div>

        {/* KARTU 2: LISENSI & KEAHLIAN */}
        <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}><i className="fas fa-id-badge text-blue" style={{ marginRight: '8px' }}></i> Detail Lisensi</h3>
            <Button variant="outline" size="sm" icon="edit" onClick={handleEditClick}>Perbarui Lisensi</Button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div><small style={{ color: '#64748b', display: 'block' }}>Nomor Registrasi MET</small><strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{userData?.noReg || 'Belum Diatur'}</strong></div>
            <div>
              <small style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Sertifikat Lisensi Asesor</small>
              {userData?.sertifikatUrl ? (
                <a href={`${baseUrl}/storage/${userData.sertifikatUrl}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '6px 12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #10b981', textDecoration: 'none' }}>
                  <i className="fas fa-file-download" style={{ marginRight: '6px' }}></i> Lihat File Tersimpan
                </a>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#ef4444', fontStyle: 'italic' }}>File sertifikat belum diunggah.</span>
              )}
            </div>
            <div>
              <small style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Bidang Keahlian</small>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {userData?.bidang?.length > 0 ? userData.bidang.map(b => (
                   <span key={b.id} style={{ padding: '4px 8px', background: '#eff6ff', color: '#2563eb', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{b.namaBidang || b.nama_bidang}</span>
                )) : <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Belum ada bidang dipilih</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KARTU 3: DAFTAR SKEMA */}
      <div className="dashboard-card" style={{ marginTop: '24px', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', color: '#0f172a' }}>
          <i className="fas fa-tags text-blue" style={{ marginRight: '8px' }}></i> Daftar Skema Kompetensi yang Dimiliki
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {userData?.skema && userData.skema.length > 0 ? (
            userData.skema.map((s) => (
              <div key={s.id} style={{ padding: '10px 20px', backgroundColor: '#eff6ff', color: '#1e3a8a', border: '1px solid #93c5fd', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-check-circle" style={{ color: '#3b82f6' }}></i> {s.namaSkema || s.nama_skema}
              </div>
            ))
          ) : (
            <p className="text-muted" style={{ fontStyle: 'italic' }}>Belum ada skema kompetensi yang didaftarkan.</p>
          )}
        </div>
      </div>

      {/* MODAL EDIT LISENSI */}
      <Modal isOpen={isEditing} onClose={handleCancelEdit} title="Perbarui Data Lisensi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>1. No. Registrasi MET <span style={{color:'red'}}>*</span></label>
            <input type="text" value={editData.noRegistrasi} onChange={handleInputChange} placeholder="Contoh: MET.000.003697 2013" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>2. Upload File Sertifikat (PDF/JPG/PNG)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc' }} />
            <small style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>Maksimal ukuran file 2MB.</small>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>3. Bidang Keahlian <span style={{color:'red'}}>*</span></label>
            <div 
               onClick={() => setIsBidangModalOpen(true)} 
               style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #3b82f6', backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {editData.bidang_id.length > 0 
                  ? `${editData.bidang_id.length} Bidang Terpilih` 
                  : '-- Klik untuk Memilih Bidang --'}
              </span>
              <i className="fas fa-search"></i>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '10px' }}>4. Pilih Skema Kompetensi <span style={{color:'red'}}>*</span></label>
            {skemaOptions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {skemaOptions.map(skema => (
                  <label key={skema.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 0' }}>
                    <input type="checkbox" checked={editData.skema_id.includes(skema.id)} onChange={() => handleSkemaToggle(skema.id)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.85rem' }}>{skema.namaSkema || skema.nama_skema}</span>
                  </label>
                ))}
              </div>
            ) : editData.bidang_id.length > 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: 0, fontStyle: 'italic' }}>Belum ada data skema dari sistem untuk bidang yang Anda pilih.</p>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: 0, fontStyle: 'italic' }}>Pilih bidang terlebih dahulu untuk memunculkan pilihan skema.</p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <Button variant="secondary" onClick={handleCancelEdit} style={{ flex: 1 }}>Batal</Button>
            <Button variant="primary" icon="save" onClick={handleSave} style={{ flex: 1 }}>Simpan Data</Button>
          </div>
        </div>
      </Modal>

      {/* MODAL KEDUA UNTUK PENCARIAN BIDANG */}
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
            currentBidangItems.map(b => {
              const isSelected = editData.bidang_id.includes(b.id);
              return (
                <div 
                   key={b.id} 
                   onClick={() => handleBidangToggle(b.id)}
                  style={{ 
                     padding: '12px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: '600', transition: '0.2s',
                     borderColor: isSelected ? '#3b82f6' : '#cbd5e1',
                     backgroundColor: isSelected ? '#eff6ff' : '#fff',
                     color: isSelected ? '#1e3a8a' : '#334155',
                     display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span style={{ flex: 1, textAlign: 'center' }}>{b.namaBidang || b.nama_bidang}</span>
                  {isSelected && <i className="fas fa-check-circle" style={{ color: '#3b82f6', marginLeft: '5px' }}></i>}
                </div>
              );
            })
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
        <div style={{ marginTop: '20px' }}>
          <Button variant="primary" isFullWidth onClick={() => setIsBidangModalOpen(false)}>Selesai Memilih</Button>
        </div>
      </Modal>

    </div>
  );
};

export default ManajemenAkunAsesor;