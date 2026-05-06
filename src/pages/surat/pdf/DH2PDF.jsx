import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '15mm', fontSize: 9, fontFamily: 'Times-Roman', lineHeight: 1.3 },
  bold: { fontFamily: 'Times-Bold' },
  isoTable: { flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 10 },
  isoLogoBox: { width: '15%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, alignItems: 'center', justifyContent: 'center' },
  isoTitleBox: { width: '50%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  isoInfoBox: { width: '35%' },
  isoInfoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  isoLabel: { width: '40%', padding: 4, borderRightWidth: 1, borderRightColor: '#000' },
  isoValue: { width: '60%', padding: 4 },
  infoTable: { width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 10 },
  infoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  infoCellHeader: { width: '25%', padding: 4, borderRightWidth: 1, borderRightColor: '#000' },
  infoCellData: { width: '25%', padding: 4, borderRightWidth: 1, borderRightColor: '#000' },
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 15 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  colCell: { borderRightWidth: 1, borderRightColor: '#000' },
  tHeadText: { padding: 4, textAlign: 'center', fontFamily: 'Times-Bold', fontSize: 8 },
  tCellText: { padding: 4, height: 20, justifyContent: 'center' },
  ttdContainer: { width: '100%', borderWidth: 1, borderColor: '#000', marginTop: 10 },
  ttdHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', backgroundColor: '#f1f5f9' },
});

const DH2PDF = ({ data }) => {
  const { ujk } = data;
  const daftarAsesi = ["Indri Puspitasari", "Marista Yekti Octa Angraini", "Mochamad Solikin", "Nasriani", "Taufiqul Aziz", "Vanisa Rani Astridila", "Winda Putri Salwa", "Yuli Astutik"];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.isoTable}>
          <View style={styles.isoLogoBox}><Text>LOGO LSP</Text></View>
          <View style={styles.isoTitleBox}>
            <Text style={[styles.bold, { fontSize: 12 }]}>LSP BLK SURABAYA</Text>
            <Text style={[styles.bold, { fontSize: 14 }]}>FORMULIR DAFTAR HADIR ASESMEN (HARI 2)</Text>
          </View>
          <View style={styles.isoInfoBox}>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>No. Dokumen</Text><Text style={styles.isoValue}>: FR-SER-01.2 LSP BLK-SBY</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>Edisi/Revisi</Text><Text style={styles.isoValue}>: 01/00</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>Tanggal Berlaku</Text><Text style={styles.isoValue}>: 10 Nov 2015</Text></View>
            <View style={[styles.isoInfoRow, { borderBottomWidth: 0 }]}><Text style={styles.isoLabel}>Halaman</Text><Text style={styles.isoValue}>: 1 dari 1</Text></View>
          </View>
        </View>

        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
             <Text style={styles.infoCellHeader}>TUK</Text><Text style={styles.infoCellData}>{ujk?.tuk}</Text>
             <Text style={styles.infoCellHeader}>GROUP / JUMLAH</Text><Text style={[styles.infoCellData, {borderRightWidth: 0}]}>1 Kelas / {daftarAsesi.length} Peserta</Text>
          </View>
          <View style={styles.infoRow}>
             <Text style={styles.infoCellHeader}>HARI / TANGGAL</Text><Text style={styles.infoCellData}>{ujk?.hari2}</Text>
             <Text style={styles.infoCellHeader}>SKEMA</Text><Text style={[styles.infoCellData, {borderRightWidth: 0}]}>{ujk?.skema}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
             <Text style={styles.infoCellHeader}>PROFESI</Text><Text style={[styles.infoCellData, {width: '75%', borderRightWidth: 0}]}>Operator {ujk?.bidang}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tRow, { backgroundColor: '#f1f5f9' }]}>
            <View style={[styles.colCell, { width: '5%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>No</Text></View>
            <View style={[styles.colCell, { width: '25%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>Nama Peserta</Text></View>
            <View style={[styles.colCell, { width: '20%' }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000' }}><Text style={styles.tHeadText}>Pendidikan</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '25%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>SD</Text></View>
                <View style={{ width: '25%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>SMP</Text></View>
                <View style={{ width: '25%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>SMA</Text></View>
                <View style={{ width: '25%' }}><Text style={styles.tHeadText}>D3/S1</Text></View>
              </View>
            </View>
            <View style={[styles.colCell, { width: '20%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>Tanda Tangan</Text></View>
            <View style={[{ width: '30%' }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000' }}><Text style={styles.tHeadText}>Uji Kompetensi</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>Murni</Text></View>
                <View style={{ width: '50%' }}><Text style={styles.tHeadText}>Ulang</Text></View>
              </View>
            </View>
          </View>

          {daftarAsesi.map((nama, i) => {
            const isOdd = i % 2 !== 0;
            return (
            <View style={[styles.tRow, i === daftarAsesi.length - 1 && { borderBottomWidth: 0 }]} key={i} wrap={false}>
              <View style={[styles.colCell, { width: '5%' }]}><Text style={[styles.tCellText, {textAlign: 'center'}]}>{i + 1}</Text></View>
              <View style={[styles.colCell, { width: '25%' }]}><Text style={[styles.tCellText, {paddingLeft: 5}]}>{nama}</Text></View>
              <View style={[styles.colCell, { width: '5%' }]}></View><View style={[styles.colCell, { width: '5%' }]}></View><View style={[styles.colCell, { width: '5%' }]}></View><View style={[styles.colCell, { width: '5%' }]}></View>
              <View style={[styles.colCell, { width: '10%', borderRightWidth: 0 }]}><Text style={styles.tCellText}>{!isOdd ? `${i + 1}.` : ''}</Text></View>
              <View style={[styles.colCell, { width: '10%' }]}><Text style={styles.tCellText}>{isOdd ? `      ${i + 1}.` : ''}</Text></View>
              <View style={[styles.colCell, { width: '15%' }]}></View><View style={{ width: '15%' }}></View>
            </View>
          )})}
        </View>

        <View style={{ alignItems: 'flex-end', marginBottom: 5 }}><Text>Tanggal: {ujk?.hari2}</Text></View>
        <View style={styles.ttdContainer} wrap={false}>
          <View style={styles.ttdHeaderRow}>
            <View style={[styles.colCell, { width: '35%', padding: 5 }]}><Text style={styles.bold}>DIKETAHUI PENYELIA</Text></View>
            <View style={[{ width: '65%', padding: 5 }]}><Text style={styles.bold}>DIBUAT OLEH ASESOR</Text></View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.colCell, { width: '35%', height: 60, justifyContent: 'flex-end', padding: 5 }]}><Text style={styles.bold}>{ujk?.penyelia}</Text></View>
            <View style={{ width: '65%', flexDirection: 'row' }}>
               <View style={[styles.colCell, { width: '10%', padding: 5 }]}><Text>1.</Text></View>
               <View style={[styles.colCell, { width: '40%', padding: 5 }]}><Text style={styles.bold}>{ujk?.asesor1}</Text></View>
               <View style={{ width: '50%', padding: 5, justifyContent: 'space-between' }}><Text>1. TTD</Text></View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default DH2PDF;