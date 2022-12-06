import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { clearEntry, setCalEntry, setEntryUi } from "../app/calendar.js";
import { useSelector, useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import { Colours } from "../constants.js";
import Moment from "moment";
import { setEntryId } from "../app/journalentry.js";

const EntryView = ({ pointerEvents, navigation }) => {
  const blurAnim = useRef(new Animated.Value(0)).current;
  const opacAnim = useRef(new Animated.Value(0)).current;

  const showAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const inputRange = [0, 100];
  const outputRange = ["0%", "100%"];

  const animatedHeight = heightAnim.interpolate({
    inputRange: inputRange,
    outputRange: outputRange,
  });
  const calEntry = useSelector((state) => state.calendar.calEntry);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const AnimBlur = Animated.createAnimatedComponent(BlurView);
  const ScrollBlur = Animated.createAnimatedComponent(ScrollView);
  console.log("EntryView", calEntry);

  useEffect(() => {
    if (calEntry.id != null) {
      // showAnim.setValue(calEntry.fromwindow.pageY - insets.top);
      showAnim.setValue(calEntry.fromwindow.pageY);
      heightAnim.setValue(0);

      Animated.timing(opacAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,

        easing: Easing.sin,
      }).start(() => {
        Animated.timing(blurAnim, {
          toValue: 20,
          duration: 500,
          useNativeDriver: false,

          easing: Easing.sin,
        }).start();
      });
    }
  }, [calEntry]);

  const editEntry = () => {
    // Animated.timing(blurAnim, {
    //   toValue: 0,
    //   duration: 200,
    //   useNativeDriver: false,

    //   easing: Easing.sin,
    // }).start(() => {
    //   Animated.timing(opacAnim, {
    //     toValue: 0,
    //     duration: 200,
    //     useNativeDriver: false,

    //     easing: Easing.sin,
    //   }).start(() => {
    dispatch(setEntryUi(false));
    dispatch(setEntryId(calEntry.id));
    navigation.navigate("HomeTab", {
      day: { dateString: calEntry.savedate },
      newEntry: false,
      entryId: calEntry.id,
    });
    //   });
    // });
  };

  const closeEntry = () => {
    Animated.timing(blurAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,

      easing: Easing.sin,
    }).start(() => {
      Animated.timing(opacAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,

        easing: Easing.sin,
      }).start(() => {
        dispatch(setEntryUi(false));
        dispatch(setCalEntry({}));
      });
    });
  };

  const deleteEntry = () => {
    const db = new Database();
    db.deleteItem(calEntry.id)
      .then((resultSet) => {
        dispatch(setEntryId(resultSet.insertId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const EditMenu = () => {
    const [moreMenu, showMoreMenu] = useState(false);
    const menuWidthAnim = useRef(new Animated.Value(0)).current;

    const confirmDelete = () => {
      Alert.alert(
        "Delete Entry?",
        "Are you sure you want to delete this entry?",
        [
          {
            text: "Cancel",
            onPress: () => {
              deleteEntry();
              toggleMore();
            },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              toggleMore();
            },
          },
        ]
      );
    };

    const toggleMore = () => {
      if (moreMenu) {
        Animated.timing(menuWidthAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,

          easing: Easing.sin,
        }).start(() => {
          showMoreMenu(!moreMenu);
        });
      } else {
        showMoreMenu(!moreMenu);

        Animated.timing(menuWidthAnim, {
          toValue: 200,
          duration: 200,
          useNativeDriver: false,

          easing: Easing.sin,
        }).start(() => {});
      }
    };
    return (
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() => {
            toggleMore();
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colours.sad.code,
              margin: 5,
              marginRight: 0,
              borderRadius: 50,
              borderRadius: 50,
              padding: 5,
              width: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              style={{ color: "white", paddingRight: 2 }}
              name="dots-horizontal"
              size={20}
            />
          </View>
        </TouchableOpacity>
        {moreMenu && (
          <Animated.View style={{ flexDirection: "row", width: menuWidthAnim }}>
            <TouchableOpacity
              onPress={() => {
                confirmDelete();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: Colours.angry.code,
                  marginRight: 0,

                  margin: 5,

                  borderTopLeftRadius: 50,
                  borderBottomLeftRadius: 50,
                  padding: 5,
                  alignItems: "center",

                  width: 90,
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  style={{ color: "white", paddingRight: 2 }}
                  name="delete"
                  size={20}
                />
                <Text style={{ color: "white" }}>Delete</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => {
                editEntry();
                toggleMore();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: Colours.sad.code,
                  margin: 5,
                  borderTopRightRadius: 50,
                  borderBottomRightRadius: 50,
                  padding: 5,
                  width: 90,
                  marginLeft: 0,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  style={{ color: "white", paddingRight: 2 }}
                  name="pencil"
                  size={20}
                />
                <Text style={{ color: "white" }}>Edit</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        // top: showAnim,
        top: 0,
        width: calEntry.fromwindow.width,
        // height: animatedHeight,
        height: "100%",
        left: 0,
        flex: 1,

        flexDirection: "column",
        // padding: 10,
        // margin: 10,
        opacity: opacAnim,
        zIndex: 1000,
        justifyContent: "center",
        // backgroundColor: "black",
      }}
    >
      <AnimBlur
        style={{
          flex: 1,
          maxHeight: "100%",
          top: 0,
          borderRadius: 10,
          padding: 10,
        }}
        blurType="light"
        blurAmount={blurAnim}
      >
        <Animated.View style={{ top: insets.top }}>
          <View
            style={{
              padding: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <EditMenu />
          </View>

          <View
            style={{
              height: "80%",
              paddingBottom: 20,
              borderRadius: 10,
              backgroundColor: "#F1F0EA",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  padding: 15,
                  marginLeft: 20,
                  marginTop: 20,
                  backgroundColor: Colours[calEntry.mood].code,
                  borderRadius: 15,
                  justifyContent: "space-between",
                  alignSelf: "flex-start",
                }}
              />
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  flexDirection: "column",
                }}
              >
                <Text style={{ fontSize: 16, color: "black" }}>
                  {Moment(calEntry.savedate).format("LL")}
                </Text>
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: 14,
                    fontStyle: "italic",
                  }}
                >
                  {calEntry.env}
                </Text>
              </View>
            </View>
            <ScrollBlur
              style={{
                flexGrow: 1,
                // backgroundColor: Colours[calEntry.mood].code,
                // maxHeight: "65%",
                // height: "100%",
                paddingHorizontal: 20,
              }}
              // onLayout={(e) => console.log("e", e.nativeEvent.layout)}
            >
              <Text>{calEntry.text}</Text>
            </ScrollBlur>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                closeEntry();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: Colours.anxious.code,
                  margin: 10,

                  borderRadius: 50,
                  padding: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 60,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </AnimBlur>
    </Animated.View>
  );
};

export default EntryView;
