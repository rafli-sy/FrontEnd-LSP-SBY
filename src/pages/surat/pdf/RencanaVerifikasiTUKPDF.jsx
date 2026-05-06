import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 11, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  title: { textAlign: 'center', marginBottom: 20, fontSize: 14, fontFamily: 'Times-Bold' },
  
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  colLabel: { width: '25%' },
  colColon: { width: '3%' },
  colValue: { width: '72%' },

  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginVertical: 20 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  colCell: { borderRightWidth: 1, borderRightColor: '#000', padding: 6 },
  tHeadText: { textAlign: 'center', fontFamily: 'Times-Bold' },

  ttdContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, textAlign: 'center' },
  ttdBox: { width: '30%' },
});

const RencanaVerifikasiTUKPDF = ({ data }) => {
  const { ujk } = data;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>RENCANA VERIFIKASI TEMPAT UJI KOMPETENSI (TUK)</Text>

        <View style={styles.infoRow}><Text style={styles.colLabel}>Skema Sertifikasi</Text><Text style={styles.colColon}>:</Text>
          <View style={styles.colValue}>
            <Text>Judul :  <Text style={styles.bold}>{ujk?.skema}</Text></Text>
            <Text>Nomor :  ...................................................</Text>
          </View>
        </View>
        <View style={styles.infoRow}><Text style={styles.colLabel}>TUK</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>[   ] Sewaktu      [   ] Tempat Kerja      [   ] Mandiri</Text></View>
        <View style={styles.infoRow}><Text style={styles.colLabel}>Nama Asesor</Text><Text style={styles.colColon}>:</Text><Text style={[styles.colValue, styles.bold]}>{ujk?.asesor1}</Text></View>
        <View style={styles.infoRow}><Text style={styles.colLabel}>Tanggal</Text><Text style={styles.colColon}>:</Text><Text style={styles.colValue}>{ujk?.hari1}</Text></View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.bold}>Panduan:</Text>
          <Text style={{ marginLeft: 15 }}>1. Pilih Metode verifikasi dan tentukan perangkat asesmen / observasi.</Text>
          <Text style={{ marginLeft: 15 }}>2. Cocokkan standar dengan realita di TUK.</Text>
          <Text style={{ marginLeft: 15 }}>3. Berikan rekomendasi kelayakan TUK.</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tRow, { backgroundColor: '#f1f5f9', alignItems: 'center' }]}>
            <View style={[styles.colCell, { width: '8%' }]}><Text style={styles.tHeadText}>No</Text></View>
            <View style={[styles.colCell, { width: '40%' }]}><Text style={styles.tHeadText}>Bagian TUK</Text></View>
            <View style={[styles.colCell, { width: '27%' }]}><Text style={styles.tHeadText}>Verifikasi</Text></View>
            <View style={[styles.colCell, { width: '25%', borderRightWidth: 0 }]}><Text style={styles.tHeadText}>Keterangan</Text></View>
          </View>

          <View style={styles.tRow} wrap={false}>
            <View style={[styles.colCell, { width: '8%', textAlign: 'center' }]}><Text>1</Text></View>
            <View style={[styles.colCell, { width: '40%' }]}>
              <Text style={styles.bold}>Ruang TUK</Text>
              <Text>- Penerangan</Text><Text>- Sirkulasi udara</Text><Text>- Kebersihan & K3</Text><Text>- Kenyamanan</Text>
            </View>
            <View style={[styles.colCell, { width: '27%', alignItems: 'center', justifyContent: 'center' }]}><Text>[   ] Ya      [   ] Tidak</Text></View>
            <View style={[styles.colCell, { width: '25%', borderRightWidth: 0 }]}></View>
          </View>

          <View style={styles.tRow} wrap={false}>
            <View style={[styles.colCell, { width: '8%', textAlign: 'center' }]}><Text>2</Text></View>
            <View style={[styles.colCell, { width: '40%' }]}>
              <Text style={styles.bold}>Peralatan Utama</Text>
              <Text>- Ketersediaan fungsi</Text><Text>- Kalibrasi</Text><Text>- Keamanan</Text>
            </View>
            <View style={[styles.colCell, { width: '27%', alignItems: 'center', justifyContent: 'center' }]}><Text>[   ] Ya      [   ] Tidak</Text></View>
            <View style={[styles.colCell, { width: '25%', borderRightWidth: 0 }]}></View>
          </View>

          <View style={[styles.tRow, { borderBottomWidth: 0 }]} wrap={false}>
            <View style={[styles.colCell, { width: '8%', textAlign: 'center' }]}><Text>3</Text></View>
            <View style={[styles.colCell, { width: '40%' }]}>
              <Text style={styles.bold}>Bahan Uji</Text>
              <Text>- Ketersediaan sesuai</Text><Text>- Kualitas / Kadaluwarsa</Text>
            </View>
            <View style={[styles.colCell, { width: '27%', alignItems: 'center', justifyContent: 'center' }]}><Text>[   ] Ya      [   ] Tidak</Text></View>
            <View style={[styles.colCell, { width: '25%', borderRightWidth: 0 }]}></View>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.bold}>Rekomendasi Verifikator:</Text>
          <Text style={{ marginVertical: 5 }}>[   ] Layak   /   [   ] Tidak Layak sebagai TUK untuk skema terkait.</Text>
          <Text>Catatan: ..........................................................................................................................</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}><Text>Surabaya, {ujk?.hari1}</Text></View>
        
        <View style={styles.ttdContainer} wrap={false}>
          <View style={styles.ttdBox}>
            <Text style={styles.bold}>Verifikator TUK,</Text>
            <Text style={[styles.bold, { marginTop: 60 }]}>( {ujk?.asesor1} )</Text>
          </View>
          <View style={styles.ttdBox}>
            <Text style={styles.bold}>Manajer Sertifikasi LSP,</Text>
            <Text style={[styles.bold, { marginTop: 60 }]}>( ........................................ )</Text>
          </View>
          <View style={styles.ttdBox}>
            <Text style={styles.bold}>Kepala TUK,</Text>
            <Text style={[styles.bold, { marginTop: 60 }]}>( ........................................ )</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
export default RencanaVerifikasiTUKPDF;
