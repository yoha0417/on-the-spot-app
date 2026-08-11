import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/constants/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'ホーム',
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
      </Drawer>
    </PaperProvider>
  );
}
