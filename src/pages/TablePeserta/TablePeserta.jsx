import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './TablePeserta.css';

const TablePeserta = ({ dataPeserta, detail_id, skemaName, asesorList, isAdmin, isStaffAsesorActive = false, onSave }) => {
  const [peserta, setPeserta] = useState([]);
  const [alertConfig, setAlertConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Konfigurasi API
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('access_token');
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const config = useMemo(() => ({
    headers: { 'ngrok-skip-browser-warning': 'true', 'Authorization': `Bearer ${token}` }
  }), [token]);

  const showAsesorKeputusan = true;

  useEffect(() => {
    if (dataPeserta && dataPeserta.length > 0) {
      // Mapping dari database ke state lokal frontend
      const mapped = dataPeserta.map((p) => ({
        ...p,
        // Mapping field dari DB (p.namaPeserta) ke field yang dipakai di UI
        nama: p.namaPeserta,
        nik: p.nik,
        jk: p.jenisKelamin,
        tempatLahir: p.tempatLahir,
        tanggalLahir: p.tanggalLahir,
        alamat: p.alamat,
        rt: p.rt,
        rw: p.rw,
        kelurahan: p.kelurahan,
        kecamatan: p.kecamatan,
        hp: p.nomorTelepon,
        email: p.email,
        pendidikan: p.pendidikanTerakhir,
        asesor_id: p.asesor_id || '', 
        keputusan: p.keputusan_uji === 'kompeten' ? 'K' : 'BK'
      }));
      setPeserta(mapped);
    }
  }, [dataPeserta]);

  const handleUpdatePeserta = (index, field, value) => {
    if (field === 'asesor_id' && !isAdmin && !isStaffAsesorActive) return;
    if (field === 'keputusan' && !isAdmin) return;
    
    const newData = [...peserta];
    newData[index][field] = value;
    setPeserta(newData);
  };

  const handleSimpanData = async () => {
    setAlertConfig({
      type: 'save',
      title: 'Simpan Data Asesi?',
      text: 'Pembagian Asesor dan Hasil Keputusan Uji akan disimpan ke server.',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          // 1. Simpan Plotting Asesor
          const payloadPlotting = {
            plotting: peserta.map(p => ({
              peserta_id: p.id,
              asesor_id: p.asesor_id
            }))
          };
          await axios.post(`${baseUrl}/admin-lsp/simpan-plotting-peserta/${detail_id}`, payloadPlotting, config);

          // 2. Simpan Keputusan Uji
          const payloadKeputusan = {
            hasil_uji: peserta.map(p => ({
              peserta_id: p.id,
              keputusan_uji: p.keputusan === 'K' ? 'kompeten' : 'belum kompeten'
            }))
          };
          await axios.put(`${baseUrl}/admin-lsp/keputusan-uji/${detail_id}`, payloadKeputusan, config);

          setAlertConfig({
            type: 'success',
            title: 'Berhasil Disimpan!',
            text: 'Data berhasil diperbarui di server.',
            onConfirm: () => {
              setAlertConfig(null);
              if (onSave) onSave();
            }
          });
        } catch (error) {
          setAlertConfig({ type: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan sistem.' });
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleDownloadExcel = () => {
    let header = "No,Nama,NIK,Jenis Kelamin,Tempat Lahir,Tanggal Lahir,Alamat,RT,RW,Kelurahan,Kecamatan,No. HP,Email,Pendidikan,Asesor ID,Keputusan\n";
    let csvContent = header;
    peserta.forEach((p, index) => {
      let row = [index + 1, `"${p.nama}"`, `"${p.nik}"`, `"${p.jk}"`, `"${p.tempatLahir}"`, `"${p.tanggalLahir}"`, `"${p.alamat}"`, p.rt, p.rw, `"${p.kelurahan}"`, `"${p.kecamatan}"`, `"${p.hp}"`, `"${p.email}"`, `"${p.pendidikan}"`, p.asesor_id, p.keputusan];
      csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data_Peserta_${skemaName}.csv`;
    link.click();
  };

  return (
    <div className="table-peserta-wrapper">
      {alertConfig && <AlertPopup {...alertConfig} onCancel={() => setAlertConfig(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <Button variant="success" icon="file-excel" onClick={handleDownloadExcel}>Download Excel</Button>
      </div>

      <div className="table-responsive-excel">
        <table className="excel-table">
          <thead>
            <tr>
              <th>No.</th><th>Nama</th><th>NIK</th><th>L/P</th>
              <th>Alamat</th><th>Kontak</th><th>Pendidikan</th>
              {showAsesorKeputusan && <th>Asesor Penguji</th>}
              {showAsesorKeputusan && <th>Keputusan Uji</th>}
            </tr>
          </thead>
          <tbody>
            {peserta.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td><strong>{item.nama}</strong></td>
                <td>{item.nik}</td>
                <td>{item.jk}</td>
                <td style={{ fontSize: '0.85rem' }}>{item.alamat} RT {item.rt}/RW {item.rw}, {item.kelurahan}, {item.kecamatan}</td>
                <td style={{ fontSize: '0.85rem' }}>{item.hp} <br/> {item.email}</td>
                <td>{item.pendidikan}</td>
                
                {showAsesorKeputusan && (
                  <td>
                    <select disabled={!isAdmin} value={item.asesor_id || ''} onChange={(e) => handleUpdatePeserta(index, 'asesor_id', e.target.value)} className="form-select">
                      <option value="">Pilih Asesor...</option>
                      {asesorList.map(a => <option key={a.id} value={a.id}>{a.user?.namaLengkap || a.nama}</option>)}
                    </select>
                  </td>
                )}
                {showAsesorKeputusan && (
                  <td>
                    <select disabled={!isAdmin} value={item.keputusan || 'BK'} onChange={(e) => handleUpdatePeserta(index, 'keputusan', e.target.value)} className="form-select">
                      <option value="BK">Belum Kompeten</option>
                      <option value="K">Kompeten</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button variant="primary" onClick={handleSimpanData} isLoading={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan & Selesai'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TablePeserta;