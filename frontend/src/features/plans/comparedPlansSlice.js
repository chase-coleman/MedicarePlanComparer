import { createSlice } from "@reduxjs/toolkit";

export const comparedPlansSlice = createSlice({
  name: "comparedPlans",
  initialState: {
    value: [],
    notice: null
  },
  reducers: {
    setComparedPlans: (state) => {
      state.value = []
    },
    addToPlanComparison: (state, action) => {
      if (state.value.some(plan => plan.id == action.payload.id)) {
        state.notice = { type: "notice", msg: "Plan is already selected to compare" }
        return;
      } else if (state.value.length >= 3) {
        state.notice = { type: "notice", msg: "Only 3 plans can be compared at once." }
        return;
      }
      state.value.push(action.payload) 
      state.notice = null
    },
    removeFromPlanComparison: (state, action) => {
      state.value = state.value.filter(plan => plan.id !== action.payload.id)
    },
    clearNotice: (state) => {
      state.notice = null
    }
  }
})

export const { addToPlanComparison, removeFromPlanComparison, clearNotice, setComparedPlans } = comparedPlansSlice.actions
export default comparedPlansSlice.reducer