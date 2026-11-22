package com.mindbridge.modules.patient;

import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.appointment.Appointment;
import com.mindbridge.modules.appointment.AppointmentRepository;
import com.mindbridge.modules.appointment.AppointmentService;
import com.mindbridge.modules.assessment.Assessment;
import com.mindbridge.modules.assessment.AssessmentRepository;
import com.mindbridge.modules.assessment.AssessmentService;
import com.mindbridge.modules.assessment.dto.AssessmentResultDto;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.cbt.PatientCbtProgressRepository;
import com.mindbridge.modules.mood.MoodEntry;
import com.mindbridge.modules.mood.MoodEntryRepository;
import com.mindbridge.modules.patient.dto.PatientDashboardResponse;
import com.mindbridge.modules.patient.dto.UpdatePatientProfileRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentService assessmentService;
    private final MoodEntryRepository moodEntryRepository;
    private final PatientCbtProgressRepository cbtProgressRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentService appointmentService;

    public PatientService(UserRepository userRepository,
                          PatientProfileRepository patientProfileRepository,
                          AssessmentRepository assessmentRepository,
                          AssessmentService assessmentService,
                          MoodEntryRepository moodEntryRepository,
                          PatientCbtProgressRepository cbtProgressRepository,
                          AppointmentRepository appointmentRepository,
                          AppointmentService appointmentService) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentService = assessmentService;
        this.moodEntryRepository = moodEntryRepository;
        this.cbtProgressRepository = cbtProgressRepository;
        this.appointmentRepository = appointmentRepository;
        this.appointmentService = appointmentService;
    }

    @Transactional(readOnly = true)
    public PatientProfile getPatientProfile(UUID userId) {
        return patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + userId));
    }

    @Transactional
    public PatientProfile updateProfile(UUID userId, UpdatePatientProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        PatientProfile profile = patientProfileRepository.findByUserId(userId)
                .orElseGet(() -> new PatientProfile(user, request.getDateOfBirth(), request.getGender(), true));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
            userRepository.save(user);
        }

        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getEmergencyContactName() != null) profile.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) profile.setEmergencyContactPhone(request.getEmergencyContactPhone());

        return patientProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public PatientDashboardResponse getDashboard(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        PatientDashboardResponse resp = new PatientDashboardResponse();
        resp.setPatientId(userId);
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setCurrentDate(LocalDate.now());

        // Latest assessment
        List<AssessmentResultDto> assessmentHistory = assessmentService.getPatientAssessments(userId);
        resp.setTotalAssessmentsCount(assessmentHistory.size());
        if (!assessmentHistory.isEmpty()) {
            resp.setLatestAssessment(assessmentHistory.get(0));
        }

        // Latest mood & trends
        resp.setLatestMood(moodEntryRepository.findFirstByPatientIdOrderByEntryDateDescEntryTimeDesc(userId).orElse(null));
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        resp.setRecentMoodTrends(moodEntryRepository.findByPatientIdAndEntryDateBetweenOrderByEntryDateAsc(userId, sevenDaysAgo, LocalDate.now()));

        // CBT count
        resp.setCompletedCbtExercisesCount(cbtProgressRepository.countByPatientIdAndStatus(userId, "COMPLETED"));

        // Upcoming appointment
        List<Appointment> upcoming = appointmentRepository.findUpcomingByPatientId(userId);
        if (!upcoming.isEmpty()) {
            resp.setUpcomingAppointment(appointmentService.mapToDto(upcoming.get(0)));
        }

        return resp;
    }
}
