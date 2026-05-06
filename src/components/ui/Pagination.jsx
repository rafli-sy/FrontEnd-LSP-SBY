import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalData, itemsPerPage }) => {
  if (totalData === 0) return null; // Sembunyikan jika tidak ada data

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalData);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
        Menampilkan {startItem} - {endItem} dari {totalData} data
      </span>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)} 
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: currentPage === 1 ? '#f1f5f9' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
        >
          Back
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i + 1} 
            onClick={() => onPageChange(i + 1)} 
            style={{ width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid', borderColor: currentPage === i + 1 ? '#3b82f6' : '#cbd5e1', borderRadius: '6px', background: currentPage === i + 1 ? '#3b82f6' : '#fff', color: currentPage === i + 1 ? '#fff' : '#334155', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
          >
            {i + 1}
          </button>
        ))}
        
        <button 
          disabled={currentPage === totalPages || totalPages === 0} 
          onClick={() => onPageChange(currentPage + 1)} 
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: currentPage === totalPages || totalPages === 0 ? '#f1f5f9' : '#fff', color: currentPage === totalPages || totalPages === 0 ? '#94a3b8' : '#334155', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;