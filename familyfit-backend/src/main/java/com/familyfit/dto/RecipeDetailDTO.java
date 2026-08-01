package com.familyfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDetailDTO {
    private Long id;
    private String name;
    private String description;
    private int kcal;
    private double proteinG;
    private double carbsG;
    private double fatG;
    private int prepTimeMinutes;
    private String imageUrl;
    private String whyItsGood;
    private List<String> tags;
    private List<String> containsAllergens;
    private List<String> healthTags;
    private List<IngredientDTO> ingredients;
    private List<String> steps;
    private boolean favorited;
    private List<MemberSuitabilityDTO> suitabilityByMember;
    private List<String> suitableMemberNames;
    private boolean fullySuitableForFamily;
    private String matchBadgeText;
}
