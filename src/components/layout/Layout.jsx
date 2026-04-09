import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css'; 

const Layout = () => {
  // State untuk mengontrol sidebar di layar HP
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="content-area">
          <div className="fade-in-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay gelap yang muncul saat sidebar terbuka di HP */}
      {isSidebarOpen && (
        <div className="sidebar-mobile-overlay" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default Layout;