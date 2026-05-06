import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '15mm', fontSize: 9, fontFamily: 'Times-Roman', lineHeight: 1.3 },
  bold: { fontFamily: 'Times-Bold' },
  
  // Header ISO Form Mutu
  isoTable: { flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 15 },
  isoLogoBox: { width: '15%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, alignItems: 'center', justifyContent: 'center' },
  isoTitleBox: { width: '50%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  isoInfoBox: { width: '35%' },
  isoInfoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  isoLabel: { width: '40%', padding: 4, borderRightWidth: 1, borderRightColor: '#000' },
  isoValue: { width: '60%', padding: 4 },
  
  // Info Pelaksanaan
  infoTable: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, fontSize: 10 },
  infoCol: { width: '50%', flexDirection: 'row', marginBottom: 4 },
  infoLabel: { width: '30%' },
  infoColon: { width: '5%' },
  infoContent: { width: '65%' },

  // Main Table (Tabel Laporan)
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 15 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  colCell: { borderRightWidth: 1, borderRightColor: '#000' },
  tHeadText: { padding: 4, textAlign: 'center', fontFamily: 'Times-Bold', fontSize: 8 },
  tCellText: { padding: 4, textAlign: 'center', height: 20 },

  // Tanda Tangan
  ttdContainer: { flexDirection: 'row', marginTop: 10 },
  ttdBox: { width: '33.3%', alignItems: 'flex-start' },
  ttdTitle: { fontFamily: 'Times-Bold', marginBottom: 40 },
  ttdName: { fontFamily: 'Times-Bold', textDecoration: 'underline' }
});

