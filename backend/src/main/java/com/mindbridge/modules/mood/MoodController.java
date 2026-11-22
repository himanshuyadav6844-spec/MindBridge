package com.mindbridge.modules.mood;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.mood.dto.MoodEntryRequest;
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
@RequestMapping({"/api/moods", "/api/mood"})
@Tag(name = "Mood Tracking", description = "Endpoints for daily mood recording, emotion tagging, stress & sleep tracking, and analytics")
public class MoodController {

    private final MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    @PostMapping
    @Operation(summary = "Log a new daily mood entry")
    public ResponseEntity<ApiResponse<MoodEntry>> createMoodEntry(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody MoodEntryRequest request) {
        MoodEntry entry = moodService.createMoodEntry(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Mood entry recorded successfully", entry));
    }

    @GetMapping
    @Operation(summary = "Get historical mood records for current authenticated patient")
    public ResponseEntity<ApiResponse<List<MoodEntry>>> getMoodHistory(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<MoodEntry> history = moodService.getPatientMoodHistory(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get mood entries over the last N days (default 30)")
    public ResponseEntity<ApiResponse<List<MoodEntry>>> getMoodTrends(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "30") int days) {
        List<MoodEntry> trends = moodService.getRecentMoodTrend(currentUser.getId(), days);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing mood entry")
    public ResponseEntity<ApiResponse<MoodEntry>> updateMoodEntry(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody MoodEntryRequest request) {
        MoodEntry updated = moodService.updateMoodEntry(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Mood entry updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a mood entry")
    public ResponseEntity<ApiResponse<Void>> deleteMoodEntry(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        moodService.deleteMoodEntry(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Mood entry deleted successfully", null));
    }
}
