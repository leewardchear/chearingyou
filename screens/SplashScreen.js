import React from "react";
import { View, Button, StyleSheet} from "react-native";

function SplashScreen({ navigation }) {
    setTimeout(()=> {
        navigation.replace('Main');
    }, 500);
  return (
    <View style={styles.splash}>
      <Button
        title="ChearIng You"
        onPress={() => navigation.navigate("Main")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center"
    }
})
export default SplashScreen;
