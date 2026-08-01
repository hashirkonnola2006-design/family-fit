package com.familyfit.service;

import com.familyfit.dto.MemberSuitabilityDTO;
import com.familyfit.entity.FamilyMember;
import com.familyfit.entity.Recipe;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecipeSuitabilityService {

    public List<MemberSuitabilityDTO> explainSuitability(Recipe recipe, List<FamilyMember> members) {
        List<MemberSuitabilityDTO> results = new ArrayList<>();
        if (members == null || members.isEmpty()) {
            return results;
        }

        List<String> recipeAllergens = recipe.getContainsAllergens() != null ? recipe.getContainsAllergens() : new ArrayList<>();
        List<String> healthTags = recipe.getHealthTags() != null ? recipe.getHealthTags() : new ArrayList<>();

        for (FamilyMember member : members) {
            String conflictingAllergen = findConflictingAllergen(member.getAllergies(), recipeAllergens, recipe.getIngredients());

            if (conflictingAllergen != null) {
                results.add(MemberSuitabilityDTO.builder()
                        .memberId(member.getId())
                        .memberName(member.getName())
                        .memberRole(member.getRole() != null ? member.getRole().name() : "PARENT")
                        .suitable(false)
                        .reason("Not recommended for " + member.getName() + " — contains " + conflictingAllergen.toLowerCase())
                        .build());
                continue;
            }

            // Check health condition & goal alignment
            String positiveReason = buildPositiveReason(member, recipe, healthTags);

            results.add(MemberSuitabilityDTO.builder()
                    .memberId(member.getId())
                    .memberName(member.getName())
                    .memberRole(member.getRole() != null ? member.getRole().name() : "PARENT")
                    .suitable(true)
                    .reason(positiveReason)
                    .build());
        }

        return results;
    }

    private String findConflictingAllergen(List<String> memberAllergies, List<String> recipeAllergens, List<com.familyfit.entity.Ingredient> ingredients) {
        if (memberAllergies == null || memberAllergies.isEmpty()) {
            return null;
        }

        for (String allergy : memberAllergies) {
            if ("None".equalsIgnoreCase(allergy)) continue;

            // Direct check against recipeAllergens
            for (String recipeAllergen : recipeAllergens) {
                if (allergy.equalsIgnoreCase(recipeAllergen) || recipeAllergen.toLowerCase().contains(allergy.toLowerCase())) {
                    return allergy;
                }
            }

            // Check against ingredients list text
            if (ingredients != null) {
                for (com.familyfit.entity.Ingredient ing : ingredients) {
                    if (ing.getName() != null && ing.getName().toLowerCase().contains(allergy.toLowerCase())) {
                        return allergy;
                    }
                }
            }
        }
        return null;
    }

    private String buildPositiveReason(FamilyMember member, Recipe recipe, List<String> healthTags) {
        List<String> conditions = member.getHealthConditions() != null ? member.getHealthConditions() : new ArrayList<>();
        String goal = member.getFitnessGoal() != null ? member.getFitnessGoal().name() : "";

        if (conditions.contains("Diabetes") && healthTags.stream().anyMatch(t -> t.equalsIgnoreCase("low-gi") || t.equalsIgnoreCase("diabetic-friendly"))) {
            return "Good for " + member.getName() + " — low-GI and diabetes friendly";
        }
        if (conditions.contains("High Blood Pressure") && healthTags.stream().anyMatch(t -> t.equalsIgnoreCase("low-sodium"))) {
            return "Good for " + member.getName() + " — low-sodium for blood pressure management";
        }
        if (conditions.contains("High Cholesterol") && healthTags.stream().anyMatch(t -> t.equalsIgnoreCase("heart-healthy") || t.equalsIgnoreCase("low-fat"))) {
            return "Good for " + member.getName() + " — heart-healthy and low saturated fat";
        }

        if ("MUSCLE_GAIN".equalsIgnoreCase(goal) && (recipe.getProteinG() >= 25 || healthTags.stream().anyMatch(t -> t.equalsIgnoreCase("high-protein")))) {
            return "Great for " + member.getName() + " — high protein for muscle gain";
        }
        if ("WEIGHT_LOSS".equalsIgnoreCase(goal) && (recipe.getKcal() <= 450 || healthTags.stream().anyMatch(t -> t.equalsIgnoreCase("weight-loss") || t.equalsIgnoreCase("low-calorie")))) {
            return "Great for " + member.getName() + " — low calorie for weight loss goals";
        }

        if (member.getAge() <= 12 && healthTags.stream().anyMatch(t -> t.equalsIgnoreCase("kid-friendly") || t.equalsIgnoreCase("child-growth"))) {
            return "Great for " + member.getName() + " — kid friendly and growth nutrient rich";
        }

        if (member.getAge() <= 3) {
            return "Suitable for " + member.getName() + " — easy to digest for toddlers";
        }

        return "Suitable for " + member.getName() + " — balanced family nutrition";
    }
}
