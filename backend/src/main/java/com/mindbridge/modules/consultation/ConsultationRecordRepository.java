package com.mindbridge.modules.consultation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface ConsultationRecordRepository extends JpaRepository<ConsultationRecord, UUID> {

    @Query("SELECT c FROM ConsultationRecord c WHERE c.appointment.id = :appointmentId")
    Optional<ConsultationRecord> findByAppointmentId(@Param("appointmentId") UUID appointmentId);

    @Query("SELECT c FROM ConsultationRecord c WHERE c.patient.id = :patientId ORDER BY c.createdAt DESC")
    List<ConsultationRecord> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") UUID patientId);

    @Query("SELECT c FROM ConsultationRecord c WHERE c.doctor.id = :doctorId ORDER BY c.createdAt DESC")
    List<ConsultationRecord> findByDoctorIdOrderByCreatedAtDesc(@Param("doctorId") UUID doctorId);
}
