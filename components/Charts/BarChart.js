import { VictoryChart, VictoryBar, VictoryStack, VictoryAxis } from "victory-native";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import React, { useEffect } from "react";
import { Colours, MoodColors } from "../../constants";


const MyBarChart = ({ frequency, dbResults }) => {
    const [graphData, setGraphData] = useState({});
    const [maxY, setMaxY] = useState(0);

    useEffect(() => {
        plotBar(dbResults)
    }, [frequency, dbResults]);

    useEffect(() => {
        setMaxYAxis()
    }, [graphData]);

    useEffect(() => {
    }, [maxY]);


    function plotBar(resultSet) {
        var moodList = {};

        if (resultSet !== undefined && resultSet.length !== 0) {
            for (let i = 0; i < resultSet.rows.length; i++) {
                var category = resultSet.rows.item(i).env;
                var mood = resultSet.rows.item(i).mood;

                if (category === "") {
                    continue
                }

                if (!moodList[mood]) {
                    moodList[mood] = [];
                }

                const existingCategory = moodList[mood].find((obj) => obj.x === category);
                if (existingCategory) {
                    existingCategory.y += 1;
                } else {
                    moodList[mood].push({ x: category, y: 1 });
                }
            }
            setGraphData(moodList);
            console.log(moodList)

            setMaxYAxis()
        }
    }

    function setMaxYAxis() {
        let moodTotals = {};

        for (const emotion in graphData) {
            for (const datum of graphData[emotion]) {
                const x = datum.x;
                const y = datum.y;
                if (!moodTotals[x]) {
                    moodTotals[x] = 0;
                }
                moodTotals[x] += y;
            }
        }

        let greatestTotal = 0;
        for (const x in moodTotals) {
            if (moodTotals[x] > greatestTotal) {
                greatestTotal = moodTotals[x];
            }
        }

        setMaxY(greatestTotal);
        console.log(greatestTotal)
    }

    return (
        <View
            style={{
                height: 250,
                justifyContent: "space-around",
                backgroundColor: "#ECE1FF",
                elevation: 5,
                borderRadius: 15,
                margin: 15,
            }}
        >

            <VictoryChart
                domainPadding={{ x: 10 }}
                padding={{ left: 30, top: 40, bottom: 55, right: 50 }}
            >

                <VictoryAxis dependentAxis
                    tickCount={2}
                    tickFormat={(tick) => Math.round(tick)}
                    style={{
                        grid: {
                            stroke: "rgba(109, 74, 120, 0.3)",
                            strokeWidth: 1,
                            strokeDasharray: "8,2"
                        },
                    }} />

                <VictoryAxis tickFormat={(tick) => tick} />

                <VictoryStack colorScale={MoodColors}>

                    {graphData["happy"] && <VictoryBar
                        data={graphData["happy"]}
                        barWidth={20}
                        alignment="middle"
                        style={barStyles.bar}
                        shadowColor="black"
                        shadowOffset={{ width: 1, height: 1 }}
                        shadowOpacity={0.5}
                    />
                    }
                    {graphData["angry"] && <VictoryBar
                        data={graphData["angry"]}
                        barWidth={20}
                        alignment="middle"
                        style={barStyles.bar}
                        shadowColor="black"
                        shadowOffset={{ width: 1, height: 1 }}
                        shadowOpacity={0.1}
                    />
                    }
                    {graphData["afraid"] && <VictoryBar
                        data={graphData["afraid"]}
                        barWidth={20}
                        alignment="middle"
                        style={barStyles.bar}
                    />
                    }
                    {graphData["surprised"] && <VictoryBar
                        data={graphData["surprised"]}
                        barWidth={20}
                        alignment="middle"
                        style={barStyles.bar}
                    />
                    }
                    {graphData["anxious"] && <VictoryBar
                        data={graphData["anxious"]}
                        barWidth={20}
                        alignment="middle"
                        style={barStyles.bar}
                    />
                    }
                    {graphData["sad"] && <VictoryBar
                        data={graphData["sad"]}
                        barWidth={20}
                        alignment="middle"
                        style={barStyles.bar}
                    />
                    }
                </VictoryStack>
            </VictoryChart>

        </View>
    );
};
const barStyles = StyleSheet.create({
    bar: {
        data: {
            // stroke: "black",
            // fillOpacity: 0.7,
            // strokeWidth: 2
        },
    },
});
export default MyBarChart;