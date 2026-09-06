package com.general_auth.assessment.repository;

import com.general_auth.assessment.entity.Assessment;
import com.general_auth.assessment.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
    List<AssessmentQuestion> findByAssessment(Assessment assessment);

    List<AssessmentQuestion> findByAssessmentId(Long assessmentId);
}