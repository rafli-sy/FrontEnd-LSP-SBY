import React, { useState, useEffect } from 'react';
import Button from './Button';

const ModalPembagianAsesi = ({ isOpen, onClose, dataUJK, onSave }) => {
  const [pesertaAssign, setPesertaAssign] = useState({});

  useEffect(() => {
    if (isOpen && dataUJK) {
      // Load data lama jika sudah pernah dibagi, jika belum, default ke Asesor 1
      const initialAssign = dataUJK.pesertaAssign || {};
      const asesiCount = dataUJK.asesi || 10;
      
      if (Object.keys(initialAssign).length === 0) {
        for (let i = 1; i <= asesiCount; i++) {
          initialAssign[i] = 'asesor1';
        }
      }
      setPesertaAssign(initialAssign);
    }
  }, [isOpen, dataUJK]);

  if (!isOpen) return null;

  // Generate data asesi dummy (sesuai jumlah asesi skema)
  const asesiCount = dataUJK?.asesi || 10;
  const dummyPeserta = Array.from({ length: asesiCount }).map((_, i) => ({
    id: i + 1,
    nama: `Peserta Nominatif ${i + 1}`,
    nik: `35780000000000${i}`,
    jk: i % 2 === 0 ? 'L' : 'P'
  }));

  const handleSave = () => {
    onSave(pesertaAssign); // Kirim data pembagian kembali ke PenugasanPage
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content modal-large" style={{ width: '800px', maxWidth: '95%', padding: '0', overflow: 'hidden' }}>
        
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
            <i className="fas fa-users-cog text-blue" style={{ marginRight: '8px' }}></i> Pembagian Asesor Penilai
          </h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.6 }}>
              <strong>Skema:</strong> {dataUJK?.judul} <br/>
              <strong>Asesor 1:</strong> {dataUJK?.asesor1 || 'Belum diplot'} <br/>
              <strong>Asesor 2:</strong> {dataUJK?.asesor2 || 'Belum diplot (Nonaktif jika kosong)'}
            </p>
          </div>

          <div style={{ maxHeight: '450px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="admin-table" style={{ width: '100%', fontSize: '0.85rem' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                <tr>
                  <th style={{ textAlign: 'center', width: '5%' }}>No</th>
                  <th style={{ width: '35%' }}>Nama Lengkap</th>
                  <th style={{ width: '20%' }}>NIK</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>L/P</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Asesor 1</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Asesor 2</th>
                </tr>
              </thead>
              <tbody>
                {dummyPeserta.map(p => (
                  <tr key={p.id}>
                    <td style={{ textAlign: 'center', color: '#64748b' }}>{p.id}</td>
                    <td style={{ fontWeight: 'bold', color: '#334155' }}>{p.nama}</td>
                    <td>{p.nik}</td>
                    <td style={{ textAlign: 'center' }}>{p.jk}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="radio" name={`asesor_${p.id}`} 
                        checked={pesertaAssign[p.id] === 'asesor1'} 
                        onChange={() => setPesertaAssign({...pesertaAssign, [p.id]: 'asesor1'})} 
                        style={{ cursor: 'pointer', accentColor: '#2563eb', width: '16px', height: '16px' }} 
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="radio" name={`asesor_${p.id}`} 
                        checked={pesertaAssign[p.id] === 'asesor2'} 
                        onChange={() => setPesertaAssign({...pesertaAssign, [p.id]: 'asesor2'})} 
                        disabled={!dataUJK?.asesor2} 
                        style={{ cursor: dataUJK?.asesor2 ? 'pointer' : 'not-allowed', accentColor: '#2563eb', width: '16px', height: '16px' }} 
                        title={!dataUJK?.asesor2 ? "Asesor 2 belum di-plot" : ""} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={onClose}>Batal</Button>
            <Button variant="primary" icon="save" onClick={handleSave}>Simpan Pembagian</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPembagianAsesi;