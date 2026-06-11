import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import GlobalBackButton from '../ui/GlobalBackButton'; // <-- Import tombolnya di sini
import './Layout.css'; 

const Layout = () => {
  // State untuk kontrol HP
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  // State untuk kontrol Laptop (Default: Terbuka/True agar tidak hilang)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true); 

  const toggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsDesktopOpen(!isDesktopOpen);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 992) {
      setIsSidebarOpen(false);
    }
  };

  // Reset sidebar otomatis jika ukuran layar berubah
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsSidebarOpen(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        isDesktopOpen={isDesktopOpen} 
        closeSidebar={closeSidebar}
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} isDesktopOpen={isDesktopOpen} />
        
        <main className="content-area">
          
          {/* Letakkan tombol di sini, LANGSUNG di bawah main. 
              Ini akan mengikuti padding bawaan content-area tanpa merusak layout */}
          <GlobalBackButton />

          <div className="fade-in-content">
            <Outlet />
          </div>
        </main>
      </div>

      {isSidebarOpen && window.innerWidth <= 992 && (
        <div className="sidebar-mobile-overlay" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default Layout;