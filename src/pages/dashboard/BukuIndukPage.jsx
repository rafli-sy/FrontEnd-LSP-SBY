const BukuIndukPage = () => {
  return (
    <div className="dashboard-content">
      <h2>Buku Induk Kelulusan</h2>
      <p>Database utama seluruh peserta UJK lintas BLK (A-G).</p>
      
      <div className="dashboard-card mt-20">
        {/* Fitur Filter untuk Pencarian */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <select className="form-select">
            <option value="">Semua BLK</option>
            <option value="surabaya">BLK Surabaya</option>
            <option value="wonojati">BLK Wonojati</option>
          </select>
          <select className="form-select">
            <option value="">Semua Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <input type="text" className="form-input" placeholder="Cari NIK / Nama Peserta..." />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Asal Instansi</th>
                <th>NIK / Nama</th>
                <th>Skema</th>
                <th>Tgl Lulus</th>
                <th>No. Sertifikat / Blanko</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BLK Surabaya</td>
                <td><strong>35780123456789</strong><br/>Andi Setiawan</td>
                <td>Junior Web Developer</td>
                <td>14 Okt 2026</td>
                <td>- (Dalam Proses Cetak)</td>
                <td><span className="badge warning">K - Belum Cetak</span></td>
              </tr>
              <tr>
                <td>BLK Wonojati</td>
                <td><strong>35780987654321</strong><br/>Dewi Lestari</td>
                <td>Welder SMAW 3G</td>
                <td>05 Sep 2026</td>
                <td>SER/WLD/09/26/001</td>
                <td><span className="badge info">K - Selesai</span></td>
              </tr>
              <tr>
                <td>BLK Surabaya</td>
                <td><strong>35780111222333</strong><br/>Bima Sakti</td>
                <td>Junior Web Developer</td>
                <td>14 Okt 2026</td>
                <td>-</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>BK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BukuIndukPage;