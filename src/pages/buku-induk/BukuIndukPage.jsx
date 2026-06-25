import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination'; 
import TablePeserta from '../TablePeserta/TablePeserta';

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
  const [searchTermBukuInduk, setSearchTermBukuInduk] = useState('');

  const [dataPemantauan, setDataPemantauan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewPeserta, setViewPeserta] = useState(null);
  const [asesorList, setAsesorList] = useState([]);

  // State untuk master data filter
  const [masterTuk, setMasterTuk] = useState([]);
  const [masterPendanaan, setMasterPendanaan] = useState([]);

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
          tglPleno: item.tanggal_pleno || '',
          noPleno: item.no_pleno || '',
          cetak: item.status_cetak === 'Selesai',
          dikirim: item.status_dikirim === 'Selesai',
          noResi: item.no_resi || '',
          diterima: item.status_diterima === 'Selesai',
          ttSertifikat: item.status_tt_sertifikat === 'Selesai',
          created_at: item.pengajuan?.created_at || item.created_at || new Date().toISOString()
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

  // Fetch Master Data untuk Filter TUK & Pendanaan
  useEffect(() => {
    const fetchMasterFilters = async () => {
      try {
        const [resTuk, resDana] = await Promise.all([
          axios.get(`${baseUrl}/master/jejaring`, config),
          axios.get(`${baseUrl}/master/sumber-anggaran`, config)
        ]);
        setMasterTuk(resTuk.data.data || resTuk.data || []);
        setMasterPendanaan(resDana.data.data || resDana.data || []);
      } catch (err) {
        console.error("Gagal memuat master data untuk filter:", err);
      }
    };
    fetchMasterFilters();
  }, [baseUrl, config]);

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isInputModalOpen) { setIsInputModalOpen(false); e.preventDefault(); }
      else if (viewPeserta) { setViewPeserta(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isInputModalOpen, viewPeserta]);

  const [readPemantauan, setReadPemantauan] = useState(() => {
    try {
      const stored = localStorage.getItem('read_pemantauan_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleMarkAsRead = (id) => {
    if (!readPemantauan.includes(id)) {
      const newRead = [...readPemantauan, id];
      setReadPemantauan(newRead);
      localStorage.setItem('read_pemantauan_ids', JSON.stringify(newRead));
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTahun, filterBulan, filterTuk, filterPendanaan, searchTermBukuInduk]);

  // Ekstrak hanya Opsi Tahun dari tabel karena Tahun bersifat dinamis
  const filterOptionsTahun = useMemo(() => {
    const tahunSet = new Set();
    dataPemantauan.forEach(item => {
      if (item.hari1) {
        const parts = item.hari1.split('-');
        if (parts.length >= 2) {
          tahunSet.add(parts[0]);
        }
      }
    });
    return [...tahunSet].sort((a, b) => b - a);
  }, [dataPemantauan]);

  const sortedDataPemantauan = useMemo(() => {
    let filtered = [...dataPemantauan];
    if (filterTahun !== 'Semua') filtered = filtered.filter(item => item.hari1 && item.hari1.startsWith(filterTahun));
    if (filterBulan !== 'Semua') filtered = filtered.filter(item => item.hari1 && item.hari1.split('-')[1] === filterBulan);
    if (filterTuk !== 'Semua') filtered = filtered.filter(item => item.tuk === filterTuk);
    if (filterPendanaan !== 'Semua') filtered = filtered.filter(item => item.pendanaan === filterPendanaan);
    if (searchTermBukuInduk.trim() !== '') {
      const q = searchTermBukuInduk.toLowerCase();
      filtered = filtered.filter(item => 
        (item.tuk || '').toLowerCase().includes(q) ||
        (item.bidang || '').toLowerCase().includes(q) ||
        (item.skema || '').toLowerCase().includes(q) ||
        (item.pendanaan || '').toLowerCase().includes(q) ||
        (item.asesor1 || '').toLowerCase().includes(q) ||
        (item.asesor2 || '').toLowerCase().includes(q) ||
        (item.penyelia || '').toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => new Date(b.created_at || b.hari1 || '1970-01-01') - new Date(a.created_at || a.hari1 || '1970-01-01'));
  }, [dataPemantauan, filterTahun, filterBulan, filterTuk, filterPendanaan, searchTermBukuInduk]);

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
    const currentItem = dataPemantauan.find(x => x.id === id);
    const currentStatus = currentItem ? currentItem[keyName] : false;
    const newStatus = !currentStatus;
    const stringStatusLabel = newStatus ? 'Selesai' : 'Belum Selesai';

    if (keyName === 'dikirim' && newStatus) {
      setInputModalData({ id, keyName, title: 'No Resi Pengiriman', value: currentItem?.noResi || '', type: 'text' });
      setIsInputModalOpen(true);
      return;
    }

    if (keyName === 'noResi') {
      setInputModalData({ id, keyName, title: 'Ubah No Resi', value: currentItem?.noResi || '', type: 'text' });
      setIsInputModalOpen(true);
      return;
    }

    const mapJenisStatus = {
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

          setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [keyName]: newStatus, ...(keyName==='dikirim' && !newStatus ? {noResi:''} : {}) } : item));
          showAlert('success', 'Status Diperbarui', `Tahapan ${title} telah diperbarui di sistem.`);
        } catch (error) {
          console.error(error);
          showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menyimpan status.');
        }
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleModalSave = async () => {
    if (!inputModalData.value.trim()) {
      showAlert('error', 'Gagal', `${inputModalData.title} tidak boleh kosong!`);
      return;
    }
    setIsInputModalOpen(false);
    try {
      const rolePath = isAdminView ? 'admin-lsp' : 'staf-lsp';
      let payload = { 
          jenis_status: inputModalData.keyName, 
          status: 'Selesai', 
          no_resi: inputModalData.value 
      };
      await axios.patch(`${baseUrl}/${rolePath}/pemantauan/${inputModalData.id}/status`, payload, config);

      // Update state: dikirim jadi true DAN noResi otomatis terisi
      setDataPemantauan(prev => prev.map(item => item.id === inputModalData.id ? { 
          ...item, 
          noResi: inputModalData.value,
          dikirim: true
      } : item));
      showAlert('success', 'Berhasil', `${inputModalData.title} berhasil disimpan.`);
    } catch (error) {
      console.error(error);
      showAlert('error', 'Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const renderProgressButton = (status, id, keyName, title) => {
    if (typeof status === 'string') {
      if (status !== '') {
        if (keyName === 'noResi') {
          return (
            <span 
              onClick={() => handleProgressClick(id, keyName, title)} 
              style={{ fontWeight: 700, color: '#2563eb', whiteSpace: 'nowrap', cursor: 'pointer', textDecoration: 'underline' }}
              title="Klik untuk mengubah resi"
            >
              {status}
            </span>
          );
        }
        return <span style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{keyName === 'tglPleno' ? formatTgl(status) : status}</span>;
      }

      // Kolom noResi: tampilkan strip jika belum ada resi (otomatis terisi saat klik Di Kirim)
      if (keyName === 'noResi') {
        return <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>;
      }
      
      if (keyName === 'tglPleno' || keyName === 'noPleno') {
        return (
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic', display: 'inline-block', padding: '6px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #e2e8f0', whiteSpace: 'nowrap' }}>
            <i className="fas fa-magic" style={{marginRight: '4px'}}></i> Setting di Dokumen
          </span>
        );
      }

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
      
      {/* SEARCH INPUT */}
      <div style={{ flex: '1 1 100%' }}>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
          <input 
            type="text" 
            placeholder="Pencarian cepat (TUK, Bidang, Skema, Pendanaan, Asesor, atau Penyelia)..." 
            value={searchTermBukuInduk} 
            onChange={(e) => setSearchTermBukuInduk(e.target.value)} 
            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', fontSize: '0.95rem' }} 
          />
        </div>
      </div>
      
      {/* FILTER TAHUN */}
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}>
          <i className="far fa-calendar-alt" style={{marginRight: '5px'}}></i>Tahun
        </label>
        <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Tahun</option>
          {filterOptionsTahun.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* FILTER BULAN */}
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}>
          <i className="far fa-calendar" style={{marginRight: '5px'}}></i>Bulan
        </label>
        <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Bulan</option>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* FILTER TUK */}
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}>
          <i className="fas fa-map-marker-alt" style={{marginRight: '5px'}}></i>Nama TUK
        </label>
        <select value={filterTuk} onChange={(e) => setFilterTuk(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua TUK</option>
          {masterTuk.map((t, idx) => {
            const namaTuk = t.namaInstitusi || t.nama_lembaga || t.nama;
            if(!namaTuk) return null;
            return <option key={idx} value={namaTuk}>{namaTuk}</option>
          })}
        </select>
      </div>

      {/* FILTER PENDANAAN */}
      <div style={{ flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '5px' }}>
          <i className="fas fa-wallet" style={{marginRight: '5px'}}></i>Pendanaan
        </label>
        <select value={filterPendanaan} onChange={(e) => setFilterPendanaan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>
          <option value="Semua">Semua Pendanaan</option>
          {masterPendanaan.map((p, idx) => {
            const namaDana = p.namaAnggaran || p.nama_anggaran || p.nama;
            if(!namaDana) return null;
            return <option key={idx} value={namaDana}>{namaDana}</option>
          })}
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

                  setAlertConfig({
                    type: 'save',
                    title: (keyName === 'noResi' || keyName === 'dikirim') ? 'Konfirmasi Simpan Resi' : `Konfirmasi Simpan ${title}`,
                    text: (keyName === 'noResi' || keyName === 'dikirim') ? 'Apakah no resi sudah sesuai? Jika iya, resi akan disimpan ke sistem.' : `Pastikan data ${title} yang dimasukkan sudah benar. Simpan sekarang?`,
                    onConfirm: async () => {
                      setAlertConfig(null);
                      if (keyName === 'dikirim') {
                        // Klik "Di Kirim": simpan status dikirim + no_resi ke backend sekaligus
                        try {
                          const rolePath = isAdminView ? 'admin-lsp' : 'staf-lsp';
                          await axios.patch(`${baseUrl}/${rolePath}/pemantauan/${id}/status`, {
                            jenis_status: 'dikirim',
                            status: 'Selesai',
                            no_resi: value
                          }, config);
                          // Update state: kolom "Di Kirim" jadi true (Selesai) DAN kolom "No Resi" otomatis terisi
                          setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, dikirim: true, noResi: value } : item));
                          setIsInputModalOpen(false);
                          showAlert('success', 'Berhasil Disimpan', `Status dikirim dan nomor resi berhasil disimpan.`);
                        } catch (err) {
                          console.error(err);
                          showAlert('error', 'Gagal', err.response?.data?.message || 'Gagal menyimpan data.');
                        }
                      } else if (keyName === 'noResi') {
                        // Edit resi: hanya update no_resi di backend, kolom "Di Kirim" tidak berubah
                        try {
                          const rolePath = isAdminView ? 'admin-lsp' : 'staf-lsp';
                          await axios.post(`${baseUrl}/${rolePath}/pemantauan/${id}/resi`, { no_resi: value }, config);
                          setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, noResi: value } : item));
                          setIsInputModalOpen(false);
                          showAlert('success', 'Berhasil Disimpan', `Nomor Resi berhasil diperbarui.`);
                        } catch (err) {
                          console.error(err);
                          showAlert('error', 'Gagal', err.response?.data?.message || 'Gagal menyimpan Nomor Resi.');
                        }
                      } else {
                        setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [keyName]: value } : item));
                        setIsInputModalOpen(false);
                        showAlert('success', 'Berhasil Disimpan', `Data ${title} telah diperbarui di UI.`);
                      }
                    },
                    onCancel: () => setAlertConfig(null)
                  });
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

                <th rowSpan="2" style={{ minWidth: '150px' }}>Tgl PLENO</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>NO. PLENO</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>CETAK</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Di Kirim</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>No Resi</th>
                <th rowSpan="2" style={{ minWidth: '120px' }}>Di Terima</th>
                <th rowSpan="2" style={{ minWidth: '150px' }}>TT Sertifikat</th>
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
                paginatedData.map((item, index) => {
                  const isNew = (new Date() - new Date(item.created_at) < 3600000) && !readPemantauan.includes(item.id);
                  
                  return (
                  <tr key={item.id} onClick={() => handleMarkAsRead(item.id)} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    <td className="text-center" style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1, fontWeight: 'bold' }}>
                      {isNew && <div style={{ position: 'absolute', top: '15px', left: '10px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)' }} title="Pemantauan Baru"></div>}
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
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

                  <td className="text-center">{renderProgressButton(item.tglPleno, item.id, 'tglPleno', 'Tanggal Pleno')}</td>
                  <td className="text-center">{renderProgressButton(item.noPleno, item.id, 'noPleno', 'Nomor Pleno')}</td>
                  {/* Kolom sertifikat: terkunci jika asesor belum diplot */}
                  {(() => {
                    const isPlotted = !!item.asesor1;
                    const lockedCell = (
                      <div title="Asesor belum diplot, kolom ini terkunci" style={{ background: '#f8fafc', color: '#cbd5e1', border: '1px dashed #e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', cursor: 'not-allowed' }}>
                        <i className="fas fa-lock"></i> Terkunci
                      </div>
                    );
                    return (
                      <>
                        <td className="text-center">
                          {isPlotted ? renderProgressButton(item.cetak, item.id, 'cetak', 'Cetak Blanko') : lockedCell}
                        </td>
                        <td className="text-center">
                          {isPlotted ? renderProgressButton(item.dikirim, item.id, 'dikirim', 'Status Kirim BNSP') : lockedCell}
                        </td>
                        <td className="text-center">
                          {isPlotted ? renderProgressButton(item.noResi, item.id, 'noResi', 'Input Resi') : lockedCell}
                        </td>
                        <td className="text-center">
                          {isPlotted ? renderProgressButton(item.diterima, item.id, 'diterima', 'Blanko Diterima') : lockedCell}
                        </td>
                        {/* TT Sertifikat: read-only badge, dikendalikan oleh Admin BLK */}
                        <td className="text-center">
                          {!isPlotted ? lockedCell : item.ttSertifikat ? (
                            <div style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                              <i className="fas fa-check-circle"></i> Selesai
                            </div>
                          ) : (
                            <div style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                              <i className="fas fa-clock"></i> Belum
                            </div>
                          )}
                        </td>
                      </>
                    );
                  })()}
                </tr>
                );
              })
              ) : (
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
        {isInputModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="modal-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
              <h3 style={{ marginTop: 0 }}>{inputModalData.title}</h3>
              <input 
                type={inputModalData.type}
                value={inputModalData.value}
                onChange={(e) => setInputModalData({...inputModalData, value: e.target.value})}
                placeholder="Masukkan Nomor Resi"
                style={{ width: '100%', padding: '10px', margin: '15px 0', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" onClick={() => setIsInputModalOpen(false)}>Batal</Button>
                <Button variant="primary" onClick={handleModalSave}>Simpan</Button>
              </div>
            </div>
          </div>
        )}
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
      {isInputModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h3 style={{ marginTop: 0 }}>{inputModalData.title}</h3>
            <input 
              type={inputModalData.type}
              value={inputModalData.value}
              onChange={(e) => setInputModalData({...inputModalData, value: e.target.value})}
              placeholder="Masukkan Nomor Resi"
              style={{ width: '100%', padding: '10px', margin: '15px 0', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="outline" onClick={() => setIsInputModalOpen(false)}>Batal</Button>
              <Button variant="primary" onClick={handleModalSave}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
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