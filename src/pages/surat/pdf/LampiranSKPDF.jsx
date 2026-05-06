import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 10, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  row: { flexDirection: 'row', marginBottom: 2 },
  titleContainer: { textAlign: 'center', marginVertical: 15 },
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableColHead: { padding: 5, fontFamily: 'Times-Bold', textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
  tableCol: { padding: 5, borderRightWidth: 1, borderRightColor: '#000' },
  ttdContainer: { alignSelf: 'flex-end', width: '40%', textAlign: 'center', marginTop: 30 },
});

const LampiranSKPDF = ({ data }) => {
  const { ujk } = data;
  const tahun = ujk?.hari1?.slice(-4) || '2026';
  const daftarAsesi = ["Andika Yogi Saputra", "Ata Wijayati", "Dian Rahayu Saputri", "Dwi Ayu Ningrum", "Rita Wulandari", "Rizky Hasanah", "Sindi Devita Maharani", "Sumi Herni"];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}><Text style={{width: '15%'}}>Lampiran</Text><Text style={{width: '3%'}}>:</Text><Text>Keputusan Ketua LSP BLK SURABAYA</Text></View>
        <View style={styles.row}><Text style={{width: '15%'}}>Nomor</Text><Text style={{width: '3%'}}>:</Text><Text>000.0C/LSP BLK-SBY/II/{tahun}</Text></View>
        <View style={styles.row}><Text style={{width: '15%'}}>Tanggal</Text><Text style={{width: '3%'}}>:</Text><Text>03 Februari {tahun}</Text></View>

        <View style={styles.titleContainer}>
          <Text style={styles.bold}>TIM PELAKSANAAN UJI KOMPETENSI UNTUK SKEMA {ujk?.skema}</Text>
          <Text style={styles.bold}>DI {ujk?.tuk} TAHUN {tahun}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHead, { width: '10%' }]}>No</Text>
            <Text style={[styles.tableColHead, { width: '45%' }]}>Nama</Text>
            <Text style={[styles.tableColHead, { width: '45%', borderRightWidth: 0 }]}>Jabatan Dalam Organisasi</Text>
          </View>

          {/* TIM PELAKSANA */}
          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center', fontFamily: 'Times-Bold' }]}>I.</Text><Text style={[styles.tableCol, { width: '45%', fontFamily: 'Times-Bold' }]}>Penanggung Jawab</Text><Text style={[styles.tableCol, { width: '45%', borderRightWidth: 0 }]}></Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>1.</Text><Text style={[styles.tableCol, { width: '45%' }]}>Miftahul Huda, S.T., M.Pd.</Text><Text style={[styles.tableCol, { width: '45%', textAlign: 'center', borderRightWidth: 0 }]}>Ketua</Text></View>
          
          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center', fontFamily: 'Times-Bold' }]}>II.</Text><Text style={[styles.tableCol, { width: '45%', fontFamily: 'Times-Bold' }]}>Penyelia</Text><Text style={[styles.tableCol, { width: '45%', borderRightWidth: 0 }]}></Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>1.</Text><Text style={[styles.tableCol, { width: '45%' }]}>{ujk?.penyelia}</Text><Text style={[styles.tableCol, { width: '45%', textAlign: 'center', borderRightWidth: 0 }]}>Manajer Data & Informasi</Text></View>

          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center', fontFamily: 'Times-Bold' }]}>III.</Text><Text style={[styles.tableCol, { width: '45%', fontFamily: 'Times-Bold' }]}>Pengadministrasi Uji</Text><Text style={[styles.tableCol, { width: '45%', borderRightWidth: 0 }]}></Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>1.</Text><Text style={[styles.tableCol, { width: '45%' }]}>Ramadhan Budi Prasetyo</Text><Text style={[styles.tableCol, { width: '45%', textAlign: 'center', borderRightWidth: 0 }]}>Staf Administrasi Sertifikasi</Text></View>

          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center', fontFamily: 'Times-Bold' }]}>IV.</Text><Text style={[styles.tableCol, { width: '45%', fontFamily: 'Times-Bold' }]}>Asesor Kompetensi</Text><Text style={[styles.tableCol, { width: '45%', borderRightWidth: 0 }]}></Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>1.</Text><Text style={[styles.tableCol, { width: '45%' }]}>{ujk?.asesor1}</Text><Text style={[styles.tableCol, { width: '45%', textAlign: 'center', borderRightWidth: 0 }]}>Asesor</Text></View>
          {ujk?.asesor2 && <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>2.</Text><Text style={[styles.tableCol, { width: '45%' }]}>{ujk?.asesor2}</Text><Text style={[styles.tableCol, { width: '45%', textAlign: 'center', borderRightWidth: 0 }]}>Asesor</Text></View>}

          <View style={styles.tableRow}><Text style={[styles.tableCol, { width: '10%', textAlign: 'center', fontFamily: 'Times-Bold' }]}>V.</Text><Text style={[styles.tableCol, { width: '45%', fontFamily: 'Times-Bold' }]}>Peserta Uji</Text><Text style={[styles.tableCol, { width: '45%', borderRightWidth: 0 }]}></Text></View>
          {daftarAsesi.map((nama, idx) => (
            <View style={[styles.tableRow, idx === daftarAsesi.length - 1 && { borderBottomWidth: 0 }]} key={idx} wrap={false}>
              <Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>{idx + 1}.</Text>
              <Text style={[styles.tableCol, { width: '45%' }]}>{nama}</Text>
              <Text style={[styles.tableCol, { width: '45%', textAlign: 'center', borderRightWidth: 0 }]}>Asesi</Text>
            </View>
          ))}
        </View>

        <View style={styles.ttdContainer} wrap={false}>
          <Text>Dikeluarkan di : Surabaya</Text>
          <Text>Pada tanggal : 03 Februari {tahun}</Text>
          <Text style={[styles.bold, { marginTop: 15 }]}>KETUA LSP BLK SURABAYA</Text>
          <Text style={[styles.bold, { marginTop: 60, textDecoration: 'underline' }]}>BIBIET ANDRIYANTO JR, S.Pd.T</Text>
        </View>

      </Page>
    </Document>
  );
};
export default LampiranSKPDF;