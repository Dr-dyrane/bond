import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import generateId from "../lib/generateId";

import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  documentSnapshot,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  getDoc,
  query,
  where,
} from "@firebase/firestore";

const DUMMY_DATA = [
  {
    firstName: "Dyrane",
    lastName: "Alexander",
    occupation: "Developer",
    photoURL:
      "https://images.pexels.com/photos/2112730/pexels-photo-2112730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    age: 27,
    id: 123,
  },
  {
    firstName: "English",
    lastName: "Melody",
    occupation: "Farmer",
    photoURL:
      "https://images.pexels.com/photos/14296202/pexels-photo-14296202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    age: 22,
    id: 456,
  },
  {
    firstName: "Elon",
    lastName: "Neue",
    occupation: "Engineer",
    photoURL:
      "https://images.pexels.com/photos/1464532/pexels-photo-1464532.jpeg",
    age: 40,
    id: 789,
  },
  {
    firstName: "Favour",
    lastName: "Durham",
    occupation: "Analyst",
    photoURL:
      "https://images.pexels.com/photos/11194302/pexels-photo-11194302.jpeg",
    age: 28,
    id: 810,
  },
  {
    firstName: "Prince",
    lastName: "Alexander",
    occupation: "Fixer",
    photoURL:
      "https://images.pexels.com/photos/14711370/pexels-photo-14711370.jpeg",
    age: 24,
    id: 811,
  },
  {
    firstName: "Harmony",
    lastName: "Beetle",
    occupation: "Receptionist",
    photoURL:
      "https://images.pexels.com/photos/11331418/pexels-photo-11331418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    age: 21,
    id: 812,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${user.displayName}`);
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (await getDoc(db, "users", user.uid)).data();
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // user has matched with you before you matched with them ...
          console.log(`Hurray, you MATCHED with ${userSwiped.displayName}`);
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          //create a MATCH
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log(
            `You swiped on ${userSwiped.displayName} (${userSwiped.occupation})`
          );
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
    console.log(`You swiped on ${user.displayName} (${userSwiped.occupation})`);
    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-5 items-center flex-row justify-between">
        <TouchableOpacity onPress={logout}>
          <Image
            className="h-10 w-10 rounded-full"
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Modal")}
          className="border-4 border-purple-300/50 rounded-full shadow-2xl"
        >
          <Image
            className="h-14 w-14 rounded-full"
            source={require("../assets/bond.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#570861" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 -mt-6">
        <Swiper
          ref={swipeRef}
          cards={profiles}
          stackSize={5}
          verticalSwipe={false}
          animateCardOpacity
          cardIndex={0}
          infinite={false}
          backgroundColor={"#4FD0E9"}
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe PASS");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe MATCH");
            swipeRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          containerStyle={{ backgroundColor: "transparent" }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                className="relative bg-white h-3/4 rounded-xl"
              >
                <Image
                  className="absolute top-0 h-full w-full rounded-xl"
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={styles.cardShadow}
                  className="px-6 py-2 absolute bottom-0 bg-white w-full h-20 justify-between flex-row items-center rounded-b-xl"
                >
                  <View>
                    <Text className="text-xl font-bold">
                      {card.displayName}
                    </Text>
                    <Text>{card.occupation}</Text>
                  </View>
                  <Text className="text-2xl font-bold">{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                key={999}
                className="relative bg-white h-3/4 rounded-xl justify-center items-center"
                style={styles.cardShadow}
              >
                <Text className="font-bold pb-5">No more profiles</Text>
                <Image
                  className="h-20 w-20"
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>
      <View className="flex-row pb-3 justify-evenly">
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          className="items-center justify-center rounded-full w-16 h-16 bg-red-200"
        >
          <Entypo name="cross" color="red" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          className="items-center justify-center rounded-full w-16 h-16 bg-green-200"
        >
          <AntDesign name="heart" color="green" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
