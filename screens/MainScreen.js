import React, { useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
} from "react-native";
import Database from "../db/database";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
const db = new Database();
import { LinearGradient } from "expo-linear-gradient";
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
    // <View style={styles.background}>
    //   <View style={styles.topBar}>
    //     <TouchableHighlight>
    //       <Image source={require("../assets/text.png")}></Image>
    //     </TouchableHighlight>
    //     <Text>ChearIng You</Text>
    //     <TouchableHighlight>
    //       <Image source={require("../assets/text.png")}></Image>
    //     </TouchableHighlight>
    //   </View>

    //   <View style={styles.midBar}>
    //     <Text>Mood</Text>
    //     <Text>{formattedDate}</Text>
    //     <TouchableHighlight>
    //       <Image source={require("../assets/text.png")}></Image>
    //     </TouchableHighlight>
    //   </View>

    //   <TextInput
    //     style={styles.journalinput}
    //     multiline={true}
    //     onChangeText={(value) => {
    //       setEntryValue(value);
    //     }}
    //     value={entryvalue}
    //   ></TextInput>
    //   <TouchableHighlight
    //     style={styles.button}
    //     onPress={() => {
    //       // navigation.navigate("Splash");
    //       navigation.navigate("CalendarTab");
    //       db.newItem(entryvalue, "happy");
    //     }}
    //   >
    //     <Text>Submit test</Text>
    //   </TouchableHighlight>
    //   <View style={styles.categories}>
    //     <Text>Categories</Text>
    //   </View>
    // </View>

    <SafeAreaView style={[styles.background]}>
      <View style={styles.topView}>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableHighlight
          style={styles.saveButton}
          onPress={() => {
            // navigation.navigate("Splash");
            navigation.navigate("CalendarTab");
            db.newItem(entryvalue, "happy");
          }}
        >
          <MaterialCommunityIcons name="content-save-edit" size={35} />
        </TouchableHighlight>

        <Image
          style={styles.colorButton}
          source={require("../assets/color-wheel.png")}
        />
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
    // fontFamily: "notoserif",
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

  saveButton: {
    alignSelf: "center",
    color: "white",
    marginRight: 15,
  },

  colorButton: {
    alignSelf: "center",
    resizeMode: "contain",
    marginRight: 20,
    width: 32,
    height: 32,
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
