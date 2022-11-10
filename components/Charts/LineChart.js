import { LineChart, YAxis, XAxis, Path } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, G, Line } from "react-native-svg";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Database from "../../db/database";
import { Colours } from "../../constants";
import moment, { max } from "moment";
import { ClipPath, Rect } from "react-native-svg";
import * as scale from "d3-scale";
import { TextSize } from "victory-native";

const db = new Database();
const SCREEN_WIDTH = Dimensions.get("window").width;

const MyLineGraph = ({ month, year, weekStart, weekEnd, frequency }) => {
  const [lineData, setLineData] = useState([]);
  const [lineFrequency, setLineFrequency] = useState();
  const [additionalWidth, setAdditionalWidth] = useState(-110);

  useEffect(() => {
    setLineData([]);

    switch (frequency) {
      case 0: // WEEKLY
        setAdditionalWidth(SCREEN_WIDTH - 110);
        setLineFrequency(7);
        getWeeklyData();
        break;
      case 1: // MONTHLY
        setAdditionalWidth(SCREEN_WIDTH + 150);
        setLineFrequency(31);
        getMonthlyData();
        break;
      case 2: // YEARLY
        setAdditionalWidth(SCREEN_WIDTH + 1500);
        setLineFrequency(365);
        getYearlyData();
        break;
    }
  }, [frequency]);

  function getYearlyData() {
    try {
      var daysInYear = 365;
      var moodList = [];

      for (let i = 1; i <= daysInYear; i++) {
        var date = moment().dayOfYear(i).format("MMM-DD");
        var day = moment(date).dayOfYear(i).format("DD");
        var month = moment(date).dayOfYear(i).format("MMM");

        var monthLabel = "";
        if (day == "01") {
          monthLabel = month;
        }

        var moodObj = {
          day: i,
          moodScale: 0,
          label: monthLabel,
        };
        moodList.push(moodObj);
      }

      db.getYearlyData(year)
        .then((resultSet) => {
          for (let i = 0; i < resultSet.rows.length; i++) {
            console.log(resultSet.rows.item(i).savedate);
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

  const Clips = ({}) => (
    <Defs key={"clips"}>
      <ClipPath id={"sad"}>
        <Rect y={310} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"angry"}>
        <Rect y={245} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"afraid"}>
        <Rect y={186} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"anxious"}>
        <Rect y={125} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"default"}>
        <Rect y={120} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"surprised"}>
        <Rect y={60} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"happy"}>
        <Rect y={0} width={"100%"} height={"100%"} />
      </ClipPath>
    </Defs>
  );

  // Line extras:
  const BlueLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["sad"].code}
      strokeWidth={3}
      clipPath={"url(#sad)"}
    />
  );

  // Line extras:
  const RedLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["angry"].code}
      strokeWidth={3}
      clipPath={"url(#angry"}
    />
  );

  // Line extras:
  const PurpleLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["anxious"].code}
      strokeWidth={3}
      clipPath={"url(#anxious"}
    />
  );

  // Line extras:
  const YellowLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["surprised"].code}
      strokeWidth={3}
      clipPath={"url(#surprised"}
    />
  );

  // Line extras:
  const OrangeLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["afraid"].code}
      strokeWidth={3}
      clipPath={"url(#afraid"}
    />
  );

  // Line extras:
  const GreenLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["happy"].code}
      strokeWidth={3}
      clipPath={"url(#happy"}
    />
  );

  // Line extras:
  const DefaultLine = ({ line }) => (
    <Path
      d={line}
      stroke={Colours["default"].code}
      strokeWidth={2}
      clipPath={"url(#default"}
    />
  );

  return (
    <View style={styles.lineColumn}>
      <View
        style={{
          flex: 1,
          marginTop: 15,
          marginLeft: 8,
          marginRight: 8,
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
                marginLeft: 5,
                marginRight: 10,
              }}
              xScale={scale.scaleTime}
              data={lineData}
              curve={shape.curveMonotoneX}
              contentInset={{ chartInset }}
              svg={{
                strokeWidth: 3,
                stroke: "url(#gradient)",
                clipPath: "url(#clip-path-1)",
              }}
              yMax={2}
              yMin={-4}
              yAccessor={({ item }) => item.moodScale}
              // xAccessor={({ item }) => item.day}
              // animate={true}
              // animationDuration={1500}
            >
              <Clips />
              <GreenLine />
              <YellowLine />
              <DefaultLine />
              <PurpleLine />
              <OrangeLine />
              <RedLine />
              <BlueLine />

              <CustomGrid belowChart={true} />
            </LineChart>
            <XAxis
              style={{
                paddingTop: 20,
                height: xAxisHeight,
                width: "100%",
              }}
              xAccessor={({ item }) => item.day}
              numberOfTicks={lineFrequency}
              data={lineData}
              formatLabel={(value, index) => lineData[index].label}
              contentInset={{ left: HORIZONTAL_INSET, right: HORIZONTAL_INSET }}
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

const chartInset = { bottom: 2, top: 1 };
const verticalContentInset = { top: 0, bottom: 0 };
const HORIZONTAL_INSET = 10;
const xAxisHeight = 30;

const CustomGrid = ({ x, y, data, ticks }) => {
  ticks = [-4, -3, -2, -1, 0, 1, 2];
  return (
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
};

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
