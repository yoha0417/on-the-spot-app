import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Drawer as PaperDrawer, useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export function CustomDrawerContent(props: Record<string, unknown>) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { isAuthenticated, logout } = useAuth();

  return (
    <ScrollView {...props}>
      <View style={{ paddingTop: top }}>
        <PaperDrawer.Item
          label="マップ"
          icon="map"
          theme={theme}
          onPress={() => {
            router.push('/(tabs)');
          }}
        />
        <PaperDrawer.Item
          label="マイページ"
          icon="account"
          theme={theme}
          onPress={() => {
            router.push('/(tabs)/account');
          }}
        />
        <PaperDrawer.Item
          label="設定"
          icon="cog"
          theme={theme}
          onPress={() => {
            router.push('/settings');
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
