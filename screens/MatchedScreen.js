import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/core";

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;
  return (
    <View className="pt-20 bg-purple-500 opacity-90 h-full">
      <View className="justify-center px-10 pt-20">
        <Image
          className="h-16 w-full"
          source={require("../assets/match.png")}
        />
      </View>
      <Text className="text-white text-center mt-5">
        You and {userSwiped.displayName} have liked each other.
      </Text>
      <View className="flex-row justify-evenly mt-5">
        <Image
          className="h-32 w-32 rounded-full"
          source={{
            uri: loggedInProfile.photoURL,
          }}
        />
        <Image
          className="h-32 w-32 rounded-full"
          source={{
            uri: userSwiped.photoURL,
          }}
        />
      </View>
      <TouchableOpacity
        className="bg-white m-5 px-10 py-6 rounded-full mt-20"
        onPress={() => {
          navigation.goBack();
          navigation.navigate("Chat");
        }}
      >
        <Text className="text-center">Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};
export default MatchedScreen;
