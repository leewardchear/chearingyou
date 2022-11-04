import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View } from "react-native";
import MainScreen from "./MainScreen";
import SplashScreen from "./SplashScreen";
import CalendarScreen from "./CalendarScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();
// const Tab = createMaterialBottomTabNavigator();

function TabsScreen(props) {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["#e6d7fd", "#e6d7fd", "#d3dfff"]}
      style={{ flex: 1, paddingBottom: 10 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="home"
          sceneContainerStyle={{ backgroundColor: "transparent" }}
          screenOptions={{
            headerShown: false,
            showIcon: true,
            tabBarInactiveTintColor: "grey",
            tabBarActiveTintColor: "black",
            tabBarShowLabel: false,
            indicatorStyle: {
              opacity: 1,
            },
            tabBarStyle: {
              backgroundColor: "rgba(255,255,255,0.4)",
              color: "white",
              borderRadius: 10,
              height: 80,
              margin: 10,
            },
          }}
        >
          <Tab.Screen
            key={Date.now()}
            name="HomeTab"
            component={MainScreen}
            initialParams={{ newEntry: false, day: {} }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={30} />
              ),
            }}
          />
          <Tab.Screen
            key={Date.now()}
            name="CalendarTab"
            initialParams={{ focusDate: {} }}
            component={CalendarScreen}
            navigation={props.navigation}
            options={{
              tabBarLabel: "Calendar",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="calendar"
                  color={color}
                  size={30}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default TabsScreen;
