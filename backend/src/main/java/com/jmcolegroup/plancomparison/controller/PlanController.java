package com.jmcolegroup.plancomparison.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.jmcolegroup.plancomparison.repo.PlanRepository;
import com.jmcolegroup.plancomparison.repo.PlanRepository.PlanSummary;


@RestController
@RequestMapping("/{countyName}")
public class PlanController {
  private final PlanRepository repository;

  PlanController(PlanRepository repository) {
    this.repository = repository;
  }

  // ?year= is optional. Without it every plan year is returned and the client
  // groups by planGroupId to drive the year toggle. With it, one year only.
  @GetMapping("/{companyName}")
  public List<PlanSummary> all(@PathVariable String companyName,
                               @PathVariable String countyName,
                               @RequestParam(required = false) Integer year) {
    if (year == null) {
      return repository.findDistinctByCompany_CompanyNameIgnoreCaseAndCounties_CountyNameIgnoreCase(companyName, countyName);
    }
    return repository.findDistinctByCompany_CompanyNameIgnoreCaseAndCounties_CountyNameIgnoreCaseAndPlanYear(companyName, countyName, year);
  }
}