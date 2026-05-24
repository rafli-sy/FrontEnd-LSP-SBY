import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import Pagination from '../../../components/ui/Pagination';
import './MasterDataAsesor.css';

const MasterDataAsesor = () => {
  // Konfigurasi API
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: { 'ngrok-skip-browser-warning': 'true', 'Authorization': `Bearer ${token}` }
  }), [token]);

  const [asesorList, setAsesorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Aktif');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Data dari API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mengambil data dari backend
      const res = await axios.get(`${baseUrl}/admin-lsp/asesor?status=semua`, config);
      
      // Mapping respons backend ke struktur UI
      // Catatan: Jika data hanya muncul 3, berarti backend memang mengirimkan 3 data.
      const mapped = res.data.data.map(item => ({
        id: item.id,
        nama: item.user?.namaLengkap || 'Nama Tidak Ditemukan',
        noReg: item.noRegistrasi || '-',
        alamat: item.alamat || '-',
        hp: item.user?.nomorTelpon || '-',
        skema: item.skema ? item.skema.map(s => s.namaSkema) : [],
        bidang: item.skema ? [...new Set(item.skema.map(s => s.bidang?.namaBidang).filter(Boolean))] : [],
        profesi: item.profesi || '-',
        institusi: item.user?.asalInstansi || '-',
        status: item.user?.status || 'Non-aktif'
      }));
      
      setAsesorList(mapped);
    } catch (error) {
      console.error("Gagal mengambil data asesor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const handleToggleStatus = async (asesor) => {
    const aksiText = asesor.status === 'Aktif' ? 'menon-aktifkan' : 'mengaktifkan';
    setAlert({
      type: 'confirm',
      title: 'Konfirmasi Status',
      text: `Apakah Anda yakin untuk ${aksiText} asesor ${asesor.nama} berikut?`,
      onConfirm: async () => {
        try {
          await axios.patch(`${baseUrl}/admin-lsp/asesor/${asesor.id}/status`, {}, config);
          showSuccess('Berhasil!', `Status asesor ${asesor.nama} telah diperbarui.`);
          fetchData(); // Refresh data
        } catch (error) {
          showAlert('error', 'Gagal', 'Terjadi kesalahan sistem.');
        }
      },
      onCancel: closeAlert
    });
  };

  const showAlert = (type, title, text) => {
    setAlert({ type, title, text, onCancel: closeAlert });
  };

  const filteredAsesor = asesorList.filter(a => {
    const matchSearch = a.nama.toLowerCase().includes(searchQuery.toLowerCase()) || a.noReg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' ? true : a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredAsesor.length / itemsPerPage) || 1;
  const paginatedAsesor = filteredAsesor.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Asesor</h2>
          <p className="text-muted" style={{ margin: 0 }}>Manajemen data detail Asesor tersertifikasi.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select className="form-input" value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ width: 'auto', padding: '10px 14px', cursor: 'pointer' }}>
            <option value="Aktif">Lihat Aktif Saja</option>
            <option value="Non-aktif">Lihat Non-Aktif</option>
            <option value="Semua">Semua Status</option>
          </select>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <input type="text" className="form-input" placeholder="Cari Nama / No Registrasi..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th>Profil & Institusi</th>
                <th>Kontak & Alamat</th>
                <th style={{ textAlign: 'center' }}>No Registrasi (MET)</th>
                <th>Bidang & Skema Uji</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Memuat Data...</td></tr> : paginatedAsesor.map((asesor, index) => (
                <tr key={asesor.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <strong style={{ color: '#0f172a', display: 'block', fontSize: '1rem' }}>{asesor.nama}</strong>
                    <small className="text-muted"><i className="fas fa-building"></i> {asesor.institusi}</small><br/>
                    <small style={{ color: '#3b82f6', fontWeight: '600' }}><i className="fas fa-user-tie"></i> {asesor.profesi}</small>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '4px' }}><i className="fas fa-phone-alt"></i> {asesor.hp}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}><i className="fas fa-map-marker-alt"></i> {asesor.alamat}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}><span className="badge info">{asesor.noReg}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                      {asesor.bidang.map(b => <span key={b} className="badge primary" style={{fontSize: '0.7rem', padding: '2px 6px'}}>{b}</span>)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {asesor.skema.map(s => <span key={s} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>{s}</span>)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleToggleStatus(asesor)}
                      className={`badge ${asesor.status === 'Aktif' ? 'success' : 'danger'}`}
                      style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.2s', padding: '6px 12px' }}
                    >
                      {asesor.status} <i className="fas fa-exchange-alt" style={{fontSize: '0.7rem', opacity: 0.7}}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{color:'#64748b'}}>Halaman {currentPage} dari {totalPages}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Sebelumnya</Button>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Selanjutnya</Button>
          </div>
        </div>
      </div>
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default MasterDataAsesor;