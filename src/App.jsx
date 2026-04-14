import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // <-- IMPORT CONTEXT DI SINI
import Layout from './components/layout/Layout';
import LandingPage from './pages/landing/LandingPage';
import CekSertifikat from './pages/landing/CekSertifikat';
import DaftarSkema from './pages/landing/DaftarSkema';
import LoginPage from './pages/auth/LoginPage';
import DashboardSuperAdmin from './pages/dashboard/DashboardSuperAdmin';
import DashboardAdminLSP from './pages/dashboard/DashboardAdminLSP';
import DashboardStaffLSP from './pages/dashboard/DashboardStaffLSP';
import DashboardAdminBLK from './pages/dashboard/DashboardAdminBLK';
import DashboardAsesor from './pages/dashboard/DashboardAsesor';
import MasterDataSkema from './pages/master/skema/MasterDataSkema';
import MasterDataAsesor from './pages/master/asesor/MasterDataAsesor';
import ManajemenAkun from './pages/manajemen-akun/ManajemenAkun';
import DataTUK from './pages/master/tuk/DataTUK';
import PenugasanPage from './pages/penugasan/PenugasanPage';
import BukuIndukPage from './pages/buku-induk/BukuIndukPage';
import FormPengajuanUJK from './pages/pengajuan/FormPengajuanUJK';
import SuratMenyurat from './pages/surat/SuratMenyurat';
import UjianAktifAsesor from './pages/penilaian/UjianAktifAsesor';
import TablePeserta from './pages/TablePeserta/TablePeserta'; 

import ProfilPage from './pages/profil/ProfilPage';
import PengaturanPage from './pages/pengaturan/PengaturanPage';
import ManajemenAkunAsesor from './pages/asesor/ManajemenAkunAsesor';

function App() {
  return (
    // BUNGKUS DENGAN USER PROVIDER
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cek-sertifikat" element={<CekSertifikat />} />
          <Route path="/daftar-skema" element={<DaftarSkema />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<Layout />}>
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/pengaturan" element={<PengaturanPage />} />
            <Route path="/table-peserta" element={<TablePeserta />} />

            <Route path="/super-admin" element={<DashboardSuperAdmin />} />
            <Route path="/super-admin/manajemen-akun" element={<ManajemenAkun />} />

            <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
            <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
            <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
            <Route path="/admin-lsp/tuk" element={<DataTUK />} />
            <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
            <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />

            <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
            <Route path="/staff-lsp/surat" element={<SuratMenyurat />} />

            <Route path="/admin-blk" element={<DashboardAdminBLK />} />
            <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />

            <Route path="/asesor" element={<DashboardAsesor />} />
            <Route path="/asesor/tugas" element={<UjianAktifAsesor />} />
            <Route path="/asesor/akun" element={<ManajemenAkunAsesor />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;