import { createSlice } from "@reduxjs/toolkit";

export const countySlice = createSlice({
  name: 'county',
  initialState: {
    value: '',
  },
  reducers: {
    // setCounty is the name of the function. state is the state, action is what is done, 
    // and .payload is the data being passed in during the action
    setCounty: (state, action) => {
      state.value = action.payload
    }
  }
})

// action creators must be set as the slice's actions
export const { setCounty } = countySlice.actions
export default countySlice.reducer