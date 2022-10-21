import React, { useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
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
    <View style={styles.splash}>
      <Button
        title="ChearIng You"
        onPress={() => navigation.navigate("TabsScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
export default SplashScreen;
