import React from "react";
import { View, Button, StyleSheet} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { setLoaded, setUnloaded } from '../app/loadedappslice.js'

function SplashScreen({ navigation }) {
    const loadedvalue = useSelector((state) => state.loadedapp.loadedvalue);
    const dispatch = useDispatch();
    console.log(loadedvalue);
    dispatch(setLoaded());
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
