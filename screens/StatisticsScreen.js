import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Dimensions,
  Text,
  Button,
  TouchableNativeFeedback,
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
import { IconButton, Portal, MD3Colors } from "react-native-paper";

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
        setWeeklyStates();
        break;
      case 1:
        setMonthlyStates();
        break;
      case 2:
        setYearlyStates();
        break;
    }
  }, [selectedFrequency]);

  const setWeeklyStates = () => {
    setTitle(getWeekly);
    setPickerData(selectedWeek);
    setDatePicked(stitle);
  };

  const setMonthlyStates = () => {
    setTitle(`${currentDate.monthString} ${currentDate.year}`);
    setPickerData(selectedMonth);
    setDatePicked(stitle);
  };

  const setYearlyStates = () => {
    setTitle(`${currentDate.year}`);
    setPickerData(selectedYear);
    setDatePicked(stitle);
  };

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

  function getPrevious(selectedList, datePicked) {
    var currentIndex = selectedList.indexOf(datePicked);

    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      setDatePicked(selectedList[currentIndex]);
      setTitle(selectedList[currentIndex]);
    }
  }

  function getNext(selectedList, datePicked) {
    var currentIndex = selectedList.indexOf(datePicked);

    if (currentIndex < selectedList.length - 1) {
      currentIndex = currentIndex + 1;
      setDatePicked(selectedList[currentIndex]);
      setTitle(selectedList[currentIndex]);
    }
  }

  // Handle Pressed Events ==========================
  const handleLeftPressed = () => {
    switch (selectedFrequency) {
      case 0:
        getPrevious(selectedWeek, datePicked);
        break;
      case 1:
        getPrevious(selectedMonth, datePicked);
        break;
      case 2:
        getPrevious(selectedYear, datePicked);
        break;
    }
  };

  const handleRightPressed = () => {
    switch (selectedFrequency) {
      case 0:
        getNext(selectedWeek, datePicked);
        break;
      case 1:
        getNext(selectedMonth, datePicked);
        break;
      case 2:
        getNext(selectedYear, datePicked);
        break;
    }
  };

  // useEffect(() => {
  //   console.log("CHINA", datePicked);
  // }, [datePicked]);

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

  const onCloseBottomSheet = () => {
    sheetRef.current.snapTo(0);
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
      weekArray.push(
        weekStart.startOf("isoWeek").format("MMM DD ") +
          " - " +
          weekStart.endOf("isoWeek").format("MMM DD, YYYY")
      );
      weekStart.add(1, "week");
    }
    setWeekData(weekArray);

    while (maxDate > minDate || minDate.format("M") === maxDate.format("M")) {
      monthArray.push(minDate.format("MMMM YYYY"));
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
        borderRadius={10}
        onTabPress={handleIndexPressed}
        tabsContainerStyle={{
          height: 35,
          backgroundColor: "transparent",
          margin: 10,
        }}
        tabStyle={{
          backgroundColor: "#bea2d1",
          borderWidth: 1.5,
          borderColor: "#6d4a85",
        }}
        activeTabStyle={{ backgroundColor: "#75508b" }}
        tabTextStyle={{ color: "white" }}
      />

      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <IconButton
          icon="chevron-left"
          color={"#75508b"}
          size={25}
          onPress={handleLeftPressed}
        />

        <TouchableNativeFeedback
          onPress={handleOnDatePressed}
          background={TouchableNativeFeedback.Ripple("#EEE")}
        >
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 10,
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <Text
              style={{ fontSize: 22, color: "#75508b", textAlign: "center" }}
            >
              {stitle}
            </Text>
          </View>
        </TouchableNativeFeedback>
        <IconButton
          icon="chevron-right"
          color={"#75508b"}
          size={25}
          onPress={handleRightPressed}
        />
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
      <Portal>
        <BottomSheet
          ref={sheetRef}
          snapPoints={[0, SCREEN_HEIGHT / 2]}
          borderRadius={20}
          enabledGestureInteraction={true}
          initialSnap={0}
          renderContent={
            (renderSheetContent = () => (
              <View
                style={{
                  backgroundColor: "white",
                  height: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      paddingLeft: 20,
                      backgroundColor: "#75508b",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        paddingTop: 15,
                      }}
                    >
                      Select a date
                    </Text>

                    <IconButton
                      icon="chevron-down"
                      color={"white"}
                      size={25}
                      onPress={onCloseBottomSheet}
                    />
                  </View>

                  <Picker
                    style={{
                      backgroundColor: "white",
                      width: "100%",
                      height: "70%",
                    }}
                    // selectBackgroundColor="#8080801A"
                    // selectedValue="March"
                    pickerData={pickerData}
                    onValueChange={(value) => {
                      setDatePicked(value);
                      console.log({ pickerData, value });

                      console.log("THIS INDEX: ", pickerData.indexOf(value));
                    }}
                    selectLineSize={5}
                    // selectedValue={selectedWeek}
                  />

                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: "#75508b",
                      padding: 10,
                      margin: 15,
                      width: "75%",
                      borderRadius: 5,
                    }}
                    flex={1}
                    onPress={onChangeBtnPressed}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontStyle: "normal",
                        color: "white",
                      }}
                    >
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        />
      </Portal>
    </Animated.View>
  );
};

export default StatisticsScreen;
