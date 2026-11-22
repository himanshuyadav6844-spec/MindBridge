package com.mindbridge.modules.mood.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class MoodEntryRequest {

    @NotNull(message = "Mood score is required")
    @Min(value = 1, message = "Mood score must be between 1 and 5")
    @Max(value = 5, message = "Mood score must be between 1 and 5")
    private Integer moodScore;

    @NotBlank(message = "Emotion label is required")
    private String emotionLabel;

    @NotNull(message = "Stress level is required")
    @Min(1) @Max(5)
    private Integer stressLevel;

    @NotNull(message = "Sleep quality is required")
    @Min(1) @Max(5)
    private Integer sleepQuality;

    private String journalEntry;
    private LocalDate entryDate;
    private LocalTime entryTime;

    public Integer getMoodScore() { return moodScore; }
    public void setMoodScore(Integer moodScore) { this.moodScore = moodScore; }

    public String getEmotionLabel() { return emotionLabel; }
    public void setEmotionLabel(String emotionLabel) { this.emotionLabel = emotionLabel; }

    public Integer getStressLevel() { return stressLevel; }
    public void setStressLevel(Integer stressLevel) { this.stressLevel = stressLevel; }

    public Integer getSleepQuality() { return sleepQuality; }
    public void setSleepQuality(Integer sleepQuality) { this.sleepQuality = sleepQuality; }

    public String getJournalEntry() { return journalEntry; }
    public void setJournalEntry(String journalEntry) { this.journalEntry = journalEntry; }

    public LocalDate getEntryDate() { return entryDate; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }

    public LocalTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalTime entryTime) { this.entryTime = entryTime; }
}
