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

import { setMoodUi, setMood } from "../app/journalentry";

function Environment(props) {
  const dispatch = useDispatch();
  const showmood = useSelector((state) => state.journal.moodshow);

  const openanim = useRef(new Animated.Value(0)).current;
  const radianim = useRef(new Animated.Value(0)).current;
  const [hideButtons, hidem] = useState(false);

  const [mood, setThisMood] = useState(false);

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
    dispatch(setMoodUi());
    dispatch(setMood(mood));
  };

  toggleShow = (moodclick) => {
    setThisMood(moodclick);
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
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={() => toggleShow("happy")}>
              <Text>Happy</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={() => toggleShow("angry")}>
              <Text>Angry</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={() => toggleShow("scared")}>
              <Text>Scared</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={() => toggleShow("joyful")}>
              <Text>Joyful</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={() => toggleShow("zen")}>
              <Text>Zen</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.buttons}>
            <TouchableWithoutFeedback onPress={() => toggleShow("sad")}>
              <Text>Sad</Text>
            </TouchableWithoutFeedback>
          </View>
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
