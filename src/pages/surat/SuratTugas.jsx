import React from 'react';
import logoLSP from '../../assets/logo-lsp.png'; // Pastikan logo KEMNAKER / LSP tersedia

const kertasA4 = { 
  padding: '12mm 15mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tableMutuStyle = { borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' };
const tdMutuStyle = { border: '1px solid #000', padding: '4px 8px' };

const SuratTugas = ({ data }) => {
  if (!data) return null;
  const { ujk, form } = data;

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- HEADER KOP FORM MUTU (Sesuai PDF Hal 1) --- */}
      <table style={{ ...tableMutuStyle, marginBottom: '25px' }}>
        <tbody>
          <tr>
            <td rowSpan="4" style={{ ...tdMutuStyle, width: '120px', textAlign: 'center' }}>
              <img src={logoLSP} alt="Logo" style={{ width: '80px' }} />
            </td>
            <td rowSpan="4" style={{ ...tdMutuStyle, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
              FORMULIR<br/>SURAT TUGAS ASESOR
            </td>
            <td style={{ ...tdMutuStyle, width: '120px' }}>No. Dokumen</td>
            <td style={{ ...tdMutuStyle, width: '180px' }}>: FR-SER-01.1-LSP BLK-SBY</td>
          </tr>
          <tr>
            <td style={{ ...tdMutuStyle }}>Edisi/Revisi</td>
            <td style={{ ...tdMutuStyle }}>: 01/00</td>
          </tr>
          <tr>
            <td style={{ ...tdMutuStyle }}>Tanggal Berlaku</td>
            <td style={{ ...tdMutuStyle }}>: 10-Nov-2015</td>
          </tr>
          <tr>
            <td style={{ ...tdMutuStyle }}>Halaman</td>
            <td style={{ ...tdMutuStyle }}>: 1 dari 1</td>
          </tr>
        </tbody>
      </table>

      {/* --- JUDUL SURAT --- */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ textDecoration: 'underline', margin: 0, fontSize: '1.2rem' }}>SURAT TUGAS ASESOR KOMPETENSI</h3>
        <p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>NO. {form.noSurat}</p>
      </div>

      {/* --- ISI SURAT --- */}
      <div style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        <p>Yang bertanda tangan di bawah ini Ketua LSP BLK SURABAYA dengan ini memberi tugas kepada :</p>
        
        {/* TABEL ASESOR */}
        <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
          <tbody>
            {/* Asesor 1 */}
            <tr>
              <td style={{ width: '30px', verticalAlign: 'top' }}>No.<br/>01.</td>
              <td style={{ width: '200px', verticalAlign: 'top' }}>Nama dan Tugas<br/><br/>Asal Daerah<br/>Sebagai</td>
              <td style={{ verticalAlign: 'top' }}>
                <strong>{ujk.asesor1}</strong><br/>
                No. Reg. {ujk.noReg1}<br/>
                {ujk.asalDaerah1}<br/>
                Asesor Kompetensi
              </td>
            </tr>
            {/* Asesor 2 (Jika ada) */}
            {ujk.asesor2 && (
              <tr>
                <td style={{ width: '30px', verticalAlign: 'top', paddingTop: '15px' }}>No.<br/>02.</td>
                <td style={{ width: '200px', verticalAlign: 'top', paddingTop: '15px' }}>Nama dan Tugas<br/><br/>Asal Daerah<br/>Sebagai</td>
                <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                  <strong>{ujk.asesor2}</strong><br/>
                  No. Reg. {ujk.noReg2}<br/>
                  {ujk.asalDaerah2}<br/>
                  Asesor Kompetensi
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p>Untuk melaksanakan Asesmen/Uji Kompetensi :</p>
        
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr><td style={{ width: '230px' }}>Bidang</td><td>: {ujk.bidang}</td></tr>
            <tr><td>Skema Sertifikasi</td><td>: {ujk.skema}</td></tr>
            <tr><td>Di Tempat Uji Kompetensi (TUK)</td><td>: {form.tempat}</td></tr>
            <tr><td>Pada hari / tanggal</td><td>: {ujk.hari1.split(',')[0]} - {ujk.hari2}</td></tr>
            <tr><td>Pukul</td><td>: {form.waktu}</td></tr>
          </tbody>
        </table>

        <p>Demikian Surat Tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.</p>
      </div>

      {/* --- TANDA TANGAN --- */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
        <div style={{ textAlign: 'center', width: '250px' }}>
          <p style={{ margin: '0 0 5px 0' }}>Surabaya, {form.tanggalSurat}</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>LEMBAGA SERTIFIKASI PROFESI</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>BLK SURABAYA</p>
          <p style={{ margin: '5px 0 0 0' }}>Ketua</p>
          
          <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <span style={{ fontFamily: 'cursive', fontSize: '1.8rem', color: '#1e3a8a', transform: 'rotate(-5deg)', position: 'absolute', zIndex: 2 }}>Ttd</span>
             <div style={{ border: '2px solid rgba(220, 38, 38, 0.4)', borderRadius: '50%', width: '70px', height: '70px', position: 'absolute', left: '20px', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(220, 38, 38, 0.4)', fontSize: '0.7rem', fontWeight: 'bold' }}>CAP LSP</div>
          </div>
          
          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>BIBIET ANDRIYANTO JR, S.PD.T</p>
        </div>
      </div>
      
    </div>
  );
};

export default SuratTugas;