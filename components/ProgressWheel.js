import { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
  View,
} from "react-native";
import {
  Text as SvgText,
  Svg,
  Path,
  Circle,
  Symbol,
  Use,
  G,
  ClipPath,
} from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";

import { setProgState } from "../app/journalentry";
import { Colours } from "../constants";

const ProgressWheel = () => {
  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimdSvg = Animated.createAnimatedComponent(Svg);

  const dispatch = useDispatch();

  const spinValue = useRef(new Animated.Value(0)).current;
  const sizeVal = useRef(new Animated.Value(0)).current;
  const nonVal = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  useEffect(() => {
    Animated.timing(sizeVal, {
      toValue: 21,
      duration: 150,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: false,
    }).start((finish) => {
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear, // Easing is an additional import from react-native
        useNativeDriver: false, // To make use of native driver for performance
      }).start((finish) => {
        Animated.timing(sizeVal, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear, // Easing is an additional import from react-native
          useNativeDriver: false,
        }).start((finish) => {
          dispatch(setProgState(2));
          Animated.timing(nonVal, {
            toValue: 0,
            duration: 100,
            easing: Easing.linear, // Easing is an additional import from react-native
            useNativeDriver: false,
          }).start((finish) => {
            dispatch(setProgState(3));
          });
        });
      });
    });
  }, []);
  return (
    <Animated.View style={{ paddingRight: 5 }}>
      <AnimdSvg
        style={{
          alignContent: "center",
          borderColor: "red",
          transform: [{ rotate: spin }],
        }}
        width={sizeVal}
        height={sizeVal}
        viewBox="-50 -50 100 100"
      >
        <AnimatedPath
          strokeWidth={10}
          stroke="white"
          transform="rotate(60)"
          d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
          fill={Colours.angry.code}
        />
        <AnimatedPath
          strokeWidth={10}
          stroke="white"
          transform="rotate(120)"
          d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
          fill={Colours.anxious.code}
        />
        <AnimatedPath
          strokeWidth={10}
          stroke="white"
          transform="rotate(0)"
          d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
          fill={Colours.afraid.code}
        />
        <AnimatedPath
          strokeWidth={10}
          stroke="white"
          transform="rotate(180)"
          d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
          fill={Colours.sad.code}
        />
        <AnimatedPath
          strokeWidth={10}
          stroke="white"
          transform="rotate(300)"
          d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
          fill={Colours.surprised.code}
        />
        <AnimatedPath
          strokeWidth={10}
          stroke="white"
          transform="rotate(240)"
          d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
          fill={Colours.happy.code}
        />

        <Circle cx="0" cy="0" r="18" fill="white" />
      </AnimdSvg>
    </Animated.View>
  );
};

export default ProgressWheel;
