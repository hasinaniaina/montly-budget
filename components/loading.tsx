import { Dimensions, Image, View, ViewStyle } from "react-native";

export default function Loading({showLoading}: {showLoading:ViewStyle}) {
  return (
    <>
      <View
        style={[
          {
            backgroundColor: "#000",
            position: "absolute",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            opacity: 0.7,
            flex: 1,
          },
          showLoading,
        ]}
      ></View>
      <View
        style={[
          {
            position: "absolute",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            alignItems: "center",
            justifyContent: "center",
          },
          showLoading,
        ]}
      >
        <Image
          style={{ width: 40, height: 40 }}
          source={require("@/assets/images/loading.gif")}
        />
      </View>
    </>
  );
}
