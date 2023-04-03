import {
  Animated,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
  View,
  Dimensions,
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
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setMoodUi,
  setMood,
  setShowMoods,
  setHideMoods,
} from "../app/journalentry";
import { PieMenu, Slice } from "react-pie-menu";
import { Colours } from "../constants.js";
import { rgbToHex, hexToRgb } from "../utils/ColorUtils";
import pSBC from "shade-blend-color";

function PieMoodMenu(props) {
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get("window").width;
  const openanim = useRef(new Animated.Value(80)).current;
  const radianim = useRef(new Animated.Value(0)).current;
  const [hideButtons, hidem] = useState(true);

  const [mood, setThisMood] = useState(Colours.default.val);
  const [relation, setRelation] = useState(false);

  const showmood = useSelector((state) => state.journal.moodshow);
  const statemood = useSelector((state) => state.journal.mood);

  const hideMoods = () => {
    Animated.timing(openanim, {
      toValue: 80,
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
  useEffect(() => {
    if (showmood) {
      showMoods();
      setRelation(true);
    } else {
      hideMoods();
    }
  }, [showmood]);
  const endAnim = () => {
    setRelation(false);
    dispatch(setMood(mood));
  };

  useEffect(() => {}, [relation]);

  useEffect(() => {
    setThisMood(statemood);
  }, [statemood]);

  const showMoods = () => {
    Animated.timing(openanim, {
      toValue: windowWidth - 45,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start(({ finished }) => {
      // hidem(true);
    });

    Animated.timing(radianim, {
      toValue: 10,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start();
  };

  toggleShow = (moodclick) => {
    setThisMood(moodclick);
    hideMoods();
    dispatch(setHideMoods());
    // hidem(false);
  };

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimdSvg = Animated.createAnimatedComponent(Svg);

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
        strokeWidth={0.3}
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
        position: "relative",
        height: openanim,
        marginLeft: 360,
        borderRadius: radianim,
        padding: radianim,
        marginBottom: relation ? 15 : -38,
        marginRight: relation ? 10 : 20,
      }}
    >
      {hideButtons && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <PieMenu radius="125px" centerRadius="30px" centerX={x} centerY={y}>
            <Slice>
              <Text>Test</Text>
            </Slice>
            <Slice
              onSelect={() => window.open("https://www.facebook.com", "_blank")}
            >
              <Text>Test</Text>
            </Slice>
            <Slice
              onSelect={() => window.open("https://www.twitter.com", "_blank")}
            >
              <Text>Test</Text>
            </Slice>
            <Slice
              onSelect={() => window.open("https://www.linkedin.com", "_blank")}
            >
              <Text>Test</Text>
            </Slice>
            <Slice
              onSelect={() =>
                window.open(
                  "https://github.com/psychobolt/react-pie-menu",
                  "_blank"
                )
              }
            >
              <Text>Test</Text>
            </Slice>
            <Slice
              onSelect={() =>
                window.open("https://en.wikipedia.org/wiki/RSS", "_blank")
              }
            >
              <Text>Test</Text>
            </Slice>
            <Slice
              onSelect={() =>
                window.open("https://www.pinterest.com/", "_blank")
              }
            >
              <Text>Test</Text>
            </Slice>
            <Slice>
              <Text>Test</Text>
            </Slice>
          </PieMenu>
        </View>
      )}
    </Animated.View>
  );
}

export default PieMoodMenu;

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
