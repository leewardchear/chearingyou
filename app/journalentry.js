import { createSlice } from "@reduxjs/toolkit";

export const journalentry = createSlice({
  name: "entry",
  initialState: {
    entryvalue: "",
    day: "",
    moodshow: false,
    mood: "default",
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
  },
});

export const { setEntryValue, setDay, setMoodUi, setMood } =
  journalentry.actions;

// export const selectQuestions = state => state.entry

export default journalentry.reducer;
