package com.general_auth.student.service;

import com.general_auth.student.dto.AiCoachRequestDto;
import com.general_auth.user.entity.User;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.opportunity.service.OpportunityService;
import com.general_auth.opportunity.dto.response.OpportunityMatchSummary;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.skill.entity.StudentSkill;
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
import java.util.stream.Collectors;

@Service
public class AiCoachService {

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    private static final String OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    // Using DeepSeek Chat (DeepSeek V3/Pro)
    private static final String MODEL_NAME = "deepseek/deepseek-chat";

    private static final String SYSTEM_INSTRUCTION =
            "You are an expert career and education coach for the Rozgar Saathi platform. " +
            "Your ONLY purpose is to provide advice on jobs, careers, skills, resumes, and education. " +
            "If the user asks about ANYTHING ELSE, you MUST politely refuse to answer and remind them " +
            "that you are a career coach. Do not answer general knowledge questions outside of " +
            "career/education contexts.\n\n" +
            "Below is context about the student you are talking to. Use it to provide highly personalized answers.\n";

    private final RestTemplate restTemplate = new RestTemplate();
    private final StudentService studentService;
    private final OpportunityService opportunityService;
    private final StudentSkillRepository studentSkillRepository;

    public AiCoachService(StudentService studentService, OpportunityService opportunityService, StudentSkillRepository studentSkillRepository) {
        this.studentService = studentService;
        this.opportunityService = opportunityService;
        this.studentSkillRepository = studentSkillRepository;
    }

    public String getCoachResponse(AiCoachRequestDto request, User user) {
        if (openrouterApiKey == null || openrouterApiKey.trim().isEmpty()) {
            return "The AI Coach is currently unavailable. Please set OPENROUTER_API_KEY.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openrouterApiKey.trim());
            headers.set("HTTP-Referer", "http://localhost:3000"); // Optional but recommended by OpenRouter
            headers.set("X-Title", "Rozgar Saathi"); // Optional but recommended

            // Build contextual system prompt
            StudentProfile profile = studentService.getOrCreateProfile(user);
            List<StudentSkill> skills = studentSkillRepository.findByStudent(profile);
            String skillNames = skills.isEmpty() ? "No skills added yet." : 
                    skills.stream().map(s -> s.getSkill().getName() + " (" + s.getProficiency() + "/5)").collect(Collectors.joining(", "));
            
            // Get top 5 recommended jobs
            List<OpportunityMatchSummary> recommended = opportunityService.recommended(profile);
            List<OpportunityMatchSummary> topJobs = recommended.size() > 5 ? recommended.subList(0, 5) : recommended;
            
            StringBuilder contextBuilder = new StringBuilder(SYSTEM_INSTRUCTION);
            contextBuilder.append("Student Name: ").append(user.getName()).append("\n");
            contextBuilder.append("Target Role: ").append(profile.getTargetRole() != null ? profile.getTargetRole() : "Not set").append("\n");
            contextBuilder.append("Student Skills: ").append(skillNames).append("\n\n");
            contextBuilder.append("Top Recommended Jobs (and Skill Gaps):\n");
            
            if (topJobs.isEmpty()) {
                contextBuilder.append("No open jobs found.\n");
            } else {
                for (OpportunityMatchSummary job : topJobs) {
                    contextBuilder.append("- ").append(job.getTitle()).append(" at ").append(job.getCompanyName()).append("\n");
                    contextBuilder.append("  Match Score: ").append(job.getMatchScore()).append("%\n");
                    contextBuilder.append("  Matched Skills: ").append(String.join(", ", job.getMatchedSkills())).append("\n");
                    contextBuilder.append("  Missing Skills: ").append(String.join(", ", job.getMissingSkills())).append("\n");
                }
            }

            // Build messages array
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", contextBuilder.toString()));

            // Add history
            if (request.getHistory() != null) {
                for (AiCoachRequestDto.ChatMessage msg : request.getHistory()) {
                    String role = "ai".equalsIgnoreCase(msg.getRole()) ? "assistant" : "user";
                    messages.add(Map.of("role", role, "content", msg.getContent()));
                }
            }

            // Add current user message
            messages.add(Map.of("role", "user", "content", request.getMessage()));

            Map<String, Object> body = new HashMap<>();
            body.put("model", MODEL_NAME);
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_API_URL, entity, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
            return "I'm sorry, I couldn't get a response. Please try again.";

        } catch (Exception e) {
            System.err.println("Error calling OpenRouter API: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }
}
