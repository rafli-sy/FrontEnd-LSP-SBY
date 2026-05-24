import React, { useState, useEffect, useMemo, useRef } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup'; 
import TablePeserta from '../TablePeserta/TablePeserta';  
import Pagination from '../../components/ui/Pagination'; 

// Konfigurasi API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : 'https://untracked-exponent-oboe.ngrok-free.dev/api';

const listSuratTugas = [ { code: 'SPT.01', name: 'Surat Tugas Asesor', icon: 'fa-user-tie', target: 'asesor' }, { code: 'SPT.02', name: 'Surat Tugas Penyelia', icon: 'fa-user-shield', target: 'penyelia' } ];
const listSuratPermohonan = [ { code: 'SPM.01', name: 'Permohonan Asesor 1', icon: 'fa-user-tie', target: 'asesor1' }, { code: 'SPM.02', name: 'Permohonan Asesor 2', icon: 'fa-user-tie', target: 'asesor2' }, { code: 'SPM.03', name: 'Permohonan Penyelia', icon: 'fa-user-shield', target: 'penyelia' } ];
const listAdministrasi = [ { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' } ];
const listAdministrasiPleno = [ { code: 'PLN.01', name: 'SK Pleno', icon: 'fa-certificate' }, { code: 'PLN.02', name: 'BA Pleno', icon: 'fa-file-signature' }, { code: 'PLN.03', name: 'Hasil Sidang Pleno', icon: 'fa-users' }, { code: 'PLN.04', name: 'SK Penetapan Hasil', icon: 'fa-file-contract' }, { code: 'PLN.05', name: 'Hasil Final', icon: 'fa-check-double' } ];

const formatTgl = (tgl) => {
  if (!tgl) return '-';
  const parts = tgl.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return tgl;
};

const SuratMenyurat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
  const config = useMemo(() => ({
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }), [token]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [alertConfig, setAlertConfig] = useState(null);
  const [selectedUjkDetail, setSelectedUjkDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeSubMenu, setActiveSubMenu] = useState(null); 
  const [activeSubMenuKey, setActiveSubMenuKey] = useState(null);
  const [selectedSubDoc, setSelectedSubDoc] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [targetUjk, setTargetUjk] = useState(null);
  const [activeDocKey, setActiveDocKey] = useState(null);

  const [submitMode, setSubmitMode] = useState('normal'); 
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '', noSptAsesor: '', noSptPenyelia: '' });
  
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewPesertaUjk, setViewPesertaUjk] = useState(null);
  const [viewPdf, setViewPdf] = useState(null); 

  const [isFromDashboard, setIsFromDashboard] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null); 

  const [daftarSurat, setDaftarSurat] = useState([]);

  const docsWithForm = ['SPT.01', 'SPT.02', 'SPM.01', 'SPM.02', 'SPM.03', 'balasan', 'DOC.02', 'DOC.06', 'DOC.07', 'DOC.08', 'DOC.10', 'DOC.11', 'DOC.13', 'PLN.01', 'PLN.04'];
  const docsWithTtd = ['balasan', 'SPT.01', 'SPT.02', 'SPM.01', 'SPM.02'];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/staf-lsp/semua-pengajuan`, config);
      const rawData = res.data.data || [];
      
      const grouped = {};
      rawData.forEach(item => {
        if (item.status_pengajuan === 'Dibatalkan') return;

        const validPengajuanId = item.pengajuan_ujk_id || item.pengajuan?.id || item.pengajuan_id;
        const ujkId = item.pengajuan?.nomor_surat_pengajuan || `UJK-${validPengajuanId}`;

        // --- PENYESUAIAN FETCHING BACKEND (BIDANG & TANGGAL) ---
        const jadwal = item.jadwal_asesmen || item.jadwalAsesmen;
        const hari1 = jadwal?.tanggal_mulai_asesmen || item.tanggal_mulai || '';
        const hari2 = jadwal?.tanggal_selesai_asesmen || item.tanggal_selesai || '';
        const namaBidang = item.skema?.bidang?.namaBidang || item.bidang?.namaBidang || '-';
        const namaTuk = item.tuk?.namaInstitusi || item.tuk?.nama_lembaga || '-';

        if (!grouped[ujkId]) {
          grouped[ujkId] = {
            id: ujkId,
            nomorSurat: ujkId,
            pengajuan_id: validPengajuanId,
            anggaran: item.pengajuan?.sumber_anggaran?.namaAnggaran || 'Mandiri',
            instansi: item.pengajuan?.admin_blk?.instansi?.nama_institusi || 'Instansi BLK',
            skema: item.skema?.namaSkema || '-',
            bidang: namaBidang,
            tglMulai: hari1,
            tglSelesai: hari2,
            asesi: item.jumlah_peserta || 0,
            status: 'Surat Diterbitkan', 
            tuk: namaTuk,
            savedForms: {},
            docs: { balasan: true, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] },
            skemaList: []
          };
        }

        grouped[ujkId].skemaList.push({
          idSkema: item.id,
          judul: item.skema?.namaSkema || '-',
          bidang: namaBidang,
          jenis: item.skema?.jenisSkema || 'Klaster',
          asesi: item.jumlah_peserta || 0,
          hari1: hari1,
          hari2: hari2,
          tuk: namaTuk,
          isPlotted: !!jadwal?.id,
          asesor1: jadwal?.penugasan_asesor?.[0]?.asesor?.user?.namaLengkap || jadwal?.penugasanAsesor?.[0]?.asesor?.user?.namaLengkap || '',
          asesor2: jadwal?.penugasan_asesor?.[1]?.asesor?.user?.namaLengkap || jadwal?.penugasanAsesor?.[1]?.asesor?.user?.namaLengkap || '',
          penyelia: jadwal?.penyilia?.namaPenyilia || '',
          statusSurat: { balasan: true, permohonan: !!jadwal, tugas: !!jadwal, administrasi: [], administrasiPleno: [] },
          savedForms: {}
        });
      });
      setDaftarSurat(Object.values(grouped));
    } catch (error) {
      console.error("Gagal memuat data staf:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isFormOpen) { setIsFormOpen(false); e.preventDefault(); }
      else if (viewPesertaUjk) { setViewPesertaUjk(null); e.preventDefault(); }
      else if (viewPdf) { setViewPdf(null); e.preventDefault(); }
      else if (previewDokumen) { 
        if(previewDokumen.fileUrl && previewDokumen.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewDokumen.fileUrl); 
        }
        setPreviewDokumen(null); 
        e.preventDefault(); 
      }
      else if (activeSubMenu) { setActiveSubMenu(null); setActiveSubMenuKey(null); setSelectedSubDoc(null); e.preventDefault(); }
      else if (selectedUjkDetail) { setSelectedUjkDetail(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isFormOpen, activeSubMenu, selectedUjkDetail, previewDokumen, viewPesertaUjk, viewPdf]);

  useEffect(() => {
    if (location.state?.openDetailId) {
      setSearchTerm('');
      setFilterStatus('Semua Status');
      setHighlightedId(location.state.openDetailId);
      setCurrentPage(1);
      if (location.state.fromDashboard) setIsFromDashboard(true);

      const foundItem = daftarSurat.find(a => a.id === location.state.openDetailId);
      if (foundItem) {
        if (location.state.openAsesi && location.state.skemaName) {
          const foundSkema = foundItem.skemaList.find(s => s.judul === location.state.skemaName);
          if (foundSkema) setViewPesertaUjk({ ...foundSkema, peserta: [] });
        } else if (!location.state.highlightOnly) { 
          setSelectedUjkDetail(foundItem);
        }
      }
      window.history.replaceState(null, '');
    }
  }, [location.state, daftarSurat]);

  const filteredDaftar = daftarSurat.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = item.skema.toLowerCase().includes(term) || item.instansi.toLowerCase().includes(term);
    const matchStatus = filterStatus === 'Semua Status' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sortedDaftar = useMemo(() => {
    let result = [...filteredDaftar].sort((a, b) => new Date(b.tglMulai) - new Date(a.tglMulai));
    if (highlightedId) {
      const targetIndex = result.findIndex(a => a.id === highlightedId);
      if (targetIndex > -1) {
        const targetItem = result.splice(targetIndex, 1)[0];
        result.unshift(targetItem);
      }
    }
    return result;
  }, [filteredDaftar, highlightedId]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedDaftar.length / itemsPerPage);
  const paginatedDaftar = sortedDaftar.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, onConfirm: () => { if(action) action(); setAlertConfig(null); }, onCancel: () => setAlertConfig(null) });
  };
  const handleConfirmAlert = () => { if (alertConfig?.onConfirm) alertConfig.onConfirm(); else setAlertConfig(null); };
  const handleCancelAlert = () => { if (alertConfig?.onCancel) alertConfig.onCancel(); else setAlertConfig(null); };

  const handleGoToPeserta = (skema) => {
    const dummyPeserta = Array.from({ length: skema.asesi || 10 }).map((_, i) => ({ 
      id: i + 1, nama: `Peserta Nominatif ${i + 1}`, nik: `35780000000000${i}`, jk: i % 2 === 0 ? 'L' : 'P', tempatLahir: 'Surabaya', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', hp:'081234', email: 'peserta@mail.com', pendidikan: 'SMK', asesor: '', keputusan: '' 
    }));
    setViewPesertaUjk({ ...skema, peserta: dummyPeserta });
  };

  const handleDocClick = (jenisSurat, suratItem, skemaItem, docKey) => {
    if (!skemaItem?.isPlotted && jenisSurat !== 'Surat Balasan') { showAlert('warning', 'Terkunci', 'Admin LSP belum menyelesaikan Plotting Jadwal & Asesor.'); return; }
    if (jenisSurat === 'Asesi') { handleGoToPeserta(skemaItem); return; }

    const normalizedSkema = skemaItem ? { ...skemaItem, skema: skemaItem.judul, hari1: skemaItem.hari1 || suratItem.tglMulai, hari2: skemaItem.hari2 || suratItem.tglSelesai } : null;

    if (['Administrasi', 'Administrasi Pleno', 'Surat Tugas', 'Surat Permohonan'].includes(jenisSurat)) {
      setTargetUjk({ surat: suratItem, skema: normalizedSkema }); 
      setActiveSubMenu(jenisSurat);
      setActiveSubMenuKey(docKey);
    } else {
      setTargetUjk({ surat: suratItem, skema: normalizedSkema || suratItem.skemaList[0] }); 
      setFormType(jenisSurat);
      setActiveDocKey('balasan');
      setSelectedSubDoc({ name: 'Surat Balasan', target: 'semua', code: 'balasan' });
      
      const formSaved = suratItem?.savedForms?.balasan;
      if (formSaved) setFormData(formSaved);
      else setFormData({ noSurat: '000.140A/LSP BLK-SBY/V/2026', tanggalSurat: '2026-05-17', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '2026-05-17', noSptAsesor: '', noSptPenyelia: '' });
      setIsFormOpen(true);
    }
  };

  const handleSubMenuClick = (doc) => {
    const docType = activeSubMenu;
    setFormType(docType);
    setActiveDocKey(doc.code);
    setSelectedSubDoc(doc);
    
    const initialForm = targetUjk?.surat?.savedForms?.[doc.code] || { 
      noSurat: `000.140/${doc.code}/LSP BLK-SBY/V/2026`, 
      tanggalSurat: '2026-05-17', 
      tanggalVerif: '2026-05-17',
      noSptAsesor: '000.140D/LSP BLK-SBY/V/2026',
      noSptPenyelia: '000.140D/LSP BLK-SBY/V/2026'
    };
    setFormData(initialForm);

    if (!docsWithForm.includes(doc.code)) {
       handleAutoGenerateSurat(doc.code, doc, initialForm, docType, false);
    } else {
       setIsFormOpen(true);
    }
  };

  const mapPdfEndpoint = (docKey, skemaId, pengajuanId, isTtd = false) => {
    const ttdSuffix = isTtd ? '-ttd' : '';
    const map = {
      'balasan': `/staf-lsp/cetak-surat-balasan${ttdSuffix}/${pengajuanId}`,
      'SPT.01': `/staf-lsp/cetak-surat-spt-asesor${ttdSuffix}/${skemaId}`,
      'SPT.02': `/staf-lsp/cetak-surat-spt-penyilia${ttdSuffix}/${skemaId}`,
      'SPM.01': `/staf-lsp/cetak-surat-permohonan-asesor1${ttdSuffix}/${skemaId}`,
      'SPM.02': `/staf-lsp/cetak-surat-permohonan-asesor2${ttdSuffix}/${skemaId}`,
      'SPM.03': `/staf-lsp/cetak-surat-permohonan-penyilia/${skemaId}`,
      'DOC.01': `/staf-lsp/cetak-surat-laporan-penyilia/${skemaId}`,
      'DOC.02': `/staf-lsp/cetak-surat-berita-acara/${skemaId}`,
      'DOC.03': `/staf-lsp/cetak-surat-penetapan-TUK/${skemaId}`,
      'DOC.04': `/staf-lsp/cetak-surat-SK-penyelanggara/${skemaId}`,
      'DOC.05': `/staf-lsp/cetak-surat-lampiran-SK/${skemaId}`,
      'DOC.06': `/staf-lsp/cetak-surat-daftar-hadir-pra-asesmen/${skemaId}`,
      'DOC.07': `/staf-lsp/cetak-surat-daftar-hadir-asesmen-h1/${skemaId}`,
      'DOC.08': `/staf-lsp/cetak-surat-daftar-hadir-asesmen-h2/${skemaId}`,
      'DOC.09': `/staf-lsp/cetak-surat-tanda-terima-dokumen/${skemaId}`,
      'DOC.10': `/staf-lsp/cetak-surat-pernyataan-asesor-1/${skemaId}`,
      'DOC.11': `/staf-lsp/cetak-surat-pernyataan-asesor-2/${skemaId}`,
      'DOC.12': `/staf-lsp/cetak-surat-pengembalian-dokumen/${skemaId}`,
      'DOC.13': `/staf-lsp/cetak-surat-rencana-verif-TUK/${skemaId}`,
      'PLN.01': `/staf-lsp/cetak-surat-sk-pleno/${skemaId}`,
      'PLN.02': `/staf-lsp/cetak-surat-berita-acara-pleno/${skemaId}`,
      'PLN.03': `/staf-lsp/cetak-surat-hasil-sidang-pleno/${skemaId}`,
      'PLN.04': `/staf-lsp/cetak-surat-sk-penetapan-hasil/${skemaId}`,
      'PLN.05': `/staf-lsp/cetak-surat-hasil-final-pleno/${skemaId}`,
    };
    return map[docKey];
  };

  const handleAutoGenerateSurat = async (docKey, subDoc, formToSave, currentMenu, isTtd = false) => {
    setAlertConfig({ type: 'info', title: 'Menarik Dokumen PDF...', text: `Sistem sedang men-generate dokumen ${isTtd ? 'dengan Tanda Tangan' : 'Biasa'}...` });
    try {
      if (!targetUjk || !targetUjk.surat) throw new Error("Data UJK tidak terpilih.");
      const skemaId = targetUjk.skema?.idSkema;
      const pengajuanId = targetUjk.surat?.pengajuan_id || targetUjk.surat?.id;
      const endpoint = mapPdfEndpoint(docKey, skemaId, pengajuanId, isTtd);
      const queryParams = new URLSearchParams({
        nomor_surat: formToSave.noSurat || '',
        tanggal_surat: formToSave.tanggalSurat || '',
        nomor_spt_asesor: formToSave.noSptAsesor || '',
        nomor_spt_penyilia: formToSave.noSptPenyelia || '',
        tanggal_rencana_verif_tuk: formToSave.tanggalVerif || ''
      }).toString();

      const res = await axios.get(`${API_BASE_URL}${endpoint}?${queryParams}`, { ...config, responseType: 'blob' });
      const pdfUrl = URL.createObjectURL(res.data);
      
      setDaftarSurat(prev => prev.map(item => item.id === targetUjk.surat.id ? { ...item, savedForms: { ...(item.savedForms || {}), [docKey]: formToSave } } : item));
      setTargetUjk(prev => ({ ...prev, surat: { ...prev.surat, savedForms: { ...(prev.surat.savedForms || {}), [docKey]: formToSave } } }));
      
      setPreviewDokumen({ jenis: currentMenu, fileUrl: pdfUrl, docKey: docKey, dataUjk: targetUjk.skema, ujkId: targetUjk.surat.id, skemaId: targetUjk.skema.idSkema, subDoc: subDoc, isTtd: isTtd });
      setAlertConfig(null); 
    } catch (error) {
      console.error("Dokumen Fetching Error:", error);
      showAlert('error', 'Gagal Render Dokumen', 'Terjadi kesalahan sistem saat menghubungi backend.');
    }
  };
  
  const handleGenerateSurat = async (e) => {
    e.preventDefault();
    setIsFormOpen(false);
    const isTtd = submitMode === 'ttd';
    handleAutoGenerateSurat(activeDocKey, selectedSubDoc, formData, formType, isTtd);
  };

  const handleUploadApi = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setAlertConfig({ type: 'info', title: 'Mengunggah...', text: `Mengirim file ${file.name} ke server...` });
    try {
      const endpointId = previewDokumen.docKey === 'balasan' ? previewDokumen.ujkId : previewDokumen.skemaId;
      const formDataUpload = new FormData();
      formDataUpload.append('file_dokumen', file);
      await axios.post(`${API_BASE_URL}/staf-lsp/upload-dokumen/${endpointId}`, formDataUpload, config);
      showAlert('success', 'Berhasil Dikirim!', `Dokumen berhasil diunggah.`);
    } catch (error) {
      showAlert('error', 'Gagal', 'Terjadi gangguan saat mengunggah.');
    } finally {
      if(fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  const markDocAsDone = (idUjk, idSkema, docTypeKey, docCode) => {
    setDaftarSurat(prev => prev.map(item => {
      if (item.id === idUjk) {
        if (docTypeKey === 'balasan') { return { ...item, docs: { ...(item.docs || {}), balasan: true } }; }
        else {
          const currentArray = item.docs?.[docTypeKey] || [];
          if (!currentArray.includes(docCode)) { return { ...item, docs: { ...(item.docs || {}), [docTypeKey]: [...currentArray, docCode] } }; }
        }
      }
      return item;
    }));
  };

  const checkIsPrinted = (suratId, menuKey, docCode) => {
    const activeSurat = daftarSurat.find(s => s.id === suratId);
    const statusVal = activeSurat?.docs?.[menuKey];
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

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const docCodeActive = selectedSubDoc?.code || activeDocKey;
  const isKelompokDH = ['DOC.06', 'DOC.07', 'DOC.08'].includes(docCodeActive);
  const isVerifTuk = docCodeActive === 'DOC.13';
  const isOnlyTanggal = ['DOC.02', 'DOC.10', 'DOC.11'].includes(docCodeActive);
  const isSuratForm = ['SPT.01', 'SPT.02', 'SPM.01', 'SPM.02', 'SPM.03', 'balasan', 'PLN.01', 'PLN.04'].includes(docCodeActive);

  const showNoSurat = isVerifTuk || isSuratForm;
  const showTanggalSurat = isVerifTuk || isOnlyTanggal || isSuratForm;
  const showSptFields = isKelompokDH;
  const showTglVerif = isVerifTuk;
  const isLandscapeDoc = ['PLN.03', 'DOC.06', 'DOC.07', 'DOC.08'].includes(previewDokumen?.subDoc?.code || previewDokumen?.docKey);
  const uploadAllowed = ['balasan', 'DOC.02', 'SPT.01'].includes(previewDokumen?.docKey);

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh' }}>
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>Memuat data...</div>
      ) : viewPesertaUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setViewPesertaUjk(null)}>Kembali</Button>
          <div className="dashboard-card" style={{ padding: '25px', marginTop: '20px' }}>
            <TablePeserta dataPeserta={viewPesertaUjk.peserta || []} skemaName={viewPesertaUjk.judul} asesor1={viewPesertaUjk.asesor1} asesor2={viewPesertaUjk.asesor2} isAdmin={false} isStaffAsesorActive={true} onSave={() => setViewPesertaUjk(null)} />
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
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => {
                   if(previewDokumen.fileUrl.startsWith('blob:')) URL.revokeObjectURL(previewDokumen.fileUrl);
                   setPreviewDokumen(null);
                }}>Kembali</Button>

                <input type="file" ref={fileInputRef} accept="application/pdf" style={{ display: 'none' }} onChange={handleUploadApi} />
                
                {uploadAllowed && (
                  <button onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
                    <i className="fas fa-upload"></i> Unggah TTD Resmi
                  </button>
                )}

                <a href={previewDokumen.fileUrl} download={`Dokumen_${previewDokumen.docKey}${previewDokumen.isTtd ? '_TTD' : ''}.pdf`} style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }} onClick={() => { if (previewDokumen?.docKey) { const docTypeKey = activeSubMenuKey || previewDokumen.docKey; markDocAsDone(previewDokumen.ujkId, previewDokumen.skemaId, docTypeKey, previewDokumen.docKey); } showAlert('success', 'Berhasil Diunduh!', 'Dokumen PDF berhasil diunduh.'); }}>
                  <i className="fas fa-download"></i> Unduh Cetak
                </a>
              </div>
            </div>
            
            <div style={{ width: '100%', height: isLandscapeDoc ? '65vh' : '85vh', maxWidth: isLandscapeDoc ? '100%' : '800px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              <iframe src={previewDokumen.fileUrl} width="100%" height="100%" style={{ border: 'none' }} title="Preview Dokumen" />
            </div>
          </div>

      /* VIEW: SUBMENU DOKUMEN */
      ) : activeSubMenu && !isFormOpen ? (
          <div className="fade-in-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => { setActiveSubMenu(null); setActiveSubMenuKey(null); setSelectedSubDoc(null); }}>Kembali</Button>
              <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Pilih Dokumen {activeSubMenu}</h2></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', width: '100%' }}>
              {(activeSubMenu === 'Surat Tugas' ? listSuratTugas : activeSubMenu === 'Surat Permohonan' ? listSuratPermohonan : activeSubMenu === 'Administrasi Pleno' ? listAdministrasiPleno : listAdministrasi).map(doc => {
                const isPrinted = checkIsPrinted(targetUjk?.surat?.id, activeSubMenuKey, doc.code);
                
                return (
                  <button key={doc.code} type="button" onClick={() => handleSubMenuClick(doc)} style={{ background: '#fff', border: isPrinted ? '1px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isPrinted ? '0 4px 6px rgba(16, 185, 129, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)', outline: 'none', width: '100%' }}>
                    <div style={{ background: isPrinted ? '#e6fbf0' : '#eff6ff', color: isPrinted ? '#10b981' : '#2563eb', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', transition: 'all 0.2s ease' }}><i className={isPrinted ? "fas fa-redo" : `fas ${doc.icon}`}></i></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', marginBottom: '4px' }}>{doc.code}</div><div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>{doc.name}</div></div>
                  </button>
                );
              })}
            </div>
          </div>

      /* VIEW: MANAJEMEN PENUGASAN STAFF */
      ) : selectedUjkDetail ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => { if (isFromDashboard) { navigate(-1); } else { setSelectedUjkDetail(null); }}}>
                {isFromDashboard ? 'Kembali ke Pemantauan' : 'Kembali ke Daftar'}
            </Button>
            <div><h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Penerbitan Dokumen UJK</h2><p className="text-muted" style={{ margin: 0 }}>{selectedUjkDetail.id} - {selectedUjkDetail.instansi}</p></div>
          </div>

          {selectedUjkDetail.skemaList.map((skema) => {
            const isFullyPlotted = skema.isPlotted; 

            return (
              <div key={skema.idSkema} className="dashboard-card" style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ backgroundColor: '#1e293b', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedUjkDetail.id}</span><span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' }}>{selectedUjkDetail.anggaran}</span></div>
                  <div style={{ textAlign: 'right' }}>{!isFullyPlotted ? <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-exclamation-triangle"></i> Belum Di-plot Admin</span> : <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-check-circle"></i> Siap Diterbitkan</span>}</div>
                </div>

                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>{skema.judul}</h4>
                <p className="text-muted" style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>{skema.bidang}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'asesi', title: '1. Pembagian Asesi & Hasil Uji', status: true, key: 'asesi', type: 'Asesi' }, 
                    { id: 'tugas', title: '2. Surat Tugas', status: skema.statusSurat?.tugas, key: 'spt', type: 'Surat Tugas' },
                    { id: 'permohonan', title: '3. Srt. Permohonan', status: skema.statusSurat?.permohonan, key: 'permohonan', type: 'Surat Permohonan' },
                    { id: 'administrasi', title: '4. Administrasi', status: skema.statusSurat?.administrasi?.length === 13, key: 'administrasi', type: 'Administrasi' },
                    { id: 'administrasiPleno', title: '5. Admin. Pleno', status: skema.statusSurat?.administrasiPleno?.length === 5, key: 'administrasiPleno', type: 'Administrasi Pleno' }
                  ].map(doc => {
                    const style = getDocButtonStyle(isFullyPlotted || doc.type === 'Asesi', doc.status);
                    const icon = getDocIconInfo(isFullyPlotted || doc.type === 'Asesi', doc.status);
                    return (
                      <button key={doc.id} disabled={!isFullyPlotted && doc.type !== 'Asesi'} onClick={() => handleDocClick(doc.type, selectedUjkDetail, skema, doc.key)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', transition: '0.2s', ...style }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: icon.bg, color: icon.color }}><i className={`fas ${doc.type === 'Asesi' ? 'fa-users' : icon.class}`}></i></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{doc.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      
      ) : (
        <div className="fade-in-content">
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: '700', margin: '0' }}>Dokumen & Administrasi</h2>
            <p className="text-muted" style={{ fontSize: '1rem', marginTop: '6px' }}>Terbitkan dokumen Surat Balasan, Surat Tugas Asesor, Surat Permohonan, dan Administrasi.</p>
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
                  <option value="Semua Status">Semua Status</option>
                  <option value="Menunggu Surat">Sedang Diproses (Menunggu Plotting)</option>
                  <option value="Surat Diterbitkan">Surat Diterbitkan</option>
                </select>
              </div>
            </div>
            <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th style={{ width: '5%', textAlign: 'center' }}>No.</th><th style={{ width: '25%' }}>Surat & Instansi</th><th style={{ width: '25%' }}>Daftar Skema</th><th style={{ width: '20%' }}>Pelaksanaan & TUK</th><th style={{ width: '15%', textAlign: 'center' }}>Status</th><th style={{ width: '10%', textAlign: 'center' }}>Aksi</th></tr></thead>
                <tbody>
                  {paginatedDaftar.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#94a3b8', verticalAlign: 'top', paddingTop: '20px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td style={{ verticalAlign: 'top', paddingTop: '20px' }}><strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.nomorSurat}</strong><small className="text-muted"><i className="fas fa-building"></i> {item.instansi}</small></td>
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                           {item.skemaList.map((s, i) => (
                             <div key={i}>
                               <div style={{ color: '#1e293b', fontWeight: '600' }}>{s.judul}</div>
                               <small className="text-muted">{s.bidang} | {s.jenis}</small>
                             </div>
                           ))}
                         </div>
                      </td>
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {item.skemaList.map((s, i) => (
                              <div key={i}>
                                <div><i className="far fa-calendar-alt text-muted" style={{marginRight: '4px'}}></i> {formatTgl(s.hari1)} s/d {formatTgl(s.hari2)}</div>
                                <small className="text-muted"><i className="fas fa-map-marker-alt"></i> {s.tuk}</small>
                              </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}><span className="badge success">Surat Diterbitkan</span></td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => handleDocClick('Surat Balasan', item, item.skemaList[0], 'balasan')} style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><i className="fas fa-envelope"></i> Srt. Balasan</button>
                          <Button variant="primary" size="sm" onClick={() => setSelectedUjkDetail(item)} style={{width: '100%'}}>Kelola Dok.</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredDaftar.length} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      )}

      {isFormOpen && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '400px', background: '#fff', padding: '20px', borderRadius: '12px' }}>
             <h3>Lengkapi Data Surat</h3>
             <form onSubmit={handleGenerateSurat}>
               {showNoSurat && <input type="text" name="noSurat" value={formData.noSurat} onChange={handleInputChange} placeholder="Nomor Surat" style={{width:'100%', marginBottom:'10px', padding:'8px'}} />}
               {showTanggalSurat && <input type="date" name="tanggalSurat" value={formData.tanggalSurat} onChange={handleInputChange} style={{width:'100%', marginBottom:'10px', padding:'8px'}} />}
               <div style={{ display: 'flex', gap: '10px' }}>
                 <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Batal</Button>
                 <Button type="submit" onClick={() => setSubmitMode('normal')}>Cetak</Button>
                 {docsWithTtd.includes(docCodeActive) && <Button type="submit" onClick={() => setSubmitMode('ttd')} style={{backgroundColor:'#10b981'}}>Cetak+TTD</Button>}
               </div>
             </form>
           </div>
         </div>
      )}
    </div>
  );
};

export default SuratMenyurat;