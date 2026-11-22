package com.mindbridge.modules.chatbot;

import com.mindbridge.common.ApiResponse;
import com.mindbridge.modules.chatbot.dto.ChatMessageRequest;
import com.mindbridge.modules.chatbot.dto.ChatMessageResponse;
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
@RequestMapping("/api/chatbot")
@Tag(name = "AI Mental Wellness Chatbot", description = "Real-time supportive emotional companion with crisis detection and guardrails")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/messages")
    @Operation(summary = "Send a conversational message to the AI wellness companion")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatbotService.sendMessage(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversations")
    @Operation(summary = "Retrieve active conversation sessions for the current patient")
    public ResponseEntity<ApiResponse<List<ChatbotConversation>>> getConversations(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ChatbotConversation> conversations = chatbotService.getPatientConversations(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }

    @GetMapping("/conversations/{id}/messages")
    @Operation(summary = "Get full message thread for a specific conversation session")
    public ResponseEntity<ApiResponse<List<ChatbotMessage>>> getMessages(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ChatbotMessage> messages = chatbotService.getConversationMessages(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @DeleteMapping("/conversations/{id}")
    @Operation(summary = "Delete or clear conversation history")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        chatbotService.deleteConversation(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Conversation history cleared successfully", null));
    }
}
