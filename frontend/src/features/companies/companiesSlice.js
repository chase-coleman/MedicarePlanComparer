import { createSlice } from "@reduxjs/toolkit";

export const companiesSlice = createSlice({
  name: 'companies',
  initialState: {
    value: [],
  }, 
  reducers: {
    setCompanies: (state, action) => {
      state.value = action.payload
    }
  }
})
// action creators must be set as the slice's actions
export const { setCompanies } = companiesSlice.actions
export default companiesSlice.reducer