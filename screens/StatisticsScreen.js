import { ScrollView } from "react-native-gesture-handler";
import { View, StyleSheet, Animated } from "react-native";
import MyPieChart from "../components/Charts/PieChart";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import moment from "moment";

function StatisticsScreen({ route, navigation }) {
  const [currentMonth, setCurrentMonth] = useState({
    dateString: moment().format("YYYY-MM-DD"),
    day: parseInt(moment().format("DD")),
    month: parseInt(moment().format("MM")),
    timestamp: parseInt(moment().toDate().getTime()),
    year: parseInt(moment().format("YYYY")),
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
      <View>
        <Calendar
          markingType={"custom"}
          onMonthChange={(month) => {
            setCurrentMonth(month);
          }}
        />
      </View>

      <ScrollView>
        <MyPieChart month={currentMonth.month} year={currentMonth.year} />
      </ScrollView>
    </Animated.View>
  );
}

export default StatisticsScreen;
