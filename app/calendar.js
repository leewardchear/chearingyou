import { createSlice } from "@reduxjs/toolkit";

const journalentries = createSlice({
  name: "entries",
  initialState: {
    entries: {},
    daylistui: true,
    selectedDate: {},
    calEntry: {},
    entryUi: false,
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

    setEntryUi: (state, value) => {
      state.entryUi = value.payload;
    },
    setCalEntry: (state, value) => {
      state.calEntry = value.payload;
    },
  },
});

export const {
  setEntries,
  setDayListUI,
  setSelectedDate,
  setCalEntry,
  setEntryUi,
} = journalentries.actions;

export default journalentries.reducer;
