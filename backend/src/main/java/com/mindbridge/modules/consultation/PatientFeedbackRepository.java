package com.mindbridge.modules.consultation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PatientFeedbackRepository extends JpaRepository<PatientFeedback, UUID> {

    @Query("SELECT f FROM PatientFeedback f WHERE f.doctor.id = :doctorId")
    List<PatientFeedback> findByDoctorId(@Param("doctorId") UUID doctorId);
}
