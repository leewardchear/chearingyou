import { StyleSheet, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { VictoryBar, VictoryChart, VictoryPie } from "victory-native";



export default class StatisticsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <VictoryPie
          data={[
            { x: "Cats", y: 35 },
            { x: "Dogs", y: 40 },
            { x: "Birds", y: 55 }
          ]}

          colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
        
          animate={{
            duration: 5000
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#171A21",
    alignContent: "space-around",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
});
