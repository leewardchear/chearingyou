import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import Moment from "moment";

import Database from "../db/database";
import { isRejected } from "@reduxjs/toolkit";
const db = new Database();

function CalendarScreen({ route, navigation }) {
  const [journalentries, setEntries] = useState({});

  function reloadData() {
    db.listItems()
      .then((resultSet) => {
        var marked = {};
        for (let i = 0; i < resultSet.rows.length; i++) {
          console.log(resultSet.rows.item(i));
          formattedDate = Moment(resultSet.rows.item(i).date).format(
            "YYYY-MM-DD"
          );
          if (resultSet.rows.item(i).mood != null) {
            var dateObj = {
              moodColors: [resultSet.rows.item(i).mood],
              color: "green",
              selected: true,
              customStyles: {
                container: {
                  borderRadius: 5,
                },
              },
            };
          } else {
            var dateObj = {
              moodColors: [],
              color: "green",
            };
          }
          if (typeof marked[formattedDate] === "undefined") {
            marked[formattedDate] = dateObj;
          } else {
            if (resultSet.rows.item(i).mood != null) {
              marked[formattedDate].moodColors.push(
                resultSet.rows.item(i).mood
              );
            }
            // entries[formattedDate] = test;
          }
        }

        setEntries(marked);
        // console.log(marked);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    reloadData();
    // setEntries(stuff);
    // db.fakeData();
    console.log(JSON.stringify(journalentries, null, 2));

    const unsubscribe = navigation.addListener("tabPress", (e) => {
      reloadData();
      console.log(JSON.stringify(journalentries, null, 2));

      // setEntries(stuff);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView style={[styles.container]}>
      <View>
        <Calendar
          markingType={"custom"}
          markedDates={journalentries}
          onDayPress={(day) => {
            navigation.navigate("HomeTab", { day: day });
            // console.log("selected day", day);
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {
            // console.log("selected day", day);
          }}
        ></Calendar>
      </View>
      <LinearGradient
        colors={["black", "teal", "teal"]}
        style={{
          flex: 1,
        }}
      />
    </SafeAreaView>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
