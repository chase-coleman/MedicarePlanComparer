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
} from "../features/plans/comparedPlansSlice";
import PlanComponent from "../components/PlanComponent";
import { groupPlansByYear } from "../functions/groupPlans";
import { useState } from "react";
import { Alert } from "@heroui/react";
import {
  API_URL,
  ALL_COUNTIES,
  companyNotice,
  arePlansHidden,
  UNLISTED_COUNTY_NOTICE,
} from "../data/constants";
import LoaderComponent from "../components/LoaderComponent";

const ExplorePage = () => {
  const dispatch = useDispatch(); // redux state updater
  const county = useSelector((state) => state.county.value); // selected county value
  const errorMsg = useSelector((state) => state.county.value); // error message value
  const companies = useSelector((state) => state.companies.value); // companies in a county value
  const selectedCompany = useSelector((state) => state.selectedCompany.value); // the county the user selects to view their plans
  const companyPlans = useSelector((state) => state.companyPlans.value);
  const comparedPlans = useSelector((state) => state.comparedPlans.value);
  // Carriers on the hidden list keep their button and notice but show no plan
  // cards, and no "still adding plans" message either -- the notice is the
  // explanation, so the empty state would contradict it.
  const plansHidden = arePlansHidden(selectedCompany);
  const [isOctoberYet, setIsOctoberYet] = useState(true);
  // An empty `companies` list means one of two different things: the fetch has
  // not come back yet, or the county genuinely has no companies. These flags
  // keep the empty-state message off the screen during the first case.
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);
  // companiesLoaded/plansLoaded mean "the fetch came back"; these mean "a
  // fetch is in flight". They are separate so a failed request clears the
  // spinner without being mistaken for a successful empty result.
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  useEffect(() => {
    if (!county) return;
    getCompanies();
  }, [county]);

  const getCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await axios.get(`${API_URL}${county}`);
      dispatch(setCompanies(response.data));
      setCompaniesLoaded(true);
    } catch (error) {
      // set the errorMsg state to the axios error
      // using a custom axios error message handler
      dispatch(setErrorMsg(parseAxiosError(error)));
    } finally {
      setCompaniesLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCompany) return;
    setPlansLoaded(false);
    getCompanyPlans();
  }, [selectedCompany]);

  const getCompanyPlans = async () => {
    setPlansLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}${county}/${selectedCompany}`,
      );
      dispatch(setPlans(response.data));
      setPlansLoaded(true);
    } catch (error) {
      dispatch(setErrorMsg(parseAxiosError(error)));
    } finally {
      setPlansLoading(false);
    }
  };

  const selectCounty = (countyName) => {
    dispatch(setSelectedCompany(null)); // clear their previous company selection
    dispatch(setPlans()); // clear the companies plans
    dispatch(setCompanies([])); // drop the previous county's companies
    setCompaniesLoaded(false);
    setPlansLoaded(false);
    dispatch(setCounty(countyName));
  };

  const addToCompare = (plan) => {
    dispatch(addToPlanComparison(plan));
  };

  const removeFromCompare = (plan) => {
    dispatch(removeFromPlanComparison(plan));
  };

  return (
    <>
      {isOctoberYet ? (
        <div className="explore-page-container w-[100vw] m-1">
          <div className="site-notice">
            <p>{UNLISTED_COUNTY_NOTICE}</p>
          </div>
          <div className="county-container w-[90vw]">
            <div>
              <span className="section-title">Select your county:</span>
            </div>
            <div className="county-buttons-container">
              {ALL_COUNTIES.map((option) => (
                <ButtonComponent
                  key={option.countyName}
                  text={option.countyName}
                  onPress={() => selectCounty(option.countyName)}
                  className={
                    county === option.countyName
                      ? `btn-pill-active`
                      : `btn-pill`
                  }
                />
              ))}
            </div>
          </div>
          <div className="company-container block w-[90vw]">
            {/* A county we serve shows its companies. A county with none yet
                says so, rather than leaving the heading above an empty row. */}
            {companiesLoading ? (
              <LoaderComponent label={`Loading companies in ${county}`} />
            ) : county && companiesLoaded && companies.length === 0 ? (
              <p className="county-empty-state">
                We are still working at adding plans in {county}. Please
                check back soon, or use the "Request a Call" button and we will
                help you directly.
              </p>
            ) : (
              <>
                <div>
                  {county && (
                    <span className="section-title">
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
                          ? `btn-pill-active`
                          : `btn-pill`
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {plansLoading && (
            <LoaderComponent label={`Loading ${selectedCompany} plans`} />
          )}
          {!plansLoading && !plansHidden && companyPlans.length > 0 && (
            <span className="hint-text">
              The plans displayed are <em>highlights</em>, not the full
              benefits. <br /> If you'd like to learn more about them, please
              click the "Request a Call" button!{" "}
            </span>
          )}
          {selectedCompany && companyNotice(selectedCompany) && (
            <>
              <div className="site-notice">
              <p>{companyNotice(selectedCompany)}</p>
              <br />
              <p>If you would like information on their plans, please reach out to us or visit the company's site.</p>
              </div>
            </>
          )}
          {!plansLoading && !plansHidden && selectedCompany && plansLoaded && companyPlans.length === 0 && (
            <p className="county-empty-state">
              We are still working at adding {selectedCompany} plans in {county}{" "} county. Please check back soon, or select "Request a Call".
            </p>
          )}
          {!plansLoading && !plansHidden && (
            <div className="plans-container w-[90vw]">
              {groupPlansByYear(companyPlans).map((planGroup) => (
                <PlanComponent
                  key={planGroup.key}
                  planGroup={planGroup}
                  addToCompare={addToCompare}
                  removeFromCompare={removeFromCompare}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="explore-page-container w-[100vw] m-1 mt-5">
          <div className="w-4/5 h-12">
            <Alert
              color="warning"
              title="This page will show 2026 Plan Information starting on October 1, 2025 in accordance with CMS Rules and Regulations."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ExplorePage;
