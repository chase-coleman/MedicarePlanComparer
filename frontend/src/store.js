import { configureStore } from "@reduxjs/toolkit";
import countyReducer from "../src/features/county/countySlice";
import errorReducer from "../src/features/errors/errorSlice";
import companiesReducer from "../src/features/companies/companiesSlice";
import selectedCompanyReducer from "../src/features/companies/selectedCompanySlice";
import companyPlansReducer from "../src/features/plans/companyPlansSlice";
import comparedPlansReducer from "../src/features/plans/comparedPlansSlice"
import showContactFormReducer from "./features/modal/ShowContactFormSlice";

// creating the Redux store
export default configureStore({
  reducer: {
    county: countyReducer, // sets/retrieves the selected county
    errorMsg: errorReducer, // sets/retrieves any error messages
    companies: companiesReducer, // sets/retrieves companies in a county
    selectedCompany: selectedCompanyReducer, // sets/retrieves the selected company 
    companyPlans: companyPlansReducer, // sets/retrieves the plans belongin to a company in a county
    comparedPlans: comparedPlansReducer,
    showContactForm: showContactFormReducer,
  }
})