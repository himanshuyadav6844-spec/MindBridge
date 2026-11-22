package com.mindbridge.modules.auth.dto;

import java.util.UUID;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String email;
    private String fullName;
    private String role;
    private boolean isDoctorVerified;

    public AuthResponse(String token, UUID id, String email, String fullName, String role, boolean isDoctorVerified) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.isDoctorVerified = isDoctorVerified;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isDoctorVerified() { return isDoctorVerified; }
    public void setDoctorVerified(boolean doctorVerified) { isDoctorVerified = doctorVerified; }
}
