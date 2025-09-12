package com.jmcolegroup.plancomparison.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.jmcolegroup.plancomparison.repo.PlanRepository;
import com.jmcolegroup.plancomparison.repo.PlanRepository.PlanSummary;


@RestController
@RequestMapping("/{countyName}")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class PlanController {
  private final PlanRepository repository;

  PlanController(PlanRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/{companyName}")
  public List<PlanSummary> all(@PathVariable String companyName, @PathVariable String countyName) {
    return repository.findDistinctByCompany_CompanyNameIgnoreCaseAndCounties_CountyNameIgnoreCase(companyName, countyName);
  }
}