import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import PasswordChange from "@/components/settings/passwordChange";
import { getUserEmail } from "@/constants/Controller";

export default function AccountSetting() {
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
    };

    init();
  }, []);
  return (
    <View style={GloblalStyles.container}>
      <View>
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

      <PasswordChange />
    </View>
  );
}
