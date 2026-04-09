import React from 'react';
import logoLSP from '../../../assets/logo-lsp.png';
import logoJatim from '../../../assets/logo-provinsi-jawa-timur.jpg'; // <-- Import Logo Jatim

const kertasA4 = { 
  padding: '15mm 20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Arial", sans-serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', 
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tableKonsideranStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '1rem', lineHeight: '1.4' };
const tdLabelStyle = { width: '130px', verticalAlign: 'top', padding: '5px 0' };
const tdTitikDuaStyle = { width: '20px', verticalAlign: 'top', padding: '5px 0', textAlign: 'center' };
const tdIsiStyle = { verticalAlign: 'top', padding: '5px 0', textAlign: 'justify' };

const PenerapanTUK = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;
  const namaTUKBersih = ujk.tuk.replace('TUK Sewaktu ', '');

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- KOP SURAT STANDAR (2 LOGO) --- */}
      <div style={{ borderBottom: '3px solid #60a5fa', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={logoJatim} alt="Logo Jatim" style={{ width: '85px', height: 'auto', objectFit: 'contain' }} />
          
          <div style={{ flex: 1, textAlign: 'center', padding: '0 15px' }}>
            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>LSP BLK SURABAYA</h1>
            <p style={{ margin: '5px 0 2px 0', fontSize: '1.1rem' }}>Lembaga Sertifikasi Profesi BLK Surabaya</p>
            <p style={{ margin: '2px 0', fontSize: '0.9rem' }}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071,8287532</p>
            <p style={{ margin: '2px 0', fontSize: '0.9rem' }}>Email:lsp.blksurabaya@gmail.com</p>
          </div>

          <img src={logoLSP} alt="Logo LSP" style={{ width: '90px', height: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #60a5fa', marginTop: '2px', marginBottom: '25px' }}></div>

      <div style={{ textAlign: 'center', marginBottom: '30px', lineHeight: '1.4' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>SURAT KEPUTUSAN</h3>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>KETUA LEMBAGA SERTIFIKASI PROFESI (LSP) BLK SURABAYA</h3>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>Nomor : 000.0/Ver-TUK/LSP BLK-SBY/II/2026</h3>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', lineHeight: '1.4' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>TENTANG</h3>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>PENETAPAN TUK TERVERIFIKASI</h3>
      </div>

      <table style={{ ...tableKonsideranStyle, marginBottom: '20px' }}>
        <tbody>
          <tr>
            <td style={tdLabelStyle}>Menimbang</td><td style={tdTitikDuaStyle}>:</td>
            <td style={tdIsiStyle}>Pentingnya keberadaan TUK terverifikasi sebagai persyaratan dilangsungkannya uji kompetensi oleh LSP</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Mengingat</td><td style={tdTitikDuaStyle}>:</td>
            <td style={tdIsiStyle}>PBNSP 206 tentang Pembentukan TUK</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Memperhatikan</td><td style={tdTitikDuaStyle}>:</td>
            <td style={tdIsiStyle}>Berita Acara Verifikasi Tempat Uji Kompetensi {ujk.bidang} {namaTUKBersih} , tertanggal 03 Februari 2026</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginBottom: '15px', marginTop: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>MEMUTUSKAN</h3>
      </div>

      <p style={{ margin: '0 0 15px 0', fontSize: '1rem', textTransform: 'uppercase' }}>MENETAPKAN :</p>

      <table style={{ ...tableKonsideranStyle, marginLeft: '30px', width: 'calc(100% - 30px)', marginBottom: '15px' }}>
        <tbody>
          <tr><td style={{ width: '150px', padding: '4px 0' }}>Nama TUK</td><td style={{ width: '20px', textAlign: 'center' }}>:</td><td style={{ fontWeight: 'bold' }}>{namaTUKBersih}</td></tr>
          <tr><td style={{ padding: '4px 0' }}>Alamat</td><td style={{ textAlign: 'center' }}>:</td><td>Jl. Raya TUK Terdaftar (Sesuai Alamat {namaTUKBersih})</td></tr>
          <tr><td style={{ padding: '4px 0' }}>Tipe TUK</td><td style={{ textAlign: 'center' }}>:</td><td>{ujk.tuk.includes('Sewaktu') ? 'Sewaktu' : 'Mandiri'}</td></tr>
          <tr><td style={{ padding: '4px 0' }}>Masa Berlaku</td><td style={{ textAlign: 'center' }}>:</td><td>{ujk.hari1} s/d {ujk.hari2.split(', ')[1]}</td></tr>
        </tbody>
      </table>

      <p style={{ margin: '0 0 30px 0', fontSize: '1rem', textAlign: 'justify', lineHeight: '1.5' }}>
        sebagai TUK Terverifikasi dan dapat digunakan sebagai Tempat Uji Kompetensi, untuk skema sertifikasi <strong>{ujk.skema}</strong>.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
        <div style={{ textAlign: 'center', width: '300px' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>Surabaya, 3 Februari 2026</p>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>Ketua LSP BLK SURABAYA</p>
          <div style={{ height: '80px' }}></div>
          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0, fontSize: '1rem' }}>Bibiet Andriyanto JR, S.Pd.T</p>
        </div>
      </div>
    </div>
  );
};
export default PenerapanTUK;