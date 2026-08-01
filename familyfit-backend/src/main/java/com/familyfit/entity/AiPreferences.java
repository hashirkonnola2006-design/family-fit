package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long familyId;

    @Builder.Default
    private boolean smartInsightsEnabled = true;

    @Builder.Default
    private boolean aiRecipeRecommendationsEnabled = true;
}
