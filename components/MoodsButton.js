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
  TSpan,
} from "react-native-svg";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setMoodUi,
  setMood,
  setShowMoods,
  setHideMoods,
} from "../app/journalentry";
import { Colours } from "../constants.js";
import { rgbToHex, hexToRgb } from "../utils/ColorUtils";
import pSBC from "shade-blend-color";

function MoodsButton(props) {
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
  const MoodCircle = ({ moods }) => {
    console.log({ moods });
    var angleincrement = moods.length > 0 ? 360 / moods.length : 1;
    useEffect(() => {}, []);
    return (
      <G>
        <Circle
          cx="0"
          cy="0"
          r="15"
          fill="red"
          onPress={() => {
            toggleShow(Colours.default.val);
          }}
        />
        {moods.map((item, i) => (
          <Wedgie
            size={angleincrement}
            arrkey={i}
            item={item}
            length={moods.length}
          />
        ))}
      </G>
    );
  };

  const Wedgie = ({ size, arrkey, item, length }) => {
    var x1, y1, x2, y2;
    var calcWedge = () => {
      console.log("wedgie");
      var startPointX = 0;
      var startPointY = 0;
      var startAngle = size * arrkey - 90;
      var endAngle = startAngle + size;
      var radius = 45;

      x1 = startPointX + radius * Math.cos((Math.PI * startAngle) / 180);
      y1 = startPointY + radius * Math.sin((Math.PI * startAngle) / 180);
      x2 = startPointX + radius * Math.cos((Math.PI * endAngle) / 180);
      y2 = startPointY + radius * Math.sin((Math.PI * endAngle) / 180);

      var textr = radius / 1;
      r1 = startPointX + textr * Math.cos((Math.PI * startAngle) / 180);
      r2 = startPointY + textr * Math.sin((Math.PI * startAngle) / 180);

      t1 = (x1 + x2) / 2.5;
      t2 = (y1 + y2) / 2.5;

      var shapeStr =
        "M" +
        startPointX +
        " " +
        startPointY +
        " L" +
        x1 +
        " " +
        y1 +
        " A" +
        radius +
        " " +
        radius +
        " 0 0 1 " +
        x2 +
        " " +
        y2 +
        " z";
      console.log(JSON.stringify({ mood: item.mood, t1, t2 }, null, 2));
      return shapeStr;
    };
    useEffect(() => {
      calcWedge();
    }, []);
    return (
      <G>
        <AnimatedPath
          strokeWidth={0}
          stroke="white"
          d={calcWedge()}
          fill={item.color}
          // transform={"rotate(-90)"}
          onPress={(e) => {
            console.log(item.mood);
          }}
        />
        {/* <Circle cx={x1} cy={y1} r="1" fill="pink" />
        <Circle cx={x2} cy={y2} r="1" fill="white" />
        <Circle cx={t1} cy={t2} r="1" fill="pink" /> */}
        <SvgText x={t1} y={t2} fill="black" fontSize={5} textAnchor="middle">
          {item.mood}
        </SvgText>
      </G>
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
          <AnimdSvg
            style={{
              alignContent: "center",
              transform: [{ rotate: "0deg" }],
            }}
            width={openanim}
            height={openanim}
            viewBox="-47 -47 95 95"
          >
            {/* <PathButton color={Colours.angry} rotation="rotate(60)" />
            <PathButton color={Colours.anxious} rotation="rotate(120)" />
            <PathButton color={Colours.afraid} rotation="rotate(0)" />
            <PathButton color={Colours.sad} rotation="rotate(180)" />
            <PathButton color={Colours.surprised} rotation="rotate(300)" />
            <PathButton color={Colours.happy} rotation="rotate(240)" /> */}
            <MoodCircle
              moods={[
                { mood: "happy", color: "rgba(255,0,0,1)" },
                { mood: "sad", color: "rgba(0,255,0,1)" },
                { mood: "anxious", color: "rgba(0,0,255,1)" },
                { mood: "bored", color: "rgba(255,0,0,1)" },
                { mood: "tired", color: "rgba(0,255,0,1)" },
                {
                  mood: "annoyed",
                  color: "rgba(0,0,255,1)",
                  subnmoods: [
                    { mood: "happy", color: "rgba(255,0,0,1)" },
                    { mood: "sad", color: "rgba(0,255,0,1)" },
                    { mood: "anxious", color: "rgba(0,0,255,1)" },
                  ],
                },
                { mood: "happy", color: "rgba(255,0,0,1)" },
                { mood: "sad", color: "rgba(0,255,0,1)" },
                { mood: "anxious", color: "rgba(0,0,255,1)" },
                { mood: "happy", color: "rgba(255,0,0,1)" },
                { mood: "sad", color: "rgba(0,255,0,1)" },
                { mood: "anxious", color: "rgba(0,0,255,1)" },
              ]}
            />
            <Circle
              cx="0"
              cy="0"
              r="15"
              fill="white"
              onPress={() => {
                toggleShow(Colours.default.val);
              }}
            />
            {/* {relation && (
              <G>
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
              </G>
            )} */}

            {!relation && (
              <Circle
                cx="0"
                cy="0"
                r="42"
                fill={
                  typeof Colours[mood] != "undefined"
                    ? Colours[mood].code == Colours.default.code
                      ? "rgba(0,0,0,0)"
                      : Colours[mood].code
                    : "transparent"
                }
                stroke="white"
                strokeWidth="4"
                onPress={() => {
                  dispatch(setShowMoods());
                }}
              />
            )}
          </AnimdSvg>
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
