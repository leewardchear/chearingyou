import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import SplashScreen from "./screens/SplashScreen";
import CalendarScreen from "./screens/CalendarScreen";


const Stack = createStackNavigator();

export class App extends Component {
  render() {
    return (
      // <MainScreen></MainScreen>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Calendar">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }}/>

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  componentDidMount() {}
}

export default App;
