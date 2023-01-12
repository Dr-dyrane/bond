import React from "react";
import { Text, View, Image } from "react-native";

const ReceiverMessage = ({ message }) => {
  return (
    <View className="bg-purple-200 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 self-start ml-14">
      <Image
        className="h-12 w-12 rounded-full absolute top-0 -left-14"
        source={{ uri: message.photoURL }}
      />
      <Text className="text-purple-600">{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;
