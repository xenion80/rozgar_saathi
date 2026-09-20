package com.general_auth.student.repository;

import com.general_auth.student.entity.StudentEducation;
import com.general_auth.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentEducationRepository extends JpaRepository<StudentEducation, Long> {
    Optional<StudentEducation> findByStudentProfile(StudentProfile studentProfile);
}
