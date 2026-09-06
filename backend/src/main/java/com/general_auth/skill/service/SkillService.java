package com.general_auth.skill.service;

import com.general_auth.common.exception.ResourceNotFoundException;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.skill.dto.request.StudentSkillRequest;
import com.general_auth.skill.dto.response.SkillResponse;
import com.general_auth.skill.dto.response.StudentSkillResponse;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.SkillSource;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.SkillRepository;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentService studentService;

    @Transactional(readOnly = true)
    public List<SkillResponse> listSkills() {
        return skillRepository.findAllByOrderByNameAsc().stream()
                .map(this::toSkillResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StudentSkillResponse> getStudentSkills(User user) {
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        return studentSkillRepository.findByStudent(profile).stream()
                .map(this::toStudentSkillResponse)
                .toList();
    }

    @Transactional
    public StudentSkillResponse addStudentSkill(User user, StudentSkillRequest request) {
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + request.getSkillId()));

        if (studentSkillRepository.existsByStudentAndSkill(profile, skill)) {
            throw new IllegalArgumentException("Skill '" + skill.getName() + "' already added. Use PUT to update its proficiency.");
        }

        StudentSkill studentSkill = new StudentSkill();
        studentSkill.setStudent(profile);
        studentSkill.setSkill(skill);
        studentSkill.setProficiency(request.getProficiency());
        studentSkill.setSource(request.getSource() != null ? request.getSource() : SkillSource.MANUAL);
        return toStudentSkillResponse(studentSkillRepository.save(studentSkill));
    }

    @Transactional
    public StudentSkillResponse updateStudentSkill(User user, Long skillId, StudentSkillRequest request) {
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        StudentSkill studentSkill = studentSkillRepository.findByStudentIdAndSkillId(profile.getId(), skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found on student profile with skillId: " + skillId));
        studentSkill.setProficiency(request.getProficiency());
        if (request.getSource() != null) {
            studentSkill.setSource(request.getSource());
        }
        return toStudentSkillResponse(studentSkillRepository.save(studentSkill));
    }

    private SkillResponse toSkillResponse(Skill skill) {
        return new SkillResponse(skill.getId(), skill.getName(), skill.getCategory(), skill.getDescription());
    }

    private StudentSkillResponse toStudentSkillResponse(StudentSkill studentSkill) {
        return new StudentSkillResponse(
                studentSkill.getId(),
                toSkillResponse(studentSkill.getSkill()),
                studentSkill.getProficiency(),
                studentSkill.getSource(),
                studentSkill.getUpdatedAt()
        );
    }
}