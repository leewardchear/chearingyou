import { configureStore } from "@reduxjs/toolkit";
import loadedappslice from "../app/loadedappslice.js";
import journalentry from "../app/journalentry.js";
import journalentries from "../app/calendar.js";

export const store = configureStore({
  reducer: {
    loadedapp: loadedappslice,
    journal: journalentry,
    calendar: journalentries,
  },
});
