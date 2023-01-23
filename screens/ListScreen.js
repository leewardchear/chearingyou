import React, { useState } from "react";
import { SearchBar } from 'react-native-elements';
import {
    View
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ResultsList from "./ResultsList";
import { Colours } from "../constants";


function ListScreen() {
    const [search, setSearch] = useState("");
    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: "column",
            }}>
                <SearchBar
                    placeholder="Search..."
                    onChangeText={(text) => setSearch(text)}
                    value={search}
                    flex={1}
                    autoCorrect={false}
                    round
                    lightTheme
                />
            </View>

            <Tab.Navigator
                screenOptions={{
                    showLabel: false,
                    visible: false,
                    tabBarStyle: [{ display: "none" }, null],
                    headerShown: false,
                    tabBarScrollEnabled: true,
                    tabBarLabelStyle: {
                        fontSize: 12, backgroundColor: 'powderblue', borderRadius: 10, padding: 10
                    },
                }}
            >
                <Tab.Screen name={`1`} children={() => <ResultsList searchText={search} primaryMood={Colours.angry.val} secondaryMood={Colours.sad.val} />} />
                <Tab.Screen name={`2`} children={() => <ResultsList searchText={search} primaryMood={Colours.anxious.val} secondaryMood={Colours.afraid.val} />} />
                <Tab.Screen name={`3`} children={() => <ResultsList searchText={search} primaryMood={Colours.happy.val} secondaryMood={Colours.surprised.val} />} />
            </Tab.Navigator>
        </View >
    );
}

export default ListScreen;
