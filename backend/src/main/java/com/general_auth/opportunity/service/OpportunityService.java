package com.general_auth.opportunity.service;

import com.general_auth.common.exception.ForbiddenException;
import com.general_auth.common.exception.ResourceNotFoundException;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.opportunity.dto.request.OpportunityRequest;
import com.general_auth.opportunity.dto.request.OpportunitySkillRequest;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.dto.response.OpportunityMatchSummary;
import com.general_auth.opportunity.dto.response.OpportunityResponse;
import com.general_auth.opportunity.dto.response.OpportunitySkillResponse;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunitySkill;
import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.repository.OpportunityRepository;
import com.general_auth.opportunity.repository.OpportunitySkillRepository;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.repository.SkillRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final SkillRepository skillRepository;
    private final OpportunityMatchingService matchingService;

    @Transactional
    public OpportunityResponse create(User recruiter, OpportunityRequest request) {
        AuthUtils.requireRole(recruiter, Role.RECRUITER);

        Opportunity opportunity = new Opportunity();
        opportunity.setRecruiter(recruiter);
        applyRequest(opportunity, request);
        Opportunity saved = opportunityRepository.save(opportunity);

        if (request.getSkills() != null) {
            for (OpportunitySkillRequest skillRequest : request.getSkills()) {
                opportunitySkillRepository.save(toOpportunitySkill(saved, skillRequest));
            }
        }
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OpportunityResponse> list(User viewer) {
        List<Opportunity> opportunities = viewer.getRole() == Role.RECRUITER
                ? opportunityRepository.findAllByOrderByCreatedAtDesc()
                : opportunityRepository.findByStatus(OpportunityStatus.OPEN);
        return opportunities.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public OpportunityResponse get(User viewer, Long id) {
        Opportunity opportunity = findOpportunity(id);
        if (viewer.getRole() != Role.RECRUITER && opportunity.getStatus() != OpportunityStatus.OPEN) {
            throw new ResourceNotFoundException("Opportunity not found with id: " + id);
        }
        return toResponse(opportunity);
    }

    @Transactional
    public OpportunityResponse update(User recruiter, Long id, OpportunityRequest request) {
        AuthUtils.requireRole(recruiter, Role.RECRUITER);
        Opportunity opportunity = findOwnedOpportunity(recruiter, id);

        applyRequest(opportunity, request);
        Opportunity saved = opportunityRepository.save(opportunity);

        opportunitySkillRepository.deleteByOpportunity(opportunity);
        if (request.getSkills() != null) {
            for (OpportunitySkillRequest skillRequest : request.getSkills()) {
                opportunitySkillRepository.save(toOpportunitySkill(saved, skillRequest));
            }
        }
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OpportunityMatchSummary> recommended(StudentProfile student) {
        List<Map.Entry<Opportunity, MatchResponse>> scored = opportunityRepository.findByStatus(OpportunityStatus.OPEN).stream()
                .map(opportunity -> Map.entry(opportunity, matchingService.match(student, opportunity)))
                .toList();
        return scored.stream()
                .sorted(Comparator.comparingInt((Map.Entry<Opportunity, MatchResponse> entry) -> entry.getValue().getMatchScore()).reversed())
                .map(entry -> new OpportunityMatchSummary(
                        entry.getKey().getId(),
                        entry.getKey().getTitle(),
                        entry.getKey().getCompanyName(),
                        entry.getValue().getMatchScore(),
                        entry.getValue().getMatchedSkills(),
                        entry.getValue().getMissingSkills()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public MatchResponse getMatch(User user, StudentProfile student, Long opportunityId) {
        AuthUtils.requireRole(user, Role.STUDENT);
        Opportunity opportunity = findOpportunity(opportunityId);
        return matchingService.match(student, opportunity);
    }

    public Opportunity findOwnedOpportunity(User recruiter, Long id) {
        return opportunityRepository.findByIdAndRecruiter(id, recruiter)
                .orElseThrow(() -> new ForbiddenException("Opportunity not found or you are not its owner: " + id));
    }

    public Opportunity findOpportunity(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id: " + id));
    }

    private void applyRequest(Opportunity opportunity, OpportunityRequest request) {
        opportunity.setTitle(request.getTitle());
        opportunity.setDescription(request.getDescription());
        opportunity.setType(request.getType());
        opportunity.setCompanyName(request.getCompanyName());
        opportunity.setLocation(request.getLocation());
        opportunity.setWorkMode(request.getWorkMode());
        opportunity.setMinimumQualification(request.getMinimumQualification());
        opportunity.setStatus(request.getStatus());
        opportunity.setApplicationDeadline(request.getApplicationDeadline());
    }

    private OpportunitySkill toOpportunitySkill(Opportunity opportunity, OpportunitySkillRequest request) {
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + request.getSkillId()));
        OpportunitySkill opportunitySkill = new OpportunitySkill();
        opportunitySkill.setOpportunity(opportunity);
        opportunitySkill.setSkill(skill);
        opportunitySkill.setRequiredProficiency(request.getRequiredProficiency());
        opportunitySkill.setImportance(request.getImportance());
        return opportunitySkill;
    }

    private OpportunityResponse toResponse(Opportunity opportunity) {
        List<OpportunitySkillResponse> skills = opportunitySkillRepository.findByOpportunity(opportunity).stream()
                .map(os -> new OpportunitySkillResponse(
                        os.getId(),
                        os.getSkill().getId(),
                        os.getSkill().getName(),
                        os.getRequiredProficiency(),
                        os.getImportance()
                ))
                .toList();
        return new OpportunityResponse(
                opportunity.getId(),
                opportunity.getRecruiter().getId(),
                opportunity.getTitle(),
                opportunity.getDescription(),
                opportunity.getType(),
                opportunity.getCompanyName(),
                opportunity.getLocation(),
                opportunity.getWorkMode(),
                opportunity.getMinimumQualification(),
                opportunity.getStatus(),
                opportunity.getApplicationDeadline(),
                opportunity.getCreatedAt(),
                skills
        );
    }


}