import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/constants/theme';
import { CustomDrawerContent } from '@/components/custom-drawer-content';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen
            name="(tabs)"
            options={{
              title: 'ホーム',
              headerShown: false,
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="explore"
            options={{
              title: 'Explore',
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              title: '設定',
            }}
          />
          <Drawer.Screen
            name="attribution"
            options={{
              title: 'オープンデータ出典明記',
            }}
          />
          <Drawer.Screen
            name="login"
            options={{
              title: 'ログイン',
              drawerItemStyle: { display: 'none' },
            }}
          />
        </Drawer>
      </AuthProvider>
    </PaperProvider>
  );
}
