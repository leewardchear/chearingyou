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
            console.log(state)
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
