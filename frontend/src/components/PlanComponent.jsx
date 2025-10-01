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

const PlanComponent = ({ plan, addToCompare, removeFromCompare }) => {
  const comparedPlans = useSelector((state) => state.comparedPlans.value);
  const selectedCompany = useSelector((state) => state.selectedCompany.value); // the county the user selects to view their plans

  return (
    <>
      <div>
        {comparedPlans.some((comparedPlan) => comparedPlan.id == plan.id) ? (
          <ButtonComponent
            styling="h-8 bg-red text-[FFFFFF]"
            text={"Remove from compare"}
            onPress={() => removeFromCompare(plan)}
          />
        ) : (
          <ButtonComponent
            text={"Add to compare"}
            styling="h-8 bg-main text-[FFFFFF]"
            onPress={() => addToCompare(plan)}
          />
        )}
        <Table isStriped className="plan-table-component text-black">
          <TableHeader>
            <TableColumn>Plan Name</TableColumn>
            <TableColumn>{plan.planName}</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="disclaimer">
              <TableCell
                colSpan={2}
                className="text-xs text-red-500 italic whitespace-normal bold"
              >
                {plan.planType === "C-SNP" && (
                  <span>
                    This plan is only for individuals with certain qualifying
                    chronic conditions.
                  </span>
                )}
              </TableCell>
            </TableRow>
            <TableRow key="monthly">
              <TableCell>Monthly Premium</TableCell>
              <TableCell>${plan.monthlyPremium}</TableCell>
            </TableRow>
            <TableRow key="moop">
              <TableCell>Max-out-of-Pocket (In-Network)</TableCell>
              <TableCell>${plan.moop}</TableCell>
            </TableRow>
            <TableRow key="rx">
              <TableCell>Drug Coverage</TableCell>
              {plan.rxCoverage ? (
                <TableCell>Included</TableCell>
              ) : (
                <TableCell>Not Included</TableCell>
              )}
            </TableRow>
            <TableRow key="plan_type">
              <TableCell>Plan Type</TableCell>
              <TableCell>{plan.planType}</TableCell>
            </TableRow>
            <TableRow key="pcp">
              <TableCell>PCP Visit</TableCell>
              <TableCell>${plan.drVisit}</TableCell>
            </TableRow>
            <TableRow key="er">
              <TableCell>ER Visit</TableCell>
              <TableCell>${plan.erVisit}</TableCell>
            </TableRow>
            <TableRow key="hospital_stay">
              <TableCell>Hospital Stay</TableCell>
              <TableCell>
                ${plan.hospitalStay} copay per day, days 1-
                {plan.hospitalStayLength}{" "}
              </TableCell>
            </TableRow>
            <TableRow key="surgery">
              <TableCell>Hospital Surgery</TableCell>
              {!plan.surgeryCopayType ? (
                <TableCell>20%</TableCell>
              ) : plan.surgeryMin === plan.surgeryMax ? (
                <TableCell>${plan.surgeryMin}</TableCell>
              ) : (
                <TableCell>
                  ${plan.surgeryMin} - ${plan.surgeryMax}
                </TableCell>
              )}
            </TableRow>
            <TableRow key="radiology">
              <TableCell>
                {plan.radiologyCoinsurance > 0
                  ? "Radiology Coinsurance"
                  : "Radiology Copay"}
              </TableCell>
              <TableCell>
                {plan.radiologyCoinsurance > 0 ? (
                  <>${plan.radiologyCoinsurance}</>
                ) : plan.radiologyCopayMin === plan.radiologyCopayMax ? (
                  <>${plan.radiologyCopayMin}</>
                ) : (
                  <>
                    ${plan.radiologyCopayMin} - ${plan.radiologyCopayMax}
                  </>
                )}
              </TableCell>
            </TableRow>
            <TableRow key="dental">
              <TableCell>Dental Benefit</TableCell>
              <TableCell>${plan.dentalBenefit} per year</TableCell>
            </TableRow>
            <TableRow key="otc_credit">
              <TableCell>OTC Credit</TableCell>
              {plan.otcCredit > 0 ? (
                <TableCell>${plan.otcCredit}</TableCell>
              ) : (
                <TableCell>N/A</TableCell>
              )}
            </TableRow>
            <TableRow key="otc_renewal">
              <TableCell>OTC Renewal</TableCell>
              <TableCell>
                {plan.otcRenewal.charAt(0).toUpperCase() +
                  plan.otcRenewal.slice(1)}
              </TableCell>
            </TableRow>
            <TableRow key="giveback">
              <TableCell>Part B Giveback</TableCell>
              {plan.givebackAmount > 0 ? (
                <TableCell>${plan.givebackAmount} per month</TableCell>
              ) : (
                <TableCell>N/A</TableCell>
              )}
            </TableRow>
            <TableRow key="disclaimer">
              <TableCell
                colSpan={2}
                className="text-xs text-gray-500 italic whitespace-normal"
              >
                This is a brief summary, not a complete description of benefits.
                For more information, please refer to the plan’s Evidence of
                Coverage (EOC) or Summary of Benefits. Limitations, copayments,
                and restrictions may apply.
              </TableCell>
            </TableRow>
            <TableRow key="disclaimer">
              <TableCell
                colSpan={2}
                className="text-xs text-gray-500 italic whitespace-normal"
              >
                {selectedCompany} is a Medicare Advantage plan with a Medicare
                contract. Enrollment in {selectedCompany} depends on contract
                renewal.
              </TableCell>
            </TableRow>
            <TableRow key="disclaimer">
              <TableCell
                colSpan={2}
                className="text-xs text-gray-500 italic whitespace-normal bold"
              >
                All copays/coinsurance amounts shown are in-network. PPO plans
                that offer out-of-network coverage may have higher coverage
                costs for those services.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PlanComponent;
