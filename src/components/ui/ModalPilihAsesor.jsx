import React, { useState, useMemo, useEffect } from 'react';
import './modal.css';

const ModalPilihAsesor = ({ 
  isOpen, 
  onClose, 
  targetRole, 
  masterAsesor = [], 
  daftarPenyelia = [], 
  onSelect, 
  defaultSkema = '',
  defaultBidang = '',
  defaultJenis = 'Klaster'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk Filter Cerdas
  const [filterSkema, setFilterSkema] = useState(defaultSkema || 'Semua');

  // Set default saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFilterSkema(defaultSkema || 'Semua');
      setSearchTerm('');
    }
  }, [isOpen, defaultSkema]);

  // Ambil daftar Skema Unik dari Master Asesor
  const uniqueSkemas = useMemo(() => {
    const skemas = new Set();
    masterAsesor.forEach(a => {
      if (a.skema) a.skema.forEach(s => skemas.add(s));
    });
    return Array.from(skemas).sort();
  }, [masterAsesor]);

  // AUTO-FILL Bidang & Jenis
  const autoFilledBidang = useMemo(() => {
    if (filterSkema === 'Semua') return '';
    if (filterSkema === defaultSkema) return defaultBidang;
    const matchAsesor = masterAsesor.find(a => a.skema?.includes(filterSkema));
    return matchAsesor ? matchAsesor.bidang : '';
  }, [filterSkema, defaultSkema, defaultBidang, masterAsesor]);

  const autoFilledJenis = useMemo(() => {
    if (filterSkema === 'Semua') return '';
    return defaultJenis; // Default Klaster sesuai form BLK
  }, [filterSkema, defaultJenis]);

  // LOGIKA SORTING & FILTERING
  const filteredData = useMemo(() => {
    if (targetRole === 'penyelia') {
      return daftarPenyelia
        .filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(p => ({ nama: p, isPenyelia: true }));
    }

    return masterAsesor
      .filter(a => {
        const matchSearch = a.nama.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSkema = filterSkema === 'Semua' || (a.skema && a.skema.includes(filterSkema));
        return matchSearch && matchSkema;
      })
      // SORTING: Prioritaskan yang paling jarang nguji (load1Tahun paling kecil)
      .sort((a, b) => a.load1Tahun - b.load1Tahun);

  }, [masterAsesor, daftarPenyelia, searchTerm, targetRole, filterSkema]);

  if (!isOpen) return null;

  const isAsesor = targetRole === 'asesor1' || targetRole === 'asesor2';

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ width: '650px', maxWidth: '95%', borderRadius: '12px', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        
        <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>
              <i className={`fas ${isAsesor ? 'fa-user-tie' : 'fa-user-shield'}`} style={{ color: '#3b82f6', marginRight: '8px' }}></i>
              Pilih {isAsesor ? (targetRole === 'asesor1' ? 'Asesor 1' : 'Asesor 2') : 'Penyelia LSP'}
            </h3>
            {isAsesor && <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Asesor diurutkan berdasarkan beban kerja paling sedikit (Prioritas).</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>

        <div className="modal-body" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input 
              type="text" placeholder={isAsesor ? "Cari nama asesor..." : "Cari nama penyelia..."} 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>

          {/* FILTER CERDAS (Seperti Admin BLK) */}
          {isAsesor && (
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Filter Skema</label>
                <select value={filterSkema} onChange={(e) => setFilterSkema(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}>
                  <option value="Semua">Semua Skema</option>
                  {uniqueSkemas.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Bidang </label>
                <input type="text" value={autoFilledBidang} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#e2e8f0', color: '#64748b', outline: 'none', fontWeight: '600' }} placeholder="-" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Jenis </label>
                <input type="text" value={autoFilledJenis} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#e2e8f0', color: '#64748b', outline: 'none', fontWeight: '600' }} placeholder="-" />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredData.length > 0 ? filteredData.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelect(item)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', 
                  border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff',
                  transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.05rem' }}>{item.nama}</h4>
                  {isAsesor && (
                    <>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                        <span><i className="fas fa-id-card"></i> {item.noReg || 'MET.XXXXXX'}</span>
                        <span><i className="fas fa-tag"></i> {item.bidang}</span>
                      </div>
                      {/* TAMPILAN SKEMA YANG DIKUASAI */}
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '6px', fontWeight: '600' }}>
                        <i className="fas fa-book" style={{ marginRight: '5px' }}></i>
                        Skema: {item.skema?.join(', ')}
                      </div>
                    </>
                  )}
                </div>

                {/* BADGE PRIORITAS BEBAN KERJA */}
                {isAsesor && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: item.load1Tahun === 0 ? '#ecfdf5' : item.load1Tahun < 5 ? '#eff6ff' : '#fffbeb',
                      color: item.load1Tahun === 0 ? '#10b981' : item.load1Tahun < 5 ? '#3b82f6' : '#d97706'
                    }}>
                      <i className="fas fa-tasks"></i> {item.load1Tahun} Kali Menguji
                    </span>
                    {idx === 0 && filterSkema !== 'Semua' && (
                       <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '6px', fontWeight: 'bold' }}>Prioritas Rekomendasi</div>
                    )}
                  </div>
                )}
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                <i className="fas fa-user-slash" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <p>Tidak ada data yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPilihAsesor;