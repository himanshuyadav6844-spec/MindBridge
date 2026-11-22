package com.mindbridge.modules.patient;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.patient.dto.PatientDashboardResponse;
import com.mindbridge.modules.patient.dto.UpdatePatientProfileRequest;
import com.mindbridge.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping({"/api/patients", "/api/patient"})
@Tag(name = "Patient Dashboard & Profile", description = "Endpoints for patient overview, dynamic dashboard statistics, and profile management")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping({"/me", "/profile"})
    @Operation(summary = "Get current patient's personal profile information")
    public ResponseEntity<ApiResponse<PatientProfile>> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        PatientProfile profile = patientService.getPatientProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping({"/me", "/profile"})
    @Operation(summary = "Update personal profile information and emergency contact details")
    public ResponseEntity<ApiResponse<PatientProfile>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdatePatientProfileRequest request) {
        PatientProfile updated = patientService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping({"/me/dashboard", "/dashboard"})
    @Operation(summary = "Retrieve real-time patient dashboard data (mood, assessment trends, CBT progress, upcoming appointments)")
    public ResponseEntity<ApiResponse<PatientDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        PatientDashboardResponse dashboard = patientService.getDashboard(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
