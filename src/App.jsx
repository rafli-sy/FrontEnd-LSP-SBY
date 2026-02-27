import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ManajemenPesertaImport from './pages/dashboard/ManajemenPesertaImport';
import DashboardStaffLSP from './pages/dashboard/DashboardStaffLSP'; 

const DashboardSuperAdmin = () => <div className="dashboard-content"><h2>Dashboard Super Admin</h2></div>;
const DashboardAdminLSP = () => <div className="dashboard-content"><h2>Dashboard Admin LSP</h2></div>;
const DashboardAdminBLK = () => <div className="dashboard-content"><h2>Dashboard Admin BLK</h2></div>;
const DashboardAsesor = () => <div className="dashboard-content"><h2>Dashboard Asesor</h2></div>;
const MasterDataSkema = () => <div className="dashboard-content"><h2>Master Data Skema</h2></div>;
const MasterDataAsesor = () => <div className="dashboard-content"><h2>Master Data Asesor</h2></div>;
const DataTUK = () => <div className="dashboard-content"><h2>Data Penyelia & TUK</h2></div>;
const PenugasanPage = () => <div className="dashboard-content"><h2>Plotting Asesor & Jadwal</h2></div>;
const BukuIndukPage = () => <div className="dashboard-content"><h2>Buku Induk Kelulusan</h2></div>;
const VerifikasiPeserta = () => <div className="dashboard-content"><h2>Verifikasi Data Peserta</h2></div>;
const ManajemenCetak = () => <div className="dashboard-content"><h2>Manajemen Cetak Sertifikat</h2></div>;
const FormPengajuanUJK = () => <div className="dashboard-content"><h2>Form Pengajuan Surat UJK</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Halaman Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} /> 

        {/* Rute Halaman Admin (Dibungkus Layout Sidebar) */}
        <Route element={<Layout />}>
          
          {/* 1. ROLE: SUPER ADMIN */}
          <Route path="/super-admin" element={<DashboardSuperAdmin />} />

          {/* 2. ROLE: ADMIN LSP (K, L, M) - Controller */}
          <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
          <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
          <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
          <Route path="/admin-lsp/tuk" element={<DataTUK />} />
          <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
          <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />

          {/* 3. ROLE: STAFF LSP - Administrator */}
          <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
          <Route path="/staff-lsp/verifikasi" element={<VerifikasiPeserta />} />
          <Route path="/staff-lsp/cetak" element={<ManajemenCetak />} />

          {/* 4. ROLE: ADMIN BLK (A - G) - Requester */}
          <Route path="/admin-blk" element={<DashboardAdminBLK />} />
          <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />
          <Route path="/admin-blk/peserta" element={<ManajemenPesertaImport />} />

          {/* 5. ROLE: ASESOR - Field Expert */}
          <Route path="/asesor" element={<DashboardAsesor />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;