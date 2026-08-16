import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ProtectedScreen } from '@/components/protected-screen';

export default function TimelineScreen() {
  const theme = useTheme();

  return (
    <ProtectedScreen>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.text}>タイムライン画面</Text>
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
