package com.mindbridge.modules.chatbot;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chatbot_messages")
public class ChatbotMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private ChatbotConversation conversation;

    @Column(name = "sender_type", nullable = false)
    private String senderType; // USER, BOT, SYSTEM

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String messageText;

    @Column(name = "sentiment_tag")
    private String sentimentTag;

    @Column(name = "emotion_tag")
    private String emotionTag;

    @Column(name = "contains_crisis_alert", nullable = false)
    private boolean containsCrisisAlert = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ChatbotMessage() {}

    public ChatbotMessage(ChatbotConversation conversation, String senderType, String messageText,
                          String sentimentTag, String emotionTag, boolean containsCrisisAlert) {
        this.conversation = conversation;
        this.senderType = senderType;
        this.messageText = messageText;
        this.sentimentTag = sentimentTag;
        this.emotionTag = emotionTag;
        this.containsCrisisAlert = containsCrisisAlert;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ChatbotConversation getConversation() { return conversation; }
    public void setConversation(ChatbotConversation conversation) { this.conversation = conversation; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public String getSentimentTag() { return sentimentTag; }
    public void setSentimentTag(String sentimentTag) { this.sentimentTag = sentimentTag; }

    public String getEmotionTag() { return emotionTag; }
    public void setEmotionTag(String emotionTag) { this.emotionTag = emotionTag; }

    public boolean isContainsCrisisAlert() { return containsCrisisAlert; }
    public void setContainsCrisisAlert(boolean containsCrisisAlert) { this.containsCrisisAlert = containsCrisisAlert; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
