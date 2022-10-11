import { createSlice } from "@reduxjs/toolkit";

const journalentries = createSlice({
  name: "entries",
  initialState: {
    entries: {},
    daylistui: false,
  },
  reducers: {
    setEntries: (state) => {
      entries = state.entries;
    },

    setDayListUI: (state, value) => {
      console.log(value.payload);
      state.daylistui = value.payload;
    },
  },
});

export const { setEntries, setDayListUI } = journalentries.actions;

export default journalentries.reducer;
