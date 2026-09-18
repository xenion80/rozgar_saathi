package com.general_auth.auth.controller;

import com.general_auth.auth.dto.Request.ChangePasswordRequest;
import com.general_auth.auth.dto.Request.LoginRequest;
import com.general_auth.auth.dto.Response.LoginResponse;
import com.general_auth.auth.services.AuthService;
import com.general_auth.common.response.ApiResponse;
import com.general_auth.user.dto.request.SignUpInputModel;
import com.general_auth.user.dto.response.UserResponse;
import com.general_auth.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> signUp(@Valid @RequestBody SignUpInputModel signUpInputModel){
        UserResponse response=userService.signUp(signUpInputModel);
        return ResponseEntity.ok(
                ApiResponse.success("User Register successfully",response)

        );

    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response){
        LoginResponse loginResponse=authService.login(loginRequest);
        Cookie cookie=new Cookie("refreshToken",loginResponse.getRefreshToken());
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
        return ResponseEntity.ok(ApiResponse.success("Logged in successfully",loginResponse));

    }
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request,HttpServletResponse response){
        authService.logout(request,response);
        return ResponseEntity.ok(
                ApiResponse.success("Logged out Successfully",null)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(HttpServletRequest request){
        String token= Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(()->new AuthenticationServiceException("Refreshtoken is not found in the request"));
        LoginResponse response=authService.refresh(token);
        return ResponseEntity.ok(
                ApiResponse.success("Refreshed accessed token successfully",response)
        );
    }
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(
                authentication,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Password changed successfully", null)
        );
    }

}
