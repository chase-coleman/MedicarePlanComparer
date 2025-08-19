package com.jmcolegroup.plancomparison;

import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/demo")
public class DemoController {
  private final DemoRepository repo;
  public DemoController(DemoRepository repo) { this.repo = repo; }
  @PostMapping public DemoEntity create(@RequestBody DemoEntity d){ return repo.save(d); }
  @GetMapping  public List<DemoEntity> all(){ return repo.findAll(); }
}