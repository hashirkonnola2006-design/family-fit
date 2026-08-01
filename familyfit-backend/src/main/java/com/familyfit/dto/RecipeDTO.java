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
public class RecipeDTO {
    private Long id;
    private String name;
    private String description;
    private int kcal;
    private double proteinG;
    private double carbsG;
    private double fatG;
    private int prepTimeMinutes;
    private String imageUrl;
    private List<String> tags;
    private List<IngredientDTO> ingredients;
    private List<String> steps;
    private boolean favorited;
}
