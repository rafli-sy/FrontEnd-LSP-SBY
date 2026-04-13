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

const tableDataStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem', marginTop: '20px' };
const thDataStyle = { border: '1px solid #000', padding: '6px', textAlign: 'center', verticalAlign: 'middle' };
const tdDataStyle = { border: '1px solid #000', padding: '6px', verticalAlign: 'middle', height: '110px' };

const PengembalianDokumen = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;

  const namaTUKLengkap = `${ujk.bidang} ${ujk.tuk.replace('TUK Sewaktu ', '')}`;
  const tanggalAkhir = ujk.hari2.split(', ')[1] || '11 Februari 2026';
  
  // Format "10 s/d 11 Februari 2026"
  const tglAwal = ujk.hari1.split(', ')[1]?.split(' ')[0] || '10'; // Ambil angkanya saja
  const rentangWaktu = `${tglAwal} s/d ${tanggalAkhir}`;

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- HEADER KOP FORM MUTU --- */}
      <table style={{ ...tableMutuStyle }}>
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
            <td rowSpan="3" style={{ ...tdMutuStyle, textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', width: '50%' }}>
              FORMULIR<br/>PENGEMBALIAN DOKUMEN ASESMEN
            </td>
            <td style={{ ...tdMutuStyle, width: '120px' }}>NO. DOKUMEN</td>
            <td style={{ ...tdMutuStyle, width: '180px' }}>: FR-SER-01.7 LSP BLK-SBY</td>
          </tr>
          <tr><td style={{ ...tdMutuStyle }}>EDISI/REVISI</td><td style={{ ...tdMutuStyle }}>: 01/00</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>TANGGAL BERLAKU</td><td style={{ ...tdMutuStyle }}>: 10 November 2015</td></tr>
          <tr>
            <td colSpan="2" style={{ border: 'none', padding: '0' }}></td>
            <td style={{ ...tdMutuStyle }}>HALAMAN</td><td style={{ ...tdMutuStyle }}>: 1 dari 1</td>
          </tr>
        </tbody>
      </table>

      {/* --- TABEL PENGEMBALIAN DOKUMEN --- */}
      <table style={tableDataStyle}>
        <thead>
          <tr>
            <th rowSpan="3" style={{ ...thDataStyle, width: '30px' }}>NO</th>
            <th rowSpan="3" style={{ ...thDataStyle, width: '100px' }}>TGL/PUKUL</th>
            <th rowSpan="3" style={{ ...thDataStyle, width: '220px' }}>KETERANGAN</th>
            <th rowSpan="3" style={{ ...thDataStyle, width: '150px' }}>PENGEMBALIAN MUK OLEH<br/>ASESOR (ttd & nama)</th>
            <th colSpan="3" style={thDataStyle}>PENYERAHAN KEPADA BIDANG<br/>SERTIFIKASI</th>
            <th rowSpan="3" style={{ ...thDataStyle, width: '150px' }}>BERKAS - BERKAS LAIN/<br/>TAMBAHAN KELENGKAPAN<br/>BERKAS ASESMEN</th>
            <th rowSpan="3" style={{ ...thDataStyle, width: '130px' }}>DITERIMA OLEH (ttd &<br/>nama)</th>
          </tr>
          <tr>
            <th colSpan="3" style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontWeight: 'normal' }}>
              (ttd & nama penerima)
            </th>
          </tr>
          <tr>
            <th style={{ ...thDataStyle, width: '70px', fontWeight: 'normal' }}>SURAT<br/>TUGAS</th>
            <th style={{ ...thDataStyle, width: '70px', fontWeight: 'normal' }}>DAFTAR<br/>HADIR</th>
            <th style={{ ...thDataStyle, width: '70px', fontWeight: 'normal' }}>BERITA<br/>ACARA</th>
          </tr>
        </thead>
        <tbody>
          
          {/* BARIS ASESOR 1 */}
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>1</td>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>
              {tanggalAkhir}<br/>Jam 17.00
            </td>
            <td style={{ border: '1px solid #000', padding: '0', verticalAlign: 'middle' }}>
              {/* Nested Table Tanpa Border untuk merapikan isi Keterangan */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'center' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', width: '60px', textAlign: 'left' }}>Nama TUK</td>
                    <td style={{ width: '10px' }}>:</td>
                    <td>{namaTUKLengkap}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ borderBottom: '1px solid #000' }}></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', textAlign: 'left' }}>Asesmen Tgl</td>
                    <td>:</td>
                    <td>{rentangWaktu}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ borderBottom: '1px solid #000' }}></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', textAlign: 'left' }}>Jumlah MUK</td>
                    <td>:</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ ...tdDataStyle, textAlign: 'center', verticalAlign: 'bottom' }}>
              <strong>{ujk.asesor1}</strong>
            </td>
            <td style={tdDataStyle}></td>
            <td style={tdDataStyle}></td>
            <td style={tdDataStyle}></td>
            <td style={tdDataStyle}></td>
            <td style={{ ...tdDataStyle, textAlign: 'center', verticalAlign: 'bottom' }}>
              <strong>{ujk.penyelia}</strong>
            </td>
          </tr>

          {/* BARIS ASESOR 2 (Kondisional) */}
          {ujk.asesor2 && (
            <tr>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>2</td>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>
                {tanggalAkhir}<br/>Jam 17.00
              </td>
              <td style={{ border: '1px solid #000', padding: '0', verticalAlign: 'middle' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'center' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '6px', width: '60px', textAlign: 'left' }}>Nama TUK</td>
                      <td style={{ width: '10px' }}>:</td>
                      <td>{namaTUKLengkap}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ borderBottom: '1px solid #000' }}></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', textAlign: 'left' }}>Asesmen Tgl</td>
                      <td>:</td>
                      <td>{rentangWaktu}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ borderBottom: '1px solid #000' }}></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', textAlign: 'left' }}>Jumlah MUK</td>
                      <td>:</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style={{ ...tdDataStyle, textAlign: 'center', verticalAlign: 'bottom' }}>
                <strong>{ujk.asesor2}</strong>
              </td>
              <td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td>
              <td style={{ ...tdDataStyle, textAlign: 'center', verticalAlign: 'bottom' }}>
                <strong>{ujk.penyelia}</strong>
              </td>
            </tr>
          )}

        </tbody>
      </table>

    </div>
  );
};

export default PengembalianDokumen;