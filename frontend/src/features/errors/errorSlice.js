import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: 'errorMsg',
  initialState: {
    value: '',
  },
  reducers: {
    setErrorMsg: (state, action) => {
      state.value = action.payload
    }
  }
})

// action creators must be set as the slice's actions
export const { setErrorMsg } = errorSlice.actions
export default errorSlice.reducer