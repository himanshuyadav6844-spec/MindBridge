package com.mindbridge.modules.cbt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CbtProgressRequest {

    @NotNull(message = "Exercise ID is required")
    private UUID exerciseId;

    private String status = "COMPLETED";

    @NotBlank(message = "User response data is required")
    private String userResponseData;

    private String reflectionNotes;
    private Integer moodBefore;
    private Integer moodAfter;

    public UUID getExerciseId() { return exerciseId; }
    public void setExerciseId(UUID exerciseId) { this.exerciseId = exerciseId; }

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
}
