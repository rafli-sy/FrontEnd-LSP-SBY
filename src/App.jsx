import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import DashboardSuperAdmin from './pages/dashboard/DashboardSuperAdmin';
import DashboardAdminLSP from './pages/dashboard/DashboardAdminLSP';
import ProfilAdminLSP from './pages/dashboard/ProfilAdminLSP'; // TAMBAHAN: Import file Profil Admin LSP
import DashboardStaffLSP from './pages/dashboard/DashboardStaffLSP';
import DashboardAdminBLK from './pages/dashboard/DashboardAdminBLK';
import DashboardAsesor from './pages/dashboard/DashboardAsesor';
import PenugasanPage from './pages/dashboard/PenugasanPage'; 
import BukuIndukPage from './pages/dashboard/BukuIndukPage';
import VerifikasiPeserta from './pages/dashboard/VerifikasiPeserta';
import FormPengajuanUJK from './pages/dashboard/FormPengajuanUJK';
import ManajemenPesertaImport from './pages/dashboard/ManajemenPesertaImport';
import ProfilAsesor from './pages/dashboard/ProfilAsesor';
import ManajemenAkunAsesor from './pages/dashboard/ManajemenAkunAsesor';
import UjianAktifAsesor from './pages/dashboard/UjianAktifAsesor';

import MasterDataSkema from './pages/dashboard/MasterDataSkema';
import MasterDataAsesor from './pages/dashboard/MasterDataAsesor';
import DataTUK from './pages/dashboard/DataTUK';

// Komponen sementara
const ManajemenCetak = () => <div className="dashboard-content"><h2>Manajemen Cetak Sertifikat</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} /> 

        <Route element={<Layout />}>
          <Route path="/super-admin" element={<DashboardSuperAdmin />} />

          {/* --- ROUTING ADMIN LSP --- */}
          <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
          <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
          <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
          <Route path="/admin-lsp/tuk" element={<DataTUK />} />
          <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
          <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />
          <Route path="/admin-lsp/profil" element={<ProfilAdminLSP />} /> {/* TAMBAHAN: Route Manajemen Akun */}

          {/* --- ROUTING STAFF LSP --- */}
          <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
          <Route path="/staff-lsp/verifikasi" element={<VerifikasiPeserta />} />
          <Route path="/staff-lsp/cetak" element={<ManajemenCetak />} />

          {/* --- ROUTING ADMIN BLK --- */}
          <Route path="/admin-blk" element={<DashboardAdminBLK />} />
          <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />
          <Route path="/admin-blk/peserta" element={<ManajemenPesertaImport />} />

          {/* --- ROUTING ASESOR --- */}
          <Route path="/asesor" element={<DashboardAsesor />} />
          <Route path="/asesor/tugas" element={<UjianAktifAsesor />} />
          <Route path="/asesor/profil" element={<ProfilAsesor />} />

          {/* --- ROUTING KHUSUS ASESOR --- */}
          <Route path="/asesor" element={<DashboardAsesor />} />
          <Route path="/asesor/tugas" element={<UjianAktifAsesor />} />
          <Route path="/asesor/profil" element={<ProfilAsesor />} />
          <Route path="/asesor/manajemen-akun" element={<ManajemenAkunAsesor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;