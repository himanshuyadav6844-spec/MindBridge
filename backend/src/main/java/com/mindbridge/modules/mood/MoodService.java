package com.mindbridge.modules.mood;

import com.mindbridge.common.AccessDeniedException;
import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.mood.dto.MoodEntryRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class MoodService {

    private final MoodEntryRepository moodEntryRepository;
    private final UserRepository userRepository;

    public MoodService(MoodEntryRepository moodEntryRepository, UserRepository userRepository) {
        this.moodEntryRepository = moodEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MoodEntry createMoodEntry(UUID patientId, MoodEntryRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        MoodEntry entry = new MoodEntry(
                patient,
                request.getMoodScore(),
                request.getEmotionLabel(),
                request.getStressLevel(),
                request.getSleepQuality(),
                request.getJournalEntry(),
                request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now(),
                request.getEntryTime() != null ? request.getEntryTime() : LocalTime.now()
        );
        return moodEntryRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public List<MoodEntry> getPatientMoodHistory(UUID patientId) {
        return moodEntryRepository.findByPatientIdOrderByEntryDateDescEntryTimeDesc(patientId);
    }

    @Transactional(readOnly = true)
    public List<MoodEntry> getRecentMoodTrend(UUID patientId, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        LocalDate endDate = LocalDate.now();
        return moodEntryRepository.findByPatientIdAndEntryDateBetweenOrderByEntryDateAsc(patientId, startDate, endDate);
    }

    @Transactional
    public MoodEntry updateMoodEntry(UUID entryId, UUID patientId, MoodEntryRequest request) {
        MoodEntry entry = moodEntryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Mood entry not found: " + entryId));

        if (!entry.getPatient().getId().equals(patientId)) {
            throw new AccessDeniedException("You can only modify your own mood records.");
        }

        entry.setMoodScore(request.getMoodScore());
        entry.setEmotionLabel(request.getEmotionLabel());
        entry.setStressLevel(request.getStressLevel());
        entry.setSleepQuality(request.getSleepQuality());
        entry.setJournalEntry(request.getJournalEntry());
        if (request.getEntryDate() != null) entry.setEntryDate(request.getEntryDate());
        if (request.getEntryTime() != null) entry.setEntryTime(request.getEntryTime());

        return moodEntryRepository.save(entry);
    }

    @Transactional
    public void deleteMoodEntry(UUID entryId, UUID patientId) {
        MoodEntry entry = moodEntryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Mood entry not found: " + entryId));

        if (!entry.getPatient().getId().equals(patientId)) {
            throw new AccessDeniedException("You can only delete your own mood records.");
        }

        moodEntryRepository.delete(entry);
    }
}
