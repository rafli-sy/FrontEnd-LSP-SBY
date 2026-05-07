import React from 'react'; 
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
  
  row: { flexDirection: 'row' },
  paragraf: { textAlign: 'justify', marginBottom: 10, textIndent: 30 },
  
  // List
  listItem: { flexDirection: 'row', marginLeft: 10, marginBottom: 2 },
  bullet: { width: 20 },
  listLabel: { width: '60%' },
  listColon: { width: '5%' },
  listValue: { width: '35%' },
  
  // Tanda Tangan & Stempel
  ttdContainer: { width: '50%', alignSelf: 'flex-end', textAlign: 'center', marginTop: 30 },
  ttdTitle: { fontFamily: 'Times-Bold' },
  ttdSignContainer: { height: 60, position: 'relative', marginVertical: 5 },
  ttdImage: { position: 'absolute', left: -20, right: -20, top: -15, height: 90, objectFit: 'contain' },
  ttdName: { fontFamily: 'Times-Bold', textDecoration: 'underline', marginTop: 5 },

  // Lampiran Tabel (Landscape-ish style, tapi di kertas portrait A4)
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginTop: 20, fontSize: 9 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableColHead: { padding: 4, fontFamily: 'Times-Bold', textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
  tableCol: { padding: 4, borderRightWidth: 1, borderRightColor: '#000' }
}); // <--- PENYEBAB ERRORNYA DI SINI, SEKARANG SUDAH DITUTUP DENGAN BENAR!

const SuratBalasanPDF = ({ data }) => {
  const { ujk, form } = data;
  return (
    <Document>
      {/* HALAMAN 1: SURAT BALASAN */}
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
          <View style={{ width: 70 }}></View> {/* Spacer agar teks tetap ditengah */}
        </View>
        <View style={styles.headerLineThin}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ width: '60%' }}>
            <View style={styles.row}><Text style={{width: 60}}>Nomor</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>{form?.noSurat}</Text></View>
            <View style={styles.row}><Text style={{width: 60}}>Lampiran</Text><Text style={{width: 10}}>:</Text><Text style={{flex: 1}}>1 (Satu) Berkas</Text></View>
            <View style={styles.row}><Text style={{width: 60}}>Perihal</Text><Text style={{width: 10}}>:</Text><Text style={[styles.bold, {flex: 1}]}>Pelaksanaan Sertifikasi Kompetensi</Text></View>
          </View>
          <View style={{ width: '40%', alignItems: 'flex-end' }}>
            <Text>Surabaya, {form?.tanggalSurat}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text>Kepada</Text>
          <Text>Yth. <Text style={styles.bold}>{form?.kepadaTujuan}</Text></Text>
          <Text>di -</Text>
          <Text style={[styles.bold, { textDecoration: 'underline', marginLeft: 20, marginTop: 5 }]}>TEMPAT</Text>
        </View>

        <Text style={styles.paragraf}>
          Menindaklanjuti surat Saudara Nomor: {ujk?.nomorSurat || '.......'} tanggal {ujk?.tanggal || '.......'} Perihal: Pengajuan Pelaksanaan Sertifikasi Kompetensi, maka bersama ini kami sampaikan bahwa LSP BLK Surabaya bersedia dan sanggup melaksanakan sertifikasi kompetensi pada Tempat Uji Kompetensi (TUK) {ujk?.tuk} sesuai jadwal terlampir.
        </Text>
        <Text style={{ marginBottom: 5 }}>Kelengkapan dokumen calon asesi yang harus dilengkapi paling lambat 7 hari sebelum pelaksanaan Uji Kompetensi adalah:</Text>
        <View style={{ marginBottom: 10 }}>
          <View style={styles.listItem}><Text style={styles.bullet}>a.</Text><Text style={styles.listLabel}>Pas foto 3x4 dengan latar belakang merah</Text><Text style={styles.listColon}>:</Text><Text style={styles.listValue}>3 Lembar</Text></View>
          <View style={styles.listItem}><Text style={styles.bullet}>b.</Text><Text style={styles.listLabel}>Foto copy KTP/Kartu Keluarga</Text><Text style={styles.listColon}>:</Text><Text style={styles.listValue}>1 Lembar</Text></View>
          <View style={styles.listItem}><Text style={styles.bullet}>c.</Text><Text style={styles.listLabel}>Foto copy Sertifikat Pelatihan dari BLK</Text><Text style={styles.listColon}>:</Text><Text style={styles.listValue}>1 Lembar</Text></View>
          <View style={styles.listItem}><Text style={styles.bullet}>d.</Text><Text style={styles.listLabel}>Foto copy Ijasah Terakhir</Text><Text style={styles.listColon}>:</Text><Text style={styles.listValue}>1 Lembar</Text></View>
          <View style={styles.listItem}><Text style={styles.bullet}>e.</Text><Text style={styles.listLabel}>Materai 10.000 per asesi 1 materai</Text><Text style={styles.listColon}>:</Text><Text style={styles.listValue}>{ujk?.asesi || '16'} Materai</Text></View>
        </View>
        <Text style={styles.paragraf}>Demikian atas perhatian dan kerjasama yang baik disampaikan terima kasih.</Text>

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

      {/* HALAMAN 2: LAMPIRAN JADWAL */}
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={[styles.bold, { textAlign: 'center', fontSize: 14, marginBottom: 20 }]}>
          JADWAL PELAKSANAAN UJI KOMPETENSI DAN SERTIFIKASI
        </Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHead, { width: '5%' }]}>No</Text>
            <Text style={[styles.tableColHead, { width: '15%' }]}>Kejuruan</Text>
            <Text style={[styles.tableColHead, { width: '20%' }]}>Skema</Text>
            <Text style={[styles.tableColHead, { width: '20%' }]}>Tgl Pelaksanaan</Text>
            <Text style={[styles.tableColHead, { width: '10%' }]}>Peserta</Text>
            <Text style={[styles.tableColHead, { width: '20%' }]}>Nama Asesor</Text>
            <Text style={[styles.tableColHead, { width: '10%', borderRightWidth: 0 }]}>Penyelia</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { width: '5%', textAlign: 'center' }]}>1.</Text>
            <Text style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}>{ujk?.bidang}</Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>{ujk?.skema}</Text>
            <Text style={[styles.tableCol, { width: '20%', textAlign: 'center' }]}>{ujk?.hari1} s/d {ujk?.hari2}</Text>
            <Text style={[styles.tableCol, { width: '10%', textAlign: 'center' }]}>{ujk?.asesi}</Text>
            <View style={[styles.tableCol, { width: '20%' }]}>
               <Text>1. {ujk?.asesor1}</Text>
               <Text style={{ fontSize: 8 }}>   ({ujk?.noReg1 || '-'})</Text>
               {ujk?.asesor2 && (
                 <>
                   <Text style={{ marginTop: 4 }}>2. {ujk?.asesor2}</Text>
                   <Text style={{ fontSize: 8 }}>   ({ujk?.noReg2 || '-'})</Text>
                 </>
               )}
            </View>
            <Text style={[styles.tableCol, { width: '10%', textAlign: 'center', borderRightWidth: 0 }]}>{ujk?.penyelia}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SuratBalasanPDF;