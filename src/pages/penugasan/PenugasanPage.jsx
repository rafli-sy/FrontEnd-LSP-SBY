import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination';
import TablePeserta from '../TablePeserta/TablePeserta'; 

import './PenugasanPage.css';

// === DATA MASTER ===
const masterAsesor = [
  { id: 1, nama: 'Endang Lestari', noReg: 'MET.011411 2019', bidang: 'Garmen', skema: ['Menjahit'], load1Tahun: 2, status: 'Available' },
  { id: 2, nama: 'Ahmad Fauzi', noReg: 'MET.123456 2020', bidang: 'Pariwisata', skema: ['Barista', 'Pembuatan Roti Dan Kue'], load1Tahun: 0, status: 'Available' },
  { id: 3, nama: 'Kartika Nova Wahyuni', noReg: 'MET.005313 2018', bidang: 'Pariwisata', skema: ['Pembuatan Roti Dan Kue'], load1Tahun: 6, status: 'Available' },
  { id: 4, nama: 'Risna Amalia', noReg: 'MET.003697 2013', bidang: 'TIK', skema: ['Practical Office Advance'], load1Tahun: 12, status: 'Sedang Bertugas' },
  { id: 5, nama: 'Budi Santoso', noReg: 'MET.999888 2021', bidang: 'Pariwisata', skema: ['Barista'], load1Tahun: 8, status: 'Available' },
];

const daftarPenyelia = ['Miftahul Huda', 'Mohamad Andrian A', 'Budi Santoso'];
const listBidang = [...new Set(masterAsesor.map(a => a.bidang))].filter(Boolean);
const listSkema = [...new Set(masterAsesor.flatMap(a => a.skema || []))].filter(Boolean);

const formatTgl = (tgl) => {
  if (!tgl) return '-';
  const parts = tgl.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return tgl;
};

const PenugasanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // === 8 DATA DUMMY SINKRON ===
  const [antreanSurat, setAntreanSurat] = useState([
    { idUjk: 'UJK-001', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBD', skemaList: [{ idSkema: 'S-1', judul: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', jenis: 'Klaster', asesi: 16, hari1: '2026-04-28', hari2: '2026-04-29', tuk: 'UPT BLK Surabaya', waktu: '08.00 WIB s/d selesai', asesor1: 'Kartika Nova Wahyuni', noReg1: 'MET.005313 2018', asesor2: 'Hari Emijuniati', noReg2: 'MET.011411 2019', penyelia: 'Miftahul Huda', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-002', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBN', skemaList: [{ idSkema: 'S-2', judul: 'Barista', bidang: 'Pariwisata', jenis: 'Klaster', asesi: 20, hari1: '2026-04-25', hari2: '2026-04-26', tuk: 'UPT BLK Surabaya', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-003', pengusul: 'UPT BLK Singosari', pendanaan: 'Mandiri', skemaList: [{ idSkema: 'S-3', judul: 'Desain Grafis', bidang: 'TIK', jenis: 'Klaster', asesi: 15, hari1: '2026-04-22', hari2: '2026-04-23', tuk: 'UPT BLK Singosari', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-004', pengusul: 'PT ABC Motor', pendanaan: 'APBD', skemaList: [{ idSkema: 'S-4', judul: 'Teknisi Kendaraan Ringan', bidang: 'Otomotif', jenis: 'Klaster', asesi: 10, hari1: '2026-04-18', hari2: '2026-04-19', tuk: 'PT ABC Motor', waktu: '08.00 WIB s/d selesai', asesor1: 'Endang Lestari', noReg1: 'MET.011411 2019', asesor2: 'Ahmad Fauzi', noReg2: 'MET.123456 2020', penyelia: 'Mohamad Andrian A', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: [], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-005', pengusul: 'UPT BLK Madiun', pendanaan: 'APBN', skemaList: [{ idSkema: 'S-5', judul: 'Menjahit', bidang: 'Garmen', jenis: 'Klaster', asesi: 16, hari1: '2026-04-15', hari2: '2026-04-16', tuk: 'UPT BLK Madiun', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-006', pengusul: 'UPT BLK Kediri', pendanaan: 'Mandiri', skemaList: [{ idSkema: 'S-6', judul: 'Practical Office Advance', bidang: 'TIK', jenis: 'Klaster', asesi: 20, hari1: '2026-04-12', hari2: '2026-04-13', tuk: 'UPT BLK Kediri', waktu: '08.00 WIB s/d selesai', asesor1: 'Risna Amalia', noReg1: 'MET.003697 2013', asesor2: 'Endang Lestari', noReg2: 'MET.011411 2019', penyelia: 'Budi Santoso', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02', 'DOC.03'], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-007', pengusul: 'UPT BLK Jember', pendanaan: 'APBD', skemaList: [{ idSkema: 'S-7', judul: 'Budidaya Jamur', bidang: 'Pertanian', jenis: 'Klaster', asesi: 15, hari1: '2026-04-10', hari2: '2026-04-11', tuk: 'UPT BLK Jember', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [], administrasiPleno: [] }, savedForms: {} }] },
    { idUjk: 'UJK-008', pengusul: 'LKP Mutiara', pendanaan: 'APBN', skemaList: [{ idSkema: 'S-8', judul: 'Tata Rias', bidang: 'Kecantikan', jenis: 'Klaster', asesi: 12, hari1: '2026-04-05', hari2: '2026-04-06', tuk: 'LKP Mutiara', waktu: '08.00 WIB s/d selesai', asesor1: 'Kartika Nova Wahyuni', noReg1: 'MET.005313 2018', asesor2: 'Hari Emijuniati', noReg2: 'MET.011411 2019', penyelia: 'Miftahul Huda', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'], administrasiPleno: [] }, savedForms: {} }] }
  ]);

  const [selectedPenugasan, setSelectedPenugasan] = useState(null); 
  const [editingId, setEditingId] = useState(null); 
  const [editData, setEditData] = useState({});
  const [viewPesertaUjk, setViewPesertaUjk] = useState(null); 

  const [isAsesorModalOpen, setIsAsesorModalOpen] = useState(false);
  const [asesorTargetRole, setAsesorTargetRole] = useState(''); 
  const [filterBidang, setFilterBidang] = useState('');
  const [filterSkema, setFilterSkema] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null); 
  const [selectedUjk, setSelectedUjk] = useState(null);
  const [activeDocKey, setActiveDocKey] = useState(null);
  const [selectedSubDoc, setSelectedSubDoc] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null); 
  const [activeSubMenuKey, setActiveSubMenuKey] = useState(null);

  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '', noSptAsesor: '', noSptPenyelia: '' });
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewAdminUjk, setViewAdminUjk] = useState(null);
  const [selectedAdminDoc, setSelectedAdminDoc] = useState(null);

  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });
  
  const [isFromDashboard, setIsFromDashboard] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  // DAFTAR SURAT MENU DAN SUB-MENU
  const listSuratTugas = [ { code: 'SPT.01', name: 'Surat Tugas Asesor', icon: 'fa-user-tie', target: 'asesor' }, { code: 'SPT.02', name: 'Surat Tugas Penyelia', icon: 'fa-user-shield', target: 'penyelia' } ];
  const listSuratPermohonan = [ { code: 'SPM.01', name: 'Permohonan Asesor 1', icon: 'fa-user-tie', target: 'asesor1' }, { code: 'SPM.02', name: 'Permohonan Asesor 2', icon: 'fa-user-tie', target: 'asesor2' }, { code: 'SPM.03', name: 'Permohonan Penyelia', icon: 'fa-user-shield', target: 'penyelia' } ];
  const listAdministrasi = [ { code: 'DOC.00', name: 'Daftar Peserta Asesi', icon: 'fa-users' }, { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' } ];
  const listAdministrasiPleno = [ { code: 'PLN.01', name: 'SK Pleno', icon: 'fa-certificate' }, { code: 'PLN.02', name: 'BA Pleno', icon: 'fa-file-signature' }, { code: 'PLN.03', name: 'Hasil Sidang Pleno', icon: 'fa-users' }, { code: 'PLN.04', name: 'SK Penetapan Hasil', icon: 'fa-file-contract' }, { code: 'PLN.05', name: 'Hasil Final', icon: 'fa-check-double' } ];

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
      else if (viewPesertaUjk) { setViewPesertaUjk(null); e.preventDefault(); }
      else if (previewDokumen) {
        if ((previewDokumen.jenis === 'Administrasi' || previewDokumen.jenis === 'Administrasi Pleno') && !selectedAdminDoc) {
          setPreviewDokumen(null);
        } else if (selectedAdminDoc) {
          setSelectedAdminDoc(null);
        } else {
          setPreviewDokumen(null);
        }
        e.preventDefault();
      }
      else if (activeSubMenu) { setActiveSubMenu(null); setActiveSubMenuKey(null); setSelectedSubDoc(null); e.preventDefault(); }
      else if (selectedPenugasan) { 
        setSelectedPenugasan(null); 
        setEditingId(null); 
        e.preventDefault(); 
      }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isAsesorModalOpen, isFormOpen, viewPesertaUjk, previewDokumen, selectedAdminDoc, selectedPenugasan, activeSubMenu]);

  useEffect(() => {
    if (location.state?.openDetailId) {
      setSearchTerm('');
      setFilterStatus('Semua');
      setHighlightedId(location.state.openDetailId);
      setCurrentPage(1); 
      if (location.state.fromDashboard) setIsFromDashboard(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const filteredUsulan = antreanSurat.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = item.idUjk.toLowerCase().includes(term) || item.pengusul.toLowerCase().includes(term) || item.skemaList.some(s => s.judul.toLowerCase().includes(term));
    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
    const statusSuratGlobal = isSemuaDiplot ? 'Selesai Diplot' : 'Sedang Diproses';
    const matchStatus = filterStatus === 'Semua' || statusSuratGlobal === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const sortedUsulan = useMemo(() => {
    let sorted = [...filteredUsulan].sort((a, b) => {
      if (highlightedId) {
        if (a.idUjk === highlightedId && b.idUjk !== highlightedId) return -1;
        if (b.idUjk === highlightedId && a.idUjk !== highlightedId) return 1;
      }
      const aDate = new Date(a.skemaList[0]?.hari1 || '1970-01-01');
      const bDate = new Date(b.skemaList[0]?.hari1 || '1970-01-01');
      return bDate - aDate;
    });
    return sorted;
  }, [filteredUsulan, highlightedId]);

  const totalPages = Math.ceil(sortedUsulan.length / itemsPerPage);
  const paginatedUsulan = sortedUsulan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2500);
  };

  const handleConfirmAlert = () => { if (alertConfig.action) alertConfig.action(); setAlertConfig({ type: null, title: '', text: '', action: null }); };
  const handleCancelAlert = () => setAlertConfig({ type: null, title: '', text: '', action: null });

  const handleOpenAsesorModal = (role, bidangUjk, skemaUjk) => { setAsesorTargetRole(role); setFilterBidang(bidangUjk || ''); setFilterSkema(skemaUjk || ''); setIsAsesorModalOpen(true); };
  const handlePilihAsesor = (asesor) => {
    if (asesorTargetRole === 'penyelia') {
      setEditData(prev => ({ ...prev, penyelia: asesor?.nama || '' }));
      setIsAsesorModalOpen(false);
      return;
    }
    if (!asesor || !asesor.nama) {
      setEditData(prev => ({ ...prev, [asesorTargetRole]: '', [`noReg${asesorTargetRole === 'asesor1' ? '1' : '2'}`]: '' }));
      setIsAsesorModalOpen(false);
      return;
    }
    if (asesor.status !== 'Available') { showAlert('warning', 'Akses Ditolak', 'Asesor sedang bertugas! Pilih asesor yang Available.'); return; }
    setEditData(prev => ({ ...prev, [asesorTargetRole]: asesor.nama, [`noReg${asesorTargetRole === 'asesor1' ? '1' : '2'}`]: asesor.noReg }));
    setIsAsesorModalOpen(false);
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filteredAsesors = useMemo(() => {
    try { 
      return masterAsesor.filter(a => {
        const matchBidang = filterBidang ? (a.bidang || '').toLowerCase() === filterBidang.toLowerCase() : true;
        const matchSkema = filterSkema ? (a.skema || []).some(s => (s || '').toLowerCase() === filterSkema.toLowerCase()) : true;
        return matchBidang && matchSkema;
      }).sort((a, b) => (a.load1Tahun || 0) - (b.load1Tahun || 0)); 
    } catch (error) { return []; }
  }, [filterBidang, filterSkema]);

  const handleGoToPeserta = (skema) => {
    const dummyPeserta = Array.from({ length: skema.asesi || 10 }).map((_, i) => ({ id: i + 1, nama: `Peserta Nominatif ${i + 1}`, nik: `35780000000000${i}`, jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', pendidikan: 'SMK' }));
    setViewPesertaUjk({ ...skema, peserta: dummyPeserta });
  };

  const handleMulaiPlotting = (skema) => { setEditingId(skema.idSkema); setEditData({ ...skema }); };
  const handleBatalEdit = () => setEditingId(null);

  const handleSimpanPlotting = () => {
    if (!editData.asesor1 || !editData.penyelia || !editData.hari1 || !editData.hari2 || !editData.tuk) { 
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan Lokasi TUK, Tanggal Ujian, Asesor 1, dan Penyelia telah terisi semua.'); return; 
    }
    showAlert('save', 'Simpan Plotting', 'Apakah Anda yakin ingin menetapkan jadwal dan tim asesor ini?', () => {
      setAntreanSurat(prev => prev.map(surat => {
        if (surat.idUjk === selectedPenugasan.idUjk) {
          return {
            ...surat,
            skemaList: surat.skemaList.map(s => s.idSkema === editingId ? { ...editData, isPlotted: true, status: 'Selesai Diplot' } : s)
          };
        }
        return surat;
      }));
      setEditingId(null); 
      showAlert('success', 'Plotting Berhasil', 'Plotting Asesor dan Jadwal berhasil disimpan!');
    });
  };

  const handleTolakSkema = (idUjk, idSkema) => {
    setAlertConfig({
       type: 'delete', title: 'Tolak Skema?', text: 'Apakah Anda yakin menolak pengajuan untuk skema ini? Data akan dihapus secara permanen.',
       onConfirm: () => {
          setAntreanSurat(prev => {
            const updated = prev.map(surat => {
               if(surat.idUjk === idUjk) {
                  return { ...surat, skemaList: surat.skemaList.filter(s => s.idSkema !== idSkema) };
               }
               return surat;
            }).filter(surat => surat.skemaList.length > 0);
            return updated;
          });
          setAlertConfig({ type: 'success', title: 'Berhasil Ditolak', text: 'Skema telah dihapus dari penugasan.', onConfirm: () => setAlertConfig({ type: null }) });
       },
       onCancel: () => setAlertConfig({ type: null })
    });
  };

  const checkBentrok = (jadwalSibuk = [], tglMulaiUjian, tglSelesaiUjian, currentTuk) => { 
    if (!tglMulaiUjian || !tglSelesaiUjian) return false; 
    return jadwalSibuk.some(sibuk => (new Date(tglMulaiUjian) <= new Date(sibuk.tglSelesai)) && (new Date(sibuk.tglMulai) <= new Date(tglSelesaiUjian)) && sibuk.tuk !== currentTuk ); 
  };

  const handleDocClick = (jenisSurat, suratItem, skemaItem, docKey) => {
    if (!skemaItem.isPlotted) { showAlert('warning', 'Terkunci', 'Lengkapi Plotting Jadwal & Asesor terlebih dahulu.'); return; }
    
    const normalizedSkema = { ...skemaItem, skema: skemaItem.judul, hari1: skemaItem.hari1 || 'Belum Diatur', hari2: skemaItem.hari2 || 'Belum Diatur', waktu: skemaItem.waktu || '08.00 WIB s/d Selesai' };

    if (['Administrasi', 'Administrasi Pleno', 'Surat Tugas', 'Surat Permohonan'].includes(jenisSurat)) {
      if (jenisSurat === 'Administrasi' || jenisSurat === 'Administrasi Pleno') {
        const adminData = { ...normalizedSkema, tuk: skemaItem.tuk, pengusul: suratItem.pengusul, idUjk: suratItem.idUjk };
        setViewAdminUjk(adminData);
        setSelectedAdminDoc(null);
        setPreviewDokumen({ jenis: jenisSurat, dataUjk: adminData, ujkId: suratItem.idUjk, skemaId: skemaItem.idSkema });
      } else {
        setSelectedUjk({ surat: suratItem, skema: normalizedSkema }); 
        setActiveSubMenu(jenisSurat);
        setActiveSubMenuKey(docKey);
      }
    } else {
      setSelectedUjk({ surat: suratItem, skema: normalizedSkema }); 
      setFormType(jenisSurat);
      setActiveDocKey(docKey);
      
      if (skemaItem.savedForms && skemaItem.savedForms[docKey]) {
        setFormData(skemaItem.savedForms[docKey]);
      } else {
        setFormData({ noSurat: `000.140A/LSP BLK-SBY/V/2026`, tanggalSurat: '2026-05-17', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '', tanggalVerif: '', noSptAsesor: '', noSptPenyelia: '' });
      }
      setIsFormOpen(true);
    }
  };

  const handleSubMenuClick = (doc) => {
    setFormType(activeSubMenu);
    setActiveDocKey(doc.code);
    setSelectedSubDoc(doc);
    
    if (selectedUjk.skema.savedForms && selectedUjk.skema.savedForms[doc.code]) {
      setFormData(selectedUjk.skema.savedForms[doc.code]);
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

    // ==========================================
    // TODO: INTEGRASI API BACKEND (BKN / DATABASE)
    /*
    try {
      const response = await axios.post('/api/backend/generate-surat', {
        id_ujk: targetUjk.id,
        jenis_surat: activeDocKey,
        data_form: formData
      }, { responseType: 'blob' });
      
      const fileUrl = URL.createObjectURL(response.data);
    } catch (error) { ... }
    */
    // ==========================================

    // SIMULASI SEMENTARA NUNGGU BACKEND (1.5 Detik)
    setTimeout(() => {
      setAntreanSurat(prev => prev.map(surat => {
        if (surat.idUjk === selectedUjk.surat.idUjk) {
          return { ...surat, skemaList: surat.skemaList.map(s => s.idSkema === selectedUjk.skema.idSkema ? { ...s, savedForms: { ...(s.savedForms || {}), [activeDocKey]: formData } } : s) };
        }
        return surat;
      }));
  
      setSelectedUjk(prev => ({
         ...prev, 
         skema: { ...prev.skema, savedForms: { ...(prev.skema.savedForms || {}), [activeDocKey]: formData } }
      }));
  
      // PDF Dummy sebagai placeholder url dari Backend
      const dummyPdfFromBackend = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      
      setPreviewDokumen({ 
        jenis: formType, 
        fileUrl: dummyPdfFromBackend,
        docKey: activeDocKey, 
        dataUjk: selectedUjk.skema, 
        ujkId: selectedUjk.surat.idUjk, 
        skemaId: selectedUjk.skema.idSkema, 
        subDoc: selectedSubDoc 
      });

      setAlertConfig(null);
    }, 1500);
  };

  const handleKirimApi = (target) => {
    setAlertConfig({ type: 'info', title: 'Sedang Mengirim...', text: `Mengirim dokumen ke ${target} melalui sistem...` });
    setTimeout(() => {
      // ==========================================
      // TODO: INTEGRASI API BKN/BLK UNTUK KIRIM
      // ==========================================
      showAlert('success', 'Berhasil Dikirim!', `Dokumen telah berhasil dikirim ke ${target}.`);
      setPreviewDokumen(null);
    }, 1500);
  };

  const markDocAsDone = (idUjk, idSkema, docType) => {
    setAntreanSurat(prev => prev.map(surat => {
      if (surat.idUjk === idUjk) return { ...surat, skemaList: surat.skemaList.map(s => s.idSkema === idSkema ? { ...s, statusSurat: { ...s.statusSurat, [docType]: true } } : s) };
      return surat;
    }));
  };

  const getDocButtonStyle = (isPlotted, isDone) => {
    if (!isPlotted) return { background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8', cursor: 'not-allowed' };
    if (isDone) return { background: '#ffffff', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', opacity: 1 };
    return { background: '#ffffff', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', opacity: 1 };
  };

  const getDocIconInfo = (isPlotted, isDone) => {
    if (!isPlotted) return { class: 'fa-lock', bg: '#f1f5f9', color: '#94a3b8' };
    if (isDone) return { class: 'fa-check', bg: '#ecfdf5', color: '#10b981' };
    return { class: 'fa-times', bg: '#eff6ff', color: '#3b82f6' };
  };

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
    <div className="dashboard-content fade-in-content" style={{ backgroundColor: '#f4f7fb', padding: '20px', minHeight: '100vh', position: 'relative' }}>
      
      {alertConfig?.type && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />}
      
      {/* VIEW: DATA PESERTA */}
      {viewPesertaUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setViewPesertaUjk(null)}>Kembali</Button>
            <div><h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Nominatif Asesi</h2><p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPesertaUjk.judul}</strong></p></div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}><TablePeserta dataPeserta={viewPesertaUjk.peserta || []} skemaName={viewPesertaUjk.judul} /></div>
        </div>

      /* VIEW: PRATINJAU DOKUMEN DARI BACKEND DENGAN IFRAME */
      ) : previewDokumen ? (
          <div className="print-preview-container" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>Pratinjau {previewDokumen.subDoc?.name || previewDokumen.jenis}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Dokumen dikelola oleh sistem Backend.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { (previewDokumen.jenis === 'Administrasi' || previewDokumen.jenis === 'Administrasi Pleno') ? setSelectedAdminDoc(null) : setPreviewDokumen(null); }}>Kembali</Button>
                
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
            
            {/* GRID RESPONSIVE & RAPI KE TENGAH */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', width: '100%' }}>
              {(activeSubMenu === 'Surat Tugas' ? listSuratTugas : activeSubMenu === 'Surat Permohonan' ? listSuratPermohonan : activeSubMenu === 'Administrasi Pleno' ? listAdministrasiPleno : listAdministrasi).map(doc => {
                const activeSurat = antreanSurat.find(s => s.idUjk === selectedUjk?.surat?.idUjk);
                const activeSkema = activeSurat?.skemaList.find(s => s.idSkema === selectedUjk?.skema?.idSkema);
                const isPrinted = activeSkema?.statusSurat?.[activeSubMenuKey]?.includes(doc.code);
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
      ) : selectedPenugasan ? (
        (() => {
          const activeSurat = antreanSurat.find(item => item.idUjk === selectedPenugasan.idUjk);
          if (!activeSurat) return null;

          return (
            <div className="fade-in-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { if (isFromDashboard) { navigate(-1); } else { setSelectedPenugasan(null); setEditingId(null); }}}>
                  {isFromDashboard ? 'Kembali ke Pemantauan' : 'Kembali ke Daftar'}
                </Button>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Manajemen Penugasan UJK</h2>
                  <p className="text-muted" style={{ margin: 0 }}>{activeSurat.idUjk} - {activeSurat.pengusul}</p>
                </div>
              </div>

              {activeSurat.skemaList.map((skema) => {
                const isEditing = editingId === skema.idSkema;
                const isFullyPlotted = skema.isPlotted; 

                return (
                  <div key={skema.idSkema} className="dashboard-card" style={{ backgroundColor: '#fff', border: isEditing ? '2px solid #3b82f6' : '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <span style={{ backgroundColor: '#1e293b', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{activeSurat.idUjk}</span>
                         <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' }}>{activeSurat.pendanaan}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {!isFullyPlotted ? <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-exclamation-triangle"></i> Belum Di-plot</span> :
                         !isEditing && <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-check-circle"></i> Selesai Di-plot</span>}
                      </div>
                    </div>

                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>{skema.judul}</h4>
                    <p className="text-muted" style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>{skema.bidang || skema.kejuruan} <span style={{margin: '0 5px'}}>|</span> {skema.jenis}</p>
                    
                    {/* GRID RESPONSIVE */}
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
                          <div><div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Peserta Ujian</div><div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>{skema.asesi} Asesi <button onClick={() => handleGoToPeserta(skema)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#3b82f6', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 8px', fontWeight: 'bold' }}>Lihat Data</button></div></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      <div>
                        {isEditing ? (
                          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '800' }}><i className="fas fa-map-marker-alt"></i> Lokasi & Tanggal Pelaksanaan</h5>
                            <div style={{ marginBottom: '15px' }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Lokasi Ujian (TUK)</label><input type="text" name="tuk" value={editData.tuk || ''} onChange={handleEditChange} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} /></div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                              <div style={{ flex: 1 }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Mulai Asesmen</label><input type="date" name="hari1" value={editData.hari1 || ''} onChange={handleEditChange} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} /></div>
                              <div style={{ flex: 1 }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Selesai Asesmen</label><input type="date" name="hari2" value={editData.hari2 || ''} onChange={handleEditChange} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} /></div>
                            </div>
                            
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '800' }}><i className="fas fa-users-cog"></i> Plotting Tim</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Asesor 1</label><Button variant="outline" icon="user-tie" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('asesor1', editData.bidang || editData.kejuruan, editData.judul); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.asesor1 || 'Pilih Asesor 1...'}</Button></div>
                              <div><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Asesor 2</label><Button variant="outline" icon="user-tie" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('asesor2', editData.bidang || editData.kejuruan, editData.judul); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.asesor2 || 'Pilih Asesor 2...'}</Button></div>
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
                                  <button onClick={() => handleTolakSkema(activeSurat.idUjk, skema.idSkema)} style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}><i className="fas fa-times-circle"></i> Tolak</button>
                               </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {!isEditing && (
                          <>
                            {[
                              { id: 'balasan', title: '1. Surat Balasan', status: skema.statusSurat?.balasan, key: 'balasan', type: 'Surat Balasan' },
                              { id: 'tugas', title: '2. Surat Tugas', status: skema.statusSurat?.tugas, key: 'spt', type: 'Surat Tugas' },
                              { id: 'permohonan', title: '3. Srt. Permohonan', status: skema.statusSurat?.permohonan, key: 'permohonan', type: 'Surat Permohonan' },
                              { id: 'administrasi', title: '4. Administrasi', status: skema.statusSurat?.administrasi?.length === 13, key: 'administrasi', type: 'Administrasi' },
                              { id: 'administrasiPleno', title: '5. Admin. Pleno', status: skema.statusSurat?.administrasiPleno?.length === 5, key: 'administrasiPleno', type: 'Administrasi Pleno' }
                            ].map(doc => {
                              const style = getDocButtonStyle(isFullyPlotted, doc.status);
                              const icon = getDocIconInfo(isFullyPlotted, doc.status);
                              return (
                                <button key={doc.id} disabled={!isFullyPlotted} onClick={() => handleDocClick(doc.type, activeSurat, skema, doc.key)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', transition: '0.2s', ...style }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: icon.bg, color: icon.color }}><i className={`fas ${icon.class}`}></i></div>
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
                <thead><tr><th style={{ width: '5%', textAlign: 'center' }}>No.</th><th style={{ width: '20%' }}>ID Surat & Instansi</th><th style={{ width: '10%', textAlign: 'center' }}>Srt. Pengajuan</th><th style={{ width: '25%' }}>Daftar Skema</th><th style={{ width: '20%' }}>Pelaksanaan & TUK</th><th style={{ width: '10%', textAlign: 'center' }}>Status Global</th><th style={{ width: '10%', textAlign: 'center' }}>Aksi</th></tr></thead>
                <tbody>
                  {paginatedUsulan.map((item, index) => {
                    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted);
                    const isHighlighted = highlightedId === item.idUjk;
                    return (
                    <tr key={item.idUjk} style={{ backgroundColor: isHighlighted ? '#fffbeb' : 'inherit', borderLeft: isHighlighted ? '4px solid #f59e0b' : 'none', transition: 'all 0.3s ease' }}>
                      <td style={{ textAlign: 'center', color: '#94a3b8', verticalAlign: 'top', paddingTop: '20px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td style={{ verticalAlign: 'top', paddingTop: '20px' }}><strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.idUjk}</strong><small className="text-muted"><i className="fas fa-building"></i> {item.pengusul}</small></td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}><Button variant="outline" size="sm" icon="file-pdf" onClick={() => setViewPdf('Surat Pengajuan')}>Lihat</Button></td>
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
                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}><Button variant="primary" size="sm" onClick={() => { setSelectedPenugasan(item); setEditingId(null); }}>Kelola Plotting</Button></td>
                    </tr>
                    );
                  })}
                  {paginatedUsulan.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Tidak ada data penugasan.</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredUsulan.length} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      )}

      {/* MODAL PILIH ASESOR */}
      {isAsesorModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content modal-large" style={{ display: 'flex', flexDirection: 'column', padding: 0, width: '100%', maxWidth: '700px' }}>
            <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}><h3 style={{ margin: 0 }}><i className="fas fa-filter text-blue"></i> Pilih {asesorTargetRole === 'asesor1' ? 'Asesor 1' : asesorTargetRole === 'asesor2' ? 'Asesor 2' : 'Penyelia LSP'}</h3></div>
            <div className="modal-body" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              {asesorTargetRole !== 'penyelia' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Filter Bidang</label><select value={filterBidang} onChange={(e) => setFilterBidang(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}><option value="">-- Semua Bidang --</option>{listBidang.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Filter Skema</label><select value={filterSkema} onChange={(e) => setFilterSkema(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}><option value="">-- Semua Skema --</option>{listSkema.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
              )}
              <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead><tr><th style={{ width: '50px', textAlign: 'center' }}>Pilih</th><th>{asesorTargetRole === 'penyelia' ? 'Nama Penyelia' : 'Nama Asesor'}</th>{asesorTargetRole !== 'penyelia' && <th>No. Registrasi</th>}{asesorTargetRole !== 'penyelia' && <th>Status Jadwal</th>}</tr></thead>
                  <tbody>
                    {asesorTargetRole === 'penyelia' ? daftarPenyelia.map((penyelia, idx) => {
                        const isChecked = editData.penyelia === penyelia;
                        return (<tr key={idx} style={{ backgroundColor: isChecked ? '#f0fdf4' : 'inherit' }}><td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor({ nama: penyelia })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /></td><td><strong>{penyelia}</strong></td></tr>);
                      }) : filteredAsesors.map(asesor => {
                        const isBentrok = checkBentrok(asesor.jadwalSibuk, editData.hari1, editData.hari2, editData.tuk);
                        const isChecked = editData[asesorTargetRole] === asesor.nama;
                        return (<tr key={asesor.id} style={{ backgroundColor: isBentrok ? '#fee2e2' : isChecked ? '#f0fdf4' : 'inherit' }}><td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor(asesor)} disabled={isBentrok} style={{ width: '18px', height: '18px', cursor: isBentrok ? 'not-allowed' : 'pointer' }} /></td><td><strong>{asesor.nama}</strong><br/><small className="text-muted">Beban: {asesor.load1Tahun} UJK</small></td><td className="text-muted">{asesor.noReg}</td><td>{isBentrok ? <span className="badge danger"><i className="fas fa-times-circle"></i> Bentrok TUK Lain</span> : <span className="badge success"><i className="fas fa-check-circle"></i> Tersedia</span>}</td></tr>);
                      })}
                  </tbody>
                </table>
              </div>
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

                  {/* KHUSUS SURAT TUGAS */}
                  {formType === 'Surat Tugas' && (
                    <div style={{ padding: '15px', backgroundColor: '#fdf4ff', border: '1px dashed #d8b4fe', borderRadius: '8px', marginBottom: '20px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#6b21a8', fontSize:'0.9rem' }}>Detail Kontrol Dokumen SPT</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>No. Dokumen</label><input type="text" style={{ width: '100%', border: '1px solid #d8b4fe', borderRadius: '6px', padding: '8px' }} name="noDokumen" value={formData.noDokumen || ''} onChange={handleInputChange} required /></div>
                        <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Edisi / Revisi</label><input type="text" style={{ width: '100%', border: '1px solid #d8b4fe', borderRadius: '6px', padding: '8px' }} name="edisiRevisi" value={formData.edisiRevisi || ''} onChange={handleInputChange} required /></div>
                        <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Tanggal Berlaku</label><input type="date" style={{ width: '100%', border: '1px solid #d8b4fe', borderRadius: '6px', padding: '8px' }} name="tanggalBerlaku" value={formData.tanggalBerlaku || ''} onChange={handleInputChange} required /></div>
                        <div><label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Halaman</label><input type="text" style={{ width: '100%', border: '1px solid #d8b4fe', borderRadius: '6px', padding: '8px' }} name="halaman" value={formData.halaman || ''} onChange={handleInputChange} required /></div>
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

export default PenugasanPage;