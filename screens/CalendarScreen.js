import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

function CalendarScreen() {
  return (
    <SafeAreaView style={[styles.container]}>
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

            "2022-09-22": {
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
