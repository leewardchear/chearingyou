import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import MainScreen from "./screens/MainScreen";
import SplashScreen from "./screens/SplashScreen";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import CalendarScreen from "./screens/CalendarScreen";

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    appisloaded = store.getState().loadedapp.loadedvalue;
  }
  render() {
    return (
      // <MainScreen></MainScreen>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={appisloaded ? "Calendar" : "Splash"}
          >
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }

  componentDidMount() {}
}

// export default connect (mapStateToProps, mapDispatchToProps)(App);
export default App;
