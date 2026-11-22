package com.mindbridge.modules.admin;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.admin.dto.AdminDashboardStatsDto;
import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.doctor.dto.DoctorDto;
import com.mindbridge.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator Management", description = "Endpoints for platform overview, doctor verification, and user management")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated platform metrics and status counts")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        AdminDashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/doctors/pending")
    @Operation(summary = "List doctors awaiting administrative verification")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getPendingDoctors() {
        List<DoctorDto> list = adminService.getPendingDoctors();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @RequestMapping(value = "/doctors/{id}/verify", method = {RequestMethod.PUT, RequestMethod.POST})
    @Operation(summary = "Approve and verify a doctor profile")
    public ResponseEntity<ApiResponse<DoctorDto>> verifyDoctor(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DoctorDto verified = adminService.verifyDoctor(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Doctor account verified successfully", verified));
    }

    @GetMapping("/patients")
    @Operation(summary = "List registered patients (safeguarding private clinical responses)")
    public ResponseEntity<ApiResponse<List<User>>> getAllPatients() {
        List<User> list = adminService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/appointments")
    @Operation(summary = "List all appointments across the platform")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAllAppointments() {
        List<AppointmentDto> list = adminService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
