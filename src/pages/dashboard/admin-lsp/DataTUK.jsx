import { useState } from 'react';

const DataTUK = () => {
  // 1. STATE: Data List (Read)
  const [tukList, setTukList] = useState([
    { id: 1, penyelia: 'Yung Kai', tuk: 'UPT BLK Surabaya', alamat: 'Jl. Dukuh Menanggal III/29', kota: 'Surabaya' },
    { id: 2, penyelia: 'Hanni Soren', tuk: 'UPT BLK Mojokerto', alamat: 'Jl. Raya Jabon', kota: 'Mojokerto' },
    { id: 3, penyelia: 'Raditya Dika', tuk: 'UPT BLK Jombang', alamat: 'Jl. Anggrek No. 04', kota: 'Jombang' },
    { id: 4, penyelia: 'Nadia Omara', tuk: 'UPT BLK Nganjuk', alamat: 'Jl. Kapten Kasihin HS. No 3', kota: 'Nganjuk' },
    { id: 5, penyelia: 'No Na Christy', tuk: 'UPT BLK Bangkalan', alamat: 'Jl. Halim Perdana Kusuma No.2', kota: 'Bangkalan' },
  ]);

  // 2. STATE: Form & Modal Controls
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, penyelia: '', tuk: '', alamat: '', kota: '' });
  const [selectedTUK, setSelectedTUK] = useState(null); // Menyimpan data spesifik untuk pop-up detail

  // 3. FUNGSI: Menangani input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. FUNGSI: Buka modal untuk Tambah Data
  const handleAddClick = () => {
    setFormData({ id: null, penyelia: '', tuk: '', alamat: '', kota: '' });
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  // 5. FUNGSI: Buka modal untuk Edit Data
  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  // 6. FUNGSI: Buka modal untuk Detail Data
  const handleDetailClick = (item) => {
    setSelectedTUK(item);
    setIsDetailModalOpen(true);
  };

  // 7. FUNGSI: Menghapus Data
  const handleDeleteClick = (id) => {
    const isConfirm = window.confirm('Apakah Anda yakin ingin menghapus data TUK ini?');
    if (isConfirm) {
      setTukList(tukList.filter(item => item.id !== id));
    }
  };

  // 8. FUNGSI: Simpan Data (Submit Form)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setTukList(tukList.map(item => item.id === formData.id ? formData : item));
    } else {
      const newId = tukList.length > 0 ? Math.max(...tukList.map(i => i.id)) + 1 : 1;
      setTukList([...tukList, { ...formData, id: newId }]);
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Data Penyelia & TUK</h2>
          <p>Daftar Penyelia beserta Tempat Uji Kompetensi (TUK) yang terdaftar.</p>
        </div>
        <button className="btn-add" onClick={handleAddClick}>+ Tambah TUK</button>
      </div>

      <div className="dashboard-card mt-20">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Penyelia</th>
                <th>Nama TUK</th>
                <th>Alamat Lengkap</th>
                <th>Kota / Kabupaten</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tukList.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.penyelia}</strong></td>
                  <td>{item.tuk}</td>
                  <td>{item.alamat}</td>
                  <td>{item.kota}</td>
                  <td>
                    {/* Tombol Detail */}
                    <button 
                      className="btn-action" 
                      style={{ marginRight: '5px', backgroundColor: '#17a2b8' }} 
                      onClick={() => handleDetailClick(item)}
                    >
                      Detail
                    </button>
                    {/* Tombol Edit */}
                    <button 
                      className="btn-action" 
                      style={{ marginRight: '5px' }} 
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    {/* Tombol Hapus */}
                    <button 
                      className="btn-reject" 
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {tukList.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">Belum ada data TUK terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM (TAMBAH/EDIT) --- */}
      {isFormModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isEditing ? 'Edit Data TUK' : 'Tambah Data TUK'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Penyelia</label>
                <input 
                  type="text" name="penyelia" className="form-input" 
                  value={formData.penyelia} onChange={handleInputChange} 
                  required placeholder="Nama lengkap penyelia"
                />
              </div>
              <div className="form-group">
                <label>Nama Tempat Uji Kompetensi (TUK)</label>
                <input 
                  type="text" name="tuk" className="form-input" 
                  value={formData.tuk} onChange={handleInputChange} 
                  required placeholder="Contoh: UPT BLK Surabaya"
                />
              </div>
              <div className="form-group">
                <label>Kota / Kabupaten</label>
                <input 
                  type="text" name="kota" className="form-input" 
                  value={formData.kota} onChange={handleInputChange} 
                  required placeholder="Contoh: Surabaya"
                />
              </div>
              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea 
                  name="alamat" className="form-input" 
                  value={formData.alamat} onChange={handleInputChange} 
                  required placeholder="Alamat detail TUK"
                  style={{ minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-reject" onClick={() => setIsFormModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-add">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL (VIEW ONLY) --- */}
      {isDetailModalOpen && selectedTUK && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Detail Informasi TUK
            </h3>
            
            <div style={{ marginBottom: '15px', lineHeight: '1.8' }}>
              <p><strong>Nama Penyelia:</strong> <br/>{selectedTUK.penyelia}</p>
              <p><strong>Instansi / TUK:</strong> <br/>{selectedTUK.tuk}</p>
              <p><strong>Kota / Kabupaten:</strong> <br/>{selectedTUK.kota}</p>
              <p><strong>Alamat Lengkap:</strong> <br/>{selectedTUK.alamat}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn-action" 
                onClick={() => setIsDetailModalOpen(false)}
              >
                Tutup
              </button>
            </div>
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

export default DataTUK;