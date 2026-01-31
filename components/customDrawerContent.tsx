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
          router.navigate("/settings/accountSetting");
        }}
      />
      <DrawerItem
        label={"Export Database"}
        onPress={() => {
          router.navigate("/settings/exportDatabase");
        }}
      />
       <DrawerItem
        label={"Import Database"}
        onPress={() => {
          router.navigate("/settings/importDatabase");
        }}
      />
    </DrawerContentScrollView>
  );
}
