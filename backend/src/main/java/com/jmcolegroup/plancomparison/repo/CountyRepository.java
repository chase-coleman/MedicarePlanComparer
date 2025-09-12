package com.jmcolegroup.plancomparison.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jmcolegroup.plancomparison.entity.County;

public interface CountyRepository extends JpaRepository<County, Long> {
  boolean existsByCountyName(String countyName);
}
