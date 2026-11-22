package com.mindbridge.modules.doctor;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.doctor.dto.DoctorDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctor Directory & Profiles", description = "Public and verified doctor directory, search and availability inspection")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    @Operation(summary = "Search verified doctors with optional specialization and consultation mode filters")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> searchDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String mode) {
        List<DoctorDto> doctors = doctorService.searchDoctors(specialization, mode);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve public profile details of a specific verified doctor")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable UUID id) {
        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Retrieve weekly availability schedule for a doctor")
    public ResponseEntity<ApiResponse<List<DoctorAvailability>>> getDoctorAvailability(@PathVariable UUID id) {
        List<DoctorAvailability> availability = doctorService.getDoctorAvailability(id);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }
}
