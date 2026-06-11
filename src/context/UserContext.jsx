import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    
    if (storedUser) {
      try {
        // Murni membaca data yang disimpan oleh LoginPage.jsx (data.user)
        const parsedUser = JSON.parse(storedUser);
        
        return {
          namaLengkap: parsedUser.nama_lengkap || parsedUser.name || parsedUser.nama || parsedUser.namaLengkap || '',
          username: parsedUser.username || '',
          email: parsedUser.email || '',
          
          nomorTelpon: parsedUser.nomor_telpon || parsedUser.nomorTelpon || parsedUser.no_telp || parsedUser.noTelp || '',
          tanggalLahir: parsedUser.tanggal_lahir || parsedUser.tanggalLahir || '',
          jenisKelamin: parsedUser.jenis_kelamin || parsedUser.jenisKelamin || '',
          alamatDomisili: parsedUser.alamat_domisili || parsedUser.alamatDomisili || parsedUser.alamat || '',
          
          // MENGAMBIL INSTANSI:
          // Apapun nama kolomnya di database tabel 'users' kamu, kita tangkap di sini.
          instansi: parsedUser.instansi || parsedUser.asal_instansi || parsedUser.nama_instansi || parsedUser.institusi || '',
          
          foto: parsedUser.fotoProfil || parsedUser.foto_profil || parsedUser.foto_url || parsedUser.foto || null,
          noReg: parsedUser.noReg || '',
          kejuruan: parsedUser.kejuruan || '',
          masaBerlaku: parsedUser.masaBerlaku || '',
          skema: parsedUser.skema || []
        };
      } catch (error) {
        console.error("Gagal membaca data user dari sessionStorage", error);
      }
    }

    return {
      namaLengkap: '', username: '', email: '', nomorTelpon: '', 
      tanggalLahir: '', jenisKelamin: '', alamatDomisili: '', 
      instansi: '', foto: null, noReg: '', kejuruan: '', masaBerlaku: '', skema: []
    };
  });

  const updateUserData = (newData) => {
    setUserData(prev => {
      const updatedData = { ...prev, ...newData };
      sessionStorage.setItem('user', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);