import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import AlertPopup from '../../../components/ui/AlertPopup';
import Modal from '../../../components/ui/Modal'; 
import Pagination from '../../../components/ui/Pagination';

const MasterDataAsesor = () => {
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- FITUR BARU: Filter Status (Default: Aktif) ---
  const [filterStatus, setFilterStatus] = useState('Aktif');

  // --- FITUR BARU: Mapping Skema ke Bidang (Otomatisasi) ---
  const schemaToField = {
    'Junior Web Developer': 'TIK',
    'Network Administrator': 'TIK',
    'Desain Grafis': 'TIK',
    'Barista': 'Pariwisata',
    'Pembuatan Roti Dan Kue': 'Pariwisata',
    'Menjahit Pakaian': 'Garmen',
    'Refrigerasi Domestik': 'Refrigerasi'
  };
  
  // UPDATE DUMMY DATA: Bidang menjadi Array, ditambahkan Skema (Array), dan Profesi
  const [asesorList, setAsesorList] = useState([
    { id: 1, nama: 'Endang Lestari', noReg: 'MET.011411 2019', alamat: 'Jl. Ahmad Yani No.1', hp: '081234567890', skema: ['Menjahit Pakaian'], bidang: ['Garmen'], profesi: 'Instruktur', institusi: 'BLK Surabaya', status: 'Aktif' },
    { id: 2, nama: 'Ahmad Fauzi', noReg: 'MET.123456 2020', alamat: 'Jl. Merdeka No.45', hp: '082199887766', skema: ['Barista', 'Pembuatan Roti Dan Kue'], bidang: ['Pariwisata'], profesi: 'Praktisi', institusi: 'Universitas Brawijaya', status: 'Aktif' },
    { id: 3, nama: 'Kartika Nova Wahyuni', noReg: 'MET.005313 2018', alamat: 'Jl. Pemuda No. 10', hp: '081234567111', skema: ['Pembuatan Roti Dan Kue'], bidang: ['Pariwisata'], profesi: 'Guru Kejuruan', institusi: 'BLK Madiun', status: 'Aktif' },
    { id: 4, nama: 'Risna Amalia', noReg: 'MET.003697 2013', alamat: 'Jl. Sudirman No. 99', hp: '081234567222', skema: ['Junior Web Developer'], bidang: ['TIK'], profesi: 'Dosen', institusi: 'BLK Singosari', status: 'Aktif' },
    { id: 5, nama: 'Budi Santoso', noReg: 'MET.999888 2021', alamat: 'Jl. Diponegoro No. 8', hp: '081234567333', skema: ['Barista'], bidang: ['Pariwisata'], profesi: 'Instruktur', institusi: 'BLK Jember', status: 'Aktif' },
    { id: 6, nama: 'Hari Emijuniati', noReg: 'MET.000123 2015', alamat: 'Jl. Pahlawan No. 4', hp: '081234567444', skema: ['Barista'], bidang: ['Pariwisata'], profesi: 'Praktisi', institusi: 'LKP Mutiara', status: 'Aktif' },
    { id: 7, nama: 'Johan Wahyudi', noReg: 'MET.000456 2016', alamat: 'Jl. Veteran No. 2', hp: '081234567555', skema: ['Barista'], bidang: ['Pariwisata'], profesi: 'Instruktur', institusi: 'BLK Wonojati', status: 'Aktif' },
    { id: 8, nama: 'Onie Meiyanto', noReg: 'MET.000789 2017', alamat: 'Jl. Gajah Mada No. 7', hp: '081234567666', skema: ['Refrigerasi Domestik'], bidang: ['Refrigerasi'], profesi: 'Instruktur', institusi: 'BLK Kediri', status: 'Non-Aktif' }
  ]);

  const [formData, setFormData] = useState({
    id: null, nama: '', noReg: '', alamat: '', hp: '', skema: [], bidang: [], profesi: '', institusi: '', status: 'Aktif'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const closeAlert = () => {
    setAlert(null);
    if (alertTimer.current) clearTimeout(alertTimer.current);
  };

  const showSuccess = (title, text) => {
    setAlert({ type: 'success', title, text, onCancel: closeAlert });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => closeAlert(), 2500);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FITUR BARU: Handle Penambahan Skema & Auto-Bidang ---
  const handleAddSkema = (e) => {
    const selectedSkema = e.target.value;
    if (selectedSkema && !formData.skema.includes(selectedSkema)) {
      const associatedBidang = schemaToField[selectedSkema];
      setFormData({
        ...formData,
        skema: [...formData.skema, selectedSkema],
        bidang: formData.bidang.includes(associatedBidang) ? formData.bidang : [...formData.bidang, associatedBidang]
      });
    }
  };

  const removeSkema = (skm) => {
    setFormData({ ...formData, skema: formData.skema.filter(s => s !== skm) });
  };

  const handleTambah = () => {
    setFormData({ id: null, nama: '', noReg: '', alamat: '', hp: '', skema: [], bidang: [], profesi: '', institusi: '', status: 'Aktif' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.skema.length === 0) {
      setAlert({ type: 'warning', title: 'Data Kurang', text: 'Pilih minimal 1 Skema untuk asesor ini.', onCancel: closeAlert });
      return;
    }

    setAlert({
      type: 'save', title: 'Simpan Asesor Baru?', text: 'Pastikan seluruh informasi Asesor sudah valid.',
      onConfirm: () => {
        const newId = asesorList.length > 0 ? Math.max(...asesorList.map(a => a.id)) + 1 : 1;
        setAsesorList([...asesorList, { ...formData, id: newId }]);
        setIsModalOpen(false);
        showSuccess('Tersimpan!', 'Asesor baru berhasil ditambahkan.');
      },
      onCancel: closeAlert
    });
  };

  // TETAP ADA: Fitur Toggle Klik Status di Tabel
  const handleToggleStatus = (asesor) => {
    const aksiText = asesor.status === 'Aktif' ? 'menon-aktifkan' : 'mengaktifkan';
    setAlert({
      type: 'confirm',
      title: 'Konfirmasi Status',
      text: `Apakah Anda yakin untuk ${aksiText} asesor ${asesor.nama} berikut?`,
      onConfirm: () => {
        setAsesorList(asesorList.map(item => item.id === asesor.id ? { ...item, status: asesor.status === 'Aktif' ? 'Non-Aktif' : 'Aktif' } : item));
        showSuccess('Berhasil!', `Status asesor ${asesor.nama} telah diperbarui.`);
      },
      onCancel: closeAlert
    });
  };

  // --- LOGIKA FILTER: Menggabungkan Search + Filter Aktif/Non-Aktif ---
  const filteredAsesor = asesorList.filter(a => {
    const matchSearch = a.nama.toLowerCase().includes(searchQuery.toLowerCase()) || a.noReg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' ? true : a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredAsesor.length / itemsPerPage);
  const paginatedAsesor = filteredAsesor.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-content fade-in-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Master Data Asesor</h2>
          <p className="text-muted" style={{ margin: 0 }}>Manajemen data detail Asesor tersertifikasi.</p>
        </div>
        
        {/* --- FITUR BARU: Tambahan Filter Dropdown di Header --- */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            className="form-input" 
            value={filterStatus} 
            onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}} 
            style={{ width: 'auto', padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="Aktif">Lihat Aktif Saja</option>
            <option value="Non-Aktif">Lihat Non-Aktif</option>
            <option value="Semua">Semua Status</option>
          </select>
          <Button variant="primary" icon="plus" onClick={handleTambah}>Tambah Asesor</Button>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <input type="text" className="form-input" placeholder="Cari Nama / No Registrasi..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} style={{ width: '300px' }} />
        </div>

        <div className="table-responsive" style={{ padding: '20px' }}>
          <table className="admin-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th>Profil & Institusi</th>
                <th>Kontak & Alamat</th>
                <th style={{ textAlign: 'center' }}>No Registrasi (MET)</th>
                <th>Bidang & Skema Uji</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAsesor.map((asesor, index) => (
                <tr key={asesor.id}>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <strong style={{ color: '#0f172a', display: 'block', fontSize: '1rem' }}>{asesor.nama}</strong>
                    <small className="text-muted"><i className="fas fa-building"></i> {asesor.institusi}</small><br/>
                    {/* Tampil Profesi */}
                    <small style={{ color: '#3b82f6', fontWeight: '600' }}><i className="fas fa-user-tie"></i> {asesor.profesi}</small>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '4px' }}><i className="fas fa-phone-alt"></i> {asesor.hp}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}><i className="fas fa-map-marker-alt"></i> {asesor.alamat}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}><span className="badge info">{asesor.noReg}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                      {asesor.bidang.map(b => <span key={b} className="badge primary" style={{fontSize: '0.7rem', padding: '2px 6px'}}>{b}</span>)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {asesor.skema.map(s => <span key={s} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>{s}</span>)}
                    </div>
                  </td>
                  
                  {/* STATUS BADGE BISA DIKLIK (Fitur asli dipertahankan) */}
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleToggleStatus(asesor)}
                      className={`badge ${asesor.status === 'Aktif' ? 'success' : 'danger'}`}
                      style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.2s', padding: '6px 12px' }}
                      title={`Klik untuk ${asesor.status === 'Aktif' ? 'Non-Aktifkan' : 'Aktifkan'}`}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {asesor.status} <i className="fas fa-exchange-alt" style={{fontSize: '0.7rem', opacity: 0.7}}></i>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedAsesor.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada data Asesor untuk status {filterStatus}.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={filteredAsesor.length} itemsPerPage={itemsPerPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Asesor">
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Lengkap</label>
            <input type="text" name="nama" className="form-input" value={formData.nama} onChange={handleInputChange} required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>No. Registrasi (MET)</label>
              <input type="text" name="noReg" className="form-input" placeholder="MET.XXXXX" value={formData.noReg} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Asal Institusi</label>
              <input type="text" name="institusi" className="form-input" placeholder="Contoh: BLK Surabaya" value={formData.institusi} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            {/* UPDATE: Input Bidang diubah menjadi Profesi (Karena bidang terisi otomatis) */}
            <div className="form-group">
              <label>Data Profesi (Untuk Sertifikat)</label>
              <input type="text" name="profesi" className="form-input" placeholder="Contoh: Instruktur" value={formData.profesi} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Nomor Handphone</label>
              <input type="text" name="hp" className="form-input" placeholder="08XXXXXXXXXX" value={formData.hp} onChange={handleInputChange} required />
            </div>
          </div>

          {/* --- FITUR BARU: Pemilihan Skema (Bisa multi-select seperti tag) --- */}
          <div className="form-group" style={{ marginBottom: '15px', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pilih Skema Uji</span>
            </label>
            <select className="form-input" onChange={handleAddSkema} value="">
              <option value="" disabled>-- Klik untuk menambah skema --</option>
              {Object.keys(schemaToField).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            
            {/* Area Daftar Skema Terpilih */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              {formData.skema.map(s => (
                <span key={s} style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {s} 
                  <i className="fas fa-times" style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => removeSkema(s)}></i>
                </span>
              ))}
            </div>

            {/* Menampilkan Bidang Otomatis (Read-Only) */}
            {formData.bidang.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#475569' }}>
                <strong>Bidang Terdeteksi: </strong>
                {formData.bidang.map(b => <span key={b} className="badge primary" style={{marginLeft: '4px'}}>{b}</span>)}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Alamat Lengkap</label>
            <textarea name="alamat" className="form-input" rows="2" value={formData.alamat} onChange={handleInputChange} required style={{resize: 'vertical'}}></textarea>
          </div>
          
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Status Asesor</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" type="button" isFullWidth onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" isFullWidth icon="save">Simpan Data</Button>
          </div>
        </form>
      </Modal>

      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default MasterDataAsesor;