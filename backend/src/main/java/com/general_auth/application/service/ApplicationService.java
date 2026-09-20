package com.general_auth.application.service;

import com.general_auth.application.dto.request.ApplyRequest;
import com.general_auth.application.dto.request.ApplicationStatusRequest;
import com.general_auth.application.dto.response.ApplicationResponse;
import com.general_auth.application.entity.Application;
import com.general_auth.application.entity.ApplicationStatus;
import com.general_auth.application.repository.ApplicationRepository;
import com.general_auth.common.exception.DuplicateApplicationException;
import com.general_auth.common.exception.ForbiddenException;
import com.general_auth.common.exception.ResourceNotFoundException;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.service.OpportunityMatchingService;
import com.general_auth.opportunity.service.OpportunityService;
import com.general_auth.student.entity.Resume;
import com.general_auth.student.repository.ResumeRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityService opportunityService;
    private final OpportunityMatchingService matchingService;
    private final StudentService studentService;
    private final ResumeRepository resumeRepository;

    @Transactional
    public ApplicationResponse apply(User user, Long opportunityId, ApplyRequest request) {
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        Opportunity opportunity = opportunityService.findOpportunity(opportunityId);

        if (opportunity.getStatus() != OpportunityStatus.OPEN) {
            throw new IllegalArgumentException("Cannot apply: opportunity is not open");
        }
        if (opportunity.getApplicationDeadline() != null
                && opportunity.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot apply: application deadline has passed");
        }
        if (applicationRepository.existsByStudentAndOpportunity(profile, opportunity)) {
            throw new DuplicateApplicationException("You have already applied to this opportunity");
        }

        Application application = new Application();
        application.setStudent(profile);
        application.setOpportunity(opportunity);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setCoverLetter(request != null ? request.getCoverLetter() : null);

        if (request != null && request.getResumeId() != null) {
            Resume resume = resumeRepository.findByIdAndStudentProfile(request.getResumeId(), profile)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid resume selected"));
            application.setResume(resume);
        }

        return toResponse(applicationRepository.save(application), profile);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> myApplications(User user) {
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        return applicationRepository.findByStudentOrderByAppliedAtDesc(profile).stream()
                .map(application -> toResponse(application, profile))
                .toList();
    }

    @Transactional
    public ApplicationResponse withdraw(User user, Long applicationId) {
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        Application application = findApplication(applicationId);

        if (!application.getStudent().getId().equals(profile.getId())) {
            throw new ForbiddenException("You can only withdraw your own applications");
        }
        ApplicationStatus current = application.getStatus();
        if (current == ApplicationStatus.SELECTED || current == ApplicationStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot withdraw an application that is " + current.name().toLowerCase());
        }
        if (current == ApplicationStatus.WITHDRAWN) {
            throw new IllegalArgumentException("Application is already withdrawn");
        }
        application.setStatus(ApplicationStatus.WITHDRAWN);
        return toResponse(applicationRepository.save(application), profile);
    }

    @Transactional
    public ApplicationResponse updateStatus(User recruiter, Long applicationId, ApplicationStatusRequest request) {
        AuthUtils.requireRole(recruiter, Role.RECRUITER);
        Application application = findApplication(applicationId);
        Opportunity opportunity = application.getOpportunity();
        opportunityService.findOwnedOpportunity(recruiter, opportunity.getId()); // throws Forbidden if not owner

        if (request.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new IllegalArgumentException("Recruiters cannot withdraw applications; use SHORTLISTED/INTERVIEW/SELECTED/REJECTED");
        }
        if (application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new IllegalArgumentException("Cannot change status of a withdrawn application");
        }
        application.setStatus(request.getStatus());
        return toResponse(applicationRepository.save(application), application.getStudent());
    }

    public Application findApplication(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
    }

    private ApplicationResponse toResponse(Application application, StudentProfile profile) {
        MatchResponse match = matchingService.match(profile, application.getOpportunity());
        Opportunity opportunity = application.getOpportunity();
        return new ApplicationResponse(
                application.getId(),
                opportunity.getId(),
                opportunity.getTitle(),
                opportunity.getCompanyName(),
                opportunity.getType(),
                application.getStatus(),
                application.getCoverLetter(),
                application.getAppliedAt(),
                application.getUpdatedAt(),
                match.getMatchScore(),
                match.getMatchedSkills(),
                match.getMissingSkills()
        );
    }
}