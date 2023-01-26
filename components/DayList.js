import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Easing,
  TouchableOpacity,
} from "react-native";
import Database from "../db/database";
import { Colours } from "../constants";
import Moment from "moment";
import { TouchableHighlight } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { setCalEntry, setDayListUI, setEntryUi } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";
import Animated from "react-native-reanimated";
import pSBC from "shade-blend-color";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { BackgroundPrimary, TextPrimary, TextSecondary } from "../components/ThemeStyles";
import { ThemeProvider } from 'styled-components/native';

const DayList = ({ style, navigation, newEntry, isSingleDate, mood, searchText }) => {
  const itemAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const [datelist, setDateList] = useState({});
  const [processing, setProcessing] = useState(false);
  const [emptyList, showEmptyList] = useState(false);
  const selecteddate = useSelector((state) => state.calendar.selectedDate);
  const dbdate = useSelector((state) => state.loadedapp.dbupdate);
  const [moodCount, setMoodCount] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const theme = useSelector((state) => state.themeActions.theme);

  const db = new Database();

  formattedDate = Moment(selecteddate.dateString).format("LL");

  useEffect(() => {
    fadeInAnim();
  }, []);

  useEffect(() => {
    getData();
  }, [selecteddate, newEntry, dbdate, isSingleDate, searchText]);

  useEffect(() => { },
    [processing]);

  const RenderCalendarItem = ({ item }) => {
    return <CalendarItem entry={item} />;
  };

  const RenderMoodListItem = ({ item }) => {
    return <MoodItem entry={item} />;
  };


  const fadeInAnim = () => {
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finish }) => { });
  };

  const fadeOutAnim = () => {
    Animated.timing(itemAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finish }) => { });
  };

  const getData = () => {

    if (isSingleDate) {
      db.listDate(selecteddate.dateString)
        .then((resultSet) => {
          loadList(resultSet)
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      db.getAllMood(mood, searchText)
        .then((resultSet) => {
          loadList(resultSet)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function loadList(resultSet) {
    var newlist = [];
    const headerObj = { "env": "", "id": null, "mood": mood, "savedate": "title", "text": "" }

    if (resultSet.rows.length == 0 && isSingleDate) {
      showEmptyList(true);
    } else if (resultSet.rows.length == 0 && !isSingleDate) {
      newlist.push(headerObj)
    } else {
      showEmptyList(false);
    }

    for (let i = 0; i < resultSet.rows.length; i++) {
      if (i == 0) {
        newlist.push(headerObj)
      }


      newlist.push(resultSet.rows.item(i));
    }
    categoryCount(newlist)

    if (isSingleDate) {
      Animated.timing(itemAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(({ finish }) => {
        setDateList(newlist);
        fadeInAnim();
      });
    } else {
      setDateList(newlist);
    }
    setMoodCount(newlist.length - 1)
    setProcessing(false);
  }


  function categoryCount(list) {
    const categories = list.map(item => item.env).filter(env => env !== "");
    const result = categories.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    let maxCount = 0;
    let maxEnv = [];
    for (let env in result) {
      if (result[env] > maxCount) {
        maxCount = result[env];
        maxEnv = [env];
      } else if (result[env] === maxCount) {
        maxEnv.push(env);
      }
    }

    setTopCategories(maxEnv)
  }

  const CalendarItem = ({ entry }) => {
    const buttonRef = useRef(null);
    var entryEnv = entry.env == null ? "" : entry.env;
    var entryMood = entry.mood == null ? Colours.default.val : entry.mood;
    var entryDate = entry.savedate == null ? "" : entry.savedate;
    var entryText = entry.text == null ? "" : entry.text;

    return (
      <ThemeProvider theme={theme}>

        <TouchableOpacity
          ref={buttonRef}
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
              backgroundColor: "rgba(255, 255, 255, 0.3 )",
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
                padding: 5,
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
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {entry.text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ThemeProvider>

    );
  };


  const MoodItem = ({ entry }) => {
    const buttonRef = useRef(null);
    var entryEnv = entry.env == null ? "" : entry.env;
    var entryMood = entry.mood == null ? Colours.default.val : entry.mood;
    var entryDate = entry.savedate == null ? "" : entry.savedate;
    var entryText = entry.text == null ? "" : entry.text;

    return (

      <View style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",

      }}>
        <TouchableOpacity
          ref={buttonRef}
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

          }}
        >
          {entry.savedate == "title" && <View
            style={{
              width: ScreenWidth / 2,
              height: 90,
              padding: 10,
              flexDirection: "row",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 5,
                backgroundColor: pSBC(0.1, Colours[entryMood].code, "c"),
              }}
            >
              <View style={{
                flex: 1,
                marginLeft: 5,
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}>
                <TextSecondary style={{
                  textTransform: 'uppercase',
                  fontWeight: "bold",
                  fontSize: 22,
                }}>
                  {entryMood}
                </TextSecondary>
                <TextSecondary style={{ paddingTop: 8, fontSize: 14 }}>
                  <TextSecondary style={{ fontWeight: 'bold' }}>Entries: </TextSecondary> {moodCount}{"\n"}
                  <TextSecondary style={{ fontWeight: 'bold' }}>Top Category: </TextSecondary> {topCategories.join(', ')}
                </TextSecondary>
              </View>
            </View>
          </View>}

          {entry.savedate != "title" && <View
            style={{
              width: ScreenWidth / 2,
              height: 110,
              padding: 10,
              flexDirection: "row",
              borderRadius: 10,
            }}
          >

            <View
              style={{
                elevation: 5,
                padding: 5,
                paddingHorizontal: 8,
                flex: 1,
                borderRadius: 5,
                backgroundColor: pSBC(0.5, Colours[entryMood].code, "c"),
              }}
            >
              <View style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
                <Text
                  style={{ fontWeight: "bold", textAlign: "left" }}>
                  {entryDate}
                </Text>

                <Text
                  style={{ textAlign: "left" }}>
                  {entryEnv}
                </Text>
              </View>

              {entry.text !== null && entryText < 1 && (
                <Text style={{ fontStyle: "italic", color: "grey" }}>
                  Note is empty
                </Text>
              )}
              <Text
                style={{ paddingTop: 5, fontSize: 13, fontWeight: "400", color: "#1f1f1f" }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {entry.text}
              </Text>
            </View>
          </View>}
        </TouchableOpacity >
      </View >
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
          padding: isSingleDate ? 10 : 0,
          color: "white",
        }}
      >
        {isSingleDate && <TouchableHighlight
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
        }

        {isSingleDate && <Text
          style={{
            color: "white",
            fontSize: 20
          }}>
          {formattedDate}
        </Text>}

        {isSingleDate && <TouchableHighlight
          onPress={() => {
            dispatch(setDayListUI(false));
          }}
        >
          <MaterialCommunityIcons
            style={{ color: "white" }}
            name="window-close"
            size={32}
          />
        </TouchableHighlight>}

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
      {!emptyList && isSingleDate && (
        <FlatList
          data={datelist}
          renderItem={RenderCalendarItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {!emptyList && !isSingleDate && (
        <FlatList
          data={datelist}
          renderItem={RenderMoodListItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{
            elevation: 5,
            margin: 5,
            borderRadius: 10,
            backgroundColor: pSBC(0.1, Colours[mood].code, "c"),
          }}
        />
      )}

    </Animated.View>
  );
};

export default DayList;
