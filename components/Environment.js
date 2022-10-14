import {
  Animated,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Colours, Env } from "../constants.js";

import { setEnvUi, setEnv } from "../app/journalentry";

function Environment(props) {
  const dispatch = useDispatch();
  const showenv = useSelector((state) => state.journal.envshow);

  const openanim = useRef(new Animated.Value(0)).current;
  const radianim = useRef(new Animated.Value(0)).current;
  const [hideButtons, hidem] = useState(false);

  const [env, setThisEnv] = useState(false);

  useEffect(() => {
    Animated.timing(openanim, {
      toValue: 300,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start(({ finished }) => {
      hidem(true);
    });

    Animated.timing(radianim, {
      toValue: 10,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start();
  }, [openanim]);
  endAnim = () => {
    dispatch(setEnvUi());
    dispatch(setEnv(env));
  };

  toggleShow = (envclick) => {
    setThisEnv(envclick);
    Animated.timing(openanim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(({ finished }) => {
      endAnim();
    });

    Animated.timing(radianim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(({ finished }) => {});
  };

  const EnvButtons = ({ env, style }) => {
    return (
      <View style={{ ...style, backgroundColor: env.code }}>
        <TouchableWithoutFeedback onPress={() => toggleShow(env.val)}>
          <Text>{env.name}</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        ...styles.animated,
        ...props.style,
        height: openanim,
        width: openanim,
        borderRadius: radianim,
        padding: radianim,
      }}
    >
      {hideButtons && (
        <View>
          <EnvButtons env={Env.home} style={styles.buttons}></EnvButtons>
          <EnvButtons env={Env.work} style={styles.buttons}></EnvButtons>
          <EnvButtons env={Env.park} style={styles.buttons}></EnvButtons>
          <EnvButtons env={Env.restaurant} style={styles.buttons}></EnvButtons>
        </View>
      )}
    </Animated.View>
  );
}

export default Environment;

const styles = StyleSheet.create({
  animated: {
    borderRadius: 10,
    padding: 10,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  buttons: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "green",
  },
});
