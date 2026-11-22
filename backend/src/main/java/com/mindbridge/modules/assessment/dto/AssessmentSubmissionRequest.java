package com.mindbridge.modules.assessment.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class AssessmentSubmissionRequest {

    @NotNull(message = "Self-reported mood is required")
    private Integer selfReportedMood = 3;

    private String additionalNotes;

    @NotNull(message = "Assessment responses are required")
    private List<QuestionAnswerDto> answers;

    public Integer getSelfReportedMood() { return selfReportedMood; }
    public void setSelfReportedMood(Integer selfReportedMood) { this.selfReportedMood = selfReportedMood; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public List<QuestionAnswerDto> getAnswers() { return answers; }
    public void setAnswers(List<QuestionAnswerDto> answers) { this.answers = answers; }

    public static class QuestionAnswerDto {
        @NotNull
        private UUID questionId;
        private int score;
        private String selectedOption;
        private String responseText;

        public UUID getQuestionId() { return questionId; }
        public void setQuestionId(UUID questionId) { this.questionId = questionId; }

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }

        public String getSelectedOption() { return selectedOption; }
        public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

        public String getResponseText() { return responseText; }
        public void setResponseText(String responseText) { this.responseText = responseText; }
    }
}
