import React, { useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useSelector, useDispatch } from "react-redux";
import { setLoaded, setUnloaded } from "../app/loadedappslice.js";

function SplashScreen({ navigation }) {
  const loadedvalue = useSelector((state) => state.loadedapp.loadedvalue);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoaded());
    setTimeout(() => {
      navigation.navigate("TabsScreen");
    }, 500);
  });

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0 }}
      colors={["#e6d7fd", "#e6d7fd", "#d3dfff"]}
      style={{ flex: 1, paddingBottom: 10 }}
    >
      <View style={styles.splash}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("TabsScreen")}
        >
          <Text>ChearIng You</Text>
        </TouchableWithoutFeedback>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
export default SplashScreen;
