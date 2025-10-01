package com.jmcolegroup.plancomparison.entity;
// https://thorben-janssen.com/hibernate-tips-map-bidirectional-many-many-association/

import jakarta.persistence.*;
import com.jmcolegroup.plancomparison.entity.County;

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

  @Column(nullable = false, unique = false)
  private String planName;

  // Plan Name getter/setter
  private String getPlanName() { return planName; }
  private void setPlanName(String planName) {this.planName = planName; }

  @Column(nullable = false)
  private BigDecimal monthlyPremium;

  // monthly premium getter/setter
  private BigDecimal getMonthlyPremium() { return monthlyPremium; }
  private void setMonthlyPremium(BigDecimal monthlyPremium) { this.monthlyPremium = monthlyPremium; }

  @Column(nullable = false)
  private int moop;

  // max out of pocket getter/setter
  private int getMoop() { return moop; }
  private void setMoop(int moop) { this.moop = moop; }

  @Column(nullable = false)
  private String planType;

  // plan type getter/setter
  private String getPlanType() { return planType; }
  private void setPlanType(String planType) { this.planType = planType; }

  @Column(nullable = false)
  private int drVisit;

  // dr visit getter/setter
  private int getDrVisit() { return drVisit; }
  private void setDrVisit(int drVisit) { this.drVisit = drVisit; }

  @Column(nullable = false)
  private int erVisit;

  // ER visit getter/setter
  private int getErVisit() { return erVisit; }
  private void setErVisit(int erVisit) { this.erVisit = erVisit; }

  @Column(nullable = false)
  private int hospitalStay;

  // hospital visit getter/setter
  private int getHospitalStay() { return hospitalStay; }
  private void setHospitalStay(int hospitalStay) { this.hospitalStay = hospitalStay; }

  @Column(nullable = false)
  private int hospitalStayLength;

  private int getHospitalStayLength() { return hospitalStayLength; }
  private void setHospitalStayLength(int hospitalStayLength) { this.hospitalStayLength = hospitalStayLength; }

  @Column(nullable = false)
  private int surgeryMin;

  // surger getter/setter
  private int getSurgeryMin() { return surgeryMin; }
  private void setSurgeryMin(int surgeryMin) { this.surgeryMin = surgeryMin; }
  
  @Column(nullable = false)
  private int surgeryMax;

  // surger getter/setter
  private int getSurgeryMax() { return surgeryMax; }
  private void setSurgeryMax(int surgeryMax) { this.surgeryMax = surgeryMax; }
  
  @Column(nullable = false)
  private boolean surgeryCopayType; // true = copay, false = coinsurance

    // surger getter/setter
  private boolean getSurgeryCopayType() { return surgeryCopayType; }
  private void setSurgeryCopayType(boolean surgeryCopayType) { this.surgeryCopayType = surgeryCopayType; }

  // radiology copay
  @Column(nullable = false)
  private int radiologyCopayMax;

  // radiologyCopayMax getter/setter
  private int getRadiologyCopayMax() { return radiologyCopayMax; }
  private void setRadiologyCopayMax(int radiologyCopayMax) { this.radiologyCopayMax = radiologyCopayMax; }

    @Column(nullable = false)
  private int radiologyCopayMin;

  // radiologyCopayMin getter/setter
  private int getRadiologyCopayMin() { return radiologyCopayMin; }
  private void setRadiologyCopayMin(int radiologyCopayMin) { this.radiologyCopayMin = radiologyCopayMin; }

  // radiology conisurance
  @Column(nullable = false)
  private int radiologyCoinsurance;

  private int getRadiologyCoinsurance() { return radiologyCoinsurance; }
  private void setRadiologyCoinsurance(int radiologyCoinsurance) { this.radiologyCoinsurance = radiologyCoinsurance; }

  // dental benefits
  @Column(nullable = false)
  private int dentalBenefit;

  // dental benefit setter
  private int getDentalBenefit() { return dentalBenefit; }
  private void setDentalBenefit(int dentalBenefit) { this.dentalBenefit = dentalBenefit; }

  @Column(nullable = false)
  private int otcCredit;

  // OTC Credit getter/setter
  private int getOtcCredit() { return otcCredit; }
  private void setOtcCredit(int otcCredit) { this.otcCredit = otcCredit; }

  @Column(nullable = false)
  private String otcRenewal;

  // OTC Renewal period
  private String getOtcRenewal() { return otcRenewal; }
  private void setOtcRenewal(String otcRenewal) { this.otcRenewal = otcRenewal; }

  // Giveback option
  @Column(nullable = false)
  private BigDecimal givebackAmount;

  // giveback getter/setters
  private BigDecimal getGivebackAmount() { return givebackAmount; }
  private void setGivebackAmount(BigDecimal givebackAmount) { this.givebackAmount = givebackAmount; }

  @Column(nullable = false)
  private boolean rxCoverage;

  private boolean getRxCoverage() { return rxCoverage; }
  private void setRxCoverage(boolean rxCoverage) { this.rxCoverage = rxCoverage; }

  @ManyToMany
  @JoinTable(
    name = "counties_plan",
    joinColumns = @JoinColumn(name = "plan_id"), // the parent entity in the relationship
    inverseJoinColumns = @JoinColumn(name = "county_id")) // the child/related entity
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

  // creates the relationship between a county and plan
  public void addCounty(County county) {
    this.counties.add(county);
    county.getPlans().add(this);
  }
  // removes the relationship between a county and plan
  public void removeCounty(County county) {
    this.counties.remove(county);
    county.getPlans().remove(this);
  }

}
