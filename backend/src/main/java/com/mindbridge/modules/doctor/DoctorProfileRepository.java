package com.mindbridge.modules.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, UUID> {
    Optional<DoctorProfile> findByUserId(UUID userId);
    Optional<DoctorProfile> findByLicenseNumber(String licenseNumber);
    List<DoctorProfile> findByIsVerifiedTrue();
    List<DoctorProfile> findByIsVerifiedFalse();

    @Query("SELECT d FROM DoctorProfile d WHERE d.isVerified = true AND " +
           "LOWER(d.primarySpecialization) LIKE LOWER(CONCAT('%', :specialization, '%'))")
    List<DoctorProfile> findVerifiedBySpecialization(@Param("specialization") String specialization);

    long countByIsVerified(boolean isVerified);
}
