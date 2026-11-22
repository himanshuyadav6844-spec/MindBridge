package com.mindbridge.modules.cbt;

import com.mindbridge.modules.auth.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "patient_cbt_progress")
public class PatientCbtProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private CbtExercise exercise;

    @Column(nullable = false)
    private String status = "COMPLETED"; // IN_PROGRESS, COMPLETED

    @Column(name = "user_response_data", nullable = false, columnDefinition = "TEXT")
    private String userResponseData;

    @Column(name = "reflection_notes", columnDefinition = "TEXT")
    private String reflectionNotes;

    @Column(name = "mood_before")
    private Integer moodBefore;

    @Column(name = "mood_after")
    private Integer moodAfter;

    @Column(name = "completed_at")
    private Instant completedAt = Instant.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public PatientCbtProgress() {}

    public PatientCbtProgress(User patient, CbtExercise exercise, String status, String userResponseData,
                              String reflectionNotes, Integer moodBefore, Integer moodAfter) {
        this.patient = patient;
        this.exercise = exercise;
        this.status = status;
        this.userResponseData = userResponseData;
        this.reflectionNotes = reflectionNotes;
        this.moodBefore = moodBefore;
        this.moodAfter = moodAfter;
        this.completedAt = "COMPLETED".equalsIgnoreCase(status) ? Instant.now() : null;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    public CbtExercise getExercise() { return exercise; }
    public void setExercise(CbtExercise exercise) { this.exercise = exercise; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUserResponseData() { return userResponseData; }
    public void setUserResponseData(String userResponseData) { this.userResponseData = userResponseData; }

    public String getReflectionNotes() { return reflectionNotes; }
    public void setReflectionNotes(String reflectionNotes) { this.reflectionNotes = reflectionNotes; }

    public Integer getMoodBefore() { return moodBefore; }
    public void setMoodBefore(Integer moodBefore) { this.moodBefore = moodBefore; }

    public Integer getMoodAfter() { return moodAfter; }
    public void setMoodAfter(Integer moodAfter) { this.moodAfter = moodAfter; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
