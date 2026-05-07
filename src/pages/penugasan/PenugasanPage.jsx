import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination';
import TablePeserta from '../TablePeserta/TablePeserta'; 

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import SuratBalasanPDF from '../surat/pdf/SuratBalasanPDF';
import SuratTugasPDF from '../surat/pdf/SuratTugasPDF';
import SuratPermohonanPDF from '../surat/pdf/SuratPermohonanPDF';
import LaporanPenyeliaPDF from '../surat/pdf/LaporanPenyeliaPDF'; 
import BeritaAcaraPDF from '../surat/pdf/BeritaAcaraPDF'; 
import PenerapanTUKPDF from '../surat/pdf/PenerapanTUKPDF'; 
import SKPenyelenggaraPDF from '../surat/pdf/SKPenyelenggaraPDF'; 
import LampiranSKPDF from '../surat/pdf/LampiranSKPDF'; 
import DHPraPDF from '../surat/pdf/DHPraPDF'; 
import DH1PDF from '../surat/pdf/DH1PDF'; 
import DH2PDF from '../surat/pdf/DH2PDF'; 
import TandaTerimaDokumenPDF from '../surat/pdf/TandaTerimaDokumenPDF'; 
import PernyataanAsesor1PDF from '../surat/pdf/PernyataanAsesor1PDF'; 
import PernyataanAsesor2PDF from '../surat/pdf/PernyataanAsesor2PDF'; 
import PengembalianDokumenPDF from '../surat/pdf/PengembalianDokumenPDF'; 
import RencanaVerifikasiTUKPDF from '../surat/pdf/RencanaVerifikasiTUKPDF'; 

import './PenugasanPage.css';

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

const PenugasanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [antreanSurat, setAntreanSurat] = useState([
    { 
      idUjk: 'UJK-001', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBD', tuk: 'TUK UPT BLK Surabaya',
      skemaList: [
        { idSkema: 'S-1', judul: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', jenis: 'Klaster', asesi: 16, hari1: '2026-02-18', hari2: '2026-02-19', waktu: '08.00 WIB s/d selesai', asesor1: 'Kartika Nova Wahyuni', noReg1: 'MET.005313 2018', asesor2: 'Hari Emijuniati', noReg2: 'MET.011411 2019', penyelia: 'Miftahul Huda', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'] }, savedForms: {} },
        { idSkema: 'S-2', judul: 'Barista', bidang: 'Pariwisata', jenis: 'Klaster', asesi: 20, hari1: '2026-02-21', hari2: '2026-02-22', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-002', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBN', tuk: 'UPT BLK Surabaya',
      skemaList: [
        { idSkema: 'S-3', judul: 'Barista', bidang: 'Pariwisata', jenis: 'Klaster', asesi: 20, hari1: '2026-02-21', hari2: '2026-02-22', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-003', pengusul: 'UPT BLK Singosari', pendanaan: 'Mandiri', tuk: 'UPT BLK Singosari',
      skemaList: [
        { idSkema: 'S-4', judul: 'Desain Grafis', bidang: 'TIK', jenis: 'Klaster', asesi: 15, hari1: '2026-02-25', hari2: '2026-02-26', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-004', pengusul: 'PT ABC Motor', pendanaan: 'APBD', tuk: 'TUK Mandiri PT ABC',
      skemaList: [
        { idSkema: 'S-5', judul: 'Teknisi Kendaraan Ringan', bidang: 'Otomotif', jenis: 'Klaster', asesi: 10, hari1: '2026-03-01', hari2: '2026-03-02', waktu: '08.00 WIB s/d selesai', asesor1: 'Endang Lestari', noReg1: 'MET.011411 2019', asesor2: 'Ahmad Fauzi', noReg2: 'MET.123456 2020', penyelia: 'Mohamad Andrian A', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: [] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-005', pengusul: 'UPT BLK Jember', pendanaan: 'APBN', tuk: 'UPT BLK Jember',
      skemaList: [
        { idSkema: 'S-6', judul: 'Budidaya Hidroponik', bidang: 'Pertanian', jenis: 'Klaster', asesi: 25, hari1: '2026-03-05', hari2: '2026-03-06', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-006', pengusul: 'LKP Mutiara', pendanaan: 'Mandiri', tuk: 'TUK Mandiri LKP Mutiara',
      skemaList: [
        { idSkema: 'S-7', judul: 'Tata Rias Rambut', bidang: 'Kecantikan', jenis: 'Klaster', asesi: 12, hari1: '2026-03-10', hari2: '2026-03-11', waktu: '08.00 WIB s/d selesai', asesor1: 'Kartika Nova Wahyuni', noReg1: 'MET.005313 2018', asesor2: 'Endang Lestari', noReg2: 'MET.011411 2019', penyelia: 'Budi Santoso', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01'] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-007', pengusul: 'UPT BLK Kediri', pendanaan: 'APBD', tuk: 'UPT BLK Kediri',
      skemaList: [
        { idSkema: 'S-8', judul: 'Menjahit Pakaian', bidang: 'Garmen', jenis: 'Klaster', asesi: 18, hari1: '2026-03-15', hari2: '2026-03-16', waktu: '08.00 WIB s/d selesai', asesor1: '', noReg1: '', asesor2: '', noReg2: '', penyelia: '', isPlotted: false, status: 'Sedang Diproses', statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }, savedForms: {} }
      ]
    },
    { 
      idUjk: 'UJK-008', pengusul: 'UPT BLK Madiun', pendanaan: 'APBN', tuk: 'UPT BLK Madiun',
      skemaList: [
        { idSkema: 'S-9', judul: 'Practical Office Advance', bidang: 'TIK', jenis: 'Klaster', asesi: 20, hari1: '2026-03-20', hari2: '2026-03-21', waktu: '08.00 WIB s/d selesai', asesor1: 'Risna Amalia', noReg1: 'MET.003697 2013', asesor2: 'Endang Lestari', noReg2: 'MET.011411 2019', penyelia: 'Miftahul Huda', isPlotted: true, status: 'Selesai Diplot', statusSurat: { balasan: true, permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'] }, savedForms: {} }
      ]
    }
  ]);

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
  const [selectedUjk, setSelectedUjk] = useState(null);
  const [activeDocKey, setActiveDocKey] = useState(null);
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '' });
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewAdminUjk, setViewAdminUjk] = useState(null);
  const [selectedAdminDoc, setSelectedAdminDoc] = useState(null);

  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });

  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isAsesorModalOpen) { setIsAsesorModalOpen(false); e.preventDefault(); }
      else if (isFormOpen) { setIsFormOpen(false); e.preventDefault(); }
      else if (viewPdf) { setViewPdf(null); e.preventDefault(); }
      else if (viewPesertaUjk) { setViewPesertaUjk(null); e.preventDefault(); }
      else if (previewDokumen) {
        if (previewDokumen.jenis === 'Administrasi' && !selectedAdminDoc) {
          setPreviewDokumen(null);
        } else if (selectedAdminDoc) {
          setSelectedAdminDoc(null);
        } else {
          setPreviewDokumen(null);
        }
        e.preventDefault();
      }
      else if (selectedPenugasan) { setSelectedPenugasan(null); setEditingId(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isAsesorModalOpen, isFormOpen, viewPdf, viewPesertaUjk, previewDokumen, selectedAdminDoc, selectedPenugasan]);

  useEffect(() => {
    if (location.state?.openDetailId) {
      setSearchTerm(location.state.openDetailId);
      setFilterStatus('Semua');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const listAdministrasi = [
    { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const filteredUsulan = antreanSurat.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = item.idUjk.toLowerCase().includes(term) || item.pengusul.toLowerCase().includes(term) || item.skemaList.some(s => s.judul.toLowerCase().includes(term));
    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
    const statusSuratGlobal = isSemuaDiplot ? 'Selesai Diplot' : 'Sedang Diproses';
    const matchStatus = filterStatus === 'Semua' || statusSuratGlobal === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsulan.length / itemsPerPage);
  const paginatedUsulan = filteredUsulan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (['success', 'warning', 'info'].includes(type)) setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2000);
  };

  const handleConfirmAlert = () => { if (alertConfig.action) alertConfig.action(); setAlertConfig({ type: null, title: '', text: '', action: null }); };
  const handleCancelAlert = () => setAlertConfig({ type: null, title: '', text: '', action: null });

  const handleOpenAsesorModal = (role, bidangUjk, skemaUjk) => { 
    setAsesorTargetRole(role); setFilterBidang(bidangUjk || ''); setFilterSkema(skemaUjk || ''); setIsAsesorModalOpen(true); 
  };

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
    const dummyPeserta = Array.from({ length: skema.asesi || 10 }).map((_, i) => ({ id: i + 1, nama: `Peserta Nominatif ${i + 1}`, nik: `35780000000000${i}`, jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', rt: '01', rw: '02', kelurahan: 'Sidoarjo', kecamatan: 'Sidoarjo Kota', hp: '0800000000', email: `peserta${i+1}@gmail.com`, pendidikan: 'SMK' }));
    setViewPesertaUjk({ ...skema, peserta: dummyPeserta });
  };

  const handleMulaiPlotting = (skema) => { setEditingId(skema.idSkema); setEditData({ ...skema }); };
  const handleBatalEdit = () => setEditingId(null);

  const handleSimpanPlotting = () => {
    if (!editData.asesor1 || !editData.asesor2 || !editData.penyelia || !editData.hari1 || !editData.hari2) { 
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan Tanggal Ujian, Asesor 1, Asesor 2, dan Penyelia telah terisi semua.'); return; 
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
      showAlert('success', 'Berhasil Di-deploy', 'Plotting Asesor dan Jadwal berhasil disimpan!');
    });
  };

  const handleTolakSkema = (idUjk, idSkema) => {
    setAlertConfig({
       type: 'delete', title: 'Tolak Skema?', text: 'Apakah Anda yakin menolak pengajuan untuk skema ini?',
       onConfirm: () => {
          setAntreanSurat(prev => prev.map(surat => {
             if(surat.idUjk === idUjk) {
                return { ...surat, skemaList: surat.skemaList.map(s => s.idSkema === idSkema ? { ...s, isPlotted: false, status: 'Ditolak' } : s) };
             }
             return surat;
          }));
          setAlertConfig({ type: null });
       },
       onCancel: () => setAlertConfig({ type: null })
    });
  };

  const checkBentrok = (jadwalSibuk = [], tglMulaiUjian, tglSelesaiUjian, currentTuk) => { 
    if (!tglMulaiUjian || !tglSelesaiUjian) return false; 
    return jadwalSibuk.some(sibuk => (new Date(tglMulaiUjian) <= new Date(sibuk.tglSelesai)) && (new Date(sibuk.tglMulai) <= new Date(tglSelesaiUjian)) && sibuk.tuk !== currentTuk ); 
  };

  // --- PERBAIKAN FITUR ADMINISTRASI AGAR BISA TERBUKA ---
  const handleDocClick = (jenisSurat, suratItem, skemaItem, docKey) => {
    if (!skemaItem.isPlotted) { showAlert('warning', 'Terkunci', 'Lengkapi Plotting Jadwal & Asesor terlebih dahulu.'); return; }
    
    const normalizedSkema = {
      ...skemaItem,
      skema: skemaItem.judul, // Wajib disinkronkan untuk PDF
      hari1: skemaItem.hari1 || 'Belum Diatur',
      hari2: skemaItem.hari2 || 'Belum Diatur',
      waktu: skemaItem.waktu || '08.00 WIB s/d Selesai'
    };

    if (jenisSurat === 'Administrasi') {
      const adminData = { ...normalizedSkema, tuk: suratItem.tuk, pengusul: suratItem.pengusul, idUjk: suratItem.idUjk };
      setViewAdminUjk(adminData);
      setSelectedAdminDoc(null);
      // Ini kunci agar state previewDokumen ter-trigger dan UI terbuka:
      setPreviewDokumen({ 
         jenis: 'Administrasi', 
         dataUjk: adminData, 
         ujkId: suratItem.idUjk, 
         skemaId: skemaItem.idSkema 
      });
    } else {
      setSelectedUjk({ surat: suratItem, skema: normalizedSkema }); 
      setFormType(jenisSurat);
      setActiveDocKey(docKey);
      
      if (skemaItem.savedForms && skemaItem.savedForms[docKey]) {
        setFormData(skemaItem.savedForms[docKey]);
      } else {
        const defaultNoDokumen = jenisSurat === 'Surat Tugas' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR-SER-01.2-LSP BLK-SBY';
        setFormData({ noSurat: `000.140${jenisSurat === 'Surat Tugas' ? 'D' : 'A'}/LSP BLK-SBY/III/2026`, tanggalSurat: '2026-03-11', noDokumen: defaultNoDokumen, edisiRevisi: '01/00', tanggalBerlaku: '2015-11-10', halaman: '1 dari 1' });
      }
      setIsFormOpen(true);
    }
  };

  const handleGenerateSurat = (e) => {
    e.preventDefault(); 
    setIsFormOpen(false);
    
    setAntreanSurat(prev => prev.map(surat => {
      if (surat.idUjk === selectedUjk.surat.idUjk) {
        return { ...surat, skemaList: surat.skemaList.map(s => s.idSkema === selectedUjk.skema.idSkema ? { ...s, savedForms: { ...(s.savedForms || {}), [activeDocKey]: formData } } : s) };
      }
      return surat;
    }));

    const dataPreview = {
      ujk: {
        nomorSurat: selectedUjk.surat.idUjk, tanggal: formData.tanggalSurat, skema: selectedUjk.skema.judul, bidang: selectedUjk.skema.bidang, tuk: selectedUjk.surat.tuk,
        hari1: selectedUjk.skema.hari1, hari2: selectedUjk.skema.hari2, asesi: selectedUjk.skema.asesi,
        asesor1: selectedUjk.skema.asesor1, noReg1: selectedUjk.skema.noReg1, asesor2: selectedUjk.skema.asesor2, noReg2: selectedUjk.skema.noReg2, 
        penyelia: selectedUjk.skema.penyelia, waktu: selectedUjk.skema.waktu
      },
      form: { ...formData, kepadaTujuan: selectedUjk.surat.pengusul?.replace('UPT BLK', 'UPT Balai Latihan Kerja') }
    };
    setPreviewDokumen({ jenis: formType, data: dataPreview, docKey: activeDocKey, dataUjk: selectedUjk.skema, ujkId: selectedUjk.surat.idUjk, skemaId: selectedUjk.skema.idSkema });
  };

  const markDocAsDone = (idUjk, idSkema, docType) => {
    setAntreanSurat(prev => prev.map(surat => {
      if (surat.idUjk === idUjk) {
        return { ...surat, skemaList: surat.skemaList.map(s => s.idSkema === idSkema ? { ...s, statusSurat: { ...s.statusSurat, [docType]: true } } : s) };
      }
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

  const renderPDFDocument = () => {
    if (!previewDokumen) return null;
    const { jenis, data, dataUjk } = previewDokumen;
    const pdfData = data || { ujk: dataUjk }; 

    if (jenis === 'Surat Tugas') return <SuratTugasPDF data={pdfData} />;
    if (jenis === 'Surat Permohonan') return <SuratPermohonanPDF data={pdfData} />;
    if (jenis === 'Surat Balasan') return <SuratBalasanPDF data={pdfData} />;
    
    if (jenis === 'Administrasi' && selectedAdminDoc) {
      switch (selectedAdminDoc.code) {
        case 'DOC.01': return <LaporanPenyeliaPDF data={pdfData} />;
        case 'DOC.02': return <BeritaAcaraPDF data={pdfData} />;
        case 'DOC.03': return <PenerapanTUKPDF data={pdfData} />;
        case 'DOC.04': return <SKPenyelenggaraPDF data={pdfData} />;
        case 'DOC.05': return <LampiranSKPDF data={pdfData} />;
        case 'DOC.06': return <DHPraPDF data={pdfData} />;
        case 'DOC.07': return <DH1PDF data={pdfData} />;
        case 'DOC.08': return <DH2PDF data={pdfData} />;
        case 'DOC.09': return <TandaTerimaDokumenPDF data={pdfData} />;
        case 'DOC.10': return <PernyataanAsesor1PDF data={pdfData} />;
        case 'DOC.11': return <PernyataanAsesor2PDF data={pdfData} />;
        case 'DOC.12': return <PengembalianDokumenPDF data={pdfData} />;
        case 'DOC.13': return <RencanaVerifikasiTUKPDF data={pdfData} />;
        default: return null;
      }
    }
    return null;
  };

  return (
    <div className="dashboard-content fade-in-content" style={{ backgroundColor: '#f4f7fb', padding: '20px', minHeight: '100vh', position: 'relative' }}>
      
      {alertConfig.type && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />}
      
      {/* VIEW: DATA PESERTA */}
      {viewPesertaUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setViewPesertaUjk(null)}>Kembali</Button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Nominatif Asesi</h2>
              <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewPesertaUjk.judul}</strong></p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}>
            <TablePeserta dataPeserta={viewPesertaUjk.peserta || []} skemaName={viewPesertaUjk.judul} />
          </div>
        </div>

      /* VIEW: PRATINJAU DOKUMEN (FULL PDF) */
      ) : previewDokumen ? (
        previewDokumen.jenis === 'Administrasi' && !selectedAdminDoc ? (
          <div className="dashboard-content fade-in-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Pilih Dokumen Administrasi</h2>
                <p className="text-muted" style={{ margin: 0 }}>Silakan pilih kelengkapan dokumen administrasi UJK untuk dicetak.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
              {listAdministrasi.map(doc => {
                const activeSurat = antreanSurat.find(s => s.idUjk === viewAdminUjk?.idUjk);
                const activeSkema = activeSurat?.skemaList.find(s => s.idSkema === viewAdminUjk?.idSkema);
                const isPrinted = activeSkema?.statusSurat?.administrasi?.includes(doc.code);
                return (
                  <button 
                    key={doc.code} onClick={() => setSelectedAdminDoc(doc)}
                    style={{ background: '#fff', border: isPrinted ? '1px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                  >
                    <div style={{ background: '#eff6ff', color: '#2563eb', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}><i className={`fas ${doc.icon}`}></i></div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', marginBottom: '4px' }}>{doc.code}</div>
                      <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>{doc.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="print-preview-container" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>Pratinjau {previewDokumen.jenis === 'Administrasi' ? selectedAdminDoc.name : previewDokumen.jenis}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Dokumen telah siap dalam format PDF Vektor berkualitas tinggi.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { previewDokumen.jenis === 'Administrasi' ? setSelectedAdminDoc(null) : setPreviewDokumen(null); }}>Kembali</Button>
                <PDFDownloadLink 
                   document={renderPDFDocument()} 
                   fileName={`${previewDokumen.jenis.replace(/\s+/g, '_')}_${previewDokumen.data?.ujk?.skema?.replace(/\s+/g, '_') || 'LSP'}.pdf`}
                   style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                   onClick={() => {
                      if (previewDokumen?.docKey) markDocAsDone(previewDokumen.ujkId, previewDokumen.skemaId, previewDokumen.docKey);
                      if (previewDokumen?.jenis === 'Administrasi' && selectedAdminDoc) markDocAsDone(previewDokumen.dataUjk.idUjk, previewDokumen.dataUjk.idSkema, 'administrasi');
                      showAlert('success', 'Berhasil Diunduh!', 'Dokumen PDF berhasil diunduh dan ditandai selesai.');
                   }}
                 >
                   {({ loading }) => (loading ? 'Menyiapkan PDF...' : <><i className="fas fa-download"></i> Unduh PDF Sekarang</>)}
                 </PDFDownloadLink>
              </div>
            </div>
            
            <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <PDFViewer width="100%" height="100%" showToolbar={true}>
                 {renderPDFDocument()}
              </PDFViewer>
            </div>
          </div>
        )

      /* VIEW: MANAJEMEN PENUGASAN (DETAIL ROW) */
      ) : selectedPenugasan ? (
        (() => {
          const activeSurat = antreanSurat.find(item => item.idUjk === selectedPenugasan.idUjk) || selectedPenugasan;

          return (
            <div className="fade-in-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { setSelectedPenugasan(null); setEditingId(null); }}>Kembali ke Daftar</Button>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Manajemen Penugasan UJK</h2>
                  <p className="text-muted" style={{ margin: 0 }}>{activeSurat.idUjk} - {activeSurat.pengusul}</p>
                </div>
              </div>

              {/* MAPPING SEMUA SKEMA DI DALAM SURAT INI */}
              {activeSurat.skemaList.map((skema) => {
                const isEditing = editingId === skema.idSkema;
                const isFullyPlotted = skema.asesor1 && skema.asesor2 && skema.penyelia;
                const isRejected = skema.status === 'Ditolak';

                return (
                  <div key={skema.idSkema} className="dashboard-card" style={{ backgroundColor: '#fff', border: isEditing ? '2px solid #3b82f6' : (isRejected ? '2px solid #ef4444' : '1px solid #cbd5e1'), borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <span style={{ backgroundColor: '#1e293b', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{activeSurat.idUjk}</span>
                         <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' }}>{activeSurat.pendanaan}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {isRejected ? <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-times-circle"></i> Skema Ditolak</span> : 
                         !isFullyPlotted ? <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-exclamation-triangle"></i> Belum Di-plot</span> :
                         !isEditing && <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}><i className="fas fa-check-circle"></i> Selesai Di-plot</span>}
                      </div>
                    </div>

                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>{skema.judul}</h4>
                    <p className="text-muted" style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>{skema.bidang || skema.kejuruan} <span style={{margin: '0 5px'}}>|</span> {skema.jenis}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-building"></i></div>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Instansi Pengusul</div>
                            <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{activeSurat.pengusul}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-map-marker-alt"></i></div>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Lokasi Ujian (TUK)</div>
                            <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}>{activeSurat.tuk}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fdf4ff', color: '#a855f7', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="far fa-calendar-alt"></i></div>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Tanggal Pelaksanaan</div>
                            <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>
                              {!isEditing ? (skema.hari1 ? `${skema.hari1} s/d ${skema.hari2}` : 'Tanggal Belum Diatur') : <span style={{color: '#f59e0b', fontStyle: 'italic'}}>Sedang Mengubah Tanggal...</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><i className="fas fa-users"></i></div>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Peserta Ujian</div>
                            <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {skema.asesi} Asesi
                              <button onClick={() => handleGoToPeserta(skema)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#3b82f6', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 8px', fontWeight: 'bold' }}>Lihat Data</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        {isEditing ? (
                          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '800' }}><i className="fas fa-calendar-day"></i> Ubah Tanggal Pelaksanaan</h5>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                              <input type="date" name="hari1" value={editData.hari1 || ''} onChange={handleEditChange} style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} />
                              <div style={{ alignSelf: 'center', fontWeight: 'bold' }}>-</div>
                              <input type="date" name="hari2" value={editData.hari2 || ''} onChange={handleEditChange} style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }} />
                            </div>
                            
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '800' }}><i className="fas fa-users-cog"></i> Plotting Tim</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Asesor 1</label>
                                <Button variant="outline" icon="user-tie" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('asesor1', editData.bidang || editData.kejuruan, editData.judul); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.asesor1 || 'Pilih Asesor 1...'}</Button>
                              </div>
                              <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Asesor 2</label>
                                <Button variant="outline" icon="user-tie" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('asesor2', editData.bidang || editData.kejuruan, editData.judul); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.asesor2 || 'Pilih Asesor 2...'}</Button>
                              </div>
                              <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Penyelia LSP</label>
                                <Button variant="outline" icon="user-shield" isFullWidth onClick={(e) => { e.preventDefault(); handleOpenAsesorModal('penyelia'); }} style={{ justifyContent: 'flex-start', backgroundColor: '#fff', textAlign: 'left' }}>{editData.penyelia || 'Pilih Penyelia...'}</Button>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                              <Button variant="outline" icon="times" isFullWidth onClick={handleBatalEdit}>Batal</Button>
                              <Button variant="primary" icon="save" isFullWidth onClick={handleSimpanPlotting} style={{backgroundColor: '#2563eb', color: '#fff', border: 'none'}}>Simpan Plotting</Button>
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
                            
                            {!isEditing && !isRejected && (
                               <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                  <Button 
                                    variant={isFullyPlotted ? "outline" : "primary"} 
                                    icon={isFullyPlotted ? "edit" : "user-plus"} 
                                    isFullWidth 
                                    style={!isFullyPlotted ? {backgroundColor: '#2563eb', color: '#fff', border: 'none'} : {}} 
                                    onClick={() => handleMulaiPlotting(skema)}
                                  >
                                    {isFullyPlotted ? 'Edit Plotting' : 'Mulai Plotting'}
                                  </Button>
                                  
                                  {!isFullyPlotted && (
                                    <button 
                                      onClick={() => handleTolakSkema(activeSurat.idUjk, skema.idSkema)} 
                                      style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                    >
                                      <i className="fas fa-times-circle"></i> Tolak
                                    </button>
                                  )}
                               </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {!isEditing && !isRejected && (
                          <>
                            {[
                              { id: 'balasan', title: '1. Surat Balasan', status: skema.statusSurat?.balasan, key: 'balasan', type: 'Surat Balasan' },
                              { id: 'tugas', title: '2. Surat Tugas', status: skema.statusSurat?.tugas, key: 'spt', type: 'Surat Tugas' },
                              { id: 'permohonan', title: '3. Srt. Permohonan', status: skema.statusSurat?.permohonan, key: 'permohonan', type: 'Surat Permohonan' },
                              { id: 'administrasi', title: '4. Administrasi', status: skema.statusSurat?.administrasi?.length === 13, key: 'administrasi', type: 'Administrasi' }
                            ].map(doc => {
                              const style = getDocButtonStyle(isFullyPlotted, doc.status);
                              const icon = getDocIconInfo(isFullyPlotted, doc.status);
                              return (
                                <button 
                                    key={doc.id} disabled={!isFullyPlotted} onClick={() => handleDocClick(doc.type, activeSurat, skema, doc.key)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderRadius: '8px', transition: '0.2s', ...style }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: icon.bg, color: icon.color }}>
                                    <i className={`fas ${icon.class}`}></i>
                                  </div>
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

      /* VIEW: TABEL UTAMA (MASTER) */
      ) : (
        <div className="fade-in-content">
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

            <div className="table-responsive" style={{ padding: '20px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '20%' }}>ID Surat & Instansi</th>
                    <th style={{ width: '25%' }}>Daftar Skema</th>
                    <th style={{ width: '20%' }}>Pelaksanaan & TUK</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Status Global</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsulan.map((item, index) => {
                    const isSemuaDiplot = item.skemaList.every(s => s.isPlotted || s.status === 'Ditolak');
                    
                    return (
                    <tr key={item.idUjk}>
                      <td style={{ textAlign: 'center', color: '#94a3b8', verticalAlign: 'top', paddingTop: '20px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      
                      <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.idUjk}</strong>
                        <small className="text-muted"><i className="fas fa-building"></i> {item.pengusul}</small>
                      </td>
                      
                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <ul style={{ margin: 0, paddingLeft: '15px', color: '#334155', fontSize: '0.9rem' }}>
                          {item.skemaList.map((skema, i) => (
                            <li key={i} style={{ marginBottom: '8px' }}>
                               <strong style={{ color: '#1e293b' }}>{skema.judul}</strong><br/>
                               <small className="text-muted">{skema.bidang || skema.kejuruan || 'Umum'} <span style={{margin: '0 5px'}}>|</span> {skema.jenis || 'Lainnya'}</small>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {item.skemaList.map((skema, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '40px' }}>
                              <span style={{ fontWeight: '600', color: '#334155' }}>
                                <i className="far fa-calendar-alt text-muted" style={{marginRight: '4px'}}></i> 
                                {skema.hari1 ? `${skema.hari1}` : 'Belum Diatur'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <small className="text-muted" style={{ display: 'block', marginTop: '10px' }}><i className="fas fa-map-marker-alt"></i> {item.tuk}</small>
                      </td>

                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                        {isSemuaDiplot ? <span className="badge success">Selesai Diplot</span> : <span className="badge warning">Sedang Diproses</span>}
                      </td>

                      <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '20px' }}>
                        <Button variant="primary" size="sm" onClick={() => { setSelectedPenugasan(item); setEditingId(null); }}>Kelola Plotting</Button>
                      </td>
                    </tr>
                    );
                  })}
                  {paginatedUsulan.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Tidak ada data penugasan.</td></tr>}
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
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}><i className="fas fa-filter text-blue"></i> Pilih {asesorTargetRole === 'asesor1' ? 'Asesor 1' : asesorTargetRole === 'asesor2' ? 'Asesor 2' : 'Penyelia LSP'}</h3>
              <button className="modal-close" onClick={() => setIsAsesorModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {asesorTargetRole !== 'penyelia' && (
                <div style={{ display: 'flex', gap: '15px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Filter Bidang</label>
                    <select value={filterBidang} onChange={(e) => setFilterBidang(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}>
                      <option value="">-- Semua Bidang --</option>
                      {listBidang.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Filter Skema</label>
                    <select value={filterSkema} onChange={(e) => setFilterSkema(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}>
                      <option value="">-- Semua Skema --</option>
                      {listSkema.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {asesorTargetRole !== 'penyelia' && (
                <div style={{ marginBottom: '15px', backgroundColor: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.85rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#b45309' }}></i> <strong>Anti-Bentrok Cerdas:</strong> Asesor dengan jadwal bentrok di hari yang sama akan terkunci, <strong>kecuali</strong> mereka bertugas di TUK yang sama (<strong>{editData.tuk}</strong>).
                </div>
              )}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>Pilih</th>
                      <th>{asesorTargetRole === 'penyelia' ? 'Nama Penyelia' : 'Nama Asesor'}</th>
                      {asesorTargetRole !== 'penyelia' && <th>No. Registrasi</th>}
                      {asesorTargetRole !== 'penyelia' && <th>Status Jadwal</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {asesorTargetRole === 'penyelia' ? (
                      daftarPenyelia.map((penyelia, idx) => {
                        const isChecked = editData.penyelia === penyelia;
                        return (
                          <tr key={idx} style={{ backgroundColor: isChecked ? '#f0fdf4' : 'inherit' }}>
                            <td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor({ nama: penyelia })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /></td>
                            <td><strong>{penyelia}</strong></td>
                          </tr>
                        );
                      })
                    ) : (
                      filteredAsesors.map(asesor => {
                        const isBentrok = checkBentrok(asesor.jadwalSibuk, editData.hari1, editData.hari2, editData.tuk);
                        const isChecked = editData[asesorTargetRole] === asesor.nama;
                        return (
                          <tr key={asesor.id} style={{ backgroundColor: isBentrok ? '#fee2e2' : isChecked ? '#f0fdf4' : 'inherit' }}>
                            <td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor(asesor)} disabled={isBentrok} style={{ width: '18px', height: '18px', cursor: isBentrok ? 'not-allowed' : 'pointer' }} /></td>
                            <td><strong>{asesor.nama}</strong><br/><small className="text-muted">Beban: {asesor.load1Tahun} UJK</small></td>
                            <td className="text-muted">{asesor.noReg}</td>
                            <td>{isBentrok ? <span className="badge danger"><i className="fas fa-times-circle"></i> Bentrok TUK Lain</span> : <span className="badge success"><i className="fas fa-check-circle"></i> Tersedia</span>}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP ISI FORM SURAT */}
      {isFormOpen && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
             <div className="modal-header"><h3 style={{margin:0}}>Lengkapi Data Surat</h3><button className="modal-close" onClick={() => setIsFormOpen(false)}>&times;</button></div>
             <div className="modal-body">
                <form onSubmit={handleGenerateSurat}>
                  <div style={{ marginBottom: '15px' }}><label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569'}}>Nomor Surat LSP <span style={{color:'red'}}>*</span></label><input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required /></div>
                  <div style={{ marginBottom: '20px' }}><label style={{fontWeight:'bold', fontSize:'0.85rem', color:'#475569'}}>Tanggal Dikeluarkan Surat</label><input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required /></div>
                  
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
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="secondary" onClick={() => setIsFormOpen(false)} isFullWidth>Batal</Button>
                    <Button type="submit" variant="primary" icon="magic" isFullWidth style={{backgroundColor: '#2563eb', color: '#fff', border: 'none'}}>Generate PDF</Button>
                  </div>
                </form>
             </div>
           </div>
         </div>
      )}

      {/* MODAL VIEWER PDF (SIMULASI) */}
      {viewPdf && (
         <div className="modal-overlay" style={{ zIndex: 9999 }}>
           <div className="modal-content" style={{ width: '800px', maxWidth: '90%', height: '80vh', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0', display: 'flex', flexDirection: 'column' }}>
             <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{margin:0, color: '#0f172a'}}><i className="fas fa-file-pdf" style={{color: '#ef4444', marginRight: 8}}></i> Pratinjau Dokumen</h3>
               <button type="button" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }} onClick={() => setViewPdf(null)}>&times;</button>
             </div>
             <div className="modal-body" style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fas fa-file-pdf" style={{ fontSize: '5rem', marginBottom: '15px', color: '#cbd5e1' }}></i>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#334155' }}>Simulasi Penampil Dokumen</p>
                  <p style={{ fontSize: '0.95rem' }}>Dokumen <strong>{viewPdf}</strong> yang diunggah akan tampil di area ini.</p>
               </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default PenugasanPage;