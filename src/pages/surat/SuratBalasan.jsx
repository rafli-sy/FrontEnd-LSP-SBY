import React from 'react';
import logoLSP from '../../assets/logo-lsp.png';
import logoJatim from '../../assets/logo-provinsi-jawa-timur.jpg';

const kertasA4 = {
  padding: '15mm 20mm', backgroundColor: '#fff', color: '#000',
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto',
  width: '210mm', minHeight: '297mm', boxSizing: 'border-box',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)', position: 'relative',
  pageBreakAfter: 'always'
};

const SuratBalasan = ({ data }) => {
  if (!data) return null;
  const { ujk, form } = data;

  const namaTUKBersih = ujk.tuk.replace('UPT BLK ', '').replace('TUK Sewaktu ', '');
  const kotaTUK = form.tempat.replace('UPT BLK ', '').replace('TUK Sewaktu BLK ', '');

  return (
    <>
      {/* --- HALAMAN 1: SURAT BALASAN --- */}
      <div className="cetak-pdf-container" style={kertasA4}>
        {/* KOP SURAT */}
        <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src={logoJatim} alt="Logo Jatim" style={{ width: '85px', height: 'auto', objectFit: 'contain' }} />
            <div style={{ flex: 1, textAlign: 'center', padding: '0 15px' }}>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>LSP BLK SURABAYA</h1>
              <p style={{ margin: '5px 0 2px 0', fontSize: '1rem' }}>Lembaga Sertifikasi Profesi BLK Surabaya</p>
              <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071,8287532</p>
              <p style={{ margin: '2px 0', fontSize: '0.85rem' }}>Email: lsp.blksurabaya@gmail.com</p>
            </div>
            <img src={logoLSP} alt="Logo LSP" style={{ width: '90px', height: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
        <div style={{ borderBottom: '1px solid #000', marginBottom: '20px' }}></div>

        {/* INFO SURAT */}
        <table style={{ width: '100%', marginBottom: '20px', fontSize: '1rem' }}>
          <tbody>
            <tr>
              <td style={{ width: '80px', verticalAlign: 'top' }}>Nomor</td><td style={{ width: '10px', verticalAlign: 'top' }}>:</td>
              <td style={{ verticalAlign: 'top' }}>{form.noSurat}</td>
              <td style={{ textAlign: 'right', verticalAlign: 'top' }}>Surabaya, {form.tanggalSurat}</td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top' }}>Lampiran</td><td style={{ verticalAlign: 'top' }}>:</td>
              <td colSpan="2" style={{ verticalAlign: 'top' }}>1</td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top' }}>Perihal</td><td style={{ verticalAlign: 'top' }}>:</td>
              <td colSpan="2" style={{ verticalAlign: 'top' }}><strong>Pelaksanaan Sertifikasi Kompetensi</strong></td>
            </tr>
          </tbody>
        </table>

        {/* TUJUAN */}
        <div style={{ marginBottom: '25px', fontSize: '1rem', lineHeight: '1.5' }}>
          <p style={{ margin: 0 }}>Kepada</p>
          <p style={{ margin: 0 }}>Yth. <strong>Kepala {form.kepadaTujuan}</strong></p>
          <p style={{ margin: 0 }}>di -</p>
          <p style={{ margin: '5px 0 0 25px', textTransform: 'uppercase', textDecoration: 'underline', fontWeight: 'bold' }}>TEMPAT</p>
        </div>

        {/* ISI SURAT */}
        <div style={{ fontSize: '1rem', lineHeight: '1.5', textAlign: 'justify' }}>
          <p>
            Menindaklanjuti surat Saudara Nomor: {form.noSuratMasuk || '...............'} tanggal {form.tanggalSuratMasuk || '...............'} Perihal: Pengajuan Pelaksanaan Sertifikasi, maka bersama ini kami sampaikan bahwa LSP BLK Surabaya bersedia dan sanggup melaksanakan sertifikasi kompetensi pada Tempat Uji Kompetensi (TUK) {ujk.tuk} sesuai jadwal terlampir.
          </p>
          
          <p>
            Format nominatif Calon Asesi (Ms. Excel) bisa di download pada link berikut: <a href="https://bit.ly/daftarujksurabaya2026" style={{color: 'blue'}}>https://bit.ly/daftarujksurabaya2026</a> dan diupload pada link berikut: <a href="https://bit.ly/formatnominatifujksurabaya2026" style={{color: 'blue'}}>https://bit.ly/formatnominatifujksurabaya2026</a> paling lambat 7 hari sebelum pelaksanaan Uji Kompetensi, Kelengkapan dokumen calon asesi yang harus dilengkapi adalah:
          </p>

          <table style={{ width: '100%', marginBottom: '20px', marginLeft: '15px' }}>
            <tbody>
              <tr><td style={{ width: '20px' }}>a.</td><td style={{ width: '300px' }}>Pas foto 3x4 dengan latar belakang merah</td><td>: 3 Lembar</td></tr>
              <tr><td>b.</td><td>Foto copy KTP/Kartu Keluarga</td><td>: 1 Lembar</td></tr>
              <tr><td>c.</td><td>Foto copy Sertifikat Pelatihan dari BLK/TUK.LPK</td><td>: 1 Lembar</td></tr>
              <tr><td>d.</td><td>Foto copy Ijasah Terakhir</td><td>: 1 Lembar</td></tr>
              <tr><td>e.</td><td>Materai 10.000 per asesi 1 materai</td><td>: {ujk.asesi} Materai</td></tr>
            </tbody>
          </table>

          <p>Demikian atas perhatian dan kerjasama yang baik disampaikan terima kasih.</p>
        </div>

        {/* TANDA TANGAN */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
          <div style={{ textAlign: 'center', width: '250px' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>LSP BLK SURABAYA</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Ketua</p>
            <div style={{ height: '80px' }}></div>
            <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>BIBIET ANDRIYANTO JR. S.Pd.T</p>
          </div>
        </div>

        {/* TEMBUSAN */}
        <div style={{ marginTop: '30px', fontSize: '0.9rem' }}>
          <p style={{ margin: '0 0 5px 0', textDecoration: 'underline' }}>Tembusan disampaikan Kepada Yth:</p>
          <ol style={{ margin: 0, paddingLeft: '15px' }}>
            <li>Kepala UPT BLK Surabaya (Sebagai Laporan)</li>
            <li>Bidang pelatihan dan Produktivitas Dinas tenaga kerja dan Transmigrasi provinsi Jawa Timur</li>
            <li>Arsip</li>
          </ol>
        </div>
      </div>

      {/* --- HALAMAN 2: LAMPIRAN JADWAL --- */}
      {/* Container ini akan otomatis jatuh ke bawah Halaman 1 berkat CSS flex-direction: column di atas */}
      <div className="cetak-pdf-container" style={{ ...kertasA4, marginTop: '20px' }}>
        <h3 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
          JADWAL PELAKSANAAN UJI KOMPETENSI DAN SERTIFIKASI
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '10px', width: '40px' }}>No</th>
              <th style={{ border: '1px solid #000', padding: '10px' }}>Kejuruan</th>
              <th style={{ border: '1px solid #000', padding: '10px' }}>Skema</th>
              <th style={{ border: '1px solid #000', padding: '10px' }}>Tgl Pelaksanaan</th>
              <th style={{ border: '1px solid #000', padding: '10px', width: '80px' }}>Jml Peserta (Orang)</th>
              <th style={{ border: '1px solid #000', padding: '10px' }}>Nama Asesor</th>
              <th style={{ border: '1px solid #000', padding: '10px' }}>Nama Penyelia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '10px' }}>1</td>
              <td style={{ border: '1px solid #000', padding: '10px' }}>{ujk.bidang}</td>
              <td style={{ border: '1px solid #000', padding: '10px' }}>{ujk.skema}</td>
              <td style={{ border: '1px solid #000', padding: '10px' }}>{ujk.hari1} <br/>s/d<br/> {ujk.hari2}</td>
              <td style={{ border: '1px solid #000', padding: '10px' }}>{ujk.asesi}</td>
              <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'left' }}>
                1. {ujk.asesor1} <br/> {ujk.asesor2 && `2. ${ujk.asesor2}`}
              </td>
              <td style={{ border: '1px solid #000', padding: '10px' }}>{ujk.penyelia}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SuratBalasan;