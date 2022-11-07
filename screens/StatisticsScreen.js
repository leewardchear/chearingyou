import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  BackHandler,
  SegmentedControlIOSComponent,
  TouchableOpacity,
} from "react-native";
import MyPieChart from "../components/Charts/PieChart";
import MyLineGraph from "../components/Charts/LineChart";
import React, { useEffect, useMemo, useRef, useCallback } from "react";

import { useState } from "react";
import moment from "moment";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Picker, DatePicker } from "react-native-wheel-pick";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import Database from "../db/database";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const db = new Database();

const StatisticsScreen = () => {
  const [pickerData, setPickerData] = useState([]);

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
  const [dateFrequency, setDateFrequency] = useState([]);
  const [selectedFrequency, setFrequency] = useState(1);
  const [stitle, setTitle] = useState(
    currentDate.monthString + " " + currentDate.year
  );

  const [selectedWeek, setWeekData] = useState([]);
  const [selectedMonth, setMonthData] = useState([]);
  const [selectedYear, setYearData] = useState([]);

  useEffect(() => {
    switch (selectedFrequency) {
      case 0:
        setTitle(getWeekly);
        setPickerData(selectedWeek);
        break;
      case 1:
        setTitle(`${currentDate.monthString} ${currentDate.year}`);
        setPickerData(selectedMonth);
        break;
      case 2:
        setTitle(`${currentDate.year}`);
        setPickerData(selectedYear);
        break;
    }
  }, [selectedFrequency]);

  const getWeekly = () => {
    var startDate = moment().startOf("isoWeek").format("MMM D");
    var endDate = moment().endOf("isoWeek").format("MMM D, YYYY");
    return `${startDate} -  ${endDate}`;
  };

  function loadDatesList() {
    db.listAllDates()
      .then((resultSet) => {
        var arr = [];

        if (resultSet != null && resultSet.rows != null) {
          for (let i = 0; i < resultSet.rows.length; i++) {
            var dates = resultSet.rows.item(i).savedate;
            arr.push(dates);
          }
        }
        setupMonthData(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Handle Pressed Events ==========================
  const handleOnDatePressed = () => {
    sheetRef.current.snapTo(1);
    loadDatesList();
  };

  const onChangeBtnPressed = () => {
    sheetRef.current.snapTo(0);
    setTitle(dateFrequency);
    console.log(dateFrequency);

    const currentDateObj = {
      dateString: moment().format("YYYY-MM-DD"),
      day: parseInt(moment().format("DD")),
      month: parseInt(moment().format("MM")),
      monthString: moment().format("MMMM"),
      timestamp: parseInt(moment().toDate().getTime()),
      year: parseInt(moment().format("YYYY")),
      weekStart: moment().startOf("isoWeek").format("YYYY-MM-DD"),
      weekEnd: moment().endOf("isoWeek").format("YYYY-MM-DD"),
    };

    setCurrentMonth(currentDateObj);
  };

  const handleIndexPressed = (index) => {
    setFrequency(index);
  };
  //================================================

  // BottomSheet Variables
  const sheetRef = React.useRef(null);

  function setupMonthData(arr) {
    var maxDate = moment(getMaxDate(arr));
    var minDate = moment(getMinDate(arr));
    console.log({ minDate, maxDate });
    var monthArray = [];
    var yearArray = [];
    var weekArray = [];

    let weekStart = moment.utc(minDate, "MMM-DD-YYYY");
    let weekEnd = moment.utc(maxDate, "MMM-DD-YYYY");

    while (weekEnd.isAfter(weekStart)) {
      weekArray.push([
        weekStart.startOf("isoWeek").format("MMM DD, YYYY") +
          " - " +
          weekStart.endOf("isoWeek").format("MMM DD, YYYY"),
      ]);
      weekStart.add(1, "week");
    }
    setWeekData(weekArray);

    while (maxDate > minDate || minDate.format("M") === maxDate.format("M")) {
      monthArray.push(minDate.format("MMMM, YYYY"));
      if (!yearArray.includes(minDate.format("YYYY"))) {
        yearArray.push(minDate.format("YYYY"));
      }
      minDate.add(1, "month");
    }
    setYearData(yearArray);
    setMonthData(monthArray);
  }

  const getMaxDate = (arr) => {
    return moment.max(arr.map((x) => moment(x))).format("YYYY-MM-DD");
  };

  const getMinDate = (arr) => {
    return moment.min(arr.map((x) => moment(x))).format("YYYY-MM-DD");
  };

  // BackHandler.addEventListener("hardwareBackPress", function () {
  //   if (isOpen) {
  //     console.log(isOpen);
  //   } else {
  //     console.log(isOpen);
  //   }
  // });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
      <SegmentedControlTab
        values={["Weekly", "Monthly", "Yearly"]}
        selectedIndex={selectedFrequency}
        borderRadius={4}
        onTabPress={handleIndexPressed}
        tabsContainerStyle={styles.tabContainer}
        // activeTabStyle={{ backgroundColor: "white", marginTop: 2 }}
        // tabTextStyle={{ color: "#444444", fontWeight: "bold" }}
        // activeTabTextStyle={{ color: "white" }}
      />

      <View>
        <Text style={styles.title} onPress={handleOnDatePressed}>
          {stitle}
        </Text>
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

      <BottomSheet
        ref={sheetRef}
        snapPoints={[0, (SCREEN_HEIGHT + 300) / 3]}
        borderRadius={10}
        enabledGestureInteraction={true}
        initialSnap={0}
        renderContent={
          (renderSheetContent = () => (
            <View
              style={{
                backgroundColor: "white",
                paddingLeft: 20,
                paddingRight: 20,
                height: "100%",
              }}
            >
              <View style={[styles.line]}></View>
              <Picker
                style={[styles.picker]}
                // selectBackgroundColor="#8080801A"
                // selectedValue="March"
                pickerData={pickerData}
                onValueChange={(value) => {
                  setDateFrequency(value);
                }}
                selectLineSize={8}
              />

              <TouchableOpacity
                style={styles.changeBtn}
                onPress={onChangeBtnPressed}
              >
                <Text style={styles.btnText}>CHANGE</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      />
    </Animated.View>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  tabContainer: {
    height: 35,
    backgroundColor: "black",
    margin: 10,
  },

  title: {
    color: "white",
    margin: 10,
    marginLeft: 20,
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

  picker: {
    backgroundColor: "white",
    width: "100%",
    height: "75%",
  },

  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },

  changeBtn: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 10,
  },

  btnText: {
    fontSize: 18,
    fontStyle: "normal",
  },
});
