const DashboardAsesor = () => {
  return (
    <div className="dashboard-content">
      <h2>Dashboard Asesor</h2>
      <p>Kelola data profil, kompetensi kejuruan, dan sertifikat Anda.</p>
  
      <div className="dashboard-card mt-20">
        <h3>Update Profil & Kejuruan</h3>
        <form className="admin-form">
          <div className="form-group">
            <label>Asal Kejuruan</label>
            <select className="form-input">
              <option>Teknologi Informasi</option>
              <option>Teknik Manufaktur</option>
              <option>Otomotif</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nomor Registrasi</label>
            <input type="text" className="form-input" defaultValue="REG-IT-2024-00192" />
          </div>
          <div className="form-group">
            <label>Masa Berlaku Sertifikat</label>
            <input type="date" className="form-input" defaultValue="2028-12-31" />
          </div>
          <div className="form-group">
            <label>Upload Sertifikat Baru (PDF/JPG)</label>
            <input type="file" className="form-input" />
          </div>
          <button type="button" className="btn-action mt-20">Simpan Perubahan</button>
        </form>
      </div>
    </div>
  );
};

export default DashboardAsesor;