package com.mindbridge.modules.appointment;

import com.mindbridge.common.BadRequestException;
import com.mindbridge.modules.appointment.dto.AppointmentDto;
import com.mindbridge.modules.appointment.dto.BookAppointmentRequest;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.auth.UserRole;
import com.mindbridge.modules.doctor.DoctorProfile;
import com.mindbridge.modules.doctor.DoctorProfileRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AppointmentBookingTest {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Test
    void testDoubleBookingPrevention() {
        // Create test patient
        User patient1 = userRepository.save(new User(
                "patient1." + UUID.randomUUID() + "@example.com",
                "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
                "Patient One",
                UserRole.ROLE_PATIENT,
                "+91-1111111111"
        ));

        User patient2 = userRepository.save(new User(
                "patient2." + UUID.randomUUID() + "@example.com",
                "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
                "Patient Two",
                UserRole.ROLE_PATIENT,
                "+91-2222222222"
        ));

        // Use first verified doctor from seed
        DoctorProfile doctor = doctorProfileRepository.findByIsVerifiedTrue().get(0);
        LocalDate bookingDate = LocalDate.now().plusDays(5);
        String bookingTime = "11:00";

        // Patient 1 books slot
        BookAppointmentRequest req1 = new BookAppointmentRequest();
        req1.setDoctorId(doctor.getId());
        req1.setAppointmentDate(bookingDate);
        req1.setAppointmentTime(bookingTime);
        req1.setConsultationMode("VIDEO");
        req1.setReason("General anxiety consultation");

        AppointmentDto booked = appointmentService.bookAppointment(patient1.getId(), req1);
        assertNotNull(booked);
        assertEquals("CONFIRMED", booked.getStatus());

        // Patient 2 attempts to book the EXACT same slot
        BookAppointmentRequest req2 = new BookAppointmentRequest();
        req2.setDoctorId(doctor.getId());
        req2.setAppointmentDate(bookingDate);
        req2.setAppointmentTime(bookingTime);
        req2.setConsultationMode("VIDEO");
        req2.setReason("Conflicting booking attempt");

        assertThrows(BadRequestException.class, () -> {
            appointmentService.bookAppointment(patient2.getId(), req2);
        });
    }
}
