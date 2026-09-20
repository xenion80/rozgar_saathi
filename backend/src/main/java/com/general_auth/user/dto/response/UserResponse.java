package com.general_auth.user.dto.response;

import com.general_auth.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private Role role;
    private Boolean enabled;
    private String createdAt;
}
