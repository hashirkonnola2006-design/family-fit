package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Persisted refresh token for revocable JWT refresh flow.
 * Access tokens are short-lived (15 min); refresh tokens live 7 days.
 */
@Entity
@Table(name = "refresh_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false, unique = true)
    private Family family;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    public boolean isExpired() {
        return Instant.now().isAfter(expiryDate);
    }
}
