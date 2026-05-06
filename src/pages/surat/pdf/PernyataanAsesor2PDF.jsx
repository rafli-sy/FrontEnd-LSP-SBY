import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 11, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  isoTable: { flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 40 },
  isoLogoBox: { width: '18%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, alignItems: 'center', justifyContent: 'center' },
  isoTitleBox: { width: '47%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  isoInfoBox: { width: '35%' },
  isoInfoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  isoLabel: { width: '40%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', fontSize: 8 },
  isoValue: { width: '60%', padding: 4, fontSize: 8 },
  
  centerTitle: { textAlign: 'center', marginBottom: 30, fontSize: 14, fontFamily: 'Times-Bold', textDecoration: 'underline' },
  paragraf: { textAlign: 'justify', marginBottom: 20 },
  row: { flexDirection: 'row', marginBottom: 6 },
  col1: { width: '30%' },
  col2: { width: '5%', textAlign: 'center' },
  col3: { width: '65%' },
  ttdContainer: { marginTop: 40 },
});

const PernyataanAsesor2PDF = ({ data }) => {
  const { ujk } = data;
  
  // Jika tidak ada asesor 2
  if (!ujk?.asesor2) {
    return (
      <Document>
        <Page size="A4" style={[styles.page, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: '#64748b' }}>Pengajuan UJK ini hanya menggunakan 1 Asesor.</Text>
          <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>Dokumen ini tidak perlu dicetak.</Text>
        </Page>
      </Document>
    );
  }

  const tahun = ujk?.hari1?.slice(-4) || '2026';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.isoTable}>
          <View style={styles.isoLogoBox}><Text>LOGO LSP</Text></View>
          <View style={styles.isoTitleBox}>
            <Text style={[styles.bold, { fontSize: 12 }]}>LSP BLK SURABAYA</Text>
            <Text style={[styles.bold, { fontSize: 14 }]}>PERNYATAAN KERAHASIAAN</Text>
          </View>
          <View style={styles.isoInfoBox}>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>NO. DOKUMEN</Text><Text style={styles.isoValue}>: FR-SER-01.3 LSP BLK-SBY</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>EDISI/REVISI</Text><Text style={styles.isoValue}>: 01/00</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>TANGGAL BERLAKU</Text><Text style={styles.isoValue}>: 10 Nov 2015</Text></View>
            <View style={[styles.isoInfoRow, { borderBottomWidth: 0 }]}><Text style={styles.isoLabel}>HALAMAN</Text><Text style={styles.isoValue}>: 1 dari 1</Text></View>
          </View>
        </View>

        <Text style={styles.centerTitle}>PERNYATAAN KERAHASIAAN</Text>

        <Text style={{ marginBottom: 15 }}>Saya yang bertanda tangan dibawah ini :</Text>

        <View style={{ marginLeft: 30, marginBottom: 20 }}>
          <View style={styles.row}><Text style={styles.col1}>Nama Asesor</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>{ujk.asesor2}</Text></View>
          <View style={styles.row}><Text style={styles.col1}>No. Reg</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>{ujk.noReg2}</Text></View>
          <View style={styles.row}><Text style={styles.col1}>Kompetensi Bidang</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>{ujk.bidang}</Text></View>
          <View style={styles.row}><Text style={styles.col1}>Alamat</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>Jl. Mayang No 4-A</Text></View>
          <View style={styles.row}><Text style={styles.col1}>No. HP</Text><Text style={styles.col2}>:</Text><Text style={styles.col3}>082242110052</Text></View>
        </View>

        <Text style={styles.paragraf}>
          Sehubungan tugas saya sebagai Asesor Kompetensi di LSP BLK SURABAYA, dengan ini saya menyatakan dengan sesungguhnya bahwa saya akan memegang teguh KERAHASIAAN hasil asesmen /uji kompetensi yang dilaksanakan oleh LSP BLK SURABAYA, kecuali kepada pihak yang berwenang dan terkait atas seizin Ketua LSP BLK SURABAYA .
        </Text>
        <Text style={styles.paragraf}>
          Apabila saya lalai melaksanakan ini, maka saya bersedia bertanggung jawab dan menerima sanksi sesuai dengan ketentuan yang telah ditetapkan oleh LSP BLK SURABAYA .
        </Text>
        <Text style={styles.paragraf}>
          Demikian pernyataan ini saya buat dengan sesungguhnya dan tanpa tekanan apapun.
        </Text>

        <View style={styles.ttdContainer} wrap={false}>
          <Text>Surabaya, 03 Februari {tahun}</Text>
          <Text>Asesor Kompetensi,</Text>
          <Text style={[styles.bold, { marginTop: 60, textDecoration: 'underline' }]}>{ujk.asesor2}</Text>
        </View>

      </Page>
    </Document>
  );
};
export default PernyataanAsesor2PDF;