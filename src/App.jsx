import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage'; // Import halaman Landing

// Komponen Halaman Sederhana
const Login = () => <div style={{padding: '50px', textAlign: 'center'}}><h1>Halaman Login</h1><p>Masuk ke sistem sesuai wewenang (Super Admin, Admin LSP, dll).</p></div>;
const DashboardSuperAdmin = () => <div><h2>Selamat Datang, Super Admin</h2><p>Di sini tempat mengatur semua data LSP dan BLK.</p></div>;
const DashboardAdminLSP = () => <div><h2>Selamat Datang, Admin LSP</h2><p>Di sini tempat manajemen Asesor dan Skema Sertifikasi.</p></div>;
const DashboardAdminBLK = () => <div><h2>Selamat Datang, Admin BLK</h2><p>Di sini tempat kelola peserta dan jadwal pelatihan.</p></div>;
const DashboardAsesor = () => <div><h2>Selamat Datang, Asesor</h2><p>Di sini tempat memberikan nilai uji kompetensi.</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Awal: Menampilkan Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />

        {/* Rute Dashboard dengan Sidebar */}
        <Route element={<Layout />}>
          <Route path="/super-admin" element={<DashboardSuperAdmin />} />
          <Route path="/admin-lsp" element={<DashboardAdminLSP />} />
          <Route path="/admin-blk" element={<DashboardAdminBLK />} />
          <Route path="/asesor" element={<DashboardAsesor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;