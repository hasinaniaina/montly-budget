import { TitleColor } from "@/constants/Colors";
import { getUserEmail, logout } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Header({change}: {
    change:boolean;
}) {
  const [userEmail, setUserEmail] = useState<string>("");

    const fetchUserEmail = async () => {
      const user: any = getUserEmail();
      return user;
    };

    useEffect(() => {
      const init = async () => {
          fetchUserEmail().then((user) => {
              setUserEmail(JSON.parse(user)?.email); 
          });
      }
      
      init();

    }, [change]);
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutContainer}
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
        <View style={styles.avatarEmailContainer}>
          <View style={styles.avatarContainer}>
            <Image
              style={[styles.avatar]}
              source={require("@/assets/images/user.png")}
            />
          </View>
          <Text style={styles.email}>{userEmail}</Text>
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
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  logoutIcon: {},
  logoutText: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
  avatarEmailContainer: {
    paddingVertical: 40,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {},
  email: {
    textAlign: "center",
    marginTop: 20,
    color: TitleColor,
    fontFamily: "k2d-bold",
    fontSize: 16,
  },
});
