package com.mindbridge.modules.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {
    List<Assessment> findByPatientIdOrderByCompletedAtDesc(UUID patientId);
    Optional<Assessment> findFirstByPatientIdOrderByCompletedAtDesc(UUID patientId);
    long count();
}
