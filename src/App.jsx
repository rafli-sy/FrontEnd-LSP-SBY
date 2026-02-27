import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; 
import DashboardStaffLSP from './pages/dashboard/DashboardStaffLSP'; // Import halaman Staff LSP yang asli

// Komponen Dummy untuk Dashboard (Sementara)
const DashboardSuperAdmin = () => <div><h2>Dashboard Super Admin</h2><p>Selamat datang di panel kendali utama.</p></div>;
const DashboardAdminLSP = () => <div><h2>Dashboard Admin LSP</h2><p>Panel pengelolaan skema dan jadwal.</p></div>;
const DashboardAdminBLK = () => <div><h2>Dashboard Admin BLK</h2><p>Panel E-Pendaftaran Pelatihan.</p></div>;
const DashboardAsesor = () => <div><h2>Dashboard Asesor</h2><p>Panel form penilaian peserta.</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Halaman Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rute Halaman Admin (Dibungkus Layout Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/super-admin" element={<DashboardSuperAdmin />} />
          <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
          <Route path="/admin-blk" element={<DashboardAdminBLK />} />
          <Route path="/asesor" element={<DashboardAsesor />} />
          
          {/* Rute untuk Staff LSP (Verifikasi & Cetak Sertifikat) */}
          <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;