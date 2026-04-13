import React from 'react';
import logoLSP from '../../../assets/logo-lsp.png';
import logoJatim from '../../../assets/logo-provinsi-jawa-timur.jpg'; // <-- Import Logo Jatim

const kertasA4 = { 
  padding: '15mm 20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Arial", sans-serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', 
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const BABaru = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;

  const daftarAsesi = [
    "Andika Yogi Saputra", "Ata Wijayati", "Dian Rahayu Saputri", "Dwi Ayu Ningrum", 
    "Rita Wulandari", "Rizky Hasanah", "Sindi Devita Maharani", "Sumi Herni"
  ];
  
  const totalBaris = Math.max(ujk.asesi || 16, daftarAsesi.length);
  const barisTabel = Array.from({ length: totalBaris });
  const kotaTUK = ujk.tuk.replace('UPT BLK ', '').replace('TUK Sewaktu BLK ', '');

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- KOP SURAT STANDAR (2 LOGO) --- */}
      <div style={{ borderBottom: '3px solid #60a5fa', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo Jatim di Kiri */}
          <img src={logoJatim} alt="Logo Jatim" style={{ width: '85px', height: 'auto', objectFit: 'contain' }} />
          
          <div style={{ flex: 1, textAlign: 'center', padding: '0 15px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>LSP BLK SURABAYA</h1>
            <p style={{ margin: '5px 0 2px 0', fontSize: '1rem' }}>Lembaga Sertifikasi Profesi BLK Surabaya</p>
            <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Jl Dukuh Menanggal III/29 Gayungan Surabaya Telp /fax 8290071,8287532</p>
            <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Email: lsp.blksurabaya@gmail.com</p>
          </div>

          {/* Logo LSP di Kanan */}
          <img src={logoLSP} alt="Logo LSP" style={{ width: '90px', height: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #60a5fa', marginTop: '2px', marginBottom: '20px' }}></div>

      {/* --- JUDUL BERITA ACARA --- */}
      <div style={{ textAlign: 'center', marginBottom: '25px', lineHeight: '1.4' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>BERITA ACARA ASESMEN / UJI KOMPETENSI</h3>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>PELAKSANAAN SERTIFIKASI TAHUN 2026</h3>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>LSP BLK SURABAYA</h3>
      </div>

      <table style={{ width: '100%', marginBottom: '20px', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td colSpan="3" style={{ padding: '6px 10px', border: '1px solid #000' }}>Asesor</td></tr>
          <tr>
            <td style={{ width: '30px', padding: '6px 10px', border: '1px solid #000', textAlign: 'center' }}>1.</td>
            <td style={{ width: '45%', padding: '6px 10px', border: '1px solid #000' }}>{ujk.asesor1}</td>
            <td style={{ padding: '6px 10px', border: '1px solid #000' }}>No. Reg. Sertifikat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {ujk.noReg1}</td>
          </tr>
          {ujk.asesor2 && (
            <tr>
              <td style={{ width: '30px', padding: '6px 10px', border: '1px solid #000', textAlign: 'center' }}>2.</td>
              <td style={{ width: '45%', padding: '6px 10px', border: '1px solid #000' }}>{ujk.asesor2}</td>
              <td style={{ padding: '6px 10px', border: '1px solid #000' }}>No. Reg. Sertifikat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {ujk.noReg2}</td>
            </tr>
          )}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', marginBottom: '25px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px', width: '40px', textAlign: 'center' }}>No</th>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Nama Asesi</th>
            <th style={{ border: '1px solid #000', padding: '8px', width: '30%', textAlign: 'center' }}>Organisasi</th>
            <th style={{ border: '1px solid #000', padding: '8px', width: '25%', textAlign: 'center' }}>Hasil Kompeten/Belum<br/>Kompeten</th>
          </tr>
        </thead>
        <tbody>
          {barisTabel.map((_, index) => {
            const namaPeserta = daftarAsesi[index] || ""; 
            const organisasi = namaPeserta ? "UPT BLK Singosari" : "";
            return (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #000', padding: '6px', paddingLeft: '10px' }}>{namaPeserta}</td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{organisasi}</td>
                <td style={{ border: '1px solid #000', padding: '6px' }}></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
        <p style={{ margin: '0 0 30px 0', textAlign: 'justify' }}>Demikian berita acara Asesmen /uji kompetensi dibuat untuk sebagai pengambil keputusan oleh tim Asesor LSP BLK Surabaya</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%' }}></td>
              <td style={{ width: '50%', paddingBottom: '20px' }}>{kotaTUK}, {ujk.hari2.split(', ')[1]}</td>
            </tr>
            <tr><td style={{ paddingBottom: '15px' }}>Asesor Kompetensi</td><td></td></tr>
            <tr>
              <td style={{ paddingBottom: '30px', verticalAlign: 'top' }}>1. {ujk.asesor1}</td>
              <td style={{ paddingBottom: '30px', verticalAlign: 'top' }}>1. ...........................................</td>
            </tr>
            {ujk.asesor2 && (
              <tr>
                <td style={{ paddingBottom: '10px', verticalAlign: 'top' }}>2. {ujk.asesor2}</td>
                <td style={{ paddingBottom: '10px', paddingLeft: '50px', verticalAlign: 'top' }}>2. .........................................</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BABaru;