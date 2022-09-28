import { createSlice } from "@reduxjs/toolkit";

const journalentries = createSlice({
  name: "entries",
  initialState: {
    entries: {},
  },
  reducers: {
    setEntries: (state) => {
      entries = state.entries;
    },
  },
});

export const { setEntries } = journalentries.actions;

export default journalentries.reducer;
