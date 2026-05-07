import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: '15mm', fontSize: 9, fontFamily: 'Times-Roman', lineHeight: 1.3 },
  bold: { fontFamily: 'Times-Bold' },
  
  isoTable: { flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 20 },
  isoLogoBox: { width: '15%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, alignItems: 'center', justifyContent: 'center' },
  isoTitleBox: { width: '50%', borderRightWidth: 1, borderRightColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  isoInfoBox: { width: '35%' },
  isoInfoRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  isoLabel: { width: '40%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', fontSize: 8 },
  isoValue: { width: '60%', padding: 4, fontSize: 8 },

  table: { width: '100%', borderWidth: 1, borderColor: '#000', fontSize: 8 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  colCell: { borderRightWidth: 1, borderRightColor: '#000', padding: 4 },
  tHeadText: { textAlign: 'center', fontFamily: 'Times-Bold' },
  
  infoInnerTable: { width: '100%' },
  innerRow: { flexDirection: 'row', paddingVertical: 2, borderBottomWidth: 1, borderBottomColor: '#000' },
});

const PengembalianDokumenPDF = ({ data }) => {
  const { ujk } = data;
  const namaTUKLengkap = `${ujk?.bidang} ${ujk?.tuk?.replace('TUK Sewaktu ', '')}`;
  const rentangWaktu = `${ujk?.hari1} s/d ${ujk?.hari2}`;
  
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.isoTable}>
          <View style={styles.isoLogoBox}><Text>LOGO LSP</Text></View>
          <View style={styles.isoTitleBox}>
            <Text style={[styles.bold, { fontSize: 12 }]}>LSP BLK SURABAYA</Text>
            <Text style={[styles.bold, { fontSize: 14 }]}>FORMULIR PENGEMBALIAN DOKUMEN ASESMEN</Text>
          </View>
          <View style={styles.isoInfoBox}>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>NO. DOKUMEN</Text><Text style={styles.isoValue}>: FR-SER-01.7 LSP BLK-SBY</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>EDISI/REVISI</Text><Text style={styles.isoValue}>: 01/00</Text></View>
            <View style={styles.isoInfoRow}><Text style={styles.isoLabel}>TANGGAL BERLAKU</Text><Text style={styles.isoValue}>: 10 Nov 2015</Text></View>
            <View style={[styles.isoInfoRow, { borderBottomWidth: 0 }]}><Text style={styles.isoLabel}>HALAMAN</Text><Text style={styles.isoValue}>: 1 dari 1</Text></View>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header Baris 1 */}
          <View style={[styles.tRow, { backgroundColor: '#f1f5f9', alignItems: 'center' }]}>
            <View style={[styles.colCell, { width: '4%' }]}><Text style={styles.tHeadText}>NO</Text></View>
            <View style={[styles.colCell, { width: '12%' }]}><Text style={styles.tHeadText}>TGL/PUKUL</Text></View>
            <View style={[styles.colCell, { width: '24%' }]}><Text style={styles.tHeadText}>KETERANGAN</Text></View>
            <View style={[styles.colCell, { width: '15%' }]}><Text style={styles.tHeadText}>PENGEMBALIAN MUK OLEH ASESOR</Text></View>
            
            <View style={[styles.colCell, { width: '21%', padding: 0 }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', padding: 4 }}><Text style={styles.tHeadText}>PENYERAHAN KE BIDANG SERTIFIKASI</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '33.3%', borderRightWidth: 1, borderRightColor: '#000', padding: 4 }}><Text style={styles.tHeadText}>SURAT TUGAS</Text></View>
                <View style={{ width: '33.3%', borderRightWidth: 1, borderRightColor: '#000', padding: 4 }}><Text style={styles.tHeadText}>DAFTAR HADIR</Text></View>
                <View style={{ width: '33.3%', padding: 4 }}><Text style={styles.tHeadText}>BERITA ACARA</Text></View>
              </View>
            </View>

            <View style={[styles.colCell, { width: '12%' }]}><Text style={styles.tHeadText}>BERKAS LAIN</Text></View>
            <View style={[styles.colCell, { width: '12%', borderRightWidth: 0 }]}><Text style={styles.tHeadText}>DITERIMA OLEH (ttd & nama)</Text></View>
          </View>

          {/* Data Asesor 1 */}
          <View style={styles.tRow} wrap={false}>
            <View style={[styles.colCell, { width: '4%', justifyContent: 'center' }]}><Text style={{textAlign: 'center'}}>1</Text></View>
            <View style={[styles.colCell, { width: '12%', justifyContent: 'center' }]}><Text style={{textAlign: 'center'}}>{ujk?.hari2}{"\n"}Jam 17.00</Text></View>
            <View style={[styles.colCell, { width: '24%', padding: 0 }]}>
              <View style={styles.infoInnerTable}>
                <View style={styles.innerRow}><Text style={{width:'30%', paddingLeft:4}}>Nama TUK</Text><Text style={{width:'5%'}}>:</Text><Text style={{width:'65%'}}>{namaTUKLengkap}</Text></View>
                <View style={styles.innerRow}><Text style={{width:'30%', paddingLeft:4}}>Asesmen Tgl</Text><Text style={{width:'5%'}}>:</Text><Text style={{width:'65%'}}>{rentangWaktu}</Text></View>
                <View style={[styles.innerRow, {borderBottomWidth: 0}]}><Text style={{width:'30%', paddingLeft:4}}>Jumlah MUK</Text><Text style={{width:'5%'}}>:</Text><Text style={{width:'65%'}}></Text></View>
              </View>
            </View>
            <View style={[styles.colCell, { width: '15%', justifyContent: 'flex-end', paddingBottom: 10 }]}><Text style={[styles.bold, {textAlign: 'center'}]}>{ujk?.asesor1}</Text></View>
            
            <View style={[styles.colCell, { width: '7%', padding: 0 }]}></View>
            <View style={[styles.colCell, { width: '7%', padding: 0 }]}></View>
            <View style={[styles.colCell, { width: '7%', padding: 0 }]}></View>
            
            <View style={[styles.colCell, { width: '12%' }]}></View>
            <View style={[styles.colCell, { width: '12%', borderRightWidth: 0, justifyContent: 'flex-end', paddingBottom: 10 }]}><Text style={[styles.bold, {textAlign: 'center'}]}>{ujk?.penyelia}</Text></View>
          </View>

          {/* Data Asesor 2 */}
          {ujk?.asesor2 && (
          <View style={[styles.tRow, { borderBottomWidth: 0 }]} wrap={false}>
            <View style={[styles.colCell, { width: '4%', justifyContent: 'center' }]}><Text style={{textAlign: 'center'}}>2</Text></View>
            <View style={[styles.colCell, { width: '12%', justifyContent: 'center' }]}><Text style={{textAlign: 'center'}}>{ujk?.hari2}{"\n"}Jam 17.00</Text></View>
            <View style={[styles.colCell, { width: '24%', padding: 0 }]}>
              <View style={styles.infoInnerTable}>
                <View style={styles.innerRow}><Text style={{width:'30%', paddingLeft:4}}>Nama TUK</Text><Text style={{width:'5%'}}>:</Text><Text style={{width:'65%'}}>{namaTUKLengkap}</Text></View>
                <View style={styles.innerRow}><Text style={{width:'30%', paddingLeft:4}}>Asesmen Tgl</Text><Text style={{width:'5%'}}>:</Text><Text style={{width:'65%'}}>{rentangWaktu}</Text></View>
                <View style={[styles.innerRow, {borderBottomWidth: 0}]}><Text style={{width:'30%', paddingLeft:4}}>Jumlah MUK</Text><Text style={{width:'5%'}}>:</Text><Text style={{width:'65%'}}></Text></View>
              </View>
            </View>
            <View style={[styles.colCell, { width: '15%', justifyContent: 'flex-end', paddingBottom: 10 }]}><Text style={[styles.bold, {textAlign: 'center'}]}>{ujk?.asesor2}</Text></View>
            
            <View style={[styles.colCell, { width: '7%', padding: 0 }]}></View>
            <View style={[styles.colCell, { width: '7%', padding: 0 }]}></View>
            <View style={[styles.colCell, { width: '7%', padding: 0 }]}></View>
            
            <View style={[styles.colCell, { width: '12%' }]}></View>
            <View style={[styles.colCell, { width: '12%', borderRightWidth: 0, justifyContent: 'flex-end', paddingBottom: 10 }]}><Text style={[styles.bold, {textAlign: 'center'}]}>{ujk?.penyelia}</Text></View>
          </View>
          )}

        </View>
      </Page>
    </Document>
  );
};
export default PengembalianDokumenPDF;