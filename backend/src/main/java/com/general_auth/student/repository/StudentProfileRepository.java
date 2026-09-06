package com.general_auth.student.repository;

import com.general_auth.student.entity.StudentProfile;
import com.general_auth.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByUser(User user);

    boolean existsByUserId(Long userId);
}