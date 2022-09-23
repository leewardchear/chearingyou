import { configureStore } from '@reduxjs/toolkit'
import loadedappslice from '../app/loadedappslice.js'

export const store = configureStore({
  reducer: {
    loadedapp: loadedappslice,
  }
});
