package com.jmcolegroup.plancomparison.entity;
import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;

@Entity // Tells Spring that this class is a table in the database
public class Company {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL AUTO_INCREMENT
  private Long id;

  @Column(nullable = false, unique = true) // set the details of the column (ie name, length, unique)
  private String companyName;

  @OneToMany(
    mappedBy = "company",
    cascade = CascadeType.ALL,
    orphanRemoval = true)
    private Set<Plan> plans = new HashSet<>();

  public Set<Plan> getPlans() { return plans; }
  public void setPlans(Set<Plan> plans) { this.plans = plans; }

  // id getter/setter
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  // company name getter/setter
  public String getCompanyName() { return companyName; }
  public void setCompanyName(String companyName) { this.companyName = companyName; }
}

