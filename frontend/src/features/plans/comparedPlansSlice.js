import { createSlice } from "@reduxjs/toolkit";

// Most plans a user may hold in a comparison at once.
export const MAX_COMPARED_PLANS = 3;

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
        state.notice = {
          type: "duplicate",
          title: "Plan already added",
          msg: "Plan is already selected to compare",
        }
        return;
      } else if (state.value.length >= MAX_COMPARED_PLANS) {
        state.notice = {
          type: "limit",
          title: `You can compare up to ${MAX_COMPARED_PLANS} plans`,
          msg: `Only ${MAX_COMPARED_PLANS} plans can be compared at once.`,
        }
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