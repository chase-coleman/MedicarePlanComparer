package com.jmcolegroup.plancomparison.controller;

import org.springframework.web.bind.annotation.*;
import com.jmcolegroup.plancomparison.repo.CompanyRepository;
import com.jmcolegroup.plancomparison.repo.CompanyRepository.CompanySummary;
import java.util.List;

@RestController
@RequestMapping("/")
public class CountyController {

  private final CompanyRepository repository;

  public CountyController(CompanyRepository repository) {
    this.repository = repository;
  }

  // ?year= is optional. Without it the response is unchanged: every company
  // serving the county, regardless of plan year. With it, only companies that
  // actually have a plan in that county for that year.
  @GetMapping("{countyName}")
  public List<CompanySummary> all(@PathVariable String countyName,
                                  @RequestParam(required = false) Integer year) {
    if (year == null) {
      return repository.findDistinctByCounties_CountyNameIgnoreCase(countyName);
    }
    return repository.findCompaniesInCountyForYear(countyName, year);
  }
}
