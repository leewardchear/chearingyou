import { VictoryChart, VictoryBar, VictoryStack } from "victory-native";
import { View, } from "react-native";
import { useState } from "react";
import React, { useEffect } from "react";
import { Colours } from "../../constants";


const MyBarChart = ({ frequency, dbResults }) => {
    var moodList = [];

    useEffect(() => {
        plotBar(dbResults)
    }, [frequency, dbResults]);

    function plotBar(resultSet) {

        if (resultSet !== undefined && resultSet.length !== 0) {
            for (let i = 0; i < resultSet.rows.length; i++) {
                var category = resultSet.rows.item(i).env;
                var mood = resultSet.rows.item(i).mood;

                if (category === "") {
                    continue
                }
                var categoryObj = {}
                const found = moodList.some((m) => m.category === category);
                if (!found) {
                    var moodObj = {
                        mood: mood,
                        count: 1
                    }

                    categoryObj = {
                        y: 1,
                        mood: [moodObj],
                        category: category,
                        // color: Colours[mood].code,
                    };

                    moodList.push(categoryObj);
                } else {
                    moodList.find((m) => m.category == category).y++;

                    categoryObj = moodList.find((m) => m.category == category);
                    console.log(JSON.stringify(categoryObj))

                    const found = categoryObj.mood.some((m) => m.mood === mood);

                    if (!found) {
                        console.log("NOT FOUND:")
                    } else {
                        console.log("FOUND:")
                    }
                }
            }
            console.log("MOODLIST: ", JSON.stringify(moodList))

            // if (moodList.length == 0) {
            //     setHasData(false)
            // } else {
            //     setHasData(true)
            // }

            // setTotal(total);
            // setColorData(graphicColor);
            // setGraphicData(moodList);
        }
    }

    const data = [
        { mood: "Happy", category: "A", frequency: 5 },
        { mood: "Sad", category: "A", frequency: 3 },
        { mood: "Excited", category: "A", frequency: 4 },
        { mood: "Bored", category: "C", frequency: 2 },
        { mood: "Happy", category: "C", frequency: 4 },
        { mood: "Sad", category: "B", frequency: 2 },
        { mood: "Excited", category: "B", frequency: 3 },
        { mood: "Bored", category: "B", frequency: 1 }
    ];

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

            <VictoryChart>
                <VictoryStack
                    colorScale={["tomato", "orange", "cyan"]}
                >
                    <VictoryBar
                        data={[{ x: "happy", y: 2 }, { x: "sad", y: 3 }, { x: "angry", y: 5 }]}
                    />
                    <VictoryBar
                        data={[{ x: "happy", y: 1 }, { x: "sad", y: 4 }, { x: "angry", y: 5 }]}
                    />
                    <VictoryBar
                        data={[{ x: "happy", y: 3 }, { x: "sad", y: 4 }, { x: "angry", y: 6 }]}
                    />
                </VictoryStack>
            </VictoryChart>

        </View>
    );
};

export default MyBarChart;