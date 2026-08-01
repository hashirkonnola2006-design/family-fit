package com.familyfit.service.impl;

import com.familyfit.dto.*;
import com.familyfit.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Central mapper converting JPA entities to DTOs.
 * Keeps controllers and services free of mapping boilerplate.
 */
@Component
public class EntityMapper {

    // ─── Family ──────────────────────────────────────────────────────────

    public FamilyDTO toFamilyDTO(Family family) {
        return FamilyDTO.builder()
                .id(family.getId())
                .name(family.getName())
                .email(family.getEmail())
                .plan(family.getPlan().name())
                .members(family.getMembers().stream().map(this::toMemberDTO).collect(Collectors.toList()))
                .build();
    }

    // ─── FamilyMember ────────────────────────────────────────────────────

    public FamilyMemberDTO toMemberDTO(FamilyMember m) {
        return FamilyMemberDTO.builder()
                .id(m.getId())
                .name(m.getName())
                .age(m.getAge())
                .heightCm(m.getHeightCm())
                .weightKg(m.getWeightKg())
                .role(m.getRole().name())
                .gender(m.getGender() != null ? m.getGender().name() : FamilyMember.Gender.OTHER.name())
                .activityLevel(m.getActivityLevel() != null ? m.getActivityLevel().name() : FamilyMember.ActivityLevel.MODERATELY_ACTIVE.name())
                .allergies(m.getAllergies())
                .healthConditions(m.getHealthConditions())
                .isPregnantOrBreastfeeding(m.getIsPregnantOrBreastfeeding())
                .hasChewingDifficulty(m.getHasChewingDifficulty())
                .dietaryFlags(m.getDietaryFlags())
                .dietPreference(m.getDietPreference() != null ? m.getDietPreference().name() : FamilyMember.DietPreference.NO_PREFERENCE.name())
                .fitnessGoal(m.getFitnessGoal() != null ? m.getFitnessGoal().name() : FamilyMember.FitnessGoal.MAINTAIN_WEIGHT.name())
                .bmi(m.calculateBmi())
                .build();
    }

    // ─── MealPlan ────────────────────────────────────────────────────────

    public MealPlanDTO toMealPlanDTO(MealPlan plan) {
        List<MealDTO> meals = plan.getMeals() == null ? List.of() :
                plan.getMeals().stream().map(this::toMealDTO).collect(Collectors.toList());
        return MealPlanDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .targetGroup(plan.getTargetGroup())
                .tags(plan.getTags())
                .imageUrl(plan.getImageUrl())
                .meals(meals)
                .build();
    }

    public MealDTO toMealDTO(Meal meal) {
        return MealDTO.builder()
                .id(meal.getId())
                .type(meal.getType().name())
                .name(meal.getName())
                .kcal(meal.getKcal())
                .proteinG(meal.getProteinG())
                .carbsG(meal.getCarbsG())
                .fatG(meal.getFatG())
                .prepTimeMinutes(meal.getPrepTimeMinutes())
                .imageUrl(meal.getImageUrl())
                .build();
    }

    // ─── Recipe ──────────────────────────────────────────────────────────

    public RecipeDTO toRecipeDTO(Recipe recipe) {
        List<IngredientDTO> ingredients = recipe.getIngredients() == null ? List.of() :
                recipe.getIngredients().stream().map(this::toIngredientDTO).collect(Collectors.toList());
        return RecipeDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .kcal(recipe.getKcal())
                .proteinG(recipe.getProteinG())
                .carbsG(recipe.getCarbsG())
                .fatG(recipe.getFatG())
                .prepTimeMinutes(recipe.getPrepTimeMinutes())
                .imageUrl(recipe.getImageUrl())
                .tags(recipe.getTags())
                .ingredients(ingredients)
                .steps(recipe.getSteps())
                .favorited(recipe.isFavorited())
                .build();
    }

    public IngredientDTO toIngredientDTO(Ingredient i) {
        return IngredientDTO.builder()
                .id(i.getId())
                .name(i.getName())
                .quantity(i.getQuantity())
                .unit(i.getUnit())
                .build();
    }

    // ─── DailyLog ────────────────────────────────────────────────────────

    public DailyLogDTO toDailyLogDTO(DailyLog log) {
        MacrosDTO macrosDTO = log.getMacros() == null ? new MacrosDTO() :
                MacrosDTO.builder()
                        .proteinG(log.getMacros().getProteinG())
                        .carbsG(log.getMacros().getCarbsG())
                        .fatG(log.getMacros().getFatG())
                        .proteinPercent(log.getMacros().proteinPercent())
                        .carbsPercent(log.getMacros().carbsPercent())
                        .fatPercent(log.getMacros().fatPercent())
                        .build();
        List<MealDTO> meals = log.getMealsEaten() == null ? List.of() :
                log.getMealsEaten().stream().map(this::toMealDTO).collect(Collectors.toList());
        return DailyLogDTO.builder()
                .id(log.getId())
                .memberId(log.getFamilyMember().getId())
                .date(log.getDate())
                .mealsEaten(meals)
                .kcalConsumed(log.getKcalConsumed())
                .kcalGoal(log.getKcalGoal())
                .macros(macrosDTO)
                .waterIntakeL(log.getWaterIntakeL())
                .build();
    }

    // ─── HealthScore ─────────────────────────────────────────────────────

    public HealthScoreDTO toHealthScoreDTO(HealthScore hs) {
        return HealthScoreDTO.builder()
                .id(hs.getId())
                .memberId(hs.getFamilyMember().getId())
                .date(hs.getDate())
                .score(hs.getScore())
                .insightText(hs.getInsightText())
                .build();
    }

    // ─── Notification ────────────────────────────────────────────────────

    public NotificationDTO toNotificationDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
