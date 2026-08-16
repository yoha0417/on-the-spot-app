import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer as PaperDrawer, Text, useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function CustomDrawerContent(props: Record<string, unknown>) {
  const theme = useTheme();
  const { isAuthenticated, userName, logout } = useAuth();

  const mapHref = '/(tabs)/map';
  const accountHref = '/(tabs)/account';
  const settingsHref = '/settings';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* ユーザー表示エリア */}
      <View style={styles.greetingContainer}>
        {isAuthenticated ? (
          <>
            <Text variant="subtitle" style={styles.greetingText}>
              こんにちは、{userName}さん
            </Text>
            <PaperDrawer.Item
              label="ログアウト"
              icon="logout"
              onPress={async () => {
                await logout();
              }}
            />
          </>
        ) : (
          <>
            <Text variant="subtitle" style={styles.greetingText}>
              ログインしてください
            </Text>
            <PaperDrawer.Item
              label="ログイン"
              icon="login"
              onPress={() => {
                router.push('/login');
              }}
            />
          </>
        )}
      </View>

      <View style={styles.divider} />

      <PaperDrawer.Item
        label="マップ"
        icon="map"
        onPress={() => {
          router.push(mapHref);
        }}
      />
      <PaperDrawer.Item
        label="マイページ"
        icon="account"
        onPress={() => {
          router.push(accountHref);
        }}
      />
      <PaperDrawer.Item
        label="設定"
        icon="cog"
        onPress={() => {
          router.push(settingsHref);
        }}
      />
      <PaperDrawer.Item
        label="オープンデータ出典明記"
        icon="information"
        onPress={() => {
          router.push('/attribution');
        }}
      />
      <PaperDrawer.Item
        label="Explore"
        icon="compass"
        onPress={() => {
          router.push('/explore');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  greetingText: {
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
