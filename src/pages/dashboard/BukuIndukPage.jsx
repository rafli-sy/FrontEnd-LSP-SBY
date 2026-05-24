import { useState } from 'react';

const BukuIndukPage = () => {
  // 1. Pindahkan data statis tabel ke dalam state array of objects
  const [dataInduk] = useState([
    {
      id: 1,
      blk: 'BLK Surabaya',
      blkValue: 'surabaya',
      nik: '35780123456789',
      nama: 'Maxwell Salvador',
      skema: 'Junior Web Developer',
      tglLulus: '14 Okt 2026',
      tahun: '2026',
      sertifikat: '- (Dalam Proses Cetak)',
      statusLabel: 'K - Belum Cetak',
      statusClass: 'badge warning',
      isBK: false
    },
    {
      id: 2,
      blk: 'BLK Wonojati',
      blkValue: 'wonojati',
      nik: '35780987654321',
      nama: 'Xaviera Putri',
      skema: 'Welder SMAW 3G',
      tglLulus: '05 Sep 2026',
      tahun: '2026',
      sertifikat: 'SER/WLD/09/26/001',
      statusLabel: 'K - Selesai',
      statusClass: 'badge info',
      isBK: false
    },
    {
      id: 3,
      blk: 'BLK Surabaya',
      blkValue: 'surabaya',
      nik: '35780111222333',
      nama: 'Leonardo Edwin',
      skema: 'Junior Web Developer',
      tglLulus: '14 Okt 2025',
      tahun: '2025', // <-- REVISI: Sebelumnya tertulis '2026'
      sertifikat: '-',
      statusLabel: 'BK',
      statusClass: '',
      isBK: true // BK = Belum Kompeten
    }
  ]);

  // 2. State untuk menyimpan nilai dari form pencarian/filter
  const [filterBlk, setFilterBlk] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Logika penyaringan data (Filter & Search)
  const filteredData = dataInduk.filter((item) => {
    // Cek dropdown BLK
    const matchBlk = filterBlk === '' || item.blkValue === filterBlk;
    // Cek dropdown Tahun
    const matchTahun = filterTahun === '' || item.tahun === filterTahun;
    // Cek kolom Search (Berdasarkan NIK atau Nama)
    const matchSearch = searchQuery === '' || 
      item.nik.includes(searchQuery) || 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase());

    return matchBlk && matchTahun && matchSearch;
  });

  return (
    <div className="dashboard-content">
      <h2>Buku Induk Kelulusan</h2>
      <p>Database utama seluruh peserta UJK lintas BLK (A-G).</p>
      
      <div className="dashboard-card mt-20">
        {/* Fitur Filter untuk Pencarian */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <select 
            className="form-select" 
            value={filterBlk} 
            onChange={(e) => setFilterBlk(e.target.value)}
          >
            <option value="">Semua BLK</option>
            <option value="surabaya">BLK Surabaya</option>
            <option value="wonojati">BLK Wonojati</option>
          </select>
          
          <select 
            className="form-select"
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
          >
            <option value="">Semua Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari NIK / Nama Peserta..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Asal Instansi</th>
                <th>NIK / Nama</th>
                <th>Skema</th>
                <th>Tgl Lulus</th>
                <th>No. Sertifikat / Blanko</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* 4. Render data hasil filter ke dalam tabel */}
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.blk}</td>
                    <td>
                      <strong>{item.nik}</strong><br/>
                      {item.nama}
                    </td>
                    <td>{item.skema}</td>
                    <td>{item.tglLulus}</td>
                    <td>{item.sertifikat}</td>
                    {/* Penanganan khusus untuk status BK yang text-nya merah */}
                    {item.isBK ? (
                      <td style={{ color: 'red', fontWeight: 'bold' }}>{item.statusLabel}</td>
                    ) : (
                      <td><span className={item.statusClass}>{item.statusLabel}</span></td>
                    )}
                  </tr>
                ))
              ) : (
                /* 5. Tampilan jika data tidak ditemukan */
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '30px', color: '#6c757d' }}>
                    <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '10px', color: '#dee2e6' }}></i>
                    <br />
                    Data peserta tidak ditemukan berdasarkan kriteria pencarian tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BukuIndukPage;