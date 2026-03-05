import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Super Admin
import DashboardSuperAdmin from './pages/dashboard/super-admin/DashboardSuperAdmin';

// Admin LSP
import DashboardAdminLSP from './pages/dashboard/admin-lsp/DashboardAdminLSP';
import PenugasanPage from './pages/dashboard/admin-lsp/PenugasanPage';
import BukuIndukPage from './pages/dashboard/admin-lsp/BukuIndukPage';
// IMPORT BARU: Mengambil dari file yang sudah kamu buat di folder admin-lsp
import MasterDataSkema from './pages/dashboard/admin-lsp/MasterDataSkema';
import MasterDataAsesor from './pages/dashboard/admin-lsp/MasterDataAsesor';
import DataTUK from './pages/dashboard/admin-lsp/DataTUK';
import ProfilAdminLSP from './pages/dashboard/admin-lsp/ProfilAdminLSP';

// Staff LSP
import DashboardStaffLSP from './pages/dashboard/staff-lsp/DashboardStaffLSP';
import VerifikasiPeserta from './pages/dashboard/staff-lsp/VerifikasiPeserta';

// Admin BLK
import DashboardAdminBLK from './pages/dashboard/admin-blk/DashboardAdminBLK';
import FormPengajuanUJK from './pages/dashboard/admin-blk/FormPengajuanUJK';
import ManajemenPesertaImport from './pages/dashboard/admin-blk/ManajemenPesertaImport';

// Asesor
import DashboardAsesor from './pages/dashboard/asesor/DashboardAsesor';
// IMPORT BARU: Mengambil dari file yang sudah kamu buat di folder asesor
import UjianAktifAsesor from './pages/dashboard/asesor/UjianAktifAsesor';
import ManajemenAkunAsesor from './pages/dashboard/asesor/ManajemenAkunAsesor';
import ProfilAsesor from './pages/dashboard/asesor/ProfilAsesor';


// Komponen sementara untuk halaman yang BELUM ada filenya di gambar struktur foldermu
const ManajemenCetak = () => <div className="dashboard-content"><h2>Manajemen Cetak Sertifikat</h2></div>;
const ManajemenAkunSuperAdmin = () => <div className="dashboard-content"><h2>Manajemen Akun Super Admin</h2></div>;
const AuditTrail = () => <div className="dashboard-content"><h2>Audit Trail</h2></div>;
const KompetensiAsesor = () => <div className="dashboard-content"><h2>Kompetensi Saya</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} /> 

        <Route element={<Layout />}>
          {/* Routes Super Admin */}
          <Route path="/super-admin" element={<DashboardSuperAdmin />} />
          <Route path="/super-admin/users" element={<ManajemenAkunSuperAdmin />} />
          <Route path="/super-admin/audit" element={<AuditTrail />} />

          {/* Routes Admin LSP */}
          <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
          {/* Menggunakan file asli yang sudah di-import di atas */}
          <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
          <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
          <Route path="/admin-lsp/tuk" element={<DataTUK />} />
          <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
          <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />
          <Route path="/admin-lsp/profil" element={<ProfilAdminLSP />} />

          {/* Routes Staff LSP */}
          <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
          <Route path="/staff-lsp/verifikasi" element={<VerifikasiPeserta />} />
          <Route path="/staff-lsp/cetak" element={<ManajemenCetak />} />

          {/* Routes Admin BLK */}
          <Route path="/admin-blk" element={<DashboardAdminBLK />} />
          <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />
          <Route path="/admin-blk/peserta" element={<ManajemenPesertaImport />} />

          {/* Routes Asesor */}
          <Route path="/asesor" element={<DashboardAsesor />} />
          {/* Route baru untuk menu Asesor yang sudah kamu buat */}
          <Route path="/asesor/tugas" element={<UjianAktifAsesor />} />
          <Route path="/asesor/sertifikasi" element={<KompetensiAsesor />} />
          <Route path="/asesor/manajemen-akun" element={<ManajemenAkunAsesor />} />
          <Route path="/asesor/profil" element={<ProfilAsesor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;