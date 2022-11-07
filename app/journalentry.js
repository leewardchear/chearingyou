import { createSlice } from "@reduxjs/toolkit";

export const journalentry = createSlice({
  name: "entry",
  initialState: {
    entryvalue: "",
    day: "",
    moodshow: false,
    mood: "default",
    envshow: false,
    env: "default",
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

    setMood: (state, value) => {
      state.mood = value.payload;
    },

    setEnvUi: (state) => {
      state.envshow = !state.envshow;
    },

    setEnv: (state, value) => {
      state.env = value.payload;
    },
  },
});

export const { setEntryValue, setDay, setMoodUi, setMood, setEnvUi, setEnv } =
  journalentry.actions;

// export const selectQuestions = state => state.entry

export default journalentry.reducer;
