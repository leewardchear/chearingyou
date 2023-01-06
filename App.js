import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";

import { connect, Provider } from "react-redux";
import { store } from "./store/store.js";

import { setDbUpdate } from "./app/loadedappslice.js";

import Database from "./db/database";
import SplashScreen from "./screens/SplashScreen";
import TabsScreen from "./screens/TabsScreen";
import { AppState } from "react-native";
import { bindActionCreators } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const database_name = "chearingyou.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Databa se";
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
        <ConnectedRoot />
      </Provider>
    );
  }

  componentDidMount() {}
}

export default App;

export class ConnectedContainer extends Component {
  getDbUpdate = async (props) => {
    console.log("getDbUpdate");
    try {
      const dbupdate = await AsyncStorage.getItem("@db_update");
      console.log("dbupdate", dbupdate);

      if (dbupdate !== null) {
        return dbupdate;
      }
    } catch (e) {
      console.log("getDbUpdate exception", e);
      // error reading value
    }
  };
  componentDidMount() {
    const db = new Database();
    db.initDatabase();

    AppState.addEventListener("change", (state) => {
      console.log("compdismount", this.props);
      this.getDbUpdate();
      // this.props.setDbUpdate("test");
    });
  }
  render() {
    return (
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
    );
  }
}

const mapDispatchToProps = { setDbUpdate };

const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedContainer);

const mapStateToProps = (state) => ({
  dbupdate: state.loadedappslice.dbupdate,
});
// const mapDispatchToProps = (dispatch) => {
//   return {
//     dbupdate: (number) => dispatch(setDbUpdate(number)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
