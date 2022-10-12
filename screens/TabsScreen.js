import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { View } from "react-native";
import MainScreen from "./MainScreen";
import CalendarScreen from "./CalendarScreen";
import StatisticsScreen from "./StatisticsScreen";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

function TabsScreen(props) {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Tab.Navigator
        initialRouteName="home"
        labeled={true}
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
          name="New Entry"
          component={MainScreen}
          initialParams={{ day: {} }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="note-edit-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          key={Date.now()}
          name="CalendarTab"
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
          component={StatisticsScreen}
          navigation={props.navigation}
          options={{
            tabBarLabel: "Statistics",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-bar" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default TabsScreen;
