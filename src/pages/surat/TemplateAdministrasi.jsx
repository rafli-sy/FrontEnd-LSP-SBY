import React from 'react';
import logoLSP from '../../assets/logo-lsp.png';

// --- IMPORT 12 FILE ANAK ---
import LaporanPenyelia from './templates/LaporanPenyelia';
import BABaru from './templates/BABaru'; 
import PenerapanTUK from './templates/PenerapanTUK'; 
import SKPenyelenggara from './templates/SKPenyelenggara';
import LampiranSK from './templates/LampiranSK'; 
import DHPra from './templates/DHPra'; 
import DH1 from './templates/DH1'; 
import DH2 from './templates/DH2'; 
import TandaTerimaDokumen from './templates/TandaTerimaDokumen'; 
import PernyataanAsesor1 from './templates/PernyataanAsesor1'; 
import PernyataanAsesor2 from './templates/PernyataanAsesor2'; 
import PengembalianDokumen from './templates/PengembalianDokumen'; // <--- TAMBAHAN FINAL

const kertasA4 = { 
  padding: '20mm', backgroundColor: '#fff', color: '#000', 
  fontFamily: '"Times New Roman", Times, serif', margin: '0 auto', 
  width: '210mm', minHeight: '297mm', boxSizing: 'border-box', boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
};

const TemplateAdministrasi = ({ data }) => {
  if (!data) return null;
  const { ujk, docName, docCode } = data;

  switch (docCode) {
    case 'DOC.01': return <LaporanPenyelia data={data} />;
    case 'DOC.02': return <BABaru data={data} />;
    case 'DOC.03': return <PenerapanTUK data={data} />;
    case 'DOC.04': return <SKPenyelenggara data={data} />; 
    case 'DOC.05': return <LampiranSK data={data} />; 
    case 'DOC.06': return <DHPra data={data} />; 
    case 'DOC.07': return <DH1 data={data} />; 
    case 'DOC.08': return <DH2 data={data} />; 
    case 'DOC.09': return <TandaTerimaDokumen data={data} />; 
    case 'DOC.10': return <PernyataanAsesor1 data={data} />; 
    case 'DOC.11': return <PernyataanAsesor2 data={data} />; 
    case 'DOC.12': return <PengembalianDokumen data={data} />; // <--- TERMINAL FINAL AKTIF

    default:
      return (
        <div className="cetak-pdf-container" style={kertasA4}>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '2px' }}>
            <img src={logoLSP} alt="Logo" style={{ width: '80px', marginRight: '20px' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a' }}>LSP BLK SURABAYA</h2>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'normal' }}>Lembaga Sertifikasi Profesi BLK Surabaya</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya</p>
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #000', marginBottom: '30px' }}></div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h3 style={{ textDecoration: 'underline', margin: '0 0 5px 0', fontSize: '1.3rem', textTransform: 'uppercase' }}>
              {docName}
            </h3>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#475569' }}>Kode Dokumen: {docCode}</p>
          </div>

          <table style={{ width: '100%', marginBottom: '30px', fontSize: '1.1rem', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ width: '180px', padding: '5px 0' }}>Skema Kompetensi</td><td>: <strong>{ujk.skema}</strong></td></tr>
              <tr><td style={{ padding: '5px 0' }}>TUK / Tempat</td><td>: {ujk.tuk}</td></tr>
              <tr><td style={{ padding: '5px 0' }}>Tanggal Pelaksanaan</td><td>: {ujk.hari1} - {ujk.hari2}</td></tr>
              <tr><td style={{ padding: '5px 0' }}>Asesor Kompetensi</td><td>: 1. {ujk.asesor1} <br/>  2. {ujk.asesor2 || '-'}</td></tr>
            </tbody>
          </table>
        </div>
      );
  }
};

export default TemplateAdministrasi;