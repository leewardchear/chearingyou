import {
  Animated,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Colours } from "../constants.js";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Database from "../db/database";

import { setEnvUi, setEnv, setShowEnv, setHideEnv } from "../app/journalentry";
import { ScrollView, TextInput } from "react-native";
const db = new Database();

function Environment(props) {
  const dispatch = useDispatch();

  const openanim = useRef(new Animated.Value(0)).current;
  const radianim = useRef(new Animated.Value(0)).current;
  const categenv = useSelector((state) => state.journal.env);
  const mood = useSelector((state) => state.journal.mood);
  const showenv = useSelector((state) => state.journal.envshow);
  const dbdate = useSelector((state) => state.loadedapp.dbupdate);

  const [hideButtons, hidem] = useState(false);

  const [showCatInput, setShowCatInput] = useState(false);

  const [categ, setThisCategory] = useState(false);

  const [category, setCategories] = useState([
    "Home",
    "Work",
    "Park",
    "Restaurant",
    "Health",
    "News",
    "Stories",
    "Intense moments",
    "Books/ articles",
    "Movies/TV Shows",
    "Internet",
    "Quotes",
    "Time wasted",
    "Cooking",
    "Dog",
    "Neighbours",
    "Ideas",
    "Family",
    "Bills",
    "Stock Investor",
    "Memory",
    "Chess games",
    "From Parents",
    "Life Lesson",
  ]);

  const [recentcats, setRecents] = useState([]);
  const [newCat, setNewCat] = useState([""]);

  const showEnv = () => {
    Animated.timing(openanim, {
      toValue: 150,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start(({ finished }) => {
      hidem(true);
    });

    Animated.timing(radianim, {
      toValue: 10,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.sin,
    }).start();
  };

  const hideEnv = () => {
    hidem(false);

    Animated.timing(openanim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(({ finished }) => {});

    Animated.timing(radianim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(({ finished }) => {});
  };

  useEffect(() => {
    if (showenv) {
      showEnv();
    } else {
      hideEnv();
    }
  }, [showenv]);

  useEffect(() => {
    getCategories();
  }, []);
  endAnim = () => {
    dispatch(setEnv(categ));
  };

  useEffect(() => {
    storeCategories(category);
  }, [category]);

  useEffect(() => {}, [categ]);

  useEffect(() => {
    db.recentCats()
      .then((resultSet) => {
        recents = [];
        for (let i = 0; i < resultSet.rows.length; i++) {
          if (resultSet.rows.item(i).env != "") {
            recents.push(resultSet.rows.item(i).env);
          }
          setRecents(recents);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dbdate]);

  const getCategories = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@categories");

      if (jsonValue != null) {
        setCategories(JSON.parse(jsonValue));
      }
    } catch (e) {
      // error reading value
    }
  };

  const storeCategories = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@categories", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const addCategory = () => {
    setCategories((oldState) => [...oldState, newCat]);

    setShowCatInput(false);
  };

  const EnvButtons = ({ env, style }) => {
    return (
      <View
        style={{
          ...style,
          backgroundColor: env == categenv ? Colours[mood].code : null,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (env == categenv) {
              dispatch(setEnv(null));
            } else {
              dispatch(setEnv(env));
              dispatch(setHideEnv());
            }
          }}
        >
          <Text>{env}</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        ...styles.animated,
        ...props.style,

        height: openanim,
        borderRadius: radianim,
        padding: radianim,
        marginBottom: showenv ? 10 : 0,
      }}
    >
      {hideButtons && (
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(setHideEnv());
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: -9,
                right: 0,
                marginRight: -9,
                position: "absolute",
                zIndex: 10,
              }}
            >
              <MaterialCommunityIcons
                style={{ color: "#be94f5" }}
                name="close-circle"
                size={25}
              />
            </View>
          </TouchableWithoutFeedback>
          <ScrollView
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="true"
          >
            {recentcats.length > 0 && (
              <View>
                <Text style={{ fontWeight: "bold" }}>Recent</Text>
                <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                  {recentcats.map((recent, key) => {
                    return (
                      <EnvButtons
                        env={recent}
                        style={styles.category}
                        key={key}
                      ></EnvButtons>
                    );
                  })}
                </View>
              </View>
            )}
            <Text style={{ fontWeight: "bold" }}>All</Text>

            <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
              {category.map((category, key) => {
                return (
                  <EnvButtons
                    env={category}
                    style={styles.category}
                    key={key}
                  ></EnvButtons>
                );
              })}
              {!showCatInput && (
                <View
                  style={{
                    ...styles.category,
                    backgroundColor: Colours.happy.code,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setShowCatInput(true);
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text>Add</Text>
                      <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={16}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
              {showCatInput && (
                <View
                  style={{
                    ...styles.category,
                    backgroundColor: "lightgrey",
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    placeholder={"New Category"}
                    returnKeyType="done"
                    onChangeText={(value) => {
                      setNewCat(value);
                    }}
                    onSubmitEditing={(e) => {
                      addCategory();
                      setNewCat("");
                    }}
                    value={newCat}
                  />
                  <TouchableWithoutFeedback>
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={16}
                    />
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );
}

export default Environment;

const styles = StyleSheet.create({
  animated: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  buttons: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "green",
  },
  category: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
});
