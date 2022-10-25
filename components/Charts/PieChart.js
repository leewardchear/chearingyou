import { VictoryPie, VictoryLegend } from "victory-native";
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import React, { useEffect } from "react";
import Database from "../../db/database";
import { Colours } from "../../constants";

const db = new Database();

const MyPieChart = ({ month, year, weekStart, weekEnd, frequency }) => {
  var moodList = [];
  var legendList = [];
  var graphicColor = [];

  const [legendData, setLegendData] = useState([]);
  const [graphicData, setGraphicData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [totalCount, setTotal] = useState(0);

  function getData() {
    switch (frequency) {
      case 0:
        getWeeklyData();
        break;
      case 1:
        getMonthlyData();
        break;
      case 2:
        getYearlyData();
        break;
    }
  }

  function getYearlyData() {
    db.getYearlyData(year)
      .then((resultSet) => {
        plotPie(resultSet);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getMonthlyData() {
    db.getMonthlyData(("0" + month).slice(-2), year)
      .then((resultSet) => {
        plotPie(resultSet);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getWeeklyData() {
    db.getWeeklyData(weekStart, weekEnd)
      .then((resultSet) => {
        plotPie(resultSet);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getData();
  }, [frequency]);

  function plotPie(resultSet) {
    var total = 0;

    for (let i = 0; i < resultSet.rows.length; i++) {
      var mood = resultSet.rows.item(i).mood;
      console.log(resultSet.rows.item(i));

      const found = moodList.some((m) => m.mood === mood);
      if (!found) {
        var moodObj = {
          x: 0,
          y: 0,
          mood: mood,
          color: Colours[mood].code,
        };

        var legendObj = {
          name: mood,
          symbol: { fill: Colours[mood].code, type: "square" },
          labels: { fill: Colours[mood].code },
        };
        legendList.push(legendObj);
        moodList.push(moodObj);
        graphicColor.push(Colours[mood].code);
      }

      total++;

      moodList.find((m) => m.mood == mood).x++;
      moodList.find((m) => m.mood == mood).y++;
    }

    setTotal(total);
    setColorData(graphicColor);
    setLegendData(legendList);
    setGraphicData(moodList);
  }

  return (
    <View style={pistyles.pieColumn}>
      <View style={pistyles.pieRow}>
        <VictoryPie
          height={250}
          style={pistyles.myPieChart}
          innerRadius={35}
          animate={{ duration: 2000 }}
          colorScale={colorData}
          data={graphicData}
          // labelPosition={({ index }) => (index ? "centroid" : "startAngle")}
          // labelPlacement={({ index }) => (index ? "parallel" : "vertical")}
          labels={({ datum }) => `${Math.round((datum.y / totalCount) * 100)}%`}
          // radius={({ datum }) => 10 + datum.y * 1}
          labelRadius={({ innerRadius }) => innerRadius + 13}
          padAngle={2}
        />

        <VictoryLegend
          x={170}
          y={45}
          orientation="vertical"
          itemsPerRow={6}
          rowGutter={2}
          style={{ title: { fontSize: 20 } }}
          data={legendData}
        />
      </View>
    </View>
  );
};

export default MyPieChart;

const pistyles = StyleSheet.create({
  pieColumn: {
    height: 225,
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
