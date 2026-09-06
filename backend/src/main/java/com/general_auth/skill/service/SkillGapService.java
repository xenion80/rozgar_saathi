package com.general_auth.skill.service;

import com.general_auth.skill.dto.response.SkillGapDetail;
import com.general_auth.skill.dto.response.SkillGapResponse;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.skill.service.RoleRequiredSkills.RequiredSkill;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentService studentService;

    @Transactional(readOnly = true)
    public SkillGapResponse getSkillGaps(User user) {
        StudentProfile profile = studentService.getOrCreateProfile(user);

        if (profile.getTargetRole() == null || profile.getTargetRole().isBlank()) {
            throw new IllegalArgumentException("Set a targetRole on your student profile (PUT /api/students/me) before viewing skill gaps");
        }
        if (!RoleRequiredSkills.isKnownRole(profile.getTargetRole())) {
            throw new IllegalArgumentException("Unknown target role '" + profile.getTargetRole()
                    + "'. Supported roles: " + RoleRequiredSkills.all().keySet());
        }

        Map<String, Integer> currentProficiencies = studentSkillRepository.findByStudent(profile).stream()
                .collect(Collectors.toMap(
                        ss -> ss.getSkill().getName(),
                        StudentSkill::getProficiency,
                        (a, b) -> Math.max(a, b)
                ));

        List<SkillGapDetail> matched = new ArrayList<>();
        List<SkillGapDetail> missing = new ArrayList<>();

        for (RequiredSkill required : RoleRequiredSkills.forRole(profile.getTargetRole())) {
            Integer current = currentProficiencies.getOrDefault(required.name(), 0);
            SkillGapDetail detail = new SkillGapDetail(required.name(), current, required.requiredProficiency());
            if (current >= 1) {
                matched.add(detail);
            } else {
                missing.add(detail);
            }
        }

        return new SkillGapResponse(profile.getTargetRole(), matched, missing);
    }
}