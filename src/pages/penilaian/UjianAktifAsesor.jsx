import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './UjianAktifAsesor.css';

const UjianAktifAsesor = () => {
  const location = useLocation();
  const initialTab = location.state?.tab || 'aktif';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeUjian, setActiveUjian] = useState(null);
  const [alert, setAlert] = useState(null);

  const daftarAktif = [{ id: 1, skema: 'Desain Grafis Muda', tuk: 'TUK Mandiri PT. Bambang Jaya', tanggal: '2026-04-08', waktu: '08:00 - 15:00 WIB', status: 'Sedang Dilaksanakan' }];
  const daftarRiwayat = [{ id: 2, skema: 'Digital Marketing', tuk: 'TUK Sewaktu Nganjuk', tanggal: '2026-03-12', waktu: '09:00 - 16:00 WIB', status: 'Selesai Dinilai' }];
  
  const pesertaKosong = [
    { id: 101, nama: 'Giyu Tomioka', nik: '3578012345670001', nilai: '', rekomendasi: '' },
    { id: 102, nama: 'Shinobu Kocho', nik: '3578012345670002', nilai: '', rekomendasi: '' }
  ];
  
  const pesertaSelesai = [
    { id: 201, nama: 'Kamado Tanjiro', nik: '3578055566660001', nilai: '95', rekomendasi: 'K' },
    { id: 202, nama: 'Agatsuma Zenitsu', nik: '3578055566660002', nilai: '65', rekomendasi: 'BK' },
    { id: 203, nama: 'Hashibira Inosuke', nik: '3578055566660003', nilai: '80', rekomendasi: 'K' }
  ];
  
  const [peserta, setPeserta] = useState([]);

  useEffect(() => { 
    if (location.state?.tab) { 
      setActiveTab(location.state.tab); 
      setActiveUjian(null); 
    } 
  }, [location.state]);

  const closeAlert = () => setAlert(null);
  const showSuccess = (text, callback) => {
    setAlert({ type: 'success', title: 'Sukses!', text });
    setTimeout(() => { setAlert(null); if (callback) callback(); }, 2000);
  };

  const handleBukaUjian = (ujian, isReadOnly) => { 
    setActiveUjian({ ...ujian, isReadOnly }); 
    setPeserta(isReadOnly ? pesertaSelesai : pesertaKosong); 
    window.scrollTo(0, 0); 
  };

  const handleKembali = () => {
    if (!activeUjian.isReadOnly) {
      setAlert({
        type: 'cancel', title: 'Apakah anda yakin ingin batal?', text: 'Semua draf nilai akan hilang.',
        onConfirm: () => { setActiveUjian(null); closeAlert(); }, onCancel: closeAlert
      });
    } else {
      setActiveUjian(null);
    }
  };

  // --- LOGIKA OTOMATISASI PENILAIAN (KKM = 70) ---
  const handleNilaiChange = (id, newNilai) => { 
    if (newNilai !== '' && (Number(newNilai) < 0 || Number(newNilai) > 100)) return; 
    
    setPeserta(peserta.map(p => {
      if (p.id === id) {
        let autoRekomendasi = '';
        if (newNilai !== '') {
          autoRekomendasi = Number(newNilai) >= 70 ? 'K' : 'BK';
        }
        return { ...p, nilai: newNilai, rekomendasi: autoRekomendasi };
      }
      return p;
    }));
  };

  const handleSimpanFinal = () => {
    if (peserta.some(p => p.nilai === '' || p.rekomendasi === '')) {
      alert('Mohon lengkapi semua nilai angka untuk seluruh peserta!');
      return;
    }
    setAlert({
      type: 'save', title: 'Simpan Penilaian Final?', text: 'Data akan dikirim ke LSP dan tidak dapat diubah lagi.',
      onConfirm: () => showSuccess('Penilaian berhasil diselesaikan.', () => setActiveUjian(null)),
      onCancel: closeAlert
    });
  };

  if (!activeUjian) {
    const listData = activeTab === 'aktif' ? daftarAktif : daftarRiwayat;
    return (
      <div className="dashboard-content fade-in-content">
        <div className="dashboard-header" style={{ marginBottom: '20px' }}>
          <h2>Panel Pelaksanaan Ujian</h2><p className="text-muted">Akses form penilaian untuk ujian yang sedang berjalan atau lihat rekap nilai masa lalu.</p>
        </div>
        <div className="ua-tab-container">
          <button className={`ua-tab-btn ${activeTab === 'aktif' ? 'active' : ''}`} onClick={() => setActiveTab('aktif')}>Sedang Dilaksanakan</button>
          <button className={`ua-tab-btn ${activeTab === 'riwayat' ? 'active' : ''}`} onClick={() => setActiveTab('riwayat')}>Riwayat Penilaian</button>
        </div>
        <div className="ujian-list-container mt-20">
          {listData.length > 0 ? listData.map((ujian) => (
            <div key={ujian.id} className={`dashboard-card ujian-card fade-in-content ${activeTab === 'riwayat' ? 'riwayat-card' : ''}`}>
              <div className="ujian-card-left">
                <h3 className="ujian-card-title">{ujian.skema}</h3>
                <p className="ujian-card-info"><i className="fas fa-map-marker-alt"></i> {ujian.tuk} &nbsp;|&nbsp; <i className="far fa-calendar-alt"></i> {ujian.tanggal}</p>
                <span className={`ujian-status-badge ${activeTab === 'riwayat' ? 'badge-selesai' : ''}`}><i className={activeTab === 'aktif' ? 'fas fa-play-circle' : 'fas fa-check-double'}></i> {ujian.status}</span>
              </div>
              <div className="ujian-card-right">
                {activeTab === 'aktif' ? <Button variant="primary" icon="pen" onClick={() => handleBukaUjian(ujian, false)}>Mulai Penilaian</Button>
                : <Button variant="outline" icon="file-alt" onClick={() => handleBukaUjian(ujian, true)}>Lihat Rekap Detail</Button>}
              </div>
            </div>
          )) : (
             <div style={{ textAlign: 'center', padding: '30px', background: '#fff', borderRadius: '12px', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
               Tidak ada data ujian untuk kategori ini.
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <button onClick={handleKembali} className="btn-back-icon"><i className="fas fa-arrow-left"></i> Kembali</button>
        <div><h2 style={{ margin: '0 0 5px 0' }}>{activeUjian.isReadOnly ? 'Rekap Final Penilaian' : 'Form Penilaian Aktif'}</h2></div>
      </div>
      <div className="dashboard-card info-ujian-box">
        <h3 className="box-title"><i className="fas fa-info-circle"></i> Informasi Ujian</h3>
        <div className="info-grid">
          <div className="info-item"><span className="info-label">Skema Kompetensi</span><span className="info-value">{activeUjian.skema}</span></div>
          <div className="info-item"><span className="info-label">Tanggal Pelaksanaan</span><span className="info-value">{activeUjian.tanggal}</span></div>
          <div className="info-item"><span className="info-label">Lokasi TUK</span><span className="info-value">{activeUjian.tuk}</span></div>
          <div className="info-item"><span className="info-label">Waktu</span><span className="info-value">{activeUjian.waktu}</span></div>
        </div>
      </div>
      <div className="dashboard-card mt-20">
        <h3 className="box-title"><i className="fas fa-users"></i> Daftar & Penilaian Peserta</h3>
        <div className="table-responsive">
          <table className="admin-table penilaian-table">
            <thead>
              <tr>
                <th width="5%" className="text-center">No</th>
                <th width="40%">Nama Peserta & NIK</th>
                <th width="20%" className="text-center">Nilai Angka</th>
                <th width="35%" className="text-center">Status Rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              {peserta.map((p, index) => (
                <tr key={p.id}>
                  <td className="text-center font-bold">{index + 1}</td>
                  <td><div className="peserta-name">{p.nama}</div><div className="peserta-nik">NIK: {p.nik}</div></td>
                  <td className="text-center">
                    {activeUjian.isReadOnly ? (
                      <div className="nilai-readonly">{p.nilai}</div>
                    ) : (
                      <input type="number" min="0" max="100" className="nilai-input" value={p.nilai} onChange={(e) => handleNilaiChange(p.id, e.target.value)} placeholder="0" />
                    )}
                  </td>
                  <td className="text-center">
                    {/* Menggunakan label/badge status murni, bukan lagi tombol */}
                    {p.rekomendasi === 'K' ? (
                      <span className="status-badge-auto status-k"><i className="fas fa-check-circle"></i> Kompeten</span>
                    ) : p.rekomendasi === 'BK' ? (
                      <span className="status-badge-auto status-bk"><i className="fas fa-times-circle"></i> Belum Kompeten</span>
                    ) : (
                      <span className="status-badge-auto status-empty"><i className="fas fa-minus-circle"></i> Menunggu Nilai</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="penilaian-actions">
          {activeUjian.isReadOnly ? <Button variant="outline" icon="print" onClick={() => alert('Mencetak Rekap Nilai PDF...')} >Cetak Rekap Nilai</Button> : <Button variant="success" icon="save" onClick={handleSimpanFinal}>Simpan Final Penilaian</Button>}
        </div>
      </div>
      <AlertPopup {...alert} />
    </div>
  );
};

export default UjianAktifAsesor;