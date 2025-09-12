import { createSlice } from "@reduxjs/toolkit";

export const showContactFormSlice = createSlice({
  name: "showContactForm",
  initialState: {
    value: false,
  },
  reducers: {
    openModal: (state) => {
      state.value = true
    },
    closeModal: (state) => {
      state.value = false
    }
  }
})

export const {  openModal, closeModal} = showContactFormSlice.actions
export default showContactFormSlice.reducer