import React from 'react';
// IMPORT SEMUA TEMPLATE YANG ADA
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
import PengembalianDokumen from './templates/PengembalianDokumen';

// <-- TAMBAHKAN IMPORT INI -->
import RencanaVerifikasiTUK from './templates/RencanaVerifikasiTUK';

const TemplateAdministrasi = ({ data }) => {
  const { ujk, docCode } = data;

  const renderDocument = () => {
    switch (docCode) {
      case 'DOC.01': return <LaporanPenyelia data={ujk} />;
      case 'DOC.02': return <BABaru data={ujk} />;
      case 'DOC.03': return <PenerapanTUK data={ujk} />;
      case 'DOC.04': return <SKPenyelenggara data={ujk} />;
      case 'DOC.05': return <LampiranSK data={ujk} />;
      case 'DOC.06': return <DHPra data={ujk} />;
      case 'DOC.07': return <DH1 data={ujk} />;
      case 'DOC.08': return <DH2 data={ujk} />;
      case 'DOC.09': return <TandaTerimaDokumen data={ujk} />;
      case 'DOC.10': return <PernyataanAsesor1 data={ujk} />;
      case 'DOC.11': return <PernyataanAsesor2 data={ujk} />;
      case 'DOC.12': return <PengembalianDokumen data={ujk} />;
      
      // <-- TAMBAHKAN KODE INI (DOC.13) -->
      case 'DOC.13': return <RencanaVerifikasiTUK data={ujk} />;
      
      default: return (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
          <h3>Template Dokumen Belum Tersedia</h3>
        </div>
      );
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {renderDocument()}
    </div>
  );
};

export default TemplateAdministrasi;