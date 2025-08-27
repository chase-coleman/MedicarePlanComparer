package com.jmcolegroup.plancomparison;

import org.springframework.web.bind.annotation.*;
import com.jmcolegroup.plancomparison.repo.CompanyRepository;
import com.jmcolegroup.plancomparison.repo.CompanyRepository.CompanySummary;
import com.jmcolegroup.plancomparison.entity.Company;
import java.util.List;

@RestController
@RequestMapping("/counties")
public class CountyController{
  
  private final CompanyRepository repository;

  CountyController(CompanyRepository repository) {
    this.repository = repository;
  }

  // PathVariable is used to grab the countyName variable from the request URL
  @GetMapping("/{countyName}")
  public List<CompanySummary> all(@PathVariable String countyName) {
    return repository.findDistinctByCounties_CountyNameIgnoreCase(countyName);
  }
}




