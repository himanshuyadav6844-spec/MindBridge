package com.mindbridge.modules.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AiAnalysisResultRepository extends JpaRepository<AiAnalysisResult, UUID> {
    Optional<AiAnalysisResult> findByAssessmentId(UUID assessmentId);
}
