const DashboardSuperAdmin = () => {
  return (
    <div className="dashboard-content">
      <h2>Dashboard Super Admin</h2>
      <p>Kelola Master Schema dan tetapkan Asesor untuk setiap pengajuan UJK.</p>
      
      <div className="dashboard-card mt-20">
        <h3>Menunggu Penugasan Asesor</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Instansi</th>
              <th>Judul Skema</th>
              <th>Tanggal Pelaksanaan</th>
              <th>Pilih Asesor 1</th>
              <th>Pilih Asesor 2</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BLK Surabaya</td>
              <td>Junior Web Developer</td>
              <td>12 - 14 Okt 2026</td>
              <td>
                <select className="form-select">
                  <option value="">-- Pilih Asesor IT --</option>
                  <option value="1">Budi Santoso (IT)</option>
                  <option value="2">Ahmad Reza (IT)</option>
                </select>
              </td>
              <td>
                <select className="form-select">
                  <option value="">-- Pilih Asesor IT --</option>
                  <option value="1">Budi Santoso (IT)</option>
                  <option value="2">Ahmad Reza (IT)</option>
                </select>
              </td>
              <td><button className="btn-action">Simpan Penugasan</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;