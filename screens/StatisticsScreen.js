import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Dimensions,
  Text,
  TouchableNativeFeedback,
  BackHandler,
  TouchableOpacity, StatusBar
} from "react-native";
import MyPieChart from "../components/Charts/PieChart";
import MyLineGraph from "../components/Charts/LineChart";
import React, { useEffect } from "react";

import { useState } from "react";
import moment from "moment";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { DatePicker } from "react-native-wheel-pick";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import Database from "../db/database";
import { IconButton, Portal } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

const windowHeight = Dimensions.get('window').height;
const screenHeight = Dimensions.get('screen').height;
const navbarHeight = screenHeight - windowHeight - StatusBar.currentHeight;

const db = new Database();
const dayFormat = "DD";
const monthFormat = "MM";
const yearFormat = "YYYY";
const dateFormat = "YYYY-MM-DD";
const monthYearFormat = "MMMM YYYY"

const StatisticsScreen = () => {

  const [currentDate, setCurrentMonth] = useState({
    dateString: moment().format(dateFormat),
    day: parseInt(moment().format(dayFormat)),
    month: parseInt(moment().format(monthFormat)),
    monthString: moment().format("MMMM"),
    timestamp: parseInt(moment().toDate().getTime()),
    year: parseInt(moment().format(yearFormat)),
    weekStart: moment().startOf("isoWeek").format(dateFormat),
    weekEnd: moment().endOf("isoWeek").format(dateFormat),
  });
  const [selectedFrequency, setFrequency] = useState(1);
  const [stitle, setTitle] = useState(
    currentDate.monthString + " " + currentDate.year
  );

  const [datePicked, setDatePicked] = useState();
  const [isOpen, setBottomSheetOpen] = useState(false);

  const [listWeeks, setWeekData] = useState([]);
  const [listMonths, setMonthData] = useState([]);
  const [listYears, setYearData] = useState([]);
  const [minDate, setMinDate] = useState("01/01/2021");
  const [maxDate, setMaxDate] = useState("01/01/2024");
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    loadDatesList();
  }, []);

  useEffect(() => {
  }, [minDate, maxDate, stitle, allResults]);

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
    setTitle(getWeekly(currentDate.weekStart, currentDate.weekEnd));
  };

  const setMonthlyStates = () => {
    setTitle(`${currentDate.monthString} ${currentDate.year}`);
  };

  const setYearlyStates = () => {
    setTitle(`${currentDate.year}`);
  };

  const getWeekly = (start, end) => {
    var startDate = moment(start).startOf("isoWeek").format("MMM DD");
    var endDate = moment(end).endOf("isoWeek").format("MMM DD, YYYY");
    return `${startDate} - ${endDate}`;
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

        setAllResults(allEntries)
        setupData(allEntries);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getPrevious(selectedList) {
    var currentIndex = selectedList.indexOf(stitle);
    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      setTitle(selectedList[currentIndex]);
      changeCurrentDate(selectedList[currentIndex]);
    }
  }

  function getNext(selectedList) {
    var currentIndex = selectedList.indexOf(stitle);
    if (currentIndex < selectedList.length - 1) {
      currentIndex = currentIndex + 1;
      setTitle(selectedList[currentIndex]);
      changeCurrentDate(selectedList[currentIndex]);
    }
  }

  // Handle Pressed Events ==========================

  const handleLeftPressed = () => {
    sheetRef.current.snapTo(0);
    setBottomSheetOpen(false);

    switch (selectedFrequency) {
      case 0:
        getPrevious(listWeeks);
        break;
      case 1:
        getPrevious(listMonths);
        break;
      case 2:
        getPrevious(listYears);
        break;
    }
  };

  const handleRightPressed = () => {
    sheetRef.current.snapTo(0);
    setBottomSheetOpen(false);

    switch (selectedFrequency) {
      case 0:
        getNext(listWeeks);
        break;
      case 1:
        getNext(listMonths);
        break;
      case 2:
        getNext(listYears);
        break;
    }
  };

  const handleOnDatePressed = () => {
    sheetRef.current.snapTo(1);
    setBottomSheetOpen(true);
  };

  const onChangeBtnPressed = () => {
    sheetRef.current.snapTo(0);
    setBottomSheetOpen(false);

    switch (selectedFrequency) {
      case 0:
        setTitle(formatWeekTitle(datePicked))
        break;
      case 1:
        setTitle(moment(datePicked).format(monthYearFormat))
        break;
      case 2:
        setTitle(moment(datePicked).startOf("year").format(yearFormat))
        break;
    }

    setupDate(datePicked)
  };

  const changeCurrentDate = (date) => {

    switch (selectedFrequency) {
      case 0:
        const myArray = date.split("-");
        date = moment(myArray[1], 'MMM-DD-YYYY')
        break;
      case 1:
        date = moment(date, 'MMM-YYYY')
        break;
      case 2:
        date = moment(date).startOf("year");
        break;
    }
    setupDate(date)
  };

  function setupDate(setDate) {
    setCurrentMonth({
      dateString: moment(setDate).format(dateFormat),
      day: parseInt(moment(setDate).format(dayFormat)),
      month: parseInt(moment(setDate).format(monthFormat)),
      monthString: moment(setDate).format("MMMM"),
      timestamp: parseInt(moment(setDate).toDate().getTime()),
      year: parseInt(moment(setDate).format(yearFormat)),
      weekStart: moment(setDate).startOf("isoWeek").format(dateFormat),
      weekEnd: moment(setDate).endOf("isoWeek").format(dateFormat),
    });
  }

  const onCloseBottomSheet = () => {
    sheetRef.current.snapTo(0);
    setBottomSheetOpen(false);
  };

  const handleIndexPressed = (index) => {
    setFrequency(index);
  };
  //================================================

  // BottomSheet Variables
  const sheetRef = React.useRef(null);

  function setupData(allEntries) {
    var maxDate = moment(getMaxDate(allEntries)).endOf('year');
    var minDate = moment(getMinDate(allEntries)).startOf('year');
    var monthArray = [];
    var yearArray = [];
    var weekArray = [];

    let weekStart = moment(minDate, "MMM-DD-YYYY").startOf("year");
    // add two so end date lands on the next week's tuesday which will then be included into the list
    let weekEnd = moment(maxDate, "MMM-DD-YYYY").endOf("year");

    setMinDate(moment(minDate).startOf('year').format("MM/DD/YYYY"));
    setMaxDate(moment(maxDate).endOf('year').format("MM/DD/YYYY"));

    while (weekEnd.isAfter(weekStart)) {
      weekArray.push(formatWeekTitle(weekStart));
      weekStart.add(1, "week");
    }
    setWeekData(weekArray);

    while (maxDate > minDate || minDate.format("M") === maxDate.format("M")) {
      monthArray.push(minDate.format(monthYearFormat));
      if (!yearArray.includes(minDate.format(yearFormat))) {
        yearArray.push(minDate.format(yearFormat));
      }
      minDate.add(1, "month");
    }
    setYearData(yearArray);
    setMonthData(monthArray);
  }

  const getMaxDate = (allEntries) => {
    return moment.max(allEntries.map((x) => moment(x))).format(moment.DATE);
  };

  const getMinDate = (allEntries) => {
    return moment.min(allEntries.map((x) => moment(x))).format(moment.DATE);
  };

  function formatWeekTitle(date) {
    return moment(date).startOf("isoWeek").format("MMM DD") + " - " + moment(date).endOf("isoWeek").format("MMM DD, YYYY")
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isOpen) {
          onCloseBottomSheet();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [isOpen])
  );


  const DatePick = () => {
    return (
      <DatePicker
        style={{
          backgroundColor: "white",
          width: "100%",
          height: navbarHeight == 0 ? 300 : 288,
        }}
        minimumDate={new Date(minDate)}
        maximumDate={new Date(maxDate)}
        selectLineSize={5}
        date={datePicked}
        onDateChange={date => {
          console.log(date)
          setDatePicked(date)
        }}
      />
    );
  }


  return (
    <Animated.View style={{ flex: 1, backgroundColor: "transparent" }}>
      <SegmentedControlTab
        values={["Weekly", "Monthly", "Yearly"]}
        selectedIndex={selectedFrequency}
        borderRadius={5}
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
          alignItems: "center",
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
          background={TouchableNativeFeedback.Ripple("#75508b")}
        >
          <View
            style={{
              height: 40,
              width: "70%",
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 10,
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          >
            <Text
              style={{ fontSize: 20, color: "#75508b", textAlign: "center" }}
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
          allResults={allResults}
        />
        <MyPieChart
          month={currentDate.month}
          year={currentDate.year}
          weekStart={currentDate.weekStart}
          weekEnd={currentDate.weekEnd}
          frequency={selectedFrequency}
          allResults={allResults}
        />
      </ScrollView>
      <Portal>
        <BottomSheet
          ref={sheetRef}
          snapPoints={[0, windowHeight / 2]}
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
                    backgroundColor: "white",
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

                  <DatePick />
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: "#75508b",
                      padding: 10,
                      width: "100%",
                    }}
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
