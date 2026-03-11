import React, { useState } from 'react';

const ManajemenPesertaImport = () => {
  // Data simulasi (contoh isi Excel setelah di-import)
  const [peserta, setPeserta] = useState([
    {
      id: 1,
      nama: 'Fernando Torres',
      nik: '3578902006900001',
      jk: 'L',
      tempatLahir: 'Surabaya',
      tanggalLahir: '1990-06-20',
      alamat: 'Dukuh Menanggal III/29',
      rt: '1',
      rw: '1',
      kelurahan: 'Dukuh Menanggal',
      kecamatan: 'Gayungan',
      hp: '089689029754',
      email: 'f.torres@gmail.com',
      pendidikan: 'S1'
    }
  ]);

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Upload Data Peserta</h2>
          <p className="text-muted">Pilih file Excel (Template Nominatif) untuk melihat preview data sebelum dikirim.</p>
        </div>
        <button className="btn-outline">
          <i className="fas fa-download"></i> Download Template Excel
        </button>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Preview Data Nominatif UJK</h3>
          <button className="btn-add">
            <i className="fas fa-file-excel"></i> Pilih File Excel
          </button>
        </div>

        {/* Tabel Preview Persis Seperti Excel */}
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ border: '1px solid #e2e8f0', minWidth: '1300px' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center', width: '50px' }}>No.</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Nama</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>NIK</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center', width: '80px' }}>Jenis<br/>Kelamin (L/P)</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Tempat Lahir</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Tanggal Lahir</th>
                
                {/* Bagian Tempat Tinggal di-Merge (colSpan=5) */}
                <th colSpan="5" style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f1f5f9' }}>Tempat Tinggal</th>
                
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>No. HP</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Email</th>
                <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Pendidikan<br/>Terakhir</th>
              </tr>
              {/* Baris kedua untuk sub-kolom Tempat Tinggal */}
              <tr>
                <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Alamat</th>
                <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc', width: '50px' }}>RT</th>
                <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc', width: '50px' }}>RW</th>
                <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Kelurahan</th>
                <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Kecamatan</th>
              </tr>
            </thead>
            <tbody>
              {peserta.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.nama}</td>
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.nik}</td>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.jk}</td>
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.tempatLahir}</td>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.tanggalLahir}</td>
                  
                  {/* Data Tempat Tinggal */}
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.alamat}</td>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.rt}</td>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.rw}</td>
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.kelurahan}</td>
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.kecamatan}</td>
                  
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.hp}</td>
                  <td style={{ border: '1px solid #e2e8f0' }}>{item.email}</td>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.pendidikan}</td>
                </tr>
              ))}
              
              {/* Baris kosong tambahan agar tabel terlihat seperti form */}
              {peserta.length > 0 && (
                <tr>
                  <td style={{ border: '1px solid #e2e8f0', textAlign: 'center', color: '#ccc' }}>2</td>
                  <td colSpan="13" style={{ border: '1px solid #e2e8f0', color: '#94a3b8', fontStyle: 'italic', paddingLeft: '15px' }}>
                    Data selanjutnya akan muncul di sini...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
           <button className="btn-outline" style={{ color: '#dc3545', borderColor: '#dc3545' }}>
             <i className="fas fa-trash"></i> Bersihkan Data
           </button>
           <button className="btn-action">
             <i className="fas fa-cloud-upload-alt"></i> Simpan ke Database
           </button>
        </div>
      </div>
    </div>
  );
};

export default ManajemenPesertaImport;