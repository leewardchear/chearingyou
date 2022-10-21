import { LineChart, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, LinearGradient, Stop, G, Line } from "react-native-svg";
import { View, StyleSheet } from "react-native";

const MyLineGraph = () => {
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
            stroke={"rgba(0,0,0,0.2)"}
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

  return (
    <View style={styles.lineColumn}>
      <View
        style={{
          flex: 1,
          margin: 15,
          flexDirection: "row",
          height: "90%",
          width: "90%",
        }}
      >
        <YAxis
          style={{
            paddingBottom: 15,
            height: "100%",
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
            }}
            data={data}
            curve={shape.curveStep}
            contentInset={{ chartInset }}
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
              paddingTop: 15,
              height: xAxisHeight,
            }}
            data={data}
            formatLabel={(value) => value + 1}
            numberOfTicks={8}
            contentInset={{ horizontalContentInset }}
            svg={{ fontSize: 10, fill: "white" }}
          />
        </View>
      </View>
    </View>
  );
};
export default MyLineGraph;

const styles = StyleSheet.create({
  lineColumn: {
    height: 250,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#33343d",
    borderRadius: 15,
    margin: 16,
  },
});
