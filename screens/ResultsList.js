import { Animated } from "react-native";
import DayList from "../components/DayList";

function ResultsList({ searchText, primaryMood, secondaryMood }) {
    return (
        <Animated.View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
            <DayList
                style={{ flex: 1 }}
                newEntry={false}
                isSingleDate={false}
                mood={primaryMood}
                searchText={searchText}
            />

            <DayList
                style={{ flex: 1 }}
                newEntry={false}
                isSingleDate={false}
                mood={secondaryMood}
                searchText={searchText}
            />
        </Animated.View>
    );
}

export default ResultsList;
