import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    namaLengkap: 'Moch. Nur Rafli Hikmal Putra',
    username: 'rafli_hikmal',
    email: 'rafli.hikmal@example.com',
    noTelp: '081234567890',
    tanggalLahir: '2000-01-01',
    jenisKelamin: 'Laki-laki',
    alamat: 'Kediri, Jawa Timur',
    instansi: 'UPT Pelatihan Kerja Surabaya',
    foto: null,
    // Data Lisensi Asesor
    noReg: 'MET.011411 2026',
    kejuruan: 'Teknologi Informasi',
    masaBerlaku: '2029-12-31',
    skema: ['Pemrograman Web Full-Stack']
  });

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);