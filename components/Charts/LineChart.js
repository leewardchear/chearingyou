import { LineChart, YAxis, XAxis, Path } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, G, Line } from "react-native-svg";
import { View, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Database from "../../db/database";
import { Colours } from "../../constants";
import moment, { max } from "moment";
import { ClipPath, Rect } from "react-native-svg";
import * as scale from "d3-scale";

const db = new Database();
const SCREEN_WIDTH = Dimensions.get("window").width;

const MyLineGraph = ({ month, year, weekStart, weekEnd, frequency }) => {
  const [lineData, setLineData] = useState([]);
  const [lineFrequency, setLineFrequency] = useState();
  const [additionalWidth, setAdditionalWidth] = useState(-110);
  const [xAxisInset, setXAxisInset] = useState(5);

  useEffect(() => {
    setLineData([]);

    console.log("LINE: ", { month, year, weekStart, weekEnd, frequency })

    switch (frequency) {
      case 0: // WEEKLY
        setAdditionalWidth(SCREEN_WIDTH - 110);
        setLineFrequency(7);
        getWeeklyData();
        setXAxisInset(10);
        break;
      case 1: // MONTHLY
        setAdditionalWidth(SCREEN_WIDTH + 200);
        setLineFrequency(31);
        getMonthlyData();
        setXAxisInset(6);
        break;
      case 2: // YEARLY
        setAdditionalWidth(SCREEN_WIDTH + 1500);
        setLineFrequency(365);
        getYearlyData();
        setXAxisInset(8);
        break;
    }
  }, [frequency, weekStart, month, year]);

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

  const Clips = ({ }) => (
    <Defs key={"clips"}>
      <ClipPath id={"sad"}>
        <Rect y={175} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"angry"}>
        <Rect y={140} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"afraid"}>
        <Rect y={102} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"anxious"}>
        <Rect y={70} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"default"}>
        <Rect y={67} width={"100%"} height={"100%"} />
      </ClipPath>
      <ClipPath id={"surprised"}>
        <Rect y={35} width={"100%"} height={"100%"} />
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
    <View
      style={{
        height: 250,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(255,255,255,0.4)",
        borderRadius: 15,
        margin: 15,
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 8,
          marginLeft: 8,
          marginRight: 2,
          flexDirection: "row",
          height: "100%",
        }}
      >
        <YAxis
          style={{
            height: "90%",
            marginBottom: xAxisHeight,
          }}
          data={lineData}
          // data={[lineData]}
          contentInset={{ top: 2 }}
          svg={{
            fill: "#604c6d",
            fontSize: 11,
            fontWeight: "bold",
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
                paddingTop: 2,
                paddingBottom: 2,
                width: additionalWidth,
                flex: 1,
                marginLeft: 5,
                marginRight: 10,
              }}
              xScale={scale.scaleTime}
              data={lineData}
              curve={shape.curveLinear}
              contentInset={{ chartInset }}
              svg={{
                strokeWidth: 3,
                stroke: "url(#gradient)",
                clipPath: "url(#clip-path-1)",
              }}
              yMax={2}
              yMin={-4}
              yAccessor={({ item }) => item.moodScale}
            >
              <CustomGrid belowChart={true} />

              <Clips />
              <GreenLine />
              <YellowLine />
              <DefaultLine />
              <PurpleLine />
              <OrangeLine />
              <RedLine />
              <BlueLine />
            </LineChart>
            <XAxis
              style={{
                paddingTop: 5,
                height: xAxisHeight,
                width: "100%",
              }}
              numberOfTicks={lineFrequency}
              data={lineData}
              formatLabel={(value, index) => lineData[index].label}
              contentInset={{ left: xAxisInset, right: xAxisInset }}
              svg={{
                fontWeight: "bold",
                fontSize: 10,
                fill: "#604c6d",
                originY: 20,
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const chartInset = { bottom: 0, top: 0 };
const xAxisHeight = 40;

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
            stroke={"rgba(109, 74, 120, 0.1)"}
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
            stroke={"rgba(109, 74, 120, 0.1)"}
          />
        ))
      }
    </G>
  );
};

export default MyLineGraph;
