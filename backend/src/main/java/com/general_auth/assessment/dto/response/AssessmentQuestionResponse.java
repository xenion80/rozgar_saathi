package com.general_auth.assessment.dto.response;

import com.general_auth.assessment.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentQuestionResponse {
    private Long id;
    private String questionText;
    private QuestionType questionType;
    private String targetSkill;
    private List<String> options;
    private Integer weight;
}