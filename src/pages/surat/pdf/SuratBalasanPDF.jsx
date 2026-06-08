import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
  },
});

const SuratBalasanPDF = ({ data = {} }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Surat Balasan</Text>
        <View style={styles.section}>
          <Text style={styles.row}>
            <Text style={styles.label}>Nomor Surat: </Text>
            <Text style={styles.value}>{data.nomorSurat || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Instansi: </Text>
            <Text style={styles.value}>{data.instansi || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Skema: </Text>
            <Text style={styles.value}>{data.skema || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Tanggal: </Text>
            <Text style={styles.value}>{data.tanggal || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Tim: </Text>
            <Text style={styles.value}>{data.tim || '-'}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SuratBalasanPDF;
