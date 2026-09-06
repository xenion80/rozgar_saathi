package com.general_auth.assessment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentResponse {
    private Long id;
    private String title;
    private String status;
    private List<AssessmentQuestionResponse> questions;
}