import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardAdminBLK = () => {
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [previewBalasan, setPreviewBalasan] = useState(null); // State untuk Modal Surat Balasan

  const riwayatPengajuan = [
    { 
      id: 1, 
      skema: 'Barista', 
      kejuruan: 'Pariwisata',
      tglMulai: '2026-02-21', 
      tglSelesai: '2026-02-22', 
      status: 'Sedang Diproses', 
      badge: 'warning',
      suratBalasan: null, // Belum ada balasan
      peserta: [
        { id: 1, nama: 'Fernando Torres', nik: '3578902006900001', jk: 'L', tempatLahir: 'Surabaya', tanggalLahir: '1990-06-20', alamat: 'Dukuh Menanggal III/29', rt: '1', rw: '1', kelurahan: 'Dukuh Menanggal', kecamatan: 'Gayungan', hp: '089689029754', email: 'f.torres@gmail.com', pendidikan: 'S1' },
        { id: 2, nama: 'Budi Santoso', nik: '3578902006900002', jk: 'L', tempatLahir: 'Malang', tanggalLahir: '1995-08-15', alamat: 'Jl. Raya Mondoroko No 1', rt: '2', rw: '3', kelurahan: 'Singosari', kecamatan: 'Singosari', hp: '081234567890', email: 'budi@gmail.com', pendidikan: 'SMA/Sederajat' }
      ]
    },
    { id: 2, skema: 'Pembuatan Roti Dan Kue', kejuruan: 'Pariwisata', tglMulai: '2026-02-18', tglSelesai: '2026-02-19', status: 'Disetujui LSP', badge: 'primary', suratBalasan: 'Tersedia', peserta: [] },
    { id: 3, skema: 'Practical Office Advance', kejuruan: 'TIK', tglMulai: '2026-03-31', tglSelesai: '2026-04-01', status: 'Selesai', badge: 'success', suratBalasan: 'Tersedia', peserta: [] },
    { id: 4, skema: 'Welder SMAW 3G', kejuruan: 'Las', tglMulai: '2026-01-10', tglSelesai: '2026-01-12', status: 'Selesai', badge: 'success', suratBalasan: 'Tersedia', peserta: [] }
  ];

  return (
    <div className="dashboard-content fade-in-content">
      
      {/* =========================================================
          LAYAR 1: PENINJAU PDF SURAT BALASAN (MUNCUL JIKA DIKLIK)
          ========================================================= */}
      {previewBalasan ? (
        
        <div className="fade-in-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', padding: '15px 25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => setPreviewBalasan(null)} className="btn-outline" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', borderColor: '#d1d5db', color: '#6b7280' }}>
                  <i className="fas fa-arrow-left"></i> Kembali
                </button>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Surat Balasan LSP</h2>
                  <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Dokumen Persetujuan: <strong>{previewBalasan.skema}</strong></p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-outline" style={{ padding: '10px 18px', borderColor: '#1d4ed8', color: '#1d4ed8' }} onClick={() => alert('Fitur unduh PDF dijalankan!')}><i className="fas fa-download"></i> Unduh PDF</button>
            </div>
          </div>

          <div className="dashboard-card fade-in-content" style={{ padding: '50px 80px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #ccc', flex: 1, overflowY: 'auto', fontFamily: '"Times New Roman", Times, serif', color: '#000' }}>
            {/* Kop Surat */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '4px double #000', paddingBottom: '10px', marginBottom: '25px' }}>
                <div style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                    <i className="fas fa-shield-alt" style={{ fontSize: '4.5rem', color: '#333' }}></i>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'normal', letterSpacing: '1px' }}>PEMERINTAH PROVINSI JAWA TIMUR</h3>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>DINAS TENAGA KERJA DAN TRANSMIGRASI</h2>
                    <h1 style={{ margin: '2px 0', fontSize: '1.7rem', fontWeight: '900', letterSpacing: '0.5px' }}>UPT BALAI LATIHAN KERJA SURABAYA</h1>
                    <p style={{ margin: 0, fontSize: '1rem' }}>Jl. Dukuh Menanggal III/29 Telp. (031) 8290071, 8287532 Fax. (031) 8290071</p>
                </div>
                <div style={{ width: '100px' }}></div> 
            </div>

            {/* Isi Surat (Simulasi) */}
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
              <h3 style={{ textDecoration: 'underline' }}>SURAT PERSETUJUAN UJI KOMPETENSI</h3>
              <p style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Menindaklanjuti permohonan pengajuan ujian dari UPT BLK Anda, bersama ini kami sampaikan bahwa Lembaga Sertifikasi Profesi (LSP) BLK Surabaya <strong>MENYETUJUI</strong> pelaksanaan kegiatan Uji Kompetensi untuk skema <strong>{previewBalasan.skema}</strong> yang dijadwalkan pada tanggal <strong>{previewBalasan.tglMulai} s/d {previewBalasan.tglSelesai}</strong>.
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px' }}>
               <div style={{ textAlign: 'center', width: '300px' }}>
                  <p>Surabaya, 10 Februari 2026</p>
                  <p>Ketua LSP BLK Surabaya</p>
                  <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#1a56db', transform: 'rotate(-5deg)' }}>Ttd & Cap Resmi</span>
                  </div>
                  <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>NAMA KETUA LSP, S.T., M.T.</p>
               </div>
            </div>
          </div>
        </div>

      ) : selectedPeserta ? (

        /* =========================================================
           LAYAR 2: DETAIL PESERTA (MUNCUL JIKA DIKLIK)
           ========================================================= */
        <div className="fade-in-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <button onClick={() => setSelectedPeserta(null)} className="btn-outline" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-arrow-left"></i> Kembali
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Data Peserta Ujian</h2>
              <p className="text-muted" style={{ margin: 0 }}>Skema: <strong>{selectedPeserta.skema}</strong></p>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '20px 0' }}>
            <div className="table-responsive" style={{ padding: '0 20px' }}>
              <table className="admin-table" style={{ border: '1px solid #e2e8f0', minWidth: '1300px' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center', width: '50px' }}>No.</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Nama Lengkap</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>NIK</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center', width: '80px' }}>L/P</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Tempat Lahir</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Tanggal Lahir</th>
                    <th colSpan="5" style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f1f5f9' }}>Tempat Tinggal</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>No. HP</th>
                    <th rowSpan="2" style={{ border: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>Email</th>
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Alamat</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc', width: '50px' }}>RT</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc', width: '50px' }}>RW</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Kelurahan</th>
                    <th style={{ border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>Kecamatan</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPeserta.peserta && selectedPeserta.peserta.length > 0 ? (
                    selectedPeserta.peserta.map((item, index) => (
                      <tr key={item.id}>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.nama}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.nik}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.jk}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.tempatLahir}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.tanggalLahir}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.alamat}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.rt}</td>
                        <td style={{ border: '1px solid #e2e8f0', textAlign: 'center' }}>{item.rw}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.kelurahan}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.kecamatan}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.hp}</td>
                        <td style={{ border: '1px solid #e2e8f0' }}>{item.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        Data peserta belum diunggah.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      ) : (

        /* =========================================================
           LAYAR 3: DASHBOARD UTAMA BLK (DEFAULT)
           ========================================================= */
        <div className="fade-in-content">
          <div className="stat-grid" style={{ marginBottom: '30px' }}>
            <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
              <div className="stat-icon primary" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '18px', borderRadius: '12px', fontSize: '1.8rem' }}>
                <i className="fas fa-paper-plane"></i>
              </div>
              <div className="stat-info">
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Total Usulan</p>
                <h2 style={{ margin: '5px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1f2937' }}>4</h2>
              </div>
            </div>
            
            <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
              <div className="stat-icon warning" style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '18px', borderRadius: '12px', fontSize: '1.8rem' }}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <div className="stat-info">
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Sedang Diproses LSP</p>
                <h2 style={{ margin: '5px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1f2937' }}>1</h2>
              </div>
            </div>

            <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
              <div className="stat-icon success" style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '18px', borderRadius: '12px', fontSize: '1.8rem' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Disetujui / Selesai</p>
                <h2 style={{ margin: '5px 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1f2937' }}>3</h2>
              </div>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-soft)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1f2937' }}>Riwayat Pengajuan Ujian</h3>
                <p className="text-muted" style={{ margin: '5px 0 0', fontSize: '0.95rem' }}>Daftar status permohonan dan dokumen balasan dari LSP.</p>
              </div>
              <Link to="/admin-blk/pengajuan" className="btn-add" style={{ padding: '10px 18px', borderRadius: '8px' }}>
                <i className="fas fa-plus"></i> Buat Usulan Baru
              </Link>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table" style={{ borderCollapse: 'separate', borderSpacing: '0', width: '100%' }}>
                <thead style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center', padding: '15px', color: '#4b5563', fontWeight: 600 }}>No.</th>
                    <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Kejuruan / Skema</th>
                    <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Tanggal Ujian</th>
                    <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Peserta</th>
                    <th style={{ padding: '15px', color: '#4b5563', fontWeight: 600 }}>Status & Dokumen</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatPengajuan.map((item, index) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ textAlign: 'center', color: '#6b7280', padding: '18px 15px' }}>{index + 1}</td>
                      <td style={{ padding: '18px 15px' }}>
                        <strong style={{ color: '#1f2937' }}>{item.skema}</strong><br/>
                        <small className="text-muted">{item.kejuruan}</small>
                      </td>
                      <td style={{ padding: '18px 15px' }}>
                        {item.tglMulai} <br/><small className="text-muted">s/d {item.tglSelesai}</small>
                      </td>
                      <td style={{ padding: '18px 15px' }}>
                        <button 
                          onClick={() => setSelectedPeserta(item)} 
                          className="btn-outline btn-sm" 
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '120px', padding: '8px 12px', borderRadius: '6px' }}
                        >
                          <span><strong>{item.peserta?.length || 16}</strong> Orang</span>
                          <i className="fas fa-users" style={{ color: '#64748b' }}></i>
                        </button>
                      </td>
                      
                      {/* KOLOM STATUS DAN TOMBOL LIHAT BALASAN */}
                      <td style={{ padding: '18px 15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                          <span className={`badge ${item.badge}`} style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, padding: '5px 10px', borderRadius: '15px' }}>
                            {item.status}
                          </span>
                          
                          {/* Jika surat balasan sudah diupload oleh LSP, tampilkan tombol ini */}
                          {item.suratBalasan === 'Tersedia' && (
                            <button 
                              onClick={() => setPreviewBalasan(item)} 
                              className="btn-outline btn-sm" 
                              style={{ borderColor: '#10b981', color: '#10b981', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              <i className="fas fa-envelope-open-text"></i> Lihat Balasan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default DashboardAdminBLK;