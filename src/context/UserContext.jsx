import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 1. Inisialisasi state dengan membaca dari localStorage (agar tahan refresh)
  const [userData, setUserData] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Gagal membaca data user dari localStorage", error);
      return null;
    }
  });

  // 2. Modifikasi fungsi update agar ikut menyimpan ke localStorage
  const updateUserData = (newData) => {
    setUserData((prev) => {
      // Gabungkan data lama dengan data baru
      const updatedData = { ...prev, ...newData };
      
      // Simpan juga ke localStorage agar tidak hilang saat di-refresh
      localStorage.setItem('user', JSON.stringify(updatedData));
      
      return updatedData;
    });
  };

  // Fungsi tambahan yang berguna saat Logout
  const clearUserData = () => {
    setUserData(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);