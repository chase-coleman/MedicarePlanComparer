import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jmcolegroup.plancomparison.entity.Plan;
import com.jmcolegroup.plancomparison.entity.County;

import com.plancomparison.repo.CountyRepository;
import com.jmcolegroup.plancomparison.repo.PlanRepository;


@Service
public class PlanCountyLinker {
  private final PlanRepository planRepo;
  private final CountyRepository countyRepo;

  public PlanCountyLinker(PlanRepository planRepo, CountyRepository countyRepo) {
    this.planRepo = planRepo;
    this.countyRepo = countyRepo;
  }

  @Transactional
  public void linkCountyToPlan(Long planId, Long countyId) {
    Plan plan = planRepo.findById(planId).orElseThrow(() -> new RuntimeException("Plan not found: " + planId));
    County county = countyRepo.findById(countyId).orElseThrow(() -> new RuntimeException("County not found: " + countyId));

    plan.addCounty(county);
    planRepo.save(plan);
  }

  @Transactional
  public void unlinkCountyFromPlan(Long planId, Long countyId) {
    Plan plan = planRepo.findById(planId).orElseThrow(() -> new RuntimeException("Plan not found: " + planId));
    County county = countyRepo.findById(countyId).orElseThrow(() -> new RuntimeException("County not found: " + countyId));

    plan.removeCounty(county);
    planRepo.save(plan);
  }
}