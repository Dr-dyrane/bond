import StackNavigator from "./StackNavigator";
import { AuthProvider } from "./hooks/useAuth";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

export default function App() {
  
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
