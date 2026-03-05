import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ManajemenPesertaImport = () => {
  const [preview, setPreview] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      // Data nominatif biasanya mulai dari baris 12 (melewati kop dan header atas)
      const data = XLSX.utils.sheet_to_json(ws, { range: 11, defval: "" });
      
      // Filter hanya yang ada namanya (biar baris kosong tidak ikut)
      const validData = data.filter(row => row['Nama'] || row['NIK']);
      setPreview(validData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="dashboard-content">
      <h2>Import Data Nominatif Peserta</h2>
      <div className="dashboard-card">
        <div className="alert-info" style={{ backgroundColor: '#e7f3ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <i className="fas fa-info-circle"></i> Pastikan Anda menggunakan <strong>Template Nominatif UJK 2026</strong>. Data akan dibaca mulai dari baris ke-12.
        </div>
        <input type="file" onChange={handleFile} accept=".xlsx" className="form-input" />
      </div>

      {preview.length > 0 && (
        <div className="dashboard-card mt-20">
          <h3>Preview Data ({preview.length} Calon Asesi)</h3>
          <table className="admin-table">
            <thead>
              <tr><th>No</th><th>NIK</th><th>Nama Lengkap</th><th>L/P</th><th>Pendidikan</th></tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{row['NIK']}</td>
                  <td>{row['Nama']}</td>
                  <td>{row['Jenis Kelamin (L/P)']}</td>
                  <td>{row['Pendidikan Terakhir']}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-add mt-20" onClick={() => alert('Data disimpan di sistem!')}>Simpan Data Peserta</button>
        </div>
      )}
    </div>
  );
};

export default ManajemenPesertaImport;