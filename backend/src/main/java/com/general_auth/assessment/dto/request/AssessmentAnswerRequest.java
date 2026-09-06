package com.general_auth.assessment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentAnswerRequest {

    @NotNull(message = "questionId is required")
    private Long questionId;

    private String answer;
}