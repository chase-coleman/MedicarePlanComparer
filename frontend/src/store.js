import { configureStore } from "@reduxjs/toolkit";
import countyReducer from "../src/features/county/countySlice";

// creating the Redux store
export default configureStore({
  reducer: {
    county: countyReducer,
  }
})