import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal'; 
import SuratPermohonan from '../surat/SuratPermohonan'; 
import SuratTugas from '../surat/SuratTugas'; 
import TemplateAdministrasi from '../surat/TemplateAdministrasi';
import './PenugasanPage.css';

// --- DATA MASTER ASESOR (DENGAN BEBAN KERJA & STATUS) ---
const masterAsesor = [
  { id: 1, nama: 'Endang Lestari', noReg: 'MET.011411 2019', bidang: 'Garmen', skema: ['Menjahit'], load1Tahun: 2, status: 'Available' },
  { id: 2, nama: 'Ahmad Fauzi', noReg: 'MET.123456 2020', bidang: 'Pariwisata', skema: ['Barista', 'Pembuatan Roti Dan Kue'], load1Tahun: 0, status: 'Available' },
  { id: 3, nama: 'No Na Esther', noReg: 'MET.005313 2018', bidang: 'Pariwisata', skema: ['Pembuatan Roti Dan Kue'], load1Tahun: 4, status: 'Available' },
  { id: 4, nama: 'Risna Amalia', noReg: 'MET.003697 2013', bidang: 'TIK', skema: ['Practical Office Advance'], load1Tahun: 12, status: 'Sedang Bertugas' },
  { id: 5, nama: 'Budi Santoso', noReg: 'MET.999888 2021', bidang: 'Pariwisata', skema: ['Barista'], load1Tahun: 8, status: 'Available' },
];

const daftarPenyelia = ['Miftahul Huda', 'Mohamad Andrian A', 'Budi Santoso'];
const dokumenAdministrasiList = [ { code: 'DOC.01', name: 'Laporan Penyelia' }, { code: 'DOC.02', name: 'BA Baru' }, { code: 'DOC.03', name: 'Penerapan TUK' }, { code: 'DOC.04', name: 'SK Penyelenggara' }, { code: 'DOC.05', name: 'Lampiran SK' }, { code: 'DOC.06', name: 'DH Pra' }, { code: 'DOC.07', name: 'DH 1' }, { code: 'DOC.08', name: 'DH 2' }, { code: 'DOC.09', name: 'Tanda Terima Dokumen' }, { code: 'DOC.10', name: 'Pernyataan Asesor 1' }, { code: 'DOC.11', name: 'Pernyataan Asesor 2' }, { code: 'DOC.12', name: 'Pengembalian Dokumen Asesmen' } ];

