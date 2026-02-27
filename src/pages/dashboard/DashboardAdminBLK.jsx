const DashboardAdminBLK = () => {
  return (
    <div className="dashboard-content">
      <h2>Dashboard Admin BLK</h2>
      <p>Formulir pengajuan UJK khusus untuk instansi BLK Anda.</p>
      
      <div className="dashboard-card mt-20">
        <h3>Form Pengajuan UJK Baru</h3>
        <form className="admin-form">
          <div className="form-group">
            <label>Pilihan Skema (Dari Master Skema)</label>
            <select className="form-input">
              <option>Welder SMAW 3G</option>
              <option>Junior Web Developer</option>
              <option>Teknisi AC Residensial</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Mulai</label>
              <input type="date" className="form-input" />
            </div>
            <div className="form-group">
              <label>Tanggal Selesai</label>
              <input type="date" className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label>Upload Surat & Data Peserta (PDF)</label>
            <input type="file" className="form-input" accept=".pdf" />
          </div>
          <button type="button" className="btn-add">Kirim Pengajuan UJK</button>
        </form>
      </div>
  
      <div className="dashboard-card mt-20">
        <h3>Riwayat Pengajuan</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Skema</th>
              <th>Tanggal</th>
              <th>Dokumen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Welder SMAW 3G</td>
              <td>20 - 22 Nov 2026</td>
              <td><a href="#">surat_peserta.pdf</a></td>
              <td><span className="badge info">Menunggu Super Admin</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdminBLK;