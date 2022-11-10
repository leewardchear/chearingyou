import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import Database from "../db/database";
import { useSelector, useDispatch } from "react-redux";

import { LinearGradient } from "expo-linear-gradient";
import Moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MoodsButton from "../components/MoodsButton";
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
} from "../app/journalentry";
import { Colors } from "react-native-paper";
import { Colours } from "../constants.js";
import Environment from "../components/Environment";
import { useFocusEffect } from "@react-navigation/native";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";

const MainScreen = ({ route, navigation }) => {
  const entryvalue = useSelector((state) => state.journal.entryvalue);
  const [entryData, setEntryData] = useState(entryvalue);

  const [cleft, setLeft] = useState(0);
  const [ctop, setTop] = useState(0);

  const dispatch = useDispatch();
  const showmood = useSelector((state) => state.journal.moodshow);
  const mood = useSelector((state) => state.journal.mood);

  const showenv = useSelector((state) => state.journal.envshow);
  const env = useSelector((state) => state.journal.env);
  const entryId = useSelector((state) => state.journal.entryId);

  const entryBottom = useRef(new Animated.Value(0)).current;

  const db = new Database();
  const { day, newEntry } = route.params;
  // console.log("initday", { day, entryId });

  useFocusEffect(
    React.useCallback(() => {
      if (newEntry) {
        console.log(mood);
        dispatch(clearEntry());
        setEntryData(entryvalue);
        setMood(Colours.default.val);
      }
    }, [newEntry])
  );

  useEffect(() => {
    console.log("entryId", entryId);
    if (entryId != null) {
      db.getItem(entryId)
        .then((resultSet) => {
          // console.log(resultSet.rows.item(0));
          setEntryData(resultSet.rows.item(0).text);
          dispatch(setMood(resultSet.rows.item(0).mood));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [entryId]);

  formattedDate = Moment(day.dateString).format("LL");

  useEffect(() => {
    const keyboardWillShow = (event) => {
      Animated.timing(entryBottom, {
        duration: event.duration,
        toValue: event.endCoordinates.height - 135,
        useNativeDriver: false,
        easing: Easing.sin,
      }).start();
      console.log("env", env);

      if (env == "") {
        dispatch(setShowEnv());
      }
      dispatch(setHideMoods());
    };

    const keyboardWillHide = (event) => {
      Animated.timing(entryBottom, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
        easing: Easing.sin,
      }).start();
    };
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
  }, [env]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      setEntryValue("");
    });

    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   console.log("mood change", mood);
  // }, [mood]);

  useEffect(() => {}, [env]);
  useEffect(() => {
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

  useEffect(() => {
    // console.log("useEffect", { entryData, mood, env, day, entryId });

    if (entryData === "" && mood === "default" && env === "") {
      return;
    }
    if (entryId == null) {
      db.newItem(entryData, mood, env, day.dateString)
        .then((resultSet) => {
          console.log("useEffect", resultSet.insertId);

          dispatch(setEntryId(resultSet.insertId));
          storeDraft(resultSet.insertId);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("updateItem", entryId);

      db.updateItem(entryId, entryData, mood, env)
        .then((resultSet) => {
          // dispatch(setEntryId(resultSet.insertId));
          storeDraft(resultSet.insertId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [mood, env, entryData]);

  const getDraft = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@lastentry");

      if (jsonValue != null) {
        setCategories(JSON.parse(jsonValue));
      }
    } catch (e) {
      // error reading value
    }
  };

  const storeDraft = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@lastentry", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  mainToggleShow = () => {
    dispatch(setMoodUi());
  };

  envToggleShow = () => {
    dispatch(setEnvUi());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart((e) => {
      Keyboard.dismiss();
    });

  return (
    <GestureDetector gesture={flingGesture}>
      <Animated.View
        style={{
          // borderWidth: 1,
          // borderColor: "red",
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
              db.deleteAll();
            }}
          >
            <View>
              <MaterialCommunityIcons
                name="microsoft-xbox-controller-menu"
                size={60}
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
            <Text style={styles.date}>{formattedDate}</Text>
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
              backgroundColor: "#F1F0EA",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              marginHorizontal: 10,
              marginTop: showmood ? 40 : 0,
            }}
          >
            <View style={{ padding: 10, alignSelf: "flex-start" }}>
              <Text
                style={{
                  fontStyle: "italic",
                  color:
                    env == "" || env == null
                      ? "lightgrey"
                      : Colours.default.code,
                }}
              >
                {env == "" || env == null ? "Select a category" : env}
              </Text>
            </View>
          </TouchableHighlight>

          <View
            style={{
              flex: 1,
              flexDirection: "column",

              marginHorizontal: 10,
              marginBottom: 10,
            }}
          >
            <TextInput
              style={{
                ...styles.noteInput,
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#F1F0EA",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
              multiline={true}
              scrollEnabled={true}
              selectionColor={"black"}
              placeholder={"How do you feel today?"}
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
                onPress={() => {
                  // navigation.navigate("Splash");
                  navigation.navigate("CalendarTab", {
                    newEntry: entryId,
                    focusDate: day,
                  });

                  // setEntryData("");
                }}
              >
                <View style={{ ...styles.button, ...styles.saveButton }}>
                  <Text style={{ fontSize: 17 }}>Save This</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  topView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  background: {
    flexDirection: "column",
    flex: 1,
  },

  date: {
    color: "white",
    fontSize: 20,
    textAlignVertical: "bottom",
    // fontFamily: "notoserif",
  },

  noteInput: {
    textAlignVertical: "top",
    padding: 10,
    fontSize: 18,
  },

  saveButton: {
    alignSelf: "center",
    color: "white",
    backgroundColor: "#be94f5",
  },

  colorButton: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 32,
    height: 32,
    marginHorizontal: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
