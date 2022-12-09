import { render } from "react-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { setCalEntry, setDayListUI, setEntryUi } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import ProgressWheel from "./ProgressWheel";

import Animated from "react-native-reanimated";
import pSBC from "shade-blend-color";
import { ClipPath } from "react-native-svg";

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
          console.log(resultSet.rows.item(i));
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
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const buttonRef = useRef(null);
    var entryEnv = entry.env == null ? "" : entry.env;
    var entryMood = entry.mood == null ? Colours.default.val : entry.mood;

    var entryText = entry.text == null ? "" : entry.text;

    return (
      <TouchableOpacity
        ref={buttonRef}
        // onLayout={(event) => console.log(event.nativeEvent.layout)}
        onPress={(event) => {
          var fromwindow = {};
          buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
            fromwindow = {
              x: x,
              y: y,
              width: width,
              height: height,
              pageX: pageX,
              pageY: pageY,
            };
            var calEntry = {
              id: entry.id,
              mood: entryMood,
              env: entryEnv,
              savedate: entry.savedate,
              text: entryText,
              fromwindow: fromwindow,
            };
            dispatch(setCalEntry(calEntry));

            dispatch(setEntryUi(true));
          });
          // width: event.nativeEvent.layout.width,
          // height: event.nativeEvent.layout.height
          // // navigation.navigate("HomeTab", {
          //   day: selecteddate,
          //   newEntry: false,
          //   // entryId: entry.id,
          // });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderRadius: 10,
            padding: 5,
            margin: 5,
            marginHorizontal: 10,
            maxHeight: 90,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <View
            style={{
              flex: 0.2,

              margin: 5,
              minHeight: 60,
              marginRight: 8,
              borderRadius: 5,
              backgroundColor: pSBC(0.5, Colours[entryMood].code, "c"),
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "400" }}>
              {Colours[entryMood].name}
            </Text>
            <View
              style={{
                borderRadius: 5,
                padding: 2,
              }}
            >
              {entryEnv > 1 && (
                <Text
                  style={{
                    fontSize: 9,
                    fontStyle: "italic",
                    textAlign: "center",
                    fontWeight: "300",
                  }}
                >
                  {entry.env}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              padding: 13,
              paddingHorizontal: 8,
              flex: 1,
              borderLeftColor: pSBC(0.5, Colours[entryMood].code, "c"),
              borderLeftWidth: 2,
            }}
          >
            {entry.text !== null && entryText < 1 && (
              <Text style={{ fontStyle: "italic", color: "grey" }}>
                Note is empty
              </Text>
            )}
            <Text
              style={{ fontSize: 13, fontWeight: "400", color: "#1f1f1f" }}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {entry.text}
            </Text>
          </View>
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
