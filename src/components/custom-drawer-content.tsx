import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Drawer as PaperDrawer, useTheme } from 'react-native-paper';

export function CustomDrawerContent(props: React.ComponentProps<typeof ScrollView>) {
  const theme = useTheme();

  return (
    <ScrollView {...props}>
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
    </ScrollView>
  );
}
