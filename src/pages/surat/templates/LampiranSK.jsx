import React from 'react';

const kertasA4 = { 
  padding: '15mm 20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Arial", sans-serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', 
  boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const tableHeaderStyle = { width: '100%', fontSize: '0.9rem', marginBottom: '25px' };
const tdLabelHead = { width: '100px', verticalAlign: 'top', padding: '3px 0' };

const tableDataStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '30px' };
const thDataStyle = { border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' };
const tdDataStyle = { border: '1px solid #000', padding: '4px 8px', verticalAlign: 'middle' };

const LampiranSK = ({ data }) => {
  if (!data) return null;
  const { ujk } = data;

  const tahunPelaksanaan = ujk.hari1.slice(-4) || '2026';
  const namaTUKLengkap = `${ujk.bidang} ${ujk.tuk}`.replace('TUK Sewaktu ', '');

  // Daftar 16 Asesi (Mockup sesuai foto)
  const daftarAsesi = [
    "Andika Yogi Saputra", "Ata Wijayati", "Dian Rahayu Saputri", "Dwi Ayu Ningrum",
    "Rita Wulandari", "Rizky Hasanah", "Sindi Devita Maharani", "Sumi Herni",
    "Indri Puspitasari", "Marista Yekti Octa Angraini", "Mochamad Solikin", "Nasriani",
    "Taufiqul Aziz", "Vanisa Rani Astridila", "Winda Putri Salwa", "Yuli Astutik"
  ];

  return (
    <div className="cetak-pdf-container" style={kertasA4}>
      
      {/* --- INFORMASI LAMPIRAN --- */}
      <table style={tableHeaderStyle}>
        <tbody>
          <tr>
            <td style={tdLabelHead}>Lampiran</td>
            <td style={{ width: '15px', verticalAlign: 'top' }}>:</td>
            <td>Keputusan Ketua LSP BLK SURABAYA</td>
          </tr>
          <tr>
            <td style={tdLabelHead}>Nomor</td>
            <td style={{ verticalAlign: 'top' }}>:</td>
            <td>000.0C/LSP BLK-SBY/II/{tahunPelaksanaan}</td>
          </tr>
          <tr>
            <td style={tdLabelHead}>Tanggal</td>
            <td style={{ verticalAlign: 'top' }}>:</td>
            <td>03 Februari {tahunPelaksanaan}</td>
          </tr>
        </tbody>
      </table>

      {/* --- JUDUL LAMPIRAN --- */}
      <div style={{ textAlign: 'center', marginBottom: '20px', lineHeight: '1.4' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
          TIM PELAKSANAAN UJI KOMPETENSI UNTUK SKEMA {ujk.skema}
        </h3>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
          DI TUK {namaTUKLengkap} TAHUN {tahunPelaksanaan}
        </h3>
      </div>

      {/* --- TABEL TIM PELAKSANAAN --- */}
      <table style={tableDataStyle}>
        <thead>
          <tr>
            <th style={{ ...thDataStyle, width: '40px' }}>No</th>
            <th style={thDataStyle}>Nama</th>
            <th style={{ ...thDataStyle, width: '220px' }}>Jabatan Dalam Organisasi</th>
          </tr>
        </thead>
        <tbody>
          {/* I. Penanggung Jawab */}
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center', fontWeight: 'bold' }}>I.</td>
            <td style={{ ...tdDataStyle, fontWeight: 'bold' }}>Penanggung Jawab</td>
            <td style={tdDataStyle}></td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>1.</td>
            <td style={tdDataStyle}>Miftahul Huda, S.T., M.Pd.</td>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>Ketua</td>
          </tr>

          {/* II. Penyelia */}
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center', fontWeight: 'bold' }}>II.</td>
            <td style={{ ...tdDataStyle, fontWeight: 'bold' }}>Penyelia</td>
            <td style={tdDataStyle}></td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>1.</td>
            <td style={tdDataStyle}>{ujk.penyelia || 'Mohamad Andrian A'}</td>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>Manajer Data dan Informasi</td>
          </tr>

          {/* III. Pengadministrasi Uji */}
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center', fontWeight: 'bold' }}>III.</td>
            <td style={{ ...tdDataStyle, fontWeight: 'bold' }}>Pengadministrasi Uji</td>
            <td style={tdDataStyle}></td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>1.</td>
            <td style={tdDataStyle}>Ramadhan Budi Prasetyo</td>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>Staf Administrasi Sertifikasi</td>
          </tr>

          {/* IV. Asesor Kompetensi */}
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center', fontWeight: 'bold' }}>IV.</td>
            <td style={{ ...tdDataStyle, fontWeight: 'bold' }}>Asesor Kompetensi</td>
            <td style={tdDataStyle}></td>
          </tr>
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>1.</td>
            <td style={tdDataStyle}>{ujk.asesor1}</td>
            <td style={{ ...tdDataStyle, textAlign: 'center' }}>Asesor</td>
          </tr>
          {ujk.asesor2 && (
            <tr>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>2.</td>
              <td style={tdDataStyle}>{ujk.asesor2}</td>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>Asesor</td>
            </tr>
          )}

          {/* V. Peserta Uji */}
          <tr>
            <td style={{ ...tdDataStyle, textAlign: 'center', fontWeight: 'bold' }}>V.</td>
            <td style={{ ...tdDataStyle, fontWeight: 'bold' }}>Peserta Uji</td>
            <td style={tdDataStyle}></td>
          </tr>
          {daftarAsesi.map((nama, index) => (
            <tr key={index}>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>{index + 1}</td>
              <td style={tdDataStyle}>{nama}</td>
              <td style={{ ...tdDataStyle, textAlign: 'center' }}>Asesi</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- FOOTER & TANDA TANGAN --- */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.9rem' }}>
        <div style={{ width: '320px' }}>
          <table style={{ width: '100%', marginBottom: '20px' }}>
            <tbody>
              <tr>
                <td style={{ width: '100px', paddingBottom: '3px' }}>Dikeluarkan di</td>
                <td style={{ width: '15px', paddingBottom: '3px' }}>:</td>
                <td style={{ paddingBottom: '3px' }}>Surabaya</td>
              </tr>
              <tr>
                <td>Pada tanggal</td>
                <td>:</td>
                <td>03 Februari {tahunPelaksanaan}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 70px 0', fontWeight: 'bold' }}>KETUA LSP BLK SURABAYA</p>
            <p style={{ fontWeight: 'bold', margin: 0 }}>BIBIET ANDRIYANTO JR, S.Pd.T</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LampiranSK;