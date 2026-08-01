package com.familyfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealDTO {
    private Long id;
    private String type; // BREAKFAST | LUNCH | DINNER | SNACK
    private String name;
    private int kcal;
    private double proteinG;
    private double carbsG;
    private double fatG;
    private int prepTimeMinutes;
    private String imageUrl;
}
