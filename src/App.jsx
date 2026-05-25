import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import Sertifikat from './pages/sertifikat/Sertifikat';

// Operasional
import PenugasanPage from './pages/penugasan/PenugasanPage';
import BukuIndukPage from './pages/buku-induk/BukuIndukPage';
import SuratMenyurat from './pages/surat/SuratMenyurat';
import TablePeserta from './pages/TablePeserta/TablePeserta'; 
import FormPengajuanUJK from './pages/pengajuan/FormPengajuanUJK';

// Halaman Global
import ProfilPage from './pages/profil/ProfilPage';
import PengaturanPage from './pages/pengaturan/PengaturanPage';

// ==========================================
// KOMPONEN SATPAM (PROTECTED ROUTE)
// ==========================================
const ProtectedRoute = ({ allowedRoles }) => {
  const storedUser = sessionStorage.getItem('user');
  
  // Jika belum login, lempar ke halaman login
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    
    // Normalisasi string role (hilangkan spasi, garis bawah, jadikan huruf kecil semua)
    const userRole = user.role ? user.role.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    // Normalisasi juga role yang diizinkan agar format pengecekannya sama
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().replace(/[^a-z0-9]/g, ''));

    // 2. Jika role user TIDAK ADA di daftar yang diizinkan untuk halaman ini
    if (!normalizedAllowedRoles.includes(userRole)) {
      // Lempar kembali ke dashboard masing-masing sesuai role aslinya
      if (userRole === 'superadmin') return <Navigate to="/super-admin" replace />;
      if (userRole === 'adminlsp') return <Navigate to="/admin-lsp" replace />;
      
      // REVISI: Mengakomodasi 1 F (staf) dan 2 F (staff)
      if (userRole === 'stafflsp' || userRole === 'staflsp') return <Navigate to="/staff-lsp" replace />;
      
      if (userRole === 'adminblk') return <Navigate to="/admin-blk" replace />;
      if (userRole === 'asesor') return <Navigate to="/asesor" replace />;
      
      // Fallback jika role tidak dikenali
      return <Navigate to="/login" replace />;
    }

    // 3. Jika aman, izinkan masuk ke komponen (rute) di dalamnya
    return <Outlet />;

  } catch (error) {
    // 4. Bersihkan sessionStorage jika data korup
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('auth_token'); 
    return <Navigate to="/login" replace />;
  }
};


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
            
            {/* Rute Global: Bisa diakses SEMUA role asal sudah login */}
            {/* REVISI: Menambahkan 'staflsp' ke allowedRoles global */}
            <Route element={<ProtectedRoute allowedRoles={['superadmin', 'adminlsp', 'stafflsp', 'staflsp', 'adminblk', 'asesor']} />}>
              <Route path="/profil" element={<ProfilPage />} />
              <Route path="/pengaturan" element={<PengaturanPage />} />
              <Route path="/table-peserta" element={<TablePeserta />} />
            </Route>

            {/* Role: Super Admin */}
            <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
              <Route path="/super-admin" element={<DashboardSuperAdmin />} />
            </Route>

            {/* Role: Admin LSP */}
            <Route element={<ProtectedRoute allowedRoles={['adminlsp']} />}>
              <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
              <Route path="/admin-lsp/skema" element={<MasterDataSkema />} />
              <Route path="/admin-lsp/asesor" element={<MasterDataAsesor />} />
              <Route path="/admin-lsp/penyelia" element={<MasterDataPenyelia />} />
              <Route path="/admin-lsp/tuk" element={<DataTUK />} />
              <Route path="/admin-lsp/penugasan" element={<PenugasanPage />} />
              <Route path="/admin-lsp/buku-induk" element={<BukuIndukPage />} />
              <Route path="/admin-lsp/sertifikat" element={<Sertifikat />} />
            </Route>

            {/* Role: Staff LSP */}
            <Route element={<ProtectedRoute allowedRoles={['stafflsp', 'staflsp']} />}>
              <Route path="/staff-lsp" element={<DashboardStaffLSP />} />
              <Route path="/staff-lsp/surat" element={<SuratMenyurat />} />
              <Route path="/staff-lsp/buku-induk" element={<BukuIndukPage role="staff-lsp" />} />
              <Route path="/staff-lsp/sertifikat" element={<Sertifikat />} />
            </Route>

            {/* Role: Admin BLK */}
            <Route element={<ProtectedRoute allowedRoles={['adminblk']} />}>
              <Route path="/admin-blk" element={<DashboardAdminBLK />} />
              <Route path="/admin-blk/pengajuan" element={<FormPengajuanUJK />} />
            </Route>

            {/* Role: Asesor */}
            <Route element={<ProtectedRoute allowedRoles={['asesor']} />}>
              <Route path="/asesor" element={<DashboardAsesor />} />
              <Route path="/asesor/data-asesor" element={<ManajemenAkunAsesor />} />
            </Route>

          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;