import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Jika tidak ada halaman atau hanya 1 halaman, tombol tidak perlu dirender
  if (totalPages <= 1) return null;

  // --- LOGIKA MENAMPILKAN MAKSIMAL 3 KOTAK HALAMAN ---
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  // Penyesuaian jika kita berada di halaman terakhir (agar tetap tampil 3 kotak secara mundur)
  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }
  // ----------------------------------------------------

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '20px' }}>
      {/* Tombol Sebelumnya */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Render Angka Halaman (Max 3 Kotak) */}
      {visiblePages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s',
              backgroundColor: isActive ? '#2563eb' : '#fff',
              color: isActive ? '#fff' : '#475569',
              border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            {page}
          </button>
        );
      })}

      {/* Tombol Berikutnya */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
};

export default Pagination;