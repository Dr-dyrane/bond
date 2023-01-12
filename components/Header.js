import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <View className="p-2 flex-row items-center justify-between">
      <View className="flex flex-row items-center">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color="#570861" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold pl-2">{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity className="rounded-full mr-4 p-3 bg-purple-200">
          <Foundation name="telephone" size={16} color="#570861" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default Header;
