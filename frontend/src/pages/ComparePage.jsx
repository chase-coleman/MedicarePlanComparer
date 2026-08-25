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
          <div className="empty-state">
            <p className="section-title mb-2">No plans selected yet</p>
            <p className="lede">
              Head to the
              <Link as={Link} to="/explore">
                {" "}
                Explore Plan Options{" "}
              </Link>
              page to pick plans to compare side by side.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ComparePage;
