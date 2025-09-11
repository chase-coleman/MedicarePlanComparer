package com.jmcolegroup.plancomparison.service;

import com.jmcolegroup.plancomparison.dto.CallRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  private final JavaMailSender mailSender;

  @Value("${app.mail.to}")
  private String toAddress;

  @Value("${app.mail.from}")
  private String fromAddress;

  public MailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }
  @Async
  public void sendCallRequest(CallRequest req) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(fromAddress);
    msg.setTo(toAddress);
    msg.setSubject("New Contact Request");
    msg.setText("""
        Name: %s %s
        Phone: %s
        Email %s
        Message: %s
        """.formatted(req.getFname(), req.getLname(), req.getPhone(), req.getEmail(), req.getMessage()));
        mailSender.send(msg);
  }
}
