import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Layout from './components/layout/Layout';

// Landing & Auth
import LandingPage from './pages/landing/LandingPage';
import CekSertifikat from './pages/landing/CekSertifikat';
import DaftarSkema from './pages/landing/DaftarSkema';
import LoginPage from './pages/auth/LoginPage';

// Dashboard Utama
import DashboardSuperAdmin from './pages/dashboard/DashboardSuperAdmin';
import DashboardAdminLSP from './pages/dashboard/DashboardAdminLSP';
import DashboardStaffLSP from './pages/dashboard/DashboardStaffLSP';
import DashboardAdminBLK from './pages/dashboard/DashboardAdminBLK';
import DashboardAsesor from './pages/dashboard/DashboardAsesor';

// Fitur Mandiri Asesor
import ManajemenAkunAsesor from './pages/asesor/ManajemenAkunAsesor';

// Master Data (Khusus Admin LSP)
import MasterDataSkema from './pages/master/skema/MasterDataSkema';
import MasterDataAsesor from './pages/master/asesor/MasterDataAsesor';
import MasterDataPenyelia from './pages/master/penyelia/MasterDataPenyelia';
import DataTUK from './pages/master/tuk/DataTUK';

// Operasional
import ManajemenAkun from './pages/manajemen-akun/ManajemenAkun';
import PenugasanPage from './pages/penugasan/PenugasanPage';
import BukuIndukPage from './pages/buku-induk/BukuIndukPage';
import SuratMenyurat from './pages/surat/SuratMenyurat';
import TablePeserta from './pages/TablePeserta/TablePeserta'; 

// IMPORT YANG SEBELUMNYA HILANG
import FormPengajuanUJK from './pages/pengajuan/FormPengajuanUJK';

// Halaman Global
import ProfilPage from './pages/profil/ProfilPage';
import PengaturanPage from './pages/pengaturan/PengaturanPage';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Halaman Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/cek-sertifikat" element={<CekSertifikat />} />
          <Route path="/daftar-skema" element={<DaftarSkema />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Halaman Ber-Layout (Login Required) */}
          <Route element={<Layout />}>
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/pengaturan" element={<PengaturanPage />} />
            <Route path="/table-peserta" element={<TablePeserta />} />

            {/* Role: Super Admin */}
            <Route path="/super-admin" element={<DashboardSuperAdmin />} />
            <Route path="/super-admin/manajemen-akun" element={<ManajemenAkun />} />

            {/* Role: Admin LSP */}
            <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
            <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
            <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
            <Route path="/admin-lsp/penyelia" element={<MasterDataPenyelia />} />
            <Route path="/admin-lsp/tuk" element={<DataTUK />} />
            <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
            <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />

            {/* Role: Staff LSP */}
            <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
            <Route path="/staff-lsp/surat" element={<SuratMenyurat />} />
            
            {/* Role: Admin BLK */}
            <Route path="/admin-blk" element={<DashboardAdminBLK />} />
            {/* RUTE INI YANG BIKIN WHITE SCREEN KARENA SEBELUMNYA TIDAK ADA! */}
            <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />
            
            {/* Role: Asesor */}
            <Route path="/asesor" element={<DashboardAsesor />} />
            <Route path="/asesor/data-asesor" element={<ManajemenAkunAsesor />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;