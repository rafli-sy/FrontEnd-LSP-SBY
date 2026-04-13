import React from 'react';
import logoLSP from '../../../assets/logo-lsp.png';

const kertasA4 = { 
  padding: '10mm 15mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Arial", sans-serif', margin: '0 auto', 
  width: '297mm', minHeight: '210mm', // Landscape
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tableMutuStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' };
const tdMutuStyle = { border: '1px solid #000', padding: '4px 8px' };

const tableInfoStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem', marginBottom: '15px' };
const tdInfoStyle = { border: '1px solid #000', padding: '4px 8px', textTransform: 'uppercase' };

const tableDataStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem', marginBottom: '10px' };
const thDataStyle = { border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' };
const tdDataStyle = { border: '1px solid #000', padding: '4px', verticalAlign: 'middle', height: '24px' };

const DH2 = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;

  const tahunPelaksanaan = ujk.hari1.slice(-4) || '2026';
  const namaTUKBersih = ujk.tuk.replace('TUK Sewaktu ', '');

  // Daftar 8 Asesi KEDUA untuk Hari 2 (Sesuai Foto)
  const daftarAsesiHari2 = [
    "Indri Puspitasari", "Marista Yekti Octa Angraini", "Mochamad Solikin", "Nasriani",
    "Taufiqul Aziz", "Vanisa Rani Astridila", "Winda Putri Salwa", "Yuli Astutik"
  ];

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- HEADER KOP FORM MUTU --- */}
      <table style={{ ...tableMutuStyle, marginBottom: '10px' }}>
        <tbody>
          <tr>
            <td rowSpan="4" style={{ ...tdMutuStyle, width: '100px', textAlign: 'center' }}>
              <img src={logoLSP} alt="Logo" style={{ width: '70px' }} />
            </td>
            <td colSpan="3" style={{ ...tdMutuStyle, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
              LSP BLK SURABAYA
            </td>
          </tr>
          <tr>
            <td rowSpan="3" style={{ ...tdMutuStyle, textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold' }}>
              FORMULIR<br/>DAFTAR HADIR ASESMEN
            </td>
            <td style={{ ...tdMutuStyle, width: '120px' }}>NO. DOKUMEN</td>
            <td style={{ ...tdMutuStyle, width: '180px' }}>: FR-SER-01.2 LSP BLK-SBY</td>
          </tr>
          <tr><td style={{ ...tdMutuStyle }}>EDISI/REVISI</td><td style={{ ...tdMutuStyle }}>: 01/00</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>TANGGAL BERLAKU</td><td style={{ ...tdMutuStyle }}>: 10 November 2015</td></tr>
          <tr>
            <td colSpan="2" style={{ border: 'none', padding: '0' }}></td>
            <td style={{ ...tdMutuStyle }}>HALAMAN</td><td style={{ ...tdMutuStyle }}>: 1 dari 1</td>
          </tr>
        </tbody>
      </table>

      {/* --- INFORMASI PELAKSANAAN --- */}
      <table style={tableInfoStyle}>
        <tbody>
          <tr>
            <td style={{ ...tdInfoStyle, width: '25%' }}>TEMPAT UJI KOMPETENSI</td>
            <td style={{ ...tdInfoStyle, width: '35%' }}>{namaTUKBersih}</td>
            <td style={{ ...tdInfoStyle, width: '20%' }}>GROUP/JUMLAH</td>
            <td style={{ ...tdInfoStyle, width: '20%' }}>1 Kelas / ...... Peserta</td>
          </tr>
          <tr>
            <td style={tdInfoStyle}>HARI/TANGGAL</td>
            {/* Mengganti koma dengan garis miring agar sesuai format foto "Rabu / 11 Februari" */}
            <td style={{ ...tdInfoStyle, textTransform: 'none' }}>{ujk.hari2.replace(',', ' /')}</td>
            <td style={tdInfoStyle}>SKEMA SERTIFIKASI</td>
            <td style={{ ...tdInfoStyle, textTransform: 'none' }}>{ujk.skema}</td>
          </tr>
          <tr>
            <td style={tdInfoStyle}>PROFESI</td>
            <td colSpan="3" style={{ ...tdInfoStyle, textTransform: 'none' }}>Operator {ujk.bidang}</td>
          </tr>
          <tr>
            <td colSpan="2" style={tdInfoStyle}>NO. SURAT PERINTAH MENGUJI DAN MENYELIA</td>
            <td style={tdInfoStyle}>000.0D/LSP BLK-SBY/II/{tahunPelaksanaan}</td>
            <td style={tdInfoStyle}>000.0E/LSP BLK-SBY/II/{tahunPelaksanaan}</td>
          </tr>
        </tbody>
      </table>

      {/* --- TABEL DAFTAR HADIR HARI 2 --- */}
      <table style={tableDataStyle}>
        <thead>
          <tr>
            <th rowSpan="2" style={{ ...thDataStyle, width: '30px' }}>NO.</th>
            <th rowSpan="2" style={thDataStyle}>NAMA PESERTA</th>
            <th colSpan="4" style={thDataStyle}>PENDIDIKAN</th>
            <th colSpan="2" rowSpan="2" style={{ ...thDataStyle, width: '160px' }}>TANDA TANGAN</th>
            <th colSpan="2" style={thDataStyle}>UJI KOMPETENSI</th>
          </tr>
          <tr>
            <th style={{ ...thDataStyle, width: '40px' }}>SD</th>
            <th style={{ ...thDataStyle, width: '40px' }}>SMP</th>
            <th style={{ ...thDataStyle, width: '40px' }}>SMA</th>
            <th style={{ ...thDataStyle, width: '50px' }}>D3/S1</th>
            <th style={{ ...thDataStyle, width: '60px' }}>MURNI</th>
            <th style={{ ...thDataStyle, width: '60px' }}>ULANG</th>
          </tr>
        </thead>
        <tbody>
          {daftarAsesiHari2.map((nama, index) => {
            const isOdd = index % 2 !== 0; 
            return (
              <tr key={index}>
                <td style={{ ...tdDataStyle, textAlign: 'center' }}>{index + 1}</td>
                <td style={{ ...tdDataStyle, paddingLeft: '8px' }}>{nama}</td>
                
                <td style={tdDataStyle}></td>
                <td style={tdDataStyle}></td>
                <td style={{ ...tdDataStyle, textAlign: 'center' }}></td>
                <td style={tdDataStyle}></td>
                
                <td style={{ ...tdDataStyle, width: '80px', borderRight: 'none', verticalAlign: 'top', paddingTop: '2px' }}>
                  {!isOdd ? `${index + 1}` : ''}
                </td>
                <td style={{ ...tdDataStyle, width: '80px', borderLeft: 'none', verticalAlign: 'bottom', paddingBottom: '2px' }}>
                  {isOdd ? <div style={{ paddingLeft: '15px' }}>{index + 1}</div> : ''}
                </td>
                
                <td style={tdDataStyle}></td>
                <td style={tdDataStyle}></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* --- FOOTER PENGESAHAN --- */}
      <div style={{ textAlign: 'right', marginBottom: '5px', fontSize: '0.85rem' }}>
        TANGGAL : &nbsp;&nbsp;&nbsp; {ujk.hari2.split(', ')[1]}
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '6px', width: '35%' }}>DIKETAHUI OLEH PENYELIA</td>
            <td colSpan="3" style={{ border: '1px solid #000', padding: '6px' }}>DIBUAT OLEH ASESOR</td>
          </tr>
          <tr>
            <td rowSpan="3" style={{ border: '1px solid #000', padding: '6px', verticalAlign: 'bottom', height: '60px' }}>
              {ujk.penyelia}
            </td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '40px' }}>NO</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>NAMA</td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '250px' }}>TANDA TANGAN</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>1.</td>
            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>{ujk.asesor1}</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', verticalAlign: 'top' }}>1.</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>2.</td>
            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>{ujk.asesor2 || ''}</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', verticalAlign: 'bottom' }}>2. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

export default DH2;