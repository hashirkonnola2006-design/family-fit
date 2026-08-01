package com.familyfit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * Abstract base entity for all family members.
 * Uses SINGLE_TABLE inheritance with a 'dtype' discriminator column.
 * Concrete subclasses: {@link Parent}, {@link Child}.
 */
@Entity
@Table(name = "family_members")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Min(0)
    @Max(120)
    @Column(nullable = false)
    private int age;

    /** Height in centimetres */
    @Min(30)
    @Max(300)
    private double heightCm;

    /** Weight in kilograms */
    @Min(1)
    @Max(500)
    private double weightKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Gender gender = Gender.OTHER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ActivityLevel activityLevel = ActivityLevel.MODERATELY_ACTIVE;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_allergies", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "allergy")
    @Builder.Default
    private List<String> allergies = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_health_conditions", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "condition_name")
    @Builder.Default
    private List<String> healthConditions = new ArrayList<>();

    private Boolean isPregnantOrBreastfeeding;
    private Boolean hasChewingDifficulty;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_dietary_flags", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "flag")
    @Builder.Default
    private List<String> dietaryFlags = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DietPreference dietPreference = DietPreference.NO_PREFERENCE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FitnessGoal fitnessGoal = FitnessGoal.MAINTAIN_WEIGHT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    // ─── Derived method ───────────────────────────────────────────────────

    /**
     * Calculates Body Mass Index: weight(kg) / height(m)^2
     */
    public double calculateBmi() {
        if (heightCm <= 0) return 0;
        double heightM = heightCm / 100.0;
        return Math.round((weightKg / (heightM * heightM)) * 10.0) / 10.0;
    }

    // ─── Enums ────────────────────────────────────────────────────────────

    public enum Role {
        PARENT, CHILD
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum ActivityLevel {
        SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE
    }

    public enum DietPreference {
        VEGETARIAN, NON_VEGETARIAN, VEGAN, EGGETARIAN, NO_PREFERENCE
    }

    public enum FitnessGoal {
        WEIGHT_LOSS, WEIGHT_GAIN, MUSCLE_GAIN, MAINTAIN_WEIGHT, MANAGE_CONDITION
    }
}
