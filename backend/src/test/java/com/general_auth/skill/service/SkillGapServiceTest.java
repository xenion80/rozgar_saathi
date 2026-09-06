package com.general_auth.skill.service;

import com.general_auth.skill.dto.response.SkillGapDetail;
import com.general_auth.skill.dto.response.SkillGapResponse;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.SkillSource;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.User;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SkillGapServiceTest {

    @Test
    void identifiesMatchedAndMissingSkillsForTargetRole() {
        StudentSkillRepository studentSkillRepository = mock(StudentSkillRepository.class);
        StudentService studentService = mock(StudentService.class);

        User user = new User();
        user.setId(1L);

        StudentProfile profile = new StudentProfile();
        profile.setId(1L);
        profile.setTargetRole("Backend Developer");

        when(studentService.getOrCreateProfile(user)).thenReturn(profile);
        when(studentSkillRepository.findByStudent(profile)).thenReturn(List.of(
                studentSkill(profile, "Java", 4),
                studentSkill(profile, "Spring Boot", 4),
                studentSkill(profile, "SQL", 3),
                studentSkill(profile, "Git", 3)
        ));

        SkillGapService service = new SkillGapService(studentSkillRepository, studentService);

        SkillGapResponse response = service.getSkillGaps(user);

        assertEquals("Backend Developer", response.getTargetRole());

        // Backend Developer requires: Java(3), Spring Boot(3), SQL(3), Git(2), Docker(3)
        assertEquals(4, response.getMatchedSkills().size());
        assertEquals(1, response.getMissingSkills().size());
        assertEquals("Docker", response.getMissingSkills().get(0).getSkill());
        assertEquals(0, response.getMissingSkills().get(0).getCurrentProficiency());
        assertEquals(3, response.getMissingSkills().get(0).getRequiredProficiency());

        SkillGapDetail java = response.getMatchedSkills().stream()
                .filter(detail -> detail.getSkill().equals("Java"))
                .findFirst().orElseThrow();
        assertEquals(4, java.getCurrentProficiency());
        assertEquals(3, java.getRequiredProficiency());
    }

    @Test
    void missingTargetRoleIsRejected() {
        StudentSkillRepository studentSkillRepository = mock(StudentSkillRepository.class);
        StudentService studentService = mock(StudentService.class);

        User user = new User();
        user.setId(1L);

        StudentProfile profile = new StudentProfile();
        profile.setId(1L);

        when(studentService.getOrCreateProfile(user)).thenReturn(profile);

        SkillGapService service = new SkillGapService(studentSkillRepository, studentService);

        assertThrows(IllegalArgumentException.class, () -> service.getSkillGaps(user));
    }

    @Test
    void unknownTargetRoleIsRejected() {
        StudentSkillRepository studentSkillRepository = mock(StudentSkillRepository.class);
        StudentService studentService = mock(StudentService.class);

        User user = new User();
        user.setId(1L);

        StudentProfile profile = new StudentProfile();
        profile.setId(1L);
        profile.setTargetRole("Astronaut");

        when(studentService.getOrCreateProfile(user)).thenReturn(profile);

        SkillGapService service = new SkillGapService(studentSkillRepository, studentService);

        assertThrows(IllegalArgumentException.class, () -> service.getSkillGaps(user));
    }

    private StudentSkill studentSkill(StudentProfile profile, String name, int proficiency) {
        Skill skill = new Skill();
        skill.setName(name);
        StudentSkill ss = new StudentSkill();
        ss.setStudent(profile);
        ss.setSkill(skill);
        ss.setProficiency(proficiency);
        ss.setSource(SkillSource.MANUAL);
        return ss;
    }
}