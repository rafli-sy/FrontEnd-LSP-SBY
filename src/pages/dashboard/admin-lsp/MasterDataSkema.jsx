import { useState } from 'react';

const MasterDataSkema = () => {
  // 1. STATE: Data List (Read)
  const [skemaList, setSkemaList] = useState([
    { id: 1, nama: 'Pembuatan Batik Tulis', bidang: 'Batik', kode: '013' },
    { id: 2, nama: 'Membatik Dengan Canting', bidang: 'Batik', kode: '013' },
    { id: 3, nama: 'Junior Administrative Assistant', bidang: 'Bisman', kode: '005' },
    { id: 4, nama: 'Teknisi Akuntansi Junior', bidang: 'Bisman', kode: '005' },
    { id: 5, nama: 'Teknisi Telepon Seluler Perangkat Keras', bidang: 'TIK', kode: '009' },
    { id: 6, nama: 'Operator Pengoperasian Otomasi Elektronika Industri', bidang: 'Elektronika', kode: '015' }
  ]);

  // 2. STATE: Form & Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama: '', bidang: '', kode: '' });

  // 3. FUNGSI: Menangani input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. FUNGSI: Buka modal untuk Tambah Data (Create)
  const handleAddClick = () => {
    setFormData({ id: null, nama: '', bidang: '', kode: '' }); // Kosongkan form
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 5. FUNGSI: Buka modal untuk Edit Data (Update)
  const handleEditClick = (item) => {
    setFormData(item); // Isi form dengan data yang dipilih
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // 6. FUNGSI: Menghapus Data (Delete)
  const handleDeleteClick = (id) => {
    const isConfirm = window.confirm('Apakah Anda yakin ingin menghapus skema ini?');
    if (isConfirm) {
      setSkemaList(skemaList.filter(item => item.id !== id));
    }
  };

  // 7. FUNGSI: Simpan Data (Submit Form)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Logika Update Data
      setSkemaList(skemaList.map(item => item.id === formData.id ? formData : item));
    } else {
      // Logika Tambah Data Baru
      // Buat ID baru berdasarkan ID terbesar yang ada
      const newId = skemaList.length > 0 ? Math.max(...skemaList.map(i => i.id)) + 1 : 1;
      setSkemaList([...skemaList, { ...formData, id: newId }]);
    }
    
    setIsModalOpen(false); // Tutup modal setelah simpan
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Data Skema Sertifikasi</h2>
          <p>Daftar skema UJK yang tersedia beserta kode bidangnya.</p>
        </div>
        <button className="btn-add" onClick={handleAddClick}>+ Tambah Skema</button>
      </div>

      <div className="dashboard-card mt-20">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Skema</th>
                <th>Bidang</th>
                <th>Kode Bidang</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {skemaList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td><strong>{item.nama}</strong></td>
                  <td>{item.bidang}</td>
                  <td>{item.kode}</td>
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
              {skemaList.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">Belum ada data skema.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM (Tampil jika isModalOpen bernilai true) */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isEditing ? 'Edit Data Skema' : 'Tambah Data Skema'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Skema</label>
                <input 
                  type="text" 
                  name="nama"
                  className="form-input" 
                  value={formData.nama} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Contoh: Pemasangan CCTV"
                />
              </div>
              <div className="form-group">
                <label>Bidang</label>
                <input 
                  type="text" 
                  name="bidang"
                  className="form-input" 
                  value={formData.bidang} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Contoh: Elektronika"
                />
              </div>
              <div className="form-group">
                <label>Kode Bidang</label>
                <input 
                  type="text" 
                  name="kode"
                  className="form-input" 
                  value={formData.kode} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Contoh: 015"
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

// --- STYLING KHUSUS UNTUK MODAL POP-UP ---
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
  width: '400px',
  maxWidth: '90%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
};

export default MasterDataSkema;