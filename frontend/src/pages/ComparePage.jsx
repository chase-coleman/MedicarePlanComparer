import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PlanComponent from "../components/PlanComponent";
import { groupPlansByYear } from "../functions/groupPlans";
import {
  addToPlanComparison,
  removeFromPlanComparison,
} from "../features/plans/comparedPlansSlice";
import { Link } from "react-router-dom";

const ComparePage = () => {
  const dispatch = useDispatch();
  const comparedPlans = useSelector((state) => state.comparedPlans.value);

  // React Router keeps the previous page's scroll position, so a user who
  // scrolled down the Explore page would land mid-way down this one. Start
  // at the top every time the page is opened.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const addToCompare = (plan) => {
    dispatch(addToPlanComparison(plan));
  };

  const removeFromCompare = (plan) => {
    dispatch(removeFromPlanComparison(plan));
  };

  return (
    <>
      <div className="compare-page-container w-[100vw] m-1">
        <h1 className="page-title !text-[2rem]">
          {comparedPlans.length === 1 ? 'Selected Plan' : 'Selected Plans'}
        </h1>
        {comparedPlans.length > 0 ? (
          <div className="plans-container">
            {groupPlansByYear(comparedPlans).map((planGroup) => (
              <PlanComponent
                key={planGroup.key}
                planGroup={planGroup}
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
