// store.js
import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "./reportsSlice";
import libraryInfoReducer from "./libraryInfoSlice";

const store = configureStore({
  reducer: {
    reports: reportsReducer,
    libraryInfo: libraryInfoReducer,
  },
});

export default store;
