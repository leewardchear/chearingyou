import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Animated } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  WeekCalendar,
} from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import Moment from "moment";

import Database from "../db/database";
import { isRejected } from "@reduxjs/toolkit";
import { Colours } from "../constants.js";
import DayList from "../components/DayList.js";
import { setDayListUI } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";

const db = new Database();

function CalendarScreen({ route, navigation }) {
  const [journalentries, setEntries] = useState({});
  // const [daylistshowing, showDayList] = useState(false);
  const dispatch = useDispatch();

  const { newEntry, focusDate } = route.params;
  const daylistshowing = useSelector((state) => state.calendar.daylistui);
  const [selectedDate, setSelectedDate] = useState({
    dateString: Moment(focusDate.dateString).format("YYYY-MM-DD"),
  });
  const [sumentries, setEntrySum] = useState(0);

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
    db.listItems()
      .then((resultSet) => {
        var marked = {};
        var childCount = 0;
        for (let i = 0; i < resultSet.rows.length; i++) {
          formattedDate = Moment(resultSet.rows.item(i).savedate).format(
            "YYYY-MM-DD"
          );
          var dateObj = {
            moodColors: [],
            color: "green",
            selected: true,
            customStyles: {
              container: {
                borderRadius: 5,
              },
            },
          };

          if (resultSet.rows.item(i).mood != null) {
            dateObj.moodColors = [mapColors(resultSet.rows.item(i).mood)];
          }

          if (typeof marked[formattedDate] === "undefined") {
            childCount++;
            marked[formattedDate] = dateObj;
          } else {
            if (resultSet.rows.item(i).mood != null) {
              marked[formattedDate].moodColors.push(
                mapColors(resultSet.rows.item(i).mood)
              );
            }
            // entries[formattedDate] = test;
          }
        }

        for (var key in marked) {
          if (marked[key].moodColors.length == 1) {
            marked[key].moodColors.push(marked[key].moodColors[0]);
          }
        }
        setEntries(marked);
        // console.log("marked", JSON.stringify(marked, null, 2));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useFocusEffect(
    React.useCallback(() => {
      // console.log("useFocusEffect_sd", selectedDate);
      reloadData();
    }, [selectedDate, daylistshowing])
  );

  useEffect(() => {
    reloadData();
    // setEntries(stuff);
    // db.fakeData();
    // console.log(JSON.stringify(journalentries, null, 2));

    const unsubscribe = navigation.addListener("tabPress", (e) => {
      reloadData();
      // console.log(JSON.stringify(journalentries, null, 2));

      // setEntries(stuff);
    });

    return unsubscribe;
  }, [navigation, selectedDate, daylistshowing, sumentries]);

  useEffect(() => {}, [newEntry, journalentries]);

  const today = new Date().toISOString().split("T")[0];
  return (
    <Animated.View style={{ flex: 1 }}>
      <View>
        <Calendar
          style={{ borderWidth: 1, borderColor: "gray" }}
          theme={{
            backgroundColor: "black",
          }}
          markingType={"custom"}
          markedDates={journalentries}
          onDayPress={(day) => {
            // navigation.navigate("HomeTab", { day: day });

            if (
              typeof journalentries[day.dateString] !== "undefined" &&
              typeof journalentries[day.dateString].moodColors !== "undefined"
            ) {
              dispatch(setDayListUI(true));
              setSelectedDate(day);
              setEntrySum(journalentries[day.dateString].moodColors.length);
            } else {
              navigation.navigate("HomeTab", { day: day });
            }
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {
            // console.log("selected day", day);
          }}
        ></Calendar>
      </View>

      {daylistshowing && (
        <DayList
          style={{ flex: 1 }}
          selecteddate={selectedDate}
          navigation={navigation}
          newEntry={newEntry}
        />
      )}
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
