import { useState } from 'react';

const PenugasanPage = () => {
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
      surat: 0, admin: 0, spt: 0 
    },
    {
      id: 3, pendanaan: 'APBD', hari1: '31 Mar 2026', hari2: '01 Apr 2026',
      tuk: 'UPT BLK Nganjuk', bidang: 'TIK', skema: 'Practical Office Advance',
      asesi: 16, asesor1: '', asesor2: '', penyelia: '',
      surat: 0, admin: 0, spt: 0
    }
  ]);

  // Fungsi pembantu untuk merender indikator dokumen bergaya "Pill Badge"
  const renderDocBadge = (label, value) => {
    const isComplete = value === 1;
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        backgroundColor: isComplete ? '#d4edda' : '#f8f9fa',
        color: isComplete ? '#155724' : '#adb5bd',
        border: `1px solid ${isComplete ? '#c3e6cb' : '#dee2e6'}`,
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        <i className={`fas ${isComplete ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
        {label}
      </div>
    );
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Plotting Asesor & Penugasan</h2>
        <p>Validasi pengajuan dari BLK dan tentukan Asesor serta Penyelia yang bertugas sesuai jadwal.</p>
      </div>
      
      <div className="dashboard-card mt-20">
        <h3 style={{ marginBottom: '20px' }}>Daftar Pengajuan Menunggu Plotting</h3>
        <div style={{ overflowX: 'auto' }}>
          
          {/* Tabel gaya baru yang lebih compact dan terkelompok */}
          <table className="admin-table" style={{ width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '30%' }}>Informasi Pengajuan</th>
                <th style={{ width: '35%' }}>Plotting Tim Penugasan</th>
                <th style={{ width: '20%' }}>Status Dokumen</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {plottingData.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  
                  <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                    <span style={{ backgroundColor: '#e7f1ff', color: '#0056b3', padding: '5px 10px', borderRadius: '50%', fontWeight: 'bold' }}>
                      {index + 1}
                    </span>
                  </td>
                  
                  {/* PENGELOMPOKAN 1: Informasi TUK, Skema, dan Jadwal disatukan */}
                  <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1rem', color: '#212529' }}>{item.tuk}</strong>
                      <span className="badge info" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>{item.pendanaan}</span>
                    </div>
                    <div style={{ color: '#495057', marginBottom: '8px', lineHeight: '1.4' }}>
                      <span style={{ display: 'block', fontWeight: '600' }}>{item.skema}</span>
                      <small style={{ color: '#6c757d' }}>Bidang: {item.bidang} • {item.asesi} Asesi</small>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: '#0056b3', backgroundColor: '#f4f7f6', padding: '8px', borderRadius: '6px' }}>
                      <span><i className="far fa-calendar-alt"></i> <strong>Hari 1:</strong> {item.hari1}</span>
                      <span><i className="far fa-calendar-check"></i> <strong>Hari 2:</strong> {item.hari2}</span>
                    </div>
                  </td>

                  {/* PENGELOMPOKAN 2: Form Select disusun vertikal dengan label kecil yang rapi */}
                  <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ width: '65px', fontSize: '0.8rem', fontWeight: 'bold', color: '#6c757d' }}>Asesor 1</label>
                        <select className="form-select form-input-small" defaultValue={item.asesor1} style={{ flex: 1, padding: '6px 10px' }}>
                          <option value="">-- Pilih Asesor 1 --</option>
                          <option value="No Na Esther">No Na Esther</option>
                          <option value="Daniel Padilla">Daniel Padilla</option>
                          <option value="Lily">Lily</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ width: '65px', fontSize: '0.8rem', fontWeight: 'bold', color: '#6c757d' }}>Asesor 2</label>
                        <select className="form-select form-input-small" defaultValue={item.asesor2} style={{ flex: 1, padding: '6px 10px' }}>
                          <option value="">-- Pilih Asesor 2 --</option>
                          <option value="No Na Baila">No Na Baila</option>
                          <option value="Jake">Jake</option>
                          <option value="Danny">Danny</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ width: '65px', fontSize: '0.8rem', fontWeight: 'bold', color: '#6c757d' }}>Penyelia</label>
                        <select className="form-select form-input-small" defaultValue={item.penyelia} style={{ flex: 1, padding: '6px 10px' }}>
                          <option value="">-- Pilih Penyelia --</option>
                          <option value="No Na Shaz">No Na Shaz</option>
                          <option value="Emil Mario">Emil Mario</option>
                        </select>
                      </div>
                    </div>
                  </td>

                  {/* PENGELOMPOKAN 3: Status Dokumen dibuat menjadi kumpulan badge yang estetik */}
                  <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {renderDocBadge('Surat Balasan', item.surat)}
                      {renderDocBadge('Administrasi', item.admin)}
                      {renderDocBadge('SPT Asesor', item.spt)}
                    </div>
                  </td>

                  {/* Tombol Simpan */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <button 
                      className="btn-add" 
                      style={{ width: '100%', padding: '10px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }} 
                      onClick={() => alert('Data Plotting Disimpan!')}
                    >
                      <i className="fas fa-save" style={{ fontSize: '1.2rem' }}></i>
                      <span style={{ fontSize: '0.8rem' }}>Simpan</span>
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