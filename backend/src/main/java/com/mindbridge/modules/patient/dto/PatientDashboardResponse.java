package com.mindbridge.modules.patient.dto;

import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.assessment.dto.AssessmentResultDto;
import com.mindbridge.modules.mood.MoodEntry;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PatientDashboardResponse {
    private UUID patientId;
    private String fullName;
    private String email;
    private LocalDate currentDate;
    private AssessmentResultDto latestAssessment;
    private MoodEntry latestMood;
    private List<MoodEntry> recentMoodTrends;
    private long completedCbtExercisesCount;
    private AppointmentDto upcomingAppointment;
    private long totalAssessmentsCount;

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getCurrentDate() { return currentDate; }
    public void setCurrentDate(LocalDate currentDate) { this.currentDate = currentDate; }

    public AssessmentResultDto getLatestAssessment() { return latestAssessment; }
    public void setLatestAssessment(AssessmentResultDto latestAssessment) { this.latestAssessment = latestAssessment; }

    public MoodEntry getLatestMood() { return latestMood; }
    public void setLatestMood(MoodEntry latestMood) { this.latestMood = latestMood; }

    public List<MoodEntry> getRecentMoodTrends() { return recentMoodTrends; }
    public void setRecentMoodTrends(List<MoodEntry> recentMoodTrends) { this.recentMoodTrends = recentMoodTrends; }

    public long getCompletedCbtExercisesCount() { return completedCbtExercisesCount; }
    public void setCompletedCbtExercisesCount(long completedCbtExercisesCount) { this.completedCbtExercisesCount = completedCbtExercisesCount; }

    public AppointmentDto getUpcomingAppointment() { return upcomingAppointment; }
    public void setUpcomingAppointment(AppointmentDto upcomingAppointment) { this.upcomingAppointment = upcomingAppointment; }

    public long getTotalAssessmentsCount() { return totalAssessmentsCount; }
    public void setTotalAssessmentsCount(long totalAssessmentsCount) { this.totalAssessmentsCount = totalAssessmentsCount; }
}
