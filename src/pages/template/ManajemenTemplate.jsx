import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button';
import AlertPopup from '../../components/ui/AlertPopup';
import '../pengaturan/PengaturanPage.css';

const ManajemenTemplate = () => {
  const [alert, setAlert] = useState(null);
  const [isUploadingTemplate, setIsUploadingTemplate] = useState({ sertifikat: false, nominatif: false });
  const templateSertifikatRef = useRef(null);
  const templateNominatifRef = useRef(null);

  const closeAlert = () => setAlert(null);

  const handleUploadTemplate = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    e.target.value = ''; // Reset input
    
    setIsUploadingTemplate(prev => ({ ...prev, [type]: true }));
    const fd = new FormData();
    fd.append('file_template', file);

    const endpoint = type === 'sertifikat' 
      ? '/api/admin-lsp/upload-template-sertifikat'
      : '/api/admin-lsp/upload-template-nominatif';

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://untracked-exponent-oboe.ngrok-free.dev';
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menyimpan template.');
      }

      setAlert({ type: 'success', title: 'Berhasil', text: `Template ${type === 'sertifikat' ? 'Sertifikat' : 'Nominatif Asesi'} berhasil diperbarui.`, onCancel: closeAlert });
    } catch (err) {
      setAlert({ type: 'error', title: 'Gagal', text: err.message, onCancel: closeAlert });
    } finally {
      setIsUploadingTemplate(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="pengaturan-container fade-in-content">
      <div className="pengaturan-header">
        <h2>Template Excel</h2>
        <p className="text-muted">Kelola dan perbarui file template Excel yang diunduh oleh admin.</p>
      </div>

      <div className="pengaturan-content-wrapper">
        <div className="pengaturan-card shadow-sm">
          <div className="card-header">
            <h3>
              <i className="fas fa-file-excel text-success icon-spacing"></i> File Template
            </h3>
          </div>
          
          <div className="card-body">
            <div className="template-item-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1e293b' }}>Template Sertifikat Asesi</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Template untuk form Upload Sertifikat Lama.</p>
              </div>
              <input type="file" accept=".xlsx,.xls" ref={templateSertifikatRef} style={{ display: 'none' }} onChange={(e) => handleUploadTemplate(e, 'sertifikat')} />
              <Button type="button" variant="success" icon={isUploadingTemplate.sertifikat ? "spinner fa-spin" : "upload"} onClick={() => templateSertifikatRef.current?.click()} disabled={isUploadingTemplate.sertifikat}>
                {isUploadingTemplate.sertifikat ? 'Mengunggah...' : 'Update Template'}
              </Button>
            </div>

            <div className="template-item-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1e293b' }}>Template Data Nominatif Asesi</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Template untuk form pengajuan UJK oleh Admin BLK.</p>
              </div>
              <input type="file" accept=".xlsx,.xls" ref={templateNominatifRef} style={{ display: 'none' }} onChange={(e) => handleUploadTemplate(e, 'nominatif')} />
              <Button type="button" variant="primary" icon={isUploadingTemplate.nominatif ? "spinner fa-spin" : "upload"} onClick={() => templateNominatifRef.current?.click()} disabled={isUploadingTemplate.nominatif}>
                {isUploadingTemplate.nominatif ? 'Mengunggah...' : 'Update Template'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {alert && <AlertPopup {...alert} />}
    </div>
  );
};

export default ManajemenTemplate;
