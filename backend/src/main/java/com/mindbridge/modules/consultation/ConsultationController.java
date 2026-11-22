package com.mindbridge.modules.consultation;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.consultation.dto.PatientFeedbackRequest;
import com.mindbridge.modules.consultation.dto.RecordConsultationRequest;
import com.mindbridge.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@Tag(name = "Consultation & Clinical Records", description = "Endpoints for clinical notes, doctor acknowledgement, and patient feedback")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping({"/doctor/consultations", "/consultations"})
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Operation(summary = "Doctor records clinical notes, sets follow-up, and acknowledges consultation completion")
    public ResponseEntity<ApiResponse<ConsultationRecord>> recordConsultation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody RecordConsultationRequest request) {
        ConsultationRecord record = consultationService.recordConsultation(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Consultation notes recorded and patient acknowledged.", record));
    }

    @PostMapping({"/consultations/{appointmentId}/acknowledge", "/doctor/consultations/{appointmentId}/acknowledge"})
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Operation(summary = "Doctor acknowledges consultation completion")
    public ResponseEntity<ApiResponse<String>> acknowledgeConsultation(
            @PathVariable UUID appointmentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Consultation acknowledged", "ACKNOWLEDGED"));
    }

    @GetMapping("/consultations/appointment/{appointmentId}")
    @Operation(summary = "Retrieve clinical consultation notes and doctor recommendations for an appointment")
    public ResponseEntity<ApiResponse<ConsultationRecord>> getConsultationRecord(
            @PathVariable UUID appointmentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ConsultationRecord record = consultationService.getConsultationByAppointment(appointmentId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping("/consultations/feedback")
    @Operation(summary = "Patient submits review and rating for doctor consultation")
    public ResponseEntity<ApiResponse<PatientFeedback>> submitFeedback(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PatientFeedbackRequest request) {
        PatientFeedback feedback = consultationService.submitFeedback(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully. Thank you!", feedback));
    }
}
