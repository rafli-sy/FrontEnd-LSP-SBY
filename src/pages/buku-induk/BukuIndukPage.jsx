import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import Pagination from '../../components/ui/Pagination'; 
import './BukuIndukPage.css';

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

const masterAsesor = [
  { id: 1, nama: 'Endang Lestari', noReg: 'MET.011411 2019', bidang: 'Garmen', skema: ['Menjahit'], load1Tahun: 2, status: 'Available', jadwalSibuk: [] },
  { id: 2, nama: 'Ahmad Fauzi', noReg: 'MET.123456 2020', bidang: 'Pariwisata', skema: ['Barista', 'Pembuatan Roti Dan Kue'], load1Tahun: 0, status: 'Available', jadwalSibuk: [] },
  { id: 3, nama: 'Kartika Nova Wahyuni', noReg: 'MET.005313 2018', bidang: 'Pariwisata', skema: ['Pembuatan Roti Dan Kue'], load1Tahun: 6, status: 'Available', jadwalSibuk: [] },
  { id: 4, nama: 'Risna Amalia', noReg: 'MET.003697 2013', bidang: 'TIK', skema: ['Practical Office Advance'], load1Tahun: 12, status: 'Sedang Bertugas', jadwalSibuk: [] },
  { id: 5, nama: 'Budi Santoso', noReg: 'MET.999888 2021', bidang: 'Pariwisata', skema: ['Barista'], load1Tahun: 8, status: 'Available', jadwalSibuk: [] },
];

const daftarPenyelia = ['Miftahul Huda', 'Mohamad Andrian A', 'Budi Santoso'];
const listBidang = [...new Set(masterAsesor.map(a => a.bidang))].filter(Boolean);
const listSkema = [...new Set(masterAsesor.flatMap(a => a.skema || []))].filter(Boolean);

