package com.general_auth.assessment.repository;

import com.general_auth.assessment.entity.Assessment;
import com.general_auth.assessment.entity.AssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Long> {
    List<AssessmentAnswer> findByAssessment(Assessment assessment);

    boolean existsByAssessment(Assessment assessment);
}