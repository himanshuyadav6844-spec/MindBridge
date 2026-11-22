package com.mindbridge.modules.consultation;

import com.mindbridge.common.AccessDeniedException;
import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.appointment.Appointment;
import com.mindbridge.modules.appointment.AppointmentRepository;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.consultation.dto.PatientFeedbackRequest;
import com.mindbridge.modules.consultation.dto.RecordConsultationRequest;
import com.mindbridge.modules.doctor.DoctorProfile;
import com.mindbridge.modules.doctor.DoctorProfileRepository;
import com.mindbridge.modules.notification.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class ConsultationService {

    private final ConsultationRecordRepository consultationRecordRepository;
    private final PatientFeedbackRepository feedbackRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ConsultationService(ConsultationRecordRepository consultationRecordRepository,
                               PatientFeedbackRepository feedbackRepository,
                               AppointmentRepository appointmentRepository,
                               DoctorProfileRepository doctorProfileRepository,
                               UserRepository userRepository,
                               NotificationService notificationService) {
        this.consultationRecordRepository = consultationRecordRepository;
        this.feedbackRepository = feedbackRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ConsultationRecord recordConsultation(UUID doctorUserId, RecordConsultationRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + request.getAppointmentId()));

        DoctorProfile doctor = doctorProfileRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You are not the designated doctor for this appointment.");
        }

        // Mark appointment as COMPLETED
        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);

        ConsultationRecord record = new ConsultationRecord(
                appointment,
                doctor,
                appointment.getPatient(),
                request.getClinicalNotes(),
                request.getRecommendations(),
                request.isFollowUpRecommended(),
                request.getFollowUpDate()
        );
        ConsultationRecord savedRecord = consultationRecordRepository.save(record);

        // Notify patient with thank-you message and follow-up guidance
        String doctorName = doctor.getUser().getFullName();
        notificationService.createNotification(
                appointment.getPatient().getId(),
                "Consultation Completed & Summary Available",
                "Thank you for attending your consultation with " + doctorName + ". Your clinical notes and personalized recommendations are now ready to view. You can also leave a review to help other patients.",
                "CONSULTATION_COMPLETED",
                "/appointments"
        );

        return savedRecord;
    }

    @Transactional(readOnly = true)
    public ConsultationRecord getConsultationByAppointment(UUID appointmentId, UUID userId) {
        ConsultationRecord record = consultationRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation record not found for appointment: " + appointmentId));

        boolean isPatient = record.getPatient().getId().equals(userId);
        boolean isDoctor = record.getDoctor().getUser().getId().equals(userId);

        if (!isPatient && !isDoctor) {
            throw new AccessDeniedException("Unauthorized to access this consultation record.");
        }

        return record;
    }

    @Transactional
    public PatientFeedback submitFeedback(UUID patientId, PatientFeedbackRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId()).orElse(null);
        }

        DoctorProfile doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorProfileRepository.findById(request.getDoctorId()).orElse(null);
        } else if (appointment != null) {
            doctor = appointment.getDoctor();
        }

        PatientFeedback feedback = new PatientFeedback(
                patient,
                appointment,
                doctor,
                request.getRating(),
                request.getFeedbackText(),
                request.isWouldRecommend()
        );
        PatientFeedback saved = feedbackRepository.save(feedback);

        // Update doctor rating aggregate
        if (doctor != null) {
            List<PatientFeedback> allReviews = feedbackRepository.findByDoctorId(doctor.getId());
            double avg = allReviews.stream().mapToInt(PatientFeedback::getRating).average().orElse(5.0);
            doctor.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            doctor.setTotalReviews(allReviews.size());
            doctorProfileRepository.save(doctor);
        }

        return saved;
    }
}
