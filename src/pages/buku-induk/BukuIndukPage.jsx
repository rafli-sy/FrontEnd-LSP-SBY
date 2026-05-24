import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination'; 
import TablePeserta from '../TablePeserta/TablePeserta';

import './BukuIndukPage.css';

const formatTgl = (tgl) => {
  if (!tgl) return '-';
  const parts = tgl.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return tgl;
};

const BukuIndukPage = ({ isEmbedded = false, role = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffView = role === 'staff-lsp' || location.pathname.includes('/staff-lsp');
  const isAdminView = role === 'admin-lsp' || location.pathname.includes('/admin-lsp');

  const [alertConfig, setAlertConfig] = useState(null);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputModalData, setInputModalData] = useState({ id: null, keyName: '', title: '', value: '', type: 'text' });

  const [filterTahun, setFilterTahun] = useState('Semua');
  const [filterBulan, setFilterBulan] = useState('Semua');
  const [filterTuk, setFilterTuk] = useState('Semua');
  const [filterPendanaan, setFilterPendanaan] = useState('Semua');

  const [dataPemantauan, setDataPemantauan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewPeserta, setViewPeserta] = useState(null);
  const [asesorList, setAsesorList] = useState([]);

  // --- INTEGRASI LOGIKA DATA ---
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${token}`
    }
  }), [token]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const endpoint = isAdminView 
        ? `${baseUrl}/admin-lsp/semua-pengajuan` 
        : `${baseUrl}/staf-lsp/semua-pengajuan`;

      const response = await axios.get(endpoint, config);
      const rawData = response.data.data || [];
      
      const mappedData = rawData.map(item => {
        const jadwal = item.jadwal_asesmen || item.jadwalAsesmen;
        const penugasan = jadwal?.penugasan_asesor || jadwal?.penugasanAsesor || [];
        const pesertaData = item.peserta_pengajuan_ujk || item.pesertaPengajuanUjk || [];
        
        let countK = 0, countBK = 0;
        pesertaData.forEach(p => {
          if (p.keputusan_uji === 'kompeten' || p.keputusan_uji === 'K') countK++;
          if (p.keputusan_uji === 'belum kompeten' || p.keputusan_uji === 'BK') countBK++;
        });
        const isSudahDinilai = countK > 0 || countBK > 0;

        return {
          id: item.id,
          detailSkemaId: item.id, 
          pesertaRaw: pesertaData, 
          idUjk: item.pengajuan?.nomor_surat_pengajuan || `UJK-${item.id}`,
          pendanaan: item.pengajuan?.sumber_anggaran?.namaAnggaran || 'Tidak Diketahui',
          hari1: jadwal?.tanggal_mulai_asesmen || item.tanggal_mulai || '',
          hari2: jadwal?.tanggal_selesai_asesmen || item.tanggal_selesai || '',
          tuk: item.tuk?.namaInstitusi || item.tuk?.nama_lembaga || '',
          bidang: item.skema?.bidang?.namaBidang || item.bidang?.namaBidang || '',
          skema: item.skema?.namaSkema || '',
          jumlahAsesi: item.jumlah_peserta || pesertaData.length || 0,
          keputusanK: isSudahDinilai ? countK : '-', 
          keputusanBK: isSudahDinilai ? countBK : '-', 
          asesor1: penugasan[0]?.asesor?.user?.namaLengkap || penugasan[0]?.asesor?.nama || '',
          asesor2: penugasan[1]?.asesor?.user?.namaLengkap || penugasan[1]?.asesor?.nama || '',
          penyelia: jadwal?.penyilia?.namaPenyilia || '',
          suratBalasan: !!item.pengajuan_id,
          suratPermohonan: !!jadwal,
          spt: !!jadwal,
          administrasi: false,
          administrasiPleno: false,
          // FETCHING: Data otomatis dari backend berdasarkan tabel detail pengajuan ujk
          pelaksanaanStatus: item.status_pelaksanaan === 'Selesai',
          pembayaran: item.status_pembayaran === 'Selesai',
          tglPleno: item.tanggal_pleno || '',
          noPleno: item.no_pleno || '',
          draft: item.status_draft === 'Selesai',
          cetak: item.status_cetak === 'Selesai',
          dikirim: item.status_dikirim === 'Selesai',
          noResi: item.no_resi || '',
          diterima: item.status_diterima === 'Selesai',
          ttSertifikat: item.status_tt_sertifikat === 'Selesai'
        };
      });
      setDataPemantauan(mappedData);
    } catch (error) {
      console.error('Error fetching Buku Induk:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (isAdminView) {
      axios.get(`${baseUrl}/admin-lsp/asesor`, config)
        .then(res => setAsesorList(res.data.data || []))
        .catch(err => console.error("Gagal load asesor:", err));
    }
  }, [isAdminView]);

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isInputModalOpen) { setIsInputModalOpen(false); e.preventDefault(); }
      else if (viewPeserta) { setViewPeserta(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isInputModalOpen, viewPeserta]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTahun, filterBulan, filterTuk, filterPendanaan]);

  const sortedDataPemantauan = useMemo(() => {
    let filtered = [...dataPemantauan];
    if (filterTahun !== 'Semua') filtered = filtered.filter(item => item.hari1.startsWith(filterTahun));
    if (filterBulan !== 'Semua') filtered = filtered.filter(item => item.hari1.split('-')[1] === filterBulan);
    if (filterTuk !== 'Semua') filtered = filtered.filter(item => item.tuk === filterTuk);
    if (filterPendanaan !== 'Semua') filtered = filtered.filter(item => item.pendanaan === filterPendanaan);
    return filtered.sort((a, b) => new Date(b.hari1 || '1970-01-01') - new Date(a.hari1 || '1970-01-01'));
  }, [dataPemantauan, filterTahun, filterBulan, filterTuk, filterPendanaan]);

  const totalPages = Math.ceil(sortedDataPemantauan.length / itemsPerPage);
  const paginatedData = sortedDataPemantauan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ 
      type, title, text, 
      onConfirm: () => { if (action) action(); setAlertConfig(null); },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleProgressClick = (id, keyName, title) => {
    if (['tglPleno', 'noPleno', 'noResi'].includes(keyName)) {
      setInputModalData({ id, keyName, title, value: '', type: keyName === 'tglPleno' ? 'date' : 'text' });
      setIsInputModalOpen(true);
      return;
    }

    const currentItem = dataPemantauan.find(x => x.id === id);
    const currentStatus = currentItem ? currentItem[keyName] : false;
    const newStatus = !currentStatus;
    const stringStatusLabel = newStatus ? 'Selesai' : 'Belum Selesai';

    const mapJenisStatus = {
      pelaksanaanStatus: 'pelaksanaan',
      pembayaran: 'pembayaran',
      draft: 'draft',
      cetak: 'cetak',
      dikirim: 'dikirim',
      diterima: 'diterima',
      ttSertifikat: 'tt_sertifikat'
    };
    
    const targetJenisStatus = mapJenisStatus[keyName];

    setAlertConfig({
      type: 'save', title: `Ubah Status ${title}?`,
      text: `Apakah Anda yakin ingin mengubah status "${title}" menjadi ${stringStatusLabel}?`,
      onConfirm: async () => {
        setAlertConfig(null);
        try {
          const rolePath = isAdminView ? 'admin-lsp' : 'staf-lsp';
          await axios.patch(`${baseUrl}/${rolePath}/pemantauan/${id}/status`, {
            jenis_status: targetJenisStatus,
            status: stringStatusLabel
          }, config);

          setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [keyName]: newStatus } : item));
          showAlert('success', 'Status Diperbarui', `Tahapan ${title} telah diperbarui di sistem.`);
        } catch (error) {
          console.error(error);
          showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menyimpan status.');
        }
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const renderProgressButton = (status, id, keyName, title) => {
    if (typeof status === 'string') {
      if (status !== '') return <span style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{keyName === 'tglPleno' ? formatTgl(status) : status}</span>;
      return (
        <button onClick={() => handleProgressClick(id, keyName, title)} style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap', transition: '0.2s' }}>
          <i className="fas fa-plus"></i> Atur
        </button>
      );
    }
    if (status) return (
      <div style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
        <i className="fas fa-check-circle"></i> Selesai
      </div>
    );
    return (
      <button onClick={() => handleProgressClick(id, keyName, title)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px dashed #fca5a5', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap', transition: '0.2s' }}>
        <i className="fas fa-times-circle"></i> Belum Selesai
      </button>
    );
  };

  const renderAsesor = (name, item) => {
    if (isAdminView && !name) {
      return (
        <button 
          onClick={() => {
             navigate('/admin-lsp/penugasan', { state: { openDetailId: item.idUjk, fromDashboard: true, highlightOnly: true } });
             window.scrollTo(0,0);
          }}
          style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', transition: '0.2s' }}
        >
          <i className="fas fa-user-plus"></i> Plot Asesor
        </button>
      );
    }
    if (name) return <span style={{fontWeight: 600, color: '#0f172a', fontSize: '0.85rem'}}>{name}</span>;
    return (
      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '0.75rem', fontWeight: '600' }}>
        <i className="fas fa-lock" style={{marginRight: '4px'}}></i> Kosong
      </span>
    );
  };

  const renderSurat = (status, item, jenisSurat) => {
    const isFullyPlotted = item.asesor1 && item.penyelia; 
    if (isStaffView || isAdminView) {
      if (!isFullyPlotted) {
        return (
          <button disabled style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.75rem', fontWeight: 'bold', width: '100%' }}>
            <i className="fas fa-lock"></i> Terkunci
          </button>
        );
      }
      return (
        <button 
          onClick={() => {
              if (isAdminView) navigate('/admin-lsp/penugasan', { state: { openDetailId: item.idUjk, fromDashboard: true, highlightOnly: true } });
              if (isStaffView) navigate('/staff-lsp/surat', { state: { openDetailId: item.idUjk, fromDashboard: true, highlightOnly: true } });
              window.scrollTo(0,0);
          }} 
          style={{ background: status ? '#ecfdf5' : '#eff6ff', color: status ? '#10b981' : '#3b82f6', border: status ? '1px solid #10b981' : '1px solid #3b82f6', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap' }}
        >
          <i className={status ? "fas fa-check-circle" : "fas fa-external-link-alt"}></i> {status ? 'Selesai' : 'Kelola'}
        </button>
      );
    }
    if (!isFullyPlotted) return <i className="fas fa-lock" style={{color: '#94a3b8'}}></i>;
    if (status) return <i className="fas fa-check-circle" style={{color: '#10b981'}}></i>;
    return <i className="fas fa-times-circle" style={{color: '#ef4444'}}></i>;
  };

  const filterUI = (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="far fa-calendar-alt" style={{marginRight: '5px'}}></i>Tahun</label>
        <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="far fa-calendar" style={{marginRight: '5px'}}></i>Bulan</label>
        <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Bulan</option>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="fas fa-map-marker-alt" style={{marginRight: '5px'}}></i>Nama TUK</label>
        <select value={filterTuk} onChange={(e) => setFilterTuk(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua TUK</option>
          <option value="UPT BLK Surabaya">UPT BLK Surabaya</option>
          <option value="UPT BLK Singosari">UPT BLK Singosari</option>
          <option value="UPT BLK Kediri">UPT BLK Kediri</option>
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}><i className="fas fa-wallet" style={{marginRight: '5px'}}></i>Pendanaan</label>
        <select value={filterPendanaan} onChange={(e) => setFilterPendanaan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Pendanaan</option>
          <option value="APBD">APBD</option>
          <option value="APBN">APBN</option>
          <option value="Mandiri">Mandiri</option>
        </select>
      </div>
    </div>
  );

  const tableComponent = (
    <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
      
      {isInputModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '400px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', animation: 'zoomIn 0.2s ease-out' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0, fontSize: '1.25rem', color: '#0f172a'}}>Input {inputModalData.title}</h3>
               <button type="button" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsInputModalOpen(false)}>&times;</button>
             </div>
             <div className="modal-body" style={{ padding: '20px' }}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const { id, keyName, value, title } = inputModalData;

                  if (keyName === 'noResi') {
                    try {
                      const rolePath = isAdminView ? 'admin-lsp' : 'staf-lsp';
                      await axios.post(`${baseUrl}/${rolePath}/pemantauan/${id}/resi`, { no_resi: value }, config);
                      
                      setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [keyName]: value } : item));
                      setIsInputModalOpen(false);
                      showAlert('success', 'Berhasil Disimpan', `Nomor Resi berhasil ditambahkan ke sistem.`);
                    } catch (err) {
                      console.error(err);
                      showAlert('error', 'Gagal', err.response?.data?.message || 'Gagal menyimpan Nomor Resi.');
                    }
                  } else {
                    // Update lokal jika selain resi (misal manual tglPleno/noPleno jika tak lewat cetak)
                    setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [keyName]: value } : item));
                    setIsInputModalOpen(false);
                    showAlert('success', 'Berhasil Disimpan', `Data ${title} telah diperbarui di UI.`);
                  }
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{display: 'block', fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '8px'}}>
                      Masukkan {inputModalData.title} <span style={{color:'red'}}>*</span>
                    </label>
                    <input 
                      type={inputModalData.type} 
                      style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'8px', padding: '10px', outline: 'none', fontSize: '0.95rem'}} 
                      value={inputModalData.value} 
                      onChange={(e) => setInputModalData({...inputModalData, value: e.target.value})} 
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" onClick={() => setIsInputModalOpen(false)}>Batal</Button>
                    <Button type="submit" variant="primary" icon="save" style={{backgroundColor: '#2563eb', color: 'white', border: 'none'}}>Simpan Data</Button>
                  </div>
                </form>
             </div>
           </div>
        </div>
      )}

      <div className="table-responsive-wrapper">
        <div className="table-responsive-excel">
          <table className="excel-table">
            <thead>
              <tr>
                <th rowSpan="2" style={{ width: '50px', position: 'sticky', left: 0, zIndex: 2, backgroundColor: '#f1f5f9' }}>No</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Pendanaan</th>
                <th colSpan="2">Pelaksanaan</th>
                <th rowSpan="2" style={{ minWidth: '200px' }}>TUK</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>Bidang</th>
                <th rowSpan="2" style={{ minWidth: '250px' }}>Skema</th>
                <th rowSpan="2" style={{ minWidth: '100px' }}>Jumlah<br/>Asesi</th>
                <th colSpan="2">Keputusan</th>
                <th rowSpan="2" className="col-asesor" style={{ minWidth: '180px' }}>Asesor 1</th>
                <th rowSpan="2" className="col-asesor" style={{ minWidth: '180px' }}>Asesor 2</th>
                <th rowSpan="2" className="col-asesor" style={{ minWidth: '180px' }}>Penyelia</th>
                
                <th rowSpan="2">Surat<br/>Balasan</th>
                <th rowSpan="2">Surat<br/>Permohonan</th>
                <th rowSpan="2">SPT</th>
                <th rowSpan="2">Adminis<br/>trasi</th>
                <th rowSpan="2">Adminis<br/>trasi Pleno</th>

                <th rowSpan="2" style={{ minWidth: '150px' }}>Pelaksanaan</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>Pembayaran</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>Tgl PLENO</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>NO. PLENO</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>DRAFT</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>CETAK</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Di Kirim</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>No Resi</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Di Terima</th>
                <th rowSpan="2" style={{ minWidth: '180px' }}>TT Sertifikat</th>
              </tr>
              <tr>
                <th className="col-date" style={{ minWidth: '120px' }}>Hari 1</th>
                <th className="col-date" style={{ minWidth: '120px' }}>Hari 2</th>
                <th style={{minWidth: '50px'}}>K</th>
                <th style={{minWidth: '50px'}}>BK</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="29" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', color: '#cbd5e1' }}></i>
                    Mengambil Data dari Database...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center" style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1, fontWeight: 'bold' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="text-center"><span className="badge info">{item.pendanaan}</span></td>
                  <td className="text-center">{formatTgl(item.hari1)}</td>
                  <td className="text-center">{formatTgl(item.hari2)}</td>
                  <td>{item.tuk}</td>
                  <td>{item.bidang}</td>
                  <td><strong>{item.skema}</strong></td>
                  
                  <td className="text-center font-bold" style={{ backgroundColor: '#f1f5f9', padding: '10px' }}>
                    <button 
                      onClick={() => {
                         setViewPeserta(item);
                      }}
                      style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', width: '100%', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                    >
                      {item.jumlahAsesi} <i className="fas fa-users"></i>
                    </button>
                  </td>
                  
                  <td className="text-center font-bold text-green-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanK}</td>
                  <td className="text-center font-bold text-red-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanBK}</td>
                  
                  <td className="text-center">{renderAsesor(item.asesor1, item)}</td>
                  <td className="text-center">{renderAsesor(item.asesor2, item)}</td>
                  <td className="text-center">{renderAsesor(item.penyelia, item)}</td>
                  
                  <td className="text-center">{renderSurat(item.suratBalasan, item, 'Surat Balasan')}</td>
                  <td className="text-center">{renderSurat(item.suratPermohonan, item, 'Surat Permohonan')}</td>
                  <td className="text-center">{renderSurat(item.spt, item, 'Surat Tugas')}</td>
                  <td className="text-center">{renderSurat(item.administrasi, item, 'Administrasi')}</td>
                  <td className="text-center">{renderSurat(item.administrasiPleno, item, 'Administrasi Pleno')}</td>

                  <td className="text-center">{renderProgressButton(item.pelaksanaanStatus, item.id, 'pelaksanaanStatus', 'Pelaksanaan')}</td>
                  <td className="text-center">{renderProgressButton(item.pembayaran, item.id, 'pembayaran', 'Pembayaran')}</td>
                  <td className="text-center">{renderProgressButton(item.tglPleno, item.id, 'tglPleno', 'Tanggal Pleno')}</td>
                  <td className="text-center">{renderProgressButton(item.noPleno, item.id, 'noPleno', 'Nomor Pleno')}</td>
                  <td className="text-center">{renderProgressButton(item.draft, item.id, 'draft', 'Draft Blanko')}</td>
                  <td className="text-center">{renderProgressButton(item.cetak, item.id, 'cetak', 'Cetak Blanko')}</td>
                  <td className="text-center">{renderProgressButton(item.dikirim, item.id, 'dikirim', 'Status Kirim BNSP')}</td>
                  <td className="text-center">{renderProgressButton(item.noResi, item.id, 'noResi', 'Input Resi')}</td>
                  <td className="text-center">{renderProgressButton(item.diterima, item.id, 'diterima', 'Blanko Diterima')}</td>
                  <td className="text-center">{renderProgressButton(item.ttSertifikat, item.id, 'ttSertifikat', 'Tanda Terima Sertifikat')}</td>
                </tr>
                ))) : (
                <tr>
                  <td colSpan="29" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-filter" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', color: '#cbd5e1' }}></i>
                    Tidak ada data yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff' }}>
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );

  if (viewPeserta) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setViewPeserta(null)}>Kembali ke Pemantauan</Button>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Nominatif Peserta</h2>
            <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPeserta.skema}</strong></p>
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '25px' }}>
           <TablePeserta 
             dataPeserta={viewPeserta.pesertaRaw || []} 
             detail_id={viewPeserta.detailSkemaId}
             skemaName={viewPeserta.skema} 
             asesorList={asesorList}
             isAdmin={isAdminView} 
             isStaffAsesorActive={false}
             onSave={() => {
                 setViewPeserta(null);
                 loadData();
             }}
           />
        </div>
      </div>
    );
  }

  if (isEmbedded) {
    return (
      <div className="embedded-buku-induk fade-in-content">
        {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />}
        <div className="embedded-header">
          <div>
             <h3 className="embedded-header-title">Pemantauan</h3>
             <p className="text-muted" style={{ margin: 0 }}>
               {isAdminView ? 'Kelola penugasan Asesor dan Penyelia, serta pantau progres UJK.' : 'Klik tombol di dalam tabel untuk membuka menu manajemen dan mencetak dokumen UJK.'}
             </p>
          </div>
        </div>
        {filterUI}
        {tableComponent}
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content">
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={alertConfig.onConfirm} onCancel={alertConfig.onCancel} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Pemantauan Uji Kompetensi</h2>
          <p className="text-muted" style={{ margin: 0 }}>Tabel monitoring progres pelaksanaan, penugasan asesor, dan kelengkapan administrasi.</p>
        </div>
      </div>
      {filterUI}
      {tableComponent}
    </div>
  );
};

export default BukuIndukPage;