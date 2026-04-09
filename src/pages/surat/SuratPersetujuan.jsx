import React from 'react';

// Styling statis khusus untuk cetak kertas A4
const kertasA4 = {
  padding: '10mm 15mm', backgroundColor: '#fff', color: '#000',
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto',
  width: '210mm', minHeight: '297mm', boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const kopSurat = {
  display: 'flex', alignItems: 'center', borderBottom: '4px double #000',
  paddingBottom: '10px', marginBottom: '20px'
};

const SuratPersetujuan = ({ data }) => {
  if (!data) return null;

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      {/* --- KOP SURAT --- */}
      <div style={kopSurat}>
        <div style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
          <i className="fas fa-shield-alt" style={{ fontSize: '4.5rem', color: '#333' }}></i>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'normal' }}>PEMERINTAH PROVINSI JAWA TIMUR</h3>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>LEMBAGA SERTIFIKASI PROFESI (LSP) BLK SURABAYA</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Jl. Dukuh Menanggal III/29 Telp. (031) 8290071 Surabaya</p>
        </div>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* --- NOMOR & TUJUAN --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.1rem' }}>
        <div>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ width: '80px' }}>Nomor</td><td>: <strong>{data?.noSurat}</strong></td></tr>
              <tr><td>Sifat</td><td>: Penting</td></tr>
              <tr><td>Lampiran</td><td>: 1 (Satu) Berkas</td></tr>
              <tr><td>Perihal</td><td>: <strong>Persetujuan Uji Kompetensi</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'left', width: '250px' }}>
          <p style={{ margin: '0 0 5px 0' }}>Surabaya, {data?.tanggal}</p>
          <p style={{ margin: '0 0 5px 0' }}>Kepada Yth.</p>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Kepala {data?.tujuan}</p>
          <p style={{ margin: 0 }}>di -</p>
          <p style={{ margin: '5px 0 0 20px', fontWeight: 'bold' }}>TEMPAT</p>
        </div>
      </div>

      {/* --- ISI SURAT --- */}
      <div style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
        <p style={{ textIndent: '40px', marginBottom: '10px' }}>
          Menindaklanjuti surat pengajuan pelaksanaan Sertifikasi Kompetensi Kerja Nasional (UJK) dari {data?.tujuan}, bersama ini kami sampaikan bahwa Lembaga Sertifikasi Profesi (LSP) BLK Surabaya <strong>MENYETUJUI</strong> permohonan tersebut.
        </p>
        <p style={{ marginBottom: '10px' }}>Adapun rincian pelaksanaan Uji Kompetensi yang disetujui adalah sebagai berikut:</p>
        
        <table style={{ width: '90%', margin: '0 auto 20px', fontSize: '1.1rem' }}>
          <tbody>
            <tr><td style={{ width: '150px' }}>Skema Ujian</td><td>: <strong>{data?.skema}</strong></td></tr>
            <tr><td>Pendanaan</td><td>: APBN / APBD (Sesuai Pengajuan)</td></tr>
            <tr><td>Tanggal Pelaksanaan</td><td>: Sesuai Jadwal Penugasan Asesor</td></tr>
            <tr><td>Tempat (TUK)</td><td>: Sesuai TUK Terdaftar pada Pengajuan</td></tr>
          </tbody>
        </table>

        <p style={{ textIndent: '40px' }}>
          Berkaitan dengan hal tersebut, mohon pihak {data?.tujuan} dapat menyiapkan sarana, prasarana, serta kelengkapan administrasi asesi (peserta) sesuai dengan Standar Operasional Prosedur (SOP) yang berlaku.
        </p>
        <p style={{ textIndent: '40px' }}>
          Demikian surat persetujuan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
        </p>
      </div>

      {/* --- TANDA TANGAN --- */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ textAlign: 'center', width: '250px' }}>
          <p style={{ marginBottom: '10px' }}>Ketua LSP BLK Surabaya</p>
          <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#1a56db', transform: 'rotate(-5deg)' }}>Ttd & Cap</span>
          </div>
          <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>PIMPINAN LSP, S.T., M.T.</p>
        </div>
      </div>
    </div>
  );
};

export default SuratPersetujuan;