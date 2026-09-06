package com.general_auth.application.repository;

import com.general_auth.application.entity.Application;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentOrderByAppliedAtDesc(StudentProfile student);

    List<Application> findByStudentIdOrderByAppliedAtDesc(Long studentId);

    List<Application> findByOpportunityIdOrderByAppliedAtDesc(Long opportunityId);

    Optional<Application> findByStudentAndOpportunity(StudentProfile student, Opportunity opportunity);

    boolean existsByStudentAndOpportunity(StudentProfile student, Opportunity opportunity);
}