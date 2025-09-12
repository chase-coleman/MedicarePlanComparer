import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PlanComponent from "../components/PlanComponent";
import {
  addToPlanComparison,
  removeFromPlanComparison,
} from "../features/plans/comparedPlansSlice";
import { Link } from "react-router-dom";

const ComparePage = () => {
  const dispatch = useDispatch();
  const comparedPlans = useSelector((state) => state.comparedPlans.value);

  const addToCompare = (plan) => {
    dispatch(addToPlanComparison(plan));
  };

  const removeFromCompare = (plan) => {
    dispatch(removeFromPlanComparison(plan));
  };

  return (
    <>
      <div className="compare-page-container w-[100vw] m-1">
        {comparedPlans.length > 0 ? (
          <div className="plans-container">
            {comparedPlans.map((plan) => (
              <PlanComponent
                key={plan.id}
                plan={plan}
                addToCompare={addToCompare}
                removeFromCompare={removeFromCompare}
              />
            ))}
          </div>
        ) : (
          <span className="text-black text-[1.75em]">
            You don't have any plans selected to compare! <br /> Go to the
            <Link as={Link} to="/explore" className="text-[#E63946] font-semibold underline"> Explore Plan Options </Link>page to select plans to compare!
          </span>
        )}
      </div>
    </>
  );
};

export default ComparePage;
