import { VictoryPie, VictoryLegend } from "victory-native";
import { View, Text } from "react-native";
import { useState } from "react";
import React, { useEffect } from "react";
import { Colours } from "../../constants";

const MyPieChart = ({ frequency, dbResults }) => {
  var moodList = [];
  var legendList = [];
  var graphicColor = [];

  const [legendData, setLegendData] = useState([]);
  const [graphicData, setGraphicData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [totalCount, setTotal] = useState(0);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    plotPie(dbResults);
  }, [frequency, dbResults]);

  function plotPie(resultSet) {
    if (resultSet !== undefined && resultSet.length !== 0) {
      var total = 0;

      for (let i = 0; i < resultSet.rows.length; i++) {
        var mood = resultSet.rows.item(i).mood;

        const found = moodList.some((m) => m.mood === mood);
        if (mood == Colours.default.val) {
          continue;
        }
        if (!found) {
          var moodObj = {
            x: 0,
            y: 0,
            mood: mood,
            color: Colours[mood].code,
          };


          var legendObj = {
            name: Colours[mood].name,
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

      if (moodList.length == 0) {
        setHasData(false)
      } else {
        setHasData(true)
      }

      setTotal(total);
      setColorData(graphicColor);
      setLegendData(legendList);
      setGraphicData(moodList);
    } else {
      setHasData(false)
    }
  }


  const legendHeight = legendData.length * 22; // 20 is the default item height and 40 is the default title height
  const chartHeight = 220;
  const chartBottomMargin = 55;
  const dy = (chartHeight - legendHeight) / 2;

  return (
    <View
      style={{
        height: chartHeight,
        justifyContent: "space-around",
        backgroundColor: "#ECE1FF",
        elevation: 5,
        borderRadius: 15,
        marginLeft: 15,
        marginRight: 15,
      }}
    >
      {!hasData && <Text style={{
        backgroundColor: "rgba(102, 84, 137,0.3)",
        height: "10%",
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
        color: '#604c6d',
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center",
        textAlignVertical: "center",

      }}>No Data Available</Text>}

      {hasData && <View
        style={{
          marginLeft: 30,
          marginBottom: chartBottomMargin,
          height: chartHeight,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <VictoryPie
          height={280}
          style={{
            data: {
              fillOpacity: 0.9,
              stroke: "white",
              strokeWidth: 2,
            },
            labels: {
              fontSize: 14,
              fill: "white",
              fontWeight: "bold",
            },
          }}
          innerRadius={25}
          animate={{ duration: 1000 }}
          colorScale={colorData}
          data={graphicData}
          // labelPosition={({ index }) => (index ? "centroid" : "startAngle")}
          // labelPlacement={({ index }) => (index ? "parallel" : "vertical")}
          labels={({ datum }) => `${Math.round((datum.y / totalCount) * 100)}%`}
          // radius={({ datum }) => 10 + datum.y * 1}
          labelRadius={({ innerRadius }) => innerRadius + 35}
        // padAngle={0.5}
        />

        <VictoryLegend
          x={150}
          y={dy}
          orientation="vertical"
          itemsPerRow={7}
          rowGutter={2}
          data={legendData}
        />
      </View>
      }
    </View>
  );
};

export default MyPieChart;
