package com.jmcolegroup.plancomparison.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CallRequest {
  @NotBlank
  private String fname;

  @NotBlank
  private String lname;

  @Email
  private String email;

  @NotBlank
  private String phone;

  @Size(max = 1000)
  private String message;

  // getters/setters
  public String getFname() { return fname; }
  public void setFname(String fname) { this.fname = fname; }

  public String getLname() { return lname; }
  public void setLname(String lname) { this.lname = lname; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
}
