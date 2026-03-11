import { useState } from 'react';

const UjianAktifAsesor = () => {
  // Mock data detail ujian
  const detailUjian = {
    idUjian: 'UJK-2026-03-001',
    skema: 'Pemrograman Web Full-Stack',
    tanggal: '10 Maret 2026',
    tuk: 'TUK UPT Pelatihan Kerja Surabaya',
    waktu: '08:00 - 15:00 WIB',
  };

  // Mock data peserta ujian
  const [peserta, setPeserta] = useState([
    { id: 1, nik: '3578012345670001', nama: 'Agatsuma Zenitsu', nilaiPraktik: '', rekomendasi: '' },
    { id: 2, nik: '3578012345670002', nama: 'Shinobu Kocho', nilaiPraktik: '', rekomendasi: '' },
    { id: 3, nik: '3578012345670003', nama: 'Muichiro Tokito', nilaiPraktik: '', rekomendasi: '' },
  ]);

  // Handler untuk mengubah input nilai dan set rekomendasi otomatis
  const handleInputChange = (id, field, value) => {
    const updatedPeserta = peserta.map((p) => {
      if (p.id === id) {
        let updatedData = { ...p, [field]: value };

        // Logika Otomatis: Jika yang diubah adalah 'nilaiPraktik'
        if (field === 'nilaiPraktik') {
          if (value === '') {
            updatedData.rekomendasi = ''; // Kosongkan jika input dihapus
          } else if (parseFloat(value) >= 75) {
            updatedData.rekomendasi = 'K'; // >= 75 maka Kompeten
          } else {
            updatedData.rekomendasi = 'BK'; // < 75 maka Belum Kompeten
          }
        }

        return updatedData;
      }
      return p;
    });

    setPeserta(updatedPeserta);
  };

  // Handler untuk submit penilaian
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data Penilaian Tersimpan:', peserta);
    alert('Penilaian berhasil disimpan.');
  };

  // Fungsi helper untuk menampilkan teks rekomendasi di input
  const getRekomendasiText = (kode) => {
    if (kode === 'K') return 'Kompeten (K)';
    if (kode === 'BK') return 'Belum Kompeten (BK)';
    return ''; // Kosong jika belum ada nilai
  };

  return (
    <div className="dashboard-content">
      <h2>Ujian Aktif Saya</h2>
      <p>Halaman ini menampilkan ujian yang sedang berlangsung hari ini dan form penilaian peserta.</p>

      {/* Card Informasi Ujian */}
      <div className="dashboard-card mt-20" style={{ borderLeft: '5px solid #0d6efd' }}>
        <h3>Informasi Ujian Kompetensi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div><strong>Skema:</strong> {detailUjian.skema}</div>
          <div><strong>Tanggal:</strong> {detailUjian.tanggal}</div>
          <div><strong>Lokasi:</strong> {detailUjian.tuk}</div>
          <div><strong>Waktu:</strong> {detailUjian.waktu}</div>
        </div>
      </div>

      {/* Form Penilaian Peserta */}
      <div className="dashboard-card mt-20">
        <h3>Daftar & Penilaian Peserta</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ overflowX: 'auto', marginTop: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px' }}>No</th>
                  <th style={{ padding: '12px' }}>Nama Peserta</th>
                  <th style={{ padding: '12px' }}>Nilai Praktik (0-100)</th>
                  <th style={{ padding: '12px' }}>Rekomendasi Asesor</th>
                </tr>
              </thead>
              <tbody>
                {peserta.map((p, index) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <strong>{p.nama}</strong><br />
                      <small style={{ color: '#666' }}>{p.nik}</small>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-input"
                        style={{ width: '100px', marginBottom: '0' }}
                        value={p.nilaiPraktik}
                        onChange={(e) => handleInputChange(p.id, 'nilaiPraktik', e.target.value)}
                        required
                        placeholder="0-100"
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      {/* Menggunakan input text readonly sebagai pengganti select */}
                      <input
                        type="text"
                        className="form-input"
                        style={{
                          marginBottom: '0',
                          backgroundColor: '#f8f9fa', // Warna latar sedikit abu-abu menandakan read-only
                          cursor: 'not-allowed', // Kursor dilarang
                          color: p.rekomendasi === 'K' ? '#198754' : (p.rekomendasi === 'BK' ? '#dc3545' : '#333'), // Hijau jika K, Merah jika BK
                          fontWeight: p.rekomendasi ? 'bold' : 'normal'
                        }}
                        value={getRekomendasiText(p.rekomendasi)}
                        placeholder="Menunggu Nilai..."
                        readOnly // Membuatnya tidak bisa diketik manual
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-action">Simpan Penilaian UJK</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UjianAktifAsesor;