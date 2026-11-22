package com.mindbridge.modules.admin;

import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.admin.dto.AdminDashboardStatsDto;
import com.mindbridge.modules.appointment.Appointment;
import com.mindbridge.modules.appointment.AppointmentRepository;
import com.mindbridge.modules.appointment.AppointmentService;
import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.assessment.AssessmentRepository;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.auth.UserRole;
import com.mindbridge.modules.doctor.DoctorProfile;
import com.mindbridge.modules.doctor.DoctorProfileRepository;
import com.mindbridge.modules.doctor.DoctorService;
import com.mindbridge.modules.doctor.dto.DoctorDto;
import com.mindbridge.modules.notification.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AssessmentRepository assessmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final NotificationService notificationService;

    public AdminService(UserRepository userRepository,
                        DoctorProfileRepository doctorProfileRepository,
                        AssessmentRepository assessmentRepository,
                        AppointmentRepository appointmentRepository,
                        DoctorService doctorService,
                        AppointmentService appointmentService,
                        NotificationService notificationService) {
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.assessmentRepository = assessmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();
        stats.setTotalPatients(userRepository.countByRole(UserRole.ROLE_PATIENT));
        stats.setTotalDoctors(doctorProfileRepository.count());
        stats.setVerifiedDoctors(doctorProfileRepository.countByIsVerified(true));
        stats.setPendingDoctors(doctorProfileRepository.countByIsVerified(false));
        stats.setTotalAssessments(assessmentRepository.count());
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setCompletedAppointments(appointmentRepository.countByStatus("COMPLETED"));
        stats.setCancelledAppointments(appointmentRepository.countByStatus("CANCELLED"));
        return stats;
    }

    @Transactional(readOnly = true)
    public List<DoctorDto> getPendingDoctors() {
        List<DoctorProfile> pending = doctorProfileRepository.findByIsVerifiedFalse();
        return pending.stream().map(doctorService::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public DoctorDto verifyDoctor(UUID doctorProfileId, UUID adminUserId) {
        DoctorProfile doctor = doctorProfileRepository.findById(doctorProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found: " + doctorProfileId));

        doctor.setVerified(true);
        doctor.setVerifiedAt(Instant.now());
        doctor.setVerifiedBy(adminUserId);
        DoctorProfile saved = doctorProfileRepository.save(doctor);

        notificationService.createNotification(
                doctor.getUser().getId(),
                "Doctor Account Verified",
                "Congratulations! Your medical registration credentials have been approved by the administration. Your profile is now visible in the verified doctor directory.",
                "ACCOUNT_VERIFIED",
                "/doctor/dashboard"
        );

        return doctorService.mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<User> getAllPatients() {
        return userRepository.findByRole(UserRole.ROLE_PATIENT);
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(appointmentService::mapToDto).collect(Collectors.toList());
    }
}
