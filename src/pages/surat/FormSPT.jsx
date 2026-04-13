import React from 'react';

// Styling statis khusus untuk cetak kertas
const kertasA4 = {
  padding: '10mm 15mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};
const kopSurat = { display: 'flex', alignItems: 'center', borderBottom: '4px double #000', paddingBottom: '10px', marginBottom: '25px' };

const FormSPT = ({ data }) => {
  if (!data) return null;

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      <div style={kopSurat}>
        <div style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
          <i className="fas fa-shield-alt" style={{ fontSize: '4.5rem', color: '#333' }}></i>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'normal' }}>PEMERINTAH PROVINSI JAWA TIMUR</h3>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>LEMBAGA SERTIFIKASI PROFESI (LSP) BLK SURABAYA</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Jl. Dukuh Menanggal III/29 Telp. (031) 8290071 Surabaya</p>
        </div>
        <div style={{ width: '100px' }}></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ textDecoration: 'underline', margin: 0 }}>SURAT PERINTAH TUGAS (SPT) ASESMEN</h3>
        <p style={{ margin: '5px 0 0' }}>Nomor: <strong>{data?.noSurat}</strong></p>
      </div>

      <div style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6' }}>
        <p>Dalam rangka pelaksanaan Sertifikasi Kompetensi Kerja Nasional, Ketua LSP BLK Surabaya memberikan perintah tugas kepada:</p>
        
        {/* Tabel Tim Bertugas */}
        <table style={{ width: '90%', margin: '15px auto', borderCollapse: 'collapse', fontSize: '1.1rem' }} border="1">
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px' }}>No</th>
              <th style={{ padding: '8px' }}>Nama Lengkap</th>
              <th style={{ padding: '8px' }}>Jabatan / Peran</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', textAlign: 'center' }}>1</td>
              <td style={{ padding: '8px' }}><strong>{data?.namaAsesor}</strong></td>
              <td style={{ padding: '8px', textAlign: 'center' }}>Asesor Kompetensi</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', textAlign: 'center' }}>2</td>
              <td style={{ padding: '8px' }}><strong>{data?.namaPenyelia}</strong></td>
              <td style={{ padding: '8px', textAlign: 'center' }}>Penyelia UJK</td>
            </tr>
          </tbody>
        </table>

        <p>Untuk melaksanakan Uji Kompetensi (UJK) dengan ketentuan sebagai berikut:</p>
        <table style={{ width: '90%', margin: '10px auto 20px', fontSize: '1.1rem' }}>
          <tbody>
            <tr><td style={{ width: '150px' }}>Skema</td><td>: <strong>{data?.skema}</strong></td></tr>
            <tr><td>Tempat (TUK)</td><td>: <strong>{data?.tujuan}</strong></td></tr>
            <tr><td>Tanggal</td><td>: Sesuai jadwal yang ditetapkan instansi terkait.</td></tr>
          </tbody>
        </table>

        <p style={{ textIndent: '40px' }}>
          Demikian Surat Perintah Tugas ini dibuat agar dapat dilaksanakan dengan penuh rasa tanggung jawab.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <div style={{ textAlign: 'center', width: '250px' }}>
          <p>Dikeluarkan di : Surabaya</p>
          <p>Tanggal : {data?.tanggal}</p>
          <p style={{ marginTop: '10px' }}>Ketua LSP BLK Surabaya</p>
          <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#1a56db', transform: 'rotate(-5deg)' }}>Ttd & Cap</span>
          </div>
          <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>PIMPINAN LSP, S.T., M.T.</p>
        </div>
      </div>
    </div>
  );
};

export default FormSPT;