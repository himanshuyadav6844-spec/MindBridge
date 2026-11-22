package com.mindbridge.modules.chatbot.dto;

import java.time.Instant;
import java.util.UUID;

public class ChatMessageResponse {
    private UUID messageId;
    private UUID conversationId;
    private String senderType;
    private String messageText;
    private boolean crisisAlert;
    private String suggestedCbtSlug;
    private Instant createdAt;

    public ChatMessageResponse() {}

    public ChatMessageResponse(UUID messageId, UUID conversationId, String senderType,
                               String messageText, boolean crisisAlert, String suggestedCbtSlug) {
        this.messageId = messageId;
        this.conversationId = conversationId;
        this.senderType = senderType;
        this.messageText = messageText;
        this.crisisAlert = crisisAlert;
        this.suggestedCbtSlug = suggestedCbtSlug;
        this.createdAt = Instant.now();
    }

    public UUID getMessageId() { return messageId; }
    public void setMessageId(UUID messageId) { this.messageId = messageId; }

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public boolean isCrisisAlert() { return crisisAlert; }
    public void setCrisisAlert(boolean crisisAlert) { this.crisisAlert = crisisAlert; }

    public String getSuggestedCbtSlug() { return suggestedCbtSlug; }
    public void setSuggestedCbtSlug(String suggestedCbtSlug) { this.suggestedCbtSlug = suggestedCbtSlug; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
