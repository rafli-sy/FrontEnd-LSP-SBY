import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 11, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  headerLine: { borderBottomWidth: 3, paddingBottom: 10, marginBottom: 2 },
  headerLineThin: { borderBottomWidth: 1, marginBottom: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoBox: { width: 60, height: 60, backgroundColor: '#e2e8f0' },
  headerText: { textAlign: 'center', flex: 1, paddingHorizontal: 15 },
  title1: { fontSize: 18, fontFamily: 'Times-Bold', letterSpacing: 1 },
  title2: { fontSize: 12, marginTop: 4 },
  title3: { fontSize: 9, marginTop: 2 },
  centerTitle: { textAlign: 'center', marginBottom: 20 },
  paragraf: { textAlign: 'justify', marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 4 },
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableColHead: { padding: 6, fontFamily: 'Times-Bold', textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
  tableCol: { padding: 6, borderRightWidth: 1, borderRightColor: '#000', fontSize: 10 },
  ttdContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  ttdBox: { width: '40%' },
});

const BABaruPDF = ({ data }) => {
  const { ujk } = data;
  const daftarAsesi = [
    "Andika Yogi Saputra", "Ata Wijayati", "Dian Rahayu Saputri", "Dwi Ayu Ningrum", 
    "Rita Wulandari", "Rizky Hasanah", "Sindi Devita Maharani", "Sumi Herni",
    "Indri Puspitasari", "Marista Yekti Octa Angraini", "Mochamad Solikin", "Nasriani",
    "Taufiqul Aziz", "Vanisa Rani Astridila", "Winda Putri Salwa", "Yuli Astutik"
  ];
  
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
          <Text style={[styles.bold, {fontSize: 13}]}>BERITA ACARA ASESMEN / UJI KOMPETENSI</Text>
          <Text style={[styles.bold, {fontSize: 13}]}>PELAKSANAAN SERTIFIKASI TAHUN 2026</Text>
          <Text style={[styles.bold, {fontSize: 13}]}>LSP BLK SURABAYA</Text>
        </View>

        <Text style={styles.paragraf}>
          Pada hari ini tanggal <Text style={styles.bold}>{ujk?.hari1}</Text>, bertempat di <Text style={styles.bold}>{ujk?.tuk}</Text> telah dilakukan Uji Kompetensi Skema <Text style={styles.bold}>{ujk?.skema}</Text> yang diikuti sebanyak <Text style={styles.bold}>{daftarAsesi.length}</Text> peserta dengan penjelasan sebagai berikut :
        </Text>

        <View style={{ marginBottom: 15 }}>
          <Text style={[styles.bold, { marginBottom: 5 }]}>Asesor :</Text>
          <View style={styles.row}><Text style={{ width: '5%' }}>1.</Text><Text style={{ width: '45%' }}>{ujk?.asesor1}</Text><Text style={{ width: '50%' }}>No. Reg. Sertifikat:   {ujk?.noReg1}</Text></View>
          {ujk?.asesor2 && (
            <View style={styles.row}><Text style={{ width: '5%' }}>2.</Text><Text style={{ width: '45%' }}>{ujk?.asesor2}</Text><Text style={{ width: '50%' }}>No. Reg. Sertifikat:   {ujk?.noReg2}</Text></View>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHead, { width: '10%' }]}>No</Text>
            <Text style={[styles.tableColHead, { width: '40%' }]}>Nama Asesi</Text>
            <Text style={[styles.tableColHead, { width: '25%' }]}>Organisasi</Text>
            <Text style={[styles.tableColHead, { width: '25%', borderRightWidth: 0 }]}>Hasil (K/BK)</Text>
          </View>
          {daftarAsesi.map((nama, index) => (
            <View style={[styles.tableRow, index === daftarAsesi.length - 1 && { borderBottomWidth: 0 }]} key={index} wrap={false}>
              <Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>{index + 1}</Text>
              <Text style={[styles.tableCol, { width: '40%' }]}>{nama}</Text>
              <Text style={[styles.tableCol, { width: '25%', textAlign: 'center' }]}>UPT BLK</Text>
              <Text style={[styles.tableCol, { width: '25%', borderRightWidth: 0 }]}></Text>
            </View>
          ))}
        </View>

        <Text style={styles.paragraf}>Demikian berita acara Asesmen /uji kompetensi dibuat untuk sebagai pengambil keputusan oleh tim Asesor LSP BLK Surabaya</Text>

        <View style={{ alignItems: 'flex-end', marginBottom: 10 }}><Text>Surabaya, {ujk?.hari2?.split(', ')[1] || ujk?.hari1}</Text></View>
        <Text style={styles.bold}>Asesor Kompetensi :</Text>
        <View style={styles.ttdContainer} wrap={false}>
          <View style={styles.ttdBox}><Text>1. {ujk?.asesor1}</Text><Text style={{ marginTop: 40 }}>1. ........................................</Text></View>
          <View style={styles.ttdBox}><Text>2. {ujk?.asesor2}</Text><Text style={{ marginTop: 40 }}>2. ........................................</Text></View>
        </View>
      </Page>
    </Document>
  );
};
export default BABaruPDF;