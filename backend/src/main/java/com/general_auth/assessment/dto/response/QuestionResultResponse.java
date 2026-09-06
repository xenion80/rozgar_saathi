package com.general_auth.assessment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResultResponse {
    private Long questionId;
    private String skill;
    private boolean correct;
    private Integer score;
    private Integer maxScore;
}