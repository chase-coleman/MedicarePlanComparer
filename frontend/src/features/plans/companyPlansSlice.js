import { createSlice } from "@reduxjs/toolkit";

export const companyPlansSlice = createSlice({
  name: "companyPlans",
  initialState: {
    value: []
  }, reducers: {
    setPlans: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setPlans } = companyPlansSlice.actions
export default companyPlansSlice.reducer
