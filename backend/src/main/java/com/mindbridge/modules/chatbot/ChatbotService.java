package com.mindbridge.modules.chatbot;

import com.mindbridge.common.AccessDeniedException;
import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.chatbot.dto.ChatMessageRequest;
import com.mindbridge.modules.chatbot.dto.ChatMessageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    private final ChatbotConversationRepository conversationRepository;
    private final ChatbotMessageRepository messageRepository;
    private final UserRepository userRepository;

    private static final Pattern CRISIS_REGEX = Pattern.compile(
            "\\b(suicid|kill myself|end my life|want to die|better off dead|slit my wrist|jump off|hang myself)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public ChatbotService(ChatbotConversationRepository conversationRepository,
                          ChatbotMessageRepository messageRepository,
                          UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatMessageResponse sendMessage(UUID patientId, ChatMessageRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        ChatbotConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
            if (!conversation.getPatient().getId().equals(patientId)) {
                throw new AccessDeniedException("Access denied to this conversation");
            }
        } else {
            String snippet = request.getMessage().length() > 30 ? request.getMessage().substring(0, 30) + "..." : request.getMessage();
            conversation = conversationRepository.save(new ChatbotConversation(patient, snippet));
        }

        String userText = request.getMessage().trim();
        boolean isCrisis = CRISIS_REGEX.matcher(userText).find();

        // Save user message
        ChatbotMessage userMsg = new ChatbotMessage(
                conversation,
                "USER",
                userText,
                isCrisis ? "NEGATIVE" : "NEUTRAL",
                isCrisis ? "Fear" : "Neutral",
                isCrisis
        );
        messageRepository.save(userMsg);

        // Generate bot supportive response with clinical safety guardrails
        String botResponseText;
        String suggestedCbt = null;

        if (isCrisis) {
            botResponseText = "URGENT SAFETY ALERT: I hear how much pain you are experiencing right now, but as an AI companion, I cannot provide emergency crisis care. Your safety is deeply important.\n\n" +
                    "Please reach out immediately to trained professionals who can support you:\n" +
                    "• Tele-MANAS (Govt. of India): 14416 / 1800-891-4416 (24/7 Free)\n" +
                    "• KIRAN Helpline: 1800-599-0019\n" +
                    "• Emergency Medical Services: 112\n\n" +
                    "Please do not remain alone right now; reach out to a trusted loved one or emergency hospital.";
            suggestedCbt = "guided-breathing";
        } else {
            String lower = userText.toLowerCase();
            if (lower.contains("anxious") || lower.contains("panic") || lower.contains("racing") || lower.contains("nervous")) {
                botResponseText = "It is completely valid to feel anxious when your thoughts are running fast. Try taking a slow breath with me: inhale for 4 seconds, hold for 4, and gently exhale for 4. Would you like to try our Guided Box Breathing exercise?";
                suggestedCbt = "guided-breathing";
            } else if (lower.contains("sad") || lower.contains("down") || lower.contains("depressed") || lower.contains("lonely")) {
                botResponseText = "I hear that things are feeling heavy right now. It takes courage to acknowledge low feelings. Sometimes writing down what is weighing on your mind can bring a bit of clarity. Have you considered our Thought Journal or Gratitude Reflection?";
                suggestedCbt = "thought-journal";
            } else if (lower.contains("stress") || lower.contains("overwhelm") || lower.contains("work") || lower.contains("burnout")) {
                botResponseText = "Carrying a lot of demands can easily lead to feeling overwhelmed. Breaking your focus down into one small manageable task can help restore a sense of calm. Our Progressive Muscle Relaxation exercise can also help release physical tension in your shoulders and neck.";
                suggestedCbt = "stress-management";
            } else if (lower.contains("doctor") || lower.contains("therapy") || lower.contains("consult") || lower.contains("help")) {
                botResponseText = "Consulting with a licensed psychologist or psychiatrist is a wonderful and proactive step toward mental wellness. You can browse verified professionals and book a consultation directly in our Doctor Directory.";
                suggestedCbt = null;
            } else {
                botResponseText = "Thank you for sharing that with me. I am here as your supportive companion to help you reflect, track your mood, or guide you through evidence-informed CBT exercises whenever you need. How is your body feeling right now?";
                suggestedCbt = "daily-reflection";
            }
        }

        ChatbotMessage botMsg = new ChatbotMessage(
                conversation,
                "BOT",
                botResponseText,
                "SUPPORTIVE",
                "Empathy",
                isCrisis
        );
        ChatbotMessage savedBotMsg = messageRepository.save(botMsg);

        return new ChatMessageResponse(
                savedBotMsg.getId(),
                conversation.getId(),
                "BOT",
                botResponseText,
                isCrisis,
                suggestedCbt
        );
    }

    @Transactional(readOnly = true)
    public List<ChatbotConversation> getPatientConversations(UUID patientId) {
        return conversationRepository.findByPatientIdAndIsActiveTrueOrderByUpdatedAtDesc(patientId);
    }

    @Transactional(readOnly = true)
    public List<ChatbotMessage> getConversationMessages(UUID conversationId, UUID patientId) {
        ChatbotConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        if (!conversation.getPatient().getId().equals(patientId)) {
            throw new AccessDeniedException("Access denied to conversation history");
        }
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Transactional
    public void deleteConversation(UUID conversationId, UUID patientId) {
        ChatbotConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        if (!conversation.getPatient().getId().equals(patientId)) {
            throw new AccessDeniedException("Access denied to conversation history");
        }
        conversation.setActive(false);
        conversationRepository.save(conversation);
    }
}
