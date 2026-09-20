package com.general_auth.application.service;

import com.general_auth.application.dto.request.ApplicationStatusRequest;
import com.general_auth.application.entity.Application;
import com.general_auth.application.entity.ApplicationStatus;
import com.general_auth.application.repository.ApplicationRepository;
import com.general_auth.common.exception.DuplicateApplicationException;
import com.general_auth.common.exception.ForbiddenException;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.service.OpportunityMatchingService;
import com.general_auth.opportunity.service.OpportunityService;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.repository.ResumeRepository;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ApplicationServiceTest {

    private final ApplicationRepository applicationRepository = mock(ApplicationRepository.class);
    private final OpportunityService opportunityService = mock(OpportunityService.class);
    private final OpportunityMatchingService matchingService = mock(OpportunityMatchingService.class);
    private final StudentService studentService = mock(StudentService.class);
    private final ResumeRepository resumeRepository = mock(ResumeRepository.class);

    private ApplicationService service() {
        return new ApplicationService(applicationRepository, opportunityService, matchingService, studentService, resumeRepository);
    }

    @Test
    void duplicateApplicationIsRejected() {
        StudentProfile profile = profile(1L);
        Opportunity opportunity = opportunity(10L, OpportunityStatus.OPEN, null);
        User studentUser = user(1L, Role.STUDENT);

        when(studentService.getOrCreateProfile(studentUser)).thenReturn(profile);
        when(opportunityService.findOpportunity(10L)).thenReturn(opportunity);
        when(applicationRepository.existsByStudentAndOpportunity(profile, opportunity)).thenReturn(true);

        assertThrows(DuplicateApplicationException.class,
                () -> service().apply(studentUser, 10L, null));
    }

    @Test
    void closedOpportunityCannotBeAppliedTo() {
        StudentProfile profile = profile(1L);
        Opportunity opportunity = opportunity(10L, OpportunityStatus.CLOSED, null);
        User studentUser = user(1L, Role.STUDENT);

        when(studentService.getOrCreateProfile(studentUser)).thenReturn(profile);
        when(opportunityService.findOpportunity(10L)).thenReturn(opportunity);

        assertThrows(IllegalArgumentException.class,
                () -> service().apply(studentUser, 10L, null));
    }

    @Test
    void expiredDeadlineCannotBeAppliedTo() {
        StudentProfile profile = profile(1L);
        Opportunity opportunity = opportunity(10L, OpportunityStatus.OPEN, LocalDate.now().minusDays(1));
        User studentUser = user(1L, Role.STUDENT);

        when(studentService.getOrCreateProfile(studentUser)).thenReturn(profile);
        when(opportunityService.findOpportunity(10L)).thenReturn(opportunity);

        assertThrows(IllegalArgumentException.class,
                () -> service().apply(studentUser, 10L, null));
    }

    @Test
    void cannotWithdrawSomeoneElsesApplication() {
        Application application = application(99L, profile(1L), ApplicationStatus.APPLIED);
        when(applicationRepository.findById(99L)).thenReturn(Optional.of(application));

        User otherStudent = user(2L, Role.STUDENT);
        when(studentService.getOrCreateProfile(otherStudent)).thenReturn(profile(2L));

        assertThrows(ForbiddenException.class, () -> service().withdraw(otherStudent, 99L));
    }

    @Test
    void cannotWithdrawSelectedApplication() {
        Application application = application(99L, profile(1L), ApplicationStatus.SELECTED);
        when(applicationRepository.findById(99L)).thenReturn(Optional.of(application));

        User owner = user(1L, Role.STUDENT);
        when(studentService.getOrCreateProfile(owner)).thenReturn(profile(1L));

        assertThrows(IllegalArgumentException.class, () -> service().withdraw(owner, 99L));
    }

    @Test
    void recruiterCannotModifySomeoneElsesOpportunityApplications() {
        Opportunity opportunity = opportunity(10L, OpportunityStatus.OPEN, null);
        Application application = application(99L, profile(1L), ApplicationStatus.APPLIED);
        application.setOpportunity(opportunity);
        when(applicationRepository.findById(99L)).thenReturn(Optional.of(application));

        User recruiter = user(5L, Role.RECRUITER);
        // findOwnedOpportunity throws ForbiddenException when the recruiter does not own it
        when(opportunityService.findOwnedOpportunity(recruiter, 10L))
                .thenThrow(new ForbiddenException("Opportunity not found or you are not its owner: 10"));

        assertThrows(ForbiddenException.class, () -> service().updateStatus(recruiter, 99L,
                new ApplicationStatusRequest(ApplicationStatus.SHORTLISTED)));
    }

    @Test
    void recruiterCannotSetWithdrawnStatus() {
        Opportunity opportunity = opportunity(10L, OpportunityStatus.OPEN, null);
        Application application = application(99L, profile(1L), ApplicationStatus.APPLIED);
        application.setOpportunity(opportunity);
        when(applicationRepository.findById(99L)).thenReturn(Optional.of(application));

        User recruiter = user(5L, Role.RECRUITER);
        when(opportunityService.findOwnedOpportunity(recruiter, 10L)).thenReturn(opportunity);
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(matchingService.match(any(), any())).thenReturn(new MatchResponse());

        assertThrows(IllegalArgumentException.class, () -> service().updateStatus(recruiter, 99L,
                new ApplicationStatusRequest(ApplicationStatus.WITHDRAWN)));
    }

    @Test
    void applyCreatesApplicationWithAppliedStatus() {
        StudentProfile profile = profile(1L);
        Opportunity opportunity = opportunity(10L, OpportunityStatus.OPEN, null);
        User studentUser = user(1L, Role.STUDENT);

        when(studentService.getOrCreateProfile(studentUser)).thenReturn(profile);
        when(opportunityService.findOpportunity(10L)).thenReturn(opportunity);
        when(applicationRepository.existsByStudentAndOpportunity(profile, opportunity)).thenReturn(false);
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(matchingService.match(profile, opportunity)).thenReturn(new MatchResponse(10L, "Backend Developer Intern",
                80, List.of("Java", "Spring Boot", "SQL", "Git"), List.of("Docker"), true, List.of()));

        var response = service().apply(studentUser, 10L, null);

        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        assertEquals(80, response.getMatchScore());
        assertEquals(List.of("Docker"), response.getMissingSkills());
    }

    private StudentProfile profile(Long id) {
        StudentProfile profile = new StudentProfile();
        profile.setId(id);
        return profile;
    }

    private User user(Long id, Role role) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        return user;
    }

    private Opportunity opportunity(Long id, OpportunityStatus status, LocalDate deadline) {
        Opportunity opportunity = new Opportunity();
        opportunity.setId(id);
        opportunity.setTitle("Backend Developer Intern");
        opportunity.setStatus(status);
        opportunity.setApplicationDeadline(deadline);
        return opportunity;
    }

    private Application application(Long id, StudentProfile student, ApplicationStatus status) {
        Application application = new Application();
        application.setId(id);
        application.setStudent(student);
        application.setStatus(status);
        return application;
    }
}