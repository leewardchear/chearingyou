import { createSlice } from "@reduxjs/toolkit";

const loadedSlice = createSlice({
  name: "loaded",
  initialState: {
    loadedvalue: false,
    dbupdate: 0,
  },
  reducers: {
    setLoaded: (state) => {
      state.loadedvalue = true;
    },
    setUnloaded: (state) => {
      state.loadedvalue = false;
    },
    setDbUpdate: (state, value) => {
      state.dbupdate = value.payload;
    },
  },
});

export const { setLoaded, setUnloaded, setDbUpdate } = loadedSlice.actions;

export default loadedSlice.reducer;
