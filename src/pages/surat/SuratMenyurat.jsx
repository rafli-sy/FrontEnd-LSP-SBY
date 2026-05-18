import React, { useState, useEffect, useMemo } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup'; 
import TablePeserta from '../TablePeserta/TablePeserta';  
import Pagination from '../../components/ui/Pagination'; 

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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [alertConfig, setAlertConfig] = useState(null);
  const [selectedUjkDetail, setSelectedUjkDetail] = useState(null);
  
  const [activeSubMenu, setActiveSubMenu] = useState(null); 
  const [activeSubMenuKey, setActiveSubMenuKey] = useState(null);
  const [selectedSubDoc, setSelectedSubDoc] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [targetUjk, setTargetUjk] = useState(null);
  const [activeDocKey, setActiveDocKey] = useState(null);
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '', noSptAsesor: '', noSptPenyelia: '' });
  
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewPesertaUjk, setViewPesertaUjk] = useState(null);
  const [viewPdf, setViewPdf] = useState(null); 

  const [isFromDashboard, setIsFromDashboard] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null); 

  const [daftarSurat, setDaftarSurat] = useState([
    { id: 'UJK-001', nomorSurat: '088/BLK-SBY/IV/2026', anggaran: 'APBD', instansi: 'UPT BLK Surabaya', skema: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', tglMulai: '2026-04-28', tglSelesai: '2026-04-29', asesi: 16, status: 'Surat Diterbitkan', badge: 'success', tuk: 'UPT BLK Surabaya', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', docs: { balasan: true, spt: ['SPT.01', 'SPT.02'], permohonan: ['SPM.01', 'SPM.02', 'SPM.03'], administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-1', judul: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', asesi: 16, hari1: '2026-04-28', hari2: '2026-04-29', tuk: 'UPT BLK Surabaya', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', isPlotted: true, statusSurat: {balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: []}}] },
    { id: 'UJK-002', nomorSurat: '045/BLK-SBY/IV/2026', anggaran: 'APBN', instansi: 'UPT BLK Surabaya', skema: 'Barista', bidang: 'Pariwisata', tglMulai: '2026-04-25', tglSelesai: '2026-04-26', asesi: 20, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Surabaya', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-2', judul: 'Barista', bidang: 'Pariwisata', asesi: 20, hari1: '2026-04-25', hari2: '2026-04-26', tuk: 'UPT BLK Surabaya', asesor1: '', asesor2: '', penyelia: '', isPlotted: false, statusSurat: {balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: []}}] },
    { id: 'UJK-003', nomorSurat: '055/BLK-SGS/IV/2026', anggaran: 'Mandiri', instansi: 'UPT BLK Singosari', skema: 'Desain Grafis', bidang: 'TIK', tglMulai: '2026-04-22', tglSelesai: '2026-04-23', asesi: 15, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Singosari', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-4', judul: 'Desain Grafis', bidang: 'TIK', asesi: 20, hari1: '2026-04-25', hari2: '2026-04-26', tuk: 'UPT BLK Singosari', asesor1: '', asesor2: '', penyelia: '', isPlotted: false, statusSurat: {balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: []}}] },
    { id: 'UJK-004', nomorSurat: '065/PTABC/IV/2026', anggaran: 'APBD', instansi: 'PT ABC Motor', skema: 'Teknisi Kendaraan Ringan', bidang: 'Otomotif', tglMulai: '2026-04-18', tglSelesai: '2026-04-19', asesi: 10, status: 'Surat Diterbitkan', badge: 'success', tuk: 'PT ABC Motor', asesor1: 'Endang Lestari', asesor2: 'Ahmad Fauzi', penyelia: 'Mohamad Andrian A', docs: { balasan: true, spt: ['SPT.01'], permohonan: ['SPM.01'], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-7', judul: 'Teknisi Kendaraan Ringan', bidang: 'Otomotif', asesi: 10, hari1: '2026-04-18', hari2: '2026-04-19', tuk: 'PT ABC Motor', asesor1: 'Endang Lestari', asesor2: 'Ahmad Fauzi', penyelia: 'Mohamad Andrian A', isPlotted: true, statusSurat: {balasan: true, permohonan: true, tugas: true, administrasi: [], administrasiPleno: []}}] },
    { id: 'UJK-005', nomorSurat: '075/BLK-MDN/IV/2026', anggaran: 'APBN', instansi: 'UPT BLK Madiun', skema: 'Menjahit', bidang: 'Garmen', tglMulai: '2026-04-15', tglSelesai: '2026-04-16', asesi: 16, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Madiun', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-8', judul: 'Menjahit', bidang: 'Garmen', asesi: 16, hari1: '2026-04-15', hari2: '2026-04-16', tuk: 'UPT BLK Madiun', asesor1: '', asesor2: '', penyelia: '', isPlotted: false, statusSurat: {balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: []}}] },
    { id: 'UJK-006', nomorSurat: '085/BLK-KDR/IV/2026', anggaran: 'Mandiri', instansi: 'UPT BLK Kediri', skema: 'Practical Office Advance', bidang: 'TIK', tglMulai: '2026-04-12', tglSelesai: '2026-04-13', asesi: 20, status: 'Surat Diterbitkan', badge: 'success', tuk: 'UPT BLK Kediri', asesor1: 'Risna Amalia', asesor2: 'Endang Lestari', penyelia: 'Budi Santoso', docs: { balasan: true, spt: ['SPT.01', 'SPT.02'], permohonan: ['SPM.01', 'SPM.02', 'SPM.03'], administrasi: ['DOC.01'], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-9', judul: 'Practical Office Advance', bidang: 'TIK', asesi: 20, hari1: '2026-04-12', hari2: '2026-04-13', tuk: 'UPT BLK Kediri', asesor1: 'Risna Amalia', asesor2: 'Endang Lestari', penyelia: 'Budi Santoso', isPlotted: true, statusSurat: {balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02', 'DOC.03'], administrasiPleno: []}}] },
    { id: 'UJK-007', nomorSurat: '095/BLK-JBR/IV/2026', anggaran: 'APBD', instansi: 'UPT BLK Jember', skema: 'Budidaya Jamur', bidang: 'Pertanian', tglMulai: '2026-04-10', tglSelesai: '2026-04-11', asesi: 15, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Jember', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-10', judul: 'Budidaya Jamur', bidang: 'Pertanian', asesi: 15, hari1: '2026-04-10', hari2: '2026-04-11', tuk: 'UPT BLK Jember', asesor1: '', asesor2: '', penyelia: '', isPlotted: false, statusSurat: {balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: []}}] },
    { id: 'UJK-008', nomorSurat: '105/LKP-MTR/IV/2026', anggaran: 'APBN', instansi: 'LKP Mutiara', skema: 'Tata Rias', bidang: 'Kecantikan', tglMulai: '2026-04-05', tglSelesai: '2026-04-06', asesi: 12, status: 'Surat Diterbitkan', badge: 'success', tuk: 'LKP Mutiara', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', docs: { balasan: true, spt: ['SPT.01', 'SPT.02'], permohonan: ['SPM.01', 'SPM.02', 'SPM.03'], administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: [] }, savedForms: {}, pesertaList: [], skemaList: [{idSkema: 'S-11', judul: 'Tata Rias', bidang: 'Kecantikan', asesi: 12, hari1: '2026-04-05', hari2: '2026-04-06', tuk: 'LKP Mutiara', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', isPlotted: true, statusSurat: {balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: []}}] }
  ]);

  // DAFTAR DOKUMEN YANG MEMBUTUHKAN FORM
  const docsWithForm = ['SPT.01', 'SPT.02', 'SPM.01', 'SPM.02', 'SPM.03', 'balasan', 'DOC.02', 'DOC.06', 'DOC.07', 'DOC.08', 'DOC.10', 'DOC.11', 'DOC.13', 'PLN.01', 'PLN.04'];

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isFormOpen) { setIsFormOpen(false); e.preventDefault(); }
      else if (viewPesertaUjk) { setViewPesertaUjk(null); e.preventDefault(); }
      else if (viewPdf) { setViewPdf(null); e.preventDefault(); }
      else if (previewDokumen) { setPreviewDokumen(null); e.preventDefault(); }
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
          if (foundSkema) {
            const dummyPeserta = Array.from({ length: foundSkema.asesi || 10 }).map((_, i) => ({ 
              id: i + 1, nama: `Peserta Nominatif ${i + 1}`, nik: `35780000000000${i}`, jk: i % 2 === 0 ? 'L' : 'P', tempatLahir: 'Surabaya', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', rt: '01', rw: '02', kelurahan: 'Alun-Alun Contong', kecamatan: 'Bubutan', hp: '08123456789' + i, email: `peserta${i+1}@mail.com`, pendidikan: 'SMK', asesor: '', keputusan: '' 
            }));
            setViewPesertaUjk({ ...foundSkema, peserta: dummyPeserta });
          }
        } else if (!location.state.highlightOnly) { 
          setSelectedUjkDetail(foundItem);
        }
      }
      
      window.history.replaceState(null, '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

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
      id: i + 1, nama: `Peserta Nominatif ${i + 1}`, nik: `35780000000000${i}`, jk: i % 2 === 0 ? 'L' : 'P', tempatLahir: 'Surabaya', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', rt: '01', rw:'02', kelurahan:'Bubutan', kecamatan:'Bubutan', hp:'081234', email: 'peserta@mail.com', pendidikan: 'SMK', asesor: '', keputusan: '' 
    }));
    setViewPesertaUjk({ ...skema, peserta: dummyPeserta });
  };

  const handleDocClick = (jenisSurat, suratItem, skemaItem, docKey) => {
    if (!skemaItem?.isPlotted && jenisSurat !== 'Surat Balasan') { showAlert('warning', 'Terkunci', 'Admin LSP belum menyelesaikan Plotting Jadwal & Asesor.'); return; }
    
    if (jenisSurat === 'Asesi') {
       handleGoToPeserta(skemaItem);
       return;
    }

    const normalizedSkema = skemaItem ? { ...skemaItem, skema: skemaItem.judul, hari1: skemaItem.hari1 || suratItem.tglMulai, hari2: skemaItem.hari2 || suratItem.tglSelesai, waktu: skemaItem.waktu || '08.00 WIB s/d Selesai' } : null;

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
    
    const defaultNoDokumen = activeSubMenu === 'Surat Tugas' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR-SER-01.2-LSP BLK-SBY';
    const initialForm = targetUjk?.surat?.savedForms?.[doc.code] || { 
      noSurat: `000.140/${doc.code}/LSP BLK-SBY/V/2026`, 
      tanggalSurat: '2026-05-17', 
      noDokumen: defaultNoDokumen, 
      edisiRevisi: '01/00', 
      tanggalBerlaku: '2015-11-10', 
      halaman: '1 dari 1',
      tanggalVerif: '2026-05-17',
      noSptAsesor: '000.140D/LSP BLK-SBY/V/2026',
      noSptPenyelia: '000.140D/LSP BLK-SBY/V/2026'
    };
    setFormData(initialForm);

    if (!docsWithForm.includes(doc.code)) {
       // AUTO GENERATE TANPA FORM
       handleAutoGenerateSurat(doc.code, doc, initialForm, docType);
    } else {
       setIsFormOpen(true);
    }
  };

  // FUNGSI AUTO-GENERATE (Bypass Modal Form)
  const handleAutoGenerateSurat = (docKey, subDoc, formToSave, docType) => {
    setAlertConfig({ type: 'info', title: 'Menyiapkan Dokumen...', text: 'Sistem sedang memproses dokumen otomatis...' });
    
    setTimeout(() => {
      setDaftarSurat(prev => prev.map(item => item.id === targetUjk.surat.id ? { ...item, savedForms: { ...(item.savedForms || {}), [docKey]: formToSave } } : item));
      setTargetUjk(prev => ({ ...prev, surat: { ...prev.surat, savedForms: { ...(prev.surat.savedForms || {}), [docKey]: formToSave } } }));
      
      let docTypeKey = activeSubMenuKey;
      setDaftarSurat(prev => prev.map(item => {
        if (item.id === targetUjk.surat.id) {
          const currentArray = item.docs[docTypeKey] || [];
          if (!currentArray.includes(docKey)) { return { ...item, docs: { ...item.docs, [docTypeKey]: [...currentArray, docKey] } }; }
        }
        return item;
      }));

      const dummyPdfFromBackend = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      setPreviewDokumen({ 
        jenis: docType, 
        fileUrl: dummyPdfFromBackend, 
        docKey: docKey, 
        dataUjk: targetUjk.skema, 
        ujkId: targetUjk.surat.id, 
        skemaId: targetUjk.skema.idSkema, 
        subDoc: subDoc 
      });
      setAlertConfig(null); 
    }, 1500);
  };
  
  const handleGenerateSurat = async (e) => {
    e.preventDefault();
    setIsFormOpen(false);
    handleAutoGenerateSurat(activeDocKey, selectedSubDoc, formData, formType);
  };

  const handleKirimApi = (target) => {
    setAlertConfig({ type: 'info', title: 'Sedang Mengirim...', text: `Mengirim dokumen ke ${target} melalui sistem...` });
    setTimeout(() => {
      showAlert('success', 'Berhasil Dikirim!', `Dokumen telah berhasil dikirim ke ${target}.`);
      setPreviewDokumen(null);
    }, 1500);
  };

  const markDocAsDone = (idUjk, idSkema, docTypeKey, docCode) => {
    setDaftarSurat(prev => prev.map(item => {
      if (item.id === idUjk) {
        if (docTypeKey === 'balasan') { return { ...item, docs: { ...item.docs, balasan: true } }; }
        else {
          const currentArray = item.docs[docTypeKey] || [];
          if (!currentArray.includes(docCode)) { return { ...item, docs: { ...item.docs, [docTypeKey]: [...currentArray, docCode] } }; }
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
  const showDetailKontrolSpt = formType === 'Surat Tugas';

  const isAlreadyGenerated = Boolean(targetUjk?.surat?.savedForms?.[docCodeActive || 'balasan']);
  const isLandscapeDoc = ['PLN.03', 'DOC.06', 'DOC.07', 'DOC.08'].includes(previewDokumen?.subDoc?.code || previewDokumen?.docKey);

  let kirimTarget = null;
  if (previewDokumen?.docKey === 'balasan' || previewDokumen?.subDoc?.code === 'DOC.02') kirimTarget = 'Admin BLK & BKN';
  else if (['SPT.01', 'SPM.01', 'SPM.02'].includes(previewDokumen?.docKey)) kirimTarget = 'Asesor 1 & 2';
  else if (['SPT.02', 'SPM.03'].includes(previewDokumen?.docKey)) kirimTarget = 'Penyelia LSP';

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh' }}>
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />}

      {/* VIEW: DATA PESERTA */}
      {viewPesertaUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setViewPesertaUjk(null)}>Kembali</Button>
            <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Nominatif & Keputusan Asesi</h2><p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPesertaUjk.judul}</strong></p></div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}>
            <TablePeserta dataPeserta={viewPesertaUjk.peserta || []} skemaName={viewPesertaUjk.judul} asesor1={viewPesertaUjk.asesor1} asesor2={viewPesertaUjk.asesor2} isAdmin={false} isStaffAsesorActive={true} onSave={() => setViewPesertaUjk(null)} />
          </div>
        </div>

      /* VIEW: PRATINJAU DOKUMEN DARI BACKEND DENGAN IFRAME (SUPPORTS LANDSCAPE EMBED) */
      ) : previewDokumen ? (
          <div className="print-preview-container fade-in-content" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>Pratinjau {previewDokumen.subDoc?.name || previewDokumen.jenis} {isLandscapeDoc && <span style={{fontSize:'0.75rem', padding:'2px 8px', borderRadius:'10px', background:'#fef3c7', color:'#d97706', marginLeft:'8px'}}>Landscape Mode</span>}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Dokumen dikelola oleh sistem Backend.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
                {kirimTarget && <button onClick={() => handleKirimApi(kirimTarget)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}><i className="fas fa-paper-plane"></i> Kirim ke {kirimTarget}</button>}
                <a href={previewDokumen.fileUrl} download={`Dokumen_${previewDokumen.docKey}.pdf`} style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }} onClick={() => { if (previewDokumen?.docKey) { const docTypeKey = activeSubMenuKey || previewDokumen.docKey; markDocAsDone(previewDokumen.ujkId, previewDokumen.skemaId, docTypeKey, previewDokumen.docKey); } showAlert('success', 'Berhasil Diunduh!', 'Dokumen PDF berhasil diunduh.'); }}><i className="fas fa-download"></i> Unduh PDF</a>
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
                <p className="text-muted" style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>{skema.bidang || skema.kejuruan} | {skema.jenis}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-building"></i></div>
                      <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Instansi Pengusul</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{selectedUjkDetail.instansi}</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-map-marker-alt"></i></div>
                      <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Lokasi Ujian (TUK)</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}>{skema.tuk}</div></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fdf4ff', color: '#a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="far fa-calendar-alt"></i></div>
                      <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Tanggal Pelaksanaan</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{skema.hari1 ? `${formatTgl(skema.hari1)} s/d ${formatTgl(skema.hari2)}` : 'Tanggal Belum Diatur'}</div></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
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
                    </div>
                  </div>
                  
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
                  <option value="Menunggu Surat">Menunggu Surat (Proses)</option>
                  <option value="Surat Diterbitkan">Surat Diterbitkan</option>
                </select>
              </div>
            </div>
            <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th style={{ width: '5%', textAlign: 'center' }}>No.</th><th style={{ width: '25%' }}>Surat & Instansi</th><th style={{ width: '25%' }}>Daftar Skema</th><th style={{ width: '20%' }}>Pelaksanaan & TUK</th><th style={{ width: '15%', textAlign: 'center' }}>Status Global</th><th style={{ width: '10%', textAlign: 'center' }}>Aksi</th></tr></thead>
                <tbody>
                  {paginatedDaftar.map((item, index) => {
                    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
                    const isHighlighted = highlightedId === item.id;
                    
                    return (
                      <tr key={item.id} style={{ backgroundColor: isHighlighted ? '#fffbeb' : 'inherit', borderLeft: isHighlighted ? '4px solid #f59e0b' : 'none', transition: 'all 0.3s ease' }}>
                        <td style={{ textAlign: 'center', color: '#94a3b8', verticalAlign: 'top', paddingTop: '20px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td style={{ verticalAlign: 'top', paddingTop: '20px' }}><strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.nomorSurat}</strong><small className="text-muted"><i className="fas fa-building"></i> {item.instansi}</small></td>
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
                        <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>{isSemuaDiplot ? <span className="badge success">Surat Diterbitkan</span> : <span className="badge warning">Menunggu Surat</span>}</td>
                        
                        <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => handleDocClick('Surat Balasan', item, item.skemaList[0], 'balasan')} style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><i className="fas fa-envelope"></i> Srt. Balasan</button>
                            <Button variant="primary" size="sm" onClick={() => setSelectedUjkDetail(item)} style={{width: '100%'}}>Kelola Dok.</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredDaftar.length} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      )}

      {/* MODAL POP UP ISI FORM SURAT */}
      {isFormOpen && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
             <div className="modal-header"><h3 style={{margin:0}}>Lengkapi Data Surat</h3></div>
             <div className="modal-body">
                <form onSubmit={handleGenerateSurat}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    {showNoSurat && (
                      <div>
                        <label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block'}}>Nomor Surat <span style={{color:'red'}}>*</span></label>
                        <input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required />
                      </div>
                    )}

                    {showTanggalSurat && (
                      <div>
                        <label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block'}}>Tanggal Dokumen <span style={{color:'red'}}>*</span></label>
                        <input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required />
                      </div>
                    )}
                    
                    {showTglVerif && (
                      <div>
                        <label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569', marginBottom: '6px', display: 'block'}}>Tanggal Verifikasi TUK <span style={{color:'red'}}>*</span></label>
                        <input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalVerif" value={formData.tanggalVerif || ''} onChange={handleInputChange} required />
                      </div>
                    )}

                    {showSptFields && (
                      <div style={{ padding: '15px', backgroundColor: '#fdf4ff', border: '1px dashed #d8b4fe', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{fontWeight:'bold', fontSize:'0.75rem', color:'#6b21a8', marginBottom: '6px', display: 'block'}}>Nomor Surat SPT Asesor <span style={{color:'red'}}>*</span></label>
                          <input type="text" style={{width:'100%', border:'1px solid #e9d5ff', borderRadius:'6px', padding: '8px'}} name="noSptAsesor" value={formData.noSptAsesor || ''} onChange={handleInputChange} required placeholder="000.140D/..." />
                        </div>
                        <div>
                          <label style={{fontWeight:'bold', fontSize:'0.75rem', color:'#6b21a8', marginBottom: '6px', display: 'block'}}>Nomor Surat SPT Penyelia <span style={{color:'red'}}>*</span></label>
                          <input type="text" style={{width:'100%', border:'1px solid #e9d5ff', borderRadius:'6px', padding: '8px'}} name="noSptPenyelia" value={formData.noSptPenyelia || ''} onChange={handleInputChange} required placeholder="000.140D/..." />
                        </div>
                      </div>
                    )}

                    {showDetailKontrolSpt && (
                      <div style={{ padding: '15px', backgroundColor: '#f8fafc', border: '1px dashed #94a3b8', borderRadius: '8px' }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#334155', fontSize:'0.9rem' }}>Detail Kontrol Dokumen SPT</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>No. Dokumen</label><input type="text" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }} name="noDokumen" value={formData.noDokumen || ''} onChange={handleInputChange} required /></div>
                          <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Edisi / Revisi</label><input type="text" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }} name="edisiRevisi" value={formData.edisiRevisi || ''} onChange={handleInputChange} required /></div>
                          <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Tanggal Berlaku</label><input type="date" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }} name="tanggalBerlaku" value={formData.tanggalBerlaku || ''} onChange={handleInputChange} required /></div>
                          <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Halaman</label><input type="text" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }} name="halaman" value={formData.halaman || ''} onChange={handleInputChange} required /></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Button variant="secondary" onClick={() => setIsFormOpen(false)} style={{flex: 1}}>Batal</Button>
                    <Button type="submit" variant="primary" icon="print" style={{flex: 2, backgroundColor: '#10b981', color: '#fff', border: 'none'}}>
                      {isAlreadyGenerated ? 'Cetak Ulang Dokumen' : 'Cetak & Selesaikan'}
                    </Button>
                  </div>
                </form>
             </div>
           </div>
         </div>
      )}

      {/* MODAL PREVIEW SURAT PENGAJUAN (PDF DARI INSTANSI) FIX */}
      {viewPdf && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '800px', maxWidth: '90%', height: '80vh', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', display: 'flex', flexDirection: 'column', animation: 'zoomIn 0.2s ease-out' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0, color: '#0f172a', fontSize: '1.2rem'}}><i className="fas fa-file-pdf" style={{color: '#ef4444', marginRight: 8}}></i> {viewPdf}</h3>
               <button type="button" onClick={() => setViewPdf(null)} style={{background:'none', border:'none', fontSize:'1.8rem', cursor:'pointer', color: '#64748b'}}>&times;</button>
             </div>
             <div className="modal-body" style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fas fa-file-pdf" style={{ fontSize: '6rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#334155', margin: '0 0 5px 0' }}>Simulasi Penampil Dokumen</p>
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>Dokumen asli <strong>{viewPdf}</strong> yang diunggah oleh Instansi akan dirender di area ini.</p>
               </div>
             </div>
             <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                <Button variant="secondary" onClick={() => setViewPdf(null)}>Tutup Preview</Button>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default SuratMenyurat;