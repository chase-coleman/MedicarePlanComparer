package com.plancomparison.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jmcolegroup.plancomparison.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
  boolean existsByCompanyName(String companyName);
}