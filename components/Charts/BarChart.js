import { VictoryChart, VictoryBar, VictoryStack, VictoryAxis } from "victory-native";
import { View, Dimensions, ScrollView } from "react-native";
import { useState } from "react";
import React, { useEffect } from "react";
import { Colours, } from "../../constants";

const screenWidth = Dimensions.get('window').width;

const MyBarChart = ({ frequency, dbResults }) => {
    const [graphData, setGraphData] = useState([]);
    const [maxY, setMaxY] = useState(0);
    const [barWidth, setBarWidth] = useState();

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
            setMaxYAxis()
            getTotalCategories(moodList)
        }
    }

    function getTotalCategories(dataset) {
        const xCounts = Object.values(dataset).reduce((counts, arr) => {
            arr.forEach(obj => {
                if (!counts[obj.x]) {
                    counts[obj.x] = 1;
                } else {
                    counts[obj.x] += 1;
                }
            });

            return counts;
        }, {});

        const distinctYCount = Object.keys(xCounts).length;

        if (distinctYCount === 1) {
            setBarWidth(screenWidth / 4)
        } else {
            setBarWidth(screenWidth / (distinctYCount * 3))
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
            <ScrollView horizontal={true} width={"100%"}>

                <VictoryChart
                    maxDomain={{ y: maxY + 1 }}
                    domainPadding={{ x: (barWidth + 2) / 2 }}
                    padding={{ left: 30, top: 20, bottom: 100, right: 50 }}
                >

                    <VictoryAxis dependentAxis
                        tickCount={maxY + 1}

                        tickFormat={(tick) => Math.round(tick)}
                        style={{
                            grid: {
                                stroke: "rgba(109, 74, 120, 0.3)",
                                strokeWidth: 1,
                                strokeDasharray: "8,2"
                            },
                        }} />


                    <VictoryAxis
                        tickFormat={(tick) => tick}

                        style={{
                            tickLabels: {
                                angle: 30,
                                fontSize: 14,
                                textAnchor: 'start',
                                textOverflow: 'ellipsis',
                                maxWidth: 5,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }
                        }} />

                    <VictoryStack >

                        {graphData["happy"] && <VictoryBar
                            data={graphData["happy"]}
                            barWidth={barWidth}
                            alignment="middle"
                            style={{ data: { fill: Colours["happy"].code } }}
                        />
                        }
                        {graphData["angry"] && <VictoryBar
                            data={graphData["angry"]}
                            barWidth={barWidth}
                            alignment="middle"
                            style={{ data: { fill: Colours["angry"].code } }}
                        />
                        }
                        {graphData["afraid"] && <VictoryBar
                            data={graphData["afraid"]}
                            barWidth={barWidth}
                            alignment="middle"
                            style={{ data: { fill: Colours["afraid"].code } }}
                        />
                        }
                        {graphData["surprised"] && <VictoryBar
                            data={graphData["surprised"]}
                            barWidth={barWidth}
                            alignment="middle"
                            style={{ data: { fill: Colours["surprised"].code } }}
                        />
                        }
                        {graphData["anxious"] && <VictoryBar
                            data={graphData["anxious"]}
                            barWidth={barWidth}
                            alignment="middle"
                            style={{ data: { fill: Colours["anxious"].code } }}
                        />
                        }
                        {graphData["sad"] && <VictoryBar
                            data={graphData["sad"]}
                            barWidth={barWidth}
                            alignment="middle"
                            style={{ data: { fill: Colours["sad"].code } }}
                        />
                        }
                    </VictoryStack>
                </VictoryChart>
            </ScrollView>

        </View>
    );
};

export default MyBarChart;