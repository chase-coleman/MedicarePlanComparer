package com.jmcolegroup.plancomparison.entity;
import jakarta.persistence.*;


@Entity // Tells Spring that this class is a table in the database
public class Company {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL AUTO_INCREMENT
  private Long id;

  @Column(nullable = false, unique = true) // set the details of the column (ie name, length, unique)
  private String companyName;

  public Company() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getCompanyName() { return companyName; }
  public void setCompanyName(String companyName) { this.companyName = companyName; }
}

