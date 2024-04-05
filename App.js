// In App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CardListScreen from "./screens/CardListScreen";
import CardDetailScreen from "./screens/CardDetailScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CardList">
        <Stack.Screen name="CardList" component={CardListScreen} />
        <Stack.Screen name="CardDetail" component={CardDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
