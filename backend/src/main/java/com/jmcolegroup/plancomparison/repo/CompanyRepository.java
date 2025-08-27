package com.jmcolegroup.plancomparison.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jmcolegroup.plancomparison.entity.Company;
import java.util.List;

// Company Summary is used to return companies that are within a certain county
// without recursively showig more info via backwards connections. 

public interface CompanyRepository extends JpaRepository<Company, Long> {
  boolean existsByCompanyName(String companyName);
  interface CompanySummary {
      Long getId();
      String getCompanyName();
  }
  List<CompanySummary> findDistinctByCounties_CountyNameIgnoreCase(String countyName);

}