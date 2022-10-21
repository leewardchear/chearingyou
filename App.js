import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";

import { Provider } from "react-redux";
import { store } from "./store/store.js";

import Database from "./db/database";

import SplashScreen from "./screens/SplashScreen";
import TabsScreen from "./screens/TabsScreen";

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
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={appisloaded ? "TabsScreen" : "Splash"}
          >
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TabsScreen"
              component={TabsScreen}
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
