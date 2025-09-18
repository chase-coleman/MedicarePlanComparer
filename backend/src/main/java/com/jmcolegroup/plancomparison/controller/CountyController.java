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

  @GetMapping("{countyName}")
  public List<CompanySummary> all(@PathVariable String countyName) {
    return repository.findDistinctByCounties_CountyNameIgnoreCase(countyName);
  }
}
