import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import TablePeserta from '../TablePeserta/TablePeserta';

// Helper untuk format tanggal (YYYY-MM-DD menjadi DD-MM-YYYY)
const formatTgl = (tgl) => {
  if (!tgl) return '-';
  const parts = tgl.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return tgl;
};

const DashboardAdminBLK = () => {
  const navigate = useNavigate();
  const [riwayatPengajuan, setRiwayatPengajuan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  
  // STATE BARU: Untuk menyimpan data skema yang sedang dilihat tabel pesertanya
  const [viewPeserta, setViewPeserta] = useState(null);

  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token'); 
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';

  // --- FETCH DATA DARI BACKEND ---
  useEffect(() => {
    if (!token) {
      console.warn("Token tidak ditemukan. Pastikan Anda sudah login.");
      setIsLoading(false);
      return;
    }
    fetchHistoryPengajuan();
  }, [token]);

  // Menangani tombol 'Back' bawaan browser/device
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (viewPeserta) { setViewPeserta(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [viewPeserta]);

  const fetchHistoryPengajuan = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/admin-blk/history-pengajuan`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      if (response.status === 401) {
        console.error("Akses ditolak (401). Token invalid atau expired.");
        return;
      }

      const resData = await response.json();

      if (resData.status === 'success') {
        const formattedData = resData.data.map(item => ({
          id: item.id,
          nomorSurat: item.nomor_surat_pengajuan,
          statusPengajuan: item.status, 
          skemaList: (item.detail_skema || item.detailSkema || []).map(ds => ({
            idDetail: ds.id,
            judul: ds.skema?.namaSkema || 'N/A',
            tuk: ds.tuk?.namaInstitusi || ds.tuk?.nama_lembaga || 'N/A',
            tanggal: `${formatTgl(ds.tanggal_mulai)} s/d ${formatTgl(ds.tanggal_selesai)}`,
            pesertaCount: ds.jumlah_peserta || 0,
            peserta: ds.peserta_pengajuan_ujk || ds.pesertaPengajuanUjk || [] // Array peserta
          }))
        }));
        setRiwayatPengajuan(formattedData);
      }
    } catch (error) {
      console.error("Gagal mengambil data history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- REVISI: PENYELESAIAN TRAGEDI NGROK DI ADMIN BLK ---
  const handleViewBalasan = async (id) => {
    try {
      // 1. Ambil URL dokumen dari backend
      const response = await fetch(`${apiUrl}/api/admin-blk/surat-balasan/${id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const res = await response.json();
      
      if (res.status === 'success' && res.data) {
        let fileUrl = res.data.url_download;
        
        // Jaga-jaga jika backend me-return localhost
        fileUrl = fileUrl.replace(/http:\/\/127\.0\.0\.1:\d+/g, apiUrl.replace(/\/api$/, ''));

        // 2. FETCH BLOB DENGAN HEADER PENEMBUS NGROK
        const pdfResponse = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': '69420',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!pdfResponse.ok) throw new Error("Gagal mengunduh file fisik PDF.");

        // 3. Konversi ke wujud Blob
        const blob = await pdfResponse.blob();
        const localBlobUrl = URL.createObjectURL(blob);

        // 4. Buka Blob lokal di tab baru (Ngrok tidak akan bisa mencegat ini)
        window.open(localBlobUrl, '_blank');
        
        // Membersihkan cache memori setelah beberapa detik
        setTimeout(() => URL.revokeObjectURL(localBlobUrl), 5000);

      } else {
        alert(res.message || "Surat balasan belum tersedia.");
      }
    } catch (error) {
      console.error("Gagal memuat surat balasan:", error);
      alert("Terjadi kesalahan atau file diblokir oleh CORS Server.");
    }
  };

  // Filter 
  const filteredRiwayat = riwayatPengajuan.filter(item => {
    const matchSearch = item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || item.statusPengajuan === filterStatus;
    return matchSearch && matchStatus;
  });

  // LOGIKA PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage) || 1;
  const paginatedRiwayat = filteredRiwayat.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Perhitungan Statistik
  const totalUsulan = riwayatPengajuan.length;
  const countDiproses = riwayatPengajuan.filter(r => r.statusPengajuan === 'Menunggu' || r.statusPengajuan === 'Sedang Diproses').length;
  const countDisetujui = riwayatPengajuan.filter(r => r.statusPengajuan === 'Disetujui').length;

  // --- VIEW: TABEL PESERTA ---
  if (viewPeserta) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setViewPeserta(null)}>Kembali ke Riwayat</Button>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Nominatif Peserta</h2>
            <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPeserta.judul}</strong></p>
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '25px' }}>
           <TablePeserta 
             dataPeserta={viewPeserta.peserta || []} 
             skemaName={viewPeserta.judul} 
             isAdmin={false} 
             asesorList={[]} /* PERBAIKAN: Melempar array kosong agar tidak crash */
           />
        </div>
      </div>
    );
  }

  // --- VIEW: LOADING ---
  if (isLoading) return <div style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>Memuat data dari server...</div>;

  // --- VIEW: DASHBOARD UTAMA ---
  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative' }}>
      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}><i className="fas fa-envelope"></i></div>
          <div className="stat-info"><h3>{totalUsulan}</h3><p>Total Surat Terkirim</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><i className="fas fa-spinner fa-spin"></i></div>
          <div className="stat-info"><h3>{countDiproses}</h3><p>Pengajuan Diproses</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}><i className="fas fa-check-circle"></i></div>
          <div className="stat-info"><h3>{countDisetujui}</h3><p>Pengajuan Disetujui</p></div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#0f172a' }}>Monitoring Pengajuan UJK</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Pantau status persetujuan dari seluruh surat pengajuan yang telah terkirim.</p>
          </div>
          <Button variant="primary" icon="plus" onClick={() => navigate('/admin-blk/pengajuan')}>
            Buat Usulan UJK Baru (Draft)
          </Button>
        </div>

        {/* SEARCH & FILTER */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input 
              type="text" 
              placeholder="Cari berdasarkan Nomor Surat..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer' }}
            >
              <option value="Semua">Semua</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
               <tr>
                <th style={{ width: '4%', textAlign: 'center' }}>No.</th>
                <th style={{ width: '15%' }}>Nomor Surat</th>
                <th style={{ width: '20%' }}>Lokasi TUK</th>
                <th style={{ width: '25%' }}>Skema & Tanggal</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Peserta</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Balasan</th>
               </tr>
            </thead>
            <tbody>
              {paginatedRiwayat.length > 0 ? (
                paginatedRiwayat.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#64748b', verticalAlign: 'top', paddingTop: '15px' }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      <strong style={{ color: '#0f172a' }}>{item.nomorSurat}</strong>
                    </td>
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      {item.skemaList.map((skema, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                          <i className="fas fa-map-marker-alt text-muted" style={{marginRight: '6px'}}></i> {skema.tuk}
                        </div>
                      ))}
                    </td>
                    <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                      {item.skemaList.map((skema, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                          <strong style={{ display: 'block', color: '#1e293b' }}>{skema.judul}</strong>
                          <small className="text-muted"><i className="far fa-calendar-alt" style={{marginRight: '4px'}}></i> {skema.tanggal}</small>
                        </div>
                      ))}
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '15px' }}>
                      {item.skemaList.map((skema, i) => (
                         <div key={i} style={{ marginBottom: '10px' }}>
                           <button 
                             onClick={() => setViewPeserta(skema)}
                             style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}
                           >
                             {skema.pesertaCount} Org <i className="fas fa-users"></i>
                           </button>
                         </div>
                      ))}
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '15px' }}>
                       <span className={`badge ${item.statusPengajuan === 'Disetujui' ? 'success' : item.statusPengajuan === 'Ditolak' ? 'danger' : 'warning'}`}>
                         {item.statusPengajuan}
                       </span>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '15px' }}>
                      <button onClick={() => handleViewBalasan(item.id)} title="Lihat Surat Balasan" style={{ background: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}>
                        <i className="fas fa-envelope-open-text"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Belum ada riwayat pengajuan yang dikirim.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      </div>
    </div>
  );
};

export default DashboardAdminBLK;