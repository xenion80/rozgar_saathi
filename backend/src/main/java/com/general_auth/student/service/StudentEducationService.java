package com.general_auth.student.service;

import com.general_auth.student.dto.request.StudentEducationRequest;
import com.general_auth.student.dto.response.StudentEducationResponse;
import com.general_auth.student.entity.StudentEducation;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.repository.StudentEducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentEducationService {

    private final StudentEducationRepository educationRepository;
    private final StudentService studentService;

    /** Returns the education record for this student, or an empty response if none exists yet. */
    @Transactional(readOnly = true)
    public StudentEducationResponse getEducation(com.general_auth.user.entity.User user) {
        StudentProfile profile = studentService.getOrCreateProfile(user);
        return educationRepository.findByStudentProfile(profile)
                .map(this::toResponse)
                .orElse(new StudentEducationResponse());
    }

    /** Creates or fully replaces the education record for this student. */
    @Transactional
    public StudentEducationResponse saveEducation(com.general_auth.user.entity.User user,
                                                  StudentEducationRequest request) {
        StudentProfile profile = studentService.getOrCreateProfile(user);

        StudentEducation edu = educationRepository.findByStudentProfile(profile)
                .orElseGet(() -> {
                    StudentEducation e = new StudentEducation();
                    e.setStudentProfile(profile);
                    return e;
                });

        // Graduation
        edu.setCollegeName(request.getCollegeName());
        edu.setDegree(request.getDegree());
        edu.setBranch(request.getBranch());
        edu.setGraduationYear(request.getGraduationYear());
        edu.setCgpa(request.getCgpa());

        // Class 12
        edu.setTwelfthSchoolName(request.getTwelfthSchoolName());
        edu.setTwelfthBoard(request.getTwelfthBoard());
        edu.setTwelfthMarks(request.getTwelfthMarks());

        // Class 10
        edu.setTenthSchoolName(request.getTenthSchoolName());
        edu.setTenthBoard(request.getTenthBoard());
        edu.setTenthMarks(request.getTenthMarks());

        return toResponse(educationRepository.save(edu));
    }

    public StudentEducationResponse toResponse(StudentEducation edu) {
        return new StudentEducationResponse(
                edu.getId(),
                edu.getCollegeName(),
                edu.getDegree(),
                edu.getBranch(),
                edu.getGraduationYear(),
                edu.getCgpa(),
                edu.getTwelfthSchoolName(),
                edu.getTwelfthBoard(),
                edu.getTwelfthMarks(),
                edu.getTenthSchoolName(),
                edu.getTenthBoard(),
                edu.getTenthMarks(),
                edu.getCreatedAt(),
                edu.getUpdatedAt()
        );
    }
}
