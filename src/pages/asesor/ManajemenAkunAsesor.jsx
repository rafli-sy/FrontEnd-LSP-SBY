import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import Modal from '../../components/ui/Modal';
import './ManajemenAkunAsesor.css';

const ManajemenAkunAsesor = () => {
  const { userData } = useUser();

  // STATE UNTUK DATA MASTER DARI BACKEND
  const [masterBidang, setMasterBidang] = useState([]);
  const [masterSkema, setMasterSkema] = useState([]);
  const [isLoadingMaster, setIsLoadingMaster] = useState(true);

  // STATE DATA ASESOR DARI BACKEND
  const [asesorData, setAsesorData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ noRegistrasi: '', masaBerlaku: '', bidang_id: null, kejuruanNama: '', skema_id: [], skemaNamas: [] });
  const [fileSertifikat, setFileSertifikat] = useState(null);

  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });
  const [isBidangModalOpen, setIsBidangModalOpen] = useState(false);
  const [bidangSearch, setBidangSearch] = useState('');
  const [bidangPage, setBidangPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- HELPER AMAN UNTUK MEMBACA NAMA KOLOM ---
  const getBidangName = (b) => b?.namaBidang || b?.nama_bidang || b?.nama || 'Tanpa Nama';
  const getSkemaName = (s) => s?.namaSkema || s?.nama_skema || s?.nama || 'Tanpa Nama';

  // --- FETCH MASTER DATA & ASESOR DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMaster(true);
      const token = sessionStorage.getItem('auth_token');
      const headers = { 'Accept': 'application/json', 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': '69420' };

      try {
        // PERBAIKAN: Menambahkan ?status=semua agar backend mengirim seluruh data
        const resBidang = await fetch(`${apiUrl}/api/master/bidang?status=semua`, { headers });
        const resSkema = await fetch(`${apiUrl}/api/master/skema?status=semua`, { headers });
        
        if (resBidang.ok) { 
            const result = await resBidang.json(); 
            // Ambil array dari data, mengatasi segala bentuk format pagination
            const arr = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
            setMasterBidang(arr); 
        }
        if (resSkema.ok) { 
            const result = await resSkema.json(); 
            const arr = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
            setMasterSkema(arr); 
        }

        // Ambil Data Asesor Login
        const resAsesor = await fetch(`${apiUrl}/api/asesor/data`, { headers });
        if (resAsesor.ok) {
          const resultAsesor = await resAsesor.json();
          if (resultAsesor.data) {
            setAsesorData(resultAsesor.data);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoadingMaster(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) {
      setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2000);
    }
  };

  const handleEditClick = () => {
    if (asesorData) {
      const currentBidangId = asesorData.bidang && asesorData.bidang.length > 0 ? asesorData.bidang[0].id : null;
      const currentBidangNama = asesorData.bidang && asesorData.bidang.length > 0 ? getBidangName(asesorData.bidang[0]) : '';
      const currentSkemaIds = asesorData.skema ? asesorData.skema.map(s => s.id) : [];
      const currentSkemaNamas = asesorData.skema ? asesorData.skema.map(s => getSkemaName(s)) : [];

      setEditData({
        noRegistrasi: asesorData.noRegistrasi || '',
        masaBerlaku: asesorData.masa_berlaku || '', 
        bidang_id: currentBidangId,
        kejuruanNama: currentBidangNama,
        skema_id: currentSkemaIds,
        skemaNamas: currentSkemaNamas
      });
    } else {
      setEditData({ noRegistrasi: '', masaBerlaku: '', bidang_id: null, kejuruanNama: '', skema_id: [], skemaNamas: [] });
    }
    setFileSertifikat(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => { setIsEditing(false); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFileSertifikat(e.target.files[0]);
  };

  const handleSkemaToggle = (skemaObj) => {
    const isExist = editData.skema_id.includes(skemaObj.id);
    if (isExist) {
      setEditData({
        ...editData,
        skema_id: editData.skema_id.filter(id => id !== skemaObj.id),
        skemaNamas: editData.skemaNamas.filter(nama => nama !== getSkemaName(skemaObj))
      });
    } else {
      setEditData({
        ...editData,
        skema_id: [...editData.skema_id, skemaObj.id],
        skemaNamas: [...editData.skemaNamas, getSkemaName(skemaObj)]
      });
    }
  };

  const handleSelectBidang = (bidangObj) => {
    setEditData({ 
      ...editData, 
      bidang_id: bidangObj.id, 
      kejuruanNama: getBidangName(bidangObj),
      skema_id: [], 
      skemaNamas: [] 
    });
    setIsBidangModalOpen(false);
    setBidangSearch('');
    setBidangPage(1);
  };

  // --- SUBMIT DATA KE BACKEND ---
  const handleSave = () => {
    if (!editData.noRegistrasi || !editData.bidang_id || editData.skema_id.length === 0) {
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan No. Reg, Bidang, dan Skema telah diisi.');
      return;
    }
    
    showAlert('save', 'Simpan Pembaruan', 'Apakah Anda yakin ingin menyimpan perubahan data lisensi ini?', async () => {
      try {
        const token = sessionStorage.getItem('auth_token');
        const formData = new FormData();
        formData.append('noRegistrasi', editData.noRegistrasi);
        formData.append('masaBerlaku', editData.masaBerlaku);
        formData.append('bidang_id[]', editData.bidang_id); 
        
        editData.skema_id.forEach(id => {
          formData.append('skema_id[]', id);
        });

        if (fileSertifikat) {
          formData.append('sertifikat', fileSertifikat);
        }

        const response = await fetch(`${apiUrl}/api/asesor/edit-data`, {
          method: 'POST', 
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          },
          body: formData
        });

        const result = await response.json();
        
        if (response.ok) {
          showAlert('success', 'Berhasil Disimpan', 'Data Lisensi dan Skema telah diperbarui.');
          setAsesorData(result.data); 
          setIsEditing(false);
        } else {
          throw new Error(result.message || 'Gagal menyimpan data.');
        }

      } catch (error) {
        console.error(error);
        showAlert('error', 'Gagal', error.message);
      }
    });
  };

  // Logic Render Bidang
  const filteredBidang = masterBidang.filter(b => getBidangName(b).toLowerCase().includes(bidangSearch.toLowerCase()));
  const totalBidangPages = Math.ceil(filteredBidang.length / ITEMS_PER_PAGE) || 1;
  const currentBidangItems = filteredBidang.slice((bidangPage - 1) * ITEMS_PER_PAGE, bidangPage * ITEMS_PER_PAGE);

  // Logic Render Skema berdasarkan Bidang yang dipilih
  const skemaOptions = masterSkema.filter(s => String(s.bidang_id) === String(editData.bidang_id));

  // Helper Tampilan Info Lisensi
  const namaBidangTampil = asesorData && asesorData.bidang && asesorData.bidang.length > 0 
    ? asesorData.bidang.map(b => getBidangName(b)).join(', ') : '-';
  const skemaTampil = asesorData && asesorData.skema ? asesorData.skema : [];

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
        
        {/* KARTU 1: INFORMASI PRIBADI */}
        <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', color: '#0f172a' }}>
            <i className="fas fa-user-circle text-blue" style={{ marginRight: '8px' }}></i> Informasi Pribadi
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                  {userData?.foto ? (
                    <img src={userData.foto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    userData?.namaLengkap?.charAt(0) || 'A'
                  )}
               </div>
               <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1e293b' }}>{userData?.namaLengkap || userData?.username}</h4>
                  <span style={{ fontSize: '0.85rem', padding: '4px 10px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '20px', fontWeight: 'bold' }}>Asesor Aktif</span>
               </div>
            </div>
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><small style={{ color: '#64748b', display: 'block' }}>Nomor Induk Kependudukan (NIK)</small><strong style={{ color: '#334155' }}>{userData?.nik || '-'}</strong></div>
              <div><small style={{ color: '#64748b', display: 'block' }}>Alamat Email</small><strong style={{ color: '#334155' }}>{userData?.email || '-'}</strong></div>
              <div><small style={{ color: '#64748b', display: 'block' }}>No. Handphone / WhatsApp</small><strong style={{ color: '#334155' }}>{userData?.noTelp || '-'}</strong></div>
            </div>
          </div>
        </div>

        {/* KARTU 2: LISENSI & KEAHLIAN (READ MODE) */}
        <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>
              <i className="fas fa-id-badge text-blue" style={{ marginRight: '8px' }}></i> Detail Lisensi
            </h3>
            <Button variant="outline" size="sm" icon="edit" onClick={handleEditClick} disabled={isLoadingMaster}>Perbarui Lisensi</Button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div><small style={{ color: '#64748b', display: 'block' }}>Nomor Registrasi MET</small><strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{asesorData?.noRegistrasi || '-'}</strong></div>
            <div>
              <small style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Sertifikat Asesor</small>
              {asesorData?.sertifikat ? (
                <a href={`${apiUrl}/storage/${asesorData.sertifikat}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '6px 12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #10b981', textDecoration: 'none' }}>
                  <i className="fas fa-file-pdf" style={{ marginRight: '6px' }}></i> Lihat Sertifikat
                </a>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>Sertifikat belum diunggah.</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div><small style={{ color: '#64748b', display: 'block' }}>Masa Berlaku</small><strong style={{ color: '#334155' }}>{asesorData?.masa_berlaku || '-'}</strong></div>
              <div><small style={{ color: '#64748b', display: 'block' }}>Bidang Keahlian</small><strong style={{ color: '#3b82f6' }}>{namaBidangTampil}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '24px', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', color: '#0f172a' }}>
          <i className="fas fa-tags text-blue" style={{ marginRight: '8px' }}></i> Daftar Skema Kompetensi yang Dimiliki
        </h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {skemaTampil.length > 0 ? (
            skemaTampil.map((s, index) => (
              <div key={index} style={{ 
                 padding: '10px 20px', backgroundColor: '#eff6ff', color: '#1e3a8a', 
                 border: '1px solid #93c5fd', borderRadius: '12px', fontSize: '0.95rem', 
                 fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', 
                 boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)' 
              }}>
                <i className="fas fa-check-circle" style={{ color: '#3b82f6' }}></i> {getSkemaName(s)}
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
            <input type="text" name="noRegistrasi" value={editData.noRegistrasi} onChange={handleInputChange} placeholder="Contoh: MET.000.003697 2013" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>2. Upload File Sertifikat Baru (PDF)</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc' }} />
            <small style={{color: '#94a3b8'}}>*Kosongi jika tidak ingin mengubah sertifikat saat ini.</small>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>3. Masa Berlaku Sertifikat</label>
            <input type="date" name="masaBerlaku" value={editData.masaBerlaku} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>4. Bidang Keahlian <span style={{color:'red'}}>*</span></label>
            <div 
               onClick={() => setIsBidangModalOpen(true)} 
               style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #3b82f6', backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{editData.kejuruanNama || '-- Klik untuk Memilih Bidang --'}</span>
              <i className="fas fa-search"></i>
            </div>
          </div>
          
          {editData.bidang_id && (
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '10px' }}>5. Pilih Skema Kompetensi (Bisa Lebih Dari 1)</label>
              {skemaOptions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {skemaOptions.map(skema => (
                    <label key={skema.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <input 
                         type="checkbox" 
                         checked={editData.skema_id.includes(skema.id)} 
                         onChange={() => handleSkemaToggle(skema)} 
                         style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px' }} 
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 'bold' }}>{getSkemaName(skema)}</span>
                         <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Kode: {skema.kodeSkema || skema.kode_skema || '-'}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: 0 }}>Belum ada data skema untuk bidang ini di sistem.</p>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <Button variant="secondary" onClick={handleCancelEdit} style={{ flex: 1 }}>Batal</Button>
            <Button variant="primary" icon="save" onClick={handleSave} style={{ flex: 1 }}>Simpan Data</Button>
          </div>
        </div>
      </Modal>

      {/* MODAL PILIH BIDANG */}
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
                 key={b.id} 
                 onClick={() => handleSelectBidang(b)}
                style={{ 
                   padding: '12px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: '600', transition: '0.2s',
                 borderColor: editData.bidang_id === b.id ? '#3b82f6' : '#cbd5e1',
                 backgroundColor: editData.bidang_id === b.id ? '#eff6ff' : '#fff',
                 color: editData.bidang_id === b.id ? '#1e3a8a' : '#334155'
                }}
              >
                {getBidangName(b)}
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