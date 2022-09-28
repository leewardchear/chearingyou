import { createSlice } from "@reduxjs/toolkit";

const journalentry = createSlice({
  name: "entry",
  initialState: {
    entryvalue: "",
    day: "",
  },
  reducers: {
    setEntryValue: (state) => {
      state.entryvalue = state.entryvalue;
    },

    setDay: (state) => {
      state.day = state.day;
    },
  },
});

export const { setEntryValue, setDay } = journalentry.actions;

export default journalentry.reducer;
