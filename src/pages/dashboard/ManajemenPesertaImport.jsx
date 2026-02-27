import { useState } from 'react';
import * as XLSX from 'xlsx';

const ManajemenPesertaImport = () => {
  const [dataPreview, setDataPreview] = useState([]);
  const [fileName, setFileName] = useState('');

  // Fungsi untuk membaca file Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      // Mengubah file menjadi bentuk binary
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      // Mengambil sheet pertama
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Mengubah isi sheet menjadi format JSON (Array of Objects)
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      setDataPreview(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = () => {
    if (dataPreview.length === 0) {
      alert("Silakan upload file Excel terlebih dahulu!");
      return;
    }
    // Di sinilah nanti kamu mengirim `dataPreview` ke backend (API)
    console.log("Data siap dikirim ke backend:", dataPreview);
    alert(`Berhasil mengirim ${dataPreview.length} data peserta untuk diverifikasi.`);
    setDataPreview([]); // Kosongkan tabel setelah berhasil
    setFileName('');
  };

  return (
    <div className="dashboard-content">
      <h2>Import Data Peserta (Buku Induk)</h2>
      <p>Silakan upload file Excel (.xlsx) yang berisi data peserta UJK dari instansi Anda.</p>
      
      <div className="dashboard-card mt-20">
        <h3>Upload File Excel</h3>
        <form className="admin-form">
          <div className="form-group">
            <label>Pilih File Excel</label>
            <input 
              type="file" 
              className="form-input" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload}
            />
            {fileName && <small style={{ color: 'green', marginTop: '5px' }}>File terpilih: {fileName}</small>}
          </div>
          
          <div className="form-group mt-20">
            <button 
              type="button" 
              className="btn-add" 
              onClick={handleSubmit}
              disabled={dataPreview.length === 0}
            >
              <i className="fas fa-upload"></i> Submit Data Peserta
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Preview Muncul Jika Ada Data */}
      {dataPreview.length > 0 && (
        <div className="dashboard-card mt-20">
          <h3>Preview Data ({dataPreview.length} Peserta)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NIK</th>
                  <th>Nama Lengkap</th>
                  <th>Tempat Lahir</th>
                  <th>Tgl Lahir</th>
                  <th>Jenis Kelamin</th>
                  <th>No. HP</th>
                </tr>
              </thead>
              <tbody>
                {dataPreview.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {/* Sesuaikan kunci (key) ini dengan header/kolom di file Excel aslimu */}
                    <td>{row.NIK || row.nik || '-'}</td>
                    <td>{row.Nama || row.nama || row['Nama Lengkap'] || '-'}</td>
                    <td>{row.TempatLahir || row['Tempat Lahir'] || '-'}</td>
                    <td>{row.TglLahir || row['Tgl Lahir'] || '-'}</td>
                    <td>{row.JenisKelamin || row['Jenis Kelamin'] || '-'}</td>
                    <td>{row.NoHP || row['No HP'] || row['No. HP'] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPesertaImport;