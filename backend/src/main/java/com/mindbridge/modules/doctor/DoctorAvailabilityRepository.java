package com.mindbridge.modules.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, UUID> {
    List<DoctorAvailability> findByDoctorIdAndIsActiveTrue(UUID doctorId);
    List<DoctorAvailability> findByDoctorIdAndDayOfWeekAndIsActiveTrue(UUID doctorId, String dayOfWeek);
}
