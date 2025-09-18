package com.jmcolegroup.plancomparison.controller;

import com.jmcolegroup.plancomparison.dto.CallRequest;
import com.jmcolegroup.plancomparison.service.MailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/request-call")
public class CallRequestController {
  private final MailService mailService;

  private CallRequestController(MailService mailService) {
    this.mailService = mailService;
  }

  @PostMapping
  public ResponseEntity<Void> submit(@Valid @RequestBody CallRequest req) {
    mailService.sendCallRequest(req);
    return ResponseEntity.accepted().build();
  }
  
}
