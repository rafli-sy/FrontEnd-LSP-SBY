import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination';

const DashboardAsesor = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null); 
  
  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- STATE DATA DARI BACKEND ---
  const [agendaPenugasan, setAgendaPenugasan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- FETCH AGENDA / JADWAL PENUGASAN DARI BACKEND ---
  useEffect(() => {
    const fetchAgenda = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('auth_token');
        const res = await fetch(`${apiUrl}/api/asesor/jadwal-penugasan`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        });

        if (res.ok) {
          const result = await res.json();
          setAgendaPenugasan(result.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgenda();
  }, [apiUrl]);

  // --- LOGIKA PROSES DATA ---
  const processedAgenda = useMemo(() => {
    // Mengurutkan data berdasarkan tanggal saja
    return [...agendaPenugasan].sort((a, b) => {
      // Pastikan menangani jika rawDate bernilai null
      const dateA = a.rawDate ? new Date(a.rawDate) : new Date(a.tanggal);
      const dateB = b.rawDate ? new Date(b.rawDate) : new Date(b.tanggal);
      return dateA - dateB;
    });
  }, [agendaPenugasan]);

  const paginatedData = processedAgenda.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(processedAgenda.length / itemsPerPage) || 1;

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (previewDokumen) { setPreviewDokumen(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [previewDokumen]);

  // --- FUNGSI PREVIEW DOKUMEN DARI BACKEND ---
  const handlePreviewDokumen = async (jenis, item) => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const res = await fetch(`${apiUrl}/api/asesor/dokumen/${item.id_penugasan}`, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });

      if (!res.ok) throw new Error("Gagal mengambil dokumen.");

      const responseData = await res.json();
      const dokumenList = responseData.data || [];
      
      const jenisTarget = jenis === 'SPT' ? 'spt_asesor' : 'berita_acara';
      const dokDitemukan = dokumenList.find(d => d.jenis_dokumen === jenisTarget);

      if (dokDitemukan && dokDitemukan.url_download) {
        setPreviewDokumen({
          jenis: jenis,
          fileUrl: dokDitemukan.url_download,
          namaSkema: item.skema_judul
        });
      } else {
        setAlertConfig({ type: 'warning', title: 'Belum Tersedia', text: `Dokumen ${jenis} untuk jadwal ini belum diterbitkan / diunggah oleh Admin.` });
      }

    } catch (error) {
      console.error(error);
      setAlertConfig({ type: 'error', title: 'Error', text: 'Terjadi kesalahan saat memuat dokumen dari server.' });
    }
  };

  if (previewDokumen) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>Pratinjau Dokumen - {previewDokumen.jenis}</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Skema: {previewDokumen.namaSkema}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
            <a 
              href={previewDokumen.fileUrl} 
              download={`${previewDokumen.jenis}_Asesor.pdf`}
              target="_blank" rel="noreferrer"
              style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fas fa-download"></i> Unduh PDF
            </a>
          </div>
        </div>
        <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <iframe 
             src={previewDokumen.fileUrl} 
             width="100%" 
             height="100%" 
             style={{ border: 'none' }} 
             title="Preview Dokumen" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative' }}>
      {alertConfig && <AlertPopup {...alertConfig} onConfirm={() => setAlertConfig(null)} onCancel={() => setAlertConfig(null)} />}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: '700', margin: '0' }}>Halo, {userData?.namaLengkap || userData?.username || 'Asesor'}!</h2>
        <p className="text-muted" style={{ fontSize: '1rem', marginTop: '6px' }}>Pantau jadwal penugasan dan unduh dokumen administrasi Anda.</p>
      </div>

      <div className="dashboard-card" style={{ padding: '0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: '600', margin: '0' }}>
               Daftar Penugasan
            </h3>
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          {isLoading ? (
             <div style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>Memuat Jadwal Penugasan...</div>
          ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Tanggal</th>
                <th style={{ width: '35%', textAlign: 'center' }}>Skema Kejuruan</th>
                <th style={{ width: '25%', textAlign: 'center' }}>Lokasi TUK</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id_penugasan}>
                  <td style={{ textAlign: 'center', color: '#94a3b8' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}><i className="far fa-calendar-alt text-muted" style={{marginRight:'6px'}}></i>{item.tanggal}</td>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ color: '#0f172a' }}>{item.skema_judul}</strong>
                  </td>
                  <td style={{ textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>{item.lokasi_tuk}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', minWidth: '80px', gap: '4px' }} 
                        onClick={() => handlePreviewDokumen('SPT', item)}
                      ><i className="fas fa-file-signature" style={{ fontSize: '1.2rem' }}></i><span>Surat Tugas</span></button>
                      <button 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', minWidth: '80px', gap: '4px' }} 
                        onClick={() => handlePreviewDokumen('BA', item)}
                      ><i className="fas fa-file-contract" style={{ fontSize: '1.2rem' }}></i><span>Berita Acara</span></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Tidak ada jadwal penugasan.</td></tr>}
            </tbody>
          </table>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={processedAgenda.length} itemsPerPage={itemsPerPage} />
      </div>
    </div>
  );
};

export default DashboardAsesor;