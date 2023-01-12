import { View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/core";

const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !occupation || !age;
  const navigation = useNavigation();

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      occupation: occupation,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeAreaView className="flex-1 items-center py-1">
      <Image
        className="h-14 w-full mb-4"
        resizeMode="contain"
        source={require("../assets/Bond_banner.png")}
      />
      <Text className="text-gray-500 p-2 font-bold text-xl">
        Welcome {user.displayName}
      </Text>

      <Text className="text-center p-4 font-bold text-[#570861]">
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        className="text-center text-xl pb-2"
        placeholder="Enter your Profile Pic URL"
      />

      <Text className="text-center p-4 font-bold text-[#570861]">
        Step 2: The Occupation
      </Text>
      <TextInput
        value={occupation}
        onChangeText={setOccupation}
        className="text-center text-xl pb-2"
        placeholder="Enter your occupation"
      />

      <Text className="text-center p-4 font-bold text-[#570861]">
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        className="text-center text-xl pb-2"
        placeholder="Enter your age"
        maxLength={2}
        keyboardType="numeric"
      />
      <TouchableOpacity
        disabled={incompleteForm}
        className={
          incompleteForm
            ? "w-64 p-3 bg-gray-400 rounded-xl absolute bottom-10 "
            : "w-64 p-3 bg-[#570861] rounded-xl absolute bottom-10"
        }
        onPress={updateUserProfile}
      >
        <Text className="text-center text-white text-xl">Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default ModalScreen;
