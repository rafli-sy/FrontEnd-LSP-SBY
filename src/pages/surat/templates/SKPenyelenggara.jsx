import React from 'react';
import logoLSP from '../../../assets/logo-lsp.png';
import logoJatim from '../../../assets/logo-provinsi-jawa-timur.jpg'; // <-- Import Logo Jatim

const kertasA4 = { 
  padding: '15mm 20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Arial", sans-serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', 
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tdLabel = { width: '110px', verticalAlign: 'top', padding: '3px 0' };
const tdTitikDua = { width: '20px', verticalAlign: 'top', padding: '3px 0', textAlign: 'center' };
const tdPoint = { width: '25px', verticalAlign: 'top', padding: '3px 0' };
const tdContent = { verticalAlign: 'top', padding: '3px 0', textAlign: 'justify' };

const SKPenyelenggara = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;
  const tahunPelaksanaan = ujk.hari1.slice(-4) || '2026';
  const namaTUKLengkap = `${ujk.bidang} ${ujk.tuk}`.replace('TUK Sewaktu ', '');

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- KOP SURAT STANDAR (2 LOGO) --- */}
      <div style={{ borderBottom: '3px solid #60a5fa', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={logoJatim} alt="Logo Jatim" style={{ width: '85px', height: 'auto', objectFit: 'contain' }} />
          
          <div style={{ flex: 1, textAlign: 'center', padding: '0 15px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>LSP BLK SURABAYA</h1>
            <p style={{ margin: '5px 0 2px 0', fontSize: '1rem' }}>Lembaga Sertifikasi Profesi BLK Surabaya</p>
            <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071,8287532</p>
            <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Email:lsp.blksurabaya@gmail.com</p>
          </div>

          <img src={logoLSP} alt="Logo LSP" style={{ width: '90px', height: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #60a5fa', marginTop: '2px', marginBottom: '20px' }}></div>

      <div style={{ textAlign: 'center', marginBottom: '20px', lineHeight: '1.3' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'normal' }}>KEPUTUSAN KETUA LSP BLK SURABAYA</h3>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'normal' }}>NOMOR : 000.0C/LSP BLK-SBY/II/{tahunPelaksanaan}</h3>
        <h3 style={{ margin: '15px 0 5px 0', fontSize: '1rem', fontWeight: 'normal' }}>TENTANG</h3>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>PELAKSANAAN UJI KOMPETENSI UNTUK SKEMA {ujk.skema} DI TUK {namaTUKLengkap} TAHUN {tahunPelaksanaan}</h3>
        <h3 style={{ margin: '15px 0 0 0', fontSize: '1rem', fontWeight: 'bold' }}>KETUA LSP BLK SURABAYA</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', lineHeight: '1.4' }}>
        <tbody>
          <tr><td style={tdLabel}>Menimbang</td><td style={tdTitikDua}>:</td><td style={tdPoint}>a.</td><td style={tdContent}>bahwa dalam rangka meningkatkan pengakuan tenaga kerja Indonesia pada dunia usaha/industri bidang/sektor {ujk.bidang}, maka perlu diadakan uji kompetensi untuk Skema {ujk.skema} di TUK {namaTUKLengkap}</td></tr>
          <tr><td colSpan="2"></td><td style={tdPoint}>b.</td><td style={tdContent}>bahwa untuk itu perlu ditetapkan dengan Surat Keputusan Ketua LSP BLK SURABAYA</td></tr>

          <tr><td style={{...tdLabel, paddingTop: '10px'}}>Mengingat</td><td style={{...tdTitikDua, paddingTop: '10px'}}>:</td><td style={{...tdPoint, paddingTop: '10px'}}>1.</td><td style={{...tdContent, paddingTop: '10px'}}>Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan</td></tr>
          <tr><td colSpan="2"></td><td style={tdPoint}>2.</td><td style={tdContent}>Peraturan Pemerintah Nomor: 10 Tahun 2018 tentang Badan Nasional Sertifikasi Profesi</td></tr>
          <tr><td colSpan="2"></td><td style={tdPoint}>3.</td><td style={tdContent}>Surat Keputusan BNSP No. KEP.1194/BNSP/XI/2018 tentang Lisensi kepada Lembaga Sertifikasi Profesi BLK SURABAYA</td></tr>

          <tr><td style={{...tdLabel, paddingTop: '10px'}}>Memperhatikan</td><td style={{...tdTitikDua, paddingTop: '10px'}}>:</td><td style={{...tdPoint, paddingTop: '10px'}}>1.</td><td style={{...tdContent, paddingTop: '10px'}}>Surat Ketua TUK {namaTUKLengkap} No. 0, tanggal 03 Februari {tahunPelaksanaan}, tentang Kesanggupan TUK {namaTUKLengkap} sebagai tempat pelaksanaan uji kompetensi Skema Sertifikasi {ujk.skema}</td></tr>

          <tr><td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold', padding: '15px 0 10px 0' }}>Memutuskan</td></tr>

          <tr><td style={tdLabel}>Menetapkan</td><td style={tdTitikDua}>:</td><td colSpan="2" style={tdContent}>Tim Pelaksana yang terdiri dari Penanggungjawab, Penyelia, Pengadministrasi, Asesor Kompetensi dan Peserta Uji, pada kegiatan Pelaksanaan Uji Kompetensi untuk Skema {ujk.skema} di TUK {namaTUKLengkap} Tahun {tahunPelaksanaan}</td></tr>
          <tr><td style={{...tdLabel, paddingTop: '10px'}}>Kesatu</td><td style={{...tdTitikDua, paddingTop: '10px'}}>:</td><td colSpan="2" style={{...tdContent, paddingTop: '10px'}}>Menunjuk personal Tim Pelaksana yang namanya tercantum dalam lampiran keputusan ini sebagai Penanggungjawab, Penyelia, Pengadministrasi, Asesor Kompetensi dan Peserta Uji Kompetensi</td></tr>
        </tbody>
      </table>

      <table style={{ width: '100%', marginTop: '20px', fontSize: '0.85rem' }}>
        <tbody>
          <tr><td style={{ width: '50%' }}></td><td style={{ width: '100px' }}>Dikeluarkan di</td><td style={{ width: '10px' }}>:</td><td>Surabaya</td></tr>
          <tr><td></td><td style={{ paddingBottom: '20px' }}>Pada tanggal</td><td style={{ paddingBottom: '20px' }}>:</td><td style={{ paddingBottom: '20px' }}>03 Februari {tahunPelaksanaan}</td></tr>
          <tr><td style={{ textDecoration: 'underline' }}>Tembusan :</td><td colSpan="3" style={{ textAlign: 'center', fontWeight: 'bold' }}>KETUA</td></tr>
          <tr><td style={{ paddingBottom: '40px', verticalAlign: 'top' }}>1. Dewan Pengarah LSP BLK SURABAYA<br/>2. Ketua TUK {namaTUKLengkap}</td><td colSpan="3" style={{ textAlign: 'center', fontWeight: 'bold', verticalAlign: 'top' }}>LSP BLK SURABAYA</td></tr>
          <tr><td></td><td colSpan="3" style={{ textAlign: 'center', textDecoration: 'underline', fontWeight: 'bold' }}>Bibiet Andriyanto JR, S.Pd.T</td></tr>
        </tbody>
      </table>
    </div>
  );
};
export default SKPenyelenggara;