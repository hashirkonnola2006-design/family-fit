package com.familyfit.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Stateless JWT utility for generating and validating access tokens.
 * Refresh token string generation is delegated to {@link com.familyfit.service.impl.AuthServiceImpl}.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiry-ms}")
    private long accessTokenExpiryMs;

    // ─── Token generation ─────────────────────────────────────────────────

    public String generateAccessToken(String email, Long familyId) {
        return Jwts.builder()
                .subject(email)
                .claim("familyId", familyId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiryMs))
                .signWith(getSigningKey())
                .compact();
    }

    // ─── Token parsing ────────────────────────────────────────────────────

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public Long extractFamilyId(String token) {
        return parseClaims(token).get("familyId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ─── Internals ────────────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
