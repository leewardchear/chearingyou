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
import { setMoodUi } from "../app/journalentry";
import { Colors } from "react-native-paper";
import { Colours } from "../constants.js";

const MainScreen = ({ route, navigation }) => {
  const [entryvalue, setEntryValue] = useState("");

  const [cleft, setLeft] = useState(0);
  const [ctop, setTop] = useState(0);

  const dispatch = useDispatch();
  const showmood = useSelector((state) => state.journal.moodshow);
  const mood = useSelector((state) => state.journal.mood);

  const entryBottom = useRef(new Animated.Value(20)).current;

  const db = new Database();
  const { day } = route.params;
  formattedDate = Moment(day.dateString).format("LL");
  keyboardWillShow = (event) => {
    Animated.timing(entryBottom, {
      duration: event.duration,
      toValue: event.endCoordinates.height - 20,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(entryBottom, {
      duration: event.duration,
      toValue: 20,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start();
  };

  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      setEntryValue("");
    });

    return unsubscribe;
  }, [navigation]);

  mainToggleShow = () => {
    dispatch(setMoodUi());
  };

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "#171A21",
        flex: 0,
        flexGrow: 1,
      }}
      style={{
        flex: 1,
        backgroundColor: "#171A21",
      }}
      pagingEnabled
      directionalLockEnabled
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="always"
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "#171A21",
          paddingBottom: entryBottom,
        }}
      >
        <View style={styles.topView}>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <TextInput
          style={styles.noteInput}
          multiline={true}
          scrollEnabled={true}
          selectionColor={"black"}
          placeholder={"How do you feel today?"}
          onChangeText={(value) => {
            setEntryValue(value);
          }}
          value={entryvalue}
        />
        {showmood && (
          <MoodsButton
            style={{
              position: "relative",
              margin: 10,
              bottom: ctop,

              shadowColor: "#000000",
              shadowOffset: {
                width: -3,
                height: -3,
              },
              shadowRadius: 15,
              shadowOpacity: 0.25,
            }}
          />
        )}

        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <TouchableHighlight
              onPress={mainToggleShow}
              onLayout={(event) => {
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  setLeft(Dimensions.get("window").width - x - width);
                  setTop(y);
                });
              }}
            >
              <View
                style={{
                  ...styles.button,
                  backgroundColor: Colours[mood].code,
                }}
              >
                <Image
                  style={{
                    ...styles.colorButton,
                  }}
                  source={require("../assets/color-wheel.png")}
                />
                <Text>{Colours[mood].name}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                // navigation.navigate("Splash");
                // navigation.navigate("CalendarTab");
                // db.newItem(entryvalue, mood, day.dateString);
                // setEntryValue("");
              }}
            >
              <View style={{ ...styles.button, ...styles.saveButton }}>
                <MaterialCommunityIcons name="content-save-edit" size={32} />
                <Text>Environment</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                // navigation.navigate("Splash");
                db.newItem(entryvalue, mood, day.dateString)
                  .then((resultSet) => {
                    navigation.navigate("CalendarTab", {
                      newEntry: resultSet.insertId,
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });

                setEntryValue("");
              }}
            >
              <View style={{ ...styles.button, ...styles.saveButton }}>
                <MaterialCommunityIcons name="content-save-edit" size={32} />
                <Text>Save</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  topView: {
    flexDirection: "row",
    flex: 0.2,
  },

  background: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#171A21",
  },

  date: {
    flex: 1,
    alignSelf: "center",
    paddingStart: 30,
    color: "white",
    fontSize: 16,
    // fontFamily: "notoserif",
    alignContent: "space-around",
  },

  noteInput: {
    flex: 1,
    padding: 15,
    margin: 10,
    textAlignVertical: "top",
    backgroundColor: "#F1F0EA",
    fontSize: 18,
    borderRadius: 10,
  },

  saveButton: {
    alignSelf: "center",
    color: "white",
    backgroundColor: "blue",
  },

  colorButton: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 32,
    height: 32,
    marginHorizontal: 5,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
