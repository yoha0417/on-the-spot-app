import { View, Text, StyleSheet } from 'react-native';

export default function AttributionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>オープンデータ出典明記画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
