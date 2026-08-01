package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long familyId;

    private String email;

    @Column(nullable = false)
    private String subject;

    @Column(length = 2000, nullable = false)
    private String message;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
