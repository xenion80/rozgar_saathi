package com.general_auth.opportunity.service;

import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunitySkill;
import com.general_auth.opportunity.repository.OpportunitySkillRepository;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.SkillSource;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OpportunityMatchingServiceTest {

    private StudentSkillRepository studentSkillRepository;
    private OpportunitySkillRepository opportunitySkillRepository;
    private OpportunityMatchingService service;

    @BeforeEach
    void setUp() {
        studentSkillRepository = mock(StudentSkillRepository.class);
        opportunitySkillRepository = mock(OpportunitySkillRepository.class);
        service = new OpportunityMatchingService(studentSkillRepository, opportunitySkillRepository);
    }

    @Test
    void sixtyPercentMatchForThreeOfFiveSkills() {
        // Required: Java, Spring Boot, SQL, Docker, Redis
        // Student:  Java, Spring Boot, SQL
        // Expected: 3 / 5 * 100 = 60%, eligible at threshold 60
        StudentProfile student = studentWithProficiencies("Java", "4", "Spring Boot", "3", "SQL", "3");
        Opportunity opportunity = opportunity(101L, "Backend Developer Intern");
        required(opportunity, 5, "Java", "Spring Boot", "SQL", "Docker", "Redis");

        MatchResponse match = service.match(student, opportunity);

        assertEquals(60, match.getMatchScore());
        assertEquals(List.of("Java", "Spring Boot", "SQL"), match.getMatchedSkills());
        assertEquals(List.of("Docker", "Redis"), match.getMissingSkills());
        assertTrue(match.isEligible());
        assertEquals(5, match.getSkillDetails().size());
    }

    @Test
    void eightyPercentMatchForFourOfFiveSkills() {
        // The flagship demo scenario: student lacks Docker only.
        StudentProfile student = studentWithProficiencies("Java", "4", "Spring Boot", "4", "SQL", "3", "Git", "3");
        Opportunity opportunity = opportunity(102L, "Backend Developer Intern");
        required(opportunity, 5, "Java", "Spring Boot", "SQL", "Git", "Docker");

        MatchResponse match = service.match(student, opportunity);

        assertEquals(80, match.getMatchScore());
        assertEquals(List.of("Java", "Spring Boot", "SQL", "Git"), match.getMatchedSkills());
        assertEquals(List.of("Docker"), match.getMissingSkills());
        assertTrue(match.isEligible());
    }

    @Test
    void belowThresholdIsNotEligible() {
        StudentProfile student = studentWithProficiencies("Java", "4");
        Opportunity opportunity = opportunity(103L, "Full Stack Developer Trainee");
        required(opportunity, 4, "Java", "React", "SQL", "Docker");

        MatchResponse match = service.match(student, opportunity);

        assertEquals(25, match.getMatchScore());
        assertFalse(match.isEligible());
    }

    @Test
    void opportunityWithoutRequiredSkillsIsPerfectMatch() {
        StudentProfile student = studentWithProficiencies("Java", "2");
        Opportunity opportunity = opportunity(104L, "Open Project");
        when(opportunitySkillRepository.findByOpportunity(opportunity)).thenReturn(List.of());

        MatchResponse match = service.match(student, opportunity);

        assertEquals(100, match.getMatchScore());
        assertTrue(match.isEligible());
        assertTrue(match.getMatchedSkills().isEmpty());
        assertTrue(match.getMissingSkills().isEmpty());
    }

    @Test
    void skillBelowRequiredProficiencyStillCountsAsMatchedForBaseScore() {
        // Base (presence-based) algorithm: possession of the skill is what counts.
        // Proficiency/importance weighting is reserved for later, and the details
        // must still surface the proficiency gap.
        StudentProfile student = studentWithProficiencies("Docker", "1");
        Opportunity opportunity = opportunity(105L, "Cloud Role");
        OpportunitySkill required = requiredSkill(opportunity, "Docker", 5, 5);
        when(opportunitySkillRepository.findByOpportunity(opportunity)).thenReturn(List.of(required));

        MatchResponse match = service.match(student, opportunity);

        assertEquals(100, match.getMatchScore());
        assertEquals(1, match.getSkillDetails().get(0).getCurrentProficiency());
        assertEquals(5, match.getSkillDetails().get(0).getRequiredProficiency());
        assertTrue(match.getSkillDetails().get(0).isMatched());
    }

    private StudentProfile studentWithProficiencies(String... skillProficiencies) {
        StudentProfile student = new StudentProfile();
        student.setId(1L);
        List<StudentSkill> studentSkills = new java.util.ArrayList<>();
        for (int i = 0; i < skillProficiencies.length; i += 2) {
            Skill skill = new Skill();
            skill.setId((long) (i + 1));
            skill.setName(skillProficiencies[i]);
            StudentSkill ss = new StudentSkill();
            ss.setStudent(student);
            ss.setSkill(skill);
            ss.setProficiency(Integer.parseInt(skillProficiencies[i + 1]));
            ss.setSource(SkillSource.MANUAL);
            studentSkills.add(ss);
        }
        when(studentSkillRepository.findByStudent(student)).thenReturn(studentSkills);
        return student;
    }

    private Opportunity opportunity(Long id, String title) {
        Opportunity opportunity = new Opportunity();
        opportunity.setId(id);
        opportunity.setTitle(title);
        return opportunity;
    }

    private void required(Opportunity opportunity, int count, String... names) {
        List<OpportunitySkill> requiredSkills = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            requiredSkills.add(requiredSkill(opportunity, names[i], 3, 5));
        }
        when(opportunitySkillRepository.findByOpportunity(opportunity)).thenReturn(requiredSkills);
    }

    private OpportunitySkill requiredSkill(Opportunity opportunity, String name, int requiredProficiency, int importance) {
        Skill skill = new Skill();
        skill.setName(name);
        OpportunitySkill os = new OpportunitySkill();
        os.setOpportunity(opportunity);
        os.setSkill(skill);
        os.setRequiredProficiency(requiredProficiency);
        os.setImportance(importance);
        return os;
    }
}