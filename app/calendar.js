import { createSlice } from "@reduxjs/toolkit";

const journalentries = createSlice({
  name: "entries",
  initialState: {
    entries: {},
    daylistui: true,
  },
  reducers: {
    setEntries: (state) => {
      entries = state.entries;
    },

    setDayListUI: (state, value) => {
      state.daylistui = value.payload;
    },
  },
});

export const { setEntries, setDayListUI } = journalentries.actions;

export default journalentries.reducer;
