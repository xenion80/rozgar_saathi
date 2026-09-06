package com.general_auth.auth.repository;

import com.general_auth.auth.entity.ForgotPasswordResetToken;
import com.general_auth.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForgotPasswordResetTokenRepository extends JpaRepository<ForgotPasswordResetToken, Long> {
    Optional<ForgotPasswordResetToken> findByToken(String token);


    void deleteByUser(User user);
}