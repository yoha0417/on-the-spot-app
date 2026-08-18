import CustomDrawerContent from '@/components/custom-drawer-content';
import { theme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CheckInProvider } from '@/contexts/CheckInContext';
import { Redirect, Stack, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    if (pathname !== '/login') {
      return <Redirect href="/login" />;
    }

    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
      </Stack>
    );
  }

  if (pathname === '/login') {
    return <Redirect href="/" />;
  }

  return (
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
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CheckInProvider>
          <RootNavigator />
        </CheckInProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
