import { createSlice } from "@reduxjs/toolkit";
import { openModal } from "./ShowContactFormSlice";

export const showRsvpFormSlice = createSlice({
  name: "showRsvpForm",
  initialState: {
    value: false,
  },
  reducers: {
    openRsvpModal: (state) => {
      state.value = true
    },
    closeRsvpModal: (state) => {
      state.value = false
    }
  }
})

export const { openRsvpModal, closeRsvpModal } = showRsvpFormSlice.actions
export default showRsvpFormSlice.reducer