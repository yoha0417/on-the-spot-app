import { useAuth } from '@/contexts/AuthContext';
import { router, Href } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Drawer as PaperDrawer,
  Text,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomDrawerContent(props: Record<string, unknown>) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { isAuthenticated, logout, userName } = useAuth();

  const mapHref = '/(tabs)/map' as Href;
  const accountHref = '/(tabs)/account' as Href;
  const settingsHref = '/settings' as Href;

  return (
    <ScrollView {...props}>
      <View style={[styles.container, { paddingTop: top }]}>
        {isAuthenticated && userName !== null && (
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.userNameText}>
              {userName}
            </Text>
          </View>
        )}
        <PaperDrawer.Item
          label="マップ"
          icon="map"
          theme={theme}
          onPress={() => {
            router.push(mapHref);
          }}
        />
        <PaperDrawer.Item
          label="マイページ"
          icon="account"
          theme={theme}
          onPress={() => {
            router.push(accountHref);
          }}
        />
        <PaperDrawer.Item
          label="設定"
          icon="cog"
          theme={theme}
          onPress={() => {
            router.push(settingsHref);
          }}
        />
        <PaperDrawer.Item
          label="オープンデータ出典明記"
          icon="information"
          theme={theme}
          onPress={() => {
            router.push('/attribution');
          }}
        />
        <PaperDrawer.Item
          label="Explore"
          icon="compass"
          theme={theme}
          onPress={() => {
            router.push('/explore');
          }}
        />
        {isAuthenticated ? (
          <PaperDrawer.Item
            label="ログアウト"
            icon="logout"
            theme={theme}
            onPress={async () => {
              await logout();
              router.push('/login');
            }}
          />
        ) : (
          <PaperDrawer.Item
            label="ログイン"
            icon="login"
            theme={theme}
            onPress={() => {
              router.push('/login');
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 4,
  },
  userNameText: {
    fontWeight: '600',
  },
});
