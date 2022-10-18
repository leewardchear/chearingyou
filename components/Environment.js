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

import { setEnvUi, setEnv } from "../app/journalentry";
import { TextInput } from "react-native-gesture-handler";

function Environment(props) {
  const dispatch = useDispatch();

  const openanim = useRef(new Animated.Value(0)).current;
  const radianim = useRef(new Animated.Value(0)).current;
  const [hideButtons, hidem] = useState(false);

  const [showCatInput, setShowCatInput] = useState(false);

  const [categ, setThisCategory] = useState(false);

  const [category, setCategories] = useState([
    "Home",
    "Work",
    "Park",
    "Restaurant",
  ]);
  const [newCat, setNewCat] = useState([""]);

  useEffect(() => {
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
    getCategories();
  }, []);
  endAnim = () => {
    dispatch(setEnvUi());
    dispatch(setEnv(categ));
  };

  toggleShow = (envclick) => {
    console.log("toggleShow", envclick);
    setThisCategory(envclick);
    Animated.timing(openanim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(({ finished }) => {
      endAnim();
    });

    Animated.timing(radianim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(({ finished }) => {});
  };

  useEffect(() => {
    // console.log(category);
    storeCategories(category);
  }, [category]);

  const getCategories = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@categories");
      console.log("jsonValue", jsonValue);

      if (jsonValue != null) {
        setCategories(JSON.parse(jsonValue));
      }
    } catch (e) {
      // error reading value
    }
  };

  const storeCategories = async (value) => {
    try {
      console.log("storeCategories", value);
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
        }}
      >
        <TouchableWithoutFeedback onPress={() => toggleShow(env)}>
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
      }}
    >
      {hideButtons && (
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
                <MaterialCommunityIcons name="plus-circle-outline" size={16} />
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

export default Environment;

const styles = StyleSheet.create({
  animated: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  buttons: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "green",
  },
  category: {
    backgroundColor: "grey",
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
});
