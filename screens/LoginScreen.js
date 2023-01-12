import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";

const LoginScreen = () => {
  const { promptAsync } = useAuth();

  return (
    <View className="flex-1">
      <ImageBackground
        resizeMode="cover"
        className="flex-1"
        source={require("../assets/bg_bond.png")}
      >
        <TouchableOpacity
          className="absolute bottom-40 w-52 bg-white rounded-2xl p-4"
          style={{ marginHorizontal: "25%" }}
          onPress={() => promptAsync({ useProxy: true, showInRecents: true })}
        >
          <Text className="text-center font-semibold text-[#570861]">
            Sign in & Start bonding
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
export default LoginScreen;
