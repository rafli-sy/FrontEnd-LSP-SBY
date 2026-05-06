import React from 'react'; 
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// --- IMPORT GAMBAR DARI FOLDER ASSETS ---
import logoLsp from '../../../assets/logo-lsp.png'; 
import ttdKetua from '../../../assets/ttd-ketua.png'; 

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 11, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  
  // Kop Surat Sesuai Gambar
  headerContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#000', paddingBottom: 10, marginBottom: 2 },
  headerLineThin: { borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 15 },
  logoBox: { width: 70, height: 70, objectFit: 'contain' },
  headerText: { flex: 1, textAlign: 'center', paddingHorizontal: 10 },
  title1: { fontSize: 18, fontFamily: 'Times-Bold', letterSpacing: 1 },
  title2: { fontSize: 12, marginTop: 4 },
  title3: { fontSize: 9, marginTop: 2 },
  
  // Kontrol Dokumen ISO (Atas Kanan)
  isoTable: { width: '45%', alignSelf: 'flex-end', borderWidth: 1, borderColor: '#000', marginBottom: 20 },
  isoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  isoRowLast: { flexDirection: 'row' },
  isoLabel: { width: '40%', fontSize: 9, padding: 4, borderRightWidth: 1, borderRightColor: '#000' },
  isoColon: { width: '5%', fontSize: 9, padding: 4, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
  isoValue: { width: '55%', fontSize: 9, padding: 4 },
  
  // Judul
  suratTitleCenter: { textAlign: 'center', marginBottom: 20 },
  suratTitleText: { fontSize: 14, fontFamily: 'Times-Bold', textDecoration: 'underline' },
  paragraf: { textAlign: 'justify', marginBottom: 10 },
  
  // Tabel Penugasan
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginVertical: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableRowLast: { flexDirection: 'row' },
  tableColHead: { padding: 6, backgroundColor: '#f1f5f9', fontFamily: 'Times-Bold', textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
  tableCol: { padding: 6, borderRightWidth: 1, borderRightColor: '#000' },
  
  // Info Ujian
  row: { flexDirection: 'row', marginBottom: 4 },
  colLabel: { width: '30%' },
  colColon: { width: '3%', textAlign: 'center' },
  colValue: { width: '67%' },
  
  // Tanda Tangan & Stempel
  ttdContainer: { width: '50%', alignSelf: 'flex-end', marginTop: 30 },
  ttdLocation: { marginBottom: 5 },
  ttdTitle: { fontFamily: 'Times-Bold' },
  ttdSignContainer: { height: 60, position: 'relative', marginVertical: 5 },
  ttdImage: { position: 'absolute', left: -20, right: -20, top: -15, height: 90, objectFit: 'contain' },
  ttdName: { fontFamily: 'Times-Bold', textDecoration: 'underline', marginTop: 5 }
});

