import React from 'react';

const RencanaVerifikasiTUK = ({ data }) => {
  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', color: '#000', lineHeight: '1.5', fontSize: '11pt', padding: '20px 40px' }}>
      
      <h3 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '13pt', fontWeight: 'bold' }}>
        RENCANA VERIFIKASI TEMPAT UJI KOMPETENSI (TUK)
      </h3>

      <table style={{ width: '100%', marginBottom: '20px', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '25%', verticalAlign: 'top' }}>Skema Sertifikasi</td>
            <td style={{ width: '2%', verticalAlign: 'top' }}>:</td>
            <td style={{ verticalAlign: 'top' }}>
              <div style={{ marginBottom: '5px' }}>Judul &nbsp;: <strong>{data?.skema || '...................................................'}</strong></div>
              <div>Nomor : ...................................................</div>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '5px 0' }}>TUK</td>
            <td>:</td>
            <td>[ &nbsp;&nbsp; ] Sewaktu &nbsp;&nbsp; [ &nbsp;&nbsp; ] Tempat Kerja &nbsp;&nbsp; [ &nbsp;&nbsp; ] Mandiri</td>
          </tr>
          <tr>
            <td style={{ padding: '5px 0' }}>Nama Asesor</td>
            <td>:</td>
            <td><strong>{data?.asesor1 || '...................................................'}</strong></td>
          </tr>
          <tr>
            <td style={{ padding: '5px 0' }}>Tanggal</td>
            <td>:</td>
            <td>{data?.hari1 || '...................................................'}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: '15px' }}>
        <strong>Panduan:</strong>
        <ol style={{ paddingLeft: '20px', margin: '5px 0 0 0' }}>
          <li>Pilih Metode verifikasi dan tentukan perangkat asesmen / observasi.</li>
          <li>Cocokkan standar dengan realita di TUK.</li>
          <li>Berikan rekomendasi kelayakan TUK.</li>
        </ol>
      </div>

      {/* TABEL VERIFIKASI UTAMA */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', width: '5%', textAlign: 'center' }}>No</th>
            <th style={{ border: '1px solid black', padding: '8px', width: '40%', textAlign: 'left' }}>Bagian TUK</th>
            <th style={{ border: '1px solid black', padding: '8px', width: '25%', textAlign: 'center' }}>Verifikasi</th>
            <th style={{ border: '1px solid black', padding: '8px', width: '30%', textAlign: 'center' }}>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', verticalAlign: 'top' }}>1</td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
              <strong>Ruang TUK</strong><br/>
              - Penerangan<br/>
              - Sirkulasi udara<br/>
              - Kebersihan & K3<br/>
              - Kenyamanan
            </td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
              [ &nbsp;&nbsp; ] Ya &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] Tidak
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', verticalAlign: 'top' }}>2</td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
              <strong>Peralatan Utama</strong><br/>
              - Ketersediaan fungsi<br/>
              - Kalibrasi<br/>
              - Keamanan
            </td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
              [ &nbsp;&nbsp; ] Ya &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] Tidak
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', verticalAlign: 'top' }}>3</td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
              <strong>Peralatan Pendukung</strong><br/>
              - Ketersediaan<br/>
              - Kelayakan operasional
            </td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
              [ &nbsp;&nbsp; ] Ya &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] Tidak
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', verticalAlign: 'top' }}>4</td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
              <strong>Bahan Uji</strong><br/>
              - Ketersediaan sesuai kebutuhan<br/>
              - Kualitas / kadaluwarsa bahan
            </td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
              [ &nbsp;&nbsp; ] Ya &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] Tidak
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', verticalAlign: 'top' }}>5</td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
              <strong>Dokumen TUK</strong><br/>
              - Formulir asesmen<br/>
              - SOP penggunaan alat<br/>
              - Panduan K3
            </td>
            <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
              [ &nbsp;&nbsp; ] Ya &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] Tidak
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}></td>
          </tr>
        </tbody>
      </table>

      {/* REKOMENDASI */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ margin: '0 0 8px 0' }}><strong>Rekomendasi Verifikator:</strong></p>
        <p style={{ margin: '0 0 10px 0' }}>[ &nbsp;&nbsp; ] Layak &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp; ] Tidak Layak sebagai TUK untuk skema terkait.</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Catatan/Tindak Lanjut:</strong> ............................................................................................................................</p>
        <p style={{ margin: '0 0 5px 0' }}>...................................................................................................................................................................</p>
      </div>

      {/* TTD */}
      <table style={{ width: '100%', textAlign: 'center', border: 'none' }}>
        <tbody>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right', paddingBottom: '30px', paddingRight: '20px' }}>
              Surabaya, {data?.hari1 || '...........................'}
            </td>
          </tr>
          <tr>
            <td style={{ width: '33%', verticalAlign: 'bottom' }}>
              <strong>Verifikator TUK,</strong>
              <br/><br/><br/><br/><br/>
              ( <strong>{data?.asesor1 || '...........................'}</strong> )
            </td>
            <td style={{ width: '33%', verticalAlign: 'bottom' }}>
              <strong>Manajer Sertifikasi LSP,</strong>
              <br/><br/><br/><br/><br/>
              ( ................................... )
            </td>
            <td style={{ width: '33%', verticalAlign: 'bottom' }}>
              <strong>Kepala TUK,</strong>
              <br/><br/><br/><br/><br/>
              ( ................................... )
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

export default RencanaVerifikasiTUK;