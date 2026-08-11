import { View, Text, StyleSheet } from 'react-native';

export default function TimelineScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>タイムライン画面</Text>
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
