import React, { useState, useEffect } from 'react';
import Button from './Button';

const ModalCetakSurat = ({ isOpen, onClose, onGenerate, activeDocKey, selectedSubDoc, defaultData, dataUJK }) => {
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', includeTTD: false });
  const [pesertaAssign, setPesertaAssign] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultData || { noSurat: '', tanggalSurat: '', includeTTD: false });
      
      // Default: Semua asesi masuk ke Asesor 1 di awal jika belum pernah dibagi
      const initialAssign = dataUJK?.pesertaAssign || {};
      const asesiCount = dataUJK?.asesi || dataUJK?.jumlahAsesi || 10;
      
      if (Object.keys(initialAssign).length === 0) {
        for (let i = 1; i <= asesiCount; i++) {
          initialAssign[i] = 'asesor1';
        }
      }
      setPesertaAssign(initialAssign);
    }
  }, [isOpen, defaultData, dataUJK]);

  if (!isOpen) return null;

  // Generate data asesi/peserta (Bisa diganti data database asli nanti)
  const asesiCount = dataUJK?.asesi || dataUJK?.jumlahAsesi || 10;
  const dummyPeserta = Array.from({ length: asesiCount }).map((_, i) => ({
    id: i + 1,
    nama: `Peserta Nominatif ${i + 1}`,
  }));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim formData beserta data pembagian asesor ke halaman utama (untuk dikirim ke backend)
    onGenerate({ ...formData, pesertaAssign }); 
  };

  const showTTDCheckbox = ['balasan', 'SPT.01', 'SPT.02', 'SPM.01', 'SPM.02', 'SPM.03'].includes(activeDocKey);
  const isTemplateOnly = ['DOC.02', 'DOC.03', 'DOC.09', 'DOC.00'].includes(activeDocKey);
  const showPembagianAsesi = activeDocKey === 'DOC.01'; // Muncul khusus Laporan Penyelia

  const inputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', fontSize: '0.85rem', outline: 'none' };
  const labelStyle = { fontWeight: 'bold', fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '6px' };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ width: showPembagianAsesi ? '550px' : '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', overflow: 'hidden', transition: 'width 0.3s ease' }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{margin:0, fontSize: '1.1rem', color: '#0f172a'}}>Lengkapi Data {selectedSubDoc ? selectedSubDoc.name : 'Surat'}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>
        
        <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            
            {showTTDCheckbox && (
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <input type="checkbox" id="ttdCheck" name="includeTTD" checked={formData.includeTTD || false} onChange={handleInputChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }} />
                <label htmlFor="ttdCheck" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a8a', cursor: 'pointer', margin: 0 }}>Sertakan Tanda Tangan Digital</label>
              </div>
            )}

            {!isTemplateOnly && (
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>Nomor Surat</label>
                  <input type="text" style={inputStyle} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required />
                </div>
                <div>
                  <label style={labelStyle}>Tanggal Terbit Surat</label>
                  <input type="date" style={inputStyle} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required />
                </div>
              </div>
            )}

            {/* TABEL BAGI ASESI */}
            {showPembagianAsesi && (
              <div style={{ marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 15px', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '0.85rem', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                  <span><i className="fas fa-users-cog text-blue"></i> Pembagian Asesor Penilai</span>
                  <span style={{ fontWeight: 'normal', fontSize: '0.75rem' }}>Total: {asesiCount} Asesi</span>
                </div>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #cbd5e1', width: '15%' }}>No</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '45%' }}>Nama Asesi</th>
                        <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #cbd5e1', width: '20%' }}>Asesor 1</th>
                        <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #cbd5e1', width: '20%' }}>Asesor 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyPeserta.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 8px', textAlign: 'center', color: '#64748b' }}>{p.id}</td>
                          <td style={{ padding: '6px 8px', fontWeight: '600', color: '#334155' }}>{p.nama}</td>
                          <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                            <input type="radio" name={`asesor_${p.id}`} checked={pesertaAssign[p.id] === 'asesor1'} onChange={() => setPesertaAssign({...pesertaAssign, [p.id]: 'asesor1'})} style={{ cursor: 'pointer', accentColor: '#2563eb' }} />
                          </td>
                          <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                            <input type="radio" name={`asesor_${p.id}`} checked={pesertaAssign[p.id] === 'asesor2'} onChange={() => setPesertaAssign({...pesertaAssign, [p.id]: 'asesor2'})} disabled={!dataUJK?.asesor2} style={{ cursor: dataUJK?.asesor2 ? 'pointer' : 'not-allowed', accentColor: '#2563eb' }} title={!dataUJK?.asesor2 ? "Asesor 2 belum di-plot" : ""} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isTemplateOnly && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                 <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                   <i className="fas fa-info-circle" style={{color: '#3b82f6', marginRight: 5}}></i> 
                   Dokumen ini menggunakan <strong>template otomatis</strong> dari data UJK. Tidak ada detail tambahan yang perlu diketik.
                 </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" type="button" onClick={onClose} isFullWidth>Batal</Button>
              <Button type="submit" variant="primary" icon="paper-plane" isFullWidth>Proses Surat</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCetakSurat;