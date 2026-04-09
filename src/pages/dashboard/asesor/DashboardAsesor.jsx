import { useState } from 'react';
import './DashboardAsesor.css'; // Memanggil file CSS yang baru dibuat

const DashboardAsesor = () => {
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Data ujian (tidak memerlukan URL dummy lagi karena kita generate dokumen sendiri)
  const jadwalUjian = [
    { id: 1, tanggal: '2026-02-15', skema: 'Junior Web Developer', tuk: 'TUK UPT Pelatihan Kerja Surabaya', peserta: 18, status: 'Selesai' },
    { id: 2, tanggal: '2026-02-28', skema: 'Desain UI/UX & Riset Psikologi Pengguna', tuk: 'TUK UPT Pelatihan Kerja Surabaya', peserta: 12, status: 'Selesai' },
    { id: 3, tanggal: '2026-03-05', skema: 'Pemrograman Web Full-Stack', tuk: 'TUK UPT Pelatihan Kerja Surabaya', peserta: 15, status: 'Selesai' },
    { id: 4, tanggal: '2026-03-10', skema: 'Front-End Development (React.js)', tuk: 'TUK LSP Surabaya', peserta: 20, status: 'Sedang Berlangsung' },
    { id: 5, tanggal: '2026-03-12', skema: 'Database Management', tuk: 'TUK LSP Surabaya', peserta: 20, status: 'Menunggu Jadwal' },
    { id: 6, tanggal: '2026-03-18', skema: 'Backend Development & API', tuk: 'TUK UPT Pelatihan Kerja Surabaya', peserta: 16, status: 'Menunggu Jadwal' },
    { id: 7, tanggal: '2026-03-25', skema: 'System Administrator', tuk: 'TUK Mandiri Surabaya', peserta: 10, status: 'Menunggu Jadwal' }
  ];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Selesai': return { bg: '#00bb0c', text: 'white' };
      case 'Sedang Berlangsung': return { bg: '#0dcaf0', text: 'black' };
      case 'Menunggu Jadwal': return { bg: '#ffc107', text: 'black' };
      default: return { bg: '#e9ecef', text: 'black' };
    }
  };

  const filteredJadwal = filterStatus === 'Semua' 
    ? jadwalUjian 
    : jadwalUjian.filter((ujian) => ujian.status === filterStatus);

  // Fungsi untuk membuat & membuka dokumen "Surat Penugasan" secara dinamis di tab baru
  const bukaSuratTugas = (ujian) => {
    // Membuat nomor surat acak berdasarkan ID ujian
    const noSurat = `ST-${ujian.id.toString().padStart(3, '0')}/LSP-BLK/III/2026`;
    
    // HTML Template untuk Surat Penugasan
    const templateSurat = `
      <html>
        <head>
          <title>Surat Penugasan - ${ujian.skema}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #000; padding: 40px; max-width: 800px; margin: 0 auto; }
            .kop-surat { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .kop-surat h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
            .kop-surat p { margin: 5px 0 0 0; font-size: 14px; }
            .judul-surat { text-align: center; margin-bottom: 30px; }
            .judul-surat h2 { margin: 0; text-decoration: underline; font-size: 18px; }
            .isi-surat { margin-bottom: 30px; text-align: justify; }
            .tabel-detail { width: 100%; margin: 20px 0; border-collapse: collapse; }
            .tabel-detail td { padding: 8px; vertical-align: top; }
            .tabel-detail td:first-child { width: 200px; font-weight: bold; }
            .ttd-section { float: right; width: 300px; text-align: center; margin-top: 50px; }
            .ttd-space { height: 100px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="kop-surat">
            <h1>Lembaga Sertifikasi Profesi (LSP)<br>Balai Latihan Kerja Surabaya</h1>
            <p>Jl. Dukuh Menanggal III/29, Gayungan, Kota Surabaya, Jawa Timur 60234</p>
            <p>Email: admin.lsp@blksurabaya.com | Website: lsp.blksurabaya.com</p>
          </div>
          
          <div class="judul-surat">
            <h2>SURAT TUGAS ASESOR</h2>
            <p>Nomor: ${noSurat}</p>
          </div>

          <div class="isi-surat">
            <p>Ketua Lembaga Sertifikasi Profesi (LSP) BLK Surabaya, dengan ini menugaskan kepada Asesor Kompetensi di bawah ini:</p>
            
            <table class="tabel-detail">
              <tr><td>Nama Asesor</td><td>: <strong>Angga Yunanda</strong></td></tr>
              <tr><td>Nomor Registrasi</td><td>: REG-IT-2025-00192</td></tr>
            </table>

            <p>Untuk melaksanakan Uji Kompetensi (UJK) dengan detail pelaksanaan sebagai berikut:</p>

            <table class="tabel-detail">
              <tr><td>Skema Sertifikasi</td><td>: ${ujian.skema}</td></tr>
              <tr><td>Tanggal Pelaksanaan</td><td>: ${ujian.tanggal}</td></tr>
              <tr><td>Lokasi Ujian (TUK)</td><td>: ${ujian.tuk}</td></tr>
              <tr><td>Jumlah Asesi (Peserta)</td><td>: ${ujian.peserta} Orang</td></tr>
            </table>

            <p>Demikian surat tugas ini dibuat agar dapat dilaksanakan dengan penuh tanggung jawab sesuai dengan pedoman dan kode etik Asesor kompetensi.</p>
          </div>

          <div class="ttd-section">
            <p>Surabaya, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Ketua LSP BLK Surabaya</p>
            <div class="ttd-space"></div>
            <p><strong><u>Bapak/Ibu Pimpinan LSP</u></strong><br>NIP. 19800101 200501 1 001</p>
          </div>
          
          <script>
            // Opsional: Otomatis memicu jendela Print saat tab dibuka (Bisa dihapus jika tidak mau langsung print)
            // window.print();
          </script>
        </body>
      </html>
    `;

    // Membuka tab baru dan menuliskan HTML tersebut ke dalamnya
    const newWindow = window.open('', '_blank');
    newWindow.document.write(templateSurat);
    newWindow.document.close();
  };

  return (
    <div className="dashboard-content">
      <h2>Dashboard Asesor</h2>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
        Selamat datang. Berikut adalah daftar penugasan Ujian Kompetensi (UJK) Anda.
      </p>
  
      <div style={{ backgroundColor: '#e3f2fd', color: '#0d6efd', padding: '16px', borderRadius: '8px', marginBottom: '30px', borderLeft: '5px solid #0d6efd', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <strong><i className="fas fa-info-circle"></i> Kebijakan Penugasan:</strong> Sistem secara otomatis membatasi jadwal Anda pada 1 ujian per hari (Single Task) untuk menjaga kualitas asesmen.
      </div>

      <div className="dashboard-card">
        
        <div className="dashboard-header-flex">
          <h3 style={{ margin: 0 }}>Riwayat & Jadwal Penugasan UJK</h3>
          
          <div className="filter-group">
            <label htmlFor="filterStatus" className="filter-label"><i className="fas fa-filter"></i> Filter</label>
            <select 
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              <option value="Menunggu Jadwal">Menunggu Jadwal</option>
            </select>
          </div>
        </div>
        
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Skema Kejuruan</th>
                <th>Lokasi (TUK)</th>
                <th>Jumlah Peserta</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {filteredJadwal.length > 0 ? (
                filteredJadwal.map((ujian) => {
                  const style = getStatusStyle(ujian.status);
                  
                  return (
                    <tr key={ujian.id}>
                      <td style={{ fontWeight: '600' }}>{ujian.tanggal}</td>
                      <td>{ujian.skema}</td>
                      <td>{ujian.tuk}</td>
                      <td>{ujian.peserta} Orang</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {ujian.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {/* Memanggil fungsi bukaSuratTugas saat diklik */}
                        <button 
                          className="btn-lihat-file"
                          onClick={() => bukaSuratTugas(ujian)}
                          title="Lihat Surat Penugasan Resmi"
                        >
                          <i className="fas fa-file-alt"></i> Lihat Surat
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6c757d' }}>
                    <i className="fas fa-folder-open" style={{ fontSize: '24px', display: 'block', marginBottom: '10px', color: '#dee2e6' }}></i>
                    Tidak ada jadwal ujian untuk status yang dipilih.
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

export default DashboardAsesor;