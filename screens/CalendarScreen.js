import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";

function CalendarScreen() {
  return (
    <View>
      <Calendar
        markingType={"custom"}
        markedDates={{
          "2022-09-23": {
            moodColors: ["#272424", "#2F95AF", "#965FB4"],
            selected: true,
            color: "green",
            textColor: "gray",
            customStyles: {
              container: {
                borderRadius: 5,
              },
            },
          },
          "2022-09-04": {
            color: "green",
            selected: true,
            moodColors: ["#272424", "#2F95AF", "#965FB4"],
            customStyles: {
              container: {
                borderRadius: 5,
              },
            },
          },
        }}
      />
    </View>
  );
}

export default CalendarScreen;
