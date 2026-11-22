package com.mindbridge.modules.appointment;

import com.mindbridge.common.AccessDeniedException;
import com.mindbridge.common.BadRequestException;
import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.appointment.dto.BookAppointmentRequest;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.doctor.DoctorProfile;
import com.mindbridge.modules.doctor.DoctorProfileRepository;
import com.mindbridge.modules.notification.NotificationService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorProfileRepository doctorProfileRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public AppointmentDto bookAppointment(UUID patientId, BookAppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        DoctorProfile doctor = doctorProfileRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));

        if (!doctor.isVerified()) {
            throw new BadRequestException("Appointments can only be booked with verified practitioners.");
        }

        // Strict transactional check against double-booking
        boolean alreadyBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
                doctor.getId(),
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                Arrays.asList("CONFIRMED", "PENDING")
        );

        if (alreadyBooked) {
            throw new BadRequestException("The selected time slot (" + request.getAppointmentTime() + ") on " + request.getAppointmentDate() + " is already booked. Please choose another slot.");
        }

        Appointment appointment = new Appointment(
                patient,
                doctor,
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                request.getConsultationMode(),
                request.getReason()
        );

        try {
            Appointment saved = appointmentRepository.save(appointment);

            // In-app notifications
            notificationService.createNotification(
                    patient.getId(),
                    "Appointment Confirmed",
                    "Your consultation with " + doctor.getUser().getFullName() + " is booked for " + saved.getAppointmentDate() + " at " + saved.getAppointmentTime() + ".",
                    "APPOINTMENT_CONFIRMED",
                    "/appointments"
            );

            notificationService.createNotification(
                    doctor.getUser().getId(),
                    "New Patient Appointment",
                    "New appointment scheduled with " + patient.getFullName() + " for " + saved.getAppointmentDate() + " at " + saved.getAppointmentTime() + ".",
                    "NEW_APPOINTMENT",
                    "/doctor/appointments"
            );

            return mapToDto(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Concurrently booked: The selected slot was just reserved by another patient. Please pick an alternative time.");
        }
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getPatientAppointments(UUID patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patientId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getDoctorAppointments(UUID doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getDoctorAppointmentsByUserId(UUID doctorUserId) {
        DoctorProfile doc = doctorProfileRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));
        return getDoctorAppointments(doc.getId());
    }

    @Transactional(readOnly = true)
    public AppointmentDto getAppointmentById(UUID appointmentId, UUID currentUserId) {
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));
        return mapToDto(a);
    }

    @Transactional(readOnly = true)
    public List<String> getBookedTimes(UUID doctorId, LocalDate date) {
        return appointmentRepository.findBookedTimesForDoctorAndDate(doctorId, date);
    }

    @Transactional
    public AppointmentDto cancelAppointment(UUID appointmentId, UUID userId, String reason) {
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        boolean isPatient = a.getPatient().getId().equals(userId);
        boolean isDoctor = a.getDoctor().getUser().getId().equals(userId);

        if (!isPatient && !isDoctor) {
            throw new AccessDeniedException("You are not authorized to cancel this appointment.");
        }

        a.setStatus("CANCELLED");
        a.setCancellationReason(reason);
        Appointment updated = appointmentRepository.save(a);

        UUID notifyRecipient = isPatient ? a.getDoctor().getUser().getId() : a.getPatient().getId();
        notificationService.createNotification(
                notifyRecipient,
                "Appointment Cancelled",
                "The appointment on " + a.getAppointmentDate() + " at " + a.getAppointmentTime() + " has been cancelled. Reason: " + (reason != null ? reason : "Not specified"),
                "APPOINTMENT_CANCELLED",
                "/appointments"
        );

        return mapToDto(updated);
    }

    @Transactional
    public AppointmentDto updateStatus(UUID appointmentId, String newStatus) {
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));
        a.setStatus(newStatus);
        return mapToDto(appointmentRepository.save(a));
    }

    public AppointmentDto mapToDto(Appointment a) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(a.getId());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientName(a.getPatient().getFullName());
        dto.setPatientEmail(a.getPatient().getEmail());
        dto.setDoctorId(a.getDoctor().getId());
        dto.setDoctorName(a.getDoctor().getUser().getFullName());
        dto.setDoctorSpecialization(a.getDoctor().getPrimarySpecialization());
        dto.setDoctorQualification(a.getDoctor().getQualification());
        dto.setConsultationFee(a.getDoctor().getConsultationFee());
        dto.setAppointmentDate(a.getAppointmentDate());
        dto.setAppointmentTime(a.getAppointmentTime());
        dto.setConsultationMode(a.getConsultationMode());
        dto.setStatus(a.getStatus());
        dto.setReason(a.getReason());
        dto.setCancellationReason(a.getCancellationReason());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}
