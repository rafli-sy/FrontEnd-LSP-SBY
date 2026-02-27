import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import DashboardSuperAdmin from './pages/dashboard/DashboardSuperAdmin';
import DashboardAdminLSP from './pages/dashboard/DashboardAdminLSP';
import DashboardStaffLSP from './pages/dashboard/DashboardStaffLSP';
import DashboardAdminBLK from './pages/dashboard/DashboardAdminBLK';
import DashboardAsesor from './pages/dashboard/DashboardAsesor';
import PenugasanPage from './pages/dashboard/PenugasanPage';
import BukuIndukPage from './pages/dashboard/BukuIndukPage';
import VerifikasiPeserta from './pages/dashboard/VerifikasiPeserta';
import FormPengajuanUJK from './pages/dashboard/FormPengajuanUJK';
import ManajemenPesertaImport from './pages/dashboard/ManajemenPesertaImport';

// Komponen sementara untuk halaman yang belum dibuat filenya
const MasterDataSkema = () => <div className="dashboard-content"><h2>Master Data Skema</h2></div>;
const MasterDataAsesor = () => <div className="dashboard-content"><h2>Master Data Asesor</h2></div>;
const DataTUK = () => <div className="dashboard-content"><h2>Data Penyelia & TUK</h2></div>;
const ManajemenCetak = () => <div className="dashboard-content"><h2>Manajemen Cetak Sertifikat</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} /> 

        <Route element={<Layout />}>
          <Route path="/super-admin" element={<DashboardSuperAdmin />} />

          <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
          <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
          <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
          <Route path="/admin-lsp/tuk" element={<DataTUK />} />
          <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
          <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />

          <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
          <Route path="/staff-lsp/verifikasi" element={<VerifikasiPeserta />} />
          <Route path="/staff-lsp/cetak" element={<ManajemenCetak />} />

          <Route path="/admin-blk" element={<DashboardAdminBLK />} />
          <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />
          <Route path="/admin-blk/peserta" element={<ManajemenPesertaImport />} />

          <Route path="/asesor" element={<DashboardAsesor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;