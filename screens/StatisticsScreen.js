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
  const [datePicked, setDatePicked] = useState([]);
  const [selectedFrequency, setFrequency] = useState(1);
  const [stitle, setTitle] = useState(
    currentDate.monthString + " " + currentDate.year
  );

  const [selectedWeek, setWeekData] = useState([]);
  const [selectedMonth, setMonthData] = useState([]);
  const [selectedYear, setYearData] = useState([]);

  useEffect(() => {
    loadDatesList();
  }, []);

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
    var startDate = moment(currentDate.weekStart)
      .startOf("isoWeek")
      .format("MMM D");
    var endDate = moment(currentDate.weekEnd)
      .endOf("isoWeek")
      .format("MMM D, YYYY");
    return `${startDate} -  ${endDate}`;
  };

  function loadDatesList() {
    db.listAllDates()
      .then((resultSet) => {
        var allEntries = [];

        if (resultSet != null && resultSet.rows != null) {
          for (let i = 0; i < resultSet.rows.length; i++) {
            var dates = resultSet.rows.item(i).savedate;
            allEntries.push(dates);
          }
        }
        setupPickerData(allEntries);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Handle Pressed Events ==========================
  const handleOnDatePressed = () => {
    sheetRef.current.snapTo(1);
    switch (selectedFrequency) {
      case 0:
        setPickerData(selectedWeek);
        break;
      case 1:
        setPickerData(selectedMonth);
        break;
      case 2:
        setPickerData(selectedYear);
        break;
    }
  };

  const onChangeBtnPressed = () => {
    sheetRef.current.snapTo(0);
    setTitle(datePicked);

    var newPickedDate;
    switch (selectedFrequency) {
      case 0:
        const myArray = datePicked.split("-");
        let word = myArray[0];
        newPickedDate = moment(word, "MMM DD, YYYY");
        break;
      case 1:
        newPickedDate = moment(datePicked, "MMM DD, YYYY");
        break;
      case 2:
        newPickedDate = moment(datePicked).startOf("year");
        console.log(newPickedDate);
        break;
    }

    setCurrentMonth({
      dateString: moment(newPickedDate).format("YYYY-MM-DD"),
      day: parseInt(moment(newPickedDate).format("DD")),
      month: parseInt(moment(newPickedDate).format("MM")),
      monthString: moment(newPickedDate).format("MMMM"),
      timestamp: parseInt(moment(newPickedDate).toDate().getTime()),
      year: parseInt(moment(newPickedDate).format("YYYY")),
      weekStart: moment(newPickedDate).startOf("isoWeek").format("YYYY-MM-DD"),
      weekEnd: moment(newPickedDate).endOf("isoWeek").format("YYYY-MM-DD"),
    });
    // console.log({ datePicked, currentDate, datePicked, newPickedDate });
  };

  const handleIndexPressed = (index) => {
    setFrequency(index);
  };
  //================================================

  // BottomSheet Variables
  const sheetRef = React.useRef(null);

  function setupPickerData(allEntries) {
    var maxDate = moment(getMaxDate(allEntries));
    var minDate = moment(getMinDate(allEntries));
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

  const getMaxDate = (allEntries) => {
    return moment.max(allEntries.map((x) => moment(x))).format("YYYY-MM-DD");
  };

  const getMinDate = (allEntries) => {
    return moment.min(allEntries.map((x) => moment(x))).format("YYYY-MM-DD");
  };

  // BackHandler.addEventListener("hardwareBackPress", function () {
  //   if (isOpen) {
  //     console.log(isOpen);
  //   } else {
  //     console.log(isOpen);
  //   }
  // });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "transparent" }}>
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
                  setDatePicked(value);
                }}
                selectLineSize={8}
                selectedValue={selectedWeek}
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
