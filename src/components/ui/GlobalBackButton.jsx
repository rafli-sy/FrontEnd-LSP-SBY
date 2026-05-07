import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button'; 

const GlobalBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.replace(/\/$/, '');

  // Daftar rute utama (induk) dimana Tombol Kembali Global TIDAK AKAN MUNCUL
  const hiddenPaths = [
    '',
    '/super-admin',
    '/admin-lsp',
    '/staff-lsp',
    '/admin-blk',
    '/asesor',
    
    // Halaman dengan navigasi lokal atau Menu Utama (Sidebar)
    '/staff-lsp/surat',      
    '/admin-blk/pengajuan',   
    '/admin-lsp/skema',      
    '/admin-lsp/asesor',
    '/admin-lsp/penyelia',
    '/admin-lsp/tuk',
    '/admin-lsp/buku-induk',
    '/admin-lsp/penugasan' // Tambahkan ini jika Penugasan adalah menu utama
  ];

  if (hiddenPaths.includes(currentPath)) {
    return null;
  }

  // Logika Pintar untuk tombol "Kembali"
  const handleBackClick = () => {

    // ====================================================================
    // 1. SISTEM PENCEGAT CERDAS (INTERCEPTOR UNTUK SUB-HALAMAN/MODAL)
    // ====================================================================
    // Kita teriakkan ke seluruh sistem bahwa tombol back ditekan.
    // Jika ada halaman yang me-listen event ini dan memanggil e.preventDefault(),
    // isHandledLocally akan bernilai TRUE.
    const backEvent = new CustomEvent('globalBackRequested', { cancelable: true });
    const isHandledLocally = !window.dispatchEvent(backEvent);

    // Jika TRUE, HENTIKAN PROSES! (Berarti ada modal/sub-page yg baru saja ditutup)
    if (isHandledLocally) {
      return; 
    }

    // ====================================================================
    // 2. LOGIKA PINDAH URL (HANYA JALAN JIKA TIDAK ADA MODAL TERBUKA)
    // ====================================================================
    
    // Cari apakah current path ini adalah halaman turunan dari salah satu menu utama
    const validParents = hiddenPaths.filter(p => p !== '');
    let matchedParent = null;

    for (const parent of validParents) {
      // Cek jika path saat ini berawalan dengan parent (contoh: /admin-lsp/skema/tambah)
      if (currentPath.startsWith(parent + '/')) {
        // Ambil parent terpanjang jika ada nested rute
        if (!matchedParent || parent.length > matchedParent.length) {
          matchedParent = parent;
        }
      }
    }

    // Jika ketemu induknya (halaman list data), paksa kembali secara spesifik ke induk tersebut
    if (matchedParent) {
      navigate(matchedParent);
    } 
    else {
      // Jika tidak ada di daftar (misal: halaman /profil/edit), potong 1 segmen terakhir dari URL
      const pathSegments = currentPath.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
        pathSegments.pop(); // Menghapus segmen terakhir
        navigate('/' + pathSegments.join('/'));
      } else {
        // Fallback: Jika sudah tidak bisa dipotong, gunakan default history kembali browser
        navigate(-1);
      }
    }
  };

  return (
    <div style={{ marginBottom: '24px', animation: 'fadeIn 0.3s ease-in-out' }}>
      <Button 
        variant="outline" 
        icon="arrow-left" 
        onClick={handleBackClick}
        style={{ 
          backgroundColor: '#ffffff', 
          borderColor: '#cbd5e1', 
          color: '#475569',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        Kembali
      </Button>
    </div>
  );
};

export default GlobalBackButton;