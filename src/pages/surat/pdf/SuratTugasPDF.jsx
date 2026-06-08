import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
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

const SuratTugasPDF = ({ data = {} }) => {
  const ujk = data.ujk || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Surat Tugas</Text>
        <View style={styles.section}>
          <Text style={styles.row}>
            <Text style={styles.label}>Skema: </Text>
            <Text style={styles.value}>{ujk.skema || data.skema || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Bidang: </Text>
            <Text style={styles.value}>{ujk.bidang || data.bidang || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>TUK: </Text>
            <Text style={styles.value}>{ujk.tuk || data.tuk || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Waktu: </Text>
            <Text style={styles.value}>{ujk.waktu || data.waktu || '-'}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Asesor: </Text>
            <Text style={styles.value}>{ujk.asesor1 || data.asesor1 || '-'}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SuratTugasPDF;
