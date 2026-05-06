import React, { useState, useEffect } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import Button from '../../components/ui/Button'; 
import AlertPopup from '../../components/ui/AlertPopup'; 
import TablePeserta from '../TablePeserta/TablePeserta';  
import Pagination from '../../components/ui/Pagination'; 

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'; 
import SuratBalasanPDF from './pdf/SuratBalasanPDF'; 
import SuratTugasPDF from './pdf/SuratTugasPDF'; 
import SuratPermohonanPDF from './pdf/SuratPermohonanPDF'; 
import LaporanPenyeliaPDF from './pdf/LaporanPenyeliaPDF';  
import BeritaAcaraPDF from './pdf/BeritaAcaraPDF';  
import PenerapanTUKPDF from './pdf/PenerapanTUKPDF';  
import SKPenyelenggaraPDF from './pdf/SKPenyelenggaraPDF';  
import LampiranSKPDF from './pdf/LampiranSKPDF';  
import DHPraPDF from './pdf/DHPraPDF';  
import DH1PDF from './pdf/DH1PDF';  
import DH2PDF from './pdf/DH2PDF';  
import TandaTerimaDokumenPDF from './pdf/TandaTerimaDokumenPDF';  
import PernyataanAsesor1PDF from './pdf/PernyataanAsesor1PDF';  
import PernyataanAsesor2PDF from './pdf/PernyataanAsesor2PDF';  
import PengembalianDokumenPDF from './pdf/PengembalianDokumenPDF';  
import RencanaVerifikasiTUKPDF from './pdf/RencanaVerifikasiTUKPDF';  

