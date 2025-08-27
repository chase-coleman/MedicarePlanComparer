package com.jmcolegroup.plancomparison.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jmcolegroup.plancomparison.entity.Plan;

import java.math.BigDecimal;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {
  boolean existsByPlanName(String planName);

  interface PlanSummary {
    Long getId();
    String getPlanName();
    BigDecimal getMonthlyPremium();
    int getMoop();
    String getPlanType();
    int getDrVisit();
    int getErVisit();
    int getHospitalStay();
    int getHospitalStayLength();
    int getSurgery();
    int getRadiologyCopay();
    int getRadiologyCoinsurance();
    int getDentalBenefit();
    int getOtcCredit();
    String getOtcRenewal();
    BigDecimal getGivebackAmount();
  }

  List <PlanSummary> findDistinctByCompany_CompanyNameIgnoreCaseAndCounties_CountyNameIgnoreCase(String companyName, String countyName);

}
