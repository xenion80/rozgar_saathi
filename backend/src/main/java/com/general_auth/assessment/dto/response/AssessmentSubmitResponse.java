package com.general_auth.assessment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentSubmitResponse {
    private Long assessmentId;
    private String status;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private List<SkillScoreResponse> skillScores;
    private List<QuestionResultResponse> questionResults;
}