import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
  Image,
  Button,
} from "react-native";

function MainScreen({ navigation }) {
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
      <View style={styles.categories}>
        <Text>Categories</Text>
        <View>
          <Button
            title="Submit"
            onPress={() => navigation.navigate("Splash")}
          />
        </View>
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

    alignContent: "space-around",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 120,
  },
  midBar: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  topItems: {
    flex: 1,
  },
  journalinput: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "lightgrey",
    alignSelf: "center",
    width: "90%",
  },
  categories: {
    flexDirection: "row",
    flex: 0.2,
  },
});
