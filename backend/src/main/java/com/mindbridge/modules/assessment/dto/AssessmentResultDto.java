package com.mindbridge.modules.assessment.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class AssessmentResultDto {
    private UUID assessmentId;
    private Instant completedAt;
    private int totalScore;
    private int selfReportedMood;
    private int aiInferredMood;
    private String sentimentLabel;
    private BigDecimal sentimentConfidence;
    private String dominantEmotion;
    private String emotionScoresJson;
    private String riskLevel;
    private String riskFactorsJson;
    private String probableConditionsJson;
    private String recommendedWorkflow;
    private String clinicalDisclaimer;
    private String recommendationsJson;
    private String additionalNotes;

    public UUID getAssessmentId() { return assessmentId; }
    public void setAssessmentId(UUID assessmentId) { this.assessmentId = assessmentId; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }

    public int getSelfReportedMood() { return selfReportedMood; }
    public void setSelfReportedMood(int selfReportedMood) { this.selfReportedMood = selfReportedMood; }

    public int getAiInferredMood() { return aiInferredMood; }
    public void setAiInferredMood(int aiInferredMood) { this.aiInferredMood = aiInferredMood; }

    public String getSentimentLabel() { return sentimentLabel; }
    public void setSentimentLabel(String sentimentLabel) { this.sentimentLabel = sentimentLabel; }

    public BigDecimal getSentimentConfidence() { return sentimentConfidence; }
    public void setSentimentConfidence(BigDecimal sentimentConfidence) { this.sentimentConfidence = sentimentConfidence; }

    public String getDominantEmotion() { return dominantEmotion; }
    public void setDominantEmotion(String dominantEmotion) { this.dominantEmotion = dominantEmotion; }

    public String getEmotionScoresJson() { return emotionScoresJson; }
    public void setEmotionScoresJson(String emotionScoresJson) { this.emotionScoresJson = emotionScoresJson; }

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

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
}
