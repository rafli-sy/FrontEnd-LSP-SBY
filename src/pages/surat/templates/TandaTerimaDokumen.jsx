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

const tableDataStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem', marginBottom: '20px' };
const thDataStyle = { border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' };
const tdDataStyle = { border: '1px solid #000', padding: '6px 8px', verticalAlign: 'top' };

const TandaTerimaDokumen = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;

  const namaTUKBersih = ujk.tuk.replace('TUK Sewaktu ', '');
  const tanggalFormat = ujk.hari1.replace(', ', '/ '); // Mengubah "Selasa, 10 Feb" menjadi "Selasa/ 10 Feb"

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- HEADER KOP FORM MUTU --- */}
      <table style={{ ...tableMutuStyle, marginBottom: '20px' }}>
        <tbody>
          <tr>
            <td rowSpan="4" style={{ ...tdMutuStyle, width: '100px', textAlign: 'center' }}>
              <img src={logoLSP} alt="Logo" style={{ width: '70px' }} />
            </td>
            <td rowSpan="4" style={{ ...tdMutuStyle, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
              LSP BLK SURABAYA<br/>FORMULIR<br/><span style={{ fontSize: '1.4rem' }}>TANDA TERIMA DOKUMEN</span>
            </td>
            <td style={{ ...tdMutuStyle, width: '120px' }}>NO. DOKUMEN</td>
            <td style={{ ...tdMutuStyle, width: '180px' }}>: FR-SER-01.3 LSP BLK-SBY</td>
          </tr>
          <tr><td style={{ ...tdMutuStyle }}>EDISI/REVISI</td><td style={{ ...tdMutuStyle }}>: 01/00</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>TANGGAL BERLAKU</td><td style={{ ...tdMutuStyle }}>: 10 November 2015</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>HALAMAN</td><td style={{ ...tdMutuStyle }}>: 1 dari 1</td></tr>
        </tbody>
      </table>

      {/* --- DITERIMA DARI --- */}
      <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '0.95rem' }}>
        <p style={{ margin: '0 0 10px 0' }}>DITERIMA DARI :</p>
        <p style={{ margin: 0 }}>LSP BLK SURABAYA</p>
      </div>

      {/* --- TABEL DAFTAR DOKUMEN --- */}
      <table style={tableDataStyle}>
        <thead>
          <tr>
            <th style={{ ...thDataStyle, width: '40px' }}>NO.</th>
            <th style={{ ...thDataStyle, width: '180px' }}>JUMLAH/UNIT</th>
            <th colSpan="2" style={thDataStyle}>KETERANGAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>1</td>
            <td style={tdDataStyle}>1 (satu) lembar</td>
            <td colSpan="2" style={tdDataStyle}>Surat Tugas</td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>2</td>
            <td style={tdDataStyle}>1 (satu) set</td>
            <td colSpan="2" style={tdDataStyle}>Daftar Hadir Peserta Uji Kompetensi</td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>3</td>
            <td style={tdDataStyle}>1 (satu) set</td>
            <td colSpan="2" style={tdDataStyle}>Lembar Pelaksanaan Asesmen</td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>4</td>
            <td style={tdDataStyle}>1 (satu) set</td>
            <td colSpan="2" style={tdDataStyle}>Rekapitulasi Hasil Asesmen / Uji Kompetensi</td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>5</td>
            <td style={tdDataStyle}>1 (satu) lembar</td>
            <td colSpan="2" style={tdDataStyle}>Berita Acara Asesmen / Uji Kompetensi</td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>6</td>
            <td style={tdDataStyle}>
              ............set<br/><br/>
              ............Lbr<br/><br/>
              ............Lbr<br/><br/>
              ............Lbr<br/><br/>
              ............Lbr
            </td>
            <td style={{ ...tdDataStyle, borderRight: 'none', width: '60px' }}>
              MUK :<br/><br/><br/><br/><br/><br/><br/><br/>
            </td>
            <td style={{ ...tdDataStyle, borderLeft: 'none' }}>
              {ujk.skema}<br/><br/><br/>
              <span style={{ fontStyle: 'italic' }}>beri tanda x yang diujikan</span><br/><br/><br/><br/>
            </td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>7</td>
            <td style={tdDataStyle}>............Lbr</td>
            <td colSpan="2" style={tdDataStyle}></td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>8</td>
            <td style={tdDataStyle}>...................</td>
            <td colSpan="2" style={tdDataStyle}>
              MUK Demonstrasi Skema Sertifikasi :<br/>
              <div style={{ marginLeft: '20px', marginTop: '5px' }}>1 {ujk.skema}</div>
            </td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>9</td>
            <td style={tdDataStyle}>...................</td>
            <td style={{ ...tdDataStyle, borderRight: 'none' }}>
              Lain-lain :<br/>
              (bila perlu)<br/><br/><br/>
              Nama TUK :
            </td>
            <td style={{ ...tdDataStyle, borderLeft: 'none' }}>
              <br/><br/><br/><br/>
              {namaTUKBersih}
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- FOOTER & TANDA TANGAN --- */}
      <table style={{ width: '100%', fontSize: '0.9rem', marginBottom: '15px' }}>
        <tbody>
          <tr>
            <td style={{ width: '220px' }}>Tanggal Diserah terimakan</td>
            <td style={{ width: '10px' }}>:</td>
            <td style={{ fontWeight: 'bold' }}>{tanggalFormat}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'center' }}>
        <tbody>
          <tr>
            <td colSpan="2" style={{ border: '1px solid #000', padding: '6px' }}>DITERIMA OLEH</td>
            <td style={{ border: '1px solid #000', padding: '6px', width: '35%' }}>DISERAHKAN<br/>OLEH,</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '6px', width: '32.5%' }}>Asesor 1</td>
            <td style={{ border: '1px solid #000', padding: '6px', width: '32.5%' }}>Asesor 2</td>
            <td rowSpan="2" style={{ border: '1px solid #000', padding: '6px', verticalAlign: 'bottom' }}>
              <div style={{ height: '70px' }}></div>
              {ujk.penyelia}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '6px', verticalAlign: 'bottom' }}>
              <div style={{ height: '70px' }}></div>
              {ujk.asesor1}
            </td>
            <td style={{ border: '1px solid #000', padding: '6px', verticalAlign: 'bottom' }}>
              <div style={{ height: '70px' }}></div>
              {ujk.asesor2 || '-'}
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

export default TandaTerimaDokumen;