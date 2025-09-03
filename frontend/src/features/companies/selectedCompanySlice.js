import { createSlice } from "@reduxjs/toolkit";

export const selectedCompanySlice = createSlice({
  name: "selectedCompany",
  initialState: {
    value: ""
  },
  reducers: {
    setSelectedCompany: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setSelectedCompany } = selectedCompanySlice.actions
export default selectedCompanySlice.reducer