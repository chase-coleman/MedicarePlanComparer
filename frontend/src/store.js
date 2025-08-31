import { configureStore } from "@reduxjs/toolkit";
import countyReducer from "../src/features/county/countySlice";
import errorReducer from "../src/features/errors/errorSlice";
import companiesReducer from "../src/features/companies/companiesSlice";
import selectedCompanyReducer from "../src/features/companies/selectedCompanySlice";

// creating the Redux store
export default configureStore({
  reducer: {
    county: countyReducer,
    errorMsg: errorReducer,
    companies: companiesReducer,
    selectedCompany: selectedCompanyReducer,
  }
})