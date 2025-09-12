import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PlanComponent from "../components/PlanComponent";
import { addToPlanComparison, removeFromPlanComparison } from "../features/plans/comparedPlansSlice";

const ComparePage = () => {
  const dispatch = useDispatch()
  const comparedPlans = useSelector((state) => state.comparedPlans.value)

  const addToCompare = (plan) => {
    dispatch(addToPlanComparison(plan))
  }

  const removeFromCompare = (plan) => {
    dispatch(removeFromPlanComparison(plan))
  }

  return (
    <>
    <div className="compare-page-container bg-main w-[100vw] m-1">
    {comparedPlans.length > 0 ?
    <div className="plans-container">
      {comparedPlans.map((plan) => (
        <PlanComponent key={plan.id} plan={plan} addToCompare={addToCompare} removeFromCompare={removeFromCompare} />
      ))}
    </div>
    : <h1 className="text-black">You don't have any plans selected to compare!</h1>
    }
    </div>
    </>
  )
}

export default ComparePage;