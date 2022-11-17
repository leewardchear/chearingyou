import { render } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Easing,
  TouchableOpacity,
} from "react-native";
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
import ProgressWheel from "./ProgressWheel";
import Animated from "react-native-reanimated";

const DayList = ({ style, navigation, newEntry }) => {
  const itemAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeInAnim();
  }, []);

  const dispatch = useDispatch();

  const [datelist, setDateList] = useState({});
  const [processing, setProcessing] = useState(false);

  const [emptyList, showEmptyList] = useState(false);
  const selecteddate = useSelector((state) => state.calendar.selectedDate);

  const db = new Database();
  formattedDate = Moment(selecteddate.dateString).format("LL");

  useEffect(() => {
    Animated.timing(itemAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finish }) => {
      getData();
    });
  }, [selecteddate, newEntry]);

  useEffect(() => {}, [processing]);

  const RenderItem = ({ item }) => {
    return <Item entry={item} />;
  };

  const fadeInAnim = () => {
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finish }) => {});
  };

  const fadeOutAnim = () => {
    Animated.timing(itemAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finish }) => {});
  };

  const getData = () => {
    db.listDate(selecteddate.dateString)
      .then((resultSet) => {
        var marked = {};
        var childCount = 0;
        var newlist = [];
        if (resultSet.rows.length == 0) {
          showEmptyList(true);
        } else {
          showEmptyList(false);
        }
        for (let i = 0; i < resultSet.rows.length; i++) {
          newlist.push(resultSet.rows.item(i));
        }
        fadeInAnim();

        setProcessing(false);
        setDateList(newlist);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      // getData();
    }, [])
  );

  const Item = ({ entry }) => {
    return (
      <TouchableOpacity
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
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={{
        ...style,
        color: "white",
        opacity: itemAnim,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
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
        <Text style={{ color: "white", fontSize: 20 }}>{formattedDate}</Text>
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
      {emptyList && (
        <View
          style={{
            flex: 1,

            justifyContent: "center",
            alignItems: "center",
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
            <View>
              <Text>There are no notes for today.</Text>

              <Text>Tap here to make a note</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
      {!emptyList && (
        <FlatList
          data={datelist}
          renderItem={RenderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({});

export default DayList;
