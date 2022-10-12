import React, { useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
// import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native";
import { useState } from "react";
import Moment from "moment";
import {
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryScatter,
  VictoryLegend,
  VictoryAxis,
  VictoryGroup,
  VictoryContainer,
} from "victory-native";

import { Defs, LinearGradient, Stop, G, Line } from "react-native-svg";
import {
  LineChart,
  Grid,
  YAxis,
  vArrayY,
  XAxis,
  vArrayX,
} from "react-native-svg-charts";
import * as shape from "d3-shape";

import Database from "../db/database";

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

          var dateObj = {};

          if (resultSet.rows.item(i).mood != null) {
            dateObj = {
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
            dateObj = {
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
      <View style={styles.pieColumn}>
        <Text style={styles.title}>Monthly Mood Frequency</Text>

        <View style={styles.pieRow}>
          <VictoryPie
            height={250}
            style={styles.myPieChart}
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

  const data = [
    2, 1, 1, -1, 0, 2, 0, 0, 0, -2, 1, 2, 0, 0, 0, 1, 0, -3, 2, 0, -2, 0, 1, 1,
    0, 0, 0, 1,
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

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView>
        <View>
          <Calendar
            markingType={"custom"}
            markedDates={journalentries}
            onDayPress={(day) => {
              navigation.navigate("HomeTab", { day: day });
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {}}
          ></Calendar>
        </View>

        <MyPieChart />
        <MyLineGraph />
      </ScrollView>
    </SafeAreaView>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171A21",
  },

  title: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },

  pieColumn: {
    height: 250,
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#33343d",
    borderRadius: 15,
    margin: 16,
  },

  lineColumn: {
    height: 250,
    flexDirection: "row",
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
