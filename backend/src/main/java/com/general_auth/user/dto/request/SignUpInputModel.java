package com.general_auth.user.dto.request;

import com.general_auth.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpInputModel {
    @NotBlank(message = "name cannot be empty")
    private String name;

    @NotBlank(message = "email cannot be empty")
    @Email(message = "invalid email")
    private String email;

    @NotBlank(message = "password cannot be empty")
    private String password;

    /**
     * Optional role for the SIH prototype. Allowed values: USER, STUDENT, RECRUITER.
     * Defaults to USER when not provided. ADMIN cannot be self-registered.
     */
    private Role role;

}