import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

function CalendarScreen() {
  return (
    <View>
      <Calendar
        markingType={"custom"}
        markedDates={{
          "2022-09-20": { textColor: "green" },
          "2022-09-22": { selected: true, color: "red" },
          "2022-09-23": {
            customStyles: {
                container: {
                    backgroundColor: 'green',
                    borderRadius: 5,
                    
                  },
            },
            selected: true,
            color: "green",
            textColor: "gray",
          },
          "2022-09-04": {
            disabled: true,
            startingDay: true,
            color: "green",
           
          },
        }}
      />
    </View>
  );
}

export default CalendarScreen;
