import React, { useState, useEffect, useMemo } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup'; 
import TablePeserta from '../TablePeserta/TablePeserta';  
import Pagination from '../../components/ui/Pagination'; 

const listSuratTugas = [
  { code: 'SPT.01', name: 'Surat Tugas Asesor', icon: 'fa-user-tie', target: 'asesor' },
  { code: 'SPT.02', name: 'Surat Tugas Penyelia', icon: 'fa-user-shield', target: 'penyelia' }
];

const listSuratPermohonan = [
  { code: 'SPM.01', name: 'Permohonan Asesor 1', icon: 'fa-user-tie', target: 'asesor1' },
  { code: 'SPM.02', name: 'Permohonan Asesor 2', icon: 'fa-user-tie', target: 'asesor2' },
  { code: 'SPM.03', name: 'Permohonan Penyelia', icon: 'fa-user-shield', target: 'penyelia' }
];

const listAdministrasi = [
  { code: 'DOC.00', name: 'Daftar Peserta Asesi', icon: 'fa-users' },
  { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' }
];

const listAdministrasiPleno = [
  { code: 'PLN.01', name: 'SK Pleno', icon: 'fa-certificate' },
  { code: 'PLN.02', name: 'BA Pleno', icon: 'fa-file-signature' },
  { code: 'PLN.03', name: 'Hasil Sidang Pleno', icon: 'fa-users' },
  { code: 'PLN.04', name: 'SK Penetapan Hasil', icon: 'fa-file-contract' },
  { code: 'PLN.05', name: 'Hasil Final', icon: 'fa-check-double' }
];

const SuratMenyurat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [selectedSurat, setSelectedSurat] = useState(null);
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

  const [isFromDashboard, setIsFromDashboard] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null); 

  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isFormOpen) { setIsFormOpen(false); e.preventDefault(); }
      else if (previewDokumen) { setPreviewDokumen(null); e.preventDefault(); }
      else if (activeSubMenu) { setActiveSubMenu(null); setActiveSubMenuKey(null); setSelectedSubDoc(null); e.preventDefault(); }
      else if (selectedSurat) { setSelectedSurat(null); e.preventDefault(); }
      else if (selectedUjkDetail) { 
         setSelectedUjkDetail(null); 
         e.preventDefault(); 
      }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isFormOpen, activeSubMenu, selectedSurat, selectedUjkDetail, previewDokumen]);

  // DATA DUMMY 8 DATA SINKRON 100%
  const [daftarSurat, setDaftarSurat] = useState([
    { id: 'UJK-001', nomorSurat: '088/BLK-SBY/IV/2026', anggaran: 'APBD', instansi: 'UPT BLK Surabaya', skema: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', tglMulai: '2026-04-28', tglSelesai: '2026-04-29', asesi: 16, status: 'Surat Diterbitkan', badge: 'success', tuk: 'UPT BLK Surabaya', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', docs: { balasan: true, spt: ['SPT.01', 'SPT.02'], permohonan: ['SPM.01', 'SPM.02', 'SPM.03'], administrasi: ['DOC.00', 'DOC.01'], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-002', nomorSurat: '045/BLK-SBY/IV/2026', anggaran: 'APBN', instansi: 'UPT BLK Surabaya', skema: 'Barista', bidang: 'Pariwisata', tglMulai: '2026-04-25', tglSelesai: '2026-04-26', asesi: 20, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Surabaya', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-003', nomorSurat: '055/BLK-SGS/IV/2026', anggaran: 'Mandiri', instansi: 'UPT BLK Singosari', skema: 'Desain Grafis', bidang: 'TIK', tglMulai: '2026-04-22', tglSelesai: '2026-04-23', asesi: 15, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Singosari', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-004', nomorSurat: '065/PTABC/IV/2026', anggaran: 'APBD', instansi: 'PT ABC Motor', skema: 'Teknisi Kendaraan Ringan', bidang: 'Otomotif', tglMulai: '2026-04-18', tglSelesai: '2026-04-19', asesi: 10, status: 'Surat Diterbitkan', badge: 'success', tuk: 'PT ABC Motor', asesor1: 'Endang Lestari', asesor2: 'Ahmad Fauzi', penyelia: 'Mohamad Andrian A', docs: { balasan: true, spt: ['SPT.01'], permohonan: ['SPM.01'], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-005', nomorSurat: '075/BLK-MDN/IV/2026', anggaran: 'APBN', instansi: 'UPT BLK Madiun', skema: 'Menjahit', bidang: 'Garmen', tglMulai: '2026-04-15', tglSelesai: '2026-04-16', asesi: 16, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Madiun', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-006', nomorSurat: '085/BLK-KDR/IV/2026', anggaran: 'Mandiri', instansi: 'UPT BLK Kediri', skema: 'Practical Office Advance', bidang: 'TIK', tglMulai: '2026-04-12', tglSelesai: '2026-04-13', asesi: 20, status: 'Surat Diterbitkan', badge: 'success', tuk: 'UPT BLK Kediri', asesor1: 'Risna Amalia', asesor2: 'Endang Lestari', penyelia: 'Budi Santoso', docs: { balasan: true, spt: ['SPT.01', 'SPT.02'], permohonan: ['SPM.01', 'SPM.02', 'SPM.03'], administrasi: ['DOC.01'], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-007', nomorSurat: '095/BLK-JBR/IV/2026', anggaran: 'APBD', instansi: 'UPT BLK Jember', skema: 'Budidaya Jamur', bidang: 'Pertanian', tglMulai: '2026-04-10', tglSelesai: '2026-04-11', asesi: 15, status: 'Menunggu Surat', badge: 'warning', tuk: 'UPT BLK Jember', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: [], permohonan: [], administrasi: [], administrasiPleno: [] }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-008', nomorSurat: '105/LKP-MTR/IV/2026', anggaran: 'APBN', instansi: 'LKP Mutiara', skema: 'Tata Rias', bidang: 'Kecantikan', tglMulai: '2026-04-05', tglSelesai: '2026-04-06', asesi: 12, status: 'Surat Diterbitkan', badge: 'success', tuk: 'LKP Mutiara', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', docs: { balasan: true, spt: ['SPT.01', 'SPT.02'], permohonan: ['SPM.01', 'SPM.02', 'SPM.03'], administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: [] }, savedForms: {}, pesertaList: [] }
  ]);

  useEffect(() => {
    if (location.state?.openDetailId) {
      setSearchTerm('');
      setFilterStatus('Semua Status');
      setHighlightedId(location.state.openDetailId);
      setCurrentPage(1);
      if (location.state.fromDashboard) setIsFromDashboard(true);
      window.history.replaceState({}, document.title); 
    }
  }, [location.state]);

  const filteredDaftar = daftarSurat.filter(item => {
    const matchSearch = item.skema.toLowerCase().includes(searchTerm.toLowerCase()) || item.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sortedDaftar = useMemo(() => {
    let sorted = [...filteredDaftar].sort((a, b) => {
      if (highlightedId) {
        if (a.id === highlightedId && b.id !== highlightedId) return -1;
        if (b.id === highlightedId && a.id !== highlightedId) return 1;
      }
      const aDate = new Date(a.tglMulai || '1970-01-01');
      const bDate = new Date(b.tglMulai || '1970-01-01');
      return bDate - aDate;
    });
    return sorted;
  }, [filteredDaftar, highlightedId]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedDaftar.length / itemsPerPage);
  const paginatedDaftar = sortedDaftar.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) setTimeout(() => setAlertConfig(null), 2500);
  };

  const handleDocClick = (jenisSurat, item, docKey) => {
    const normalizedItem = { ...item, hari1: item.hari1 || item.tglMulai, hari2: item.hari2 || item.tglSelesai, waktu: item.waktu || '08.00 WIB s/d Selesai' };
    
    if (['Administrasi', 'Surat Tugas', 'Surat Permohonan', 'Administrasi Pleno'].includes(jenisSurat)) {
      setActiveSubMenu(jenisSurat);
      setActiveSubMenuKey(docKey);
      setTargetUjk(normalizedItem); 
    } else {
      setTargetUjk(normalizedItem);
      setFormType(jenisSurat);
      setActiveDocKey('balasan');
      setSelectedSubDoc({ name: 'Surat Balasan', target: 'semua' });
      
      if (normalizedItem.savedForms && normalizedItem.savedForms['balasan']) {
        setFormData(normalizedItem.savedForms['balasan']);
      } else {
        setFormData({ noSurat: '000.140A/LSP BLK-SBY/V/2026', tanggalSurat: '2026-05-17', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '2026-05-17', noSptAsesor: '', noSptPenyelia: '' });
      }
      setIsFormOpen(true);
    }
  };

  const handleSubMenuClick = (doc) => {
    setTargetUjk(prev => ({ ...prev }));
    setFormType(activeSubMenu === 'Administrasi' || activeSubMenu === 'Administrasi Pleno' ? activeSubMenu : activeSubMenu);
    setActiveDocKey(doc.code);
    setSelectedSubDoc(doc);
    
    if (targetUjk.savedForms && targetUjk.savedForms[doc.code]) {
      setFormData(targetUjk.savedForms[doc.code]);
    } else {
      const defaultNoDokumen = activeSubMenu === 'Surat Tugas' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR-SER-01.2-LSP BLK-SBY';
      setFormData({ 
        noSurat: `000.140/${doc.code}/LSP BLK-SBY/V/2026`, 
        tanggalSurat: '2026-05-17', 
        noDokumen: defaultNoDokumen, 
        edisiRevisi: '01/00', 
        tanggalBerlaku: '2015-11-10', 
        halaman: '1 dari 1',
        tanggalVerif: '2026-05-17',
        noSptAsesor: '000.140D/LSP BLK-SBY/V/2026',
        noSptPenyelia: '000.140D/LSP BLK-SBY/V/2026'
      });
    }
    setIsFormOpen(true);
  };
  
  // LOGIKA NEMBAK API BACKEND GENERATE PDF
  const handleGenerateSurat = async (e) => {
    e.preventDefault();
    setIsFormOpen(false);
    
    setAlertConfig({ type: 'info', title: 'Memproses Dokumen...', text: 'Backend sedang membuat PDF, mohon tunggu sebentar...' });

    // SIMULASI SEMENTARA NUNGGU BACKEND (1.5 Detik)
    setTimeout(() => {
      setDaftarSurat(prev => prev.map(item => item.id === targetUjk.id ? { ...item, savedForms: { ...(item.savedForms || {}), [activeDocKey]: formData } } : item));
      setTargetUjk(prev => ({ ...prev, savedForms: { ...(prev.savedForms || {}), [activeDocKey]: formData } }));
      
      let docTypeKey = activeDocKey === 'balasan' ? 'balasan' : activeSubMenuKey;
      setDaftarSurat(prev => prev.map(item => {
        if (item.id === targetUjk.id) {
          if (docTypeKey === 'balasan') { return { ...item, docs: { ...item.docs, balasan: true } }; }
          else {
            const currentArray = item.docs[docTypeKey] || [];
            if (!currentArray.includes(activeDocKey)) { return { ...item, docs: { ...item.docs, [docTypeKey]: [...currentArray, activeDocKey] } }; }
          }
        }
        return item;
      }));

      // Dummy URL PDF dari internet untuk simulasi aja
      const dummyPdfFromBackend = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

      setPreviewDokumen({ 
        jenis: formType, 
        fileUrl: dummyPdfFromBackend, 
        docKey: activeDocKey, 
        dataUjk: targetUjk, 
        ujkId: targetUjk.id, 
        skemaId: targetUjk.id, 
        subDoc: selectedSubDoc 
      });

      setAlertConfig(null); // Tutup loading alert
    }, 1500);
  };

  const handleKirimApi = (target) => {
    setAlertConfig({ type: 'info', title: 'Sedang Mengirim...', text: `Mengirim dokumen ke ${target} melalui sistem...` });
    setTimeout(() => {
      // ==========================================
      // TODO: INTEGRASI API BKN/BLK UNTUK KIRIM (DI SINI)
      // ==========================================
      showAlert('success', 'Berhasil Dikirim!', `Dokumen telah berhasil dikirim ke ${target}.`);
      setPreviewDokumen(null);
    }, 1500);
  };

  const markDocAsDone = (idUjk, idSkema, docType) => {
    setDaftarSurat(prev => prev.map(item => {
      if (item.id === idUjk) {
        if (docType === 'balasan') { return { ...item, docs: { ...item.docs, balasan: true } }; }
        else {
          const currentArray = item.docs[docType] || [];
          if (!currentArray.includes(activeDocKey)) { return { ...item, docs: { ...item.docs, [docType]: [...currentArray, activeDocKey] } }; }
        }
      }
      return item;
    }));
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // LOGIKA HIDDEN FORM (Sembunyikan No Surat untuk dokumen tertentu)
  const isNoSuratHidden = ['DOC.01', 'DOC.02', 'DOC.06', 'DOC.07', 'DOC.08', 'DOC.09', 'DOC.10', 'DOC.11', 'DOC.12', 'PLN.02', 'PLN.03', 'PLN.05'].includes(activeDocKey);
  const isShowTanggalVerif = activeDocKey === 'DOC.13';
  const isShowSptFields = ['DOC.06', 'DOC.07', 'DOC.08'].includes(activeDocKey);
  
  // LOGIKA TOMBOL KIRIM
  let kirimTarget = null;
  if (previewDokumen?.docKey === 'balasan' || previewDokumen?.subDoc?.code === 'DOC.02') kirimTarget = 'Admin BLK & BKN';
  else if (['SPT.01', 'SPM.01', 'SPM.02'].includes(previewDokumen?.docKey)) kirimTarget = 'Asesor 1 & 2';
  else if (['SPT.02', 'SPM.03'].includes(previewDokumen?.docKey)) kirimTarget = 'Penyelia LSP';

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh' }}>
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={() => setAlertConfig(null)} onCancel={() => setAlertConfig(null)} />}

      {/* VIEW: PRATINJAU DOKUMEN DARI BACKEND DENGAN IFRAME */}
      {previewDokumen ? (
          <div className="print-preview-container" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>Pratinjau {previewDokumen.subDoc?.name || previewDokumen.jenis}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Dokumen dikelola oleh sistem Backend.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
                
                {kirimTarget && (
                  <button onClick={() => handleKirimApi(kirimTarget)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
                    <i className="fas fa-paper-plane"></i> Kirim ke {kirimTarget}
                  </button>
                )}

                {/* TOMBOL DOWNLOAD ASLI PAKAI TAG A KARENA DARI BACKEND */}
                <a 
                   href={previewDokumen.fileUrl} 
                   download={`Dokumen_${previewDokumen.docKey}.pdf`}
                   style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }}
                   onClick={() => {
                      if (previewDokumen?.docKey) {
                        const targetArray = ['Administrasi', 'Administrasi Pleno'].includes(previewDokumen.jenis) ? (previewDokumen.jenis === 'Administrasi Pleno' ? 'administrasiPleno' : 'administrasi') : previewDokumen.docKey;
                        markDocAsDone(previewDokumen.ujkId, previewDokumen.skemaId, targetArray);
                      }
                      showAlert('success', 'Berhasil Diunduh!', 'Dokumen PDF berhasil diunduh dan ditandai selesai.');
                   }}
                 >
                   <i className="fas fa-download"></i> Unduh PDF
                 </a>
              </div>
            </div>
            
            {/* RENDER PDF DENGAN IFRAME DARI URL BACKEND */}
            <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
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
                const isPrinted = selectedUjkDetail?.docs?.[activeSubMenuKey]?.includes(doc.code);
                return (
                  <button 
                    key={doc.code} type="button" onClick={() => handleSubMenuClick(doc)}
                    style={{ background: '#fff', border: isPrinted ? '1px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isPrinted ? '0 4px 6px rgba(16, 185, 129, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)', outline: 'none', width: '100%' }}
                  >
                    <div style={{ background: isPrinted ? '#ecfdf5' : '#eff6ff', color: isPrinted ? '#10b981' : '#2563eb', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', transition: 'all 0.2s ease' }}><i className={isPrinted ? "fas fa-check" : `fas ${doc.icon}`}></i></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', marginBottom: '4px' }}>{doc.code}</div><div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>{doc.name}</div></div>
                  </button>
                );
              })}
            </div>
          </div>

      /* VIEW: MANAJEMEN PENUGASAN (DETAIL ROW) */
      ) : selectedUjkDetail ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => { if (isFromDashboard) { navigate(-1); } else { setSelectedUjkDetail(null); }}}>
                {isFromDashboard ? 'Kembali ke Pemantauan' : 'Kembali ke Daftar'}
            </Button>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Penerbitan Dokumen UJK</h2>
              <p className="text-muted" style={{ margin: 0 }}>{selectedUjkDetail.id} - {selectedUjkDetail.instansi}</p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Asesor 1</div>
                  <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{selectedUjkDetail.asesor1 || '-'}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Asesor 2</div>
                  <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{selectedUjkDetail.asesor2 || '-'}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: '1. Surat Balasan', done: selectedUjkDetail.docs.balasan === true, key: 'balasan', type: 'Surat Balasan' },
                  { title: '2. Surat Tugas', done: selectedUjkDetail.docs.spt?.length === 2, key: 'spt', type: 'Surat Tugas' },
                  { title: '3. Srt. Permohonan', done: selectedUjkDetail.docs.permohonan?.length === 3, key: 'permohonan', type: 'Surat Permohonan' },
                  { title: '4. Administrasi', done: selectedUjkDetail.docs.administrasi?.length === 14, key: 'administrasi', type: 'Administrasi' },
                  { title: '5. Admin. Pleno', done: selectedUjkDetail.docs.administrasiPleno?.length === 5, key: 'administrasiPleno', type: 'Administrasi Pleno' },
                ].map(doc => (
                  <button 
                    key={doc.key} onClick={() => handleDocClick(doc.type, selectedUjkDetail, doc.key)}
                    style={{ width: '100%', textAlign: 'left', backgroundColor: '#fff', border: doc.done ? '1px solid #10b981' : '1px solid #3b82f6', padding: '10px 15px', borderRadius: '6px', color: doc.done ? '#10b981' : '#3b82f6', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <i className={doc.done ? "fas fa-check" : "fas fa-times"}></i> {doc.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      
      ) : (
        <div className="fade-in-content">
          
          {isFromDashboard && (
             <div style={{ marginBottom: '20px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => navigate(-1)} style={{borderColor: '#2563eb', color: '#2563eb'}}>
                  Kembali ke Pemantauan
                </Button>
             </div>
          )}

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
            </div>
            <div className="table-responsive" style={{ padding: '20px', overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th style={{ width: '5%', textAlign: 'center' }}>No.</th><th style={{ width: '25%' }}>Surat & Instansi</th><th style={{ width: '25%' }}>Skema & Bidang</th><th style={{ width: '20%' }}>Pelaksanaan & TUK</th><th style={{ width: '15%', textAlign: 'center' }}>Status</th><th style={{ width: '10%', textAlign: 'center' }}>Aksi</th></tr></thead>
                <tbody>
                  {paginatedDaftar.map((item, index) => {
                    const isHighlighted = highlightedId === item.id;
                    return (
                      <tr key={item.id} style={{ backgroundColor: isHighlighted ? '#fffbeb' : 'inherit', borderLeft: isHighlighted ? '4px solid #f59e0b' : 'none', transition: 'all 0.3s ease' }}>
                        <td style={{ textAlign: 'center', color: '#94a3b8' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td><strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.nomorSurat}</strong><small className="text-muted"><i className="fas fa-building"></i> {item.instansi}</small></td>
                        <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.skema}</span><small className="text-muted" style={{ display: 'block' }}>{item.bidang}</small></td>
                        <td><span style={{ fontWeight: '600', color: '#334155' }}><i className="far fa-calendar-alt text-muted" style={{marginRight: '4px'}}></i> {item.tglMulai}</span><small className="text-muted" style={{ display: 'block' }}>{item.tuk}</small></td>
                        <td style={{ textAlign: 'center' }}><span className={`badge ${item.badge}`}>{item.status}</span></td>
                        <td style={{ textAlign: 'center' }}><Button variant="primary" size="sm" onClick={() => setSelectedUjkDetail(item)}>Kelola</Button></td>
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
                  
                  {/* KOLOM NO SURAT DISEMBUNYIKAN UNTUK 9 DOKUMEN & PLENO TERTENTU */}
                  {!isNoSuratHidden && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569'}}>Nomor Surat LSP <span style={{color:'red'}}>*</span></label>
                      <input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required />
                    </div>
                  )}

                  {/* KOLOM TANGGAL SURAT / BERITA ACARA */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569'}}>Tanggal {activeDocKey === 'DOC.02' ? 'Berita Acara' : 'Dikeluarkan Surat'}</label>
                    <input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required />
                  </div>
                  
                  {/* KHUSUS RENCANA VERIFIKASI TUK (DOC.13) */}
                  {isShowTanggalVerif && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569'}}>Tanggal Verifikasi TUK <span style={{color:'red'}}>*</span></label>
                      <input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalVerif" value={formData.tanggalVerif || ''} onChange={handleInputChange} required />
                    </div>
                  )}

                  {/* KHUSUS DAFTAR HADIR (DOC.06, 07, 08) WAJIB NOMOR SPT ASESOR & PENYELIA */}
                  {isShowSptFields && (
                    <div style={{ padding: '15px', backgroundColor: '#fdf4ff', border: '1px dashed #d8b4fe', borderRadius: '8px', marginBottom: '20px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{fontWeight:'bold', fontSize:'0.75rem', color:'#475569'}}>No. Surat SPT Asesor <span style={{color:'red'}}>*</span></label>
                        <input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '8px'}} name="noSptAsesor" value={formData.noSptAsesor || ''} onChange={handleInputChange} required placeholder="000.140D/..." />
                      </div>
                      <div>
                        <label style={{fontWeight:'bold', fontSize:'0.75rem', color:'#475569'}}>No. Surat SPT Penyelia <span style={{color:'red'}}>*</span></label>
                        <input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '8px'}} name="noSptPenyelia" value={formData.noSptPenyelia || ''} onChange={handleInputChange} required placeholder="000.140D/..." />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Button variant="secondary" onClick={() => setIsFormOpen(false)} style={{flex: 1}}>Batal</Button>
                    <Button type="submit" variant="primary" icon="magic" style={{flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none'}}>Generate PDF</Button>
                  </div>
                </form>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default SuratMenyurat;