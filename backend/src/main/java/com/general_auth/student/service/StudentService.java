package com.general_auth.student.service;

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

    /** Returns the profile of the current user, creating one if it doesn't exist yet. */
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
        StudentProfile profile = getOrCreateProfile(user);

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
                profile.getBio(),
                profile.getTargetRole(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}