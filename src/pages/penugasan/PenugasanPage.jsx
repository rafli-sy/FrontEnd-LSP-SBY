import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import SuratPermohonan from '../surat/SuratPermohonan'; 
import SuratTugas from '../surat/SuratTugas'; 
import SuratBalasan from '../surat/SuratBalasan';
import TemplateAdministrasi from '../surat/TemplateAdministrasi';
import TablePeserta from '../TablePeserta/TablePeserta'; 
import './PenugasanPage.css';

const masterAsesor = [
  { id: 1, nama: 'Endang Lestari', noReg: 'MET.011411 2019', bidang: 'Garmen', skema: ['Menjahit'], load1Tahun: 2, status: 'Available' },
  { id: 2, nama: 'Ahmad Fauzi', noReg: 'MET.123456 2020', bidang: 'Pariwisata', skema: ['Barista', 'Pembuatan Roti Dan Kue'], load1Tahun: 0, status: 'Available' },
  { id: 3, nama: 'No Na Esther', noReg: 'MET.005313 2018', bidang: 'Pariwisata', skema: ['Pembuatan Roti Dan Kue'], load1Tahun: 4, status: 'Available' },
  { id: 4, nama: 'Risna Amalia', noReg: 'MET.003697 2013', bidang: 'TIK', skema: ['Practical Office Advance'], load1Tahun: 12, status: 'Sedang Bertugas' },
  { id: 5, nama: 'Budi Santoso', noReg: 'MET.999888 2021', bidang: 'Pariwisata', skema: ['Barista'], load1Tahun: 8, status: 'Available' },
];

