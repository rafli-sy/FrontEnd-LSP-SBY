import React from 'react';
import logoLSP from '../../../assets/logo-lsp.png';

const kertasA4 = { 
  padding: '15mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto', 
  width: '297mm', minHeight: '210mm', // Landscape
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tableMutuStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' };
const tdMutuStyle = { border: '1px solid #000', padding: '4px 8px' };

const tableDataStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem', marginTop: '15px' };
const thDataStyle = { border: '1px solid #000', padding: '6px', backgroundColor: '#f8fafc', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' };
const tdDataStyle = { border: '1px solid #000', padding: '6px', verticalAlign: 'middle', height: '25px' };

const LaporanPenyelia = ({ data }) => {
  if (!data) return null;
  const { ujk, docName, docCode } = data;

  const jumlahBaris = ujk.asesi || 16;
  const barisKosong = Array.from({ length: jumlahBaris });

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
              LSP BLK SURABAYA<br/>FORMULIR<br/>LAPORAN PENYELIA KEGIATAN SERTIFIKASI
            </td>
            <td style={{ ...tdMutuStyle, width: '120px' }}>No. Dokumen</td>
            <td style={{ ...tdMutuStyle, width: '180px' }}>: FR-SER-01.5 LSP BLK-SBY</td>
          </tr>
          <tr><td style={{ ...tdMutuStyle }}>Edisi/Revisi</td><td style={{ ...tdMutuStyle }}>: 01/00</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>Tanggal Berlaku</td><td style={{ ...tdMutuStyle }}>: 01 Juli 2020</td></tr>
          <tr><td style={{ ...tdMutuStyle }}>Halaman</td><td style={{ ...tdMutuStyle }}>: 1 dari 1</td></tr>
        </tbody>
      </table>

      {/* --- INFO PELAKSANAAN --- */}
      <table style={{ width: '100%', marginBottom: '10px', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ width: '120px', padding: '2px 0' }}>Skema / Bidang</td><td>: <strong>{ujk.skema} / {ujk.bidang}</strong></td>
            <td style={{ width: '100px', padding: '2px 0' }}>TUK</td><td>: {ujk.tuk}</td>
          </tr>
          <tr>
            <td style={{ padding: '2px 0' }}>Hari / Tanggal</td><td>: {ujk.hari1} s/d {ujk.hari2.split(',')[0]}</td>
            <td style={{ padding: '2px 0' }}>Penyelia</td><td>: {ujk.penyelia}</td>
          </tr>
        </tbody>
      </table>

      {/* --- TABEL LAPORAN PENYELIA UTAMA --- */}
      <table style={{...tableDataStyle, marginBottom: '15px'}}>
        <thead>
          <tr>
            <th rowSpan="2" style={{ ...thDataStyle, width: '30px' }}>No</th>
            <th rowSpan="2" style={{ ...thDataStyle, width: '200px' }}>Nama</th>
            <th colSpan="3" style={thDataStyle}>Kehadiran</th>
            <th colSpan="4" style={thDataStyle}>Kelengkapan Administrasi</th>
            <th colSpan="2" style={thDataStyle}>Rekomendasi Asesor</th>
            <th rowSpan="2" style={{ ...thDataStyle, width: '150px' }}>Asesor</th>
          </tr>
          <tr>
            <th style={{ ...thDataStyle, width: '40px' }}>Pra</th>
            <th style={{ ...thDataStyle, width: '50px' }}>Hari 1</th>
            <th style={{ ...thDataStyle, width: '50px' }}>Hari 2</th>
            
            <th style={{ ...thDataStyle, width: '40px' }}>KTP</th>
            <th style={{ ...thDataStyle, width: '50px' }}>Ijazah</th>
            <th style={{ ...thDataStyle, width: '70px' }}>Sertifikat<br/>Pelatihan</th>
            <th style={{ ...thDataStyle, width: '60px' }}>Pas Foto</th>
            
            <th style={{ ...thDataStyle, width: '30px' }}>K</th>
            <th style={{ ...thDataStyle, width: '30px' }}>BK</th>
          </tr>
        </thead>
        <tbody>
          {barisKosong.map((_, index) => (
            <tr key={index}>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>{index + 1}</td>
              <td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td><td style={tdDataStyle}></td><td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td><td style={tdDataStyle}></td><td style={tdDataStyle}></td><td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td><td style={tdDataStyle}></td>
              <td style={tdDataStyle}></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- BAGIAN CATATAN & TANDA TANGAN (SESUAI REQUEST) --- */}
      <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        <p style={{ margin: '0 0 5px 0' }}>Kejadian penting selama pelaksanaan Asesmen / Uji Kompetensi :</p>
        <p style={{ margin: '0 0 5px 0', letterSpacing: '2px', color: '#94a3b8' }}>....................................................................................................................................................................................................................................................................................</p>
        <p style={{ margin: '0 0 15px 0', letterSpacing: '2px', color: '#94a3b8' }}>....................................................................................................................................................................................................................................................................................</p>
        
        <p style={{ margin: '0 0 15px 0' }}>
          Demikian Laporan ini di buat dengan keadaan sebenarnya dan dapat digunakan sebagai bahan pertimbangan dalam pengambilan keputusan oleh LSP BLK Surabaya.
        </p>

        <p style={{ margin: '0 0 10px 0' }}>Pelaksana Asesmen,</p>

        {/* TABEL TANDA TANGAN TRANSPARAN AGAR SEJAJAR */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '10px' }}>
          <tbody>
            <tr>
              <td colSpan="2" style={{ width: '40%', paddingBottom: '10px' }}>Tim Asesor</td>
              <td style={{ width: '30%', paddingBottom: '10px' }}>Penanggungjawab TUK</td>
              <td style={{ width: '30%', paddingBottom: '10px' }}>Penyelia</td>
            </tr>
            <tr>
              <td style={{ width: '20%', textAlign: 'left', verticalAlign: 'bottom', height: '60px' }}>
                <p style={{ margin: 0 }}>1.</p>
                <div style={{ height: '40px' }}></div>
                <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>{ujk.asesor1 || '........................................'}</p>
                <p style={{ margin: 0 }}>{ujk.noReg1 || 'MET.................................'}</p>
              </td>
              <td style={{ width: '20%', textAlign: 'left', verticalAlign: 'bottom', height: '60px' }}>
                {ujk.asesor2 ? (
                  <>
                    <p style={{ margin: 0 }}>2.</p>
                    <div style={{ height: '40px' }}></div>
                    <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>{ujk.asesor2}</p>
                    <p style={{ margin: 0 }}>{ujk.noReg2}</p>
                  </>
                ) : (
                  <p style={{ margin: 0 }}>2. -</p>
                )}
              </td>
              <td style={{ verticalAlign: 'bottom', height: '60px' }}>
                <div style={{ height: '40px' }}></div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>………………………………….</p>
              </td>
              <td style={{ verticalAlign: 'bottom', height: '60px' }}>
                <div style={{ height: '40px' }}></div>
                <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>{ujk.penyelia || '........................................'}</p>
                <p style={{ margin: 0 }}>REG.LSP-254-0005-2024</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default LaporanPenyelia;