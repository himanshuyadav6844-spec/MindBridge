package com.mindbridge.modules.doctor;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.appointment.Appointment;
import com.mindbridge.modules.appointment.AppointmentRepository;
import com.mindbridge.modules.appointment.AppointmentService;
import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.assessment.AssessmentService;
import com.mindbridge.modules.assessment.dto.AssessmentResultDto;
import com.mindbridge.modules.doctor.dto.DoctorDashboardResponse;
import com.mindbridge.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
@Tag(name = "Doctor Portal & Clinical Management", description = "Endpoints for practitioners to manage appointments, review authorized patient summaries, and view schedule")
public class DoctorDashboardController {

    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentService appointmentService;
    private final AssessmentService assessmentService;

    public DoctorDashboardController(DoctorProfileRepository doctorProfileRepository,
                                     AppointmentRepository appointmentRepository,
                                     AppointmentService appointmentService,
                                     AssessmentService assessmentService) {
        this.doctorProfileRepository = doctorProfileRepository;
        this.appointmentRepository = appointmentRepository;
        this.appointmentService = appointmentService;
        this.assessmentService = assessmentService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dynamic clinical practice dashboard for authenticated doctor")
    public ResponseEntity<ApiResponse<DoctorDashboardResponse>> getDoctorDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DoctorProfile doctor = doctorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + currentUser.getId()));

        List<Appointment> upcoming = appointmentRepository.findUpcomingByDoctorId(doctor.getId());
        List<Appointment> all = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctor.getId());

        DoctorDashboardResponse resp = new DoctorDashboardResponse();
        resp.setDoctorId(doctor.getId());
        resp.setDoctorName(doctor.getUser().getFullName());
        resp.setSpecialization(doctor.getPrimarySpecialization());
        resp.setVerified(doctor.isVerified());
        resp.setRating(doctor.getRating());
        resp.setTotalReviews(doctor.getTotalReviews());
        resp.setTotalAppointments(all.size());
        resp.setUpcomingAppointmentsCount(upcoming.size());
        resp.setUpcomingAppointments(upcoming.stream().map(appointmentService::mapToDto).collect(Collectors.toList()));

        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    @GetMapping("/appointments")
    @Operation(summary = "Get list of all appointments scheduled with this doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getDoctorAppointments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DoctorProfile doctor = doctorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        List<AppointmentDto> appointments = appointmentService.getDoctorAppointments(doctor.getId());
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @PutMapping("/appointments/{id}/status")
    @Operation(summary = "Update appointment status (CONFIRMED, COMPLETED, CANCELLED)")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointmentStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        AppointmentDto updated = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated", updated));
    }

    @GetMapping("/patient/{patientId}/summary")
    @Operation(summary = "Retrieve authorized patient assessment summary for clinical consultation preparation")
    public ResponseEntity<ApiResponse<List<AssessmentResultDto>>> getPatientAssessmentSummary(
            @PathVariable UUID patientId) {
        List<AssessmentResultDto> summary = assessmentService.getPatientAssessments(patientId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
