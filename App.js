import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import SplashScreen from "./screens/SplashScreen";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { setLoaded, setUnloaded } from "./app/loadedappslice";
import { connect } from "react-redux";
import Database from "./db/database";

const Stack = createStackNavigator();

const database_name = "chearingyou.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;

export class App extends Component {
  constructor(props) {
    super(props);

    // fetchData();
    appisloaded = store.getState().loadedapp.loadedvalue;
  }

  render() {
    return (
      // <MainScreen></MainScreen>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={appisloaded ? "Main" : "Splash"}>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }

  componentDidMount() {
    const db = new Database();
    db.initDatabase();
  }
}

// export default connect (mapStateToProps, mapDispatchToProps)(App);
export default App;
