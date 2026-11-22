package com.mindbridge.modules.ai;

import com.mindbridge.modules.assessment.Assessment;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_analysis_results")
public class AiAnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false, unique = true)
    private Assessment assessment;

    @Column(name = "sentiment_label", nullable = false)
    private String sentimentLabel;

    @Column(name = "sentiment_confidence", nullable = false, precision = 5, scale = 4)
    private BigDecimal sentimentConfidence;

    @Column(name = "dominant_emotion", nullable = false)
    private String dominantEmotion;

    @Column(name = "emotion_scores_json", nullable = false, columnDefinition = "TEXT")
    private String emotionScoresJson;

    @Column(name = "ai_inferred_mood", nullable = false)
    private int aiInferredMood;

    @Column(name = "risk_level", nullable = false)
    private String riskLevel; // LOW_CONCERN, MODERATE_CONCERN, SIGNIFICANT_CONCERN, IMMEDIATE_SAFETY_CONCERN

    @Column(name = "risk_factors_json", columnDefinition = "TEXT")
    private String riskFactorsJson;

    @Column(name = "probable_conditions_json", columnDefinition = "TEXT")
    private String probableConditionsJson;

    @Column(name = "recommended_workflow", nullable = false)
    private String recommendedWorkflow; // WORKFLOW_A, WORKFLOW_B, URGENT_SAFETY

    @Column(name = "clinical_disclaimer", nullable = false, columnDefinition = "TEXT")
    private String clinicalDisclaimer;

    @Column(name = "recommendations_json", nullable = false, columnDefinition = "TEXT")
    private String recommendationsJson;

    @Column(name = "raw_ai_response", columnDefinition = "TEXT")
    private String rawAiResponse;

    @Column(name = "analyzed_at", nullable = false)
    private Instant analyzedAt = Instant.now();

    public AiAnalysisResult() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public String getSentimentLabel() { return sentimentLabel; }
    public void setSentimentLabel(String sentimentLabel) { this.sentimentLabel = sentimentLabel; }

    public BigDecimal getSentimentConfidence() { return sentimentConfidence; }
    public void setSentimentConfidence(BigDecimal sentimentConfidence) { this.sentimentConfidence = sentimentConfidence; }

    public String getDominantEmotion() { return dominantEmotion; }
    public void setDominantEmotion(String dominantEmotion) { this.dominantEmotion = dominantEmotion; }

    public String getEmotionScoresJson() { return emotionScoresJson; }
    public void setEmotionScoresJson(String emotionScoresJson) { this.emotionScoresJson = emotionScoresJson; }

    public int getAiInferredMood() { return aiInferredMood; }
    public void setAiInferredMood(int aiInferredMood) { this.aiInferredMood = aiInferredMood; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRiskFactorsJson() { return riskFactorsJson; }
    public void setRiskFactorsJson(String riskFactorsJson) { this.riskFactorsJson = riskFactorsJson; }

    public String getProbableConditionsJson() { return probableConditionsJson; }
    public void setProbableConditionsJson(String probableConditionsJson) { this.probableConditionsJson = probableConditionsJson; }

    public String getRecommendedWorkflow() { return recommendedWorkflow; }
    public void setRecommendedWorkflow(String recommendedWorkflow) { this.recommendedWorkflow = recommendedWorkflow; }

    public String getClinicalDisclaimer() { return clinicalDisclaimer; }
    public void setClinicalDisclaimer(String clinicalDisclaimer) { this.clinicalDisclaimer = clinicalDisclaimer; }

    public String getRecommendationsJson() { return recommendationsJson; }
    public void setRecommendationsJson(String recommendationsJson) { this.recommendationsJson = recommendationsJson; }

    public String getRawAiResponse() { return rawAiResponse; }
    public void setRawAiResponse(String rawAiResponse) { this.rawAiResponse = rawAiResponse; }

    public Instant getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(Instant analyzedAt) { this.analyzedAt = analyzedAt; }
}
