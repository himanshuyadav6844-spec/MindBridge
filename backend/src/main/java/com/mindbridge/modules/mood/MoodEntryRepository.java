package com.mindbridge.modules.mood;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, UUID> {
    List<MoodEntry> findByPatientIdOrderByEntryDateDescEntryTimeDesc(UUID patientId);
    List<MoodEntry> findByPatientIdAndEntryDateBetweenOrderByEntryDateAsc(UUID patientId, LocalDate startDate, LocalDate endDate);
    Optional<MoodEntry> findFirstByPatientIdOrderByEntryDateDescEntryTimeDesc(UUID patientId);
}
