import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import './TablePeserta.css'; // <-- IMPORT CSS GAYA EXCEL DI SINI

const TablePeserta = ({ dataPeserta, skemaName, asesor1, asesor2, isAdmin, isStaffAsesorActive = false, onSave }) => {
  const [peserta, setPeserta] = useState([]);
  const [alertConfig, setAlertConfig] = useState(null);

  // LOGIKA GHAIB: Cuma Muncul Buat Admin LSP atau Staff LSP
  const showAsesorKeputusan = isAdmin || isStaffAsesorActive;

  // LOGIKA AUTO-DISTRIBUSI ASESOR SECARA ADIL
  useEffect(() => {
    if (dataPeserta && dataPeserta.length > 0) {
      const half = Math.ceil(dataPeserta.length / 2);
      const mapped = dataPeserta.map((p, i) => {
        let defaultAsesor = p.asesor;
        if (!defaultAsesor && showAsesorKeputusan) {
            defaultAsesor = i < half ? asesor1 : (asesor2 || asesor1);
        }
        return {
          ...p,
          asesor: defaultAsesor || '',
          keputusan: p.keputusan || ''
        };
      });
      setPeserta(mapped);
    } else {
      setPeserta([]);
    }
  }, [dataPeserta, asesor1, asesor2, showAsesorKeputusan]);

  if (!peserta || peserta.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>Data peserta tidak ditemukan.</div>;
  }

  const handleUpdatePeserta = (index, field, value) => {
    // Logika penguncian hak akses
    if (field === 'asesor' && !isAdmin && !isStaffAsesorActive) return;
    if (field === 'keputusan' && !isAdmin) return; // Dropdown K/BK mati total buat Staff
    
    const newData = [...peserta];
    newData[index][field] = value;
    setPeserta(newData);
  };

  const handleSimpanData = () => {
    setAlertConfig({
      type: 'save',
      title: 'Simpan Data Asesi?',
      text: 'Pembagian Asesor dan Hasil Keputusan Uji akan disimpan ke dalam sistem.',
      onConfirm: () => {
        setAlertConfig({
          type: 'success',
          title: 'Berhasil Disimpan!',
          text: 'Data pembagian asesor dan keputusan uji berhasil diperbarui.',
          onConfirm: () => {
            setAlertConfig(null);
            if (onSave) onSave(); 
          }
        });
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleDownloadExcel = () => {
    let header = "No,Nama,NIK,Jenis Kelamin (L/P),Tempat Lahir,Tanggal Lahir,Alamat,RT,RW,Kelurahan,Kecamatan,No. HP,Email,Pendidikan Terakhir";
    
    // Header Asesor & Keputusan cuma ikut ke-download kalau Admin LSP/Staff yang pencet
    if (showAsesorKeputusan) {
        header += ",Asesor Penguji,Keputusan Uji";
    }
    header += "\n";

    let csvContent = header;

    peserta.forEach((p, index) => {
      let row = [
        index + 1, `"${p.nama || ''}"`, `"${p.nik || ''}"`, `"${p.jk || ''}"`, `"${p.tempatLahir || ''}"`, `"${p.tanggalLahir || ''}"`,
        `"${p.alamat || ''}"`, `"${p.rt || ''}"`, `"${p.rw || ''}"`, `"${p.kelurahan || ''}"`, `"${p.kecamatan || ''}"`, `"${p.hp || ''}"`, `"${p.email || ''}"`, `"${p.pendidikan || ''}"`
      ];
      
      // Isi datanya cuma ikut ke-download kalau Admin LSP/Staff yang pencet
      if (showAsesorKeputusan) {
          row.push(`"${p.asesor || 'Belum Diplot'}"`);
          row.push(`"${p.keputusan || 'Belum Uji'}"`);
      }
      
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Peserta_${skemaName?.replace(/\s+/g, '_') || 'UJK'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const countK = peserta.filter(p => p.keputusan === 'K').length;
  const countBK = peserta.filter(p => p.keputusan === 'BK').length;

  // Tombol simpan muncul jika dibuka oleh Admin, ATAU dibuka oleh Staff pas lagi bantu milihin Asesor
  const showSaveButton = isAdmin || isStaffAsesorActive;

  return (
    <div className="table-peserta-wrapper" style={{ position: 'relative' }}>
      {alertConfig && (
        <AlertPopup 
          type={alertConfig.type} 
          title={alertConfig.title} 
          text={alertConfig.text} 
          onConfirm={alertConfig.onConfirm} 
          onCancel={alertConfig.onCancel} 
        />
      )}

      {/* HEADER ROW: SUMMARY K / BK & EXPORT BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {showAsesorKeputusan && (
            <>
              <div style={{ padding: '6px 12px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #10b981', color: '#065f46', fontWeight: 'bold', fontSize: '0.8rem' }}>
                Kompeten (K): {countK}
              </div>
              <div style={{ padding: '6px 12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #ef4444', color: '#991b1b', fontWeight: 'bold', fontSize: '0.8rem' }}>
                Belum Kompeten (BK): {countBK}
              </div>
            </>
          )}
        </div>
        
        <Button variant="success" icon="file-excel" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>

      <div className="table-responsive-excel">
        <table className="excel-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '50px' }}>No.</th>
              <th rowSpan="2" style={{ minWidth: '180px' }}>Nama</th>
              <th rowSpan="2" style={{ minWidth: '160px' }}>NIK</th>
              <th rowSpan="2" style={{ width: '90px' }}>Jenis<br/>Kelamin<br/>(L/P)</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>Tempat Lahir</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>Tanggal Lahir</th>
              <th colSpan="5">Tempat Tinggal</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>No. HP</th>
              <th rowSpan="2" style={{ minWidth: '200px' }}>Email</th>
              <th rowSpan="2" style={{ minWidth: '130px' }}>Pendidikan<br/>Terakhir</th>
              
              {/* KOLOM GHAIB: Cuma Muncul di Admin LSP / Staff LSP */}
              {showAsesorKeputusan && <th rowSpan="2" style={{ minWidth: '180px', backgroundColor: '#f0fdf4', color: '#166534' }}>Asesor Penguji</th>}
              {showAsesorKeputusan && <th rowSpan="2" style={{ minWidth: '130px', backgroundColor: '#f0fdf4', color: '#166534' }}>Keputusan Uji</th>}
            </tr>
            <tr>
              <th style={{ minWidth: '250px' }}>Alamat</th>
              <th style={{ width: '60px' }}>RT</th>
              <th style={{ width: '60px' }}>RW</th>
              <th style={{ minWidth: '140px' }}>Kelurahan</th>
              <th style={{ minWidth: '140px' }}>Kecamatan</th>
            </tr>
          </thead>
          <tbody>
            {peserta.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td><strong>{item.nama}</strong></td>
                <td style={{ textAlign: 'center' }}>{item.nik}</td>
                <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.jk}</td>
                <td style={{ textAlign: 'center' }}>{item.tempatLahir}</td>
                <td style={{ textAlign: 'center' }}>{item.tanggalLahir}</td>
                <td>{item.alamat}</td>
                <td style={{ textAlign: 'center' }}>{item.rt}</td>
                <td style={{ textAlign: 'center' }}>{item.rw}</td>
                <td style={{ textAlign: 'center' }}>{item.kelurahan}</td>
                <td style={{ textAlign: 'center' }}>{item.kecamatan}</td>
                <td style={{ textAlign: 'center' }}>{item.hp}</td>
                <td><a href={`mailto:${item.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>{item.email}</a></td>
                <td style={{ textAlign: 'center' }}>{item.pendidikan}</td>
                
                {/* SEL GHAIB: Cuma Muncul di Admin LSP / Staff LSP */}
                {showAsesorKeputusan && (
                  <td style={{ backgroundColor: '#fafafa' }}>
                    <select 
                      value={item.asesor || ''} 
                      disabled={!isAdmin && !isStaffAsesorActive}
                      onChange={(e) => handleUpdatePeserta(index, 'asesor', e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: (isAdmin || isStaffAsesorActive) ? '#fff' : '#f5f5f9', cursor: (isAdmin || isStaffAsesorActive) ? 'pointer' : 'not-allowed' }}
                    >
                      <option value="">Pilih Asesor...</option>
                      {asesor1 && <option value={asesor1}>{asesor1}</option>}
                      {asesor2 && <option value={asesor2}>{asesor2}</option>}
                    </select>
                  </td>
                )}

                {showAsesorKeputusan && (
                  <td style={{ backgroundColor: '#fafafa' }}>
                    <select 
                      value={item.keputusan || ''} 
                      disabled={!isAdmin}
                      onChange={(e) => handleUpdatePeserta(index, 'keputusan', e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: isAdmin ? '#fff' : '#f5f5f9', cursor: isAdmin ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: item.keputusan === 'K' ? '#10b981' : item.keputusan === 'BK' ? '#ef4444' : '#475569' }}
                    >
                      <option value="">Status...</option>
                      <option value="K">K</option>
                      <option value="BK">BK</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSaveButton && peserta.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button 
            onClick={handleSimpanData}
            style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            <i className="fas fa-save"></i> Simpan & Selesai
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePeserta;