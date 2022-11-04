import { createSlice } from "@reduxjs/toolkit";

export const journalentry = createSlice({
  name: "entry",
  initialState: {
    entryvalue: "",
    day: "",
    moodshow: true,
    mood: "default",
    envshow: false,
    env: "",
    entryId: null,
  },
  reducers: {
    setEntryValue: (state) => {
      state.entryvalue = state.entryvalue;
    },

    setDay: (state) => {
      state.day = state.day;
    },

    setMoodUi: (state) => {
      state.moodshow = !state.moodshow;
    },

    setShowMoods: (state) => {
      state.moodshow = true;
    },

    setHideMoods: (state) => {
      state.moodshow = false;
    },

    setMood: (state, value) => {
      state.mood = value.payload;
    },

    setEnvUi: (state) => {
      state.envshow = !state.envshow;
    },

    setShowEnv: (state) => {
      state.envshow = true;
    },

    setHideEnv: (state) => {
      state.envshow = false;
    },

    setEnv: (state, value) => {
      state.env = value.payload;
    },

    setEntryId: (state, value) => {
      state.entryId = value.payload;
    },

    clearEntry: (state, value) => {
      console.log("CLEAR");
      state.entryvalue = "";
      // state.day = "";
      state.mood = "default";
      state.env = "";
      state.entryId = null;
    },
  },
});

export const {
  setEntryValue,
  setDay,
  setMoodUi,
  setMood,
  setEnvUi,
  setEnv,
  setShowEnv,
  setHideEnv,
  setShowMoods,
  setHideMoods,
  setEntryId,
  clearEntry,
} = journalentry.actions;

// export const selectQuestions = state => state.entry

export default journalentry.reducer;
