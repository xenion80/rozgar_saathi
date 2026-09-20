package com.general_auth.student.repository;

import com.general_auth.student.entity.Resume;
import com.general_auth.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByStudentProfile(StudentProfile studentProfile);
    Optional<Resume> findByIdAndStudentProfile(Long id, StudentProfile studentProfile);
}
