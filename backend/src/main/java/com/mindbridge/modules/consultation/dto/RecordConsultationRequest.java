package com.mindbridge.modules.consultation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public class RecordConsultationRequest {

    @NotNull(message = "Appointment ID is required")
    private UUID appointmentId;

    @NotBlank(message = "Clinical notes are required")
    private String clinicalNotes;

    private String recommendations;
    private boolean followUpRecommended;
    private LocalDate followUpDate;

    public UUID getAppointmentId() { return appointmentId; }
    public void setAppointmentId(UUID appointmentId) { this.appointmentId = appointmentId; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public boolean isFollowUpRecommended() { return followUpRecommended; }
    public void setFollowUpRecommended(boolean followUpRecommended) { this.followUpRecommended = followUpRecommended; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
}
