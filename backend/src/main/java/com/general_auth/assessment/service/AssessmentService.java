package com.general_auth.assessment.service;

import com.general_auth.assessment.dto.request.AssessmentAnswerRequest;
import com.general_auth.assessment.dto.request.AssessmentSubmitRequest;
import com.general_auth.assessment.dto.response.AssessmentQuestionResponse;
import com.general_auth.assessment.dto.response.AssessmentResponse;
import com.general_auth.assessment.dto.response.AssessmentSubmitResponse;
import com.general_auth.assessment.dto.response.QuestionResultResponse;
import com.general_auth.assessment.dto.response.SkillScoreResponse;
import com.general_auth.assessment.entity.Assessment;
import com.general_auth.assessment.entity.AssessmentAnswer;
import com.general_auth.assessment.entity.AssessmentQuestion;
import com.general_auth.assessment.entity.AssessmentStatus;
import com.general_auth.assessment.repository.AssessmentAnswerRepository;
import com.general_auth.assessment.repository.AssessmentQuestionRepository;
import com.general_auth.assessment.repository.AssessmentRepository;
import com.general_auth.common.exception.ResourceNotFoundException;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.SkillSource;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentService studentService;

    /** Public view of a seeded assessment template (correct answers are never exposed). */
    @Transactional(readOnly = true)
    public AssessmentResponse view(User user, Long templateId) {
        AuthUtils.requireRole(user, Role.STUDENT);
        Assessment template = findTemplate(templateId);
        return toAssessmentResponse(template);
    }

    /** Starts (or resumes) the student's attempt for the template and returns the questions. */
    @Transactional
    public AssessmentResponse start(User user, Long templateId) {
        AuthUtils.requireRole(user, Role.STUDENT);
        Assessment template = findTemplate(templateId);
        Assessment attempt = getOrCreateAttempt(user, template);
        return toAssessmentResponse(attempt);
    }

    /**
     * Evaluates the student's answers, derives per-skill proficiency (1-5),
     * updates StudentSkill rows with source ASSESSMENT and marks the attempt completed.
     */
    @Transactional
    public AssessmentSubmitResponse submit(User user, Long templateId, AssessmentSubmitRequest request) {
        AuthUtils.requireRole(user, Role.STUDENT);
        Assessment template = findTemplate(templateId);
        Assessment attempt = getOrCreateAttempt(user, template);

        if (attempt.getStatus() == AssessmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Assessment already submitted");
        }

        List<AssessmentQuestion> questions = questionRepository.findByAssessment(template);
        Map<Long, AssessmentQuestion> questionById = questions.stream()
                .collect(Collectors.toMap(AssessmentQuestion::getId, Function.identity()));

        // Validate every submitted question belongs to this assessment.
        for (AssessmentAnswerRequest answer : request.getAnswers()) {
            if (!questionById.containsKey(answer.getQuestionId())) {
                throw new IllegalArgumentException("Question id " + answer.getQuestionId() + " does not belong to this assessment");
            }
        }

        Map<Long, String> submittedAnswers = request.getAnswers().stream()
                .filter(answer -> answer.getAnswer() != null)
                .collect(Collectors.toMap(AssessmentAnswerRequest::getQuestionId, AssessmentAnswerRequest::getAnswer));

        // Score each question.
        List<QuestionResultResponse> questionResults = new ArrayList<>();
        int correctCount = 0;
        for (AssessmentQuestion question : questions) {
            String given = submittedAnswers.getOrDefault(question.getId(), "");
            boolean correct = given != null && given.trim().equalsIgnoreCase(question.getCorrectAnswer().trim());
            if (correct) correctCount++;
            questionResults.add(new QuestionResultResponse(
                    question.getId(),
                    question.getTargetSkill().getName(),
                    correct,
                    correct ? question.getWeight() : 0,
                    question.getWeight()
            ));
            answerRepository.save(new AssessmentAnswer(null, attempt, question, given, correct ? question.getWeight() : 0));
        }

        // Aggregate scores per target skill -> proficiency (1-5), then upsert StudentSkill.
        Map<Skill, double[]> skillScores = new HashMap<>(); // skill -> [earned, max]
        for (AssessmentQuestion question : questions) {
            boolean correct = submittedAnswers.getOrDefault(question.getId(), "") != null
                    && submittedAnswers.getOrDefault(question.getId(), "").trim()
                    .equalsIgnoreCase(question.getCorrectAnswer().trim());
            double[] acc = skillScores.computeIfAbsent(question.getTargetSkill(), k -> new double[]{0, 0});
            acc[0] += correct ? question.getWeight() : 0;
            acc[1] += question.getWeight();
        }

        List<SkillScoreResponse> skillScoresResponse = new ArrayList<>();
        StudentProfile profile = studentService.getOrCreateProfile(user);
        for (Map.Entry<Skill, double[]> entry : skillScores.entrySet()) {
            double fraction = entry.getValue()[1] == 0 ? 0 : entry.getValue()[0] / entry.getValue()[1];
            if (fraction == 0) {
                continue; // skill not demonstrated -> do not create a StudentSkill row
            }
            int proficiency = Math.max(1, Math.min(5, (int) Math.round(fraction * 5)));
            Skill skill = entry.getKey();
            StudentSkill studentSkill = studentSkillRepository.findByStudentAndSkill(profile, skill)
                    .orElseGet(() -> {
                        StudentSkill ss = new StudentSkill();
                        ss.setStudent(profile);
                        ss.setSkill(skill);
                        ss.setSource(SkillSource.ASSESSMENT);
                        return ss;
                    });
            studentSkill.setProficiency(proficiency);
            studentSkill.setSource(SkillSource.ASSESSMENT);
            studentSkillRepository.save(studentSkill);
            skillScoresResponse.add(new SkillScoreResponse(skill.getName(), proficiency));
        }

        attempt.setStatus(AssessmentStatus.COMPLETED);
        attempt.setCompletedAt(LocalDateTime.now());
        assessmentRepository.save(attempt);

        return new AssessmentSubmitResponse(
                attempt.getId(),
                attempt.getStatus().name(),
                questions.size(),
                correctCount,
                skillScoresResponse,
                questionResults
        );
    }

    private Assessment findTemplate(Long templateId) {
        return assessmentRepository.findByIdAndStudentIsNull(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with id: " + templateId));
    }

    private Assessment getOrCreateAttempt(User user, Assessment template) {
        StudentProfile profile = studentService.getOrCreateProfile(user);
        return assessmentRepository.findByStudentAndTemplateId(profile, template.getId())
                .orElseGet(() -> {
                    Assessment attempt = new Assessment();
                    attempt.setStudent(profile);
                    attempt.setTemplateId(template.getId());
                    attempt.setTitle(template.getTitle());
                    attempt.setStatus(AssessmentStatus.STARTED);
                    attempt.setStartedAt(LocalDateTime.now());
                    return assessmentRepository.save(attempt);
                });
    }

    private AssessmentResponse toAssessmentResponse(Assessment assessment) {
        List<AssessmentQuestionResponse> questions = questionRepository.findByAssessment(assessment).stream()
                .map(this::toQuestionResponse)
                .toList();
        String status = assessment.getStatus() != null ? assessment.getStatus().name() : null;
        return new AssessmentResponse(assessment.getId(), assessment.getTitle(), status, questions);
    }

    private AssessmentQuestionResponse toQuestionResponse(AssessmentQuestion question) {
        List<String> options = question.getOptions() == null || question.getOptions().isBlank()
                ? List.of()
                : List.of(question.getOptions().split(","));
        return new AssessmentQuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType(),
                question.getTargetSkill().getName(),
                options,
                question.getWeight()
        );
    }
}