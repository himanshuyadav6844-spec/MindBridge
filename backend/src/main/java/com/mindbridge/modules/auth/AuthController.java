package com.mindbridge.modules.auth;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.auth.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication & Security", description = "Endpoints for registration, login, JWT issuance, and password recovery")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/patient")
    @Operation(summary = "Register a new patient account")
    public ResponseEntity<ApiResponse<AuthResponse>> registerPatient(@Valid @RequestBody RegisterPatientRequest request) {
        AuthResponse response = authService.registerPatient(request);
        return ResponseEntity.ok(ApiResponse.success("Patient registered successfully", response));
    }

    @PostMapping("/register/doctor")
    @Operation(summary = "Register a new doctor account (pending administrative verification)")
    public ResponseEntity<ApiResponse<AuthResponse>> registerDoctor(@Valid @RequestBody RegisterDoctorRequest request) {
        AuthResponse response = authService.registerDoctor(request);
        return ResponseEntity.ok(ApiResponse.success("Doctor registered successfully. Account is pending administrative verification.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "User login for Patient, Doctor, or Administrator")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset token")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset instructions generated.", token));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using reset token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully. Please log in with your new credentials.", null));
    }
}
