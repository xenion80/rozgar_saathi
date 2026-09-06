package com.general_auth.student.service;

import com.general_auth.common.exception.ResourceNotFoundException;
import com.general_auth.student.dto.request.StudentProfileRequest;
import com.general_auth.student.dto.response.StudentProfileResponse;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.repository.StudentProfileRepository;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;

    /** Returns the profile of the current user, throwing if the user is not a student. */
    @Transactional(readOnly = true)
    public StudentProfile getProfile(User user) {
        return studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found. Create it with PUT /api/students/me"));
    }

    /** Returns the existing profile or creates an empty one on the fly (used by skills/assessment/application flows). */
    @Transactional
    public StudentProfile getOrCreateProfile(User user) {
        return studentProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile profile = new StudentProfile();
                    profile.setUser(user);
                    return studentProfileRepository.save(profile);
                });
    }

    @Transactional
    public StudentProfileResponse updateProfile(User user, StudentProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    return p;
                });

        if (request.getCollegeName() != null) profile.setCollegeName(request.getCollegeName());
        if (request.getDegree() != null) profile.setDegree(request.getDegree());
        if (request.getBranch() != null) profile.setBranch(request.getBranch());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getTargetRole() != null) profile.setTargetRole(request.getTargetRole());

        return toResponse(studentProfileRepository.save(profile));
    }

    public StudentProfileResponse toResponse(StudentProfile profile) {
        User user = profile.getUser();
        return new StudentProfileResponse(
                profile.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                profile.getCollegeName(),
                profile.getDegree(),
                profile.getBranch(),
                profile.getGraduationYear(),
                profile.getBio(),
                profile.getTargetRole(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}