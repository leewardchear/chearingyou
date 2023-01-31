import { createSlice } from "@reduxjs/toolkit";
import { lightTheme } from "../utils/Theme";

const themeSlice = createSlice({
    name: "theme",

    initialState: {
        theme: lightTheme
    },
    reducers: {
        setTheme: (state, value) => {
            state.theme = value.payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
