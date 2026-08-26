package com.jmcolegroup.plancomparison.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

  // Companies that actually have a plan in this county for a given plan year.
  //
  // Written as explicit JPQL rather than a derived name so that county and
  // plan year are constrained on the SAME plan. A derived query with two
  // Plans_ traversals joins `plans` twice, which would match a company that
  // has some plan in the county and some unrelated plan in the year.
  @Query("""
      select distinct c.id as id, c.companyName as companyName
      from Company c
      join c.plans p
      join p.counties ct
      where lower(ct.countyName) = lower(:countyName)
        and p.planYear = :planYear
      """)
  List<CompanySummary> findCompaniesInCountyForYear(@Param("countyName") String countyName,
                                                    @Param("planYear") int planYear);

}