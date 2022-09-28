import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { View } from "react-native";
import MainScreen from "./MainScreen";
import SplashScreen from "./SplashScreen";
import CalendarScreen from "./CalendarScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

function TabsScreen(props) {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Tab.Navigator
        initialRouteName="home"
        labeled={false}
        tabBarOptions={{
          showIcon: true,
          showLabel: false,
          indicatorStyle: {
            opacity: 0,
          },
        }}
        barStyle={{ backgroundColor: "" }}
      >
        <Tab.Screen
          key={Date.now()}
          name="home"
          component={MainScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          key={Date.now()}
          name="Calendar"
          component={CalendarScreen}
          navigation={props.navigation}
          options={{
            tabBarLabel: "Calendar",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default TabsScreen;

