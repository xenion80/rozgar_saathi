package com.general_auth.assessment.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentSubmitRequest {

    @Valid
    @NotEmpty(message = "answers cannot be empty")
    private List<AssessmentAnswerRequest> answers;
}