package com.general_auth.application.dto.request;

import com.general_auth.application.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationStatusRequest {

    @NotNull(message = "status is required")
    private ApplicationStatus status;
}