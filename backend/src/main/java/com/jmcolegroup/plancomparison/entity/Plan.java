package com.jmcolegroup.plancomparison.entity;


import jakarta.persistence.*;
import java.util.Set;
import java.math.BigDecimal;
import java.util.HashSet;

@Entity
public class Plan {
  
  @Id 
  @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL auto-increment
  private Long id;
  
  // id getter/setter
  private Long getId() { return id; }
  private void setId(Long id) { this.id = id; }

  @Column(nullable = false, unique = true)
  private String planName;

  // Plan Name getter/setter
  private String getPlanName() { return planName; }
  private void setPlanName(String planName) {this.planName = planName; }

  @Column(nullable = false, unique = false)
  private BigDecimal monthlyPremium;

  // monthly premium getter/setter
  private BigDecimal getMonthlyPremium() { return monthlyPremium; }
  private void setMonthlyPremium(BigDecimal monthlyPremium) { this.monthlyPremium = monthlyPremium; }

  @Column(nullable = false, unique = false)
  private int moop;

  // max out of pocket getter/setter
  private int getMoop() { return moop; }
  private void setMoop(int moop) { this.moop = moop; }

  @Column(nullable = false, unique = false)
  private String planType;

  // plan type getter/setter
  private String getPlanType() { return planType; }
  private void setPlanType(String planType) { this.planType = planType; }

  @Column(nullable = false, unique = false)
  private int drVisit;

  // dr visit getter/setter
  private int getDrVisit() { return drVisit; }
  private void setDrVisit(int drVisit) { this.drVisit = drVisit; }

  @Column(nullable = false, unique = false)
  private int erVisit;

  // ER visit getter/setter
  private int getErVisit() { return erVisit; }
  private void setErVisit(int erVisit) { this.erVisit = erVisit; }

  @Column(nullable = false, unique = false)
  private int hospitalStay;

  // hospital visit getter/setter
  private int getHospitalStay() { return hospitalStay; }
  private void setHospitalStay(int hospitalStay) { this.hospitalStay = hospitalStay; }

  @Column(nullable = false, unique = true)
  private int hospitalStayLength;

  private int getHospitalStayLength() { return hospitalStayLength; }
  private void setHospitalStayLength(int hospitalStayLength) { this.hospitalStayLength = hospitalStayLength; }

  @Column(nullable = false, unique = false)
  private int surgery;

  // surger getter/setter
  private int getSurgery() { return surgery; }
  private void setSurgery(int surgery) { this.surgery = surgery; }

  @Column(nullable = false, unique = false)
  private int radiologyCopay;

  // radiologyCopay getter/setter
  private int getRadiologyCopay() { return radiologyCopay; }
  private void setRadiologyCopay(int radiologyCopay) { this.radiologyCopay = radiologyCopay; }

  @Column(nullable = false, unique = false)
  private int radiologyCoinsurance;

  private int getRadiologyCoinsurance() { return radiologyCoinsurance; }
  private void setRadiologyCoinsurance(int radiologyCoinsurance) { this.radiologyCoinsurance = radiologyCoinsurance; }

  @Column(nullable = false, unique = false)
  private int dentalBenefit;

  // dental benefit setter
  private int getDentalBenefit() { return dentalBenefit; }
  private void setDentalBenefit(int dentalBenefit) { this.dentalBenefit = dentalBenefit; }

  @Column(nullable = false, unique = false)
  private int otcCredit;

  // OTC Credit getter/setter
  private int getOtcCredit() { return otcCredit; }
  private void setOtcCredit(int otcCredit) { this.otcCredit = otcCredit; }

  @Column(nullable = true, unique = false)
  private String otcRenewal;

  // OTC Renewal period
  private String getOtcRenewal() { return otcRenewal; }
  private void setOtcRenewal(String otcRenewal) { this.otcRenewal = otcRenewal; }

  @ManyToMany
  @JoinTable(
    name = "counties_plan",
    joinColumns = @JoinColumn(name = "plan_id"), // the entity that the relationship is being established in
    inverseJoinColumns = @JoinColumn(name = "county_id")) // the related entity
    // Type SET is used because this is a ManyToMany relationship, or a collection of related entities
  private Set<County> counties = new HashSet<>();

  public Set<County> getCounties() { return counties; }
  public void setCounties(Set<County> counties) { this.counties = counties; }


  // FetchType.LAZY only queries the data when needed, unlike type EAGER that calls it immediately 
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "company_id", nullable = false)
  // Type Company tells JPA to look for an entity named Company since this is a ManyToOne relationship
  private Company company;

  public Company getCompany() { return company; }
  public void setCompany(Company company) { this.company = company; }


}
