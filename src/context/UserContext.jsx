import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 1. Inisialisasi state dengan mengambil data dari sessionStorage
  const [userData, setUserData] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Map data dari backend ke format yang dikenali oleh frontend
        return {
          // Menangkap key dari backend Laravel (snake_case atau camelCase)
          namaLengkap: parsedUser.nama_lengkap || parsedUser.name || parsedUser.nama || parsedUser.namaLengkap || '',
          username: parsedUser.username || '',
          email: parsedUser.email || '',
          
          nomorTelpon: parsedUser.nomor_telpon || parsedUser.nomorTelpon || parsedUser.no_telp || parsedUser.noTelp || '',
          tanggalLahir: parsedUser.tanggal_lahir || parsedUser.tanggalLahir || '',
          jenisKelamin: parsedUser.jenis_kelamin || parsedUser.jenisKelamin || '',
          
          alamatDomisili: parsedUser.alamat_domisili || parsedUser.alamatDomisili || parsedUser.alamat || '',
          instansi: parsedUser.instansi || '',
          
          // UBAH: Tambahkan tangkapan untuk fotoProfil agar tidak hilang saat di-refresh
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

    // 2. Jika belum login (kosong di sessionStorage), berikan nilai default kosong
    return {
      namaLengkap: '',
      username: '',
      email: '',
      nomorTelpon: '', 
      tanggalLahir: '',
      jenisKelamin: '',
      alamatDomisili: '', 
      instansi: '',
      foto: null,
      noReg: '',
      kejuruan: '',
      masaBerlaku: '',
      skema: []
    };
  });

  // 3. Modifikasi fungsi update agar ketika profil diedit, sessionStorage juga ikut diperbarui
  const updateUserData = (newData) => {
    setUserData(prev => {
      const updatedData = { ...prev, ...newData };
      // Simpan perubahan ke sessionStorage agar tidak hilang saat di-refresh
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