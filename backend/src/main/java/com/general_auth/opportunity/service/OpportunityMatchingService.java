package com.general_auth.opportunity.service;

import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.dto.response.SkillMatchDetail;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunitySkill;
import com.general_auth.opportunity.repository.OpportunitySkillRepository;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Deterministic, explainable opportunity matching engine.
 *
 * Base score: matched required skills / total required skills * 100.
 * A required skill counts as "matched" when the student possesses it (proficiency >= 1).
 *
 * The result keeps per-skill proficiency/importance data so a proficiency- or
 * importance-weighted variant can be added later without changing the contract.
 */
@Service
@RequiredArgsConstructor
public class OpportunityMatchingService {

    /** A match at or above this score is considered eligible for the opportunity. */
    public static final int ELIGIBILITY_THRESHOLD = 60;

    private final StudentSkillRepository studentSkillRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;

    @Transactional(readOnly = true)
    public MatchResponse match(StudentProfile student, Opportunity opportunity) {
        Map<String, Integer> studentProficiencies = studentSkillRepository.findByStudent(student).stream()
                .collect(Collectors.toMap(
                        ss -> ss.getSkill().getName(),
                        StudentSkill::getProficiency,
                        (a, b) -> Math.max(a, b)
                ));

        List<OpportunitySkill> requiredSkills = opportunitySkillRepository.findByOpportunity(opportunity);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<SkillMatchDetail> details = new ArrayList<>();

        for (OpportunitySkill required : requiredSkills) {
            String skillName = required.getSkill().getName();
            int current = studentProficiencies.getOrDefault(skillName, 0);
            boolean hasSkill = current >= 1;
            details.add(new SkillMatchDetail(skillName, current, required.getRequiredProficiency(), hasSkill));
            if (hasSkill) {
                matched.add(skillName);
            } else {
                missing.add(skillName);
            }
        }

        int matchScore = requiredSkills.isEmpty() ? 100 : computeMatchScore(matched.size(), requiredSkills.size());

        return new MatchResponse(
                opportunity.getId(),
                opportunity.getTitle(),
                matchScore,
                matched,
                missing,
                matchScore >= ELIGIBILITY_THRESHOLD,
                details
        );
    }

    /** matched / total * 100, rounded. Override/extend later for weighted scoring. */
    protected int computeMatchScore(int matchedCount, int totalCount) {
        return (int) Math.round(matchedCount * 100.0 / totalCount);
    }
}