package com.mindbridge.modules.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class ChatMessageRequest {
    private UUID conversationId;

    @NotBlank(message = "Message text cannot be empty")
    private String message;

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
