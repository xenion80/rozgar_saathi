package com.general_auth.auth.dto.Response;

import com.general_auth.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String refreshToken;
    private String accessToken;
}
