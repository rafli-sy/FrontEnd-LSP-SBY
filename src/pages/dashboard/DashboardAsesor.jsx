import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup';
import TablePeserta from '../TablePeserta/TablePeserta'; 

const DashboardAsesor = () => {
  const navigate = useNavigate(); 
  const [filterTanggal, setFilterTanggal] = useState('');
  const [alert, setAlert] = useState(null); 
  const [selectedPeserta, setSelectedPeserta] = useState(null); 

  const dummyPeserta = [
    { id: 1, nama: 'Giyu Tomioka', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '20 Juni 1990', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'giyu@gmail.com', pendidikan: 'S1' },
    { id: 2, nama: 'Shinobu Kocho', nik: '3578902006900002', jk: 'P', tempatLahir: 'Malang', tanggalLahir: '15 Agustus 1995', alamat: 'Jl. Raya Mondoroko No 1', rt: '2', rw: '3', kelurahan: 'Singosari', kecamatan: 'Singosari', hp: '081234567890', email: 'shinobu@gmail.com', pendidikan: 'SMA' }
  ];
  
  const [penugasan, setPenugasan] = useState([
    { id: 1, tanggal: '2026-04-06', skema: 'Junior Web Developer', tuk: 'TUK UPT Pelatihan Kerja Surabaya', asesi: 18, status: 'Menunggu Jadwal', noSurat: 'SPT-015/LSP/2026', peserta: dummyPeserta },
    { id: 2, tanggal: '2026-03-25', skema: 'Desain UI/UX & Riset Psikologi Pengguna', tuk: 'TUK UPT Pelatihan Kerja Surabaya', asesi: 12, status: 'Menunggu Jadwal', noSurat: 'SPT-012/LSP/2026', peserta: dummyPeserta },
    { id: 3, tanggal: '2026-03-15', skema: 'Pemrograman Web Full-Stack', tuk: 'TUK UPT Pelatihan Kerja Surabaya', asesi: 15, status: 'Menunggu Jadwal', noSurat: 'SPT-010/LSP/2026', peserta: dummyPeserta },
    { id: 4, tanggal: '2026-03-10', skema: 'Front-End Development (React.js)', tuk: 'TUK LSP Surabaya', asesi: 20, status: 'Sedang Berlangsung', peserta: dummyPeserta },
    { id: 5, tanggal: '2026-03-05', skema: 'Database Management', tuk: 'TUK LSP Surabaya', asesi: 20, status: 'Selesai', peserta: dummyPeserta },
    { id: 6, tanggal: '2026-03-01', skema: 'Backend Development & API', tuk: 'TUK UPT Pelatihan Kerja Surabaya', asesi: 16, status: 'Selesai', peserta: dummyPeserta },
  ]);

  const closeAlert = () => setAlert(null);
  const showSuccess = (text) => {
    setAlert({ type: 'success', title: 'Sukses!', text });
    setTimeout(() => setAlert(null), 2000);
  };

  const handleTerima = (id) => {
    setAlert({
      type: 'save', title: 'Terima Penugasan?', text: 'Jadwal ini akan masuk ke daftar agenda aktif Anda.',
      onConfirm: () => { setPenugasan(penugasan.map(p => p.id === id ? { ...p, status: 'Sedang Berlangsung' } : p)); showSuccess('Penugasan berhasil diterima.'); },
      onCancel: closeAlert
    });
  };

  const handleTolak = (id) => {
    setAlert({
      type: 'delete', title: 'Tolak Penugasan?', text: 'Aksi ini akan mengirim notifikasi pembatalan ke Admin LSP.',
      onConfirm: () => { setPenugasan(penugasan.filter(p => p.id !== id)); showSuccess('Penugasan telah ditolak.'); },
      onCancel: closeAlert
    });
  };

  // --- PERBAIKAN: MENGURUTKAN JADWAL DARI YANG TERBARU ---
  const sortedPenugasan = [...penugasan].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const tugasBaru = sortedPenugasan.filter(p => p.status === 'Menunggu Jadwal');
  const agendaAktif = sortedPenugasan.filter(p => p.status === 'Sedang Berlangsung');
  const riwayat = sortedPenugasan.filter(p => p.status === 'Selesai');
  const dataTabel = sortedPenugasan.filter(p => p.status !== 'Menunggu Jadwal' && (filterTanggal === '' || p.tanggal === filterTanggal));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sedang Berlangsung': return <span style={{ backgroundColor: '#38bdf8', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{status}</span>;
      case 'Selesai': return <span style={{ backgroundColor: '#4ade80', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{status}</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="dashboard-content fade-in-content">
      {selectedPeserta ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali</Button>
            <div><h2 style={{ margin: 0, fontSize: '1.5rem' }}>Data Detail Nominatif Peserta</h2><p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p></div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}><TablePeserta dataPeserta={selectedPeserta.peserta} skemaName={selectedPeserta.skema} /></div>
        </div>
      ) : (
        <div className="fade-in-content">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}><i className="fas fa-bell"></i></div><div className="stat-info"><h3>{tugasBaru.length}</h3><p>Tugas Baru Masuk</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><i className="fas fa-calendar-day"></i></div><div className="stat-info"><h3>{agendaAktif.length} Ujian</h3><p>Sedang Dilaksanakan</p></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}><i className="fas fa-history"></i></div><div className="stat-info"><h3>{riwayat.length} Ujian</h3><p>Selesai Dinilai</p></div></div>
          </div>

          {tugasBaru.length > 0 && (
            <div style={{ marginTop: '25px', marginBottom: '20px' }}>
              <h3 className="section-title">Konfirmasi Penugasan Baru</h3>
              {tugasBaru.map(tugas => (
                <div key={tugas.id} className="dashboard-card fade-in-content" style={{ borderLeft: '5px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px', padding: '20px' }}>
                  <div style={{ flex: '1 1 min-content' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.1rem' }}><i className="fas fa-envelope-open-text" style={{ color: '#f59e0b', marginRight: '8px' }}></i> SPT Baru: {tugas.noSurat}</h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}><strong>Skema:</strong> {tugas.skema} <br/><strong>Lokasi:</strong> {tugas.tuk} <br/><strong>Tanggal:</strong> {tugas.tanggal}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Button variant="outline" icon="users" onClick={() => setSelectedPeserta(tugas)}>Lihat {tugas.asesi} Asesi</Button>
                    
                    {/* PERBAIKAN: Tombol Lihat SPT sekarang memiliki notifikasi responsif */}
                    <Button variant="outline" icon="file-pdf" onClick={() => window.alert(`Membuka Pratinjau Surat Tugas (SPT) Nomor: ${tugas.noSurat}...`)}>Lihat SPT</Button>
                    
                    <Button variant="danger" icon="times" onClick={() => handleTolak(tugas.id)}>Tolak</Button>
                    <Button variant="success" icon="check" onClick={() => handleTerima(tugas.id)}>Terima Tugas</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="dashboard-card" style={{ marginTop: '25px', padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px dashed #cbd5e1', flexWrap: 'wrap', gap: '15px' }}>
              <div><h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', color: '#0f172a' }}>Jadwal & Riwayat Uji Kompetensi</h3><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Daftar seluruh penugasan asesmen yang sedang dan telah Anda laksanakan.</p></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' }}><i className="fas fa-filter"></i> Filter:</span><input type="date" value={filterTanggal} onChange={(e) => setFilterTanggal(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />{filterTanggal && <button onClick={() => setFilterTanggal('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>}</div>
            </div>

            <div className="table-responsive">
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 25px' }}>Tanggal</th>
                    <th style={{ padding: '16px 25px' }}>Skema Kejuruan</th>
                    <th style={{ padding: '16px 25px' }}>Lokasi (TUK)</th>
                    <th style={{ padding: '16px 25px' }}>Peserta</th>
                    <th style={{ padding: '16px 25px' }}>Status</th>
                    <th style={{ padding: '16px 25px', textAlign: 'center' }}>Dokumen / Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTabel.length > 0 ? dataTabel.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 25px', fontWeight: '700' }}>{item.tanggal}</td>
                      <td style={{ padding: '16px 25px' }}>{item.skema}</td>
                      <td style={{ padding: '16px 25px' }}>{item.tuk}</td>
                      <td style={{ padding: '16px 25px' }}><Button variant="outline" size="sm" onClick={() => setSelectedPeserta(item)}><strong>{item.asesi}</strong> Orang <i className="fas fa-users" style={{ marginLeft: '5px' }}></i></Button></td>
                      <td style={{ padding: '16px 25px' }}>{getStatusBadge(item.status)}</td>
                      <td style={{ padding: '16px 25px', textAlign: 'center' }}>
                        {item.status === 'Sedang Berlangsung' && <Button variant="primary" style={{ padding: '6px 12px' }} onClick={() => navigate('/asesor/tugas', { state: { tab: 'aktif' } })}>Mulai Penilaian</Button>}
                        {item.status === 'Selesai' && <Button variant="outline" style={{ padding: '6px 12px' }} onClick={() => navigate('/asesor/tugas', { state: { tab: 'riwayat' } })}>Lihat Rekap</Button>}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Tidak ada riwayat ujian pada tanggal tersebut.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <AlertPopup {...alert} />
    </div>
  );
};

export default DashboardAsesor;