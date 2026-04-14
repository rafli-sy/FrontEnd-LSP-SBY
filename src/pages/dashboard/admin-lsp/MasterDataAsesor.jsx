import { useState } from 'react';

const MasterDataAsesor = () => {
  // 1. STATE: Data List (Read)
  // Format tanggal diubah ke 'yyyy-mm-dd' agar kompatibel dengan <input type="date">
  const [asesorList, setAsesorList] = useState([
    { id: 1, nama: 'Haruto', noReg: 'MET.000.007716.2024', kejuruan: 'Listrik', asal: 'Sampang', exp: '2027-11-01' },
    { id: 2, nama: 'Jay Park', noReg: 'MET.000.008457.2021', kejuruan: 'Listrik', asal: 'Sampang', exp: '2027-04-26' },
    { id: 3, nama: 'Nyoman Ayu Carmenita', noReg: 'MET.000.004596.2023', kejuruan: 'TIK', asal: 'Bojonegoro', exp: '2026-06-19' },
    { id: 4, nama: 'Dita Karang', noReg: 'MET.000.004831.2019', kejuruan: 'TIK', asal: 'Bojonegoro', exp: '2025-12-12' },
    { id: 5, nama: 'Naomi Rei', noReg: 'MET.000.004599.2023', kejuruan: 'Las', asal: 'Kota Surabaya', exp: '2026-06-19' },
  ]);

  // 2. STATE: Form & Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama: '', noReg: '', kejuruan: '', asal: '', exp: '' });

  // 3. FUNGSI: Menangani input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. FUNGSI: Buka modal untuk Tambah Data
  const handleAddClick = () => {
    setFormData({ id: null, nama: '', noReg: '', kejuruan: '', asal: '', exp: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 5. FUNGSI: Buka modal untuk Edit Data
  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // 6. FUNGSI: Menghapus Data
  const handleDeleteClick = (id) => {
    const isConfirm = window.confirm('Apakah Anda yakin ingin menghapus data asesor ini?');
    if (isConfirm) {
      setAsesorList(asesorList.filter(item => item.id !== id));
    }
  };

  // 7. FUNGSI: Simpan Data (Submit Form)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setAsesorList(asesorList.map(item => item.id === formData.id ? formData : item));
    } else {
      const newId = asesorList.length > 0 ? Math.max(...asesorList.map(i => i.id)) + 1 : 1;
      setAsesorList([...asesorList, { ...formData, id: newId }]);
    }
    setIsModalOpen(false);
  };

  // Fungsi Pembantu: Mengubah 'yyyy-mm-dd' menjadi 'dd/mm/yyyy' untuk tampilan di Tabel
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // 8. FUNGSI: Status Badge Otomatis Berdasarkan Waktu Nyata
  const getStatusBadge = (expDate) => {
    if (!expDate) return <span className="status-badge" style={{ backgroundColor: '#ccc' }}>-</span>;

    // Karena expDate sekarang formatnya yyyy-mm-dd, kita bisa langsung memasukkannya ke Date()
    const expirationDate = new Date(expDate);
    expirationDate.setHours(0, 0, 0, 0);
    
    // Ambil tanggal hari ini (waktu diset ke 00:00 agar akurat membandingkan hari)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hitung batas waktu "Akan Habis" (misal: 6 bulan dari hari ini)
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    sixMonthsFromNow.setHours(0, 0, 0, 0);

    // Logika Penentuan Status
    if (expirationDate < today) {
      return <span className="status-badge ditolak">Expired</span>;
    } else if (expirationDate <= sixMonthsFromNow) {
      return <span className="status-badge menunggu">Akan Habis</span>;
    } else {
      return <span className="status-badge disetujui">Aktif</span>;
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Master Data Asesor</h2>
          <p>Daftar asesor induk beserta masa berlaku sertifikat kompetensinya.</p>
        </div>
        <button className="btn-add" onClick={handleAddClick}>+ Tambah Asesor</button>
      </div>

      <div className="dashboard-card mt-20">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Asesor</th>
                <th>No Registrasi</th>
                <th>Kejuruan</th>
                <th>Kota Asal</th>
                <th>Exp Sertifikat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {asesorList.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.nama}</strong></td>
                  <td>{item.noReg}</td>
                  <td>{item.kejuruan}</td>
                  <td>{item.asal}</td>
                  {/* Gunakan formatDateDisplay agar di tabel tetap terlihat format dd/mm/yyyy */}
                  <td>{formatDateDisplay(item.exp)}</td>
                  <td>{getStatusBadge(item.exp)}</td>
                  <td>
                    <button 
                      className="btn-action" 
                      style={{ marginRight: '5px' }}
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {asesorList.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">Belum ada data asesor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isEditing ? 'Edit Data Asesor' : 'Tambah Data Asesor'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Asesor</label>
                <input 
                  type="text" name="nama" className="form-input" 
                  value={formData.nama} onChange={handleInputChange} 
                  required placeholder="Nama lengkap asesor"
                />
              </div>
              <div className="form-group">
                <label>No Registrasi</label>
                <input 
                  type="text" name="noReg" className="form-input" 
                  value={formData.noReg} onChange={handleInputChange} 
                  required placeholder="Contoh: MET.000.xxxxxx.xxxx"
                />
              </div>
              
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Kejuruan</label>
                  <input 
                    type="text" name="kejuruan" className="form-input" 
                    value={formData.kejuruan} onChange={handleInputChange} 
                    required placeholder="Contoh: TIK"
                  />
                </div>
                <div className="form-group">
                  <label>Kota Asal</label>
                  <input 
                    type="text" name="asal" className="form-input" 
                    value={formData.asal} onChange={handleInputChange} 
                    required placeholder="Contoh: Surabaya"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tanggal Expired Sertifikat</label>
                {/* Diubah menjadi type="date" */}
                <input 
                  type="date" name="exp" className="form-input" 
                  value={formData.exp} onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-reject" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-add">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- STYLING MODAL POP-UP ---
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  width: '450px',
  maxWidth: '90%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default MasterDataAsesor;