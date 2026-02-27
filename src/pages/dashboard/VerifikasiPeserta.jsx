const VerifikasiPeserta = () => {
  return (
    <div className="dashboard-content">
      <h2>Verifikasi Data Peserta</h2>
      <p>Periksa data hasil import Admin BLK untuk menghindari kesalahan ketik sebelum ujian.</p>

      <div className="dashboard-card mt-20">
        <h3>Antrean Verifikasi (Dari BLK Surabaya)</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>NIK</th>
              <th>Nama Lengkap</th>
              <th>Tempat, Tgl Lahir</th>
              <th>Pendidikan</th>
              <th>Aksi Validasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" className="form-input" defaultValue="357812345678" style={{ width: '150px', padding: '5px' }} /></td>
              <td><input type="text" className="form-input" defaultValue="Muhamad Ali" style={{ width: '150px', padding: '5px' }} /></td>
              <td>Surabaya, 12/04/1998</td>
              <td>SMA/SMK</td>
              <td>
                <button className="btn-add" style={{ padding: '6px 10px', fontSize: '0.8rem' }}><i className="fas fa-check"></i> Valid</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="btn-action mt-20">Setujui Semua Data</button>
      </div>
    </div>
  );
};

export default VerifikasiPeserta;