const LaporanPenyeliaPDF = ({ data }) => {
  const { ujk } = data;
  const asesiCount = ujk?.asesi || 16;
  const rows = Array.from({ length: asesiCount });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* HEADER ISO */}
        <View style={styles.isoTable}>
          <View style={styles.isoLogoBox}><Text>LOGO LSP</Text></View>
          <View style={styles.isoTitleBox}>
            <Text style={[styles.bold, { fontSize: 12 }]}>LSP BLK SURABAYA</Text>
            <Text style={styles.bold}>FORMULIR</Text>
            <Text style={[styles.bold, { fontSize: 12 }]}>LAPORAN PENYELIA KEGIATAN SERTIFIKASI</Text>
          </View>
          <View style={styles.isoInfoBox}>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>No. Dokumen</Text><Text style={styles.isoValue}>: FR-SER-01.5 LSP BLK-SBY</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>Edisi/Revisi</Text><Text style={styles.isoValue}>: 01/00</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>Tanggal Berlaku</Text><Text style={styles.isoValue}>: 01 Juli 2020</Text></View>
            <View style={[styles.isoInfoRow, { borderBottomWidth: 0 }]}><Text style={styles.isoLabel}>Halaman</Text><Text style={styles.isoValue}>: 1 dari 1</Text></View>
          </View>
        </View>

        {/* INFO PELAKSANAAN */}
        <View style={styles.infoTable}>
          <View style={styles.infoCol}><Text style={styles.infoLabel}>Skema / Bidang</Text><Text style={styles.infoColon}>:</Text><Text style={[styles.infoContent, styles.bold]}>{ujk?.skema} / {ujk?.bidang}</Text></View>
          <View style={styles.infoCol}><Text style={styles.infoLabel}>TUK</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoContent}>{ujk?.tuk}</Text></View>
          <View style={styles.infoCol}><Text style={styles.infoLabel}>Hari / Tanggal</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoContent}>{ujk?.hari1} s/d {ujk?.hari2}</Text></View>
          <View style={styles.infoCol}><Text style={styles.infoLabel}>Penyelia</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoContent}>{ujk?.penyelia}</Text></View>
        </View>

        {/* TABEL DATA */}
        <View style={styles.table}>
          {/* Header Tabel Kompleks */}
          <View style={[styles.tRow, { backgroundColor: '#f1f5f9' }]}>
            <View style={[styles.colCell, { width: '4%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>No</Text></View>
            <View style={[styles.colCell, { width: '20%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>Nama Peserta</Text></View>
            
            {/* Group Kehadiran */}
            <View style={[styles.colCell, { width: '15%' }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000' }}><Text style={styles.tHeadText}>Kehadiran</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '33.3%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>Pra</Text></View>
                <View style={{ width: '33.3%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>Hari 1</Text></View>
                <View style={{ width: '33.3%' }}><Text style={styles.tHeadText}>Hari 2</Text></View>
              </View>
            </View>

            {/* Group Administrasi */}
            <View style={[styles.colCell, { width: '32%' }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000' }}><Text style={styles.tHeadText}>Kelengkapan Administrasi</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '20%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>KTP</Text></View>
                <View style={{ width: '25%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>Ijazah</Text></View>
                <View style={{ width: '35%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>Sertifikat Pelatihan</Text></View>
                <View style={{ width: '20%' }}><Text style={styles.tHeadText}>Foto</Text></View>
              </View>
            </View>

            {/* Group Rekomendasi */}
            <View style={[styles.colCell, { width: '10%' }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000' }}><Text style={styles.tHeadText}>Rekomendasi</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', borderRightWidth: 1, borderRightColor: '#000' }}><Text style={styles.tHeadText}>K</Text></View>
                <View style={{ width: '50%' }}><Text style={styles.tHeadText}>BK</Text></View>
              </View>
            </View>

            <View style={[{ width: '19%', justifyContent: 'center' }]}><Text style={styles.tHeadText}>Asesor</Text></View>
          </View>

          {/* Baris Kosong Peserta */}
          {rows.map((_, i) => (
            <View style={[styles.tRow, i === rows.length - 1 && { borderBottomWidth: 0 }]} key={i} wrap={false}>
              <View style={[styles.colCell, { width: '4%' }]}><Text style={styles.tCellText}>{i + 1}</Text></View>
              <View style={[styles.colCell, { width: '20%' }]}></View>
              
              <View style={[styles.colCell, { width: '5%' }]}></View>
              <View style={[styles.colCell, { width: '5%' }]}></View>
              <View style={[styles.colCell, { width: '5%' }]}></View>

              <View style={[styles.colCell, { width: '6.4%' }]}></View>
              <View style={[styles.colCell, { width: '8%' }]}></View>
              <View style={[styles.colCell, { width: '11.2%' }]}></View>
              <View style={[styles.colCell, { width: '6.4%' }]}></View>

              <View style={[styles.colCell, { width: '5%' }]}></View>
              <View style={[styles.colCell, { width: '5%' }]}></View>
              
              <View style={{ width: '19%' }}></View>
            </View>
          ))}
        </View>

        {/* Tanda Tangan */}
        <Text>Catatan / Kejadian Penting:</Text>
        <Text style={{ color: '#94a3b8', marginVertical: 5 }}>.....................................................................................................................................................................................................................................</Text>
        
        <View style={styles.ttdContainer} wrap={false}>
          <View style={styles.ttdBox}>
             <Text style={styles.ttdTitle}>Tim Asesor</Text>
             <Text>1. <Text style={styles.ttdName}>{ujk?.asesor1}</Text></Text>
             <Text style={{ marginBottom: 15 }}>   No Reg: {ujk?.noReg1}</Text>
             {ujk?.asesor2 && (
               <>
                 <Text>2. <Text style={styles.ttdName}>{ujk?.asesor2}</Text></Text>
                 <Text>   No Reg: {ujk?.noReg2}</Text>
               </>
             )}
          </View>
          <View style={styles.ttdBox}>
             <Text style={styles.ttdTitle}>Penanggungjawab TUK</Text>
             <Text style={styles.ttdName}>........................................</Text>
          </View>
          <View style={styles.ttdBox}>
             <Text style={styles.ttdTitle}>Penyelia</Text>
             <Text style={styles.ttdName}>{ujk?.penyelia}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
export default LaporanPenyeliaPDF;