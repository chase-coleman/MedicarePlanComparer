package com.plancomparison.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jmcolegroup.plancomparison.entity.Plan;

public interface PlanRepository extends JpaRepository<Plan, Long> {
  boolean existsByPlanName(String planName);
}
