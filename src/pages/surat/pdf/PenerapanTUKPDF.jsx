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
  row: { flexDirection: 'row', marginBottom: 6 },
  col1: { width: '22%' },
  col2: { width: '3%', textAlign: 'center' },
  col3: { width: '75%', textAlign: 'justify' },
  ttdContainer: { alignSelf: 'flex-end', width: '40%', textAlign: 'center', marginTop: 40 },
});

const PenerapanTUKPDF = ({ data }) => {
  const { ujk } = data;
  const tahun = ujk?.hari1?.slice(-4) || '2026';
  const namaTUKBersih = ujk?.tuk?.replace('TUK Sewaktu ', '');
  
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
          <Text style={styles.bold}>SURAT KEPUTUSAN</Text>
          <Text style={styles.bold}>KETUA LEMBAGA SERTIFIKASI PROFESI (LSP) BLK SURABAYA</Text>
          <Text style={styles.bold}>Nomor : 000.0/Ver-TUK/LSP BLK-SBY/II/{tahun}</Text>
          <Text style={[styles.bold, { marginTop: 15 }]}>TENTANG</Text>
          <Text style={styles.bold}>PENETAPAN TUK TERVERIFIKASI</Text>
        </View>

        <View style={styles.row}><Text style={styles.col1}>Menimbang</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>Pentingnya keberadaan TUK terverifikasi sebagai persyaratan dilangsungkannya uji kompetensi oleh LSP</Text></View>
        <View style={styles.row}><Text style={styles.col1}>Mengingat</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>PBNSP 206 tentang Pembentukan TUK</Text></View>
        <View style={styles.row}><Text style={styles.col1}>Memperhatikan</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>Berita Acara Verifikasi Tempat Uji Kompetensi {ujk?.bidang} {namaTUKBersih} , tertanggal 03 Februari {tahun}</Text></View>

        <View style={[styles.centerTitle, { marginTop: 20 }]}><Text style={styles.bold}>MEMUTUSKAN</Text></View>

        <Text style={{ marginBottom: 10 }}>MENETAPKAN :</Text>

        <View style={{ marginLeft: 30, marginBottom: 15 }}>
          <View style={styles.row}><Text style={{width: '25%'}}>Nama TUK</Text><Text style={styles.col2}>:</Text><Text style={styles.bold}>{namaTUKBersih}</Text></View>
          <View style={styles.row}><Text style={{width: '25%'}}>Alamat</Text><Text style={styles.col2}>:</Text><Text>Jl. Raya TUK Terdaftar (Sesuai Alamat {namaTUKBersih})</Text></View>
          <View style={styles.row}><Text style={{width: '25%'}}>Tipe TUK</Text><Text style={styles.col2}>:</Text><Text>{ujk?.tuk?.includes('Sewaktu') ? 'Sewaktu' : 'Mandiri'}</Text></View>
          <View style={styles.row}><Text style={{width: '25%'}}>Masa Berlaku</Text><Text style={styles.col2}>:</Text><Text>{ujk?.hari1} s/d {ujk?.hari2}</Text></View>
        </View>

        <Text style={{ textAlign: 'justify' }}>sebagai TUK Terverifikasi dan dapat digunakan sebagai Tempat Uji Kompetensi, untuk skema sertifikasi <Text style={styles.bold}>{ujk?.skema}</Text>.</Text>

        <View style={styles.ttdContainer} wrap={false}>
          <Text>Surabaya, 03 Februari {tahun}</Text>
          <Text style={styles.bold}>Ketua LSP BLK SURABAYA</Text>
          <Text style={[styles.bold, { marginTop: 60, textDecoration: 'underline' }]}>BIBIET ANDRIYANTO JR, S.Pd.T</Text>
        </View>

      </Page>
    </Document>
  );
};
export default PenerapanTUKPDF;