const daftarPenyelia = ['Miftahul Huda', 'Mohamad Andrian A', 'Budi Santoso'];
const dokumenAdministrasiList = [ { code: 'DOC.01', name: 'Laporan Penyelia' }, { code: 'DOC.02', name: 'BA Baru' }, { code: 'DOC.03', name: 'Penerapan TUK' }, { code: 'DOC.04', name: 'SK Penyelenggara' }, { code: 'DOC.05', name: 'Lampiran SK' }, { code: 'DOC.06', name: 'DH Pra' }, { code: 'DOC.07', name: 'DH 1' }, { code: 'DOC.08', name: 'DH 2' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2' }, { code: 'DOC.12', name: 'Pengembalian Dokumen Asesmen' }, { code: 'DOC.13', name: 'Rencana Verifikasi TUK' } ];

const PenugasanPage = () => {
  const navigate = useNavigate();

  const [antreanSurat, setAntreanSurat] = useState([
    {
      idUjk: 'UJK-001', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBD', skema: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', asesi: 16,
      hari1: '2026-02-18', hari2: '2026-02-19', waktu: '08.00 WIB s/d selesai', tuk: 'UPT BLK Surabaya',
      asesor1: 'No Na Esther', noReg1: 'MET.005313 2018',
      asesor2: '', noReg2: '',
      penyelia: 'Miftahul Huda',
      isPlotted: true,
      statusSurat: { balasan: false, permohonan: true, tugas: true, administrasi: ['DOC.01'] }
    },
    {
      idUjk: 'UJK-002', pengusul: 'UPT BLK Wonojati', pendanaan: 'APBD', skema: 'Barista', bidang: 'Pariwisata', asesi: 20,
      hari1: '', hari2: '', waktu: '08.00 WIB s/d selesai', tuk: 'TUK Sewaktu BLK Wonojati',
      asesor1: '', noReg1: '', 
      asesor2: '', noReg2: '', 
      penyelia: '',
      isPlotted: false,
      statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null); 
  const [selectedUjk, setSelectedUjk] = useState(null);
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '', noSuratMasuk: '', tanggalSuratMasuk: '' });
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewAdminUjk, setViewAdminUjk] = useState(null);
  const [viewPesertaUjk, setViewPesertaUjk] = useState(null); 

  const [isAsesorModalOpen, setIsAsesorModalOpen] = useState(false);
  const [asesorTargetRole, setAsesorTargetRole] = useState(''); 
  const [filterBidang, setFilterBidang] = useState('');
  const [filterSkema, setFilterSkema] = useState('');

  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });

  const showAlert = (type, title, text, action = null) => {
    setAlertConfig({ type, title, text, action });
    if (type === 'success' || type === 'warning' || type === 'info') {
      setTimeout(() => setAlertConfig({ type: null, title: '', text: '', action: null }), 2000);
    }
  };

  const handleConfirmAlert = () => {
    if (alertConfig.action) alertConfig.action();
    setAlertConfig({ type: null, title: '', text: '', action: null });
  };

  const handleCancelAlert = () => setAlertConfig({ type: null, title: '', text: '', action: null });

  const handleOpenAsesorModal = (role, bidangUjk, skemaUjk) => {
    setAsesorTargetRole(role);
    setFilterBidang(bidangUjk || ''); setFilterSkema(skemaUjk || '');   
    setIsAsesorModalOpen(true);
  };

  const handlePilihAsesor = (asesor) => {
    if(asesor && asesor.status !== 'Available') {
       showAlert('warning', 'Akses Ditolak', 'Asesor sedang bertugas! Pilih asesor yang Available.');
       return;
    }
    setEditData(prev => ({ ...prev, [asesorTargetRole]: asesor?.nama || '', [`noReg${asesorTargetRole === 'asesor1' ? '1' : '2'}`]: asesor?.noReg || '' }));
    setIsAsesorModalOpen(false);
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filteredAsesors = useMemo(() => {
    try {
      return masterAsesor
        .filter(a => (a.bidang || '').toLowerCase().includes((filterBidang || '').toLowerCase()) && (a.skema || []).some(s => (s || '').toLowerCase().includes((filterSkema || '').toLowerCase())))
        .sort((a, b) => (a.load1Tahun || 0) - (b.load1Tahun || 0)); 
    } catch (error) { return []; }
  }, [filterBidang, filterSkema]);

  const handleGoToPeserta = (item) => {
    const dummyPeserta = Array.from({ length: item.asesi || 10 }).map((_, i) => ({
      id: i + 1, nama: `Peserta Asesi ke-${i + 1}`, nik: `35780000000000${i}`, jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '01 Januari 2000', alamat: 'Jl. Pahlawan', rt: '01', rw: '02', kelurahan: 'Sidoarjo', kecamatan: 'Sidoarjo Kota', hp: '0800000000', email: `peserta${i+1}@gmail.com`, pendidikan: 'SMK'
    }));
    setViewPesertaUjk({ ...item, peserta: dummyPeserta });
  };

  const handleMulaiPlotting = (item) => {
    setEditingId(item.idUjk);
    setEditData({ ...item });
    showAlert('info', 'Mode Edit Aktif', 'Silakan tentukan jadwal dan pilih tim Asesor dari daftar.');
  };

  const handleBatalEdit = () => {
    setEditingId(null);
    showAlert('warning', 'Dibatalkan', 'Perubahan Plotting dibatalkan.');
  };

  const handleSimpanPlotting = () => {
    if (!editData.asesor1 || !editData.penyelia || !editData.hari1 || !editData.hari2) {
      showAlert('warning', 'Data Belum Lengkap', 'Pastikan Tanggal Ujian, Asesor 1, dan Penyelia telah terisi semua.');
      return;
    }
    showAlert('save', 'Simpan Plotting', 'Apakah Anda yakin ingin menetapkan jadwal dan tim asesor ini?', () => {
      setAntreanSurat(prev => prev.map(item => item.idUjk === editingId ? { ...editData, isPlotted: true } : item));
      setEditingId(null);
      showAlert('success', 'Berhasil Di-deploy', 'Plotting Asesor dan Jadwal berhasil disimpan!');
    });
  };

  const handleTolakUjk = (id) => {
    showAlert('delete', 'Tolak Pengajuan', 'Apakah Anda yakin ingin menolak pengajuan ini?', () => {
      setAntreanSurat(prev => prev.filter(item => item.idUjk !== id));
      showAlert('success', 'Ditolak', 'Pengajuan UJK telah berhasil ditolak dan dihapus dari antrean.');
    });
  };

  const handleDocClick = (item, jenis) => {
    if (!item.isPlotted) {
      showAlert('warning', 'Terkunci', 'Anda harus melengkapi Plotting Jadwal & Asesor terlebih dahulu sebelum mencetak dokumen.');
      return;
    }
    if (jenis === 'administrasi') {
      setViewAdminUjk(item);
    } else {
      setSelectedUjk(item); setFormType(jenis);
      setFormData({ noSurat: `000.140${jenis === 'tugas' ? 'D' : 'A'}/LSP BLK-SBY/III/2026`, tanggalSurat: '11 Maret 2026', noSuratMasuk: '', tanggalSuratMasuk: '' });
      setIsFormOpen(true);
    }
  };

  const handleGenerateSurat = (e) => {
    e.preventDefault(); 
    setIsFormOpen(false);
    const safeTuk = selectedUjk?.tuk ? String(selectedUjk.tuk) : 'TUK Belum Ditentukan';
    const safeWaktu = selectedUjk?.waktu ? String(selectedUjk.waktu) : 'Waktu Belum Ditentukan';
    const safePengusul = selectedUjk?.pengusul ? String(selectedUjk.pengusul) : 'Instansi Pemohon';
    const safeDataUjk = { ...selectedUjk, tuk: safeTuk, waktu: safeWaktu, pengusul: safePengusul };

    setPreviewDokumen({ 
      dataUjk: safeDataUjk, 
      jenis: formType, 
      formData: { ...formData, tempat: safeTuk, waktu: safeWaktu, kepadaTujuan: safePengusul.replace('UPT BLK', 'UPT Balai Latihan Kerja') } 
    });
    showAlert('success', 'Berhasil Digenerate', 'Pratinjau template surat telah siap untuk dicetak.');
  };
  
  const handleTandaiSelesai = () => {
    let updatedViewAdminUjk = null;
    const updatedAntrean = antreanSurat.map(item => {
      if (item.idUjk === previewDokumen?.dataUjk?.idUjk) {
        if (previewDokumen.jenis === 'administrasi') {
          const currentDocs = item.statusSurat?.administrasi || [];
          const newDocs = currentDocs.includes(previewDokumen.docData?.code) ? currentDocs : [...currentDocs, previewDokumen.docData?.code];
          const updatedItem = { ...item, statusSurat: { ...item.statusSurat, administrasi: newDocs } };
          if (viewAdminUjk && viewAdminUjk.idUjk === updatedItem.idUjk) updatedViewAdminUjk = updatedItem;
          return updatedItem;
        } else return { ...item, statusSurat: { ...item.statusSurat, [previewDokumen.jenis]: true } };
      }
      return item;
    });
    setAntreanSurat(updatedAntrean);
    if (updatedViewAdminUjk) setViewAdminUjk(updatedViewAdminUjk);
    window.print();
    setPreviewDokumen(null);
  };

  return (
    <div className="dashboard-content fade-in-content" style={{ backgroundColor: '#f4f7fb', padding: '20px', minHeight: '100vh' }}>
      
      {alertConfig.type && (
        <AlertPopup type={alertConfig.type} title={alertConfig.title} text={alertConfig.text} onConfirm={handleConfirmAlert} onCancel={handleCancelAlert} />
      )}

      {viewPesertaUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setViewPesertaUjk(null)}>Kembali ke Plotting</Button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Data Peserta - {viewPesertaUjk.skema}</h2>
              <p className="text-muted" style={{ margin: 0 }}>Instansi: <strong>{viewPesertaUjk.pengusul}</strong></p>
            </div>
          </div>
          <TablePeserta dataPeserta={viewPesertaUjk.peserta} skemaName={viewPesertaUjk.skema} />
        </div>
      ) : previewDokumen ? (
        <div className="print-preview-container">
          <div className="no-print print-header">
            <div><h3>Pratinjau Dokumen</h3></div>
            <div style={{ display: 'flex', gap: '10px' }}><button className="btn-cancel-sm" onClick={() => setPreviewDokumen(null)}>Kembali</button><button className="btn-save-sm" onClick={handleTandaiSelesai}>Cetak Dokumen</button></div>
          </div>
          <div id="print-area">
             {previewDokumen.jenis === 'balasan' && <SuratBalasan data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
             {previewDokumen.jenis === 'tugas' && <SuratTugas data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
             {previewDokumen.jenis === 'permohonan' && <SuratPermohonan data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
             {previewDokumen.jenis === 'administrasi' && <TemplateAdministrasi data={{ ujk: previewDokumen.dataUjk, docName: previewDokumen.docData?.name, docCode: previewDokumen.docData?.code }} />}
          </div>
        </div>
      ) : viewAdminUjk ? (
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <button className="btn-cancel-sm" onClick={() => setViewAdminUjk(null)}>Kembali</button>
            <h2>Dokumen Administrasi - {viewAdminUjk?.skema}</h2>
          </div>
          <div className="admin-docs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {dokumenAdministrasiList.map((doc, index) => {
              const isPrinted = viewAdminUjk?.statusSurat?.administrasi?.includes(doc.code);
              return (
                <div key={index} className={`admin-doc-card ${isPrinted ? 'is-done' : ''}`} style={{ padding: '20px', borderRadius: '10px', border: `1px solid ${isPrinted ? '#10b981' : '#cbd5e1'}`, backgroundColor: isPrinted ? '#ecfdf5' : '#fff' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: isPrinted ? '#047857' : '#1e293b' }}>{doc.code} - {doc.name}</h3>
                  <Button variant={isPrinted ? 'outline' : 'primary'} size="sm" isFullWidth onClick={() => setPreviewDokumen({ dataUjk: viewAdminUjk, jenis: 'administrasi', docData: doc })}>{isPrinted ? 'Cetak Ulang' : 'Generate File'}</Button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="dashboard-header" style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px' }}>Penugasan</h2>
            <p className="text-muted">Atur jadwal pelaksanaan, distribusikan Asesor, dan terbitkan dokumen surat persetujuan LSP.</p>
          </div>
          
          <div className="sm-card">
            <div className="table-responsive-wrapper">
              <div className="my-grid-table">
                
                <div className="my-grid-header">
                  <div className="col-no">NO</div>
                  <div className="col-info">INFORMASI PENGAJUAN</div>
                  <div className="col-deploy">STATUS DEPLOYMENT</div>
                  <div className="col-doc">GENERATE TEMPLATE SURAT</div>
                  <div className="col-action">AKSI</div>
                </div>

                {/* --- MENGURUTKAN TANGGAL PENGAJUAN DARI YANG TERBARU --- */}
                {[...antreanSurat].sort((a,b) => new Date(b.hari1 || '2099-01-01') - new Date(a.hari1 || '2099-01-01')).map((item, index) => {
                  const isEditing = editingId === item.idUjk || (!item.isPlotted && editingId === item.idUjk);

                  return (
                    <div className={`my-grid-row ${isEditing ? 'editing' : ''}`} key={item.idUjk}>
                      
                      <div className="col-no"><div className="circle-number">{index + 1}</div></div>

                      <div className="col-info">
                        <div className="sm-instansi"><strong>{item.pengusul}</strong><span className="sm-badge-blue">{item.pendanaan}</span></div>
                        <div className="sm-skema-title">{item.skema}</div>
                        <div className="sm-skema-meta">Bidang: {item.bidang}</div>
                        
                        <button className="btn-link-asesi" onClick={() => handleGoToPeserta(item)}>
                          <i className="fas fa-users"></i> <span>Data Peserta: <strong>{item.asesi} Asesi</strong></span>
                        </button>
                        
                        {isEditing ? (
                          <div className="edit-date-panel">
                            <div className="edit-date-title"><i className="fas fa-calendar-day"></i> Pilih Tanggal Pelaksanaan</div>
                            <div className="cool-input-group" style={{ display: 'flex', gap: '10px' }}>
                              {/* PERBAIKAN: Input Type Date */}
                              <input type="date" className="cool-input" name="hari1" value={editData.hari1} onChange={handleEditChange} style={{ flex: 1, padding: '8px' }} />
                              <div style={{ alignSelf: 'center', fontWeight: 'bold' }}>-</div>
                              <input type="date" className="cool-input" name="hari2" value={editData.hari2} onChange={handleEditChange} style={{ flex: 1, padding: '8px' }} />
                            </div>
                            
                            <div className="fixed-info-box mt-2">
                               <div className="fixed-item"><i className="fas fa-lock"></i> <strong>Jam:</strong> {item.waktu || '-'}</div>
                               <div className="fixed-item mt-1"><i className="fas fa-lock"></i> <strong>TUK:</strong> {item.tuk || '-'}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="sm-date-box">
                            <div className="date-item"><i className="far fa-calendar-alt text-blue"></i> <span><strong>Tgl:</strong> {item.hari1 ? `${item.hari1} s/d ${item.hari2}` : 'Tanggal Belum Diatur'}</span></div>
                            <div className="date-item"><i className="far fa-clock text-blue"></i> <span><strong>Jam:</strong> {item.waktu || '-'}</span></div>
                            <div className="date-item"><i className="fas fa-map-marker-alt text-red"></i> <span><strong>TUK:</strong> {item.tuk || '-'}</span></div>
                          </div>
                        )}
                      </div>

                      <div className="col-deploy">
                        {isEditing ? (
                          <div className="edit-deploy-panel">
                            <label className="edit-label">Asesor 1</label>
                            {/* PERBAIKAN: Visual Pemilihan Asesor Disamakan */}
                            <Button variant="outline" icon="user-tie" isFullWidth onClick={() => handleOpenAsesorModal('asesor1', editData.bidang, editData.skema)} style={{ justifyContent: 'flex-start' }}>
                              {editData.asesor1 || 'Pilih Asesor 1...'}
                            </Button>

                            <label className="edit-label mt-2">Asesor 2 (Opsional)</label>
                            <Button variant="outline" icon="user-tie" isFullWidth onClick={() => handleOpenAsesorModal('asesor2', editData.bidang, editData.skema)} style={{ justifyContent: 'flex-start' }}>
                              {editData.asesor2 || 'Pilih Asesor 2...'}
                            </Button>

                            <label className="edit-label mt-2">Penyelia LSP</label>
                            <div className="cool-input-group" style={{marginBottom: 0, display: 'flex'}}>
                              <div style={{ padding: '8px 12px', backgroundColor: '#e2e8f0', borderRadius: '6px 0 0 6px' }}><i className="fas fa-user-shield"></i></div>
                              <select className="cool-input" name="penyelia" value={editData.penyelia} onChange={handleEditChange} style={{ flex: 1, borderRadius: '0 6px 6px 0' }}>
                                <option value="">-- Pilih Penyelia --</option>
                                {daftarPenyelia.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="deploy-pill-container">
                            <div className={`deploy-pill ${item.asesor1 ? 'filled' : 'empty'}`}>
                              <div className="pill-icon"><i className="fas fa-user-tie"></i></div>
                              <div className="deploy-pill-content">
                                <span className="deploy-pill-label">Asesor 1</span>
                                <span className="deploy-pill-value">{item.asesor1 || 'Belum di-plot'}</span>
                              </div>
                            </div>
                            
                            <div className={`deploy-pill ${item.asesor2 ? 'filled' : 'empty'}`}>
                              <div className="pill-icon"><i className="fas fa-user-tie"></i></div>
                              <div className="deploy-pill-content">
                                <span className="deploy-pill-label">Asesor 2</span>
                                <span className="deploy-pill-value">{item.asesor2 || 'Belum di-plot'}</span>
                              </div>
                            </div>

                            <div className={`deploy-pill ${item.penyelia ? 'filled' : 'empty'}`}>
                              <div className="pill-icon"><i className="fas fa-user-shield"></i></div>
                              <div className="deploy-pill-content">
                                <span className="deploy-pill-label">Penyelia</span>
                                <span className="deploy-pill-value">{item.penyelia || 'Belum di-plot'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-doc">
                        <button className={`doc-pill ${!item.isPlotted ? 'disabled' : item.statusSurat.balasan ? 'done' : 'action'}`} onClick={() => handleDocClick(item, 'balasan')}>
                          <div className={`pill-icon ${item.statusSurat.balasan ? 'bg-green' : 'bg-blue'}`}><i className={`fas ${!item.isPlotted ? 'fa-lock' : item.statusSurat.balasan ? 'fa-check' : 'fa-reply'}`}></i></div>
                          <span>1. Surat Balasan BLK</span>
                        </button>
                        
                        <button className={`doc-pill mt-2 ${!item.isPlotted ? 'disabled' : item.statusSurat.tugas ? 'done' : 'action'}`} onClick={() => handleDocClick(item, 'tugas')}>
                          <div className={`pill-icon ${item.statusSurat.tugas ? 'bg-green' : 'bg-orange'}`}><i className={`fas ${!item.isPlotted ? 'fa-lock' : item.statusSurat.tugas ? 'fa-check' : 'fa-file-signature'}`}></i></div>
                          <span>2. Surat Tugas (SPT)</span>
                        </button>

                        <button className={`doc-pill mt-2 ${!item.isPlotted ? 'disabled' : item.statusSurat.permohonan ? 'done' : 'action'}`} onClick={() => handleDocClick(item, 'permohonan')}>
                          <div className={`pill-icon ${item.statusSurat.permohonan ? 'bg-green' : 'bg-purple'}`}><i className={`fas ${!item.isPlotted ? 'fa-lock' : item.statusSurat.permohonan ? 'fa-check' : 'fa-envelope-open-text'}`}></i></div>
                          <span>3. Surat Permohonan</span>
                        </button>

                        <button className={`doc-pill mt-2 ${!item.isPlotted ? 'disabled' : item.statusSurat.administrasi?.length === 13 ? 'done' : 'action'}`} onClick={() => handleDocClick(item, 'administrasi')}>
                          <div className={`pill-icon ${item.statusSurat.administrasi?.length === 13 ? 'bg-green' : 'bg-gray'}`}><i className={`fas ${!item.isPlotted ? 'fa-lock' : item.statusSurat.administrasi?.length === 13 ? 'fa-check' : 'fa-folder-open'}`}></i></div>
                          <span>4. Administrasi Dokumen</span>
                        </button>
                      </div>

                      <div className="col-action">
                        {isEditing ? (
                          <div className="action-buttons-group">
                            <button className="btn-save-sm w-full" onClick={handleSimpanPlotting}><i className="fas fa-save"></i> Simpan Data</button>
                            {item.isPlotted && <button className="btn-cancel-sm w-full mt-2" onClick={handleBatalEdit}><i className="fas fa-times"></i> Batal Edit</button>}
                          </div>
                        ) : (
                          <div className="action-buttons-group">
                            {!item.isPlotted ? (
                              <button className="btn-save-sm w-full" onClick={() => handleMulaiPlotting(item)} style={{background:'#3b82f6'}}>
                                <i className="fas fa-user-plus"></i> Plotting Tim
                              </button>
                            ) : (
                              <>
                                <button className="btn-edit-outline w-full" onClick={() => handleMulaiPlotting(item)}><i className="fas fa-edit"></i> Edit Plotting</button>
                                <button className="btn-tolak-outline w-full mt-2" onClick={() => handleTolakUjk(item.idUjk)}><i className="fas fa-ban"></i> Tolak UJK</button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL PILIH ASESOR */}
      {isAsesorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}><i className="fas fa-filter text-blue"></i> Filter Cerdas Pemilihan Asesor</h3>
              <button className="modal-close" onClick={() => setIsAsesorModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="asesor-filter-bar">
                <div className="filter-group">
                  <label>Penyaringan Bidang</label>
                  <input type="text" value={filterBidang} onChange={(e) => setFilterBidang(e.target.value)} />
                </div>
                <div className="filter-group">
                  <label>Penyaringan Skema</label>
                  <input type="text" value={filterSkema} onChange={(e) => setFilterSkema(e.target.value)} />
                </div>
                <button className="btn-cancel-sm" style={{alignSelf:'flex-end', height:'38px'}} onClick={() => handlePilihAsesor({nama:'', noReg:''})}>Kosongkan</button>
              </div>

              <div className="asesor-list-info">
                Ditemukan <strong>{filteredAsesors.length}</strong> Asesor. Diurutkan berdasarkan Beban Kerja terendah.
              </div>

              <div className="asesor-grid">
                {filteredAsesors.map((asesor) => (
                  <div key={asesor.id} className={`asesor-card ${asesor.load1Tahun === 0 ? 'prioritas' : ''}`}>
                    {asesor.load1Tahun === 0 && <div className="badge-prioritas">PRIORITAS</div>}
                    <div className="ac-header">
                      <div className="ac-title">
                        <h4>{asesor.nama}</h4>
                        <p>{asesor.noReg}</p>
                      </div>
                      <span className={`status-badge ${asesor.status === 'Available' ? 'hijau' : 'merah'}`}>{asesor.status}</span>
                    </div>
                    <div className="ac-body">
                       <p style={{fontSize:'0.85rem', margin:0}}><strong>Bidang:</strong> {asesor.bidang}</p>
                       <div style={{fontSize:'0.8rem', marginTop:'6px', color:'#64748b'}}>{asesor.skema.join(', ')}</div>
                    </div>
                    <div className="ac-footer">
                      <div className="ac-stats">Beban 1 Thn: <strong>{asesor.load1Tahun}x</strong></div>
                      <button className="btn-save-sm" onClick={() => handlePilihAsesor(asesor)}>Pilih</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ISI NOMOR SURAT */}
      {isFormOpen && (
         <div className="modal-overlay">
           <div className="modal-content" style={{ width: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '0' }}>
             <div className="modal-header"><h3 style={{margin:0}}>Lengkapi Data Surat</h3><button className="modal-close" onClick={() => setIsFormOpen(false)}>&times;</button></div>
             <div className="modal-body">
                <form onSubmit={handleGenerateSurat}>
                  {formType === 'balasan' && (
                    <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px dashed #fca5a5', borderRadius: '8px', marginBottom: '18px' }}>
                      <label style={{display:'block', fontSize:'0.85rem', fontWeight:'bold', color:'#991b1b', marginBottom:'6px'}}>Nomor Surat Masuk BLK</label>
                      <input type="text" className="cool-input" style={{width:'100%', border:'1px solid #fca5a5', borderRadius:'6px'}} name="noSuratMasuk" value={formData.noSuratMasuk || ''} onChange={handleInputChange} placeholder="Contoh: 500.15/2026" required />
                      <label style={{display:'block', fontSize:'0.85rem', fontWeight:'bold', color:'#991b1b', margin:'10px 0 6px 0'}}>Tanggal Surat Masuk</label>
                      <input type="date" className="cool-input" style={{width:'100%', border:'1px solid #fca5a5', borderRadius:'6px'}} name="tanggalSuratMasuk" value={formData.tanggalSuratMasuk || ''} onChange={handleInputChange} required />
                    </div>
                  )}
                  <div className="form-group" style={{ marginBottom: '15px' }}><label className="edit-label">Nomor Surat LSP</label><input type="text" className="cool-input" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px'}} name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required /></div>
                  <div className="form-group" style={{ marginBottom: '25px' }}><label className="edit-label">Tanggal Penetapan</label><input type="date" className="cool-input" style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'6px'}} name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required /></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" className="btn-cancel-sm w-full" onClick={() => setIsFormOpen(false)}>Batal</button>
                    <button type="submit" className="btn-save-sm w-full"><i className="fas fa-magic"></i> Generate</button>
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