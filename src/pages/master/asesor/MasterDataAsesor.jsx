import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getSertifikatStatus = (tanggal) => {
  if (!tanggal) return { text: 'Belum Ada', color: '#64748b', bg: '#f1f5f9', icon: 'fa-minus-circle' };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(tanggal);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: 'Kadaluarsa', color: '#ef4444', bg: '#fee2e2', icon: 'fa-times-circle' };
  } else if (diffDays <= 30) {
    return { text: 'Akan Habis', color: '#f59e0b', bg: '#fef3c7', icon: 'fa-exclamation-triangle' };
  } else {
    return { text: 'Aktif', color: '#10b981', bg: '#d1fae5', icon: 'fa-check-circle' };
  }
};
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import Pagination from '../../../components/ui/Pagination';

const MasterDataAsesor = () => {
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/admin-lsp/asesor?status=semua`, config);
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
        status: item.user?.status || 'Non-aktif',
        masaBerlaku: item.masa_berlaku_sertifikat || null
      }));
      mapped.sort((a, b) => b.id - a.id);
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
    const isAktif = asesor.status === 'Aktif';
    const aksiText = isAktif ? 'menon-aktifkan' : 'mengaktifkan';
    const btnText = isAktif ? 'Ya, Non-aktifkan' : 'Ya, Aktifkan';
    const btnColor = isAktif ? '#ef4444' : '#10b981'; // Merah untuk Non-aktif, Hijau untuk Aktif

    setAlert({
      type: 'confirm',
      title: 'Konfirmasi Status',
      text: `Apakah Anda yakin untuk ${aksiText} asesor ${asesor.nama} berikut?`,
      confirmText: btnText,
      confirmColor: btnColor,
      onConfirm: async () => {
        try {
          await axios.patch(`${baseUrl}/admin-lsp/asesor/${asesor.id}/status`, {}, config);
          showSuccess('Berhasil!', `Status asesor ${asesor.nama} telah diperbarui.`);
          fetchData(); 
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Asesor</h2>
          <p className="text-muted" style={{ margin: '5px 0 0' }}>Manajemen data detail Asesor tersertifikasi.</p>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative', maxWidth: '400px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
            <input type="text" placeholder="Cari Nama / No Registrasi..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Filter:</label>
            <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
              <option value="Aktif">Lihat Aktif</option>
              <option value="Non-aktif">Lihat Non-Aktif</option>
              <option value="Semua">Semua Status</option>
            </select>
          </div>
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th>Profil & Institusi</th>
                <th>Kontak & Alamat</th>
                <th style={{ textAlign: 'center' }}>No Registrasi (MET)</th>
                <th>Bidang & Skema Uji</th>
                <th style={{ textAlign: 'center', width: '120px' }}>Masa Berlaku</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px', color:'#94a3b8'}}><i className="fas fa-spinner fa-spin fa-2x"></i><br/>Memuat Data...</td></tr> : paginatedAsesor.length > 0 ? paginatedAsesor.map((asesor, index) => (
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
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {asesor.bidang && asesor.bidang.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>Bidang Asesmen</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {asesor.bidang.map((b, i) => (
                              <span key={`bidang-${i}`} style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', border: '1px solid #c7d2fe', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fas fa-layer-group" style={{ opacity: 0.7, fontSize: '0.7rem' }}></i> {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {asesor.skema && asesor.skema.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>Skema Sertifikasi</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {asesor.skema.map((s, i) => (
                              <span key={`skema-${i}`} style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.75rem', fontWeight: '600', padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(!asesor.bidang?.length && !asesor.skema?.length) && (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>Belum ada data skema/bidang</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {(() => {
                      const statusSertifikat = getSertifikatStatus(asesor.masaBerlaku);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', whiteSpace: 'nowrap' }}>
                            {formatDate(asesor.masaBerlaku)}
                          </span>
                          <span style={{ 
                            backgroundColor: statusSertifikat.bg, 
                            color: statusSertifikat.color, 
                            fontSize: '0.7rem', 
                            fontWeight: '700', 
                            padding: '4px 8px', 
                            borderRadius: '6px',
                            border: `1px solid ${statusSertifikat.color}40`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                          }}>
                            {statusSertifikat.icon && <i className={`fas ${statusSertifikat.icon}`}></i>}
                            {statusSertifikat.text}
                          </span>
                        </div>
                      );
                    })()}
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
              )) : <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>Data tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredAsesor.length} itemsPerPage={itemsPerPage} />
      </div>
      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default MasterDataAsesor;