package com.familyfit.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberDTO {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @Min(0) @Max(120)
    private int age;

    @Min(1) @Max(300)
    private double heightCm;

    @Min(1) @Max(500)
    private double weightKg;

    private String role;  // PARENT | CHILD
    private String gender; // MALE | FEMALE | OTHER
    private String activityLevel; // SEDENTARY | LIGHTLY_ACTIVE | MODERATELY_ACTIVE | VERY_ACTIVE
    private List<String> allergies;
    private List<String> healthConditions;
    private Boolean isPregnantOrBreastfeeding;
    private Boolean hasChewingDifficulty;
    private List<String> dietaryFlags;
    private String dietPreference; // VEGETARIAN | NON_VEGETARIAN | VEGAN | EGGETARIAN | NO_PREFERENCE
    private String fitnessGoal; // WEIGHT_LOSS | WEIGHT_GAIN | MUSCLE_GAIN | MAINTAIN_WEIGHT | MANAGE_CONDITION

    // Derived — populated from entity methods, not stored separately
    private Double bmi;
    private Integer kcalGoal;
}
