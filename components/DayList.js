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
import { useFocusEffect } from "@react-navigation/native";
import { setEntryId } from "../app/journalentry.js";

const DayList = ({ style, selecteddate, navigation, newEntry }) => {
  const dispatch = useDispatch();

  const [datelist, setDateList] = useState({});
  const db = new Database();
  formattedDate = Moment(selecteddate.dateString).format("LL");

  useEffect(() => {
    getData();
  }, [selecteddate, newEntry]);

  const renderItem = ({ item }) => <Item entry={item} />;

  const getData = () => {
    db.listDate(selecteddate.dateString)
      .then((resultSet) => {
        var marked = {};
        var childCount = 0;
        var newlist = [];

        for (let i = 0; i < resultSet.rows.length; i++) {
          newlist.push(resultSet.rows.item(i));
        }
        setDateList(newlist);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const Item = ({ entry }) => (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate("HomeTab", {
          day: selecteddate,
          newEntry: false,
          // entryId: entry.id,
        });
        dispatch(setEntryId(entry.id));
      }}
    >
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
        <Text>{entry.env}</Text>
        <Text style={styles.title}>{entry.savedate}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={{ ...style, color: "white" }}>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          padding: 10,
          color: "white",
        }}
      >
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("HomeTab", {
              day: selecteddate,
              newEntry: true,
            });
          }}
        >
          <MaterialCommunityIcons
            style={{ color: "white" }}
            name="note-plus-outline"
            size={32}
          />
        </TouchableHighlight>
        <Text style={{ color: "white" }}>{formattedDate}</Text>
        <TouchableHighlight
          onPress={() => {
            dispatch(setDayListUI(false));
          }}
        >
          <MaterialCommunityIcons
            style={{ color: "white" }}
            name="window-close"
            size={32}
          />
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
