package com.general_auth.recruiter.service;

import com.general_auth.application.dto.response.CandidateResponse;
import com.general_auth.application.entity.Application;
import com.general_auth.application.entity.ApplicationStatus;
import com.general_auth.application.repository.ApplicationRepository;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.service.OpportunityMatchingService;
import com.general_auth.opportunity.service.OpportunityService;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RecruiterServiceTest {

    @Test
    void candidatesAreSortedByMatchScoreDescending() {
        ApplicationRepository applicationRepository = mock(ApplicationRepository.class);
        OpportunityService opportunityService = mock(OpportunityService.class);
        OpportunityMatchingService matchingService = mock(OpportunityMatchingService.class);

        Opportunity opportunity = new Opportunity();
        opportunity.setId(10L);
        opportunity.setTitle("Backend Developer Intern");

        User recruiter = new User();
        recruiter.setId(5L);
        recruiter.setRole(Role.RECRUITER);

        StudentProfile weakStudent = student(1L, "Low Skill Student");
        StudentProfile strongStudent = student(2L, "High Skill Student");

        Application weakApp = application(101L, weakStudent);
        Application strongApp = application(102L, strongStudent);

        when(opportunityService.findOwnedOpportunity(recruiter, 10L)).thenReturn(opportunity);
        when(applicationRepository.findByOpportunityIdOrderByAppliedAtDesc(10L))
                .thenReturn(List.of(weakApp, strongApp));

        when(matchingService.match(any(), any())).thenAnswer(invocation -> {
            StudentProfile student = invocation.getArgument(0);
            int score = student.getId() == 2L ? 90 : 40;
            return new MatchResponse(10L, "Backend Developer Intern", score,
                    List.of(), List.of(), score >= 60, List.of());
        });

        RecruiterService service = new RecruiterService(applicationRepository, opportunityService, matchingService);

        List<CandidateResponse> candidates = service.candidates(recruiter, 10L);

        assertEquals(2, candidates.size());
        assertEquals("High Skill Student", candidates.get(0).getStudentName());
        assertEquals(90, candidates.get(0).getMatchScore());
        assertEquals("Low Skill Student", candidates.get(1).getStudentName());
        assertEquals(40, candidates.get(1).getMatchScore());
        assertEquals(ApplicationStatus.APPLIED, candidates.get(0).getStatus());
    }

    private StudentProfile student(Long id, String name) {
        StudentProfile profile = new StudentProfile();
        profile.setId(id);
        User user = new User();
        user.setName(name);
        user.setEmail("student" + id + "@demo.com");
        profile.setUser(user);
        return profile;
    }

    private Application application(Long id, StudentProfile student) {
        Application application = new Application();
        application.setId(id);
        application.setStudent(student);
        application.setStatus(ApplicationStatus.APPLIED);
        return application;
    }
}