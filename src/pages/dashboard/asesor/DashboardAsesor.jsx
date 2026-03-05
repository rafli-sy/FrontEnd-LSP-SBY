const DashboardAsesor = () => {
  // Mock data: Menyimulasikan jadwal yang didapat dari backend
  const jadwalUjian = [
    { id: 1, tanggal: '2026-03-05', skema: 'Pemrograman Web Full-Stack', tuk: 'TUK UPT Pelatihan Kerja Surabaya', peserta: 15, status: 'Mendatang' },
    { id: 2, tanggal: '2026-03-12', skema: 'Database Management', tuk: 'TUK LSP Surabaya', peserta: 20, status: 'Menunggu Jadwal' }
  ];

  return (
    <div className="dashboard-content">
      <h2>Dashboard Asesor</h2>
      <p>Selamat datang. Berikut adalah daftar penugasan Ujian Kompetensi (UJK) Anda.</p>
  
      {/* Banner Notifikasi Kebijakan Sistem */}
      <div style={{ backgroundColor: '#e3f2fd', color: '#0d6efd', padding: '15px', borderRadius: '8px', marginTop: '20px', borderLeft: '5px solid #0d6efd' }}>
        <strong><i className="fas fa-info-circle"></i> Kebijakan Penugasan:</strong> Sistem secara otomatis membatasi jadwal Anda pada 1 ujian per hari (Single Task) untuk menjaga kualitas asesmen.
      </div>

      <div className="dashboard-card" style={{ marginTop: '25px' }}>
        <h3>Riwayat & Jadwal Penugasan UJK</h3>
        
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Tanggal</th>
                <th style={{ padding: '12px' }}>Skema Kejuruan</th>
                <th style={{ padding: '12px' }}>Lokasi (TUK)</th>
                <th style={{ padding: '12px' }}>Jml. Peserta</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {jadwalUjian.map((ujian) => (
                <tr key={ujian.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{ujian.tanggal}</td>
                  <td style={{ padding: '12px' }}>{ujian.skema}</td>
                  <td style={{ padding: '12px' }}>{ujian.tuk}</td>
                  <td style={{ padding: '12px' }}>{ujian.peserta} Orang</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      backgroundColor: ujian.status === 'Mendatang' ? '#198754' : '#ffc107', 
                      color: ujian.status === 'Mendatang' ? 'white' : 'black', 
                      borderRadius: '12px', 
                      fontSize: '12px' 
                    }}>
                      {ujian.status}
                    </span>
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

export default DashboardAsesor;