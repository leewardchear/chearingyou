import { createSlice } from "@reduxjs/toolkit";

const moodCountSlice = createSlice({
    name: 'moodCount',
    initialState: {
        mood: { afraid: "", angry: "", anxious: "", happy: "", sad: "", surprised: "" },
    },
    reducers: {
        setCount: (state, value) => {
            console.log("dispatched " + value.payload.mood)

            state.mood[value.payload.mood] = value.payload.count;
        },
    },
});

export const { setCount } = moodCountSlice.actions;

export default moodCountSlice.reducer;
