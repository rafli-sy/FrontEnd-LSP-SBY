import React from 'react';
import logoLSP from '../../../assets/logo-lsp.png';

const kertasA4 = { 
  padding: '15mm 20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Arial", sans-serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', // Portrait
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tableMutuStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' };
const tdMutuStyle = { border: '1px solid #000', padding: '4px 8px' };

const PernyataanAsesor2 = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;

  // Jika Asesor 2 Kosong / Tidak diplot
  if (!ujk.asesor2) {
    return (
      <div className="cetak-pdf-container" style={{ ...kertasA4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <div style={{ textAlign: 'center', color: '#64748b' }}>
            <i className="fas fa-info-circle" style={{ fontSize: '3rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
            <h2>Asesor 2 Tidak Ditemukan</h2>
            <p>Pengajuan UJK ini hanya menggunakan 1 Asesor. Dokumen ini tidak perlu dicetak.</p>
         </div>
      </div>
    );
  }

  const tahunPelaksanaan = ujk.hari1.slice(-4) || '2026';

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- HEADER KOP FORM MUTU --- */}
      <table style={{ ...tableMutuStyle, marginBottom: '40px' }}>
        <tbody>
          <tr>
            <td rowSpan="4" style={{ ...tdMutuStyle, width: '100px', textAlign: 'center' }}>
              <img src={logoLSP} alt="Logo" style={{ width: '70px' }} />
            </td>
            <td rowSpan="4" style={{ ...tdMutuStyle, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
              LSP BLK SURABAYA<br/>FORMULIR<br/><span style={{ fontSize: '1.4rem' }}>PERNYATAAN KERAHASIAAN</span>
            </td>
            <td style={{ ...tdMutuStyle, width: '120px' }}>NO. DOKUMEN</td>
            <td style={{ ...tdMutuStyle, width: '180px' }}>: FR-SER-01.3 LSP BLK-SBY</td>
          </tr>
          <tr><td style={{ ...tdMutuStyle }}>EDISI/REVISI</td><td style={{ ...tdMutuStyle }}>: 01/00</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>TANGGAL BERLAKU</td><td style={{ ...tdMutuStyle }}>: 10 November 2015</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>HALAMAN</td><td style={{ ...tdMutuStyle }}>: 1 dari 1</td></tr>
        </tbody>
      </table>

      {/* --- JUDUL TENGAH --- */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'normal' }}>PERNYATAAN KERAHASIAAN</h2>
      </div>

      {/* --- DATA ASESOR 2 --- */}
      <div style={{ fontSize: '1.05rem', lineHeight: '1.5', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 15px 0' }}>Saya yang bertanda tangan dibawah ini :</p>
        
        <table style={{ width: '100%', marginLeft: '30px', marginBottom: '20px', fontSize: '1.05rem' }}>
          <tbody>
            <tr>
              <td style={{ width: '180px', padding: '3px 0' }}>Nama Asesor</td>
              <td style={{ width: '20px' }}>:</td>
              <td>{ujk.asesor2}</td>
            </tr>
            <tr>
              <td style={{ padding: '3px 0' }}>No. Reg</td>
              <td>:</td>
              <td>{ujk.noReg2}</td>
            </tr>
            <tr>
              <td style={{ padding: '3px 0' }}>Kompetensi Bidang</td>
              <td>:</td>
              <td>{ujk.bidang}</td>
            </tr>
            <tr>
              <td style={{ padding: '3px 0' }}>Alamat</td>
              <td>:</td>
              <td>Jl. Mayang No 4-A</td>
            </tr>
            <tr>
              <td style={{ padding: '15px 0 3px 0' }}>No. HP</td>
              <td style={{ paddingTop: '12px' }}>:</td>
              <td style={{ paddingTop: '12px' }}>082242110052</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- PARAGRAF PERNYATAAN --- */}
      <div style={{ fontSize: '1.05rem', lineHeight: '1.5', textAlign: 'justify' }}>
        <p style={{ marginBottom: '20px' }}>
          Sehubungan tugas saya sebagai Asesor Kompetensi di LSP BLK SURABAYA, dengan ini saya menyatakan dengan sesungguhnya bahwa saya akan memegang teguh KERAHASIAAN hasil asesmen /uji kompetensi yang dilaksanakan oleh LSP BLK SURABAYA, kecuali kepada pihak yang berwenang dan terkait atas seizin Ketua LSP BLK SURABAYA .
        </p>
        <p style={{ marginBottom: '20px' }}>
          Apabila saya lalai melaksanakan ini, maka saya bersedia bertanggung jawab dan menerima sanksi sesuai dengan ketentuan yang telah ditetapkan oleh LSP BLK SURABAYA .
        </p>
        <p style={{ marginBottom: '50px' }}>
          Demikian pernyataan ini saya buat dengan sesungguhnya dan tanpa tekanan apapun.
        </p>
      </div>

      {/* --- TANDA TANGAN (KIRI BAWAH) --- */}
      <div style={{ fontSize: '1.05rem' }}>
        <p style={{ margin: '0 0 5px 0' }}>Surabaya, 3 Februari {tahunPelaksanaan}</p>
        <p style={{ margin: 0 }}>Asesor Kompetensi,</p>
        
        <div style={{ height: '100px' }}></div>
        
        <p style={{ margin: 0, fontWeight: 'bold' }}>{ujk.asesor2}</p>
      </div>

    </div>
  );
};

export default PernyataanAsesor2;