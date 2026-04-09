import React from 'react';
import logoLSP from '../../assets/logo-lsp.png';

const kertasA4 = { 
  padding: '12mm 20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const SuratPermohonan = ({ data }) => {
  if (!data) return null;
  const { ujk, form } = data;

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- KOP SURAT --- */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '2px' }}>
        <img src={logoLSP} alt="Logo" style={{ width: '80px', marginRight: '20px' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a' }}>LSP BLK SURABAYA</h2>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'normal' }}>Lembaga Sertifikasi Profesi BLK Surabaya</h3>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071,8287532</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Email: lsp.blksurabaya@gmail.com</p>
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #000', marginBottom: '25px' }}></div>

      {/* --- HEADER NOMOR & TUJUAN --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.1rem' }}>
        <div>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ width: '80px', verticalAlign: 'top' }}>Nomor</td><td style={{ verticalAlign: 'top' }}>:</td><td>{form.noSurat}</td></tr>
              <tr><td>Sifat</td><td>:</td><td>Biasa</td></tr>
              <tr><td>Lampiran</td><td>:</td><td>-</td></tr>
              <tr><td>Perihal</td><td>:</td><td><strong>Permohonan Asesor</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'left', width: '250px' }}>
          <p style={{ margin: '0 0 15px 0' }}>Surabaya, {form.tanggalSurat}</p>
          <p style={{ margin: '0 0 5px 0' }}>Kepada</p>
          <p style={{ margin: '0 0 5px 0' }}>Yth: <strong>{form.kepadaTujuan}</strong></p>
          <p style={{ margin: '0 0 5px 0' }}>di -</p>
          <p style={{ margin: '5px 0 0 30px', fontWeight: 'bold' }}>TEMPAT</p>
        </div>
      </div>

      {/* --- ISI SURAT --- */}
      <div style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
        <p style={{ textIndent: '40px', marginBottom: '10px' }}>
          Sehubungan dengan adanya rencana Uji Kompetensi skema <strong>{ujk.skema}</strong> yang akan dilaksanakan oleh LSP BLK Surabaya, maka bersama ini kami mohon dapatnya untuk memberi ijin kepada Saudara/i <strong>{ujk.asesor1}</strong> (Asesor) untuk melaksanakan Sertifikasi kompetensi pada:
        </p>
        
        <table style={{ width: '90%', margin: '15px auto', fontSize: '1.1rem' }}>
          <tbody>
            <tr><td style={{ width: '100px' }}>Hari</td><td>: {ujk.hari1.split(',')[0]} s/d {ujk.hari2.split(',')[0]}</td></tr>
            <tr><td>Tanggal</td><td>: {ujk.hari1.split(', ')[1]} s/d {ujk.hari2.split(', ')[1]}</td></tr>
            <tr><td>Waktu</td><td>: {form.waktu}</td></tr>
            <tr><td style={{ verticalAlign: 'top' }}>Tempat</td><td>: {form.tempat}</td></tr>
          </tbody>
        </table>

        <p style={{ textIndent: '40px' }}>
          Demikian atas perhatian dan kerjasamanya disampaikan terimakasih.
        </p>
      </div>

      {/* --- TANDA TANGAN & TEMBUSAN --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '50px' }}>
        
        <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
          <p style={{ textDecoration: 'underline', marginBottom: '5px' }}>Tembusan disampaikan kepada Yth:</p>
          <ol style={{ margin: 0, paddingLeft: '15px' }}>
            <li>Kepala UPT Balai Latihan Kerja Surabaya</li>
            <li>Pertinggal</li>
          </ol>
        </div>

        <div style={{ textAlign: 'center', width: '250px' }}>
          <p style={{ margin: '0 0 5px 0' }}>Ketua</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>LSP BLK SURABAYA</p>
          
          <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <span style={{ fontFamily: 'cursive', fontSize: '1.8rem', color: '#1e3a8a', transform: 'rotate(-5deg)', position: 'absolute', zIndex: 2 }}>Ttd</span>
          </div>
          
          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>BIBIET ANDRIYANTO JR, S.PD.T</p>
        </div>
      </div>

    </div>
  );
};

export default SuratPermohonan;