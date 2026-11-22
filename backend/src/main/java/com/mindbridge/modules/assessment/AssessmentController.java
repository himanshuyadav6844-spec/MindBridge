package com.mindbridge.modules.assessment;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.assessment.dto.AssessmentResultDto;
import com.mindbridge.modules.assessment.dto.AssessmentSubmissionRequest;
import com.mindbridge.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assessments")
@Tag(name = "Mental Health Assessment", description = "Questionnaire delivery, patient assessment submission, and AI analysis reporting")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/questions")
    @Operation(summary = "Retrieve active structured assessment questionnaire items")
    public ResponseEntity<ApiResponse<List<AssessmentQuestion>>> getQuestions() {
        List<AssessmentQuestion> questions = assessmentService.getActiveQuestions();
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @PostMapping({"", "/submit"})
    @Operation(summary = "Submit completed questionnaire responses and generate AI assessment report")
    public ResponseEntity<ApiResponse<AssessmentResultDto>> submitAssessment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AssessmentSubmissionRequest request) {
        AssessmentResultDto result = assessmentService.submitAssessment(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Assessment evaluated successfully", result));
    }

    @GetMapping
    @Operation(summary = "Retrieve assessment history for current authenticated patient")
    public ResponseEntity<ApiResponse<List<AssessmentResultDto>>> getPatientAssessments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<AssessmentResultDto> list = assessmentService.getPatientAssessments(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}/result")
    @Operation(summary = "Retrieve specific AI analysis report by assessment ID")
    public ResponseEntity<ApiResponse<AssessmentResultDto>> getAssessmentResult(@PathVariable UUID id) {
        AssessmentResultDto result = assessmentService.getAssessmentResult(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
