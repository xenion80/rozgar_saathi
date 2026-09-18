package com.general_auth.auth.services;

import com.general_auth.auth.dto.Request.LoginRequest;
import com.general_auth.auth.dto.Response.LoginResponse;
import com.general_auth.auth.entity.RefreshToken;
import com.general_auth.auth.repository.RefreshTokenRepository;
import com.general_auth.common.exception.InvalidTokenException;
import com.general_auth.common.exception.TokenNotFoundException;
import com.general_auth.common.exception.TokenRevokedException;
import com.general_auth.user.entity.User;
import com.general_auth.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtAuthService jwtAuthService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public LoginResponse login(@Valid LoginRequest loginRequest) {
        Authentication authentication= manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),loginRequest.getPassword()
                )
        );
        User user=(User) authentication.getPrincipal();
        String refreshToken= jwtAuthService.generateRefreshToken(user);
        String accessToken= jwtAuthService.generateAccessToken(user);
        RefreshToken token=RefreshToken.builder()
                .token(refreshToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(90))
                .revoked(false)
                .user(user)
                .build();
        refreshTokenRepository.save(token);
        return new LoginResponse(user.getId(),user.getName(),user.getEmail(), user.getRole(),refreshToken,accessToken);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        if(refreshToken!=null){
            RefreshToken token=refreshTokenRepository.findByToken(refreshToken).orElse(null);
            if(token!=null){
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            }
        }
        Cookie cookie=new Cookie("refreshToken","");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    public LoginResponse refresh(String token) {
        RefreshToken refreshToken=refreshTokenRepository.findByToken(token).orElseThrow(()->new TokenNotFoundException("RefreshToken not found"));
        if(refreshToken.getRevoked())throw new TokenRevokedException("Refresh token has been revoked");
        if (!jwtAuthService.isTokenValid(token))throw new InvalidTokenException("the token is not valid");
        Long userId= jwtAuthService.extractUserId(token);
        User user =userRepository.findById(userId).orElseThrow(()->new UsernameNotFoundException("Username with this Id not found"));
        String accessToken= jwtAuthService.generateAccessToken(user);
        return new LoginResponse(user.getId(),user.getName(),user.getEmail(),user.getRole(),token,accessToken);

    }
    @Transactional
    public void changePassword(
            Authentication authentication,
            String currentPassword,
            String newPassword
    ) {
        User user = (User) authentication.getPrincipal();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Invalidate all existing refresh tokens
        refreshTokenRepository.revokeAllByUser(user);
    }


}
