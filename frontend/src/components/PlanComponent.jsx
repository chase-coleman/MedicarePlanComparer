import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";
import ButtonComponent from "./ButtonComponent";
import { useSelector, useDispatch } from "react-redux";

const PlanComponent = ({ plan, addToCompare, removeFromCompare }) => {
  const comparedPlans = useSelector((state) => state.comparedPlans.value);
  
  return (
  <>
  <div>
    {comparedPlans.some(comparedPlan => comparedPlan.id == plan.id) ?
  <ButtonComponent text={"Remove from compare"} className="h-8" onPress={() => removeFromCompare(plan)}/>    
  :<ButtonComponent text={"Add to compare"} className="h-8" onPress={() => addToCompare(plan)}/>    
    }
  <Table isStriped className="plan-table-component text-black">
  <TableHeader>
    <TableColumn>Plan Name</TableColumn>
    <TableColumn>{plan.planName}</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow key="monthly">
      <TableCell>Monthly Premium</TableCell>
      <TableCell>${plan.monthlyPremium}</TableCell>
    </TableRow>
    <TableRow key="moop">
      <TableCell>Max-out-of-Pocket</TableCell>
      <TableCell>${plan.moop}</TableCell>
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
      <TableCell>${plan.hospitalStay}</TableCell>
    </TableRow>
    <TableRow key="hospital_stay_length">
      <TableCell>Hospital Stay Length</TableCell>
      <TableCell>${plan.hospitalStayLength}</TableCell>
    </TableRow>
    <TableRow key="surgery">
      <TableCell>Hospital Surgery</TableCell>
      <TableCell>${plan.surgery}</TableCell>
    </TableRow>
    <TableRow key="radiology">
      <TableCell>
        {plan.radiologyCopay > 0 ? "Radiology Copay" : "Radiology Coinsurance"}
      </TableCell>
      <TableCell>
        ${plan.radiologyCopay > 0 ? plan.radiologyCopay : plan.radiologyCoinsurance}
      </TableCell>
    </TableRow>
    <TableRow key="dental">
      <TableCell>Dental Benefit</TableCell>
      <TableCell>${plan.dentalBenefit}</TableCell>
    </TableRow>
    <TableRow key="otc_credit">
      <TableCell>OTC Credit</TableCell>
      <TableCell>${plan.otcCredit}</TableCell>
    </TableRow>
    <TableRow key="otc_renewal">
      <TableCell>OTC Renewal</TableCell>
      <TableCell>${plan.otcRenewal}</TableCell>
    </TableRow>
    <TableRow key="giveback">
      <TableCell>Part B Giveback</TableCell>
      <TableCell>${plan.givebackAmount}</TableCell>
    </TableRow>
  </TableBody>
</Table>
  </div>
</>
  );
}

export default PlanComponent;