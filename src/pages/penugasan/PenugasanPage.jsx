import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination';

import './PenugasanPage.css';

const formatTgl = (tgl) => {
  if (!tgl) return '-';
  const parts = tgl.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return tgl;
};

const PenugasanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Konfigurasi Axios Sentral (Inline)
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }), [token]);

  const [antreanSurat, setAntreanSurat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data Modal Asesor & Penyelia dari Backend
  const [masterAsesor, setMasterAsesor] = useState([]);
  const [daftarPenyelia, setDaftarPenyelia] = useState([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const [selectedPenugasan, setSelectedPenugasan] = useState(null); 
  const [editingId, setEditingId] = useState(null); 
  const [editData, setEditData] = useState({});
  const [viewPesertaUjk, setViewPesertaUjk] = useState(null); 
  const [viewPdf, setViewPdf] = useState(null); 

  const [isAsesorModalOpen, setIsAsesorModalOpen] = useState(false);
  const [asesorTargetRole, setAsesorTargetRole] = useState(''); 
  const [filterBidang, setFilterBidang] = useState('');
  const [filterSkema, setFilterSkema] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null); 
  const [targetUjk, setTargetUjk] = useState(null);
  const [activeDocKey, setActiveDocKey] = useState(null);
  const [selectedSubDoc, setSelectedSubDoc] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null); 
  const [activeSubMenuKey, setActiveSubMenuKey] = useState(null);
  
  // STATE BARU: Untuk membedakan mode cetak (TTD atau Biasa)
  const [submitMode, setSubmitMode] = useState('normal'); 

  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '', noSptAsesor: '', noSptPenyelia: '' });
  const [previewDokumen, setPreviewDokumen] = useState(null);

  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertConfig, setAlertConfig] = useState(null);
  
  const [isFromDashboard, setIsFromDashboard] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // List Menu Dokumen
  const listSuratTugas = [ { code: 'SPT.01', name: 'Surat Tugas Asesor', icon: 'fa-user-tie', target: 'asesor' }, { code: 'SPT.02', name: 'Surat Tugas Penyelia', icon: 'fa-user-shield', target: 'penyelia' } ];
  const listSuratPermohonan = [ { code: 'SPM.01', name: 'Permohonan Asesor 1', icon: 'fa-user-tie', target: 'asesor1' }, { code: 'SPM.02', name: 'Permohonan Asesor 2', icon: 'fa-user-tie', target: 'asesor2' }, { code: 'SPM.03', name: 'Permohonan Penyelia', icon: 'fa-user-shield', target: 'penyelia' } ];
  const listAdministrasi = [ { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' } ];
  const listAdministrasiPleno = [ { code: 'PLN.01', name: 'SK Pleno', icon: 'fa-certificate' }, { code: 'PLN.02', name: 'BA Pleno', icon: 'fa-file-signature' }, { code: 'PLN.03', name: 'Hasil Sidang Pleno', icon: 'fa-users' }, { code: 'PLN.04', name: 'SK Penetapan Hasil', icon: 'fa-file-contract' }, { code: 'PLN.05', name: 'Hasil Final', icon: 'fa-check-double' } ];

  const docsWithForm = ['SPT.01', 'SPT.02', 'SPM.01', 'SPM.02', 'SPM.03', 'balasan', 'DOC.02', 'DOC.06', 'DOC.07', 'DOC.08', 'DOC.10', 'DOC.11', 'DOC.13', 'PLN.01', 'PLN.04'];

  // ARRAY DOKUMEN YANG MENDUKUNG TTD (Berdasarkan api.php)
  const docsWithTtd = ['balasan', 'SPT.01', 'SPT.02', 'SPM.01', 'SPM.02'];

  // --- MENGAMBIL DATA PENGAJUAN DARI BACKEND ---
  const fetchPengajuan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/admin-lsp/semua-pengajuan`, config);
      const rawData = res.data.data || [];

      // Grouping data berdasarkan ID Pengajuan Induk
      const grouped = {};
      rawData.forEach(item => {
        if (item.status_pengajuan === 'Dibatalkan') return;

        const validPengajuanId = item.pengajuan_ujk_id || item.pengajuan?.id || item.pengajuan_id;

        const ujkId = item.pengajuan?.nomor_surat_pengajuan || `UJK-${validPengajuanId}`;
        if (!grouped[ujkId]) {
          grouped[ujkId] = {
            idUjk: ujkId,
            pengajuan_id: validPengajuanId, 
            pengusul: item.pengajuan?.admin_blk?.instansi?.nama_institusi || item.pengajuan?.adminBlk?.instansi?.nama_institusi || 'Instansi BLK',
            pendanaan: item.pengajuan?.sumber_anggaran?.namaAnggaran || 'Mandiri',
            skemaList: []
          };
        }

        const jadwal = item.jadwal_asesmen || item.jadwalAsesmen;
        const penugasan = jadwal?.penugasan_asesor || jadwal?.penugasanAsesor || [];
        const isPlotted = !!jadwal;

        grouped[ujkId].skemaList.push({
          idSkema: item.id,
          skema_id_db: item.skema_id, 
          judul: item.skema?.namaSkema,
          bidang: item.skema?.bidang?.namaBidang || item.bidang?.namaBidang,
          jenis: item.skema?.jenisSkema || 'Klaster',
          asesi: item.jumlah_peserta || item.peserta_pengajuan_ujk?.length || 0,
          hari1: jadwal?.tanggal_mulai_asesmen || '',
          hari2: jadwal?.tanggal_selesai_asesmen || '',
          tuk: item.tuk?.namaInstitusi || item.tuk?.nama_lembaga || '',
          tuk_id: item.jejaring_id,
          waktu: '08.00 WIB s/d selesai',
          asesor1: penugasan[0]?.asesor?.user?.namaLengkap || penugasan[0]?.asesor?.nama || '',
          noReg1: penugasan[0]?.asesor?.noRegistrasi || '',
          asesor1_id: penugasan[0]?.asesor_id || null,
          asesor2: penugasan[1]?.asesor?.user?.namaLengkap || penugasan[1]?.asesor?.nama || '',
          noReg2: penugasan[1]?.asesor?.noRegistrasi || '',
          asesor2_id: penugasan[1]?.asesor_id || null,
          penyelia: jadwal?.penyilia?.namaPenyilia || '',
          penyelia_id: jadwal?.penyilia_id || null,
          isPlotted: isPlotted,
          status: isPlotted ? 'Selesai Diplot' : 'Sedang Diproses',
          statusSurat: {
            balasan: !!validPengajuanId,
            permohonan: isPlotted,
            tugas: isPlotted,
            administrasi: [],
            administrasiPleno: []
          },
          savedForms: {},
          peserta: item.peserta_pengajuan_ujk || item.pesertaPengajuanUjk || []
        });
      });
      setAntreanSurat(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching pengajuan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  useEffect(() => {
    if (selectedPenugasan) {
      const exists = antreanSurat.some(item => item.idUjk === selectedPenugasan.idUjk);
      if (!exists) setSelectedPenugasan(null);
    }
  }, [antreanSurat, selectedPenugasan]);

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isAsesorModalOpen) { setIsAsesorModalOpen(false); e.preventDefault(); }
      else if (isFormOpen) { setIsFormOpen(false); e.preventDefault(); }
      else if (viewPdf) { setViewPdf(null); e.preventDefault(); }
      else if (viewPesertaUjk) { setViewPesertaUjk(null); e.preventDefault(); }
      else if (previewDokumen) { setPreviewDokumen(null); URL.revokeObjectURL(previewDokumen.fileUrl); e.preventDefault(); }
      else if (activeSubMenu) { setActiveSubMenu(null); setActiveSubMenuKey(null); setSelectedSubDoc(null); e.preventDefault(); }
      else if (selectedPenugasan) { setSelectedPenugasan(null); setEditingId(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isAsesorModalOpen, isFormOpen, viewPdf, viewPesertaUjk, previewDokumen, selectedPenugasan, activeSubMenu]);

  useEffect(() => {
    if (location.state?.openDetailId && antreanSurat.length > 0) {
      setSearchTerm('');
      setFilterStatus('Semua');
      setHighlightedId(location.state.openDetailId);
      setCurrentPage(1); 
      if (location.state.fromDashboard) setIsFromDashboard(true);

      const foundItem = antreanSurat.find(a => a.idUjk === location.state.openDetailId);
      if (foundItem) {
        if (location.state.openAsesi && location.state.skemaName) {
          const foundSkema = foundItem.skemaList.find(s => s.judul === location.state.skemaName);
          if (foundSkema) setViewPesertaUjk(foundSkema);
        } else if (!location.state.highlightOnly) {
          setSelectedPenugasan(foundItem);
          setEditingId(null);
        }
      }
      window.history.replaceState(null, '');
    }
  }, [location.state, antreanSurat]);

  const filteredUsulan = antreanSurat.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = item.idUjk.toLowerCase().includes(term) || item.pengusul.toLowerCase().includes(term) || item.skemaList.some(s => s.judul.toLowerCase().includes(term));
    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
    const statusSuratGlobal = isSemuaDiplot ? 'Selesai Diplot' : 'Sedang Diproses';
    const matchStatus = filterStatus === 'Semua' || statusSuratGlobal === filterStatus;
    return matchSearch && matchStatus;
  });

  const sortedUsulan = useMemo(() => {
    let result = [...filteredUsulan].sort((a, b) => {
      const aDate = new Date(a.skemaList[0]?.hari1 || '1970-01-01');
      const bDate = new Date(b.skemaList[0]?.hari1 || '1970-01-01');
      return bDate - aDate;
    });

    if (highlightedId) {
      const targetIndex = result.findIndex(a => a.idUjk === highlightedId);
      if (targetIndex > -1) {
        const targetItem = result.splice(targetIndex, 1)[0];
        result.unshift(targetItem);
      }
    }
    return result;
  }, [filteredUsulan, highlightedId]);

  const totalPages = Math.ceil(sortedUsulan.length / itemsPerPage) || 1;
  const paginatedUsulan = sortedUsulan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, onConfirm: () => { if(action) action(); setAlertConfig(null); }, onCancel: () => setAlertConfig(null) });
  };
  const handleConfirmAlert = () => { if (alertConfig?.onConfirm) alertConfig.onConfirm(); else setAlertConfig(null); };
  const handleCancelAlert = () => { if (alertConfig?.onCancel) alertConfig.onCancel(); else setAlertConfig(null); };

  const handleOpenAsesorModal = async (role, bidangUjk, skemaUjk, idSkemaDb) => { 
    setAsesorTargetRole(role); 
    setFilterBidang(bidangUjk || ''); 
    setFilterSkema(skemaUjk || ''); 
    setIsAsesorModalOpen(true); 
    setIsLoadingModal(true);

    try {
      if (role === 'penyelia') {
        const res = await axios.get(`${baseUrl}/master/penyelia`, config);
        setDaftarPenyelia(res.data.data?.filter(p => p.status === 'Aktif') || []);
      } else {
        const tglMulai = editData.hari1 || '';
        const tglSelesai = editData.hari2 || '';
        const endpoint = `${baseUrl}/admin-lsp/asesor-by-skema/${idSkemaDb}?tanggal_mulai=${tglMulai}&tanggal_selesai=${tglSelesai}`;
        const res = await axios.get(endpoint, config);
        setMasterAsesor(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching asesor/penyelia', error);
      if(role !== 'penyelia') setMasterAsesor([]);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handlePilihAsesor = (person) => {
    if (asesorTargetRole === 'penyelia') {
      setEditData(prev => ({ ...prev, penyelia: person.namaPenyilia, penyelia_id: person.id }));
      setIsAsesorModalOpen(false);
      return;
    }
    
    if (!person || !person.id) {
      setEditData(prev => ({ ...prev, [asesorTargetRole]: '', [`noReg${asesorTargetRole === 'asesor1' ? '1' : '2'}`]: '', [`${asesorTargetRole}_id`]: null }));
      setIsAsesorModalOpen(false);
      return;
    }
    if (person.is_available === false) { 
      showAlert('warning', 'Akses Ditolak', 'Asesor sedang bertugas di rentang tanggal tersebut!'); 
      return; 
    }

    const namaLengkap = person.user?.namaLengkap || person.nama;
    setEditData(prev => ({ 
      ...prev, 
      [asesorTargetRole]: namaLengkap, 
      [`noReg${asesorTargetRole === 'asesor1' ? '1' : '2'}`]: person.noRegistrasi,
      [`${asesorTargetRole}_id`]: person.id 
    }));
    setIsAsesorModalOpen(false);
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoToPeserta = (skema) => {
    setViewPesertaUjk(skema);
  };

  const handleMulaiPlotting = (skema) => { setEditingId(skema.idSkema); setEditData({ ...skema }); };
  const handleBatalEdit = () => setEditingId(null);

  const handleSimpanPlotting = () => {
    if (!editData.asesor1_id || !editData.penyelia_id || !editData.hari1 || !editData.hari2 || !editData.tuk) { 
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan Lokasi TUK, Tanggal Ujian, Asesor 1, dan Penyelia telah terisi.'); return; 
    }
    showAlert('save', 'Simpan Plotting', 'Apakah Anda yakin ingin menetapkan jadwal dan tim asesor ini?', async () => {
      try {
        const payload = {
          penyelia_id: editData.penyelia_id,
          tanggal_mulai_asesmen: editData.hari1,
          tanggal_selesai_asesmen: editData.hari2,
          asesor_ids: [editData.asesor1_id, editData.asesor2_id].filter(Boolean)
        };
        await axios.post(`${baseUrl}/admin-lsp/ploting-jadwal/${editingId}`, payload, config);
        
        showAlert('success', 'Plotting Berhasil', 'Jadwal dan Asesor telah ditetapkan di sistem!');
        setEditingId(null); 
        fetchPengajuan(); 
      } catch (error) {
        showAlert('error', 'Gagal Plotting', error.response?.data?.message || 'Terjadi kesalahan sistem');
      }
    });
  };

  const handleTolakSkema = (idSkema) => {
    setAlertConfig({
       type: 'delete', title: 'Batalkan Pengajuan?', text: 'Apakah Anda yakin membatalkan pengajuan untuk skema ini?',
       onConfirm: async () => {
         try {
           await axios.put(`${baseUrl}/admin-lsp/${idSkema}/batalkan-pengajuan`, {}, config);
           showAlert('success', 'Berhasil', 'Skema telah dibatalkan.');
           fetchPengajuan(); 
         } catch (error) {
           showAlert('error', 'Gagal Membatalkan', error.response?.data?.message || 'Terjadi kesalahan sistem');
         }
       }
    });
  };

  const handleDocClick = (jenisSurat, suratItem, skemaItem, docKey) => {
    if (!suratItem || !suratItem.pengajuan_id) {
       showAlert('error', 'Kesalahan Data', 'ID Pengajuan tidak ditemukan pada baris ini.');
       return;
    }

    if (!skemaItem?.isPlotted && jenisSurat !== 'Surat Balasan') { showAlert('warning', 'Terkunci', 'Lengkapi Plotting Jadwal & Asesor terlebih dahulu.'); return; }
    
    if (jenisSurat === 'Asesi') {
       handleGoToPeserta(skemaItem);
       return;
    }

    const normalizedSkema = skemaItem ? { ...skemaItem, skema: skemaItem.judul, hari1: skemaItem.hari1 || 'Belum Diatur', hari2: skemaItem.hari2 || 'Belum Diatur', waktu: skemaItem.waktu || '08.00 WIB s/d Selesai' } : null;

    if (['Administrasi', 'Administrasi Pleno', 'Surat Tugas', 'Surat Permohonan'].includes(jenisSurat)) {
      setTargetUjk({ surat: suratItem, skema: normalizedSkema }); 
      setActiveSubMenu(jenisSurat);
      setActiveSubMenuKey(docKey);
    } else {
      setTargetUjk({ surat: suratItem, skema: normalizedSkema || suratItem.skemaList[0] }); 
      setFormType(jenisSurat);
      setActiveDocKey('balasan');
      setSelectedSubDoc({ name: 'Surat Balasan', target: 'semua', code: 'balasan' });
      
      const formSaved = normalizedSkema?.savedForms?.balasan;
      if (formSaved) setFormData(formSaved);
      else setFormData({ noSurat: '000.140A/LSP BLK-SBY/V/2026', tanggalSurat: '2026-05-17', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '', noSptAsesor: '', noSptPenyelia: '' });
      setIsFormOpen(true);
    }
  };

  const handleSubMenuClick = (doc) => {
    setFormType(activeSubMenu);
    setActiveDocKey(doc.code);
    setSelectedSubDoc(doc);
    
    const defaultNoDokumen = activeSubMenu === 'Surat Tugas' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR-SER-01.2-LSP BLK-SBY';
    const initialForm = targetUjk?.skema?.savedForms?.[doc.code] || { 
      noSurat: `000.140/${doc.code}/LSP BLK-SBY/V/2026`, 
      tanggalSurat: '2026-05-17', 
      noDokumen: defaultNoDokumen, 
      edisiRevisi: '01/00', 
      tanggalBerlaku: '2015-11-10', 
      halaman: '1 dari 1',
      tanggalVerif: '2026-05-17',
      noSptAsesor: '000.140D/LSP BLK-SBY/V/2026',
      noSptPenyelia: '000.140E/LSP BLK-SBY/V/2026'
    };
    
    setFormData(initialForm);

    if (!docsWithForm.includes(doc.code)) {
       // Dokumen instan tanpa form, secara otomatis pakai mode normal (non-ttd)
       handleAutoGenerateSurat(doc.code, doc, initialForm, activeSubMenu, false);
    } else {
       setIsFormOpen(true);
    }
  };

  // KUNCI PERBAIKAN 2: Penambahan param `isTtd` untuk mapping endpoint yang sesuai
  const mapPdfEndpoint = (docKey, skemaId, pengajuanId, isTtd = false) => {
    const ttdSuffix = isTtd ? '-ttd' : '';
    
    const map = {
      'balasan': `/admin-lsp/cetak-surat-balasan${ttdSuffix}/${pengajuanId}`,
      'SPT.01': `/admin-lsp/cetak-surat-spt-asesor${ttdSuffix}/${skemaId}`,
      'SPT.02': `/admin-lsp/cetak-surat-spt-penyilia${ttdSuffix}/${skemaId}`,
      'SPM.01': `/admin-lsp/cetak-surat-permohonan-asesor1${ttdSuffix}/${skemaId}`,
      'SPM.02': `/admin-lsp/cetak-surat-permohonan-asesor2${ttdSuffix}/${skemaId}`,
      // Catatan: SPM.03 (Permohonan Penyelia) tidak ada route TTD di backend
      'SPM.03': `/admin-lsp/cetak-surat-permohonan-penyilia/${skemaId}`, 
      'DOC.01': `/admin-lsp/cetak-surat-laporan-penyilia/${skemaId}`,
      'DOC.02': `/admin-lsp/cetak-surat-berita-acara/${skemaId}`,
      'DOC.03': `/admin-lsp/cetak-surat-penetapan-TUK/${skemaId}`,
      'DOC.04': `/admin-lsp/cetak-surat-SK-penyelanggara/${skemaId}`,
      'DOC.05': `/admin-lsp/cetak-surat-lampiran-SK/${skemaId}`,
      'DOC.06': `/admin-lsp/cetak-surat-daftar-hadir-pra-asesmen/${skemaId}`,
      'DOC.07': `/admin-lsp/cetak-surat-daftar-hadir-asesmen-h1/${skemaId}`,
      'DOC.08': `/admin-lsp/cetak-surat-daftar-hadir-asesmen-h2/${skemaId}`,
      'DOC.09': `/admin-lsp/cetak-surat-tanda-terima-dokumen/${skemaId}`,
      'DOC.10': `/admin-lsp/cetak-surat-pernyataan-asesor-1/${skemaId}`,
      'DOC.11': `/admin-lsp/cetak-surat-pernyataan-asesor-2/${skemaId}`,
      'DOC.12': `/admin-lsp/cetak-surat-pengembalian-dokumen/${skemaId}`,
      'DOC.13': `/admin-lsp/cetak-surat-rencana-verif-TUK/${skemaId}`,
      'PLN.01': `/admin-lsp/cetak-surat-sk-pleno/${skemaId}`,
      'PLN.02': `/admin-lsp/cetak-surat-berita-acara-pleno/${skemaId}`,
      'PLN.03': `/admin-lsp/cetak-surat-hasil-sidang-pleno/${skemaId}`,
      'PLN.04': `/admin-lsp/cetak-surat-sk-penetapan-hasil/${skemaId}`,
      'PLN.05': `/admin-lsp/cetak-surat-hasil-final-pleno/${skemaId}`,
    };
    return map[docKey];
  };

  const handleAutoGenerateSurat = async (docKey, subDoc, formToSave, currentMenu, isTtd = false) => {
    setAlertConfig({ type: 'info', title: 'Menarik Dokumen PDF...', text: `Sistem sedang men-generate dokumen ${isTtd ? 'dengan Tanda Tangan' : 'Biasa'}...` });
    
    try {
      if (!targetUjk || !targetUjk.surat) {
         throw new Error("Data UJK tidak terpilih. Silakan pilih kembali UJK dari daftar.");
      }

      const skemaId = targetUjk.skema?.idSkema;
      const pengajuanId = targetUjk.surat?.pengajuan_id; 
      const endpointId = docKey === 'balasan' ? pengajuanId : skemaId; 

      if (!endpointId) {
          throw new Error(`Gagal mendapatkan ID (Skema: ${skemaId}, Pengajuan: ${pengajuanId}). Data mungkin tidak sinkron.`);
      }

      // Mempassing status isTtd ke fungsi mapping
      const endpoint = mapPdfEndpoint(docKey, skemaId, pengajuanId, isTtd);
      if(!endpoint) throw new Error("Endpoint surat tidak ditemukan");

      const queryParams = new URLSearchParams({
        nomor_surat: formToSave.noSurat || '',
        tanggal_surat: formToSave.tanggalSurat || '',
        nomor_spt_asesor: formToSave.noSptAsesor || '',
        nomor_spt_penyilia: formToSave.noSptPenyelia || '',
        tanggal_rencana_verif_tuk: formToSave.tanggalVerif || ''
      }).toString();

      const res = await axios.get(`${baseUrl}${endpoint}?${queryParams}`, {
        ...config,
        responseType: 'blob' 
      });

      const pdfUrl = URL.createObjectURL(res.data);

      setTargetUjk(prev => ({
         ...prev, 
         skema: { ...prev.skema, savedForms: { ...(prev.skema.savedForms || {}), [docKey]: formToSave } }
      }));

      setPreviewDokumen({ 
        jenis: currentMenu, 
        fileUrl: pdfUrl,
        docKey: docKey, 
        dataUjk: targetUjk.skema, 
        ujkId: targetUjk.surat.idUjk, 
        skemaId: targetUjk.skema.idSkema, 
        subDoc: subDoc,
        isTtd: isTtd // Penanda bahwa yang di-preview adalah versi TTD
      });

      setAlertConfig(null);
    } catch (error) {
      console.error(error);
      let errorMessage = 'Terjadi kesalahan sistem saat menghubungi backend.';

      if (error.response) {
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text();
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch (e) {
            errorMessage = `Akses Ditolak Server (Status: ${error.response.status}).`;
          }
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      showAlert('error', 'Gagal Render Dokumen', errorMessage);
    }
  };

  const handleGenerateSurat = async (e) => {
    e.preventDefault(); 
    setIsFormOpen(false);
    const isTtd = submitMode === 'ttd';
    handleAutoGenerateSurat(activeDocKey, selectedSubDoc, formData, formType, isTtd);
  };

  const markDocAsDone = (idUjk, idSkema, docTypeKey, docCode) => {
    setAntreanSurat(prev => prev.map(surat => {
      if (surat.idUjk === idUjk) {
        return {
          ...surat,
          skemaList: surat.skemaList.map(s => {
            if (s.idSkema === idSkema) {
              const currentStatus = s.statusSurat || {};
              if (['administrasi', 'administrasiPleno'].includes(docTypeKey)) {
                 const currentArr = Array.isArray(currentStatus[docTypeKey]) ? currentStatus[docTypeKey] : [];
                 if (!currentArr.includes(docCode)) {
                   return { ...s, statusSurat: { ...currentStatus, [docTypeKey]: [...currentArr, docCode] } };
                 }
                 return s;
              } else {
                 return { ...s, statusSurat: { ...currentStatus, [docTypeKey]: true } };
              }
            }
            return s;
          })
        };
      }
      return surat;
    }));
  };

  const checkIsPrintedSafe = (skema, menuKey, docCode) => {
    const statusVal = skema?.statusSurat?.[menuKey];
    if (Array.isArray(statusVal)) return statusVal.includes(docCode);
    return !!statusVal; 
  };

  const getDocButtonStyle = (isPlotted, isDone) => {
    if (!isPlotted) return { background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8', cursor: 'not-allowed' };
    if (isDone) return { background: '#f0fdf4', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', opacity: 1 };
    return { background: '#ffffff', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', opacity: 1 };
  };

  const getDocIconInfo = (isPlotted, isDone) => {
    if (!isPlotted) return { class: 'fa-lock', bg: '#f1f5f9', color: '#94a3b8' };
    if (isDone) return { class: 'fa-redo', bg: '#e6fbf0', color: '#10b981' }; 
    return { class: 'fa-times', bg: '#eff6ff', color: '#3b82f6' };
  };

  const docCodeActive = selectedSubDoc?.code || activeDocKey;
  const isKelompokDH = ['DOC.06', 'DOC.07', 'DOC.08'].includes(docCodeActive);
  const isVerifTuk = docCodeActive === 'DOC.13';
  const isOnlyTanggal = ['DOC.02', 'DOC.10', 'DOC.11'].includes(docCodeActive);
  const isSuratForm = ['SPT.01', 'SPT.02', 'SPM.01', 'SPM.02', 'SPM.03', 'balasan', 'PLN.01', 'PLN.04'].includes(docCodeActive);

  const showNoSurat = isVerifTuk || isSuratForm;
  const showTanggalSurat = isVerifTuk || isOnlyTanggal || isSuratForm;
  const showSptFields = isKelompokDH;
  const showTglVerif = isVerifTuk;
  const isAlreadyGenerated = Boolean(targetUjk?.skema?.savedForms?.[docCodeActive || 'balasan']);
  const isLandscapeDoc = ['PLN.03', 'DOC.06', 'DOC.07', 'DOC.08'].includes(previewDokumen?.subDoc?.code || previewDokumen?.docKey);

  return (
    <div className="dashboard-content fade-in-content" style={{ backgroundColor: '#f4f7fb', padding: '20px', minHeight: '100vh', position: 'relative' }}>
      
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />}
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
          <i className="fas fa-spinner fa-spin fa-3x" style={{ marginBottom: '15px' }}></i>
          <h3>Memuat Data Penugasan...</h3>
        </div>
      ) : viewPesertaUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setViewPesertaUjk(null)}>Kembali</Button>
            <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Nominatif & Keputusan Asesi</h2><p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPesertaUjk.judul}</strong></p></div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}>
            <TablePeserta dataPeserta={viewPesertaUjk.peserta || []} detail_id={viewPesertaUjk.idSkema} skemaName={viewPesertaUjk.judul} asesor1={viewPesertaUjk.asesor1} asesor2={viewPesertaUjk.asesor2} isAdmin={true} onSave={() => setViewPesertaUjk(null)} />
          </div>
        </div>

      ) : previewDokumen ? (
          <div className="print-preview-container fade-in-content" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>
                  Pratinjau {previewDokumen.subDoc?.name || previewDokumen.jenis} 
                  {previewDokumen.isTtd && <span style={{fontSize:'0.75rem', padding:'2px 8px', borderRadius:'10px', background:'#d1fae5', color:'#065f46', marginLeft:'8px'}}>+ TTD</span>}
                  {isLandscapeDoc && <span style={{fontSize:'0.75rem', padding:'2px 8px', borderRadius:'10px', background:'#fef3c7', color:'#d97706', marginLeft:'8px'}}>Landscape Mode</span>}
                </h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Dokumen dirender dari API Laravel DomPDF.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { setPreviewDokumen(null); URL.revokeObjectURL(previewDokumen.fileUrl); }}>Kembali</Button>
                <a href={previewDokumen.fileUrl} download={`Dokumen_${previewDokumen.docKey}${previewDokumen.isTtd ? '_TTD' : ''}.pdf`} style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }} onClick={() => { if (previewDokumen?.docKey) { const docTypeKey = activeSubMenuKey || previewDokumen.docKey; markDocAsDone(previewDokumen.ujkId, previewDokumen.skemaId, docTypeKey, previewDokumen.docKey); } showAlert('success', 'Berhasil Diunduh!', 'Dokumen PDF berhasil diunduh.'); }}><i className="fas fa-download"></i> Unduh PDF</a>
              </div>
            </div>
            
            <div style={{ width: '100%', height: isLandscapeDoc ? '65vh' : '85vh', maxWidth: isLandscapeDoc ? '100%' : '800px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              <iframe src={previewDokumen.fileUrl} width="100%" height="100%" style={{ border: 'none' }} title="Preview Dokumen" />
            </div>
          </div>

      ) : activeSubMenu && !isFormOpen ? (
          <div className="fade-in-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => { setActiveSubMenu(null); setActiveSubMenuKey(null); setSelectedSubDoc(null); }}>Kembali</Button>
              <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Pilih Dokumen {activeSubMenu}</h2></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', width: '100%' }}>
              {(activeSubMenu === 'Surat Tugas' ? listSuratTugas : activeSubMenu === 'Surat Permohonan' ? listSuratPermohonan : activeSubMenu === 'Administrasi Pleno' ? listAdministrasiPleno : listAdministrasi).map(doc => {
                const activeSurat = antreanSurat.find(s => s.idUjk === targetUjk?.surat?.idUjk);
                const activeSkema = activeSurat?.skemaList.find(s => s.idSkema === targetUjk?.skema?.idSkema);
                const isPrinted = checkIsPrintedSafe(activeSkema, activeSubMenuKey, doc.code);
                
                return (
                  <button key={doc.code} type="button" onClick={() => handleSubMenuClick(doc)} style={{ background: '#fff', border: isPrinted ? '1px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isPrinted ? '0 4px 6px rgba(16, 185, 129, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)', outline: 'none', width: '100%' }}>
                    <div style={{ background: isPrinted ? '#e6fbf0' : '#eff6ff', color: isPrinted ? '#10b981' : '#2563eb', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', transition: 'all 0.2s ease' }}><i className={isPrinted ? "fas fa-redo" : `fas ${doc.icon}`}></i></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', marginBottom: '4px' }}>{doc.code}</div><div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>{doc.name}</div></div>
                  </button>
                );
              })}
            </div>
          </div>

      ) : selectedPenugasan ? (
        (() => {
          const activeSurat = antreanSurat.find(item => item.idUjk === selectedPenugasan.idUjk);
          if (!activeSurat) return null;

          return (
            <div className="fade-in-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { if (isFromDashboard) { navigate(-1); } else { setSelectedPenugasan(null); setEditingId(null); }}}>Kembali</Button>
                <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Manajemen Penugasan UJK</h2><p className="text-muted" style={{ margin: 0 }}>{activeSurat.idUjk} - {activeSurat.pengusul}</p></div>
              </div>

              {activeSurat.skemaList.map((skema) => {
                const isEditing = editingId === skema.idSkema;
                const isFullyPlotted = skema.isPlotted; 

                return (
                  <div key={skema.idSkema} className="dashboard-card" style={{ backgroundColor: '#fff', border: isEditing ? '2px solid #3b82f6' : '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ backgroundColor: '#1e293b', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{activeSurat.idUjk}</span><span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' }}>{activeSurat.pendanaan}</span></div>
                      <div style={{ textAlign: 'right' }}>{!isFullyPlotted ? <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-exclamation-triangle"></i> Belum Di-plot</span> : !isEditing && <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-check-circle"></i> Selesai Di-plot</span>}</div>
                    </div>

                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>{skema.judul}</h4>
                    <p className="text-muted" style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>{skema.bidang || skema.kejuruan} | {skema.jenis}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-building"></i></div>
                          <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Instansi Pengusul</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{activeSurat.pengusul}</div></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-map-marker-alt"></i></div>
                          <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Lokasi Ujian (TUK)</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}>{skema.tuk}</div></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fdf4ff', color: '#a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="far fa-calendar-alt"></i></div>
                          <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Tanggal Pelaksanaan</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{!isEditing ? (skema.hari1 ? `${formatTgl(skema.hari1)} s/d ${formatTgl(skema.hari2)}` : 'Tanggal Belum Diatur') : <span style={{color: '#f59e0b', fontStyle: 'italic'}}>Sedang Mengubah Tanggal...</span>}</div></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-users"></i></div>
                          <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Total Asesi</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>{skema.asesi} Orang</div></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      <div>
                        {isEditing ? (
                          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '800' }}><i className="fas fa-map-marker-alt"></i> Lokasi & Tanggal Pelaksanaan</h5>
                            <div style={{ marginBottom: '15px' }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Lokasi Ujian (TUK)</label><input type="text" disabled value={editData.tuk || ''} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', backgroundColor: '#e2e8f0', color: '#64748b' }} /></div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                              <div style={{ flex: 1 }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Mulai Asesmen</label><input type="date" name="hari1" value={editData.hari1 || ''} onChange={handleEditChange} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} /></div>
                              <div style={{ flex: 1 }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Selesai Asesmen</label><input type="date" name="hari2" value={editData.hari2 || ''} onChange={handleEditChange} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} /></div>
                            </div>
                            
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '800' }}><i className="fas fa-users-cog"></i> Plotting Tim</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Asesor 1</label><Button variant="outline" icon="user-tie" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('asesor1', editData.bidang || editData.kejuruan, editData.judul, skema.skema_id_db); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.asesor1 || 'Pilih Asesor 1...'}</Button></div>
                              <div><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Asesor 2</label><Button variant="outline" icon="user-tie" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('asesor2', editData.bidang || editData.kejuruan, editData.judul, skema.skema_id_db); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.asesor2 || 'Pilih Asesor 2...'}</Button></div>
                              <div><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Penyelia LSP</label><Button variant="outline" icon="user-shield" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('penyelia'); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.penyelia || 'Pilih Penyelia...'}</Button></div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                              <Button variant="outline" icon="times" style={{flex: 1}} onClick={handleBatalEdit}>Batal</Button>
                              <Button variant="primary" icon="save" style={{flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none'}} onClick={handleSimpanPlotting}>Simpan Plotting</Button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', border: skema.asesor1 ? '1px solid #93c5fd' : '1px dashed #cbd5e1', background: skema.asesor1 ? '#fff' : '#f8fafc' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><i className="fas fa-user-tie"></i></div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>ASESOR 1</span><span style={{ fontSize: '0.85rem', fontWeight: '700', color: skema.asesor1 ? '#0f172a' : '#94a3b8' }}>{skema.asesor1 || 'Belum di-plot'}</span></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', border: skema.asesor2 ? '1px solid #93c5fd' : '1px dashed #cbd5e1', background: skema.asesor2 ? '#fff' : '#f8fafc' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><i className="fas fa-user-tie"></i></div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>ASESOR 2</span><span style={{ fontSize: '0.85rem', fontWeight: '700', color: skema.asesor2 ? '#0f172a' : '#94a3b8' }}>{skema.asesor2 || 'Belum di-plot'}</span></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', border: skema.penyelia ? '1px solid #93c5fd' : '1px dashed #cbd5e1', background: skema.penyelia ? '#fff' : '#f8fafc' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><i className="fas fa-user-shield"></i></div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>PENYELIA LSP</span><span style={{ fontSize: '0.85rem', fontWeight: '700', color: skema.penyelia ? '#0f172a' : '#94a3b8' }}>{skema.penyelia || 'Belum di-plot'}</span></div>
                            </div>
                            
                            {!isEditing && !skema.isPlotted && (
                               <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                  <Button variant="primary" icon="user-plus" isFullWidth style={{backgroundColor: '#2563eb', color: '#fff', border: 'none'}} onClick={() => handleMulaiPlotting(skema)}>Mulai Plotting</Button>
                                  <button onClick={() => handleTolakSkema(skema.idSkema)} style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}><i className="fas fa-times-circle"></i> Tolak</button>
                               </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {!isEditing && (
                          <>
                            {[
                              { id: 'asesi', title: '1. Pembagian Asesi & Hasil Uji', status: true, key: 'asesi', type: 'Asesi' }, 
                              { id: 'tugas', title: '2. Surat Tugas', status: skema.statusSurat?.tugas, key: 'spt', type: 'Sur Tugas' },
                              { id: 'permohonan', title: '3. Srt. Permohonan', status: skema.statusSurat?.permohonan, key: 'permohonan', type: 'Surat Permohonan' },
                              { id: 'administrasi', title: '4. Administrasi', status: skema.statusSurat?.administrasi?.length === 13, key: 'administrasi', type: 'Administrasi' },
                              { id: 'administrasiPleno', title: '5. Admin. Pleno', status: skema.statusSurat?.administrasiPleno?.length === 5, key: 'administrasiPleno', type: 'Administrasi Pleno' }
                            ].map(doc => {
                              const style = getDocButtonStyle(isFullyPlotted || doc.type === 'Asesi', doc.status);
                              const icon = getDocIconInfo(isFullyPlotted || doc.type === 'Asesi', doc.status);
                              return (
                                <button key={doc.id} disabled={!isFullyPlotted && doc.type !== 'Asesi'} onClick={() => handleDocClick(doc.type, activeSurat, skema, doc.key)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', transition: '0.2s', ...style }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: icon.bg, color: icon.color }}><i className={`fas ${doc.type === 'Asesi' ? 'fa-users' : icon.class}`}></i></div>
                                  <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{doc.title}</span>
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()

      ) : (
        <div className="fade-in-content">
          {isFromDashboard && (<div style={{ marginBottom: '20px' }}><Button variant="outline" icon="arrow-left" onClick={() => navigate(-1)} style={{borderColor: '#2563eb', color: '#2563eb'}}>Kembali ke Pemantauan</Button></div>)}
          <div className="dashboard-header" style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px' }}>Manajemen Penugasan (Plotting)</h2>
            <p className="text-muted">Atur jadwal pelaksanaan, distribusikan Asesor, dan terbitkan dokumen surat persetujuan LSP.</p>
          </div>
          
          <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
                <input type="text" placeholder="Cari skema atau instansi pengusul..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Filter:</label>
                <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                  <option value="Semua">Semua Status</option>
                  <option value="Sedang Diproses">Sedang Diproses (Menunggu Plotting)</option>
                  <option value="Selesai Diplot">Selesai Di-plot</option>
                </select>
              </div>
            </div>

            <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th style={{ width: '5%', textAlign: 'center' }}>No.</th><th style={{ width: '20%' }}>ID Surat & Instansi</th><th style={{ width: '10%', textAlign: 'center' }}>Srt. Pengajuan</th><th style={{ width: '25%' }}>Daftar Skema</th><th style={{ width: '20%' }}>Pelaksanaan & TUK</th><th style={{ width: '10%', textAlign: 'center' }}>Status</th><th style={{ width: '10%', textAlign: 'center' }}>Aksi</th></tr></thead>
                <tbody>
                  {paginatedUsulan.map((item, index) => {
                    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
                    const isHighlighted = highlightedId === item.idUjk;
                    
                    return (
                    <tr key={item.idUjk} style={{ backgroundColor: isHighlighted ? '#fffbeb' : 'inherit', borderLeft: isHighlighted ? '4px solid #f59e0b' : 'none', transition: 'all 0.3s ease' }}>
                      <td style={{ textAlign: 'center', color: '#94a3b8', verticalAlign: 'top', paddingTop: '20px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td style={{ verticalAlign: 'top', paddingTop: '20px' }}><strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.idUjk}</strong><small className="text-muted"><i className="fas fa-building"></i> {item.pengusul}</small></td>
                      
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}><Button variant="outline" size="sm" icon="file-pdf" onClick={() => showAlert('info', 'File Pengajuan', 'API download pengajuan belum direquest ke backend.')}>Lihat</Button></td>
                      
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <ul style={{ margin: 0, paddingLeft: '15px', color: '#334155', fontSize: '0.9rem' }}>
                          {item.skemaList.map((skema, i) => (<li key={i} style={{ marginBottom: '8px' }}><strong style={{ color: '#1e293b' }}>{skema.judul}</strong><br/><small className="text-muted">{skema.bidang || skema.kejuruan || 'Umum'} <span style={{margin: '0 5px'}}>|</span> {skema.jenis || 'Lainnya'}</small></li>))}
                        </ul>
                      </td>
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {item.skemaList.map((skema, i) => (<div key={i} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '40px', marginBottom: '8px' }}><span style={{ fontWeight: '600', color: '#334155' }}><i className="far fa-calendar-alt text-muted" style={{marginRight: '4px'}}></i> {skema.hari1 ? `${formatTgl(skema.hari1)} s/d ${formatTgl(skema.hari2)}` : 'Belum Diatur'}</span><small className="text-muted" style={{ display: 'block', marginTop: '2px' }}><i className="fas fa-map-marker-alt"></i> {skema.tuk}</small></div>))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>{isSemuaDiplot ? <span className="badge success">Selesai Diplot</span> : <span className="badge warning">Sedang Diproses</span>}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => handleDocClick('Surat Balasan', item, item.skemaList[0], 'balasan')} style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><i className="fas fa-envelope"></i> Srt. Balasan</button>
                          <Button variant="primary" size="sm" onClick={() => { setSelectedPenugasan(item); setEditingId(null); }} style={{width: '100%'}}>Plotting</Button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {paginatedUsulan.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Tidak ada data penugasan.</td></tr>}
                </tbody>
              </table>
            </div>
            
            <div style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Menampilkan <strong>{filteredUsulan.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredUsulan.length)}</strong> dari total <strong>{filteredUsulan.length}</strong> data penugasan
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#0f172a', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                >
                  <i className="fas fa-chevron-left"></i> Sebelumnya
                </button>
                
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0f172a' }}>
                  Halaman {currentPage} / {totalPages}
                </span>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff', color: currentPage === totalPages ? '#94a3b8' : '#0f172a', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                >
                  Selanjutnya <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* MODAL PILIH ASESOR/PENYELIA */}
      {isAsesorModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content modal-large" style={{ display: 'flex', flexDirection: 'column', padding: 0, width: '100%', maxWidth: '700px' }}>
            <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
              <h3 style={{ margin: 0 }}><i className="fas fa-filter text-blue"></i> Pilih {asesorTargetRole === 'asesor1' ? 'Asesor 1' : asesorTargetRole === 'asesor2' ? 'Asesor 2' : 'Penyelia LSP'}</h3>
            </div>
            <div className="modal-body" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              {isLoadingModal ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}><i className="fas fa-spinner fa-spin fa-2x"></i><p>Memuat Data...</p></div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead><tr><th style={{ width: '50px', textAlign: 'center' }}>Pilih</th><th>{asesorTargetRole === 'penyelia' ? 'Nama Penyelia' : 'Nama Asesor'}</th>{asesorTargetRole !== 'penyelia' && <th>No. Registrasi</th>}{asesorTargetRole !== 'penyelia' && <th>Status Jadwal</th>}</tr></thead>
                    <tbody>
                      {asesorTargetRole === 'penyelia' ? daftarPenyelia.map((penyelia, idx) => {
                          const isChecked = editData.penyelia_id === penyelia.id;
                          return (
                            <tr key={idx} style={{ backgroundColor: isChecked ? '#f0fdf4' : 'inherit' }}>
                              <td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor(penyelia)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /></td>
                              <td><strong>{penyelia.namaPenyilia}</strong></td>
                            </tr>
                          );
                        }) : masterAsesor.map(asesor => {
                          const isBentrok = !asesor.is_available;
                          const isChecked = editData[`${asesorTargetRole}_id`] === asesor.id;
                          return (
                            <tr key={asesor.id} style={{ backgroundColor: isBentrok ? '#fee2e2' : isChecked ? '#f0fdf4' : 'inherit' }}>
                              <td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor(asesor)} disabled={isBentrok} style={{ width: '18px', height: '18px', cursor: isBentrok ? 'not-allowed' : 'pointer' }} /></td>
                              <td><strong>{asesor.user?.namaLengkap || asesor.nama}</strong><br/><small className="text-muted">Beban: {asesor.penugasan_asesor_count || 0} UJK</small></td>
                              <td className="text-muted">{asesor.noRegistrasi}</td>
                              <td>{isBentrok ? <span className="badge danger"><i className="fas fa-times-circle"></i> Bentrok</span> : <span className="badge success"><i className="fas fa-check-circle"></i> Tersedia</span>}</td>
                            </tr>
                          );
                        })}
                        {(asesorTargetRole === 'penyelia' ? daftarPenyelia.length === 0 : masterAsesor.length === 0) && (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Data tidak ditemukan.</td></tr>
                        )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <Button variant="secondary" onClick={() => setIsAsesorModalOpen(false)}>Batal</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP ISI FORM SURAT */}
      {isFormOpen && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}><h3 style={{margin:0}}>Lengkapi Data Surat</h3></div>
             <div className="modal-body" style={{ padding: '20px' }}>
                <form onSubmit={handleGenerateSurat}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    {showNoSurat && (
                      <div><label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block'}}>Nomor Surat <span style={{color:'red'}}>*</span></label>
                      <input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required /></div>
                    )}
                    {showTanggalSurat && (
                      <div><label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block'}}>Tanggal Dokumen <span style={{color:'red'}}>*</span></label>
                      <input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required /></div>
                    )}
                    {showTglVerif && (
                      <div><label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block'}}>Tanggal Verifikasi TUK <span style={{color:'red'}}>*</span></label>
                      <input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalVerif" value={formData.tanggalVerif || ''} onChange={handleInputChange} required /></div>
                    )}
                    {showSptFields && (
                      <div style={{ padding: '15px', backgroundColor: '#fdf4ff', border: '1px dashed #d8b4fe', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '12px' }}><label style={{fontWeight:'bold', fontSize:'0.75rem', color:'#6b21a8', marginBottom: '6px', display: 'block'}}>Nomor Surat SPT Asesor <span style={{color:'red'}}>*</span></label>
                        <input type="text" style={{width:'100%', border:'1px solid #e9d5ff', borderRadius:'6px', padding: '8px'}} name="noSptAsesor" value={formData.noSptAsesor || ''} onChange={handleInputChange} required placeholder="000.140D/..." /></div>
                        <div><label style={{fontWeight:'bold', fontSize:'0.75rem', color:'#6b21a8', marginBottom: '6px', display: 'block'}}>Nomor Surat SPT Penyelia <span style={{color:'red'}}>*</span></label>
                        <input type="text" style={{width:'100%', border:'1px solid #e9d5ff', borderRadius:'6px', padding: '8px'}} name="noSptPenyelia" value={formData.noSptPenyelia || ''} onChange={handleInputChange} required placeholder="000.140D/..." /></div>
                      </div>
                    )}
                  </div>
                  
                  {/* TOMBOL DINAMIS BERDASARKAN DOC KEY */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Button variant="secondary" onClick={() => setIsFormOpen(false)} style={{flex: 1}}>Batal</Button>
                    <button type="submit" onClick={() => setSubmitMode('normal')} style={{flex: 1, backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'}}>
                      Cetak Biasa
                    </button>
                    {docsWithTtd.includes(docCodeActive) && (
                      <button type="submit" onClick={() => setSubmitMode('ttd')} style={{flex: 1, backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'}}>
                        Cetak + TTD
                      </button>
                    )}
                  </div>
                </form>
             </div>
           </div>
         </div>
      )}

    </div>
  );
};

export default PenugasanPage;