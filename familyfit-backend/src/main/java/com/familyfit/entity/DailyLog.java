package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Tracks a family member's daily food intake, hydration, and caloric data.
 * Macronutrients are embedded via {@link Macros}.
 */
@Entity
@Table(name = "daily_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private FamilyMember familyMember;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "log_meals",
        joinColumns = @JoinColumn(name = "log_id"),
        inverseJoinColumns = @JoinColumn(name = "meal_id")
    )
    @Builder.Default
    private List<Meal> mealsEaten = new ArrayList<>();

    private int kcalConsumed;
    private int kcalGoal;

    @Embedded
    @Builder.Default
    private Macros macros = new Macros();

    /** Water consumed in litres */
    private double waterIntakeL;
}
