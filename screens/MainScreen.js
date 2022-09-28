import React from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function MainScreen({ navigation }) {
  return (
    <SafeAreaView style={[styles.background]}>
      <View style={styles.topView}>
        <Text style={styles.date}>2022 Sept 04 - Friday</Text>
        <MaterialCommunityIcons style={styles.saveButton} name="content-save-edit" size={35} />
        <Image style={styles.colorButton}source={require("../assets/color-wheel.png")} />
      </View>

      <TextInput
        style={styles.noteInput}
        multiline={true}
        scrollEnabled={true}
        selectionColor={'black'}
        placeholder={"How do you feel today?"}
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
    alignSelf: 'center',
    paddingStart: 30,
    color: "white",
    fontSize: 16,
    fontFamily: "notoserif",
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
    alignSelf: 'center',
    color: 'white',
    marginRight: 15,

  },

  colorButton: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginRight: 20,
    width: 32,
    height: 32,
  },
});
