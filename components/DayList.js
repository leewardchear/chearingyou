import { render } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import Database from "../db/database";
import { Colours } from "../constants";
import { WeekCalendar } from "react-native-calendars";
import Moment from "moment";
import { TouchableHighlight } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { setDayListUI } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";

const DayList = ({ style, selecteddate, navigation }) => {
  const [datelist, setDateList] = useState([]);
  const dispatch = useDispatch();

  const db = new Database();
  formattedDate = Moment(selecteddate).format("LL");

  useEffect(() => {
    db.listDate(selecteddate.dateString)
      .then((resultSet) => {
        // console.log("resultSet", resultSet);
        var marked = {};
        var childCount = 0;
        var newlist = [];

        for (let i = 0; i < resultSet.rows.length; i++) {
          //   console.log("dl", resultSet.rows.item(i));
          newlist.push(resultSet.rows.item(i));
        }
        setDateList(newlist);
        // console.log("marked", JSON.stringify(newlist, null, 2));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selecteddate]);

  const renderItem = ({ item }) => <Item entry={item} />;

  const Item = ({ entry }) => (
    <View
      style={{
        borderRadius: 10,
        padding: 10,
        margin: 5,
        backgroundColor: Colours[entry.mood].code,
      }}
    >
      <Text style={styles.title}>{entry.text}</Text>
      <Text>{entry.mood}</Text>
      <Text style={styles.title}>{entry.savedate}</Text>
    </View>
  );

  return (
    <View style={{ ...style }}>
      <Text>{formattedDate}</Text>
      <View>
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("HomeTab", { day: selecteddate });
          }}
        >
          <MaterialCommunityIcons name="note-plus-outline" size={32} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            dispatch(setDayListUI(false));
          }}
        >
          <MaterialCommunityIcons name="window-close" size={32} />
        </TouchableHighlight>
      </View>
      <FlatList
        data={datelist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default DayList;
