import React, { useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableHighlight,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Moment from "moment";
import Database from "../db/database";
import { Colours } from "../constants.js";
import DayList from "../components/DayList.js";
import EntryView from "../components/EntryView";

import { setDayListUI, setSelectedDate } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";
import { hideProg, setProgState } from "../app/journalentry";

import { current } from "@reduxjs/toolkit";

import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

const db = new Database();

function CalendarScreen({ route, navigation }) {
  const [journalentries, setEntries] = useState({});
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  const dbdate = useSelector((state) => state.loadedapp.dbupdate);

  const calEntry = useSelector((state) => state.calendar.calEntry);

  const [daylistshowing, setDayListShow] = useState(true);

  const [sumEntries, setEntrySum] = useState(0);

  const { newEntry, focusDate } = route.params;

  const [currentMonth, setCurrentMonth] = useState({
    dateString: moment().format("YYYY-MM-DD"),
    day: parseInt(moment().format("DD")),
    month: parseInt(moment().format("MM")),
    timestamp: parseInt(moment().toDate().getTime()),
    year: parseInt(moment().format("YYYY")),
  });

  function mapColors(colour) {
    if (colour == "") {
      return Colours.default.code;
    }
    try {
      return Colours[colour].code;
    } catch (err) {
      return Colours.default.code;
    }
  }

  function reloadData() {
    console.log("reload");
    db.listItems()
      .then((resultSet) => {
        var marked = {};
        for (let i = 0; i < resultSet.rows.length; i++) {
          formattedDate = Moment(resultSet.rows.item(i).savedate).format(
            "YYYY-MM-DD"
          );
          var dateObj = {
            moodColors: [],
          };

          if (resultSet.rows.item(i).mood != null) {
            dateObj.moodColors = [mapColors(resultSet.rows.item(i).mood)];
          }

          if (typeof marked[formattedDate] === "undefined") {
            marked[formattedDate] = dateObj;
          } else {
            if (resultSet.rows.item(i).mood != null) {
              marked[formattedDate].moodColors.push(
                mapColors(resultSet.rows.item(i).mood)
              );
            }
          }
        }

        for (var key in marked) {
          if (marked[key].moodColors.length == 1) {
            marked[key].moodColors.push(marked[key].moodColors[0]);
          }
        }
        setEntries(marked);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setProgState(0));

      reloadData();
    }, [selectedDate, daylistshowing])
  );

  useEffect(() => {
    // reloadData();
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // reloadData();
    });
    return unsubscribe;
  }, [navigation, selectedDate, daylistshowing, sumEntries]);

  useEffect(() => {}, [newEntry, journalentries]);

  useEffect(() => {
    console.log(dbdate);
    reloadData();
  }, [dbdate]);

  const setDate = (date) => {
    dispatch(setSelectedDate(date));
  };

  const today = new Date().toISOString().split("T")[0];
  return (
    <Animated.View style={{ flex: 1 }}>
      <View>
        <Calendar
          style={{ backgroundColor: "transparent" }}
          theme={{
            backgroundColor: "black",
            calendarBackground: "transparent",
            textSectionTitleColor: "#b6c1cd",
            textSectionTitleDisabledColor: "#d9e1e8",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#00adf5",
            selectedDotColor: "#ffffff",
            arrowColor: "orange",
            disabledArrowColor: "#d9e1e8",
            monthTextColor: "white",
            indicatorColor: "blue",
            textDayFontFamily: "arial",
            textMonthFontFamily: "arial",
            textDayHeaderFontFamily: "arial",
            textDayFontWeight: "300",
            textMonthFontWeight: "normal",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 14,
          }}
          markingType={"custom"}
          markedDates={journalentries}
          onMonthChange={(month) => {
            setCurrentMonth(month);
          }}
          dayComponent={({ date, state }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      typeof journalentries[date.dateString] !== "undefined" &&
                      typeof journalentries[date.dateString].moodColors !==
                        "undefined"
                    ) {
                      setDate(date);
                    } else {
                      setDate(date);
                      // navigation.navigate("HomeTab", { day: day });
                    }
                  }}
                >
                  <LinearGradient
                    style={{
                      borderWidth:
                        selectedDate.dateString == date.dateString ? 2 : 0,
                      borderColor: "white",
                      width: 35,
                      height: 35,
                      borderRadius: 10,
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                    start={{ x: 0, y: 0.5 }} // change angle of the gradient transition
                    end={{ x: 1, y: 1 }}
                    colors={
                      typeof journalentries[date.dateString] === "undefined"
                        ? ["transparent", "transparent"]
                        : journalentries[date.dateString].moodColors
                    }
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: state === "disabled" ? "gray" : "black",
                      }}
                    >
                      {date.day}
                    </Text>
                  </LinearGradient>
                  {Moment().format("YYYY-MM-DD") == date.dateString && (
                    <View
                      style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        borderWidth: 2,
                        borderColor:
                          selectedDate.dateString == date.dateString
                            ? "white"
                            : "black",
                        borderRadius: 10,
                        borderStyle: "dotted",
                      }}
                    ></View>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      <DayList
        style={{ flex: 1 }}
        selecteddate={selectedDate}
        navigation={navigation}
        newEntry={newEntry}
      />
    </Animated.View>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
});
