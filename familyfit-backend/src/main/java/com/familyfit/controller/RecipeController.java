package com.familyfit.controller;

import com.familyfit.dto.RecipeDTO;
import com.familyfit.dto.RecipeDetailDTO;
import com.familyfit.service.RecommendationService;
import com.familyfit.service.impl.RecipeServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeServiceImpl recipeService;
    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(recipeService.getAllRecipes(search, tag));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<RecipeDetailDTO>> getRecommendedRecipes(
            @RequestParam(defaultValue = "1") Long familyId) {
        return ResponseEntity.ok(recommendationService.getRecommendedRecipes(familyId));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<RecipeDetailDTO> getRecipeDetail(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long familyId) {
        return ResponseEntity.ok(recommendationService.getRecipeDetail(id, familyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<RecipeDTO> toggleFavorite(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.toggleFavorite(id));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<RecipeDTO>> getFavorites() {
        return ResponseEntity.ok(recipeService.getFavorites());
    }
}
