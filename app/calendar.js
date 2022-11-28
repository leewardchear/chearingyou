import { createSlice } from "@reduxjs/toolkit";

const journalentries = createSlice({
  name: "entries",
  initialState: {
    entries: {},
    daylistui: true,
    selectedDate: {},
  },
  reducers: {
    setEntries: (state) => {
      entries = state.entries;
    },

    setDayListUI: (state, value) => {
      state.daylistui = value.payload;
    },

    setSelectedDate: (state, value) => {
      state.selectedDate = value.payload;
    },
  },
});

export const { setEntries, setDayListUI, setSelectedDate } =
  journalentries.actions;

export default journalentries.reducer;
