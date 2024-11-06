import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";

export default function CustomDrawerContent() {
  const router = useRouter();
  
  return (
    <DrawerContentScrollView>
      <DrawerItem
        label={"Account setting"}
        onPress={() => {
          router.push("/settings/accountSetting");
        }}
      />
    </DrawerContentScrollView>
  );
}
