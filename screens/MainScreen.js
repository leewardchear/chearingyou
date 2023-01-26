import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableHighlight,
  Text,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import Database from "../db/database";
import { useSelector, useDispatch } from "react-redux";

import Moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MoodsButton from "../components/MoodsButton";
import ProgressWheel from "../components/ProgressWheel";
import { runOnJS } from "react-native-reanimated";
import {
  setMoodUi,
  setEnvUi,
  setShowEnv,
  setHideEnv,
  setShowMoods,
  setHideMoods,
  setEntryId,
  setMood,
  setEntryValue,
  clearEntry,
  setProgState,
  setEnv,
} from "../app/journalentry";
import { setDbUpdate } from "../app/loadedappslice";
import { Colours } from "../constants.js";
import Environment from "../components/Environment";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";

import { ThemeProvider } from 'styled-components/native';
import { TextPrimary, BackgroundPrimary, MaterialIconCY } from "../components/ThemeStyles";

import AsyncStorage from "@react-native-async-storage/async-storage";

// import ProgressWheel from "../components/ProgressWheel";

const MainScreen = ({ route, navigation }) => {
  const calEntry = useSelector((state) => state.calendar.calEntry);

  const entryvalue = useSelector((state) => state.journal.entryvalue);
  const [entryData, setEntryData] = useState(entryvalue);
  const progState = useSelector((state) => state.journal.progshow);

  const [ctop, setTop] = useState(0);

  const dispatch = useDispatch();
  const showmood = useSelector((state) => state.journal.moodshow);
  const mood = useSelector((state) => state.journal.mood);

  const showenv = useSelector((state) => state.journal.envshow);
  const env = useSelector((state) => state.journal.env);
  const entryId = useSelector((state) => state.journal.entryId);
  const theme = useSelector((state) => state.themeActions.theme);

  const entryBottom = useRef(new Animated.Value(0)).current;

  const db = new Database();
  const { day, newEntry } = route.params;

  // console.log("initday", { day, entryId });
  useFocusEffect(
    React.useCallback(() => {
      if (newEntry) {
        dispatch(clearEntry());
        setEntryData(entryvalue);
        setMood(Colours.default.val);
      }
    }, [newEntry])
  );

  useEffect(() => {
    // console.log("useEffect_calentry", { calEntry });
    if (JSON.stringify(calEntry) !== JSON.stringify({})) {
      // console.log("akosj", { calEntry });

      setEntryData(calEntry.text);
      dispatch(setEntryId(calEntry.id));
      dispatch(setMood(calEntry.mood));
      dispatch(setEnv(calEntry.env));
    }
  }, [calEntry]);

  useEffect(() => {
    if (progState == 3) {
      navigation.navigate("CalendarTab", {
        newEntry: entryId,
        focusDate: day,
      });
    }
  }, [progState]);

  formattedDate = Moment(day.dateString).format("LL");

  useEffect(() => {
    const keyboardWillShow = (event) => {
      Animated.timing(entryBottom, {
        duration: event.duration,
        toValue:
          event.endCoordinates.height - (Platform.OS === "android" ? 230 : 120),
        useNativeDriver: false,
        easing: Easing.sin,
      }).start();
      if (env == "") {
        dispatch(setShowEnv());
      }
      console.log("hidemood");
      dispatch(setHideMoods());
    };

    const keyboardWillHide = (event) => {
      Animated.timing(entryBottom, {
        duration: event.duration,
        toValue: Platform.OS === "android" ? 20 : 0,
        useNativeDriver: false,
        easing: Easing.sin,
      }).start();
    };

    if (Platform.OS === "android") {
      const keyboardDidShowSub = Keyboard.addListener(
        "keyboardDidShow",
        keyboardWillShow
      );
      const keyboardDidHideSub = Keyboard.addListener(
        "keyboardDidHide",
        keyboardWillHide
      );
      return () => {
        keyboardDidShowSub.remove();
        keyboardDidHideSub.remove();
      };
    } else {
      const keyboardWillShowSub = Keyboard.addListener(
        "keyboardWillShow",
        keyboardWillShow
      );
      const keyboardWillHideSub = Keyboard.addListener(
        "keyboardWillHide",
        keyboardWillHide
      );
      return () => {
        keyboardWillShowSub.remove();
        keyboardWillHideSub.remove();
      };
    }
  }, [env]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      setEntryValue("");
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => { }, [env]);
  useEffect(() => {
    // console.log("dismiss");

    if (showmood) {
      dispatch(setHideEnv());
      Keyboard.dismiss();
    } else {
      // dispatch(setShowEnv());
    }
  }, [showmood]);

  useEffect(() => {
    if (showenv) {
      dispatch(setHideMoods());
    } else {
      // dispatch(setShowMoods());
    }
  }, [showenv]);

  var oneSec;
  useEffect(() => {
    console.log("clear");

    oneSec = setTimeout(() => {
      console.log("5 sec.");
      saveEntry();
    }, 5000);

    // console.log("useEffect", { entryId, entryvalue, entryData, mood, env });

    return () => {
      clearTimeout(oneSec);
    };
  }, [mood, env, entryData]);
  saveEntry = () => {
    clearTimeout(oneSec);
    if (entryData === "" && mood === "default" && env === "") {
      console.log("dont save");

      return;
    }

    if (entryId == null) {
      console.log("save new");
      db.newItem(entryData, mood, env, day.dateString)
        .then((resultSet) => {
          var dbupdate = Moment().valueOf();
          storeData(dbupdate);
          dispatch(setDbUpdate(dbupdate));
          dispatch(setEntryId(resultSet.insertId));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("updateItem", entryId);
      db.updateItem(entryId, entryData, mood, env)
        .then((resultSet) => {
          var dbupdate = Moment().valueOf();
          storeData(dbupdate);
          dispatch(setDbUpdate(dbupdate));
          // dispatch(setEntryId(resultSet.insertId));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  mainToggleShow = () => {
    dispatch(setMoodUi());
  };

  envToggleShow = () => {
    dispatch(setEnvUi());
  };

  uiDismiss = () => {
    Keyboard.dismiss();
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart((e) => {
      runOnJS(uiDismiss)("can pass arguments too");
    });

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@db_update", JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GestureDetector gesture={flingGesture}>
        <Animated.View
          style={{
            flex: 1,
            paddingBottom: entryBottom,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignContent: "center",
              padding: 5,
            }}
          >
            <TouchableHighlight
              onPress={() => {
                db.deleteDb();
              }}
            >
              <View>
                <MaterialIconCY
                  name="home"
                  size={50}
                />
              </View>
            </TouchableHighlight>
            <View
              style={{
                padding: 10,
                flexDirection: "column",
                alignSelf: "center",
                justifyContent: "flex-end",
              }}
            >
              <TextPrimary style={styles.date}>{formattedDate}</TextPrimary>
            </View>
          </View>
          <View style={{ flex: 1, marginTop: -20 }}>
            <MoodsButton
              style={{
                zIndex: 10,
                margin: 10,
                backgroundColor: "rgba(0, 0, 0, 0.0)",
                shadowColor: "#000000",

                shadowOffset: {
                  width: -3,
                  height: -3,
                },

                shadowRadius: 2,
                shadowOpacity: 0.25,
              }}
            />
            <TouchableHighlight
              onPress={envToggleShow}
              style={{
                backgroundColor: theme.SECONDARY_BACKGROUND_COLOR,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                marginHorizontal: 25,
                marginTop: showmood ? 20 : 0,
                shadowColor: "#000000",
                shadowOffset: {
                  height: 10,
                },
                shadowRadius: 5,
                shadowOpacity: 0.1,
              }}
            >
              <View style={{ padding: 10, alignSelf: "flex-start" }}>
                <TextPrimary
                  style={{
                    fontStyle: "italic",
                    color: env == "" || env == null ? theme.PRIMARY_TEXT_COLOR : theme.PRIMARY_TEXT_COLOR,
                  }}
                >
                  {env == "" || env == null ? "Select a category" : env}
                </TextPrimary>
              </View>
            </TouchableHighlight>

            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginHorizontal: 25,
                marginBottom: 35,
              }}
            >
              <TextInput
                style={{
                  textAlignVertical: "top",
                  padding: 10,
                  fontSize: 18,
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: theme.SECONDARY_BACKGROUND_COLOR,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  shadowColor: "#000000",
                  shadowOffset: {
                    height: 10,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 0.08,
                }}
                multiline={true}
                scrollEnabled={true}
                selectionColor={"black"}
                placeholder={"How do you feel today?"}
                placeholderStyle={{ fontFamily: "Helvetica", fontSize: 20 }}
                placeholderTextColor={theme.PRIMARY_TEXT_COLOR}
                onChangeText={(value) => {
                  setEntryData(value);
                }}
                value={entryData}
              ></TextInput>
            </View>
            <Environment
              style={{
                position: "relative",
                marginHorizontal: 10,
                bottom: ctop,

                // shadowColor: "#000000",
                // shadowOffset: {
                //   width: -3,
                //   height: -3,
                // },
                // shadowRadius: 15,
                // shadowOpacity: 0.25,
              }}
            />

            <View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableHighlight
                  underlayColor="#DDDDDD"
                  onPress={() => {

                    dispatch(setProgState(1));
                    saveEntry();

                  }}
                >
                  <View style={{ ...styles.button, ...styles.saveButton }}>
                    {progState == 1 && <ProgressWheel />}
                    {progState == 1 && (
                      <Text style={{ fontSize: 17 }}>Saving Note...</Text>
                    )}
                    {progState == 0 && (
                      <Text style={{ fontSize: 17 }}>Save This</Text>
                    )}
                    {progState == 2 && (
                      <Text style={{ fontSize: 17 }}>Note Saved!</Text>
                    )}
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </ThemeProvider>

  );
};

export default MainScreen;

const styles = StyleSheet.create({
  saveButton: {
    alignSelf: "center",
    color: "white",
    backgroundColor: "#7D73C3",
    paddingHorizontal: 60,
  },

  button: {
    borderRadius: 50,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
