import React, { useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Text,
} from "react-native";
import Database from "../db/database";
import { useState } from "react";
const db = new Database();
import Moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function MainScreen({ route, navigation }) {
  const [entryvalue, setEntryValue] = useState("");
  const { day } = route.params;
  formattedDate = Moment(day.dateString).format("LL");
  console.log(formattedDate);
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      setEntryValue("");
      console.log(formattedDate);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.background]}>
      <View style={styles.topView}>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableHighlight
          style={styles.buttonOverlay}
          onPress={() => {
            navigation.navigate("CalendarTab");
            db.newItem(entryvalue, "happy");
          }}
        >
          <MaterialCommunityIcons
            name="content-save-edit"
            size={25}
            color={"white"}
          />
        </TouchableHighlight>

        <TouchableHighlight 
          style={styles.buttonOverlay} 
          onPress={() => {
          navigation.navigate('ColorWheelScreen')
        }}>
          <Image
            style={styles.colorButton}
            source={require("../assets/color-wheel.png")}
          />
        </TouchableHighlight>
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
    </SafeAreaView>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  topView: {
    flexDirection: "row",
    flex: 0.2,
    marginRight: 15,
  },

  background: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#171A21",
    alignContent: "space-around",
  },

  date: {
    flex: 1,
    alignSelf: "center",
    paddingStart: 30,
    color: "white",
    fontSize: 16,
    alignContent: "space-around",
  },

  noteInput: {
    flex: 0.9,
    padding: 15,
    textAlignVertical: "top",
    backgroundColor: "#F1F0EA",
    alignSelf: "center",
    width: "90%",
    marginBottom: 15,
    fontSize: 18,
    borderRadius: 10,
  },

  buttonOverlay: {
    alignSelf: "center",
    marginRight: 5,
    borderRadius: 10,
    padding: 5,
  },

  colorButton: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 23,
    height: 23,
  },
});
