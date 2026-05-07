import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 10, fontFamily: 'Times-Roman', lineHeight: 1.4 },
  bold: { fontFamily: 'Times-Bold' },
  isoTable: { flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 15 },
  isoLogoBox: { width: '18%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, alignItems: 'center', justifyContent: 'center' },
  isoTitleBox: { width: '47%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  isoInfoBox: { width: '35%' },
  isoInfoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  isoLabel: { width: '40%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', fontSize: 8 },
  isoValue: { width: '60%', padding: 4, fontSize: 8 },
  
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 15 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  colCell: { borderRightWidth: 1, borderRightColor: '#000' },
  tHeadText: { padding: 6, textAlign: 'center', fontFamily: 'Times-Bold' },
  tCellText: { padding: 6 },
  
  ttdContainer: { width: '100%', borderWidth: 1, borderColor: '#000', marginTop: 10 },
  ttdHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
});

const TandaTerimaDokumenPDF = ({ data }) => {
  const { ujk } = data;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.isoTable}>
          <View style={styles.isoLogoBox}><Text>LOGO LSP</Text></View>
          <View style={styles.isoTitleBox}>
            <Text style={[styles.bold, { fontSize: 12 }]}>LSP BLK SURABAYA</Text>
            <Text style={[styles.bold, { fontSize: 14 }]}>FORMULIR TANDA TERIMA DOKUMEN</Text>
          </View>
          <View style={styles.isoInfoBox}>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>NO. DOKUMEN</Text><Text style={styles.isoValue}>: FR-SER-01.3 LSP BLK-SBY</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>EDISI/REVISI</Text><Text style={styles.isoValue}>: 01/00</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>TANGGAL BERLAKU</Text><Text style={styles.isoValue}>: 10 Nov 2015</Text></View>
            <View style={[styles.isoInfoRow, { borderBottomWidth: 0 }]}><Text style={styles.isoLabel}>HALAMAN</Text><Text style={styles.isoValue}>: 1 dari 1</Text></View>
          </View>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.bold}>DITERIMA DARI :</Text>
          <Text style={styles.bold}>LSP BLK SURABAYA</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tRow, { backgroundColor: '#f1f5f9' }]}>
            <View style={[styles.colCell, { width: '10%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>NO</Text></View>
            <View style={[styles.colCell, { width: '25%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>JUMLAH/UNIT</Text></View>
            <View style={[{ width: '65%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>KETERANGAN</Text></View>
          </View>

          <View style={styles.tRow}><View style={[styles.colCell, { width: '10%' }]}><Text style={[styles.tCellText, {textAlign: 'center'}]}>1</Text></View><View style={[styles.colCell, { width: '25%' }]}><Text style={styles.tCellText}>1 (satu) lembar</Text></View><View style={{ width: '65%' }}><Text style={styles.tCellText}>Surat Tugas</Text></View></View>
          <View style={styles.tRow}><View style={[styles.colCell, { width: '10%' }]}><Text style={[styles.tCellText, {textAlign: 'center'}]}>2</Text></View><View style={[styles.colCell, { width: '25%' }]}><Text style={styles.tCellText}>1 (satu) set</Text></View><View style={{ width: '65%' }}><Text style={styles.tCellText}>Daftar Hadir Peserta Uji Kompetensi</Text></View></View>
          <View style={styles.tRow}><View style={[styles.colCell, { width: '10%' }]}><Text style={[styles.tCellText, {textAlign: 'center'}]}>3</Text></View><View style={[styles.colCell, { width: '25%' }]}><Text style={styles.tCellText}>1 (satu) set</Text></View><View style={{ width: '65%' }}><Text style={styles.tCellText}>Lembar Pelaksanaan Asesmen</Text></View></View>
          <View style={styles.tRow}><View style={[styles.colCell, { width: '10%' }]}><Text style={[styles.tCellText, {textAlign: 'center'}]}>4</Text></View><View style={[styles.colCell, { width: '25%' }]}><Text style={styles.tCellText}>1 (satu) lembar</Text></View><View style={{ width: '65%' }}><Text style={styles.tCellText}>Berita Acara Asesmen / Uji Kompetensi</Text></View></View>
          
          <View style={styles.tRow}>
            <View style={[styles.colCell, { width: '10%' }]}><Text style={[styles.tCellText, {textAlign: 'center'}]}>5</Text></View>
            <View style={[styles.colCell, { width: '25%' }]}><Text style={styles.tCellText}>............set</Text></View>
            <View style={{ width: '65%', flexDirection: 'row' }}>
              <View style={{ width: '20%' }}><Text style={styles.tCellText}>MUK :</Text></View>
              <View style={{ width: '80%', padding: 6 }}>
                <Text>{ujk?.skema}</Text>
                <Text style={{ fontStyle: 'italic', fontSize: 8, marginTop: 5 }}>beri tanda x yang diujikan</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
          <Text style={{ width: '30%' }}>Tanggal Diserah terimakan</Text>
          <Text style={{ width: '5%' }}>:</Text>
          <Text style={styles.bold}>{ujk?.hari1}</Text>
        </View>

        <View style={styles.ttdContainer} wrap={false}>
          <View style={styles.ttdHeaderRow}>
            <View style={[styles.colCell, { width: '65%', padding: 5 }]}><Text style={[styles.bold, {textAlign: 'center'}]}>DITERIMA OLEH</Text></View>
            <View style={[{ width: '35%', padding: 5 }]}><Text style={[styles.bold, {textAlign: 'center'}]}>DISERAHKAN OLEH</Text></View>
          </View>
          <View style={{ flexDirection: 'row' }}>
             <View style={[styles.colCell, { width: '32.5%', padding: 5 }]}>
                <Text style={{ textAlign: 'center' }}>Asesor 1</Text>
                <Text style={{ marginTop: 60, textAlign: 'center', fontFamily: 'Times-Bold' }}>{ujk?.asesor1}</Text>
             </View>
             <View style={[styles.colCell, { width: '32.5%', padding: 5 }]}>
                <Text style={{ textAlign: 'center' }}>Asesor 2</Text>
                <Text style={{ marginTop: 60, textAlign: 'center', fontFamily: 'Times-Bold' }}>{ujk?.asesor2 || '-'}</Text>
             </View>
             <View style={{ width: '35%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginTop: 60, textAlign: 'center', fontFamily: 'Times-Bold' }}>{ujk?.penyelia}</Text>
             </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default TandaTerimaDokumenPDF;