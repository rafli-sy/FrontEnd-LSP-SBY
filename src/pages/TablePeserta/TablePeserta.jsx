import React from 'react';
import Button from '../../components/ui/Button';

const TablePeserta = ({ dataPeserta, skemaName }) => {
  if (!dataPeserta || dataPeserta.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Data peserta tidak ditemukan.</div>;
  }

  const handleDownloadExcel = () => {
    let csvContent = "No,Nama,NIK,Jenis Kelamin (L/P),Tempat Lahir,Tanggal Lahir,Alamat,RT,RW,Kelurahan,Kecamatan,No. HP,Email,Pendidikan Terakhir\n";

    dataPeserta.forEach((p, index) => {
      const row = [
        index + 1, `"${p.nama || ''}"`, `"${p.nik || ''}"`, `"${p.jk || ''}"`, `"${p.tempatLahir || ''}"`, `"${p.tanggalLahir || ''}"`,
        `"${p.alamat || ''}"`, `"${p.rt || ''}"`, `"${p.rw || ''}"`, `"${p.kelurahan || ''}"`, `"${p.kecamatan || ''}"`, `"${p.hp || ''}"`, `"${p.email || ''}"`, `"${p.pendidikan || ''}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Peserta_${skemaName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-peserta-wrapper" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        {/* Menggunakan Button komponen yang baru */}
        <Button variant="success" icon="file-excel" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>

      <div className="table-responsive" style={{ maxHeight: '60vh', overflowX: 'auto', overflowY: 'auto' }}>
        <table className="excel-table" style={{ minWidth: '1500px', width: '100%' }}>
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '50px' }}>No.</th>
              <th rowSpan="2" style={{ minWidth: '180px' }}>Nama</th>
              <th rowSpan="2" style={{ minWidth: '160px' }}>NIK</th>
              <th rowSpan="2" style={{ width: '80px' }}>Jenis<br/>Kelamin<br/>(L/P)</th>
              <th rowSpan="2" style={{ minWidth: '120px' }}>Tempat Lahir</th>
              <th rowSpan="2" style={{ minWidth: '120px' }}>Tanggal Lahir</th>
              <th colSpan="5">Tempat Tinggal</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>No. HP</th>
              <th rowSpan="2" style={{ minWidth: '180px' }}>Email</th>
              <th rowSpan="2" style={{ minWidth: '120px' }}>Pendidikan<br/>Terakhir</th>
            </tr>
            <tr>
              <th style={{ minWidth: '220px' }}>Alamat</th>
              <th style={{ width: '50px' }}>RT</th>
              <th style={{ width: '50px' }}>RW</th>
              <th style={{ minWidth: '120px' }}>Kelurahan</th>
              <th style={{ minWidth: '120px' }}>Kecamatan</th>
            </tr>
          </thead>
          <tbody>
            {dataPeserta.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ color: '#334155' }}>{item.nama}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.nik}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.jk}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.tempatLahir}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.tanggalLahir}</td>
                <td style={{ color: '#334155' }}>{item.alamat}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.rt}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.rw}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.kelurahan}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.kecamatan}</td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.hp}</td>
                <td style={{ textAlign: 'center' }}><a href={`mailto:${item.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{item.email}</a></td>
                <td style={{ textAlign: 'center', color: '#334155' }}>{item.pendidikan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePeserta;