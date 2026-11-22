package com.mindbridge.modules.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(UUID patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(UUID doctorId);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status IN ('CONFIRMED', 'PENDING') AND a.appointmentDate >= CURRENT_DATE ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findUpcomingByPatientId(@Param("patientId") UUID patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status IN ('CONFIRMED', 'PENDING') AND a.appointmentDate >= CURRENT_DATE ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findUpcomingByDoctorId(@Param("doctorId") UUID doctorId);

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
            UUID doctorId, LocalDate appointmentDate, String appointmentTime, List<String> statuses
    );

    @Query("SELECT a.appointmentTime FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.status IN ('CONFIRMED', 'PENDING')")
    List<String> findBookedTimesForDoctorAndDate(@Param("doctorId") UUID doctorId, @Param("date") LocalDate date);

    long countByStatus(String status);
}
