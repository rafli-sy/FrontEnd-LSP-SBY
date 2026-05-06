import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 10, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  headerLine: { borderBottomWidth: 3, paddingBottom: 10, marginBottom: 2 },
  headerLineThin: { borderBottomWidth: 1, marginBottom: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoBox: { width: 60, height: 60, backgroundColor: '#e2e8f0' },
  headerText: { textAlign: 'center', flex: 1, paddingHorizontal: 15 },
  title1: { fontSize: 18, fontFamily: 'Times-Bold', letterSpacing: 1 },
  title2: { fontSize: 12, marginTop: 4 },
  title3: { fontSize: 9, marginTop: 2 },
  centerTitle: { textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 4 },
  col1: { width: '18%' },
  col2: { width: '2%', textAlign: 'center' },
  col3: { width: '5%' },
  col4: { width: '75%', textAlign: 'justify' },
  ttdContainer: { alignSelf: 'flex-end', width: '40%', textAlign: 'center', marginTop: 30 },
});

const SKPenyelenggaraPDF = ({ data }) => {
  const { ujk } = data;
  const tahun = ujk?.hari1?.slice(-4) || '2026';
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerLine}>
          <View style={styles.headerContent}>
            <View style={styles.logoBox}></View>
            <View style={styles.headerText}>
              <Text style={styles.title1}>LSP BLK SURABAYA</Text>
              <Text style={styles.title2}>Lembaga Sertifikasi Profesi BLK Surabaya</Text>
              <Text style={styles.title3}>Jl Dukuh Menanggal III/29 Gayungan Surabaya Telp /fax 8290071</Text>
            </View>
            <View style={styles.logoBox}></View>
          </View>
        </View>
        <View style={styles.headerLineThin}></View>

        <View style={styles.centerTitle}>
          <Text>KEPUTUSAN KETUA LSP BLK SURABAYA</Text>
          <Text>NOMOR : 000.0C/LSP BLK-SBY/II/{tahun}</Text>
          <Text style={{ marginTop: 10 }}>TENTANG</Text>
          <Text style={[styles.bold, { textTransform: 'uppercase' }]}>PELAKSANAAN UJI KOMPETENSI UNTUK SKEMA {ujk?.skema} DI {ujk?.tuk} TAHUN {tahun}</Text>
          <Text style={[styles.bold, { marginTop: 10 }]}>KETUA LSP BLK SURABAYA</Text>
        </View>

        <View style={styles.row}><Text style={styles.col1}>Menimbang</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>a.</Text><Text style={styles.col4}>bahwa dalam rangka meningkatkan pengakuan tenaga kerja Indonesia pada dunia usaha/industri bidang/sektor {ujk?.bidang}, maka perlu diadakan uji kompetensi untuk Skema {ujk?.skema} di {ujk?.tuk}</Text></View>
        <View style={styles.row}><Text style={styles.col1}></Text><Text style={styles.col2}></Text><Text style={styles.col3}>b.</Text><Text style={styles.col4}>bahwa untuk itu perlu ditetapkan dengan Surat Keputusan Ketua LSP BLK SURABAYA</Text></View>
        
        <View style={[styles.row, {marginTop: 5}]}><Text style={styles.col1}>Mengingat</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>1.</Text><Text style={styles.col4}>Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan</Text></View>
        <View style={styles.row}><Text style={styles.col1}></Text><Text style={styles.col2}></Text><Text style={styles.col3}>2.</Text><Text style={styles.col4}>Peraturan Pemerintah Nomor: 10 Tahun 2018 tentang Badan Nasional Sertifikasi Profesi</Text></View>
        <View style={styles.row}><Text style={styles.col1}></Text><Text style={styles.col2}></Text><Text style={styles.col3}>3.</Text><Text style={styles.col4}>Surat Keputusan BNSP No. KEP.1194/BNSP/XI/2018 tentang Lisensi kepada Lembaga Sertifikasi Profesi BLK SURABAYA</Text></View>

        <View style={[styles.row, {marginTop: 5}]}><Text style={styles.col1}>Memperhatikan</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>1.</Text><Text style={styles.col4}>Surat Ketua {ujk?.tuk} tanggal 03 Februari {tahun}, tentang Kesanggupan sebagai tempat pelaksanaan uji kompetensi Skema Sertifikasi {ujk?.skema}</Text></View>

        <View style={[styles.centerTitle, { marginTop: 15 }]}><Text style={styles.bold}>Memutuskan</Text></View>

        <View style={styles.row}><Text style={styles.col1}>Menetapkan</Text><Text style={styles.col2}>:</Text><Text style={[styles.col4, {width: '80%'}]}>Tim Pelaksana yang terdiri dari Penanggungjawab, Penyelia, Pengadministrasi, Asesor Kompetensi dan Peserta Uji, pada kegiatan Pelaksanaan Uji Kompetensi untuk Skema {ujk?.skema} di {ujk?.tuk} Tahun {tahun}</Text></View>
        
        <View style={[styles.row, {marginTop: 5}]}><Text style={styles.col1}>Kesatu</Text><Text style={styles.col2}>:</Text><Text style={[styles.col4, {width: '80%'}]}>Menunjuk personal Tim Pelaksana yang namanya tercantum dalam lampiran keputusan ini sebagai Penanggungjawab, Penyelia, Pengadministrasi, Asesor Kompetensi dan Peserta Uji Kompetensi</Text></View>

        <View style={styles.ttdContainer} wrap={false}>
          <Text>Dikeluarkan di : Surabaya</Text>
          <Text>Pada tanggal : 03 Februari {tahun}</Text>
          <Text style={[styles.bold, { marginTop: 15 }]}>LSP BLK SURABAYA</Text>
          <Text style={[styles.bold, { marginTop: 60, textDecoration: 'underline' }]}>BIBIET ANDRIYANTO JR, S.Pd.T</Text>
        </View>

      </Page>
    </Document>
  );
};
export default SKPenyelenggaraPDF;