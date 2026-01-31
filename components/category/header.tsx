import { TitleColor } from "@/constants/Colors";
import { getUserEmail, logout } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
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

export default function Header({ change }: { change: boolean }) {
  const [userEmail, setUserEmail] = useState<string>("");
  const nav = useNavigation();

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
    <>
      <View style={styles.header}>
        <View style={styles.menuLogoutContainer}>
          <TouchableOpacity
            style={styles.headerMenuContainer}
            onPress={() => {
              nav.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Image
              style={[styles.logoutIcon, GloblalStyles.icon]}
              source={require("@/assets/images/menu.png")}
            />
            <Text style={styles.logoutText}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerMenuContainer}
            onPress={() => {
              logout(router);
            }}
          >
            <Image
              style={[styles.logoutIcon, GloblalStyles.icon]}
              source={require("@/assets/images/logout.png")}
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={GloblalStyles.avatarEmailContainer}>
          <View style={GloblalStyles.avatarContainer}>
            <Image
              style={[GloblalStyles.avatar]}
              source={require("@/assets/images/user.png")}
            />
          </View>
          <Text style={GloblalStyles.email}>{userEmail}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "40%",
    padding: 20,
    width: Dimensions.get("window").width,
  },
  menuLogoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  logoutIcon: {},
  logoutText: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
 
});
