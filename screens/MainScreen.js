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
const db = new Database();
function MainScreen({ navigation }) {
  useEffect(() => {
    db.listItems();
  });
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
        <TouchableHighlight>
          <Image source={require("../assets/text.png")}></Image>
        </TouchableHighlight>
      </View>

      <TextInput style={styles.journalinput} multiline={true} />
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("Splash");
          db.newItem("testest");
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
    backgroundColor: "dodgerblue",
    alignItems: "center",
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
