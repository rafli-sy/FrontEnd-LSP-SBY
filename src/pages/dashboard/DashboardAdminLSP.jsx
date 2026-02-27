const DashboardAdminLSP = () => {
  return (
    <div className="dashboard-content">
      <h2>Dashboard Admin LSP</h2>
      <p>Panel penambahan usulan UJK dan pengaturan skema sertifikasi.</p>
  
      <div className="dashboard-card mt-20">
        <h3>Form Tambah Usulan UJK</h3>
        <form className="admin-form">
          <div className="form-group">
            <label>Pilih Skema UJK</label>
            <select className="form-input">
              <option>Pemasangan CCTV</option>
              <option>Operator Mesin Bubut</option>
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
            <label>Upload File Usulan</label>
            <input type="file" className="form-input" />
          </div>
          <button type="button" className="btn-add">Simpan Usulan</button>
        </form>
      </div>
    </div>
  );
};

export default DashboardAdminLSP;