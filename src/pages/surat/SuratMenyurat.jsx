import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal'; 
import AlertPopup from '../../components/ui/AlertPopup'; // <-- IMPORT ALERT POPUP
import SuratPermohonan from './SuratPermohonan'; 
import SuratTugas from './SuratTugas'; 
import SuratBalasan from './SuratBalasan'; // <-- IMPORT SURAT BALASAN BARU
import TemplateAdministrasi from './TemplateAdministrasi';
import './SuratMenyurat.css';

const SuratMenyurat = () => {
  const [antreanSurat, setAntreanSurat] = useState([
    {
      idUjk: 'UJK-001', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBD', skema: 'Menjahit dengan Mesin Lockstich', bidang: 'Garmen', asesi: 16,
      hari1: 'Senin, 16 Maret 2026', hari2: 'Selasa, 17 Maret 2026', waktu: '08.00 WIB s/d selesai', tuk: 'UPT BLK Mojokerto',
      asesor1: 'Wasini, SE, MM', noReg1: 'MET.000.001668.2012', asalDaerah1: 'Ponorogo',
      asesor2: 'Endang Lestari', noReg2: 'MET.000.011411 2019', asalDaerah2: 'Jombang',
      penyelia: 'Miftahul Huda',
      // DITAMBAHKAN: balasan: false
      statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }
    },
    {
      idUjk: 'UJK-002', pengusul: 'UPT BLK Wonojati', pendanaan: 'APBD', skema: 'Barista', bidang: 'Pariwisata', asesi: 16,
      hari1: 'Kamis, 02 Mar 2026', hari2: 'Jumat, 03 Mar 2026', waktu: '08.00 WIB s/d selesai', tuk: 'TUK Sewaktu BLK Wonojati',
      asesor1: '', noReg1: '', asalDaerah1: '',
      asesor2: '', noReg2: '', asalDaerah2: '',
      penyelia: '',
      statusSurat: { balasan: false, permohonan: false, tugas: false, administrasi: [] }
    }
  ]);

  const dokumenAdministrasiList = [
    { code: 'DOC.01', name: 'Laporan Penyelia' },
    { code: 'DOC.02', name: 'BA Baru' },
    { code: 'DOC.03', name: 'Penerapan TUK' },
    { code: 'DOC.04', name: 'SK Penyelenggara' },
    { code: 'DOC.05', name: 'Lampiran SK' },
    { code: 'DOC.06', name: 'DH Pra' },
    { code: 'DOC.07', name: 'DH 1' },
    { code: 'DOC.08', name: 'DH 2' },
    { code: 'DOC.09', name: 'Tanda Terima Dokumen' },
    { code: 'DOC.10', name: 'Pernyataan Asesor 1' },
    { code: 'DOC.11', name: 'Pernyataan Asesor 2' },
    { code: 'DOC.12', name: 'Pengembalian Dokumen Asesmen' }
  ];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null); 
  const [selectedUjk, setSelectedUjk] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewAdminUjk, setViewAdminUjk] = useState(null);

  // ========================================================
  // SISTEM MANAJEMEN ALERT POPUP (ANTI-STUCK / ANTI-PUTIH)
  // ========================================================
  const [alertConfig, setAlertConfig] = useState({ type: null, title: '', text: '', action: null });

  const showSuccess = (title, text) => {
    setAlertConfig({ type: 'success', title, text, action: null });
    setTimeout(() => {
      setAlertConfig({ type: null, title: '', text: '', action: null });
    }, 2000);
  };

  const confirmAction = (title, text, actionFn) => {
    setAlertConfig({ type: 'save', title, text, action: actionFn });
  };

  const handleConfirmAlert = () => {
    const actionToRun = alertConfig.action;
    if (actionToRun) {
      actionToRun();
    } else {
      setAlertConfig({ type: null, title: '', text: '', action: null });
    }
  };
  // ========================================================

  const handleOpenForm = (item, jenis) => {
    setSelectedUjk(item);
    setFormType(jenis);
    setFormData({ noSurat: `000.140${jenis === 'tugas' ? 'D' : 'A'}/LSP BLK-SBY/III/2026`, tanggalSurat: '11 Maret 2026', noSuratMasuk: '', tanggalSuratMasuk: '' });
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGenerateSurat = (e) => {
    e.preventDefault();
    setIsFormOpen(false);
    const completeFormData = {
      ...formData,
      tempat: selectedUjk.tuk,
      waktu: selectedUjk.waktu,
      kepadaTujuan: selectedUjk.pengusul.replace('UPT BLK', 'UPT Balai Latihan Kerja') // Lebih formal untuk balasan
    };
    setPreviewDokumen({ dataUjk: selectedUjk, jenis: formType, formData: completeFormData });
    showSuccess('Template Siap', 'Silakan periksa pratinjau sebelum mencetak dokumen.');
  };

  const handleGenerateAdminDoc = (doc) => {
    setPreviewDokumen({ dataUjk: viewAdminUjk, jenis: 'administrasi', docData: doc });
  };

  const handleTandaiSelesai = () => {
    let updatedViewAdminUjk = null;

    const updatedAntrean = antreanSurat.map(item => {
      if (item.idUjk === previewDokumen.dataUjk.idUjk) {
        
        if (previewDokumen.jenis === 'administrasi') {
          const currentAdminDocs = item.statusSurat.administrasi || [];
          const newAdminDocs = currentAdminDocs.includes(previewDokumen.docData.code)
            ? currentAdminDocs
            : [...currentAdminDocs, previewDokumen.docData.code];

          const updatedItem = {
            ...item,
            statusSurat: { ...item.statusSurat, administrasi: newAdminDocs }
          };

          if (viewAdminUjk && viewAdminUjk.idUjk === updatedItem.idUjk) {
            updatedViewAdminUjk = updatedItem;
          }

          return updatedItem;
        } 
        else {
          return { ...item, statusSurat: { ...item.statusSurat, [previewDokumen.jenis]: true } };
        }
      }
      return item;
    });

    setAntreanSurat(updatedAntrean);
    if (updatedViewAdminUjk) setViewAdminUjk(updatedViewAdminUjk);

    window.print();
    setPreviewDokumen(null);
    showSuccess('Berhasil!', 'Dokumen telah dicetak dan status progres tersimpan.');
  };

  return (
    <div className="dashboard-content fade-in-content">
      
      {alertConfig.type && (
        <AlertPopup
          type={alertConfig.type}
          title={alertConfig.title}
          text={alertConfig.text}
          onConfirm={handleConfirmAlert}
          onCancel={() => setAlertConfig({ type: null, title: '', text: '', action: null })}
        />
      )}

      {previewDokumen ? (
        <div className="print-preview-container">
          <div className="no-print print-header">
            <div>
              <h3>Pratinjau Dokumen</h3>
              <p>Periksa hasil <i>generate</i> template sebelum mencetak. Aksi cetak akan menyimpan status otomatis.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
              <Button 
                variant="success" 
                icon="print" 
                onClick={() => confirmAction('Konfirmasi Cetak', 'Apakah Anda yakin ingin mencetak dan menyimpan status dokumen ini?', handleTandaiSelesai)}
              >
                Cetak Dokumen
              </Button>
            </div>
          </div>

          <div id="print-area">
            {previewDokumen.jenis === 'balasan' && <SuratBalasan data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
            {previewDokumen.jenis === 'tugas' && <SuratTugas data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
            {previewDokumen.jenis === 'permohonan' && <SuratPermohonan data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
            {previewDokumen.jenis === 'administrasi' && <TemplateAdministrasi data={{ ujk: previewDokumen.dataUjk, docName: previewDokumen.docData.name, docCode: previewDokumen.docData.code }} />}
          </div>
        </div>

      ) : viewAdminUjk ? (

        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setViewAdminUjk(null)}>Kembali ke Antrean</Button>
            <div>
              <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Dokumen Administrasi</h2>
              <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{viewAdminUjk.skema}</strong> | TUK: {viewAdminUjk.tuk}</p>
            </div>
          </div>

          <div className="admin-docs-grid">
            {dokumenAdministrasiList.map((doc, index) => {
              const isPrinted = viewAdminUjk.statusSurat.administrasi?.includes(doc.code);

              return (
                <div key={index} className="admin-doc-card" style={isPrinted ? { border: '2px solid #10b981', backgroundColor: '#f0fdf4' } : {}}>
                  <div>
                    <div className="admin-doc-header">
                      <div className="admin-doc-icon" style={isPrinted ? { backgroundColor: '#d1fae5', color: '#10b981' } : {}}>
                        <i className={`fas ${isPrinted ? 'fa-check' : 'fa-file-contract'}`}></i>
                      </div>
                      <div>
                        <span className="admin-doc-code" style={isPrinted ? { backgroundColor: '#d1fae5', color: '#065f46' } : {}}>
                          {doc.code}
                        </span>
                      </div>
                    </div>
                    <h3 className="admin-doc-title" style={isPrinted ? { color: '#065f46' } : {}}>{doc.name}</h3>
                  </div>
                  <Button 
                    variant={isPrinted ? 'success' : 'outline'} 
                    icon={isPrinted ? 'print' : 'magic'} 
                    isFullWidth 
                    style={{ marginTop: '20px' }} 
                    onClick={() => handleGenerateAdminDoc(doc)}
                  >
                    {isPrinted ? 'Cetak Ulang' : 'Generate Dokumen'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

      ) : (

        <>
          <div className="dashboard-header">
            <h2>Pembuatan Dokumen & Administrasi</h2>
            <p className="text-muted">Isi formulir kelengkapan atau cetak dokumen administrasi berdasarkan skema yang telah di-plot.</p>
          </div>
          
          <div className="sm-card mt-20">
            <h3 className="sm-card-title">Daftar Antrean & Status Dokumen</h3>
            
            <div className="sm-list-container">
              <div className="sm-list-header">
                <div className="col-no">NO</div>
                <div className="col-info">INFORMASI PENGAJUAN UJK</div>
                <div className="col-team">DATA PLOTTING ASESOR</div>
                <div className="col-doc">GENERATE TEMPLATE SURAT</div>
              </div>

              {antreanSurat.map((item, index) => {
                const isPlotted = item.asesor1 !== '' && item.penyelia !== '';
                const adminDocsCount = item.statusSurat.administrasi?.length || 0;
                const isAdministrasiDone = adminDocsCount === dokumenAdministrasiList.length;

                return (
                  <div className="sm-list-row" key={item.idUjk}>
                    <div className="col-no"><div className="circle-number">{index + 1}</div></div>

                    <div className="col-info">
                      <div className="sm-instansi"><strong>{item.pengusul}</strong><span className="sm-badge-blue">{item.pendanaan}</span></div>
                      <div className="sm-skema-title">{item.skema}</div>
                      <div className="sm-skema-meta">Bidang: {item.bidang} • {item.asesi} Asesi</div>
                      <div className="sm-date-box">
                        <span><i className="far fa-calendar-alt"></i> <strong>Hari 1:</strong> {item.hari1}</span>
                        <span><i className="far fa-calendar-check"></i> <strong>Hari 2:</strong> {item.hari2}</span>
                      </div>
                    </div>

                    <div className="col-team">
                      <div className="sm-team-item">
                        <span className="team-label">Asesor 1</span>
                        <div className={`team-value ${item.asesor1 ? 'filled' : 'empty'}`}>{item.asesor1 || 'Belum di-plot'}</div>
                      </div>
                      <div className="sm-team-item">
                        <span className="team-label">Asesor 2</span>
                        <div className={`team-value ${item.asesor2 ? 'filled' : 'empty'}`}>{item.asesor2 || '-'}</div>
                      </div>
                      <div className="sm-team-item" style={{ marginTop: '5px' }}>
                        <span className="team-label" style={{ color: '#3b82f6' }}>Penyelia</span>
                        <div className={`team-value ${item.penyelia ? 'filled' : 'empty'}`}>{item.penyelia || 'Belum di-plot'}</div>
                      </div>
                    </div>

                    <div className="col-doc">
                      {/* TOMBOL BARU: 1. SURAT BALASAN */}
                      <button 
                        className={`doc-pill ${!isPlotted ? 'disabled' : item.statusSurat.balasan ? 'done' : 'action'}`}
                        onClick={() => isPlotted && handleOpenForm(item, 'balasan')}
                        disabled={!isPlotted}
                      >
                        <i className={`fas ${!isPlotted ? 'fa-lock' : item.statusSurat.balasan ? 'fa-check-circle' : 'fa-reply'}`}></i> 
                        1. Surat Balasan BLK
                      </button>

                      <button 
                        className={`doc-pill ${!isPlotted ? 'disabled' : item.statusSurat.tugas ? 'done' : 'action'}`}
                        onClick={() => isPlotted && handleOpenForm(item, 'tugas')}
                        disabled={!isPlotted}
                      >
                        <i className={`fas ${!isPlotted ? 'fa-lock' : item.statusSurat.tugas ? 'fa-check-circle' : 'fa-file-signature'}`}></i> 
                        2. Surat Tugas (SPT)
                      </button>

                      <button 
                        className={`doc-pill ${!isPlotted ? 'disabled' : item.statusSurat.permohonan ? 'done' : 'action'}`}
                        onClick={() => isPlotted && handleOpenForm(item, 'permohonan')}
                        disabled={!isPlotted}
                      >
                        <i className={`fas ${!isPlotted ? 'fa-lock' : item.statusSurat.permohonan ? 'fa-check-circle' : 'fa-envelope-open-text'}`}></i> 
                        3. Surat Permohonan
                      </button>
                      
                      <button 
                        className={`doc-pill ${!isPlotted ? 'disabled' : isAdministrasiDone ? 'done' : 'action'}`}
                        onClick={() => isPlotted && setViewAdminUjk(item)}
                        disabled={!isPlotted}
                        style={{ marginTop: '5px' }}
                      >
                        <i className={`fas ${!isPlotted ? 'fa-lock' : isAdministrasiDone ? 'fa-check-circle' : 'fa-folder-open'}`}></i> 
                        4. Administrasi Dokumen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* --- POP-UP MODAL FORM ISIAN --- */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={`Formulir Redaksional: ${formType === 'balasan' ? 'Surat Balasan' : formType === 'tugas' ? 'Surat Tugas (SPT)' : 'Surat Permohonan'}`}>
        <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a' }}>
            <i className="fas fa-info-circle"></i> <strong>Sistem Otomatis:</strong> Data Tujuan, Tempat, dan Waktu telah ditarik secara otomatis dari pengajuan Admin BLK.
          </p>
        </div>

        <form onSubmit={handleGenerateSurat}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nomor Surat LSP</label>
            <input type="text" className="form-input" name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Tanggal Dikeluarkan Surat</label>
            <input type="text" className="form-input" name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required />
          </div>

          {/* INPUT TAMBAHAN KHUSUS SURAT BALASAN */}
          {formType === 'balasan' && (
            <div style={{ padding: '15px', backgroundColor: '#fef2f2', border: '1px dashed #fca5a5', borderRadius: '8px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ color: '#991b1b', fontWeight: 'bold' }}>Nomor Surat Masuk (Dari BLK)</label>
                <input type="text" className="form-input" name="noSuratMasuk" value={formData.noSuratMasuk || ''} onChange={handleInputChange} placeholder="Contoh: 500.15/2026" required />
              </div>
              <div className="form-group">
                <label style={{ color: '#991b1b', fontWeight: 'bold' }}>Tanggal Surat Masuk</label>
                <input type="text" className="form-input" name="tanggalSuratMasuk" value={formData.tanggalSuratMasuk || ''} onChange={handleInputChange} placeholder="Contoh: 12 Maret 2026" required />
              </div>
            </div>
          )}

          <div style={{ padding: '15px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', marginBottom: '25px' }}>
            {(formType === 'permohonan' || formType === 'balasan') && (
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Tujuan Surat (Kepada Yth:)</label>
                <input type="text" className="form-input" value={`Kepala ${selectedUjk?.pengusul || '...'}`} readOnly style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}} />
              </div>
            )}

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Tempat (TUK)</label>
                <input type="text" className="form-input" value={selectedUjk?.tuk || ''} readOnly style={{backgroundColor: '#e2e8f0', cursor: 'not-allowed'}} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setIsFormOpen(false)} style={{ flex: 1 }}>Batal</Button>
            <Button type="submit" variant="primary" icon="magic" style={{ flex: 1 }}>Generate Template</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default SuratMenyurat;