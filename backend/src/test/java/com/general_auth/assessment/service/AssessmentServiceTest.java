package com.general_auth.assessment.service;

import com.general_auth.assessment.dto.request.AssessmentAnswerRequest;
import com.general_auth.assessment.dto.request.AssessmentSubmitRequest;
import com.general_auth.assessment.dto.response.AssessmentSubmitResponse;
import com.general_auth.assessment.entity.Assessment;
import com.general_auth.assessment.entity.AssessmentAnswer;
import com.general_auth.assessment.entity.AssessmentQuestion;
import com.general_auth.assessment.entity.AssessmentStatus;
import com.general_auth.assessment.entity.QuestionType;
import com.general_auth.assessment.repository.AssessmentAnswerRepository;
import com.general_auth.assessment.repository.AssessmentQuestionRepository;
import com.general_auth.assessment.repository.AssessmentRepository;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.SkillSource;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AssessmentServiceTest {

    private final AssessmentRepository assessmentRepository = mock(AssessmentRepository.class);
    private final AssessmentQuestionRepository questionRepository = mock(AssessmentQuestionRepository.class);
    private final AssessmentAnswerRepository answerRepository = mock(AssessmentAnswerRepository.class);
    private final StudentSkillRepository studentSkillRepository = mock(StudentSkillRepository.class);
    private final StudentService studentService = mock(StudentService.class);

    private AssessmentService service() {
        return new AssessmentService(assessmentRepository, questionRepository, answerRepository,
                studentSkillRepository, studentService);
    }

    @Test
    void submitEvaluatesAnswersAndUpdatesStudentSkills() {
        Skill java = skill("Java");
        Skill sql = skill("SQL");

        Assessment template = template(1L);
        AssessmentQuestion javaQ1 = question(11L, template, java, "final", 1);
        AssessmentQuestion javaQ2 = question(12L, template, java, "String", 1);
        AssessmentQuestion sqlQ1 = question(13L, template, sql, "SELECT", 1);
        List<AssessmentQuestion> questions = List.of(javaQ1, javaQ2, sqlQ1);

        StudentProfile profile = profile(1L);
        Assessment attempt = attempt(21L, profile, AssessmentStatus.STARTED);
        User user = user(1L);

        when(assessmentRepository.findByIdAndStudentIsNull(1L)).thenReturn(Optional.of(template));
        when(assessmentRepository.findByStudentAndTemplateId(profile, 1L)).thenReturn(Optional.of(attempt));
        when(questionRepository.findByAssessment(template)).thenReturn(questions);
        when(studentService.getOrCreateProfile(user)).thenReturn(profile);
        when(studentSkillRepository.findByStudentAndSkill(profile, java)).thenReturn(Optional.empty());
        when(studentSkillRepository.findByStudentAndSkill(profile, sql)).thenReturn(Optional.empty());
        when(answerRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(studentSkillRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AssessmentSubmitRequest request = new AssessmentSubmitRequest(List.of(
                new AssessmentAnswerRequest(11L, "final"),   // Java correct
                new AssessmentAnswerRequest(12L, "int"),     // Java wrong
                new AssessmentAnswerRequest(13L, "SELECT")   // SQL correct
        ));

        AssessmentSubmitResponse response = service().submit(user, 1L, request);

        assertEquals(3, response.getTotalQuestions());
        assertEquals(2, response.getCorrectAnswers());
        assertEquals(AssessmentStatus.COMPLETED, attempt.getStatus());

        // Java: 1/2 correct -> round(0.5 * 5) = 3; SQL: 1/1 -> 5
        assertEquals(2, response.getSkillScores().size());
        assertEquals(3, scoreFor(response, "Java"));
        assertEquals(5, scoreFor(response, "SQL"));

        // StudentSkill rows upserted with source ASSESSMENT (one per scored skill)
        verify(studentSkillRepository, org.mockito.Mockito.times(2)).save(any(StudentSkill.class));
    }

    @Test
    void secondSubmitIsRejected() {
        Skill java = skill("Java");
        Assessment template = template(1L);
        AssessmentQuestion javaQ1 = question(11L, template, java, "final", 1);

        StudentProfile profile = profile(1L);
        Assessment attempt = attempt(21L, profile, AssessmentStatus.COMPLETED);
        User user = user(1L);

        when(assessmentRepository.findByIdAndStudentIsNull(1L)).thenReturn(Optional.of(template));
        when(assessmentRepository.findByStudentAndTemplateId(profile, 1L)).thenReturn(Optional.of(attempt));
        when(questionRepository.findByAssessment(template)).thenReturn(List.of(javaQ1));
        when(studentService.getOrCreateProfile(user)).thenReturn(profile);
        when(answerRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AssessmentSubmitRequest request = new AssessmentSubmitRequest(List.of(
                new AssessmentAnswerRequest(11L, "final")
        ));

        assertThrows(IllegalArgumentException.class, () -> service().submit(user, 1L, request));
    }

    @Test
    void questionFromAnotherAssessmentIsRejected() {
        Skill java = skill("Java");
        Assessment template = template(1L);
        AssessmentQuestion javaQ1 = question(11L, template, java, "final", 1);

        StudentProfile profile = profile(1L);
        Assessment attempt = attempt(21L, profile, AssessmentStatus.STARTED);
        User user = user(1L);

        when(assessmentRepository.findByIdAndStudentIsNull(1L)).thenReturn(Optional.of(template));
        when(assessmentRepository.findByStudentAndTemplateId(profile, 1L)).thenReturn(Optional.of(attempt));
        when(questionRepository.findByAssessment(template)).thenReturn(List.of(javaQ1));
        when(studentService.getOrCreateProfile(user)).thenReturn(profile);

        AssessmentSubmitRequest request = new AssessmentSubmitRequest(List.of(
                new AssessmentAnswerRequest(999L, "final")
        ));

        assertThrows(IllegalArgumentException.class, () -> service().submit(user, 1L, request));
    }

    @Test
    void startCreatesAttemptWhenMissing() {
        Skill java = skill("Java");
        Assessment template = template(1L);
        AssessmentQuestion javaQ1 = question(11L, template, java, "final", 1);

        StudentProfile profile = profile(1L);
        User user = user(1L);

        when(assessmentRepository.findByIdAndStudentIsNull(1L)).thenReturn(Optional.of(template));
        when(assessmentRepository.findByStudentAndTemplateId(profile, 1L)).thenReturn(Optional.empty());
        when(assessmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(questionRepository.findByAssessment(any(Assessment.class))).thenReturn(List.of(javaQ1));
        when(studentService.getOrCreateProfile(user)).thenReturn(profile);

        var response = service().start(user, 1L);

        assertEquals("STARTED", response.getStatus());
        assertEquals(1, response.getQuestions().size());
    }

    private int scoreFor(AssessmentSubmitResponse response, String skillName) {
        return response.getSkillScores().stream()
                .filter(score -> score.getSkill().equals(skillName))
                .findFirst().orElseThrow().getProficiency();
    }

    private Skill skill(String name) {
        Skill skill = new Skill();
        skill.setName(name);
        return skill;
    }

    private Assessment template(Long id) {
        Assessment assessment = new Assessment();
        assessment.setId(id);
        assessment.setTitle("Technical Skills Assessment");
        assessment.setStudent(null);
        return assessment;
    }

    private Assessment attempt(Long id, StudentProfile profile, AssessmentStatus status) {
        Assessment assessment = new Assessment();
        assessment.setId(id);
        assessment.setStudent(profile);
        assessment.setTemplateId(1L);
        assessment.setStatus(status);
        return assessment;
    }

    private AssessmentQuestion question(Long id, Assessment assessment, Skill skill, String correctAnswer, int weight) {
        AssessmentQuestion question = new AssessmentQuestion();
        question.setId(id);
        question.setAssessment(assessment);
        question.setQuestionType(QuestionType.MULTIPLE_CHOICE);
        question.setTargetSkill(skill);
        question.setCorrectAnswer(correctAnswer);
        question.setWeight(weight);
        return question;
    }

    private StudentProfile profile(Long id) {
        StudentProfile profile = new StudentProfile();
        profile.setId(id);
        return profile;
    }

    private User user(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole(Role.STUDENT);
        return user;
    }
}