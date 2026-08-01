package com.familyfit.service.impl;

import com.familyfit.dto.*;
import com.familyfit.entity.*;
import com.familyfit.exception.UnauthorizedException;
import com.familyfit.repository.*;
import com.familyfit.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Handles registration, login, token refresh, and logout.
 * Access tokens: 15 min (via {@link JwtUtil})
 * Refresh tokens: 7 days, persisted in {@link RefreshToken} entity
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl {

    private final FamilyRepository familyRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token-expiry-ms}")
    private long refreshTokenExpiryMs;

    // ─── Register ────────────────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request) {
        if (familyRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Family family = Family.builder()
                .name(request.getFamilyName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .plan(Family.Plan.FREE)
                .build();

        family = familyRepository.save(family);
        return buildAuthResponse(family);
    }

    // ─── Login ───────────────────────────────────────────────────────────

    public AuthResponse login(AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Family family = familyRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        return buildAuthResponse(family);
    }

    // ─── Refresh ─────────────────────────────────────────────────────────

    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken stored = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (stored.isExpired()) {
            refreshTokenRepository.delete(stored);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        Family family = stored.getFamily();
        String newAccessToken = jwtUtil.generateAccessToken(family.getEmail(), family.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(stored.getToken())
                .tokenType("Bearer")
                .familyId(family.getId())
                .familyName(family.getName())
                .email(family.getEmail())
                .build();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(Family family) {
        String accessToken = jwtUtil.generateAccessToken(family.getEmail(), family.getId());
        String refreshTokenStr = createOrUpdateRefreshToken(family);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .familyId(family.getId())
                .familyName(family.getName())
                .email(family.getEmail())
                .build();
    }

    private String createOrUpdateRefreshToken(Family family) {
        RefreshToken token = refreshTokenRepository.findByFamilyId(family.getId())
                .orElseGet(() -> RefreshToken.builder().family(family).build());

        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenExpiryMs));

        return refreshTokenRepository.save(token).getToken();
    }
}
