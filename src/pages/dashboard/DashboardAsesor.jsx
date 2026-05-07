import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup'; 
import TablePeserta from '../TablePeserta/TablePeserta'; 

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import SuratBalasanPDF from '../surat/pdf/SuratBalasanPDF';
import SuratTugasPDF from '../surat/pdf/SuratTugasPDF';
import BeritaAcaraPDF from '../surat/pdf/BeritaAcaraPDF';

const DashboardAsesor = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null); 

  // --- SENSOR GLOBAL BACK BUTTON ---
  useEffect(() => {
    const handleGlobalBack = (e) => {
      if (selectedPeserta) { 
        setSelectedPeserta(null); 
        e.preventDefault(); 
      }
      else if (previewDokumen) { 
        setPreviewDokumen(null); 
        e.preventDefault(); 
      }
    };
    window.addEventListener('globalBackRequested', handleGlobalBack);
    return () => window.removeEventListener('globalBackRequested', handleGlobalBack);
  }, [selectedPeserta, previewDokumen]);

  // Data Dummy: Alur 3 Status (Menunggu -> Berlangsung -> Selesai)
  const [agendaPenugasan, setAgendaPenugasan] = useState([
    { 
      id: 1, 
      skema: 'Pembuatan Roti dan Kue', 
      kejuruan: 'Pariwisata', 
      tanggal: '24 April 2026', 
      tuk: 'TUK Sewaktu BLK Surabaya', 
      status: 'Menunggu Waktu Ujian', 
      badge: 'warning',
      pesertaList: [
        { id: 1, nama: 'Siti Aminah', nik: '3578001122334455', jk: 'P', tempatLahir: 'Surabaya', tanggalLahir: '12 Mei 1995', alamat: 'Jl. Kenangan No 1', rt: '01', rw: '02', kelurahan: 'Ketintang', kecamatan: 'Gayungan', hp: '08123456789', email: 'siti@mail.com', pendidikan: 'SMA' },
        { id: 2, nama: 'Budi Santoso', nik: '3578009988776655', jk: 'L', tempatLahir: 'Gresik', tanggalLahir: '08 Agustus 1996', alamat: 'Jl. Veteran 45', rt: '03', rw: '04', kelurahan: 'Sidomoro', kecamatan: 'Kebomas', hp: '08987654321', email: 'budi@mail.com', pendidikan: 'SMK' }
      ]
    },
    { 
      id: 2, 
      skema: 'Barista', 
      kejuruan: 'Pariwisata', 
      tanggal: '26 April 2026', 
      tuk: 'TUK Sewaktu BLK Surabaya', 
      status: 'Sedang Berlangsung', 
      badge: 'primary',
      pesertaList: [
        { id: 3, nama: 'Andi Wijaya', nik: '3578002233445566', jk: 'L', tempatLahir: 'Sidoarjo', tanggalLahir: '21 Juli 1998', alamat: 'Perumahan Tropodo', rt: '05', rw: '01', kelurahan: 'Tropodo', kecamatan: 'Waru', hp: '082233445566', email: 'andi@mail.com', pendidikan: 'D3' }
      ]
    },
    { 
      id: 3, 
      skema: 'Desain Grafis Madya', 
      kejuruan: 'TIK', 
      tanggal: '10 April 2026', 
      tuk: 'TUK Mandiri Unesa', 
      status: 'Selesai', 
      badge: 'success',
      pesertaList: [
        { id: 4, nama: 'Rina Melati', nik: '3578005544332211', jk: 'P', tempatLahir: 'Malang', tanggalLahir: '15 Januari 1997', alamat: 'Jl. Kawi 22', rt: '02', rw: '05', kelurahan: 'Kauman', kecamatan: 'Klojen', hp: '085544332211', email: 'rina@mail.com', pendidikan: 'S1' }
      ]
    }
  ]);

  const filteredAgenda = filterStatus === 'Semua' 
    ? agendaPenugasan 
    : agendaPenugasan.filter(item => item.status === filterStatus);

  const totalSelesai = agendaPenugasan.filter(u => u.status === 'Selesai').length;

  const handleMulaiUjian = (item) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Mulai Ujian?',
      text: `Apakah Anda yakin ingin memulai sesi ujian untuk skema ${item.skema}?`,
      onConfirm: () => {
        setAgendaPenugasan(prev => prev.map(a => a.id === item.id ? { ...a, status: 'Sedang Berlangsung', badge: 'primary' } : a));
        setAlertConfig({ type: 'success', title: 'Berhasil', text: 'Sesi ujian telah dimulai.' });
        setTimeout(() => setAlertConfig(null), 2000);
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleSelesaiUjian = (item) => {
    setAlertConfig({
      type: 'confirm',
      title: 'Selesai Ujian?',
      text: `Apakah ujian untuk skema ${item.skema} sudah benar-benar selesai?`,
      onConfirm: () => {
        setAgendaPenugasan(prev => prev.map(a => a.id === item.id ? { ...a, status: 'Selesai', badge: 'success' } : a));
        setAlertConfig({ type: 'success', title: 'Selesai', text: 'Sesi ujian telah ditutup.' });
        setTimeout(() => setAlertConfig(null), 2000);
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handlePreviewDokumen = (jenis, item) => {
    const ujkData = {
      skema: item.skema,
      bidang: item.kejuruan,
      tuk: item.tuk,
      hari1: item.tanggal,
      hari2: item.tanggal, 
      waktu: '08.00 WIB s/d Selesai',
      asesor1: userData?.namaLengkap || 'Wasini, SE, MM',
      noReg1: userData?.noReg || 'MET.000.001668.2012',
      asesor2: 'Endang Lestari',
      noReg2: 'MET.000.011411 2019',
      pengusul: 'UPT BLK Surabaya', 
      asesi: item.pesertaList.length 
    };
    const formData = {
      noSurat: `ST-${item.id.toString().padStart(3, '0')}/LSP-BLK/IV/2026`,
      tanggalSurat: item.tanggal,
      noDokumen: jenis === 'BA' ? 'FR-SER-01.1-LSP BLK-SBY' : 'FR.KPA.02',
      edisiRevisi: '01/00',
      tanggalBerlaku: '10-Nov-2015',
      halaman: '1 dari 1'
    };
    setPreviewDokumen({ jenis, data: { ujk: ujkData, form: formData } });
  };

  if (previewDokumen) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>Pratinjau Dokumen</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Periksa hasil dokumen dalam format PDF.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" icon="arrow-left" onClick={() => setPreviewDokumen(null)}>Kembali</Button>
            <PDFDownloadLink 
              document={previewDokumen.jenis === 'SPT' ? <SuratTugasPDF data={previewDokumen.data} /> : <BeritaAcaraPDF data={{ ujk: previewDokumen.data.ujk }} />} 
              fileName={`${previewDokumen.jenis}_Asesor.pdf`}
              style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              {({ loading }) => (loading ? 'Menyiapkan PDF...' : 'Unduh PDF')}
            </PDFDownloadLink>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '80vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <PDFViewer width="100%" height="100%" showToolbar={true}>
            {previewDokumen.jenis === 'SPT' && <SuratTugasPDF data={previewDokumen.data} />}
            {previewDokumen.jenis === 'BA' && <BeritaAcaraPDF data={{ ujk: previewDokumen.data.ujk }} />}
          </PDFViewer>
        </div>
      </div>
    );
  }

  if (selectedPeserta) {
    return (
      <div className="dashboard-content fade-in-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <Button variant="outline" icon="arrow-left" onClick={() => setSelectedPeserta(null)}>Kembali ke Jadwal</Button>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a' }}>Data Peserta Ujian</h2>
            <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong> | TUK: {selectedPeserta.tuk}</p>
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '25px' }}>
          <TablePeserta dataPeserta={selectedPeserta.pesertaList || []} skemaName={selectedPeserta.skema} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in-content" style={{ position: 'relative' }}>
      {alertConfig && (
        <AlertPopup 
          type={alertConfig.type} 
          title={alertConfig.title} 
          text={alertConfig.text} 
          onConfirm={alertConfig.onConfirm || (() => setAlertConfig(null))} 
          onCancel={alertConfig.onCancel || (() => setAlertConfig(null))} 
        />
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: '700', margin: '0' }}>
          Halo, {userData?.namaLengkap || 'Asesor'}!
        </h2>
        <p className="text-muted" style={{ fontSize: '1rem', marginTop: '6px' }}>
          Selamat datang kembali. Berikut adalah ringkasan agenda penugasan pengujian Anda.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><i className="fas fa-tasks"></i></div>
          <div className="stat-info"><h3>{agendaPenugasan.length}</h3><p>Total Penugasan</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><i className="fas fa-check-double"></i></div>
          <div className="stat-info"><h3>{totalSelesai}</h3><p>Ujian Selesai</p></div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: '600', margin: '0' }}>Riwayat & Jadwal Penugasan UJK</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', margin: '4px 0 0 0' }}>
              Klik jumlah peserta untuk melihat data asesi, dan unduh dokumen administrasi di sebelah kanan.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}><i className="fas fa-filter"></i> Filter:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.9rem', color: '#0f172a', fontWeight: '500', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Waktu Ujian">Menunggu Waktu Ujian</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>No.</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Tanggal</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Skema Kejuruan</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Lokasi TUK</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Peserta</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Dokumen</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgenda.length > 0 ? (
                filteredAgenda.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{index + 1}</td>
                    
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}>
                      <i className="far fa-calendar-alt text-muted" style={{marginRight:'6px'}}></i>{item.tanggal}
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <strong style={{ color: '#0f172a' }}>{item.skema}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.kejuruan}</span>
                      </div>
                    </td>
                    
                    <td style={{ textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>{item.tuk}</td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPeserta(item)} style={{ margin: '0 auto' }}>
                        <strong>{item.pesertaList.length}</strong> <i className="fas fa-users" style={{ marginLeft: '4px' }}></i>
                      </Button>
                    </td>

                    {/* KOLOM STATUS (BADGE) */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${item.badge}`}>{item.status}</span>
                    </td>
                    
                    {/* KOLOM DOKUMEN */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button 
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '6px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600', 
                            cursor: 'pointer', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', 
                            transition: 'all 0.2s', minWidth: '80px', gap: '4px'
                          }} 
                          onClick={() => handlePreviewDokumen('SPT', item)} title="Lihat Surat Tugas"
                        >
                          <i className="fas fa-file-signature" style={{ fontSize: '1.2rem' }}></i>
                          <span>Surat Tugas</span>
                        </button>
                        
                        <button 
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '6px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600', 
                            cursor: 'pointer', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', 
                            transition: 'all 0.2s', minWidth: '80px', gap: '4px'
                          }} 
                          onClick={() => handlePreviewDokumen('BA', item)} title="Lihat Berita Acara"
                        >
                          <i className="fas fa-file-contract" style={{ fontSize: '1.2rem' }}></i>
                          <span>Berita Acara</span>
                        </button>
                      </div>
                    </td>

                    {/* KOLOM AKSI (Mulai / Selesaikan) */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {item.status === 'Menunggu Waktu Ujian' && (
                          <button onClick={() => handleMulaiUjian(item)} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', boxShadow: '0 2px 4px rgba(59,130,246,0.05)', minWidth: '100px', justifyContent: 'center' }}>
                            <i className="fas fa-play"></i> Mulai Ujian
                          </button>
                        )}
                        {item.status === 'Sedang Berlangsung' && (
                          <button onClick={() => handleSelesaiUjian(item)} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', boxShadow: '0 2px 4px rgba(59,130,246,0.05)', minWidth: '100px', justifyContent: 'center' }}>
                            <i className="fas fa-check-double"></i> Selesaikan Ujian
                          </button>
                        )}
                        {item.status === 'Selesai' && (
                          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '100px', justifyContent: 'center' }}>
                            <i className="fas fa-check-circle"></i> Selesai
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-folder-open" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', color: '#cbd5e1' }}></i>
                    Tidak ada jadwal ujian untuk status <strong>{filterStatus}</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAsesor;