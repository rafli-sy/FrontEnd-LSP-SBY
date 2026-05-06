import React from 'react';
import Button from '../../components/ui/Button';
import './TablePeserta.css'; // <-- IMPORT CSS GAYA EXCEL DI SINI

const TablePeserta = ({ dataPeserta, skemaName }) => {
  if (!dataPeserta || dataPeserta.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>Data peserta tidak ditemukan.</div>;
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
    link.setAttribute("download", `Data_Peserta_${skemaName?.replace(/\s+/g, '_') || 'UJK'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-peserta-wrapper">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <Button variant="success" icon="file-excel" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>

      <div className="table-responsive-excel">
        <table className="excel-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '50px' }}>No.</th>
              <th rowSpan="2" style={{ minWidth: '180px' }}>Nama</th>
              <th rowSpan="2" style={{ minWidth: '160px' }}>NIK</th>
              <th rowSpan="2" style={{ width: '90px' }}>Jenis<br/>Kelamin<br/>(L/P)</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>Tempat Lahir</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>Tanggal Lahir</th>
              <th colSpan="5">Tempat Tinggal</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>No. HP</th>
              <th rowSpan="2" style={{ minWidth: '200px' }}>Email</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>Pendidikan<br/>Terakhir</th>
            </tr>
            <tr>
              <th style={{ minWidth: '250px' }}>Alamat</th>
              <th style={{ width: '60px' }}>RT</th>
              <th style={{ width: '60px' }}>RW</th>
              <th style={{ minWidth: '140px' }}>Kelurahan</th>
              <th style={{ minWidth: '140px' }}>Kecamatan</th>
            </tr>
          </thead>
          <tbody>
            {dataPeserta.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td><strong>{item.nama}</strong></td>
                <td style={{ textAlign: 'center' }}>{item.nik}</td>
                <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.jk}</td>
                <td style={{ textAlign: 'center' }}>{item.tempatLahir}</td>
                <td style={{ textAlign: 'center' }}>{item.tanggalLahir}</td>
                <td>{item.alamat}</td>
                <td style={{ textAlign: 'center' }}>{item.rt}</td>
                <td style={{ textAlign: 'center' }}>{item.rw}</td>
                <td style={{ textAlign: 'center' }}>{item.kelurahan}</td>
                <td style={{ textAlign: 'center' }}>{item.kecamatan}</td>
                <td style={{ textAlign: 'center' }}>{item.hp}</td>
                <td><a href={`mailto:${item.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>{item.email}</a></td>
                <td style={{ textAlign: 'center' }}>{item.pendidikan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePeserta;