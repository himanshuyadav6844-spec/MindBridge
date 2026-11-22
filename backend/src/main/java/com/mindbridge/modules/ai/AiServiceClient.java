package com.mindbridge.modules.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindbridge.modules.assessment.Assessment;
import com.mindbridge.modules.assessment.AssessmentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class AiServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceClient.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String aiServiceUrl;

    public AiServiceClient(RestTemplateBuilder builder,
                           ObjectMapper objectMapper,
                           @Value("${app.ai-service.url:http://127.0.0.1:8000}") String aiServiceUrl) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofMillis(5000))
                .setReadTimeout(Duration.ofMillis(10000))
                .build();
        this.objectMapper = objectMapper;
        this.aiServiceUrl = aiServiceUrl;
    }

    public AiAnalysisResult analyzeAssessment(Assessment assessment, List<AssessmentResponse> responses) {
        String endpoint = aiServiceUrl + "/api/v1/analyze";
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("assessment_id", assessment.getId().toString());
            requestBody.put("patient_id", assessment.getPatient().getId().toString());
            requestBody.put("self_reported_mood", assessment.getSelfReportedMood());
            requestBody.put("qualitative_text", assessment.getAdditionalNotes());

            List<Map<String, Object>> responseItems = new ArrayList<>();
            for (AssessmentResponse r : responses) {
                Map<String, Object> item = new HashMap<>();
                item.put("question_id", r.getQuestion().getId().toString());
                item.put("category", r.getQuestion().getCategory());
                item.put("question_text", r.getQuestion().getQuestionText());
                item.put("score", r.getScore());
                item.put("selected_option", r.getSelectedOption());
                item.put("response_text", r.getResponseText());
                responseItems.add(item);
            }
            requestBody.put("responses", responseItems);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            logger.info("Calling AI Microservice at: {}", endpoint);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());

                AiAnalysisResult result = new AiAnalysisResult();
                result.setAssessment(assessment);
                result.setSentimentLabel(root.path("sentiment").path("label").asText("NEUTRAL"));
                result.setSentimentConfidence(BigDecimal.valueOf(root.path("sentiment").path("confidence").asDouble(0.75)));
                result.setDominantEmotion(root.path("emotion").path("dominant_emotion").asText("Neutral"));
                result.setEmotionScoresJson(root.path("emotion").path("scores").toString());
                result.setAiInferredMood(root.path("mood").path("ai_inferred_mood").asInt(assessment.getSelfReportedMood()));
                result.setRiskLevel(root.path("distress_risk").path("risk_level").asText("LOW_CONCERN"));
                result.setRiskFactorsJson(root.path("distress_risk").path("contributing_factors").toString());
                result.setProbableConditionsJson(root.path("screenings").toString());
                result.setRecommendedWorkflow(root.path("recommended_workflow").asText("WORKFLOW_A"));
                result.setClinicalDisclaimer(root.path("non_diagnostic_disclaimer").asText("MindBridge screening platform. Not a medical diagnosis."));
                result.setRecommendationsJson(root.path("recommendations").toString());
                result.setRawAiResponse(response.getBody());
                result.setAnalyzedAt(Instant.now());
                return result;
            }
        } catch (Exception ex) {
            logger.warn("AI service call failed or timed out: {}. Invoking robust deterministic clinical fallback.", ex.getMessage());
        }

        return createFallbackAnalysisResult(assessment, responses);
    }

    private AiAnalysisResult createFallbackAnalysisResult(Assessment assessment, List<AssessmentResponse> responses) {
        int totalScore = assessment.getTotalScore();
        int selfMood = assessment.getSelfReportedMood();
        boolean hasSelfHarm = false;

        for (AssessmentResponse r : responses) {
            String qText = r.getQuestion().getQuestionText().toLowerCase();
            if (qText.contains("better off dead") || qText.contains("hurting yourself")) {
                if (r.getScore() >= 1) {
                    hasSelfHarm = true;
                }
            }
        }

        String riskLevel;
        String workflow;
        if (hasSelfHarm) {
            riskLevel = "IMMEDIATE_SAFETY_CONCERN";
            workflow = "URGENT_SAFETY";
        } else if (totalScore >= 15 || selfMood <= 2) {
            riskLevel = "SIGNIFICANT_CONCERN";
            workflow = "WORKFLOW_B";
        } else {
            riskLevel = "LOW_CONCERN";
            workflow = "WORKFLOW_A";
        }

        AiAnalysisResult fallback = new AiAnalysisResult();
        fallback.setAssessment(assessment);
        fallback.setSentimentLabel(totalScore > 10 ? "NEGATIVE" : "NEUTRAL");
        fallback.setSentimentConfidence(BigDecimal.valueOf(0.85));
        fallback.setDominantEmotion(totalScore > 12 ? "Sadness" : "Neutral");
        fallback.setEmotionScoresJson("{\"Sadness\": 0.40, \"Neutral\": 0.30, \"Anxiety\": 0.30}");
        fallback.setAiInferredMood(Math.max(1, Math.min(5, selfMood)));
        fallback.setRiskLevel(riskLevel);
        fallback.setRiskFactorsJson("[\"Rule-based deterministic clinical fallback evaluation\"]");
        fallback.setProbableConditionsJson("[]");
        fallback.setRecommendedWorkflow(workflow);
        fallback.setClinicalDisclaimer("MindBridge is an emotional wellness and preliminary screening platform, not a medical diagnostic system.");
        fallback.setRecommendationsJson("[\"Explore guided CBT exercises\", \"Monitor daily mood changes\", \"Reach out to certified mental health professionals if symptoms persist\"]");
        fallback.setRawAiResponse("{\"status\":\"FALLBACK\"}");
        fallback.setAnalyzedAt(Instant.now());
        return fallback;
    }
}
