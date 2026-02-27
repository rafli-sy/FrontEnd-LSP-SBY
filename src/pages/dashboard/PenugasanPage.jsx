const PenugasanPage = () => {
  return (
    <div className="dashboard-content">
      <h2>Plotting Asesor & Penugasan</h2>
      <p>Validasi pengajuan dari BLK dan tentukan Asesor serta Penyelia yang bertugas.</p>
      
      <div className="dashboard-card mt-20">
        <h3>Daftar Pengajuan Menunggu Plotting</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Instansi (BLK)</th>
                <th>Skema</th>
                <th>Tanggal Ujian</th>
                <th>Plotting Asesor & Penyelia</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>BLK Surabaya</strong><br/><small>012/BLK-SBY/UJK/2026</small></td>
                <td>Junior Web Developer</td>
                <td>12 - 14 Okt 2026</td>
                <td>
                  <select className="form-select" style={{ marginBottom: '8px' }}>
                    <option value="">-- Pilih Asesor 1 --</option>
                    <option value="1">Budi Santoso (IT)</option>
                    <option value="2">Ahmad Reza (IT)</option>
                  </select>
                  <select className="form-select" style={{ marginBottom: '8px' }}>
                    <option value="">-- Pilih Asesor 2 --</option>
                    <option value="3">Siti Aminah (IT)</option>
                  </select>
                  <select className="form-select">
                    <option value="">-- Pilih Penyelia --</option>
                    <option value="1">Joko Susilo</option>
                  </select>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <button className="btn-add"><i className="fas fa-save"></i> Simpan</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PenugasanPage;