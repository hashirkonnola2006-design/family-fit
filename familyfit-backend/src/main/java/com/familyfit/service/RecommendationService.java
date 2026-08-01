package com.familyfit.service;

import com.familyfit.dto.IngredientDTO;
import com.familyfit.dto.MemberSuitabilityDTO;
import com.familyfit.dto.RecipeDetailDTO;
import com.familyfit.entity.Family;
import com.familyfit.entity.FamilyMember;
import com.familyfit.entity.Recipe;
import com.familyfit.repository.FamilyRepository;
import com.familyfit.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecipeRepository recipeRepository;
    private final FamilyRepository familyRepository;
    private final RecipeSuitabilityService suitabilityService;

    @Transactional(readOnly = true)
    public List<RecipeDetailDTO> getRecommendedRecipes(Long familyId) {
        List<Recipe> allRecipes = recipeRepository.findAll();
        Family family = familyRepository.findById(familyId).orElse(null);
        List<FamilyMember> members = family != null ? family.getMembers() : new ArrayList<>();

        List<ScoredRecipe> scoredList = new ArrayList<>();

        for (Recipe recipe : allRecipes) {
            List<MemberSuitabilityDTO> suitabilities = suitabilityService.explainSuitability(recipe, members);
            boolean hasAllergyConflict = suitabilities.stream().anyMatch(s -> !s.isSuitable());

            // Calculate matching score
            int score = 0;
            if (!hasAllergyConflict) {
                score += 10; // Base score for zero allergy conflict
            }

            for (MemberSuitabilityDTO s : suitabilities) {
                if (s.isSuitable()) {
                    score += 3;
                    if (s.getReason().contains("Great for") || s.getReason().contains("Good for")) {
                        score += 2;
                    }
                } else {
                    score -= 15; // Heavy penalty for allergen conflict
                }
            }

            scoredList.add(new ScoredRecipe(recipe, suitabilities, score, hasAllergyConflict));
        }

        // Sort descending by score, prioritizing allergy-safe recipes first
        scoredList.sort((a, b) -> Integer.compare(b.score, a.score));

        return scoredList.stream()
                .map(sr -> mapToDetailDTO(sr.recipe, sr.suitabilities))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecipeDetailDTO getRecipeDetail(Long recipeId, Long familyId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + recipeId));

        List<FamilyMember> members = new ArrayList<>();
        if (familyId != null) {
            Family family = familyRepository.findById(familyId).orElse(null);
            if (family != null) {
                members = family.getMembers();
            }
        }

        List<MemberSuitabilityDTO> suitabilities = suitabilityService.explainSuitability(recipe, members);
        return mapToDetailDTO(recipe, suitabilities);
    }

    private RecipeDetailDTO mapToDetailDTO(Recipe recipe, List<MemberSuitabilityDTO> suitabilities) {
        List<String> suitableNames = suitabilities.stream()
                .filter(MemberSuitabilityDTO::isSuitable)
                .map(MemberSuitabilityDTO::getMemberName)
                .collect(Collectors.toList());

        boolean fullySuitable = suitabilities.stream().allMatch(MemberSuitabilityDTO::isSuitable);

        String matchBadgeText;
        if (fullySuitable && !suitableNames.isEmpty()) {
            matchBadgeText = "100% Family Match";
        } else if (!suitableNames.isEmpty()) {
            matchBadgeText = "Great for " + String.join(" & ", suitableNames);
        } else {
            matchBadgeText = "General Recipe";
        }

        List<IngredientDTO> ingredientDTOs = recipe.getIngredients() != null
                ? recipe.getIngredients().stream()
                .map(i -> new IngredientDTO(i.getId(), i.getName(), i.getQuantity(), i.getUnit()))
                .collect(Collectors.toList())
                : new ArrayList<>();

        return RecipeDetailDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .kcal(recipe.getKcal())
                .proteinG(recipe.getProteinG())
                .carbsG(recipe.getCarbsG())
                .fatG(recipe.getFatG())
                .prepTimeMinutes(recipe.getPrepTimeMinutes())
                .imageUrl(recipe.getImageUrl())
                .whyItsGood(recipe.getWhyItsGood() != null ? recipe.getWhyItsGood() : buildDefaultWhyItsGood(recipe))
                .tags(recipe.getTags())
                .containsAllergens(recipe.getContainsAllergens())
                .healthTags(recipe.getHealthTags())
                .ingredients(ingredientDTOs)
                .steps(recipe.getSteps())
                .favorited(recipe.isFavorited())
                .suitabilityByMember(suitabilities)
                .suitableMemberNames(suitableNames)
                .fullySuitableForFamily(fullySuitable)
                .matchBadgeText(matchBadgeText)
                .build();
    }

    private String buildDefaultWhyItsGood(Recipe recipe) {
        return "This balanced meal provides essential macronutrients with " + recipe.getProteinG() + "g protein and " + recipe.getKcal() + " kcal to support steady family energy levels.";
    }

    private static class ScoredRecipe {
        Recipe recipe;
        List<MemberSuitabilityDTO> suitabilities;
        int score;
        boolean hasAllergyConflict;

        ScoredRecipe(Recipe recipe, List<MemberSuitabilityDTO> suitabilities, int score, boolean hasAllergyConflict) {
            this.recipe = recipe;
            this.suitabilities = suitabilities;
            this.score = score;
            this.hasAllergyConflict = hasAllergyConflict;
        }
    }
}
