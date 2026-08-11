import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer as PaperDrawer, useTheme } from 'react-native-paper';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <PaperDrawer.Item
        label="マイページ"
        icon="account"
        theme={theme}
        onPress={() => {
          router.push('/(tabs)/account');
        }}
      />
    </DrawerContentScrollView>
  );
}
