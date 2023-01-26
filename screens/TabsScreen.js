import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Keyboard, View } from "react-native";
import MainScreen from "./MainScreen";
import ListScreen from "./ListScreen";
import SettingsScreen from "./SettingsScreen";
import CalendarScreen from "./CalendarScreen";
import StatisticsScreen from "./StatisticsScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Portal } from "react-native-paper";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import EntryView from "../components/EntryView";
import { ThemeProvider } from 'styled-components/native';
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

function TabsScreen(props) {
  const [bottomNav, setBottomNav] = useState(
    Platform.OS === "android" ? -50 : -25
  );
  const [marginTop, setMarginTop] = useState(
    Platform.OS === "android" ? 0 : -20
  );
  const calEntry = useSelector((state) => state.calendar.calEntry);
  const theme = useSelector((state) => state.themeActions.theme);
  const entryUi = useSelector((state) => state.calendar.entryUi);

  useEffect(() => {
  }, [entryUi]);

  useEffect(() => {
    const keyboardWillShow = (event) => {
      if (Platform.OS === "android") {
        setBottomNav(event.endCoordinates.height - 0);
        setMarginTop(-90);
      }
    };

    const keyboardWillHide = (event) => {
      if (Platform.OS === "android") {
        setBottomNav(-50);
        setMarginTop(10);
      } else {
        setMarginTop(10);
      }
    };
    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardDidShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);
  useEffect(() => { }, [bottomNav]);

  return (
    <ThemeProvider theme={theme}>

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0 }}
        colors={["white", "white"]}
        style={{ flex: 1, paddingBottom: Platform.OS === "ios" ? 10 : 0 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Portal.Host>
            <Tab.Navigator
              initialRouteName="HomeTab"
              sceneContainerStyle={{ backgroundColor: "transparent" }}
              screenOptions={{
                headerShown: false,
                showIcon: true,
                tabBarInactiveTintColor: theme.PRIMARY_THEME,
                tabBarActiveTintColor: "grey",
                tabBarShowLabel: false,
                // tabBarHideOnKeyboard: Platform.OS === "ios" ? false : true,
                indicatorStyle: {
                  opacity: 1,
                },
                tabBarStyle: {
                  justifyContent: "center",
                  elevation: 0,
                  backgroundColor: theme.SECONDARY_BACKGROUND_COLOR,
                  color: "blue",
                  borderRadius: 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  marginTop: marginTop,
                  height: 80,
                  margin: 0,
                  padding: 0,
                  borderWidth: 0,
                  borderTopWidth: 0,
                  // borderColor: "rgba(255,0,0,0.7)",
                  borderTopColor: "grey",
                  top: bottomNav + 46,
                },
                tabBarItemStyle: {
                  height: 80,
                },
              }}
            >
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
                      size={30}
                    />
                  ),
                }}
              />

              <Tab.Screen
                key={Date.now()}
                name="HomeTab"
                component={MainScreen}
                initialParams={{ newEntry: false, day: {} }}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <View
                      style={{
                        shadowColor: "#000000",

                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        elevation: 4,
                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                      }}
                    >
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.7, y: 0.5 }}
                        colors={["#e6d7fd", "#cdeff9", "#d3dfff"]}
                        style={{
                          top: -10,
                          // backgroundColor: Colours.anxious.code,
                          backgroundColor: "#be94f5",
                          // backgroundColor: "#cdeff9",
                          zIndex: 20,
                          borderRadius: 80,
                          height: 80,
                          width: 80,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          style={{}}
                          color={color}
                          size={40}
                        />
                      </LinearGradient>
                    </View>
                  ),
                }}
              />

              <Tab.Screen
                key={Date.now()}
                name="ListTab"
                initialParams={{ newEntry: {} }}
                component={ListScreen}
                navigation={props.navigation}
                options={{
                  tabBarLabel: "List",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="format-list-bulleted"
                      color={color}
                      size={30}
                    />
                  ),
                }}
              />

              <Tab.Screen
                key={Date.now()}
                name="SettingsTab"
                initialParams={{ newEntry: {} }}
                component={SettingsScreen}
                navigation={props.navigation}
                options={{
                  tabBarLabel: "Settings",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="cog-outline"
                      color={color}
                      size={30}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          </Portal.Host>
        </SafeAreaView>
        {entryUi && (
          <EntryView pointerEvents="none" navigation={props.navigation} />
        )}
      </LinearGradient>
    </ThemeProvider>

  );
}

export default TabsScreen;

