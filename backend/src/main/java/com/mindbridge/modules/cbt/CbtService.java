package com.mindbridge.modules.cbt;

import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.cbt.dto.CbtProgressRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CbtService {

    private final CbtExerciseRepository exerciseRepository;
    private final PatientCbtProgressRepository progressRepository;
    private final UserRepository userRepository;

    public CbtService(CbtExerciseRepository exerciseRepository,
                      PatientCbtProgressRepository progressRepository,
                      UserRepository userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CbtExercise> getAllExercises() {
        return exerciseRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public CbtExercise getExerciseByIdOrSlug(String idOrSlug) {
        try {
            UUID id = UUID.fromString(idOrSlug);
            return exerciseRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("CBT Exercise not found with id: " + id));
        } catch (IllegalArgumentException e) {
            return exerciseRepository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new ResourceNotFoundException("CBT Exercise not found with slug: " + idOrSlug));
        }
    }

    @Transactional
    public PatientCbtProgress recordProgress(UUID patientId, CbtProgressRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
        CbtExercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found: " + request.getExerciseId()));

        PatientCbtProgress progress = new PatientCbtProgress(
                patient,
                exercise,
                request.getStatus() != null ? request.getStatus() : "COMPLETED",
                request.getUserResponseData(),
                request.getReflectionNotes(),
                request.getMoodBefore(),
                request.getMoodAfter()
        );
        return progressRepository.save(progress);
    }

    @Transactional(readOnly = true)
    public List<PatientCbtProgress> getPatientProgress(UUID patientId) {
        return progressRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }
}
