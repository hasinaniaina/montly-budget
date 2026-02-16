import 'react-native-gesture-handler';
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from '@/components/customDrawerContent';

const color = "#717171";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={CustomDrawerContent}
      >
      </Drawer>
    </GestureHandlerRootView>
  );
}
