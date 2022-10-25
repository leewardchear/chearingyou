import { ScrollView } from "react-native-gesture-handler";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MyPieChart from "../components/Charts/PieChart";
import MyLineGraph from "../components/Charts/LineChart";
import React, { useEffect } from "react";

import { useState } from "react";
import moment from "moment";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Animated from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function StatisticsScreen() {
  const [currentDate, setCurrentMonth] = useState({
    dateString: moment().format("YYYY-MM-DD"),
    day: parseInt(moment().format("DD")),
    month: parseInt(moment().format("MM")),
    monthString: moment().format("MMMM"),
    timestamp: parseInt(moment().toDate().getTime()),
    year: parseInt(moment().format("YYYY")),
    weekStart: moment().startOf("isoWeek").format("YYYY-MM-DD"),
    weekEnd: moment().endOf("isoWeek").format("YYYY-MM-DD"),
  });

  const [selectedFrequency, setFrequency] = useState(1);
  const [stitle, setTitle] = useState(
    currentDate.monthString + " " + currentDate.year
  );

  useEffect(() => {
    switch (selectedFrequency) {
      case 0:
        setTitle(getWeekly);
        break;
      case 1:
        setTitle(`${currentDate.monthString} ${currentDate.year}`);
        break;
      case 2:
        setTitle(`${currentDate.year}`);
        break;
    }
  }, [selectedFrequency]);

  const handleIndexChange = (index) => {
    setFrequency(index);
  };

  const getWeekly = () => {
    var startDate = moment().startOf("isoWeek").format("MMM D");
    var endDate = moment().endOf("isoWeek").format("D, YYYY");
    return `${startDate} -  ${endDate}`;
  };

  // const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
  // const STARTING_HEIGHT = -SCREEN_HEIGHT / 1.9; // Change divided by to alter starting height of sheet

  // const BottomSheet = () => {
  //   const translateY = useSharedValue(0);
  //   const context = useSharedValue({ y: 0 });

  //   const gesture = Gesture.Pan()
  //     .onStart(() => {
  //       context.value = { y: translateY.value };
  //     })
  //     .onUpdate((event) => {
  //       translateY.value = event.translationY + context.value.y;
  //       translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
  //     })
  //     .onEnd(() => {
  //       if (translateY.value > -SCREEN_HEIGHT / 1.5) {
  //         translateY.value = withSpring(STARTING_HEIGHT, { damping: 50 });
  //       } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
  //         translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
  //       }
  //     });

  //   const rBottomSheetStyle = useAnimatedStyle(() => {
  //     const borderRadius = interpolate(
  //       translateY.value,
  //       [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
  //       [25, 5],
  //       Extrapolate.CLAMP
  //     );

  //     return {
  //       borderRadius,
  //       transform: [{ translateY: translateY.value }],
  //     };
  //   });

  //   useEffect(() => {
  //     translateY.value = STARTING_HEIGHT;
  //   });

  //   return (
  //     <GestureDetector gesture={gesture}>
  //       <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
  //         <View style={styles.line} />
  //       </Animated.View>
  //     </GestureDetector>
  //   );
  // };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
      <SegmentedControlTab
        values={["Weekly", "Monthly", "Yearly"]}
        selectedIndex={selectedFrequency}
        borderRadius={4}
        onTabPress={handleIndexChange}
        tabsContainerStyle={styles.tabContainer}
        // activeTabStyle={{ backgroundColor: "white", marginTop: 2 }}
        // tabTextStyle={{ color: "#444444", fontWeight: "bold" }}
        // activeTabTextStyle={{ color: "white" }}
      />

      <View>
        <Text style={styles.title}>{stitle}</Text>

        {/* <Calendar
          markingType={"custom"}
          onMonthChange={(month) => {
            setCurrentMonth(month);
          }}
        /> */}
      </View>

      <ScrollView>
        <MyLineGraph
          month={currentDate.month}
          year={currentDate.year}
          weekStart={currentDate.weekStart}
          weekEnd={currentDate.weekEnd}
          frequency={selectedFrequency}
        />
        <MyPieChart
          month={currentDate.month}
          year={currentDate.year}
          weekStart={currentDate.weekStart}
          weekEnd={currentDate.weekEnd}
          frequency={selectedFrequency}
        />
      </ScrollView>
    </Animated.View>
  );
}

export default StatisticsScreen;

const styles = StyleSheet.create({
  tabContainer: {
    height: 35,
    backgroundColor: "black",
    margin: 10,
  },

  title: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 22,
  },

  bottomSheetContainer: {
    position: "absolute",
    borderRadius: 25,
    width: "100%",
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT,
    backgroundColor: "#272727",
    flex: 1,
  },

  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
});
