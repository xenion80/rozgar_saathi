package com.general_auth.assessment.repository;

import com.general_auth.assessment.entity.Assessment;
import com.general_auth.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    /** Seeded template assessment (not owned by any student). */
    Optional<Assessment> findByIdAndStudentIsNull(Long id);

    Optional<Assessment> findByStudentAndTemplateId(StudentProfile student, Long templateId);

    List<Assessment> findByStudentId(Long studentId);
}