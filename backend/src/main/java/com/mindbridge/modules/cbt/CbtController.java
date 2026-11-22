package com.mindbridge.modules.cbt;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.cbt.dto.CbtProgressRequest;
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
@RequestMapping("/api/cbt")
@Tag(name = "CBT Interactive Exercises", description = "Endpoints for Cognitive Behavioral Therapy modules, guided exercises, and progress tracking")
public class CbtController {

    private final CbtService cbtService;

    public CbtController(CbtService cbtService) {
        this.cbtService = cbtService;
    }

    @GetMapping("/exercises")
    @Operation(summary = "List all available evidence-informed CBT exercises")
    public ResponseEntity<ApiResponse<List<CbtExercise>>> getAllExercises() {
        List<CbtExercise> exercises = cbtService.getAllExercises();
        return ResponseEntity.ok(ApiResponse.success(exercises));
    }

    @GetMapping("/exercises/{idOrSlug}")
    @Operation(summary = "Get specific CBT exercise details by UUID or slug")
    public ResponseEntity<ApiResponse<CbtExercise>> getExercise(@PathVariable String idOrSlug) {
        CbtExercise exercise = cbtService.getExerciseByIdOrSlug(idOrSlug);
        return ResponseEntity.ok(ApiResponse.success(exercise));
    }

    @PostMapping("/progress")
    @Operation(summary = "Submit progress and completed responses for a CBT exercise")
    public ResponseEntity<ApiResponse<PatientCbtProgress>> recordProgress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CbtProgressRequest request) {
        PatientCbtProgress progress = cbtService.recordProgress(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("CBT progress recorded successfully", progress));
    }

    @GetMapping("/progress")
    @Operation(summary = "Get completed and in-progress CBT exercises for the current patient")
    public ResponseEntity<ApiResponse<List<PatientCbtProgress>>> getPatientProgress(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<PatientCbtProgress> progressList = cbtService.getPatientProgress(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(progressList));
    }
}
