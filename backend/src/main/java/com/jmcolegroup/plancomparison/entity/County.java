package com.jmcolegroup.plancomparison.entity;
import jakarta.persistence.*;

@Entity // Tells Spring that this class is a table in the database
public class County {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) //MySQL auto_increment
  private Long id;

  @Column(nullable = false, unique = false)
  private String countyName;

  // id getter/setter
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  // county name getter/setter
  public String getCountyName() { return countyName; }
  public void setCountyName(String countyName) { this.countyName = countyName; }
}
