import React from 'react'; 
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// --- IMPORT GAMBAR DARI FOLDER ASSETS ---
import logoLsp from '../../../assets/logo-lsp.png'; 
import ttdKetua from '../../../assets/ttd-ketua.png';

const styles = StyleSheet.create({
  page: { padding: '20mm', fontSize: 11, fontFamily: 'Times-Roman', lineHeight: 1.5 },
  bold: { fontFamily: 'Times-Bold' },
  
  // Kop Surat Sesuai Gambar
  headerContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#000', paddingBottom: 10, marginBottom: 2 },
  headerLineThin: { borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 15 },
  logoBox: { width: 70, height: 70, objectFit: 'contain' },
  headerText: { flex: 1, textAlign: 'center', paddingHorizontal: 10 },
  title1: { fontSize: 18, fontFamily: 'Times-Bold', letterSpacing: 1 },
  title2: { fontSize: 12, marginTop: 4 },
  title3: { fontSize: 9, marginTop: 2 },
  
  // Layout Atas (Kiri info surat, Kanan Tujuan)
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  topLeft: { width: '50%' },
  topRight: { width: '40%' },
  row: { flexDirection: 'row' },
  
  paragraf: { textAlign: 'justify', marginBottom: 15, textIndent: 30 },
  infoTable: { marginLeft: 30, marginBottom: 15 },
  
  // Tanda Tangan & Stempel
  ttdContainer: { width: '50%', alignSelf: 'flex-end', textAlign: 'center', marginTop: 30 },
  ttdTitle: { fontFamily: 'Times-Bold' },
  ttdSignContainer: { height: 60, position: 'relative', marginVertical: 5 },
  ttdImage: { position: 'absolute', left: -20, right: -20, top: -15, height: 90, objectFit: 'contain' },
  ttdName: { fontFamily: 'Times-Bold', textDecoration: 'underline', marginTop: 5 }
});

const SuratPermohonanPDF = ({ data }) => {
  const { ujk, form } = data;
  const namaAsesor = ujk?.asesor2 ? `${ujk.asesor1} dan ${ujk.asesor2}` : (ujk?.asesor1 || '-');
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
         
        {/* --- KOP SURAT BERLOGO --- */}
        <View style={styles.headerContainer}>
          <Image src={logoLsp} style={styles.logoBox} />
          <View style={styles.headerText}>
            <Text style={styles.title1}>LSP BLK SURABAYA</Text>
            <Text style={styles.title2}>Lembaga Sertifikasi Profesi BLK Surabaya</Text>
            <Text style={styles.title3}>Jl. Dukuh Menanggal III/29 Gayungan Surabaya Telp./fax.8290071, 8287532</Text>
            <Text style={styles.title3}>Email: lsp.blksurabaya@gmail.com</Text>
          </View>
          <View style={{ width: 70 }}></View>
        </View>
        <View style={styles.headerLineThin}></View>

        {/* --- INFORMASI SURAT --- */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <View style={styles.row}><Text style={{width: 60}}>Nomor</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>{form?.noSurat}</Text></View>
            <View style={styles.row}><Text style={{width: 60}}>Sifat</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>Biasa</Text></View>
            <View style={styles.row}><Text style={{width: 60}}>Lampiran</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>-</Text></View>
            <View style={styles.row}><Text style={{width: 60}}>Perihal</Text><Text style={{width: 10}}>:</Text><Text style={[styles.bold, {flex: 1}]}>Permohonan Asesor</Text></View>
          </View>
          <View style={styles.topRight}>
            <Text style={{marginBottom: 10}}>Surabaya, {form?.tanggalSurat}</Text>
            <Text>Kepada</Text>
            <Text>Yth: <Text style={styles.bold}>{form?.kepadaTujuan}</Text></Text>
            <Text>di -</Text>
            <Text style={[styles.bold, { textDecoration: 'underline', marginLeft: 20, marginTop: 5 }]}>TEMPAT</Text>
          </View>
        </View>

        <Text style={styles.paragraf}>
          Sehubungan dengan adanya rencana Uji Kompetensi skema <Text style={styles.bold}>{ujk?.skema}</Text> yang akan dilaksanakan oleh LSP BLK Surabaya, maka bersama ini kami mohon dapatnya untuk memberi ijin kepada Saudara/i <Text style={styles.bold}>{namaAsesor}</Text> (Asesor) untuk melaksanakan Sertifikasi kompetensi pada :
        </Text>
        
        <View style={styles.infoTable}>
           <View style={styles.row}><Text style={{width: 100}}>Hari / Tanggal</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>{ujk?.hari1} s/d {ujk?.hari2}</Text></View>
           <View style={styles.row}><Text style={{width: 100}}>Waktu</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>{ujk?.waktu}</Text></View>
           <View style={styles.row}><Text style={{width: 100}}>Tempat</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>TUK {ujk?.tuk}</Text></View>
        </View>
        
        <Text style={styles.paragraf}>Demikian atas perhatian dan kerjasamanya disampaikan terimakasih.</Text>

        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Text>Tembusan disampaikan kepada Yth:</Text>
          <Text>1. Kepala UPT Balai Latihan Kerja Surabaya</Text>
          <Text>2. Pertinggal</Text>
        </View>

        {/* --- TANDA TANGAN & STEMPEL GAMBAR --- */}
        <View style={styles.ttdContainer}>
          <Text style={styles.ttdTitle}>Ketua</Text>
          <Text style={styles.ttdTitle}>LSP BLK SURABAYA</Text>
          
          <View style={styles.ttdSignContainer}>
             <Image src={ttdKetua} style={styles.ttdImage} />
          </View>
          
          <Text style={styles.ttdName}>BIBIET ANDRIYANTO JR, S.PD.T</Text>
        </View>

      </Page>
    </Document>
  );
};
export default SuratPermohonanPDF;