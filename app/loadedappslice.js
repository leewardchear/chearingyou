import { createSlice } from "@reduxjs/toolkit";

const loadedSlice = createSlice({
  name: "loaded",
  initialState: {
    loadedvalue: false,
  },
  reducers: {
    setLoaded: (state) => {
      state.loadedvalue = true;
    },
    setUnloaded: (state) => {
      state.loadedvalue = felse;
    },
  },
});

export const { setLoaded, setUnloaded } = loadedSlice.actions;

export default loadedSlice.reducer;
