package com.general_auth.student.service;

import com.general_auth.student.dto.AiCoachRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiCoachService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent";

    private static final String SYSTEM_INSTRUCTION =
            "You are an expert career and education coach for the Rozgar Saathi platform. " +
            "Your ONLY purpose is to provide advice on jobs, careers, skills, resumes, and education. " +
            "If the user asks about ANYTHING ELSE, you MUST politely refuse to answer and remind them " +
            "that you are a career coach. Do not answer general knowledge questions outside of " +
            "career/education contexts.";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getCoachResponse(AiCoachRequestDto request) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return "The AI Coach is currently unavailable. Please set GEMINI_API_KEY.";
        }

        try {
            String url = GEMINI_API_URL + "?key=" + geminiApiKey.trim();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build contents array from history + current message
            List<Map<String, Object>> contents = new ArrayList<>();

            // Add history
            if (request.getHistory() != null) {
                for (AiCoachRequestDto.ChatMessage msg : request.getHistory()) {
                    String role = "ai".equalsIgnoreCase(msg.getRole()) ? "model" : "user";
                    contents.add(buildContent(role, msg.getContent()));
                }
            }

            // Add current user message
            contents.add(buildContent("user", request.getMessage()));

            // Build system instruction
            Map<String, Object> systemInstruction = new HashMap<>();
            Map<String, String> systemPart = new HashMap<>();
            systemPart.put("text", SYSTEM_INSTRUCTION);
            systemInstruction.put("parts", List.of(systemPart));

            Map<String, Object> body = new HashMap<>();
            body.put("system_instruction", systemInstruction);
            body.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }
            return "I'm sorry, I couldn't get a response. Please try again.";

        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }

    private Map<String, Object> buildContent(String role, String text) {
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", text);
        content.put("role", role);
        content.put("parts", List.of(part));
        return content;
    }
}
