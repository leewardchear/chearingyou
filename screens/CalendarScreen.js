import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Animated } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  WeekCalendar,
} from "react-native-calendars";
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
import {
  LineChart,
  Grid,
  YAxis,
  vArrayY,
  XAxis,
  vArrayX,
} from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, LinearGradient, Stop, G, Line } from "react-native-svg";

const db = new Database();

function CalendarScreen({ route, navigation }) {
  const [journalentries, setEntries] = useState({});
  // const [daylistshowing, showDayList] = useState(false);
  const dispatch = useDispatch();

  const daylistshowing = useSelector((state) => state.calendar.daylistui);
  const [selectedDate, setSelectedDate] = useState("");
  const [sumentries, setEntrySum] = useState(0);
  const { newEntry } = route.params;

  function mapColors(colour) {
    // console.log(color);
    if (colour == "") {
      // console.log("nulled");
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
      console.log("ufe");
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
  const today = new Date().toISOString().split("T")[0];
  return (
    <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
      <View>
        <Calendar
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
      <MyLineGraph></MyLineGraph>
      <MyPieChart></MyPieChart>
    </Animated.View>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "black",
    flex: 1,
  },
  lineColumn: {
    height: 250,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#33343d",
    borderRadius: 15,
    margin: 16,
  },
});

const data = [
  2, 1, 1, -1, 0, 2, 0, 0, 0, -2, 1, 2, 0, 0, 0, 1, 0, -3, 2, 0, -2, 0, 1, 1, 0,
  0, 0, 1,
];

const Gradient = () => (
  <Defs key={"gradient"}>
    <LinearGradient id={"gradient"} x1={"0"} y={"0%"} x2={"0%"} y2={"100%"}>
      <Stop offset={"0%"} stopColor={"gold"} />
      <Stop offset={"20%"} stopColor={"orange"} />
      <Stop offset={"40%"} stopColor={"white"} />
      <Stop offset={"60%"} stopColor={"cyan"} />
      <Stop offset={"80%"} stopColor={"blueviolet"} />
      <Stop offset={"100%"} stopColor={"tomato"} />
    </LinearGradient>
  </Defs>
);

const MyLineGraph = () => {
  const contentInset = { top: 0, bottom: 0 };
  const verticalContentInset = { top: 0, bottom: 0 };
  const xAxisHeight = 30;

  const CustomGrid = ({ x, y, data, ticks }) => (
    <G>
      {
        // Horizontal grid
        ticks.map((tick) => (
          <Line
            key={tick}
            x1={"0%"}
            x2={"100%"}
            y1={y(tick)}
            y2={y(tick)}
            stroke={"rgba(0,0,0,0.2)"}
          />
        ))
      }
      {
        // Vertical grid
        data.map((_, index) => (
          <Line
            key={0}
            y1={"0%"}
            y2={"100%"}
            x1={x(index)}
            x2={x(index)}
            stroke={"rgba(0,0,0,0.2)"}
          />
        ))
      }
    </G>
  );

  return (
    <View style={styles.lineColumn}>
      <View
        style={{
          flex: 1,
          margin: 15,
          flexDirection: "row",
          height: "90%",
          width: "90%",
          // backgroundColor: "green",
        }}
      >
        <YAxis
          style={{
            paddingBottom: 15,
            height: "100%",
            // backgroundColor: "blue",
            marginBottom: xAxisHeight + verticalContentInset.bottom,
          }}
          data={data}
          contentInset={{ verticalContentInset }}
          svg={{
            fill: "white",
            fontSize: 10,
          }}
          max={2.2}
          min={-3.5}
          numberOfTicks={5}
          formatLabel={(value) => {
            switch (value) {
              case 2:
                return "Happy";
              case 1:
                return "Excited";
              case 0:
                return "Neutral";
              case -1:
                return "Scared";
              case -2:
                return "Sad";
              case -3:
                return "Angry";
              default:
                return "";
            }
          }}
        />

        <View style={{ flex: 1, marginLeft: 5 }}>
          <LineChart
            style={{
              paddingTop: 5,
              flex: 1,
              // backgroundColor: "blue",
            }}
            // animate={true}
            // animationDuration={300}
            data={data}
            curve={shape.curveStep}
            contentInset={{ bottom: 2, top: 1 }}
            svg={{
              strokeWidth: 2.5,
              stroke: "url(#gradient)",
            }}
            numberOfTicks={5}
          >
            <Gradient />
            <CustomGrid belowChart={true} />
          </LineChart>

          <XAxis
            style={{
              // backgroundColor: "red",
              paddingTop: 15,
              height: xAxisHeight,
            }}
            data={data}
            formatLabel={(value) => value + 1}
            numberOfTicks={8}
            contentInset={{ left: 2, right: 0 }}
            svg={{ fontSize: 10, fill: "white" }}
          />
        </View>
      </View>
    </View>
  );
};

import { VictoryPie, VictoryLegend } from "victory-native";

const MyPieChart = () => {
  const wantedGraphicData = [
    { x: 5, y: 5 },
    { x: 3, y: 3 },
    { x: 2, y: 2 },
    { x: 6, y: 6 },
    { x: 1, y: 1 },
  ]; // Data that we want to display
  const defaultGraphicData = [
    { x: "Angry", y: 0 },
    { x: "Excited", y: 0 },
    { x: "Happy", y: 0 },
    { x: "Sad", y: 0 },
    { x: "Scared", y: 100 },
  ]; // Data used to make the animate prop work
  const [graphicData, setGraphicData] = useState(defaultGraphicData);

  useEffect(() => {
    setGraphicData(wantedGraphicData); // Setting the data that we want to display
  }, []);

  return (
    <View style={pistyles.pieColumn}>
      <Text style={pistyles.title}>Monthly Mood Frequency</Text>

      <View style={pistyles.pieRow}>
        <VictoryPie
          height={250}
          style={pistyles.myPieChart}
          innerRadius={35}
          animate={{ duration: 2500, easing: "exp" }}
          colorScale={["tomato", "orange", "gold", "cyan", "blueviolet"]}
          data={graphicData}
          // labelPosition={({ index }) => (index ? "centroid" : "startAngle")}
          // labelPlacement={({ index }) => (index ? "parallel" : "vertical")}
          // radius={({ datum }) => 10 + datum.y * 1}
          labelRadius={({ innerRadius }) => innerRadius + 20}
          padAngle={2}
        />

        <VictoryLegend
          x={170}
          y={45}
          orientation="vertical"
          itemsPerRow={6}
          rowGutter={2}
          style={{ title: { fontSize: 20 } }}
          data={[
            {
              name: "Angry",
              symbol: { fill: "tomato", type: "square" },
              labels: { fill: "tomato" },
            },
            {
              name: "Sad",
              symbol: { fill: "blueviolet", type: "square" },
              labels: { fill: "blueviolet" },
            },
            {
              name: "Excited",
              symbol: { fill: "orange", type: "square" },
              labels: { fill: "orange" },
            },
            {
              name: "Happy",
              symbol: { fill: "gold", type: "square" },
              labels: { fill: "gold" },
            },
            {
              name: "Scared",
              symbol: { fill: "cyan", type: "square" },
              labels: { fill: "cyan" },
            },
          ]}
        />
      </View>
    </View>
  );
};

const pistyles = StyleSheet.create({
  pieColumn: {
    height: 250,
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#33343d",
    borderRadius: 15,
    margin: 16,
  },

  pieRow: {
    height: 250,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  myPieChart: {
    data: {
      fillOpacity: 0.9,
      stroke: "black",
      strokeWidth: 1,
    },
    labels: {
      fontSize: 12,
      fill: "white",
      fontWeight: "bold",
    },
  },
});
