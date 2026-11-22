package com.mindbridge.modules.assessment;

import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.ai.AiAnalysisResult;
import com.mindbridge.modules.ai.AiAnalysisResultRepository;
import com.mindbridge.modules.ai.AiServiceClient;
import com.mindbridge.modules.assessment.dto.AssessmentResultDto;
import com.mindbridge.modules.assessment.dto.AssessmentSubmissionRequest;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentResponseRepository responseRepository;
    private final AiAnalysisResultRepository aiAnalysisResultRepository;
    private final AiServiceClient aiServiceClient;
    private final UserRepository userRepository;

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentQuestionRepository questionRepository,
                             AssessmentResponseRepository responseRepository,
                             AiAnalysisResultRepository aiAnalysisResultRepository,
                             AiServiceClient aiServiceClient,
                             UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
        this.aiAnalysisResultRepository = aiAnalysisResultRepository;
        this.aiServiceClient = aiServiceClient;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AssessmentQuestion> getActiveQuestions() {
        return questionRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Transactional
    public AssessmentResultDto submitAssessment(UUID patientId, AssessmentSubmissionRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        int totalScore = 0;
        if (request.getAnswers() != null) {
            for (AssessmentSubmissionRequest.QuestionAnswerDto ans : request.getAnswers()) {
                totalScore += ans.getScore();
            }
        }

        Assessment assessment = new Assessment(
                patient,
                totalScore,
                request.getSelfReportedMood() != null ? request.getSelfReportedMood() : 3,
                request.getAdditionalNotes()
        );
        Assessment savedAssessment = assessmentRepository.save(assessment);

        List<AssessmentResponse> savedResponses = new ArrayList<>();
        if (request.getAnswers() != null) {
            for (AssessmentSubmissionRequest.QuestionAnswerDto ans : request.getAnswers()) {
                AssessmentQuestion q = questionRepository.findById(ans.getQuestionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + ans.getQuestionId()));
                AssessmentResponse resp = new AssessmentResponse(
                        savedAssessment,
                        q,
                        ans.getScore(),
                        ans.getSelectedOption(),
                        ans.getResponseText()
                );
                savedResponses.add(responseRepository.save(resp));
            }
        }

        // Invoke AI Engine
        AiAnalysisResult aiResult = aiServiceClient.analyzeAssessment(savedAssessment, savedResponses);
        AiAnalysisResult savedAiResult = aiAnalysisResultRepository.save(aiResult);

        return mapToResultDto(savedAssessment, savedAiResult);
    }

    @Transactional(readOnly = true)
    public List<AssessmentResultDto> getPatientAssessments(UUID patientId) {
        List<Assessment> assessments = assessmentRepository.findByPatientIdOrderByCompletedAtDesc(patientId);
        return assessments.stream()
                .map(a -> {
                    AiAnalysisResult ai = aiAnalysisResultRepository.findByAssessmentId(a.getId()).orElse(null);
                    return mapToResultDto(a, ai);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentResultDto getAssessmentResult(UUID assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + assessmentId));
        AiAnalysisResult ai = aiAnalysisResultRepository.findByAssessmentId(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("AI analysis result not found for assessment: " + assessmentId));
        return mapToResultDto(assessment, ai);
    }

    private AssessmentResultDto mapToResultDto(Assessment assessment, AiAnalysisResult ai) {
        AssessmentResultDto dto = new AssessmentResultDto();
        dto.setAssessmentId(assessment.getId());
        dto.setCompletedAt(assessment.getCompletedAt());
        dto.setTotalScore(assessment.getTotalScore());
        dto.setSelfReportedMood(assessment.getSelfReportedMood());
        dto.setAdditionalNotes(assessment.getAdditionalNotes());

        if (ai != null) {
            dto.setAiInferredMood(ai.getAiInferredMood());
            dto.setSentimentLabel(ai.getSentimentLabel());
            dto.setSentimentConfidence(ai.getSentimentConfidence());
            dto.setDominantEmotion(ai.getDominantEmotion());
            dto.setEmotionScoresJson(ai.getEmotionScoresJson());
            dto.setRiskLevel(ai.getRiskLevel());
            dto.setRiskFactorsJson(ai.getRiskFactorsJson());
            dto.setProbableConditionsJson(ai.getProbableConditionsJson());
            dto.setRecommendedWorkflow(ai.getRecommendedWorkflow());
            dto.setClinicalDisclaimer(ai.getClinicalDisclaimer());
            dto.setRecommendationsJson(ai.getRecommendationsJson());
        }
        return dto;
    }
}