const BukuIndukPage = ({ isEmbedded = false, role = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isStaffView = role === 'staff-lsp' || location.pathname.includes('/staff-lsp');
  const isAdminView = role === 'admin-lsp' || location.pathname.includes('/admin-lsp');

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailMode, setDetailMode] = useState(null); 
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [selectedAdminDoc, setSelectedAdminDoc] = useState(null);

  const [editData, setEditData] = useState({});
  const [isAsesorModalOpen, setIsAsesorModalOpen] = useState(false);
  const [asesorTargetRole, setAsesorTargetRole] = useState(''); 
  const [filterBidang, setFilterBidang] = useState('');
  const [filterSkema, setFilterSkema] = useState('');
  const [alertConfig, setAlertConfig] = useState(null);

  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isAsesorModalOpen) { setIsAsesorModalOpen(false); e.preventDefault(); }
      else if (previewDokumen) {
        if (previewDokumen.jenis === 'Administrasi' && selectedAdminDoc) {
          setSelectedAdminDoc(null);
        } else {
          setPreviewDokumen(null);
        }
        e.preventDefault();
      }
      else if (selectedDetail) { setSelectedDetail(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isAsesorModalOpen, previewDokumen, selectedAdminDoc, selectedDetail]);

  const [dataPemantauan, setDataPemantauan] = useState([
    { id: 1, pendanaan: 'APBD', hari1: '2026-02-18', hari2: '2026-02-19', tuk: 'UPT BLK Surabaya', bidang: 'Pariwisata', skema: 'Pembuatan Roti Dan Kue', jumlahAsesi: 16, keputusanK: '', keputusanBK: 16, pleno: '', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', suratBalasan: true, administrasi: true, spt: true, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', noPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 2, pendanaan: 'APBN', hari1: '2026-02-21', hari2: '2026-02-22', tuk: 'UPT BLK Surabaya', bidang: 'Pariwisata', skema: 'Barista', jumlahAsesi: 20, keputusanK: '', keputusanBK: 20, pleno: '', asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, administrasi: false, spt: false, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', noPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 3, pendanaan: 'Mandiri', hari1: '2026-02-25', hari2: '2026-02-26', tuk: 'UPT BLK Singosari', bidang: 'TIK', skema: 'Desain Grafis', jumlahAsesi: 15, keputusanK: '', keputusanBK: 15, pleno: '', asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, administrasi: false, spt: false, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', noPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 4, pendanaan: 'APBD', hari1: '2026-03-01', hari2: '2026-03-02', tuk: 'TUK Mandiri PT ABC', bidang: 'Otomotif', skema: 'Teknisi Kendaraan Ringan', jumlahAsesi: 10, keputusanK: '', keputusanBK: 10, pleno: '', asesor1: 'Endang Lestari', asesor2: 'Ahmad Fauzi', penyelia: 'Mohamad Andrian A', suratBalasan: true, administrasi: false, spt: true, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', noPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 5, pendanaan: 'APBN', hari1: '2026-03-05', hari2: '2026-03-06', tuk: 'UPT BLK Jember', bidang: 'Pertanian', skema: 'Budidaya Hidroponik', jumlahAsesi: 25, keputusanK: '', keputusanBK: 25, pleno: '', asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, administrasi: false, spt: false, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', noPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 6, pendanaan: 'Mandiri', hari1: '2026-03-10', hari2: '2026-03-11', tuk: 'TUK Mandiri LKP Mutiara', bidang: 'Kecantikan', skema: 'Tata Rias Rambut', jumlahAsesi: 12, keputusanK: '', keputusanBK: 12, pleno: '', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Endang Lestari', penyelia: 'Budi Santoso', suratBalasan: true, administrasi: true, spt: true, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 7, pendanaan: 'APBD', hari1: '2026-03-15', hari2: '2026-03-16', tuk: 'UPT BLK Kediri', bidang: 'Garmen', skema: 'Menjahit Pakaian', jumlahAsesi: 18, keputusanK: '', keputusanBK: 18, pleno: '', asesor1: '', asesor2: '', penyelia: '', suratBalasan: false, administrasi: false, spt: false, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
    { id: 8, pendanaan: 'APBN', hari1: '2026-03-20', hari2: '2026-03-21', tuk: 'UPT BLK Madiun', bidang: 'TIK', skema: 'Practical Office Advance', jumlahAsesi: 20, keputusanK: '', keputusanBK: 20, pleno: '', asesor1: 'Risna Amalia', asesor2: 'Endang Lestari', penyelia: 'Miftahul Huda', suratBalasan: true, administrasi: false, spt: true, pelaksanaanStatus: '', pembayaran: '', tglPleno: '', draft: '', cetak: '', dikirim: '', noResi: '', diterima: '', ttSertifikat: '' },
  ]);

  const listAdministrasi = [
    { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const sortedDataPemantauan = useMemo(() => {
    return [...dataPemantauan].sort((a, b) => new Date(b.hari1) - new Date(a.hari1));
  }, [dataPemantauan]);

  const totalPages = Math.ceil(sortedDataPemantauan.length / itemsPerPage);
  const paginatedData = sortedDataPemantauan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showAlert = (type, title, text) => {
    setAlertConfig({ type, title, text });
    if (['success', 'warning', 'info'].includes(type)) setTimeout(() => setAlertConfig(null), 2500);
  };

  const handleSimpanEdit = () => {
    setDataPemantauan(prev => prev.map(item => item.id === selectedDetail.id ? { ...item, ...editData } : item));
    setSelectedDetail({ ...selectedDetail, ...editData });
    setAlertConfig({ type: 'success', title: 'Tersimpan!', text: 'Data buku induk berhasil diperbarui.' });
    setTimeout(() => setAlertConfig(null), 2500);
  };

  const handlePilihPersonil = (item) => {
    if (isEmbedded) {
      navigate('/admin-lsp/penugasan', { state: { openDetailId: `UJK-${String(item.id).padStart(3, '0')}` } });
      return;
    }
    setSelectedDetail(item);
    setEditData({ ...item });
    const isFullyPlotted = item.asesor1 && item.asesor2 && item.penyelia;
    setDetailMode(isFullyPlotted ? null : 'plotting');
  };

  const handleBuatSurat = (item) => {
    if (isEmbedded) {
      navigate('/staff-lsp/surat', { state: { openDetailId: `UJK-${String(item.id).padStart(3, '0')}` } });
      return;
    }
    setSelectedDetail(item);
    setEditData({ ...item });
    setDetailMode(null); 
  };

  const handleOpenAsesorModal = (role, bidangUjk, skemaUjk) => { 
    setAsesorTargetRole(role); setFilterBidang(bidangUjk || ''); setFilterSkema(skemaUjk || ''); setIsAsesorModalOpen(true); 
  };

  const handlePilihAsesor = (asesor) => {
    if (asesorTargetRole === 'penyelia') {
      setEditData(prev => ({ ...prev, penyelia: asesor?.nama || '' }));
      handleSimpanEditPlotting({ penyelia: asesor?.nama || '' });
    } else {
      setEditData(prev => ({ ...prev, [asesorTargetRole]: asesor?.nama || '' }));
      handleSimpanEditPlotting({ [asesorTargetRole]: asesor?.nama || '' });
    }
    setIsAsesorModalOpen(false);
  };

  const handleSimpanEditPlotting = (updateFields) => {
    setDataPemantauan(prev => prev.map(item => item.id === selectedDetail.id ? { ...item, ...updateFields } : item));
    setSelectedDetail(prev => ({ ...prev, ...updateFields }));
  };

  const filteredAsesors = useMemo(() => {
    try { 
      return masterAsesor.filter(a => {
        const matchBidang = filterBidang ? (a.bidang || '').toLowerCase() === filterBidang.toLowerCase() : true;
        const matchSkema = filterSkema ? (a.skema || []).some(s => (s || '').toLowerCase() === filterSkema.toLowerCase()) : true;
        return matchBidang && matchSkema;
      }); 
    } catch (error) { return []; }
  }, [filterBidang, filterSkema]);

  const markDocAsDone = (id, docKey) => {
    setDataPemantauan(prev => prev.map(item => item.id === id ? { ...item, [docKey]: true } : item));
    if (selectedDetail && selectedDetail.id === id) setSelectedDetail(prev => ({ ...prev, [docKey]: true }));
  };

  const handlePreviewDokumen = (title, item, docKey) => {
    if (docKey && docKey !== 'administrasi') markDocAsDone(item.id, docKey); 

    const dataPreview = {
      ujk: {
        nomorSurat: `088/BLK-SBY/IV/2026`, tanggal: '20 April 2026', skema: item.skema, bidang: item.bidang, tuk: item.tuk,
        hari1: item.hari1 || '2026-01-01', hari2: item.hari2 || '2026-01-02', asesi: item.jumlahAsesi,
        asesor1: item.asesor1, noReg1: 'MET.000.001668.2012', asesor2: item.asesor2 || '',
        noReg2: item.asesor2 ? 'MET.000.011411 2019' : '', penyelia: item.penyelia || '', waktu: '08.00 WIB s/d Selesai'
      },
      form: {
        noSurat: title === 'Surat Permohonan' ? '000.140B/LSP BLK-SBY/IV/2026' : `000.140A/LSP BLK-SBY/IV/2026`, tanggalSurat: '22 April 2026', kepadaTujuan: `Kepala UPT BLK Surabaya`,
        noDokumen: title === 'Administrasi' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR.KPA.02', edisiRevisi: '01/00', tanggalBerlaku: '10-Nov-2015', halaman: '1 dari 1'
      }
    };
    
    if (title === 'Administrasi') setSelectedAdminDoc(null);
    setPreviewDokumen({ jenis: title, data: dataPreview, docKey: docKey });
  };

  const renderPDFDocument = () => {
    if (!previewDokumen) return null;
    const { jenis, data } = previewDokumen;

    if (jenis === 'Surat Tugas') return <SuratTugasPDF data={data} />;
    if (jenis === 'Surat Permohonan') return <SuratPermohonanPDF data={data} />;
    if (jenis === 'Surat Balasan') return <SuratBalasanPDF data={data} />;
    
    if (jenis === 'Administrasi' && selectedAdminDoc) {
      switch (selectedAdminDoc.code) {
        case 'DOC.01': return <LaporanPenyeliaPDF data={data} />;
        case 'DOC.02': return <BeritaAcaraPDF data={data} />;
        case 'DOC.03': return <PenerapanTUKPDF data={data} />;
        case 'DOC.04': return <SKPenyelenggaraPDF data={data} />;
        case 'DOC.05': return <LampiranSKPDF data={data} />;
        case 'DOC.06': return <DHPraPDF data={data} />;
        case 'DOC.07': return <DH1PDF data={data} />;
        case 'DOC.08': return <DH2PDF data={data} />;
        case 'DOC.09': return <TandaTerimaDokumenPDF data={data} />;
        case 'DOC.10': return <PernyataanAsesor1PDF data={data} />;
        case 'DOC.11': return <PernyataanAsesor2PDF data={data} />;
        case 'DOC.12': return <PengembalianDokumenPDF data={data} />;
        case 'DOC.13': return <RencanaVerifikasiTUKPDF data={data} />;
        default: return null;
      }
    }
    return null;
  };

  const renderAsesor = (name, jenisRole, item) => {
    if (isAdminView) {
      return (
        <button 
          onClick={() => handlePilihPersonil(item)}
          style={{
            background: name ? '#eff6ff' : '#f8fafc', color: name ? '#3b82f6' : '#64748b', 
            border: name ? '1px solid #3b82f6' : '1px dashed #cbd5e1', 
            padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', transition: '0.2s'
          }}
          title={`Atur ${jenisRole}`}
        >
          <i className={name ? "fas fa-user-check" : "fas fa-user-clock"}></i> {name ? name : 'Plotting'}
        </button>
      );
    }
    if (name) return <span style={{fontWeight: 600, color: '#0f172a', fontSize: '0.85rem'}}>{name}</span>;
    return (
      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: '600' }}>
        <i className="fas fa-hourglass-half" style={{marginRight: '4px'}}></i> Menunggu
      </span>
    );
  };

  const renderSurat = (status, item) => {
    const isFullyPlotted = item.asesor1 && item.asesor2 && item.penyelia;
    if (isStaffView || isAdminView) {
      if (!isFullyPlotted) {
        return (
          <button 
            disabled
            style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', transition: '0.2s' }}
            title="Menunggu Plotting Tim LSP"
          >
            <i className="fas fa-lock"></i> Terkunci
          </button>
        );
      }
      return (
        <button 
          onClick={() => { if (isStaffView) handleBuatSurat(item); else handlePilihPersonil(item); }} 
          style={{ background: status ? '#ecfdf5' : '#eff6ff', color: status ? '#10b981' : '#3b82f6', border: status ? '1px solid #10b981' : '1px solid #3b82f6', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: '100%', transition: '0.2s' }}
          title="Kelola Dokumen"
        >
          <i className={status ? "fas fa-check" : "fas fa-pen"}></i> {status ? 'Selesai' : 'Buat'}
        </button>
      );
    }
    if (!isFullyPlotted) return <i className="fas fa-lock" style={{color: '#cbd5e1', fontSize: '1.2rem'}} title="Terkunci"></i>;
    if (status) return <i className="fas fa-check" style={{color: '#10b981', fontSize: '1.2rem'}} title="Surat Selesai"></i>;
    return <i className="fas fa-times" style={{color: '#ef4444', fontSize: '1.2rem'}} title="Surat Belum Dibuat"></i>;
  };

  if (previewDokumen) {
    if (previewDokumen.jenis === 'Administrasi' && !selectedAdminDoc) {
      return (
        <div className="dashboard-content fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Pilih Dokumen Administrasi</h2>
              <p className="text-muted" style={{ margin: 0 }}>Silakan pilih salah satu dari kelengkapan dokumen administrasi UJK untuk dicetak.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
            {listAdministrasi.map(doc => {
              const isPrinted = selectedDetail?.administrasi;
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
      );
    }

    return (
      <div className="dashboard-content fade-in-content">
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
                    if (previewDokumen?.docKey) markDocAsDone(selectedDetail.id, previewDokumen.docKey);
                    if (previewDokumen?.jenis === 'Administrasi' && selectedAdminDoc) markDocAsDone(selectedDetail.id, 'administrasi');
                    showAlert('success', 'Berhasil Diunduh!', 'Dokumen PDF berhasil diunduh dan ditandai selesai.');
                 }}
               >
                 {({ loading }) => (loading ? 'Menyiapkan PDF...' : <><i className="fas fa-download"></i> Unduh PDF</>)}
               </PDFDownloadLink>
            </div>
          </div>
          <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <PDFViewer width="100%" height="100%" showToolbar={true}>
               {renderPDFDocument()}
            </PDFViewer>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDetail && !isEmbedded) {
    return (
      <div className="dashboard-content fade-in-content" style={{ position: 'relative' }}>
        {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={() => setAlertConfig(null)} onCancel={() => setAlertConfig(null)} />}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setSelectedDetail(null)}>Kembali ke Tabel Buku Induk</Button>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Detail Pemantauan UJK</h2>
            <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedDetail.skema}</strong> | TUK: {selectedDetail.tuk}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Buku Induk Kinerja</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {[
                { label: 'Keputusan Kompeten (K)', name: 'keputusanK', type: 'number' },
                { label: 'Keputusan Belum Kompeten (BK)', name: 'keputusanBK', type: 'number' },
                { label: 'Pelaksanaan Status', name: 'pelaksanaanStatus', type: 'text' },
                { label: 'Pembayaran', name: 'pembayaran', type: 'text' },
                { label: 'Tgl Pleno Ke BNSP', name: 'tglPleno', type: 'date' },
                { label: 'NO. PLENO', name: 'noPleno', type: 'text' },
                { label: 'Draft', name: 'draft', type: 'text' },
                { label: 'Cetak', name: 'cetak', type: 'text' },
                { label: 'Dikirim', name: 'dikirim', type: 'text' },
                { label: 'No Resi', name: 'noResi', type: 'text' },
                { label: 'Diterima', name: 'diterima', type: 'text' },
                { label: 'Tanda Terima Sertifikat', name: 'ttSertifikat', type: 'text' },
              ].map((field) => (
                <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>{field.label}</label>
                  <input 
                    type={field.type} 
                    name={field.name} 
                    value={editData[field.name] || ''} 
                    onChange={(e) => setEditData({...editData, [e.target.name]: e.target.value})} 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc', color: '#64748b' }}
                    disabled
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tableComponent = (
    <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
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
                <th rowSpan="2">Adminis<br/>trasi</th>
                <th rowSpan="2">SPT</th>
                
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
              {paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center" style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="text-center"><span className="badge info">{item.pendanaan}</span></td>
                  <td className="text-center">{item.hari1}</td>
                  <td className="text-center">{item.hari2}</td>
                  <td>{item.tuk}</td>
                  <td>{item.bidang}</td>
                  <td><strong>{item.skema}</strong></td>
                  
                  <td className="text-center font-bold" style={{ backgroundColor: '#f1f5f9' }}>{item.jumlahAsesi}</td>
                  <td className="text-center font-bold text-green-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanK}</td>
                  <td className="text-center font-bold text-red-600" style={{ backgroundColor: '#f8fafc' }}>{item.keputusanBK}</td>
                  
                  <td className="text-center">{renderAsesor(item.asesor1, 'asesor1', item)}</td>
                  <td className="text-center">{renderAsesor(item.asesor2, 'asesor2', item)}</td>
                  <td className="text-center">{renderAsesor(item.penyelia, 'penyelia', item)}</td>
                  
                  <td className="text-center">{renderSurat(item.suratBalasan, item)}</td>
                  <td className="text-center">{renderSurat(item.administrasi, item)}</td>
                  <td className="text-center">{renderSurat(item.spt, item)}</td>
                  
                  <td>{item.pelaksanaanStatus}</td>
                  <td>{item.pembayaran}</td>
                  <td>{item.tglPleno}</td>
                  <td>{item.noPleno}</td>
                  <td>{item.draft}</td>
                  <td>{item.cetak}</td>
                  <td>{item.dikirim}</td>
                  <td>{item.noResi}</td>
                  <td>{item.diterima}</td>
                  <td>{item.ttSertifikat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={dataPemantauan.length} itemsPerPage={itemsPerPage} />
      </div>

      {isAsesorModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}><i className="fas fa-filter text-blue"></i> Pilih {asesorTargetRole === 'asesor1' ? 'Asesor 1' : asesorTargetRole === 'asesor2' ? 'Asesor 2' : 'Penyelia LSP'}</h3>
              <button className="modal-close" onClick={() => setIsAsesorModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>Pilih</th>
                      <th>{asesorTargetRole === 'penyelia' ? 'Nama Penyelia' : 'Nama Asesor'}</th>
                      {asesorTargetRole !== 'penyelia' && <th>No. Registrasi</th>}
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
                        const isChecked = editData[asesorTargetRole] === asesor.nama;
                        return (
                          <tr key={asesor.id} style={{ backgroundColor: isChecked ? '#f0fdf4' : 'inherit' }}>
                            <td style={{ textAlign: 'center' }}><input type="radio" checked={isChecked} onChange={() => handlePilihAsesor(asesor)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /></td>
                            <td><strong>{asesor.nama}</strong></td>
                            <td className="text-muted">{asesor.noReg}</td>
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
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="embedded-buku-induk fade-in-content">
        <div className="embedded-header">
          <div>
             <h3 className="embedded-header-title">
               {isAdminView ? 'Plotting Asesor & Pemantauan' : 'Tugas Pembuatan Surat & Pemantauan'}
             </h3>
             <p className="text-muted" style={{ margin: 0 }}>
               {isAdminView 
                  ? 'Kelola penugasan Asesor dan Penyelia, serta pantau progres UJK.' 
                  : 'Klik tombol di dalam tabel untuk membuka menu manajemen dan mencetak dokumen UJK.'}
             </p>
          </div>
        </div>
        {tableComponent}
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Pemantauan Buku Induk UJK</h2>
          <p className="text-muted" style={{ margin: 0 }}>Tabel monitoring progres pelaksanaan, penugasan asesor, dan kelengkapan administrasi.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon="print">Cetak Laporan</Button>
          <Button variant="primary" icon="file-excel" style={{ backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' }}>Export ke Excel</Button>
        </div>
      </div>
      {tableComponent}
    </div>
  );
};

export default BukuIndukPage;