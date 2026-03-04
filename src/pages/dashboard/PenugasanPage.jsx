import { useState } from 'react';

const PenugasanPage = () => {
  // Data dummy gabungan dari gambar referensi Excel dan struktur Anda
  const [plottingData] = useState([
    {
      id: 1, pendanaan: 'APBD', hari1: '18 Feb 2026', hari2: '19 Feb 2026',
      tuk: 'UPT BLK Surabaya', bidang: 'Pariwisata', skema: 'Pembuatan Roti Dan Kue',
      asesi: 16, asesor1: 'No Na Esther', asesor2: 'Daniel Padilla', penyelia: 'Lily',
      surat: 1, admin: 1, spt: 1
    },
    {
      id: 2, pendanaan: 'APBD', hari1: '02 Mar 2026', hari2: '05 Mar 2026',
      tuk: 'UPT BLK Wonojati', bidang: 'Pariwisata', skema: 'Barista',
      asesi: 16, asesor1: '', asesor2: '', penyelia: '',
      surat: 0, admin: 0, spt: 0 // Contoh data yang belum di-plotting
    },
    {
      id: 3, pendanaan: 'APBD', hari1: '31 Mar 2026', hari2: '01 Apr 2026',
      tuk: 'UPT BLK Nganjuk', bidang: 'TIK', skema: 'Practical Office Advance',
      asesi: 16, asesor1: '', asesor2: '', penyelia: '',
      surat: 0, admin: 0, spt: 0
    }
  ]);

  // Fungsi pembantu untuk merender cell checklist warna hijau
  const renderChecklist = (value) => {
    return (
      <td style={{ 
        backgroundColor: value === 1 ? '#d4edda' : 'transparent', 
        textAlign: 'center', 
        fontWeight: 'bold',
        color: value === 1 ? '#155724' : '#adb5bd',
        borderRight: '1px solid #eee'
      }}>
        {value === 1 ? '✓' : '-'}
      </td>
    );
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Plotting Asesor & Penugasan</h2>
        <p>Validasi pengajuan dari BLK dan tentukan Asesor serta Penyelia yang bertugas sesuai jadwal.</p>
      </div>
      
      <div className="dashboard-card mt-20">
        <h3>Daftar Pengajuan Menunggu Plotting</h3>
        <div style={{ overflowX: 'auto' }}>
          {/* whiteSpace: nowrap menjaga agar tabel tidak bertumpuk jika layar sempit */}
          <table className="admin-table" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th rowSpan="2" style={{ borderRight: '1px solid #ddd', verticalAlign: 'middle' }}>No</th>
                <th rowSpan="2" style={{ borderRight: '1px solid #ddd', verticalAlign: 'middle' }}>Instansi (TUK)</th>
                <th colSpan="2" style={{ textAlign: 'center', borderRight: '1px solid #ddd' }}>Pelaksanaan</th>
                <th rowSpan="2" style={{ borderRight: '1px solid #ddd', verticalAlign: 'middle' }}>Skema</th>
                <th rowSpan="2" style={{ borderRight: '1px solid #ddd', verticalAlign: 'middle', textAlign: 'center' }}>Asesi</th>
                <th colSpan="3" style={{ textAlign: 'center', borderRight: '1px solid #ddd' }}>Plotting Tim Penugasan</th>
                <th colSpan="3" style={{ textAlign: 'center', borderRight: '1px solid #ddd' }}>Status Dokumen</th>
                <th rowSpan="2" style={{ verticalAlign: 'middle', textAlign: 'center' }}>Aksi</th>
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Hari 1</th>
                <th style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Hari 2</th>
                <th style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Asesor 1</th>
                <th style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Asesor 2</th>
                <th style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Penyelia</th>
                <th style={{ borderTop: '1px solid #ddd', textAlign: 'center' }}>Surat</th>
                <th style={{ borderTop: '1px solid #ddd', textAlign: 'center' }}>Admin</th>
                <th style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd', textAlign: 'center' }}>SPT</th>
              </tr>
            </thead>
            <tbody>
              {plottingData.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ borderRight: '1px solid #eee' }}>{index + 1}</td>
                  <td style={{ borderRight: '1px solid #eee' }}>
                    <strong>{item.tuk}</strong><br/>
                    <small className="text-muted">Pendanaan: {item.pendanaan}</small>
                  </td>
                  <td style={{ borderRight: '1px solid #eee' }}>{item.hari1}</td>
                  <td style={{ borderRight: '1px solid #eee' }}>{item.hari2}</td>
                  <td style={{ borderRight: '1px solid #eee' }}>
                    <strong>{item.skema}</strong><br/>
                    <small className="text-muted">Bidang: {item.bidang}</small>
                  </td>
                  <td style={{ borderRight: '1px solid #eee', textAlign: 'center' }}>{item.asesi}</td>
                  
                  {/* --- AREA PLOTTING (MENGGUNAKAN SELECT DARI KODE ANDA) --- */}
                  <td style={{ borderRight: '1px solid #eee' }}>
                    <select className="form-select form-input-small" defaultValue={item.asesor1}>
                      <option value="">-- Asesor 1 --</option>
                      <option value="No Na Esther">No Na Esther</option>
                      <option value="Daniel Padilla">Daniel Padilla</option>
                      <option value="Lily">Lily</option>
                    </select>
                  </td>
                  <td style={{ borderRight: '1px solid #eee' }}>
                    <select className="form-select form-input-small" defaultValue={item.asesor2}>
                      <option value="">-- Asesor 2 --</option>
                      <option value="No Na Baila">No Na Baila</option>
                      <option value="Jake">Jake</option>
                      <option value="Danny">Danny</option>
                    </select>
                  </td>
                  <td style={{ borderRight: '1px solid #eee' }}>
                    <select className="form-select form-input-small" defaultValue={item.penyelia}>
                      <option value="">-- Penyelia --</option>
                      <option value="No Na Shaz">No Na Shaz</option>
                      <option value="Emil Mario">Emil Mario</option>
                    </select>
                  </td>

                  {/* Render Checklist Dokumen */}
                  {renderChecklist(item.surat)}
                  {renderChecklist(item.admin)}
                  {renderChecklist(item.spt)}

                  {/* TOMBOL SIMPAN DARI KODE ANDA */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <button className="btn-add" onClick={() => alert('Data Plotting Disimpan!')}>
                      <i className="fas fa-save"></i> Simpan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PenugasanPage;