import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import { useNavigation, useRoute } from "@react-navigation/core";
import {
  addDoc,
  query,
  orderBy,
  collection,
  onSnapshot,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput("");
  };

  return (
    <SafeAreaView className="flex-1">
      <Header
        callEnabled
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
      />
      <KeyboardAvoidingView
        behaviour={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        KeyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            keyExtractor={(item) => item.id}
            data={messages}
            inverted={-1}
            className="pl-4"
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View className="flex-row items-center justify-between border-t border-gray-200 px-5 py-2">
          <TextInput
            className="h-10 text-lg"
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text className="text-[#570861] text-lg">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default MessageScreen;
