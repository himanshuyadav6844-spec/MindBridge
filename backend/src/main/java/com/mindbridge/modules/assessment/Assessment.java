package com.mindbridge.modules.assessment;

import com.mindbridge.modules.auth.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(name = "assessment_type", nullable = false)
    private String assessmentType = "GENERAL_WELLNESS";

    @Column(nullable = false)
    private String status = "COMPLETED";

    @Column(name = "total_score", nullable = false)
    private int totalScore = 0;

    @Column(name = "self_reported_mood", nullable = false)
    private int selfReportedMood = 3;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(name = "completed_at", nullable = false)
    private Instant completedAt = Instant.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Assessment() {}

    public Assessment(User patient, int totalScore, int selfReportedMood, String additionalNotes) {
        this.patient = patient;
        this.totalScore = totalScore;
        this.selfReportedMood = selfReportedMood;
        this.additionalNotes = additionalNotes;
        this.status = "COMPLETED";
        this.completedAt = Instant.now();
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }

    public int getSelfReportedMood() { return selfReportedMood; }
    public void setSelfReportedMood(int selfReportedMood) { this.selfReportedMood = selfReportedMood; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
