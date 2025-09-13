import { createSlice } from "@reduxjs/toolkit";

export const meetingToRsvpSlice = createSlice({
  name: "meetingRsvp",
  initialState: {
    value: {},
  },
  reducers: {
    setMeetingToRsvp: (state, action) => {
      state.value = action.payload
    },
    clearMeetingToRsvp: (state) => {
      state.value = {}
    }
  }
})

export const { setMeetingToRsvp, clearMeetingToRsvp } = meetingToRsvpSlice.actions;
export default meetingToRsvpSlice.reducer