import { TitleColor } from "@/constants/Colors";
import { getUserEmail, logout } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useLogoutShowStore } from "@/constants/store";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header({ change }: { change: boolean }) {
  const [userEmail, setUserEmail] = useState<string>("");
  const logoutShow = useLogoutShowStore((state) => state.showLogout);
  const setLogoutShow = useLogoutShowStore((state) => state.setShowLogout)
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  

  const fetchUserEmail = async () => {
    const user: any = getUserEmail();
    return user;
  };

  useEffect(() => {
    const init = async () => {
      console.log("Header.tsx");
      
      fetchUserEmail().then((user) => {
        setUserEmail(JSON.parse(user)?.email);
      });
    };

    init();
  }, [change]);
  return (
      <View style={[styles.header, {padding: 20}]}>
        <View style={styles.menuLogoutContainer}>
          <TouchableOpacity
            style={[GloblalStyles.avatarContainer, styles.headerMenuContainer]}
            onPress={() => {
              setLogoutShow(true);
            }}
          >
            <Image
              style={[GloblalStyles.avatar]}
              source={require("@/assets/images/user.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutContainer,{display: (logoutShow) ? "flex" : "none"}]}
            onPress={() => {
              logout(router);
            }}
          >
            <Image
              style={[GloblalStyles.icon, styles.logoutIcon]}
              source={require("@/assets/images/logout.png")}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerMenuContainer}
            onPress={() => {
              nav.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Image
              style={[GloblalStyles.icon]}
              source={require("@/assets/images/menu.png")}
            />
          </TouchableOpacity>
        </View>

        <View style={GloblalStyles.avatarEmailContainer}>
          {/* <Text style={GloblalStyles.email}>{userEmail}</Text> */}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: Dimensions.get("window").width,
    marginBottom: 30,
  },
  menuLogoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 30,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 2,
    borderRadius: 10
  },
  logoutIcon: {
    width: 12,
    height: 12
  },
  logoutText: {
    fontFamily: "k2d-light",
    color: TitleColor,
  },
});