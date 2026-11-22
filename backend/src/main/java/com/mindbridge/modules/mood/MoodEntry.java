package com.mindbridge.modules.mood;

import com.mindbridge.modules.auth.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "mood_entries")
public class MoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(name = "mood_score", nullable = false)
    private int moodScore; // 1 to 5

    @Column(name = "emotion_label", nullable = false)
    private String emotionLabel;

    @Column(name = "stress_level", nullable = false)
    private int stressLevel; // 1 to 5

    @Column(name = "sleep_quality", nullable = false)
    private int sleepQuality; // 1 to 5

    @Column(name = "journal_entry", columnDefinition = "TEXT")
    private String journalEntry;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "entry_time", nullable = false)
    private LocalTime entryTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public MoodEntry() {}

    public MoodEntry(User patient, int moodScore, String emotionLabel, int stressLevel,
                     int sleepQuality, String journalEntry, LocalDate entryDate, LocalTime entryTime) {
        this.patient = patient;
        this.moodScore = moodScore;
        this.emotionLabel = emotionLabel;
        this.stressLevel = stressLevel;
        this.sleepQuality = sleepQuality;
        this.journalEntry = journalEntry;
        this.entryDate = entryDate != null ? entryDate : LocalDate.now();
        this.entryTime = entryTime != null ? entryTime : LocalTime.now();
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

    public int getMoodScore() { return moodScore; }
    public void setMoodScore(int moodScore) { this.moodScore = moodScore; }

    public String getEmotionLabel() { return emotionLabel; }
    public void setEmotionLabel(String emotionLabel) { this.emotionLabel = emotionLabel; }

    public int getStressLevel() { return stressLevel; }
    public void setStressLevel(int stressLevel) { this.stressLevel = stressLevel; }

    public int getSleepQuality() { return sleepQuality; }
    public void setSleepQuality(int sleepQuality) { this.sleepQuality = sleepQuality; }

    public String getJournalEntry() { return journalEntry; }
    public void setJournalEntry(String journalEntry) { this.journalEntry = journalEntry; }

    public LocalDate getEntryDate() { return entryDate; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }

    public LocalTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalTime entryTime) { this.entryTime = entryTime; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
