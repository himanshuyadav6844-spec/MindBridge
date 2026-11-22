package com.mindbridge.modules.appointment;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.appointment.dto.BookAppointmentRequest;
import com.mindbridge.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointments", description = "Appointment booking, slot verification, status tracking, and cancellation")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping({"", "/book"})
    @Operation(summary = "Book a new consultation appointment with transactional double-booking prevention")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody BookAppointmentRequest request) {
        AppointmentDto appointment = appointmentService.bookAppointment(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Appointment booked and confirmed successfully", appointment));
    }

    @GetMapping({"", "/my-appointments"})
    @Operation(summary = "Retrieve all appointments for current authenticated patient")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyAppointments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<AppointmentDto> list = appointmentService.getPatientAppointments(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/doctor/my-appointments")
    @Operation(summary = "Retrieve all appointments for current authenticated doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyDoctorAppointments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<AppointmentDto> list = appointmentService.getDoctorAppointmentsByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment details by ID")
    public ResponseEntity<ApiResponse<AppointmentDto>> getAppointment(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AppointmentDto dto = appointmentService.getAppointmentById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/doctor/{doctorId}/booked-slots")
    @Operation(summary = "Get already booked time slots for a doctor on a specific date")
    public ResponseEntity<ApiResponse<List<String>>> getBookedSlots(
            @PathVariable UUID doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<String> bookedSlots = appointmentService.getBookedTimes(doctorId, date);
        return ResponseEntity.ok(ApiResponse.success(bookedSlots));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an existing appointment")
    public ResponseEntity<ApiResponse<AppointmentDto>> cancelAppointment(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Requested by patient";
        AppointmentDto cancelled = appointmentService.cancelAppointment(id, currentUser.getId(), reason);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", cancelled));
    }
}
