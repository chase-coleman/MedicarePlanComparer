import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import ButtonComponent from "./ButtonComponent";
import { useSelector } from "react-redux";
import { useState } from "react";
import { PLAN_YEARS } from "../data/constants";

const PlanComponent = ({ planGroup, addToCompare, removeFromCompare }) => {
  const comparedPlans = useSelector((state) => state.comparedPlans.value);
  const selectedCompany = useSelector((state) => state.selectedCompany.value); // the county the user selects to view their plans
  // Open on the plan's earliest available year.
  const [planYear, setPlanYear] = useState(() => planGroup.years[0]);

  // The record for the selected year. Undefined when the plan is not offered
  // that year, which is a state the card renders rather than an error.
  const plan = planGroup.byYear.get(planYear);

  // Placeholder plan-years carry zeroed benefits. Render N/A rather than a
  // wall of $0, which would read as a real (and very attractive) benefit.
  const published = plan ? plan.benefitsPublished !== false : true;
  const na = (value) => (published ? value : "N/A");

  return (
    <>
      <div className="plan-card">
        <div className="plan-card-header">
          <div className="plan-card-heading">
            <span className="plan-card-name">{planGroup.planName}</span>
            {planGroup.cmsPlanId && (
              <span className="plan-card-cms">{planGroup.cmsPlanId}</span>
            )}
          </div>
          <div className="year-toggle" role="group" aria-label="Plan year">
            {PLAN_YEARS.map((year) => {
              const offered = planGroup.byYear.has(year);
              return (
                <button
                  key={year}
                  type="button"
                  aria-pressed={planYear === year}
                  title={offered ? undefined : `Not offered in ${year}`}
                  className={[
                    "year-toggle-option",
                    planYear === year ? "year-toggle-option-active" : "",
                    offered ? "" : "year-toggle-option-empty",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setPlanYear(year)}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
        {!plan ? (
          <div className="plan-unavailable">
            <p className="plan-unavailable-title">{planYear} plan info not available until October 1st</p>
            <p className="plan-unavailable-body">
              {planGroup.years.length > 0
                ? `This plan is available for ${planGroup.years.join(" and ")}.`
                : "This plan has no published benefits."}
            </p>
          </div>
        ) : (
          <>
            {!published && (
              <p className="plan-pending">
                {planYear} benefits have not been published yet.
              </p>
            )}
            {published && plan.planType === "C-SNP" && (
              <p className="plan-note">
                This plan is only for individuals with certain qualifying
                chronic conditions.
              </p>
            )}
            {published && selectedCompany == "Devoted" && (
              <p className="plan-note">
                Ask use about Devoted's Food&amp;Home card that can pay for
                groceries, rent, or your utility bill!
              </p>
            )}

            <Table
              isStriped
              hideHeader
              removeWrapper
              aria-label={`${plan.planName} benefit highlights`}
              className="plan-table-component"
            >
              <TableHeader>
                <TableColumn>Benefit</TableColumn>
                <TableColumn>Detail</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="monthly">
                  <TableCell>Monthly Premium</TableCell>
                  <TableCell>{na(`$${plan.monthlyPremium}`)}</TableCell>
                </TableRow>
                <TableRow key="moop">
                  <TableCell>Max-out-of-Pocket (In-Network)</TableCell>
                  <TableCell>{na(`$${plan.moop}`)}</TableCell>
                </TableRow>
                <TableRow key="rx">
                  <TableCell>Drug Coverage</TableCell>
                  <TableCell>
                    {na(plan.rxCoverage ? "Included" : "Not Included")}
                  </TableCell>
                </TableRow>
                <TableRow key="plan_type">
                  <TableCell>Plan Type</TableCell>
                  <TableCell>{na(plan.planType)}</TableCell>
                </TableRow>
                <TableRow key="pcp">
                  <TableCell>PCP Visit</TableCell>
                  <TableCell>{na(`$${plan.drVisit}`)}</TableCell>
                </TableRow>
                <TableRow key="er">
                  <TableCell>ER Visit</TableCell>
                  <TableCell>{na(`$${plan.erVisit}`)}</TableCell>
                </TableRow>
                <TableRow key="hospital_stay">
                  <TableCell>Hospital Stay</TableCell>
                  <TableCell>
                    {na(
                      `$${plan.hospitalStay} copay per day, days 1-${plan.hospitalStayLength}`,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow key="surgery">
                  <TableCell>Hospital Surgery</TableCell>
                  <TableCell>
                    {na(
                      !plan.surgeryCopayType
                        ? "20%"
                        : plan.surgeryMin === plan.surgeryMax
                          ? `$${plan.surgeryMin}`
                          : `$${plan.surgeryMin} - $${plan.surgeryMax}`,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow key="radiology">
                  <TableCell>
                    {plan.radiologyCoinsurance > 0
                      ? "Radiology Coinsurance"
                      : "Radiology Copay"}
                  </TableCell>
                  <TableCell>
                    {na(
                      plan.radiologyCoinsurance > 0
                        ? `$${plan.radiologyCoinsurance}`
                        : plan.radiologyCopayMin === plan.radiologyCopayMax
                          ? `$${plan.radiologyCopayMin}`
                          : `$${plan.radiologyCopayMin} - $${plan.radiologyCopayMax}`,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow key="dental">
                  <TableCell>Dental Benefit</TableCell>
                  <TableCell>{na(`$${plan.dentalBenefit} per year`)}</TableCell>
                </TableRow>
                <TableRow key="otc_credit">
                  <TableCell>OTC Credit</TableCell>
                  <TableCell>
                    {na(plan.otcCredit > 0 ? `$${plan.otcCredit}` : "N/A")}
                  </TableCell>
                </TableRow>
                <TableRow key="otc_renewal">
                  <TableCell>OTC Renewal</TableCell>
                  <TableCell>
                    {na(
                      plan.otcRenewal
                        ? plan.otcRenewal.charAt(0).toUpperCase() +
                            plan.otcRenewal.slice(1)
                        : "N/A",
                    )}
                  </TableCell>
                </TableRow>
                <TableRow key="giveback">
                  <TableCell>Part B Giveback</TableCell>
                  <TableCell>
                    {na(
                      plan.givebackAmount > 0
                        ? `$${plan.givebackAmount} per month`
                        : "N/A",
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="plan-card-actions">
              {comparedPlans.some(
                (comparedPlan) => comparedPlan.id == plan.id,
              ) ? (
                <ButtonComponent
                  styling="h-9 bg-accent"
                  text={"Remove from compare"}
                  onPress={() => removeFromCompare(plan)}
                />
              ) : (
                <ButtonComponent
                  text={"Add to compare"}
                  styling="h-9 bg-brand"
                  onPress={() => addToCompare(plan)}
                />
              )}
            </div>

            <div className="plan-disclaimers">
              <p>
                This is a brief summary, not a complete description of benefits.
                For more information, please refer to the plan’s Evidence of
                Coverage (EOC) or Summary of Benefits. Limitations, copayments,
                and restrictions may apply.
              </p>
              <p>
                {selectedCompany} is a Medicare Advantage plan with a Medicare
                contract. Enrollment in {selectedCompany} depends on contract
                renewal.
              </p>
              <p>
                All copays/coinsurance amounts shown are in-network. PPO plans
                that offer out-of-network coverage may have higher coverage
                costs for those services.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlanComponent;
