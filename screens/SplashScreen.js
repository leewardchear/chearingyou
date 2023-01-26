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
import { BackgroundPrimary, } from "../components/ThemeStyles";

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

    <BackgroundPrimary
      style={{ paddingBottom: 10 }}
    >
      <View style={styles.splash}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("TabsScreen")}
        >
          <Text>ChearIng You</Text>
        </TouchableWithoutFeedback>
      </View>
    </BackgroundPrimary>
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
