package com.general_auth.recruiter.service;

import com.general_auth.application.dto.response.CandidateResponse;
import com.general_auth.application.entity.Application;
import com.general_auth.application.repository.ApplicationRepository;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.service.OpportunityMatchingService;
import com.general_auth.opportunity.service.OpportunityService;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityService opportunityService;
    private final OpportunityMatchingService matchingService;

    /** All candidates for an owned opportunity, sorted by descending match score. */
    @Transactional(readOnly = true)
    public List<CandidateResponse> candidates(User recruiter, Long opportunityId) {
        AuthUtils.requireRole(recruiter, Role.RECRUITER);
        Opportunity opportunity = opportunityService.findOwnedOpportunity(recruiter, opportunityId);

        return applicationRepository.findByOpportunityIdOrderByAppliedAtDesc(opportunityId).stream()
                .map(application -> {
                    StudentProfile student = application.getStudent();
                    MatchResponse match = matchingService.match(student, opportunity);
                    return new CandidateResponse(
                            application.getId(),
                            student.getId(),
                            student.getUser().getName(),
                            student.getUser().getEmail(),
                            application.getStatus(),
                            match.getMatchScore(),
                            match.getMatchedSkills(),
                            match.getMissingSkills(),
                            application.getCoverLetter(),
                            application.getResume() != null ? application.getResume().getFileUrl() : null
                    );
                })
                .sorted(Comparator.comparingInt(CandidateResponse::getMatchScore).reversed())
                .toList();
    }
}