import {
  Animated,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
  View,
} from "react-native";
import { Text as SvgText, Svg, Path, Circle } from "react-native-svg";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMoodUi, setMood } from "../app/journalentry";
import { Colours } from "../constants.js";
import { rgbToHex, hexToRgb } from "../utils/ColorUtils";
import pSBC from "shade-blend-color";

function MoodsButton(props) {
  const dispatch = useDispatch();
  const showmood = useSelector((state) => state.journal.moodshow);

  const openanim = useRef(new Animated.Value(0)).current;
  const radianim = useRef(new Animated.Value(0)).current;
  const [hideButtons, hidem] = useState(false);
  const [angryColor, setAngryColor] = useState(Colours.angry.code);
  const [happyColor, setHappyColor] = useState(Colours.happy.code);
  const [sadColor, setSadColor] = useState(Colours.sad.code);
  const [anxiousColor, setAnxiousColor] = useState(Colours.anxious.code);
  const [surprisedColor, setSurprisedColor] = useState(Colours.surprised.code);
  const [afraidColor, setAfraidColor] = useState(Colours.afraid.code);

  const [mood, setThisMood] = useState(false);

  useEffect(() => {
    Animated.timing(openanim, {
      toValue: 220,
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
  }, []);
  endAnim = () => {
    dispatch(setMoodUi());
    dispatch(setMood(mood));
  };

  toggleShow = (moodclick) => {
    setThisMood(moodclick);
    hidem(false);

    Animated.timing(openanim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start(({ finished }) => {
      endAnim();
    });

    Animated.timing(radianim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start(({ finished }) => {});
  };

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  const PathButton = ({ color, rotation }) => {
    const colorAnim = useRef(new Animated.Value(50)).current;
    var colortest = colorAnim.interpolate({
      inputRange: [0, 300],
      outputRange: [color.code, pSBC(0.8, color.code, "c")],
    });

    const animColor = () => {
      Animated.timing(colorAnim, {
        toValue: 300,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.sin,
      }).start(({ finish }) => {});
    };

    const animColorRev = () => {
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.sin,
      }).start(({ finish }) => {});
    };

    useEffect(() => {}, []);
    return (
      <AnimatedPath
        strokeWidth={2}
        stroke="white"
        transform={rotation}
        onPressIn={() => {
          animColor();
        }}
        onPressOut={() => {
          animColorRev();
        }}
        onPress={() => {
          toggleShow(color.val);
        }}
        d="M0,0 L38.97114317029974,-22.499999999999996 A45,45 0 0 1 38.97114317029974,22.499999999999996 L0,0 A0,0 0 0 0 0,0"
        fill={colortest}
      />
    );
  };

  return (
    <Animated.View
      style={{
        ...styles.animated,
        ...props.style,
        height: openanim,
        borderRadius: radianim,
        padding: radianim,
        // justifyContent: "center",
        // alignContent: "center",
      }}
    >
      {hideButtons && (
        <View
          style={{
            flex: 1,

            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Svg
            style={{
              alignContent: "center",

              borderColor: "red",
              transform: [{ rotate: "0deg" }],
            }}
            width={200}
            height={200}
            // viewBox="-58 -60 120 120"
            viewBox="-47 -47 95 95"
          >
            <PathButton color={Colours.angry} rotation="rotate(60)" />
            <PathButton color={Colours.anxious} rotation="rotate(120)" />
            <PathButton color={Colours.afraid} rotation="rotate(0)" />
            <PathButton color={Colours.sad} rotation="rotate(180)" />
            <PathButton color={Colours.surprised} rotation="rotate(300)" />
            <PathButton color={Colours.happy} rotation="rotate(240)" />

            <Circle cx="0" cy="0" r="15" fill="white" />
            <SvgText x={5} y={30} fill="black" fontSize={5}>
              {Colours.angry.name}
            </SvgText>
            <SvgText x={-25} y={30} fill="black" fontSize={5}>
              {Colours.anxious.name}
            </SvgText>
            <SvgText x={20} y={2} fill="black" fontSize={5}>
              {Colours.afraid.name}
            </SvgText>
            <SvgText x={5} y={-25} fill="black" fontSize={5}>
              {Colours.surprised.name}
            </SvgText>
            <SvgText x={-26} y={-25} fill="black" fontSize={5}>
              {Colours.happy.name}
            </SvgText>
            <SvgText x={-35} y={2} fill="black" fontSize={5}>
              {Colours.sad.name}
            </SvgText>
          </Svg>
        </View>
      )}
    </Animated.View>
  );
}

export default MoodsButton;

const styles = StyleSheet.create({
  buttonrow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  animated: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  buttons: {
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "green",
  },
});
