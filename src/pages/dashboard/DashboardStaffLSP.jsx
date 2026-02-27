const DashboardStaffLSP = () => {
  return (
    <div className="dashboard-content">
      <h2>Dashboard Staff LSP</h2>
      <p>Selamat datang, Administrator. Pantau tugas verifikasi dan antrean cetak sertifikat Anda di sini.</p>
  
      <div className="dashboard-card mt-20">
        <h3>Ringkasan Tugas Menunggu</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Jenis Tugas</th>
              <th>Jumlah Antrean</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Verifikasi Data Peserta</td>
              <td>24 Peserta Baru</td>
              <td><span className="badge warning">Perlu Dicek</span></td>
              <td><button className="btn-action">Lihat Data</button></td>
            </tr>
            <tr>
              <td>Pencetakan Sertifikat</td>
              <td>12 Sertifikat</td>
              <td><span className="badge info">Siap Cetak</span></td>
              <td><button className="btn-action">Proses Cetak</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardStaffLSP;