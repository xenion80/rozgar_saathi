package com.general_auth.opportunity.service;

import com.general_auth.application.repository.ApplicationRepository;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.dto.response.OpportunityMatchSummary;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.repository.OpportunityRepository;
import com.general_auth.opportunity.repository.OpportunitySkillRepository;
import com.general_auth.skill.repository.SkillRepository;
import com.general_auth.student.entity.StudentProfile;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OpportunityServiceTest {

    @Test
    void recommendedOpportunitiesAreSortedByMatchScoreDescendingAndOnlyOpenAreConsidered() {

        OpportunityRepository opportunityRepository =
                mock(OpportunityRepository.class);

        OpportunitySkillRepository opportunitySkillRepository =
                mock(OpportunitySkillRepository.class);

        SkillRepository skillRepository =
                mock(SkillRepository.class);

        ApplicationRepository applicationRepository =
                mock(ApplicationRepository.class);

        OpportunityMatchingService opportunityMatchingService =
                mock(OpportunityMatchingService.class);

        OpportunityService opportunityService = new OpportunityService(
                opportunityRepository,
                opportunitySkillRepository,
                skillRepository,
                applicationRepository,
                opportunityMatchingService
        );

        Opportunity backend =
                opportunity(1L, "Backend Developer Intern", "TechNova");

        Opportunity frontend =
                opportunity(2L, "Frontend Developer Intern", "CodeCraft");

        Opportunity dataAnalyst =
                opportunity(3L, "Data Analyst Intern", "Insight");

        when(opportunityRepository.findByStatus(OpportunityStatus.OPEN))
                .thenReturn(List.of(frontend, dataAnalyst, backend));

        StudentProfile student = new StudentProfile();
        student.setId(10L);

        when(opportunityMatchingService.match(any(), any()))
                .thenAnswer(invocation -> {

                    Opportunity opp = invocation.getArgument(1);

                    int score = switch (opp.getTitle()) {
                        case "Backend Developer Intern" -> 85;
                        case "Frontend Developer Intern" -> 45;
                        case "Data Analyst Intern" -> 70;
                        default -> 0;
                    };

                    return new MatchResponse(
                            opp.getId(),
                            opp.getTitle(),
                            score,
                            List.of(),
                            List.of(),
                            score >= 60,
                            List.of()
                    );
                });

        List<OpportunityMatchSummary> recommended =
                opportunityService.recommended(student);

        assertEquals(3, recommended.size());

        assertEquals(85, recommended.get(0).getMatchScore());
        assertEquals(
                "Backend Developer Intern",
                recommended.get(0).getTitle()
        );

        assertEquals(70, recommended.get(1).getMatchScore());

        assertEquals(45, recommended.get(2).getMatchScore());

        verify(opportunityRepository)
                .findByStatus(OpportunityStatus.OPEN);
    }

    private Opportunity opportunity(
            Long id,
            String title,
            String company
    ) {
        Opportunity opportunity = new Opportunity();

        opportunity.setId(id);
        opportunity.setTitle(title);
        opportunity.setCompanyName(company);

        return opportunity;
    }
}