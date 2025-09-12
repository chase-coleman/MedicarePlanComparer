import axios from "axios";
import { useEffect } from "react";
import ButtonComponent from "../components/ButtonComponent";
import { useSelector, useDispatch } from "react-redux";
import { parseAxiosError } from "../functions/axiosError"; // handles axios error messages
// Redux Slice setters
import { setCounty } from "../features/county/countySlice";
import { setErrorMsg } from "../features/errors/errorSlice";
import { setCompanies } from "../features/companies/companiesSlice";
import { setSelectedCompany } from "../features/companies/selectedCompanySlice";
import { setPlans } from "../features/plans/companyPlansSlice";
import {
  addToPlanComparison,
  removeFromPlanComparison,
  clearNotice,
  setComparedPlans,
} from "../features/plans/comparedPlansSlice";

import PlanComponent from "../components/PlanComponent";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const ExplorePage = () => {
  const dispatch = useDispatch(); // redux state updater
  const county = useSelector((state) => state.county.value); // selected county value
  const errorMsg = useSelector((state) => state.county.value); // error message value
  const companies = useSelector((state) => state.companies.value); // companies in a county value
  const selectedCompany = useSelector((state) => state.selectedCompany.value); // the county the user selects to view their plans
  const companyPlans = useSelector((state) => state.companyPlans.value);
  const comparisonErrorNotice = useSelector(
    (state) => state.comparedPlans.notice
  );
  const comparedPlans = useSelector((state) => state.comparedPlans.value);

  useEffect(() => {
    if (!county) return;
    getCompanies();
  }, [county]);

  const getCompanies = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/${county}`);
      dispatch(setCompanies(response.data));
    } catch (error) {
      // set the errorMsg state to the axios error
      // using a custom axios error message handler
      dispatch(setErrorMsg(parseAxiosError(error)));
    }
  };

  useEffect(() => {
    if (!selectedCompany) return;
    getCompanyPlans();
  }, [selectedCompany]);

  const getCompanyPlans = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/${county}/${selectedCompany}`
      );
      dispatch(setPlans(response.data));
    } catch (error) {
      dispatch(setErrorMsg(parseAxiosError(error)));
    }
  };

  const selectCounty = (countyName) => {
    dispatch(setSelectedCompany(null)); // clear their previous company selection
    dispatch(setPlans()); // clear the companies plans
    dispatch(setCounty(countyName));
  };

  const addToCompare = (plan) => {
    dispatch(addToPlanComparison(plan));
  };

  const removeFromCompare = (plan) => {
    dispatch(removeFromPlanComparison(plan));
  };

  useEffect(() => {
    console.log("compared plans:", comparedPlans);
  }, [comparedPlans]);

  useEffect(() => {
    if (!comparisonErrorNotice) return;
    console.log(comparisonErrorNotice);
  }, [comparisonErrorNotice]);

  return (
    <>
      <div className="explore-page-container w-[100vw] m-1">
        <div className="county-container w-[90vw] h-25 ">
          <div>
            <span className="text-black font-semibold text-[1.5em]">
              Select your county:
            </span>
          </div>
          <div className="county-buttons-container">
            <ButtonComponent
              text="Linn"
              onPress={() => selectCounty("Linn")}
              className={
                county == `Linn`
                  ? `bg-red-500 text-[FFFFFF] font-semibold`
                  : "bg-main text-[FFFFFF] font-semibold"
              }
            />
            <ButtonComponent
              text="Tillamook"
              onPress={() => selectCounty("Tillamook")}
              className={
                county == `Tillamook`
                  ? `bg-red-500 text-[FFFFFF] font-semibold`
                  : "bg-main text-[FFFFFF] font-semibold"
              }
            />
            <ButtonComponent
              text="Lincoln"
              onPress={() => selectCounty("Lincoln")}
              className={
                county == `Lincoln`
                  ? `bg-red-500 text-[FFFFFF] font-semibold`
                  : "bg-main text-[FFFFFF] font-semibold"
              }
            />
          </div>
        </div>
        <div className="company-container block w-[90vw]">
          <div>
            {county && (
              <span className="text-black font-semibold text-[1.5em]">
                Select a company to view their plans in {county} county:
              </span>
            )}
          </div>
          <div className="company-buttons gap-3 p-2">
            {" "}
            {/* 🔹 gap handles spacing */}
            {companies.map((company) => (
              <ButtonComponent
                key={company.id}
                text={company.companyName}
                onPress={() =>
                  dispatch(setSelectedCompany(company.companyName))
                }
                className={
                  selectedCompany == company.companyName
                    ? `bg-red-500 text-white font-semibold`
                    : `bg-main text-white font-semibold`
                }
              />
            ))}
          </div>
        </div>
        {companyPlans.length > 0 && (
          <span className="text-black font-semibold text-sm">
            The plans displayed are <span className="italic text-[#E63946]">highlights</span>, not the full benefits. <br /> If
            you'd like to learn more about them, please click the "Request a
            Call" button!{" "}
          </span>
        )}
        <div className="plans-container w-[90vw]">
          {companyPlans &&
            companyPlans.map((plan) => (
              <PlanComponent
                key={plan.id}
                plan={plan}
                addToCompare={addToCompare}
                removeFromCompare={removeFromCompare}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
