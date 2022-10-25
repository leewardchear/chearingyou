import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Moment from "moment";
import Database from "../db/database";
import { Colours } from "../constants.js";
import DayList from "../components/DayList.js";
import { setDayListUI } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";
import { current } from "@reduxjs/toolkit";

import moment from "moment";

const db = new Database();

function CalendarScreen({ route, navigation }) {
  const [journalentries, setEntries] = useState({});
  const dispatch = useDispatch();
  const daylistshowing = useSelector((state) => state.calendar.daylistui);
  const [selectedDate, setSelectedDate] = useState("");
  const [sumEntries, setEntrySum] = useState(0);
  const { newEntry } = route.params;

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
      reloadData();
    }, [selectedDate, daylistshowing])
  );

  useEffect(() => {
    reloadData();
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      reloadData();
    });
    return unsubscribe;
  }, [navigation, selectedDate, daylistshowing, sumEntries]);

  return (
    <Animated.View style={[styles.container]}>
      <View>
        <Calendar
          markingType={"custom"}
          markedDates={journalentries}
          onMonthChange={(month) => {
            setCurrentMonth(month);
          }}
          onDayPress={(day) => {
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
          onDayLongPress={(day) => {}}
        />
      </View>

      {/* <ScrollView>
        <MyPieChart month={currentMonth.month} year={currentMonth.year} />
      </ScrollView> */}

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
    backgroundColor: "black",
    flex: 1,
  },
});
