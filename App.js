import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import SplashScreen from "./screens/SplashScreen";
import { Provider } from "react-redux";
import {store}from "./store/store.js";
import { setLoaded, setUnloaded } from "./app/loadedappslice";
import { connect } from "react-redux";

const Stack = createStackNavigator();

export class App extends Component {
  
  render() {
    return (
      // <MainScreen></MainScreen>
      <Provider store={ store }>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }

  componentDidMount() {}
}

const mapStatToProps = (state) => {
  return {
    isapploaded: state.loaded
  }
}

const mapDispatchToProps = {
  setLoaded, setUnloaded
}

// export default connect (mapStatToProps, mapDispatchToProps)(App);
export default App;
