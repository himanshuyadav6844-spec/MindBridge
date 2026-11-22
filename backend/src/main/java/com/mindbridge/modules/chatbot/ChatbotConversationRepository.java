package com.mindbridge.modules.chatbot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatbotConversationRepository extends JpaRepository<ChatbotConversation, UUID> {
    List<ChatbotConversation> findByPatientIdAndIsActiveTrueOrderByUpdatedAtDesc(UUID patientId);
}
