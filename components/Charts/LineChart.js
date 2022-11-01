import { LineChart, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, LinearGradient, Stop, G, Line } from "react-native-svg";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Database from "../../db/database";
import { Colours } from "../../constants";
import moment from "moment";
import * as scale from "d3-scale";
import { TextSize } from "victory-native";

// import { LineChart } from "react-native-gifted-charts";

const db = new Database();
const SCREEN_WIDTH = Dimensions.get("window").width;

const MyLineGraph = ({ month, year, weekStart, weekEnd, frequency }) => {
  const [lineData, setLineData] = useState([]);
  const [lineFrequency, setLineFrequency] = useState();
  const [additionalWidth, setAdditionalWidth] = useState(-110);

  function getData() {
    setLineData([]);
    switch (frequency) {
      case 0:
        setAdditionalWidth(SCREEN_WIDTH - 110);
        setLineFrequency(7);
        getWeeklyData();
        break;
      case 1:
        setAdditionalWidth(SCREEN_WIDTH + 110);
        setLineFrequency(31);
        getMonthlyData();
        break;
      case 2:
        setAdditionalWidth(SCREEN_WIDTH + 1500);
        setLineFrequency(365);
        getYearlyData();
        break;
    }
  }

  useEffect(() => {
    getData();
  }, [frequency]);

  useEffect(() => {}, [additionalWidth]);

  function getYearlyData() {
    try {
      var daysInYear = 365;
      var moodList = [];
      for (let i = 1; i <= daysInYear; i++) {
        var moodObj = {
          day: i,
          moodScale: 0,
          label: moment().dayOfYear(i).format("MMM"),
        };
        moodList.push(moodObj);
      }

      db.getYearlyData(year)
        .then((resultSet) => {
          for (let i = 0; i < resultSet.rows.length; i++) {
            var day = moment(resultSet.rows.item(i).savedate).dayOfYear();
            var mood = resultSet.rows.item(i).mood;
            moodList[day - 1].moodScale = parseInt(Colours[mood].intVal);
          }

          setLineData(moodList);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function getMonthlyData() {
    try {
      var daysInMonth = moment(month, "MM").daysInMonth();
      var moodList = [];

      for (let i = 1; i <= daysInMonth; i++) {
        var moodObj = {
          day: i,
          moodScale: 0,
          label: i,
        };

        moodList.push(moodObj);
      }

      const getDate = (string) =>
        (([year, month, day]) => ({ year, month, day }))(string.split("-"));

      db.getMonthlyData(("0" + month).slice(-2), year)
        .then((resultSet) => {
          for (let i = 1; i < resultSet.rows.length; i++) {
            var dayIndex = parseInt(
              getDate(resultSet.rows.item(i).savedate).day,
              10
            );
            var mood = resultSet.rows.item(i).mood;
            moodList[dayIndex - 1].moodScale = parseInt(Colours[mood].intVal);
          }
          setLineData(moodList);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function getWeeklyData() {
    try {
      var moodList = [];
      for (let i = 1; i <= 7; i++) {
        var moodObj = {
          day: i,
          moodScale: 0,
          label: moment().day(i).format("ddd"),
        };

        moodList.push(moodObj);
      }

      db.getWeeklyData(weekStart, weekEnd)
        .then((resultSet) => {
          for (let i = 0; i < resultSet.rows.length; i++) {
            var day = moment(resultSet.rows.item(i).savedate).isoWeekday();
            var mood = resultSet.rows.item(i).mood;
            moodList[day - 1].moodScale = parseInt(Colours[mood].intVal);
          }
          setLineData(moodList);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.lineColumn}>
      <View
        style={{
          flex: 1,
          margin: 15,
          flexDirection: "row",
          height: "90%",
        }}
      >
        <YAxis
          style={{
            height: "100%",
            marginBottom: xAxisHeight + verticalContentInset.bottom,
          }}
          data={lineData}
          contentInset={{ verticalContentInset }}
          svg={{
            fill: "white",
            fontSize: 10,
          }}
          max={2.1}
          min={-4.5}
          numberOfTicks={5}
          formatLabel={(value) => {
            switch (value) {
              case 2:
                return "Happy";
              case 1:
                return "Surprised";
              case 0:
                return "Neutral";
              case -1:
                return "Anxious";
              case -2:
                return "Afraid";
              case -3:
                return "Angry";
              case -4:
                return "Sad";
              default:
                return "";
            }
          }}
        />
        <ScrollView horizontal={true} width={"100%"}>
          <View style={{ marginLeft: 5 }}>
            <LineChart
              style={{
                paddingTop: 5,
                width: additionalWidth,
                flex: 1,
              }}
              // animate={true}
              // animationDuration={1500}
              data={lineData}
              curve={shape.curveLinear}
              contentInset={{ chartInset }}
              svg={{
                strokeWidth: 2.5,
                stroke: "url(#gradient)",
              }}
              yMax={2.0}
              yMin={-4}
              yAccessor={({ item }) => item.moodScale}
            >
              <Gradient />
              <CustomGrid belowChart={true} />
            </LineChart>
            <XAxis
              style={{
                paddingTop: 10,
                height: xAxisHeight,
                width: "100%",
              }}
              numberOfTicks={lineFrequency}
              data={lineData}
              formatLabel={(value, index) =>
                testFunction(lineData[index].label)
              }
              contentInset={{ horizontalContentInset }}
              svg={{
                fontSize: 10,
                fill: "white",
                originY: 20,
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

function testFunction(index) {
  // console.log(index);
  return index;
}

const Gradient = () => (
  <Defs key={"gradient"}>
    <LinearGradient id={"gradient"} x1={"0"} y={"0%"} x2={"0%"} y2={"100%"}>
      <Stop offset={"0%"} stopColor={Colours["happy"].code} />
      <Stop offset={"14%"} stopColor={Colours["surprised"].code} />
      <Stop offset={"29%"} stopColor={Colours["default"].code} />
      <Stop offset={"43%"} stopColor={Colours["anxious"].code} />
      <Stop offset={"57%"} stopColor={Colours["afraid"].code} />
      <Stop offset={"71%"} stopColor={Colours["angry"].code} />
      <Stop offset={"100%"} stopColor={Colours["sad"].code} />
    </LinearGradient>
  </Defs>
);

const chartInset = { bottom: 2, top: 1 };
const verticalContentInset = { top: 0, bottom: 0 };
const horizontalContentInset = { left: 2, right: 0 };
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
          stroke={"grey"}
        />
      ))
    }

    {
      // Vertical grid
      data.map((_, index) => (
        <Line
          key={index}
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

export default MyLineGraph;

const styles = StyleSheet.create({
  lineColumn: {
    height: 450,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#33343d",
    borderRadius: 15,
    margin: 16,
  },
});