const SuratTugasPDF = ({ data }) => {
  const { ujk, form } = data;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* --- KOP SURAT (Dengan Logo LSP Kiri) --- */}
        <View style={styles.headerContainer}>
          <Image src={logoLsp} style={styles.logoBox} />
          <View style={styles.headerText}>
            <Text style={styles.title1}>LSP BLK SURABAYA</Text>
            <Text style={styles.title2}>Lembaga Sertifikasi Profesi BLK Surabaya</Text>
            <Text style={styles.title3}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071, 8287532</Text>
            <Text style={styles.title3}>Email: lsp.blksurabaya@gmail.com</Text>
          </View>
          <View style={{ width: 70 }}></View> {/* Spacer agar teks tetap ditengah */}
        </View>
        <View style={styles.headerLineThin}></View>

        {/* --- KOTAK ISO KANAN ATAS --- */}
        <View style={styles.isoTable}>
          <View style={styles.isoRow}><Text style={styles.isoLabel}>No. Dokumen</Text><Text style={styles.isoColon}>:</Text><Text style={styles.isoValue}>{form?.noDokumen}</Text></View>
          <View style={styles.isoRow}><Text style={styles.isoLabel}>Edisi / Revisi</Text><Text style={styles.isoColon}>:</Text><Text style={styles.isoValue}>{form?.edisiRevisi}</Text></View>
          <View style={styles.isoRow}><Text style={styles.isoLabel}>Berlaku Sejak</Text><Text style={styles.isoColon}>:</Text><Text style={styles.isoValue}>{form?.tanggalBerlaku}</Text></View>
          <View style={styles.isoRowLast}><Text style={styles.isoLabel}>Halaman</Text><Text style={styles.isoColon}>:</Text><Text style={styles.isoValue}>{form?.halaman}</Text></View>
        </View>

        <View style={styles.suratTitleCenter}>
          <Text style={styles.suratTitleText}>SURAT TUGAS ASESOR KOMPETENSI</Text>
          <Text>NO. {form?.noSurat}</Text>
        </View>

        <Text style={styles.paragraf}>Yang bertanda tangan di bawah ini Ketua LSP BLK SURABAYA dengan ini memberi tugas kepada :</Text>
        
        {/* --- TABEL NAMA ASESOR --- */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHead, { width: '10%' }]}>No.</Text>
            <Text style={[styles.tableColHead, { width: '90%', borderRightWidth: 0 }]}>Nama dan Tugas</Text>
          </View>
          
          <View style={ujk?.asesor2 ? styles.tableRow : styles.tableRowLast}>
            <Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>01.</Text>
            <View style={[styles.tableCol, { width: '90%', borderRightWidth: 0 }]}>
              <Text style={styles.bold}>{ujk?.asesor1}</Text>
              <Text>No. Reg. {ujk?.noReg1 || '-'}</Text>
              <Text>Sebagai Asesor Kompetensi</Text>
            </View>
          </View>
          
          {ujk?.asesor2 && (
             <View style={styles.tableRowLast}>
               <Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>02.</Text>
               <View style={[styles.tableCol, { width: '90%', borderRightWidth: 0 }]}>
                 <Text style={styles.bold}>{ujk?.asesor2}</Text>
                 <Text>No. Reg. {ujk?.noReg2 || '-'}</Text>
                 <Text>Sebagai Asesor Kompetensi</Text>
               </View>
             </View>
          )}
        </View>

        <Text style={styles.paragraf}>Untuk melaksanakan Asesmen/Uji Kompetensi :</Text>
        
        <View style={{ marginBottom: 20 }}>
           <View style={styles.row}><Text style={styles.colLabel}>Bidang</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>{ujk?.bidang}</Text></View>
           <View style={styles.row}><Text style={styles.colLabel}>Skema Sertifikasi</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>{ujk?.skema}</Text></View>
           <View style={styles.row}><Text style={styles.colLabel}>Di Tempat Uji Kompetensi (TUK)</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>{ujk?.tuk}</Text></View>
           <View style={styles.row}><Text style={styles.colLabel}>Pada hari / tanggal</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>{ujk?.hari1} s/d {ujk?.hari2}</Text></View>
           <View style={styles.row}><Text style={styles.colLabel}>Pukul</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>{ujk?.waktu}</Text></View>
        </View>

        <Text style={styles.paragraf}>Demikian Surat Tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.</Text>

        {/* --- TANDA TANGAN & STEMPEL GAMBAR --- */}
        <View style={styles.ttdContainer}>
          <Text style={styles.ttdLocation}>Surabaya, {form?.tanggalSurat}</Text>
          <Text style={styles.ttdTitle}>Ketua</Text>
          <Text style={styles.ttdTitle}>LSP BLK SURABAYA</Text>
          
          <View style={styles.ttdSignContainer}>
             <Image src={ttdKetua} style={styles.ttdImage} />
          </View>
          
          <Text style={styles.ttdName}>BIBIET ANDRIYANTO JR, S.PD.T</Text>
        </View>

      </Page>
    </Document>
  );
};
export default SuratTugasPDF;