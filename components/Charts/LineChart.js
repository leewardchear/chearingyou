import { View, Dimensions, ScrollView, Animated, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Colours } from "../../constants";
import moment, { max } from "moment";

import { BackgroundSecondary, } from "../ThemeStyles";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  Background,
  VictoryLabel
} from "victory-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const MyLineGraph = ({ month, year, weekStart, weekEnd, frequency, allResults, dbResults }) => {
  const [lineData, setLineData] = useState([]);
  const [lineFrequency, setLineFrequency] = useState(31);
  const [additionalWidth, setAdditionalWidth] = useState();
  const [xAxisInset, setXAxisInset] = useState(5);

  useEffect(() => {
    setLineData([]);

    let frequencyData;
    let additionalWidthValue;
    let xAxisInsetValue;

    switch (frequency) {
      case 0: // WEEKLY
        frequencyData = 7;
        additionalWidthValue = SCREEN_WIDTH - 90;
        xAxisInsetValue = 10;
        getWeeklyData(dbResults);
        break;
      case 1: // MONTHLY
        frequencyData = 31;
        additionalWidthValue = SCREEN_WIDTH + 200;
        xAxisInsetValue = 6;
        getMonthlyData(dbResults);
        break;
      case 2: // YEARLY
        frequencyData = 365;
        additionalWidthValue = SCREEN_WIDTH + 1500;
        xAxisInsetValue = 8;
        getYearlyData(dbResults);
        break;
    }

    setLineFrequency(frequencyData);
    setAdditionalWidth(additionalWidthValue);
    setXAxisInset(xAxisInsetValue);
  }, [frequency, dbResults]);

  function getYearlyData(resultSet) {
    try {

      if (resultSet !== undefined && resultSet.length !== 0) {
        var daysInYear = 365;
        var moodList = [];

        for (let i = 1; i <= daysInYear; i++) {
          var moodObj = {
            x: i,
            y: 9,
          };
          moodList.push(moodObj);
        }

        for (let i = 0; i < resultSet.rows.length; i++) {
          var day = moment(resultSet.rows.item(i).savedate).dayOfYear();
          var mood = resultSet.rows.item(i).mood;
          moodList[day - 1].y = parseInt(Colours[mood].intVal);
        }
        setLineData(moodList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getMonthlyData(resultSet) {
    try {
      if (resultSet !== undefined && resultSet.length !== 0) {
        var daysInMonth = moment(month, "MM").daysInMonth();
        var moodList = [];

        for (let i = 1; i <= daysInMonth; i++) {
          var moodObj = {
            x: i,
            y: 9,
          };
          moodList.push(moodObj);
        }

        const getDate = (string) =>
          (([year, month, x]) => ({ year, month, x }))(string.split("-"));

        for (let i = 0; i < resultSet.rows.length; i++) {
          var row = resultSet.rows.item(i);
          var dayIndex = parseInt(getDate(row.savedate).x, 10) - 1;
          var mood = parseInt(Colours[row.mood].intVal);
          moodList[dayIndex].y = mood;
        }
        setLineData(moodList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getWeeklyData(resultSet) {
    try {
      if (resultSet !== undefined && resultSet.length !== 0) {
        var moodList = [];

        for (let i = 1; i <= 7; i++) {
          var moodObj = {
            x: i,
            y: 9,
          };
          moodList.push(moodObj);
        }

        for (let i = 0; i < resultSet.rows.length; i++) {
          var day = moment(resultSet.rows.item(i).savedate).isoWeekday();
          var mood = resultSet.rows.item(i).mood;
          moodList[day - 1].y = parseInt(Colours[mood].intVal);
        }
        setLineData(moodList);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const chartPadding = 10
  const chartLeftPadding = lineFrequency === 7 ? 10 : 1;
  const chartBottomPadding = 80

  const CustomBackground = ({ width, scale }) => {
    const data = [
      { yAxis: chartPadding, color: Colours.happy.code },
      { yAxis: 40, color: Colours.surprised.code },
      { yAxis: 70, color: Colours.default.code },
      { yAxis: 100, color: Colours.anxious.code },
      { yAxis: 130, color: Colours.afraid.code },
      { yAxis: 160, color: Colours.angry.code },
      { yAxis: 190, color: Colours.sad.code }
    ];

    return data.map((item, index) => (
      <Background
        key={index}
        scale={scale}
        y={item.yAxis}
        x={chartLeftPadding}
        height={30}
        width={width}
        style={{ fill: item.color, opacity: 0.25 }}
      />
    ));
  };

  return (
    <BackgroundSecondary
      style={{
        height: 250,
        flexDirection: "row",
        elevation: 5,
        borderRadius: 15,
        margin: 15,
        justifyContent: "space-around",
      }}
    >

      <View
        style={{
          flex: 1,
          paddingLeft: chartPadding,
          paddingRight: 15,
        }}>
        <VictoryAxis
          dependentAxis
          padding={{ left: 58, top: chartPadding, bottom: 80 }}
          style={{
            tickLabels: {
              fill: "#604c6d",
              fontSize: 11,
              fontWeight: "bold",
            },
          }}
          tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
          tickFormat={(value, index) => {
            switch (value) {
              case 1:
                return "Happy";
              case 3:
                return "Surprised";
              case 5:
                return "Neutral";
              case 7:
                return "Anxious";
              case 9:
                return "Afraid";
              case 11:
                return "Angry";
              case 13:
                return "Sad";
              default:
                return "";
            }
          }}
        />
      </View>

      <View style={{ paddingLeft: lineFrequency === 7 ? 45 : 55, paddingRight: 15, }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          <VictoryChart
            style={{
              background: {
              },
            }}
            backgroundComponent={<CustomBackground />}
            padding={{ top: chartPadding, left: chartLeftPadding, bottom: chartBottomPadding, right: lineFrequency === 7 ? chartPadding : 0 }}
            width={additionalWidth}
            domain={{ y: [0, 14] }}>
            <VictoryLine style={{
              data: {
                stroke: '#7D73C3',
                strokeWidth: 2,
              }
            }}
              data={lineData} />

            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: "transparent" },
                grid: {
                  stroke: "white",
                  strokeWidth: ({ tick }) => tick % 2 === 0 ? "1" : "0",
                  strokeDasharray: "5,5"
                }
              }}
            />
            <VictoryAxis
              style={{
                tickLabels: {
                  fill: "#604c6d",
                  fontSize: 11,
                  fontWeight: "bold",
                }
              }}
              tickValues={Array.from({ length: lineData.length }, (_, i) => i + 1)}
              tickCount={lineFrequency}
              tickFormat={(value, index) => {

                if (lineData && lineData.length > 0) {
                  if (lineFrequency === 7) {
                    return moment().day(index + 1).format("ddd");
                  } else if (lineFrequency === 365) {
                    let currentMoment = moment();
                    currentMoment.dayOfYear(index);
                    var day = currentMoment.format("DD");
                    var month = currentMoment.format("MMM");
                    var monthLabel = "";
                    if (day === "01") {
                      monthLabel = month;
                    }
                    return monthLabel;
                  } else {
                    return lineData[index].x;
                  }
                }
                return "";
              }}
            />
          </VictoryChart>
        </ScrollView>
      </View>
    </BackgroundSecondary >
  );
};


export default MyLineGraph;