const PenugasanPage = () => {
  const navigate = useNavigate();

  // --- ANTREAN SURAT DENGAN FILE EXCEL & KURIKULUM ---
  const [antreanSurat, setAntreanSurat] = useState([
    {
      idUjk: 'UJK-001', pengusul: 'UPT BLK Surabaya', pendanaan: 'APBD', skema: 'Pembuatan Roti Dan Kue', bidang: 'Pariwisata', asesi: 16,
      excelFile: 'Data_Nominatif_Roti.xlsx', excelRows: 16, kurikulumFile: 'Kurikulum_Standar.pdf',
      hari1: '18 Feb 2026', hari2: '19 Feb 2026', waktu: '08.00 WIB s/d selesai', tuk: 'Laboratorium Tata Boga BLK',
      asesor1: 'No Na Esther', noReg1: 'MET.005313 2018', asalDaerah1: 'Surabaya',
      asesor2: '', noReg2: '', asalDaerah2: '',
      penyelia: 'Miftahul Huda',
      statusSurat: { permohonan: true, tugas: true, administrasi: ['DOC.01', 'DOC.02'] }
    },
    {
      idUjk: 'UJK-002', pengusul: 'UPT BLK Wonojati', pendanaan: 'APBD', skema: 'Barista', bidang: 'Pariwisata', asesi: 20,
      excelFile: 'Peserta_Barista_Wonojati.xlsx', excelRows: 22, kurikulumFile: 'Silabus_Barista.pdf', // Contoh Kasus Melebihi Kuota
      hari1: '02 Mar 2026', hari2: '05 Mar 2026', waktu: '', tuk: '',
      asesor1: '', noReg1: '', asalDaerah1: '',
      asesor2: '', noReg2: '', asalDaerah2: '',
      penyelia: '',
      statusSurat: { permohonan: false, tugas: false, administrasi: [] }
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(null); 
  const [selectedUjk, setSelectedUjk] = useState(null);
  const [formData, setFormData] = useState({ noSurat: '', tanggalSurat: '' });
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [viewAdminUjk, setViewAdminUjk] = useState(null);

  const [isAsesorModalOpen, setIsAsesorModalOpen] = useState(false);
  const [asesorTargetRole, setAsesorTargetRole] = useState(''); 
  const [filterBidang, setFilterBidang] = useState('');
  const [filterSkema, setFilterSkema] = useState('');
  const [activeUjkId, setActiveUjkId] = useState(null);

  // --- HANDLER MODAL & PLOTTING ASESOR ---
  const handleOpenAsesorModal = (idUjk, role, bidangUjk, skemaUjk) => {
    setActiveUjkId(idUjk); setAsesorTargetRole(role);
    setFilterBidang(bidangUjk || ''); setFilterSkema(skemaUjk || '');   
    setIsAsesorModalOpen(true);
  };

  const handlePilihAsesor = (asesor) => {
    if(asesor && asesor.status !== 'Available') {
       alert('Asesor sedang bertugas! Pilih asesor yang Available.');
       return;
    }
    setEditData(prev => ({ ...prev, [asesorTargetRole]: asesor?.nama || '', [`noReg${asesorTargetRole === 'asesor1' ? '1' : '2'}`]: asesor?.noReg || '' }));
    setIsAsesorModalOpen(false);
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  // Algoritma Load Balancing (Beban Kerja 1 Tahun Terakhir)
  const filteredAsesors = useMemo(() => {
    try {
      return masterAsesor
        .filter(a => (a.bidang || '').toLowerCase().includes((filterBidang || '').toLowerCase()) && (a.skema || []).some(s => (s || '').toLowerCase().includes((filterSkema || '').toLowerCase())))
        .sort((a, b) => (a.load1Tahun || 0) - (b.load1Tahun || 0)); 
    } catch (error) { return []; }
  }, [filterBidang, filterSkema]);

  // --- HANDLER AKSI SIMPAN/EDIT ---
  const handleEditInfo = (item) => {
    setEditingId(item.idUjk);
    setEditData({ ...item }); 
  };
  const handleCancelEdit = () => setEditingId(null);
  const handleSaveInfo = () => {
    // Validasi Excel vs Asesi saat simpan
    if (editData.excelRows > editData.asesi) {
       if(!window.confirm(`Peringatan: Jumlah peserta di Excel (${editData.excelRows}) melebihi kuota (${editData.asesi}). Lanjutkan menyimpan?`)) return;
    }
    setAntreanSurat(prev => prev.map(item => item.idUjk === editingId ? editData : item));
    setEditingId(null);
    alert('Plotting & Penempatan berhasil disimpan. Menunggu konfirmasi asesor.');
  };

  // --- HANDLER SURAT (TRIGGER ADMINISTRASI) ---
  const handleOpenForm = (item, jenis) => {
    if (!item.asesor1 || !item.tuk || !item.waktu) {
      alert('Plotting Asesor, TUK, dan Waktu harus lengkap untuk menerbitkan Surat!');
      return;
    }
    setSelectedUjk(item); setFormType(jenis);
    setFormData({ noSurat: `000.140${jenis === 'tugas' ? 'D' : 'A'}/LSP BLK-SBY/III/2026`, tanggalSurat: '11 Maret 2026' });
    setIsFormOpen(true);
  };

  const handleGenerateSurat = (e) => {
    e.preventDefault(); setIsFormOpen(false);
    setPreviewDokumen({ dataUjk: selectedUjk, jenis: formType, formData: { ...formData, tempat: selectedUjk.tuk, waktu: selectedUjk.waktu, kepadaTujuan: `Kepala UPT BLK Surabaya` } });
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
      
      {previewDokumen ? (
        /* --- LAYAR PRATINJAU --- */
        <div className="print-preview-container">
          <div className="no-print print-header">
            <div><h3>Pratinjau Dokumen</h3></div>
            <div style={{ display: 'flex', gap: '10px' }}><button className="btn-cancel-sm" onClick={() => setPreviewDokumen(null)}>Kembali</button><button className="btn-save-sm" onClick={handleTandaiSelesai}>Cetak Dokumen</button></div>
          </div>
          <div id="print-area">
             {previewDokumen.jenis === 'tugas' && <SuratTugas data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
             {previewDokumen.jenis === 'permohonan' && <SuratPermohonan data={{ ujk: previewDokumen.dataUjk, form: previewDokumen.formData }} />}
             {previewDokumen.jenis === 'administrasi' && <TemplateAdministrasi data={{ ujk: previewDokumen.dataUjk, docName: previewDokumen.docData?.name, docCode: previewDokumen.docData?.code }} />}
          </div>
        </div>
      ) : viewAdminUjk ? (
        /* --- LAYAR MENU 12 ADMINISTRASI --- */
        <div className="fade-in-content" style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <button className="btn-cancel-sm" onClick={() => setViewAdminUjk(null)}>Kembali</button>
            <h2>Dokumen Administrasi - {viewAdminUjk?.skema}</h2>
          </div>
          <div className="admin-docs-grid">
            {dokumenAdministrasiList.map((doc, index) => {
              const isPrinted = viewAdminUjk?.statusSurat?.administrasi?.includes(doc.code);
              return (
                <div key={index} className={`admin-doc-card ${isPrinted ? 'is-done' : ''}`}>
                  <h3 className="admin-doc-title">{doc.code} - {doc.name}</h3>
                  <button className={`btn-save-sm`} style={{ width: '100%', marginTop: '10px' }} onClick={() => setPreviewDokumen({ dataUjk: viewAdminUjk, jenis: 'administrasi', docData: doc })}>{isPrinted ? 'Cetak Ulang' : 'Generate'}</button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* --- LAYAR UTAMA (HALAMAN PENUGASAN & PLOTTING) --- */
        <>
          <div className="dashboard-header" style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px' }}>Halaman Penugasan & Plotting</h2>
            <p className="text-muted">Validasi file pengajuan (Excel), tetapkan TUK/Jadwal, dan filter asesor berdasarkan pemerataan beban kerja (Load Balancing).</p>
          </div>
          
          <div className="sm-card">
            
            {/* WRAPPER KUNCI 1 BARIS: overflow-x: auto */}
            <div className="table-responsive-wrapper">
              <div className="my-grid-table">
                
                {/* HEADER 1 BARIS */}
                <div className="my-grid-header">
                  <div className="col-no">NO</div>
                  <div className="col-info">INFORMASI PENGAJUAN</div>
                  <div className="col-deploy">STATUS DEPLOYMENT</div>
                  <div className="col-action">AKSI</div>
                  <div className="col-doc">STATUS DOKUMEN</div>
                </div>

                {/* ROW DATA */}
                {antreanSurat.map((item, index) => {
                  const isEditing = editingId === item.idUjk;
                  const isPlotted = item.asesor1 && item.penyelia && item.tuk && item.waktu;
                  const excelValid = item.excelRows <= item.asesi;

                  return (
                    <div className={`my-grid-row ${isEditing ? 'editing' : ''}`} key={item.idUjk}>
                      
                      {/* 1. NO */}
                      <div className="col-no"><div className="circle-number">{index + 1}</div></div>

                      {/* 2. INFORMASI PENGAJUAN (DENGAN VALIDASI EXCEL) */}
                      <div className="col-info">
                        <div className="sm-instansi"><strong>{item.pengusul}</strong><span className="sm-badge-blue">{item.pendanaan}</span></div>
                        <div className="sm-skema-title">{item.skema}</div>
                        <div className="sm-skema-meta">Bidang: {item.bidang} • Kuota: {item.asesi} Asesi</div>
                        
                        {/* Box Verifikasi File Excel & Kurikulum */}
                        <div className="file-verify-box">
                          <div className="file-item"><i className="fas fa-file-excel" style={{color:'#10b981'}}></i> {item.excelFile}</div>
                          <div className={`validation-badge ${excelValid ? 'valid' : 'invalid'}`}>
                             {excelValid ? <><i className="fas fa-check-circle"></i> Excel Valid ({item.excelRows} Baris)</> : <><i className="fas fa-exclamation-triangle"></i> Over Kuota ({item.excelRows} Baris)</>}
                          </div>
                          <div className="file-item" style={{marginTop:'5px'}}><i className="fas fa-file-pdf" style={{color:'#ef4444'}}></i> {item.kurikulumFile}</div>
                        </div>
                      </div>

                      {/* 3. STATUS DEPLOYMENT (TUK, WAKTU, ASESOR, PENYELIA) */}
                      <div className="col-deploy">
                        {isEditing ? (
                          <div className="edit-deploy-box">
                            <label className="edit-label">Form Penempatan (Mapping) Jadwal</label>
                            <input type="text" className="edit-input" name="tuk" value={editData.tuk} onChange={handleEditChange} placeholder="Tempat Uji Kompetensi (TUK)" />
                            <input type="text" className="edit-input" name="waktu" value={editData.waktu} onChange={handleEditChange} placeholder="Waktu (Ex: 08.00 WIB)" />
                            
                            <label className="edit-label" style={{marginTop:'10px'}}>Mapping Tim Asesor</label>
                            <button className="btn-select-modal" onClick={() => handleOpenAsesorModal(item.idUjk, 'asesor1', editData.bidang, editData.skema)}>
                              {editData.asesor1 || 'Pilih Asesor 1...'}
                            </button>
                            <button className="btn-select-modal" onClick={() => handleOpenAsesorModal(item.idUjk, 'asesor2', editData.bidang, editData.skema)}>
                              {editData.asesor2 || 'Pilih Asesor 2 (Opsional)...'}
                            </button>
                            <select className="edit-input" name="penyelia" value={editData.penyelia} onChange={handleEditChange}>
                              <option value="">-- Pilih Penyelia --</option>
                              {daftarPenyelia.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        ) : (
                          <div className="deploy-info">
                            <div className="deploy-item"><i className="fas fa-map-marker-alt"></i> <strong>TUK:</strong> {item.tuk || <span style={{color:'red'}}>Belum Ditentukan</span>}</div>
                            <div className="deploy-item"><i className="far fa-clock"></i> <strong>Waktu:</strong> {item.waktu || <span style={{color:'red'}}>Belum Sinkron</span>}</div>
                            <hr style={{ border:'0.5px dashed #cbd5e1', margin: '8px 0'}} />
                            <div className="deploy-item"><i className="fas fa-user-tie"></i> <strong>As1:</strong> {item.asesor1 || <span style={{color:'red'}}>Kosong</span>}</div>
                            {item.asesor2 && <div className="deploy-item"><i className="fas fa-user-tie"></i> <strong>As2:</strong> {item.asesor2}</div>}
                            <div className="deploy-item"><i className="fas fa-user-shield"></i> <strong>Pen:</strong> {item.penyelia || <span style={{color:'red'}}>Kosong</span>}</div>
                          </div>
                        )}
                      </div>

                      {/* 4. AKSI (TERPISAH SEBELAH STATUS DOKUMEN) */}
                      <div className="col-action">
                        {isEditing ? (
                          <>
                            <button className="btn-save-sm w-full" onClick={handleSaveInfo}><i className="fas fa-check"></i> Simpan</button>
                            <button className="btn-cancel-sm w-full mt-5" onClick={handleCancelEdit}><i className="fas fa-times"></i> Batal</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-edit-outline w-full" onClick={() => handleEditInfo(item)}><i className="fas fa-edit"></i> Edit</button>
                            <button className="btn-tolak-outline w-full mt-5" onClick={() => alert('Ditolak!')}><i className="fas fa-ban"></i> Tolak</button>
                          </>
                        )}
                      </div>

                      {/* 5. STATUS DOKUMEN */}
                      <div className="col-doc">
                        <button className={`status-pill ${item.statusSurat?.permohonan ? 'done' : 'pending'}`} onClick={() => handleOpenForm(item, 'permohonan')}>
                          <i className={`fas ${item.statusSurat?.permohonan ? 'fa-check-circle' : 'fa-times-circle'}`}></i> SPT Asesor
                        </button>
                        <button className={`status-pill ${item.statusSurat?.tugas ? 'done' : 'pending'}`} onClick={() => handleOpenForm(item, 'tugas')}>
                          <i className={`fas ${item.statusSurat?.tugas ? 'fa-check-circle' : 'fa-times-circle'}`}></i> Surat Balasan
                        </button>
                        <button className={`status-pill ${item.statusSurat?.administrasi?.length === 12 ? 'done' : 'pending'}`} onClick={() => { if(isPlotted) setViewAdminUjk(item); else alert('Lengkapi Deployment (Edit) terlebih dahulu!') }}>
                          <i className={`fas ${item.statusSurat?.administrasi?.length === 12 ? 'fa-check-circle' : 'fa-times-circle'}`}></i> Administrasi
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- MODAL PENCARIAN ASESOR (DENGAN LOAD BALANCING) --- */}
      {isAsesorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}><i className="fas fa-filter"></i> Filter Cerdas Pemilihan Asesor</h3>
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
                <button className="btn-cancel-sm" style={{alignSelf:'flex-end', height:'35px'}} onClick={() => handlePilihAsesor({nama:'', noReg:''})}>Kosongkan</button>
              </div>

              <div className="asesor-list-info">
                Ditemukan <strong>{filteredAsesors.length}</strong> Asesor. Diurutkan berdasarkan Beban Kerja (Load Balancing) terendah dalam 1 tahun terakhir.
              </div>

              <div className="asesor-grid">
                {filteredAsesors.map((asesor) => (
                  <div key={asesor.id} className={`asesor-card ${asesor.load1Tahun === 0 ? 'prioritas' : ''}`}>
                    {asesor.load1Tahun === 0 && <div className="badge-prioritas">PRIORITAS (LOAD RENDAH)</div>}
                    <div className="ac-header">
                      <div className="ac-title">
                        <h4>{asesor.nama}</h4>
                        <p>{asesor.noReg}</p>
                      </div>
                      <span className={`status-badge ${asesor.status === 'Available' ? 'hijau' : 'merah'}`}>{asesor.status}</span>
                    </div>
                    <div className="ac-body">
                       <p style={{fontSize:'0.8rem', margin:0}}><strong>Bidang:</strong> {asesor.bidang}</p>
                       <div style={{fontSize:'0.75rem', marginTop:'5px', color:'#64748b'}}>{asesor.skema.join(', ')}</div>
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

      {/* MODAL FORM SURAT TRIGGER ADMINISTRASI */}
      {isFormOpen && (
         <div className="modal-overlay">
           <div className="modal-content" style={{ width: '400px' }}>
             <div className="modal-header"><h3>Trigger Administrasi</h3><button className="modal-close" onClick={() => setIsFormOpen(false)}>&times;</button></div>
             <div className="modal-body">
                <form onSubmit={handleGenerateSurat}>
                  <div className="form-group" style={{ marginBottom: '15px' }}><label>Nomor Surat Resmi</label><input type="text" className="edit-input" name="noSurat" value={formData.noSurat || ''} onChange={handleInputChange} required /></div>
                  <div className="form-group" style={{ marginBottom: '20px' }}><label>Tanggal Penetapan</label><input type="text" className="edit-input" name="tanggalSurat" value={formData.tanggalSurat || ''} onChange={handleInputChange} required /></div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="btn-cancel-sm w-full" onClick={() => setIsFormOpen(false)}>Batal</button>
                    <button type="submit" className="btn-save-sm w-full">Generate SPT</button>
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