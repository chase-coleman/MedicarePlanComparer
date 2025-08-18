package com.jmcolegroup.PlanComparison;
import jakarta.persistence.*;
@Entity
public class DemoEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
  String name;
}