const SuratMenyurat = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [selectedAdminDoc, setSelectedAdminDoc] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const [selectedUjkDetail, setSelectedUjkDetail] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [targetUjk, setTargetUjk] = useState(null);
  const [activeDocKey, setActiveDocKey] = useState(null);
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noDokumen: '', edisiRevisi: '', tanggalBerlaku: '', halaman: '' });
  
  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (isFormOpen) { setIsFormOpen(false); e.preventDefault(); }
      else if (previewDokumen) {
        if (previewDokumen.jenis === 'Administrasi' && selectedAdminDoc) {
          setSelectedAdminDoc(null);
        } else {
          setPreviewDokumen(null);
        }
        e.preventDefault();
      }
      else if (selectedSurat) { setSelectedSurat(null); e.preventDefault(); }
      else if (selectedUjkDetail) { setSelectedUjkDetail(null); e.preventDefault(); }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [isFormOpen, previewDokumen, selectedAdminDoc, selectedSurat, selectedUjkDetail]);

  const [daftarSurat, setDaftarSurat] = useState([
    { id: 'UJK-001', nomorSurat: '088/BLK-SBY/IV/2026', anggaran: 'APBD', instansi: 'UPT BLK Surabaya', skema: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', tglMulai: '2026-02-18', tglSelesai: '2026-02-19', asesi: 16, status: 'Surat Diterbitkan', badge: 'success', tuk: 'TUK UPT BLK Surabaya', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Hari Emijuniati', penyelia: 'Miftahul Huda', docs: { balasan: true, spt: true, permohonan: true, administrasi: true }, savedForms: {}, pesertaList: [{ id: 1, nama: 'Siti Aminah', nik: '3578001122334455', jk: 'P', tempatLahir: 'Surabaya', tanggalLahir: '12 Mei 1995', alamat: 'Jl. Kenangan No 1', rt: '01', rw: '02', kelurahan: 'Ketintang', kecamatan: 'Gayungan', hp: '08123456789', email: 'siti@mail.com', pendidikan: 'SMA' }] },
    { id: 'UJK-002', nomorSurat: '045/BLK-SBY/III/2026', anggaran: 'APBN', instansi: 'UPT BLK Surabaya', skema: 'Barista', bidang: 'Pariwisata', tglMulai: '2026-02-21', tglSelesai: '2026-02-22', asesi: 20, status: 'Menunggu Surat', badge: 'warning', tuk: 'TUK Sewaktu BLK Surabaya', asesor1: 'Ahmad Fauzi', asesor2: '', penyelia: 'Miftahul Huda', docs: { balasan: false, spt: false, permohonan: true, administrasi: false }, savedForms: {}, pesertaList: [{ id: 2, nama: 'Andi Wijaya', nik: '3578002233445566', jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '21 Juli 1998', alamat: 'Perumahan Tropodo', rt: '05', rw: '01', kelurahan: 'Tropodo', kecamatan: 'Waru', hp: '082233445566', email: 'andi@mail.com', pendidikan: 'D3' }] },
    { id: 'UJK-003', nomorSurat: '012/BLK-SBY/II/2026', anggaran: 'Mandiri', instansi: 'UPT BLK Singosari', skema: 'Desain Grafis', bidang: 'TIK', tglMulai: '2026-02-25', tglSelesai: '2026-02-26', asesi: 15, status: 'Menunggu Surat', badge: 'warning', tuk: 'TUK Sewaktu BLK Singosari', asesor1: 'Risna Amalia', asesor2: '', penyelia: 'Budi Santoso', docs: { balasan: false, spt: false, permohonan: false, administrasi: false }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-004', nomorSurat: '110/PTABC/III/2026', anggaran: 'APBD', instansi: 'PT ABC Motor', skema: 'Teknisi Kendaraan Ringan', bidang: 'Otomotif', tglMulai: '2026-03-01', tglSelesai: '2026-03-02', asesi: 10, status: 'Surat Diterbitkan', badge: 'success', tuk: 'TUK Mandiri PT ABC', asesor1: 'Endang Lestari', asesor2: 'Ahmad Fauzi', penyelia: 'Mohamad Andrian A', docs: { balasan: true, spt: true, permohonan: true, administrasi: false }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-005', nomorSurat: '111/BLK-JBR/III/2026', anggaran: 'APBN', instansi: 'UPT BLK Jember', skema: 'Budidaya Hidroponik', bidang: 'Pertanian', tglMulai: '2026-03-05', tglSelesai: '2026-03-06', asesi: 25, status: 'Menunggu Surat', badge: 'warning', tuk: 'TUK Sewaktu BLK Jember', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: false, permohonan: false, administrasi: false }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-006', nomorSurat: '112/LKP-MTR/III/2026', anggaran: 'Mandiri', instansi: 'LKP Mutiara', skema: 'Tata Rias Rambut', bidang: 'Kecantikan', tglMulai: '2026-03-10', tglSelesai: '2026-03-11', asesi: 12, status: 'Surat Diterbitkan', badge: 'success', tuk: 'TUK Mandiri LKP Mutiara', asesor1: 'Kartika Nova Wahyuni', asesor2: 'Endang Lestari', penyelia: 'Budi Santoso', docs: { balasan: true, spt: true, permohonan: true, administrasi: false }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-007', nomorSurat: '113/BLK-KDR/III/2026', anggaran: 'APBD', instansi: 'UPT BLK Kediri', skema: 'Menjahit Pakaian', bidang: 'Garmen', tglMulai: '2026-03-15', tglSelesai: '2026-03-16', asesi: 18, status: 'Menunggu Surat', badge: 'warning', tuk: 'TUK Sewaktu BLK Kediri', asesor1: '', asesor2: '', penyelia: '', docs: { balasan: false, spt: false, permohonan: false, administrasi: false }, savedForms: {}, pesertaList: [] },
    { id: 'UJK-008', nomorSurat: '114/BLK-MDN/III/2026', anggaran: 'APBN', instansi: 'UPT BLK Madiun', skema: 'Practical Office Advance', bidang: 'TIK', tglMulai: '2026-03-20', tglSelesai: '2026-03-21', asesi: 20, status: 'Surat Diterbitkan', badge: 'success', tuk: 'TUK Sewaktu BLK Madiun', asesor1: 'Risna Amalia', asesor2: 'Endang Lestari', penyelia: 'Miftahul Huda', docs: { balasan: true, spt: true, permohonan: true, administrasi: false }, savedForms: {}, pesertaList: [] }
  ]);

  useEffect(() => {
    if (location.state?.openDetailId) {
      const itemToOpen = daftarSurat.find(item => item.id === location.state.openDetailId);
      if (itemToOpen) {
        setSelectedUjkDetail(itemToOpen);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, daftarSurat]);

  const listAdministrasi = [
    { code: 'DOC.01', name: 'Laporan Penyelia', icon: 'fa-user-tie' }, { code: 'DOC.02', name: 'Berita Acara Pelaksanaan', icon: 'fa-file-contract' }, { code: 'DOC.03', name: 'Penerapan TUK', icon: 'fa-building' }, { code: 'DOC.04', name: 'SK Penyelenggara', icon: 'fa-certificate' }, { code: 'DOC.05', name: 'Lampiran SK', icon: 'fa-paperclip' }, { code: 'DOC.06', name: 'Daftar Hadir Pra-Asesmen', icon: 'fa-clipboard-list' }, { code: 'DOC.07', name: 'Daftar Hadir Asesmen H1', icon: 'fa-clipboard-check' }, { code: 'DOC.08', name: 'Daftar Hadir Asesmen H2', icon: 'fa-clipboard-check' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen', icon: 'fa-handshake' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1', icon: 'fa-user-lock' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2', icon: 'fa-user-lock' }, { code: 'DOC.12', name: 'Pengembalian Dokumen', icon: 'fa-undo' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK', icon: 'fa-search-location' }
  ];

  const filteredDaftar = daftarSurat.filter(item => {
    const matchSearch = item.skema.toLowerCase().includes(searchTerm.toLowerCase()) || item.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredDaftar.length / itemsPerPage);
  const paginatedDaftar = filteredDaftar.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const markDocAsDone = (id, docType) => {
    setDaftarSurat(prev => prev.map(item => item.id === id ? { ...item, docs: { ...item.docs, [docType]: true } } : item));
    setSelectedUjkDetail(prev => ({ ...prev, docs: { ...prev.docs, [docType]: true } }));
  };

  const handleDocClick = (jenisSurat, item, docKey) => {
    const normalizedItem = { ...item, hari1: item.hari1 || item.tglMulai || 'Belum Diatur', hari2: item.hari2 || item.tglSelesai || 'Belum Diatur', waktu: item.waktu || '08.00 WIB s/d Selesai' };
    if (jenisSurat === 'Administrasi') {
      setSelectedAdminDoc(null);
      setPreviewDokumen({ jenis: 'Administrasi', dataUjk: normalizedItem }); 
    } else {
      setTargetUjk(normalizedItem);
      setFormType(jenisSurat);
      setActiveDocKey(docKey);
      if (item.savedForms && item.savedForms[docKey]) {
        setFormData(item.savedForms[docKey]);
      } else {
        const defaultNoDokumen = jenisSurat === 'Surat Tugas' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR-SER-01.2-LSP BLK-SBY';
        setFormData({ noSurat: jenisSurat === 'Surat Permohonan' ? '000.140B/LSP BLK-SBY/IV/2026' : '000.140A/LSP BLK-SBY/IV/2026', tanggalSurat: '2026-04-22', noDokumen: defaultNoDokumen, edisiRevisi: '01/00', tanggalBerlaku: '2015-11-10', halaman: '1 dari 1' });
      }
      setIsFormOpen(true);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleGenerateSurat = (e) => {
    e.preventDefault();
    setIsFormOpen(false);
    setDaftarSurat(prev => prev.map(item => item.id === targetUjk.id ? { ...item, savedForms: { ...(item.savedForms || {}), [activeDocKey]: formData } } : item));
    setTargetUjk(prev => ({ ...prev, savedForms: { ...(prev.savedForms || {}), [activeDocKey]: formData } }));
    if (selectedUjkDetail && selectedUjkDetail.id === targetUjk.id) { setSelectedUjkDetail(prev => ({ ...prev, savedForms: { ...(prev.savedForms || {}), [activeDocKey]: formData } })); }
    
    const dataPreview = {
      ujk: { nomorSurat: targetUjk.nomorSurat, tanggal: formData.tanggalSurat, skema: targetUjk.skema, bidang: targetUjk.bidang, tuk: targetUjk.tuk, hari1: targetUjk.tglMulai, hari2: targetUjk.tglSelesai, asesi: targetUjk.asesi, asesor1: targetUjk.asesor1, noReg1: 'MET.000.001668.2012', asesor2: targetUjk.asesor2 || '', noReg2: targetUjk.asesor2 ? 'MET.000.011411 2019' : '', penyelia: targetUjk.penyelia, waktu: '08.00 WIB s/d Selesai' },
      form: { ...formData, kepadaTujuan: `Kepala ${targetUjk.instansi}` }
    };
    setPreviewDokumen({ jenis: formType, data: dataPreview, docKey: activeDocKey, ujkId: targetUjk.id });
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

  // ==========================================
  // SINGLE RETURN STRUCTURE
  // ==========================================
  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* 1. NOTIFIKASI */}
      {alertConfig && <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={() => setAlertConfig(null)} onCancel={() => setAlertConfig(null)} />}

      {/* 2. RENDER HALAMAN BERDASARKAN STATE */}
      {previewDokumen ? (
        
        previewDokumen.jenis === 'Administrasi' && !selectedAdminDoc ? (
          <div className="fade-in-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
              <div>
                <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Pilih Dokumen Administrasi</h2>
                <p className="text-muted" style={{ margin: 0 }}>Silakan pilih kelengkapan dokumen administrasi UJK untuk dicetak.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
              {listAdministrasi.map(doc => {
                const isPrinted = selectedUjkDetail?.docs?.administrasi && selectedUjkDetail?.statusSurat?.administrasi?.includes(doc.code);
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
          <div className="print-preview-container fade-in-content" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <div className="no-print print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.2rem' }}>Pratinjau {previewDokumen.jenis === 'Administrasi' ? selectedAdminDoc.name : previewDokumen.jenis}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Dokumen telah siap dalam format PDF Vektor berkualitas tinggi.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="outline" icon="arrow-left" onClick={() => { previewDokumen.jenis === 'Administrasi' ? setSelectedAdminDoc(null) : setPreviewDokumen(null); }}>Kembali</Button>
                <PDFDownloadLink 
                  document={renderPDFDocument()} 
                  fileName={`${previewDokumen.jenis.replace(/\s+/g, '_')}_UJK.pdf`}
                  style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                     if (previewDokumen?.docKey) markDocAsDone(previewDokumen.ujkId, previewDokumen.docKey);
                     if (previewDokumen?.jenis === 'Administrasi' && selectedAdminDoc) markDocAsDone(previewDokumen.dataUjk.id, 'administrasi');
                     setAlertConfig({ type: 'success', title: 'Berhasil Diunduh!', text: 'Dokumen PDF berhasil diunduh dan ditandai selesai.' });
                     setTimeout(() => setAlertConfig(null), 3000);
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
      
      ) : selectedSurat ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedSurat(null)}>Kembali</Button>
            <div>
               <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Nominatif Peserta</h2>
               <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedSurat.skema}</strong></p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '25px' }}><TablePeserta dataPeserta={selectedSurat.pesertaList || []} skemaName={selectedSurat.skema} /></div>
        </div>
      
      ) : selectedUjkDetail ? (
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setSelectedUjkDetail(null)}>Kembali</Button>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#0f172a' }}>Penerbitan Dokumen UJK</h2>
              <p className="text-muted" style={{ margin: 0 }}>{selectedUjkDetail.id} - {selectedUjkDetail.instansi}</p>
            </div>
          </div>
          <div className="dashboard-card" style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Asesor 1</div>
                  <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{selectedUjkDetail.asesor1 || '-'}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Asesor 2</div>
                  <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{selectedUjkDetail.asesor2 || '-'}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '12px 15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Penyelia LSP</div>
                  <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{selectedUjkDetail.penyelia || '-'}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: '1. Surat Balasan', done: selectedUjkDetail.docs.balasan, key: 'balasan', type: 'Surat Balasan' },
                  { title: '2. Surat Tugas', done: selectedUjkDetail.docs.spt, key: 'spt', type: 'Surat Tugas' },
                  { title: '3. Srt. Permohonan', done: selectedUjkDetail.docs.permohonan, key: 'permohonan', type: 'Surat Permohonan' },
                  { title: '4. Administrasi', done: selectedUjkDetail.docs.administrasi, key: 'administrasi', type: 'Administrasi' },
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
                  <option value="Menunggu Surat">Menunggu Surat</option>
                  <option value="Surat Diterbitkan">Surat Diterbitkan</option>
                </select>
              </div>
            </div>
            <div className="table-responsive" style={{ padding: '20px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '25%' }}>Surat & Instansi</th>
                    <th style={{ width: '25%' }}>Skema & Bidang</th>
                    <th style={{ width: '20%' }}>Pelaksanaan & TUK</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDaftar.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', color: '#94a3b8' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td><strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem' }}>{item.nomorSurat}</strong><small className="text-muted"><i className="fas fa-building"></i> {item.instansi}</small></td>
                      <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.skema}</span><small className="text-muted" style={{ display: 'block' }}>{item.bidang}</small></td>
                      <td><span style={{ fontWeight: '600', color: '#334155' }}><i className="far fa-calendar-alt text-muted" style={{marginRight: '4px'}}></i> {item.tglMulai}</span><small className="text-muted" style={{ display: 'block' }}>{item.tuk}</small></td>
                      <td style={{ textAlign: 'center' }}><span className={`badge ${item.badge}`}>{item.status}</span></td>
                      <td style={{ textAlign: 'center' }}><Button variant="primary" size="sm" onClick={() => setSelectedUjkDetail(item)}>Kelola</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredDaftar.length} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      )}

      {/* 3. MODAL POP-UP (KINI BERADA DI ROOT SEHINGGA BISA DIPANGGIL KAPAN SAJA) */}
      {isFormOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ width: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
            <div className="modal-header"><h3 style={{margin:0}}>Lengkapi Data Surat</h3><button className="modal-close" onClick={() => setIsFormOpen(false)}>&times;</button></div>
            <div className="modal-body">
              <form onSubmit={handleGenerateSurat}>
                <div style={{ marginBottom: '15px' }}><label>Nomor Surat LSP</label><input type="text" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required /></div>
                <div style={{ marginBottom: '20px' }}><label>Tanggal Dikeluarkan Surat</label><input type="date" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px', padding: '10px'}} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required /></div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="secondary" onClick={() => setIsFormOpen(false)} isFullWidth>Batal</Button>
                  <Button type="submit" variant="primary" icon="magic" isFullWidth>Generate PDF</Button>
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