package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * An individual meal entry belonging to a {@link MealPlan}.
 * Stores full macronutrient details and meal timing type.
 */
@Entity
@Table(name = "meals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id", nullable = false)
    private MealPlan mealPlan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType type;

    @Column(nullable = false)
    private String name;

    private int kcal;
    private double proteinG;
    private double carbsG;
    private double fatG;
    private int prepTimeMinutes;
    private String imageUrl;

    // ─── Meal type enum ───────────────────────────────────────────────────
    public enum MealType {
        BREAKFAST, LUNCH, DINNER, SNACK
    }
}
