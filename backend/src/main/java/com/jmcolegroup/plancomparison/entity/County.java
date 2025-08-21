package com.jmcolegroup.plancomparison.entity;
import jakarta.persistence.*;
import java.util.Set;

import com.jmcolegroup.plancomparison.entity.Plan;

import java.util.HashSet;

@Entity // Tells Spring that this class is a table in the database
public class County {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) //MySQL auto_increment
  private Long id;

  @Column(nullable = false, unique = false)
  private String countyName;

  @ManyToMany(mappedBy = "counties")
  Set<Plan> plans = new HashSet<>();

  public Set<Plan> getPlans() { return plans; }
  public void setPlans(Set<Plan> plans) { this.plans = plans;}

  // id getter/setter
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  // county name getter/setter
  public String getCountyName() { return countyName; }
  public void setCountyName(String countyName) { this.countyName = countyName; }

  // mirror method that creates the relationship between a county and plan
  public void addPlan(Plan plan) {
    this.plans.add(plan);
    plan.getCounties().add(this);
  }
  // mirror method that removes the relationship between a county and plan
  public void removePlan(Plan plan) {
    this.plans.remove(plan);
    plan.getCounties().remove(this);
  }
}
