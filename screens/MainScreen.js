import React, { useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
  Image,
  Button,
} from "react-native";
import Database from "../db/database";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
const db = new Database();
import { LinearGradient } from "expo-linear-gradient";
import Moment from "moment";

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
    <View style={styles.background}>
      <View style={styles.topBar}>
        <TouchableHighlight>
          <Image source={require("../assets/text.png")}></Image>
        </TouchableHighlight>
        <Text>ChearIng You</Text>
        <TouchableHighlight>
          <Image source={require("../assets/text.png")}></Image>
        </TouchableHighlight>
      </View>

      <View style={styles.midBar}>
        <Text>Mood</Text>
        <Text>{formattedDate}</Text>
        <TouchableHighlight>
          <Image source={require("../assets/text.png")}></Image>
        </TouchableHighlight>
      </View>

      <TextInput
        style={styles.journalinput}
        multiline={true}
        onChangeText={(value) => {
          setEntryValue(value);
        }}
        value={entryvalue}
      ></TextInput>
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          // navigation.navigate("Splash");
          navigation.navigate("CalendarTab");
          db.newItem(entryvalue, "happy");
        }}
      >
        <Text>Submit test</Text>
      </TouchableHighlight>
      <View style={styles.categories}>
        <Text>Categories</Text>
      </View>
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  background: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "teal",

    alignContent: "space-around",
  },
  topBar: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 120,
  },
  midBar: {
    margin: 10,

    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  topItems: {
    flex: 1,
  },
  journalinput: {
    margin: 0,
    padding: 7,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "lightgrey",
    alignSelf: "center",
    width: "90%",
    borderRadius: 10,
  },
  categories: {
    margin: 10,

    flexDirection: "row",
    flex: 0.2,
  },
  button: {
    borderRadius: 10,
    width: 100,
    height: 30,
    margin: 10,

    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
});
