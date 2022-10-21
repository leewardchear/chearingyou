import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { View } from "react-native";
import MainScreen from "./MainScreen";
import SplashScreen from "./SplashScreen";
import CalendarScreen from "./CalendarScreen";
import StatisticsScreen from "./StatisticsScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialBottomTabNavigator();

function TabsScreen(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Tab.Navigator
        initialRouteName="home"
        labeled={false}
        tabBarOptions={{
          style: { height: 0 },
          showIcon: true,
          showLabel: false,
          indicatorStyle: {
            opacity: 0,
          },
        }}
        barStyle={{ backgroundColor: "black" }}
      >
        <Tab.Screen
          key={Date.now()}
          name="HomeTab"
          component={MainScreen}
          initialParams={{ day: {} }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          key={Date.now()}
          name="CalendarTab"
          initialParams={{ newEntry: {} }}
          component={CalendarScreen}
          navigation={props.navigation}
          options={{
            tabBarLabel: "Calendar",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          key={Date.now()}
          name="StatisticsTab"
          initialParams={{ newEntry: {} }}
          component={StatisticsScreen}
          navigation={props.navigation}
          options={{
            tabBarLabel: "Statistics",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-bar"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default TabsScreen;
