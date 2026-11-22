package com.mindbridge.modules.consultation;

import com.mindbridge.modules.appointment.Appointment;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.doctor.DoctorProfile;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "consultation_records")
public class ConsultationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorProfile doctor;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(name = "clinical_notes", nullable = false, columnDefinition = "TEXT")
    private String clinicalNotes;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "follow_up_recommended", nullable = false)
    private boolean followUpRecommended = false;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "doctor_acknowledged", nullable = false)
    private boolean doctorAcknowledged = true;

    @Column(name = "doctor_acknowledged_at", nullable = false)
    private Instant doctorAcknowledgedAt = Instant.now();

    @Column(name = "patient_acknowledged", nullable = false)
    private boolean patientAcknowledged = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public ConsultationRecord() {}

    public ConsultationRecord(Appointment appointment, DoctorProfile doctor, User patient,
                              String clinicalNotes, String recommendations, boolean followUpRecommended,
                              LocalDate followUpDate) {
        this.appointment = appointment;
        this.doctor = doctor;
        this.patient = patient;
        this.clinicalNotes = clinicalNotes;
        this.recommendations = recommendations;
        this.followUpRecommended = followUpRecommended;
        this.followUpDate = followUpDate;
        this.doctorAcknowledged = true;
        this.doctorAcknowledgedAt = Instant.now();
        this.patientAcknowledged = false;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAppointmentId() { return appointment != null ? appointment.getId() : null; }
    public UUID getDoctorId() { return doctor != null ? doctor.getId() : null; }
    public UUID getPatientId() { return patient != null ? patient.getId() : null; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public DoctorProfile getDoctor() { return doctor; }
    public void setDoctor(DoctorProfile doctor) { this.doctor = doctor; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public boolean isFollowUpRecommended() { return followUpRecommended; }
    public void setFollowUpRecommended(boolean followUpRecommended) { this.followUpRecommended = followUpRecommended; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }

    public boolean isDoctorAcknowledged() { return doctorAcknowledged; }
    public void setDoctorAcknowledged(boolean doctorAcknowledged) { this.doctorAcknowledged = doctorAcknowledged; }

    public Instant getDoctorAcknowledgedAt() { return doctorAcknowledgedAt; }
    public void setDoctorAcknowledgedAt(Instant doctorAcknowledgedAt) { this.doctorAcknowledgedAt = doctorAcknowledgedAt; }

    public boolean isPatientAcknowledged() { return patientAcknowledged; }
    public void setPatientAcknowledged(boolean patientAcknowledged) { this.patientAcknowledged = patientAcknowledged; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
